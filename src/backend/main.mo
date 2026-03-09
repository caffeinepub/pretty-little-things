import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Type
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    imageUrl : Text;
    description : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // OrderItem Type
  type OrderItem = {
    productId : Nat;
    productName : Text;
    price : Nat;
    quantity : Nat;
  };

  // Order Type
  type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Nat;
    timestamp : Int;
    status : Text;
  };

  // User Type
  type User = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  // LoginLog Type
  type LoginLog = {
    id : Nat;
    email : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Stable storage for upgrades
  stable var ordersEntries : [(Nat, Order)] = [];
  stable var loginLogsEntries : [(Nat, LoginLog)] = [];
  stable var stableNextOrderId : Nat = 1;
  stable var stableNextLoginLogId : Nat = 1;

  var products = Map.empty<Nat, Product>();
  var orders = Map.empty<Nat, Order>();
  var users = Map.empty<Nat, User>();
  var usersByEmail = Map.empty<Text, User>();
  var loginLogs = Map.empty<Nat, LoginLog>();
  var userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var nextOrderId = stableNextOrderId;
  var nextUserId = 1;
  var nextLoginLogId = stableNextLoginLogId;

  // Restore from stable storage on init
  for ((id, order) in ordersEntries.vals()) {
    orders.add(id, order);
  };
  for ((id, log) in loginLogsEntries.vals()) {
    loginLogs.add(id, log);
  };

  let adminUsername = "mayoorekatheadmin";
  let adminPassword = "@2006mayoo";

  func hashPassword(password : Text) : Text {
    let blob = password.encodeUtf8();
    let hash = blob.toArray();
    var result = "";
    for (byte in hash.vals()) {
      result #= byte.toNat().toText();
    };
    result;
  };

  public shared ({ caller }) func registerUser(email : Text, password : Text) : async { success : Bool; message : Text; userId : ?Nat } {
    switch (usersByEmail.get(email)) {
      case (?_) {
        return { success = false; message = "Email already registered"; userId = null };
      };
      case null {
        let passwordHash = hashPassword(password);
        let user : User = {
          id = nextUserId;
          email;
          passwordHash;
          createdAt = Int.abs(Time.now());
        };

        users.add(nextUserId, user);
        usersByEmail.add(email, user);

        let userId = nextUserId;
        nextUserId += 1;

        return { success = true; message = "User registered successfully"; userId = ?userId };
      };
    };
  };

  public shared ({ caller }) func loginUser(email : Text, password : Text) : async { success : Bool; message : Text } {
    switch (usersByEmail.get(email)) {
      case (?user) {
        let passwordHash = hashPassword(password);
        if (user.passwordHash == passwordHash) {
          let loginLog : LoginLog = {
            id = nextLoginLogId;
            email;
            timestamp = Int.abs(Time.now());
          };
          loginLogs.add(nextLoginLogId, loginLog);
          nextLoginLogId += 1;

          return { success = true; message = "Login successful" };
        } else {
          return { success = false; message = "Invalid password" };
        };
      };
      case null {
        return { success = false; message = "User not found" };
      };
    };
  };

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async { success : Bool; message : Text } {
    if (username == adminUsername and password == adminPassword) {
      return { success = true; message = "Admin login successful" };
    } else {
      return { success = false; message = "Invalid credentials" };
    };
  };

  public query ({ caller }) func getAllLoginLogs() : async [LoginLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view login logs");
    };
    loginLogs.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, address : Text, items : [OrderItem]) : async Order {
    let timestamp = Int.abs(Time.now());

    let totalAmount = items.values().foldLeft(0, func(acc : Nat, item : OrderItem) : Nat { acc + (item.price * item.quantity) });

    let order : Order = {
      id = nextOrderId;
      customerName;
      phone;
      address;
      items;
      totalAmount;
      timestamp;
      status = "Pending";
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : Text) : async { success : Bool; message : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = { order with status = newStatus };
        orders.add(orderId, updatedOrder);
        { success = true; message = "Order status updated to " # newStatus };
      };
      case (null) { { success = false; message = "Order not found" } };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };
    if (products.size() == 0) {
      let initialProducts : [Product] = [
        { id = 1; name = "Butterfly Bow Snap Clip"; category = "Korean Clips"; price = 100; imageUrl = ""; description = "Sweet pastel pink butterfly bow snap clip" },
        { id = 2; name = "Daisy Flower Hair Clip"; category = "Korean Clips"; price = 100; imageUrl = ""; description = "Pretty lavender daisy alligator clip" },
        { id = 3; name = "Pearl Claw Clip"; category = "Korean Clips"; price = 100; imageUrl = ""; description = "Elegant pearl-studded mint claw clip" },
        { id = 4; name = "Gold Star Drop Earrings"; category = "Korean Earrings"; price = 150; imageUrl = ""; description = "Dainty gold star drop earrings" },
        { id = 5; name = "Pink Heart Stud Earrings"; category = "Korean Earrings"; price = 150; imageUrl = ""; description = "Adorable pastel pink heart stud earrings" },
        { id = 6; name = "Lavender Flower Drop Earrings"; category = "Korean Earrings"; price = 150; imageUrl = ""; description = "Delicate lavender flower drop earrings" },
        { id = 7; name = "Mint Pearl Teardrop Earrings"; category = "Korean Earrings"; price = 150; imageUrl = ""; description = "Dainty mint green pearl teardrop earrings" },
        { id = 8; name = "Gold Heart Pendant Chain"; category = "Seamless Chains"; price = 100; imageUrl = ""; description = "Elegant thin gold heart pendant chain" },
        { id = 9; name = "Silver Star Charm Chain"; category = "Seamless Chains"; price = 100; imageUrl = ""; description = "Stylish thin silver star charm chain" },
        { id = 10; name = "Layered Pearl Gold Chain"; category = "Seamless Chains"; price = 100; imageUrl = ""; description = "Delicate layered pearl and gold chain" },
        { id = 11; name = "Pink Butterfly Charm Chain"; category = "Seamless Chains"; price = 100; imageUrl = ""; description = "Sweet pastel pink butterfly charm chain" },
      ];

      initialProducts.forEach(func(product : Product) { products.add(product.id, product) });
      nextProductId := 12;
    };
  };

  public shared ({ caller }) func addProduct(name : Text, category : Text, price : Nat, imageUrl : Text, description : Text) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      category;
      price;
      imageUrl;
      description;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  // System upgrade hooks
  system func preupgrade() {
    ordersEntries := orders.entries().toArray();
    loginLogsEntries := loginLogs.entries().toArray();
    stableNextOrderId := nextOrderId;
    stableNextLoginLogId := nextLoginLogId;
  };

  system func postupgrade() {
    ordersEntries := [];
    loginLogsEntries := [];
  };
};
