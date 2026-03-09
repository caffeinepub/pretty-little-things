import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

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

  // UserProfile Type
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Databases
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let users = Map.empty<Nat, User>();
  let usersByEmail = Map.empty<Text, User>();
  let loginLogs = Map.empty<Nat, LoginLog>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ID Counters
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextUserId = 1;
  var nextLoginLogId = 1;

  // Admin password (hardcoded as per specification)
  let adminPassword = "admin123";

  // Simple hash function for password (in production, use proper cryptographic hashing)
  func hashPassword(password : Text) : Text {
    let blob = password.encodeUtf8();
    let hash = blob.toArray();
    var result = "";
    for (byte in hash.vals()) {
      result #= Nat8.toNat(byte).toText();
    };
    result;
  };

  // User Registration
  public shared ({ caller }) func registerUser(email : Text, password : Text) : async { success : Bool; message : Text; userId : ?Nat } {
    // Check if email already exists
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
        
        // Assign user role
        AccessControl.assignRole(accessControlState, caller, caller, #user);
        
        return { success = true; message = "User registered successfully"; userId = ?userId };
      };
    };
  };

  // User Login
  public shared ({ caller }) func loginUser(email : Text, password : Text) : async { success : Bool; message : Text } {
    switch (usersByEmail.get(email)) {
      case (?user) {
        let passwordHash = hashPassword(password);
        if (user.passwordHash == passwordHash) {
          // Log the login
          let loginLog : LoginLog = {
            id = nextLoginLogId;
            email;
            timestamp = Int.abs(Time.now());
          };
          loginLogs.add(nextLoginLogId, loginLog);
          nextLoginLogId += 1;
          
          // Assign user role
          AccessControl.assignRole(accessControlState, caller, caller, #user);
          
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

  // Admin Login
  public shared ({ caller }) func adminLogin(password : Text) : async { success : Bool; message : Text } {
    if (password == adminPassword) {
      // Assign admin role
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      return { success = true; message = "Admin login successful" };
    } else {
      return { success = false; message = "Invalid admin password" };
    };
  };

  // Get All Login Logs (Admin Only)
  public query ({ caller }) func getAllLoginLogs() : async [LoginLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view login logs");
    };
    loginLogs.values().toArray();
  };

  // User Profile Management
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

  // Product Management
  public query func getAllProducts() : async [Product] {
    // Public access - no authorization check needed
    products.values().toArray().sort();
  };

  // Place Order (requires at least guest access, which is everyone)
  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, address : Text, items : [OrderItem]) : async Order {
    // Any caller including guests can place orders - no authorization check needed
    let timestamp = Int.abs(Time.now());

    // Calculate total amount
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

  // Get All Orders (Admin Only)
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Seed Products (Admin Only)
  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };
    
    if (products.size() == 0) {
      let initialProducts : [Product] = [
        // Korean Earrings
        { id = 1; name = "Pearl Star Dangles"; category = "Korean Earrings"; price = 150; imageUrl = ""; description = "Elegant pearl star earrings" },
        { id = 2; name = "Lavender Flower Studs"; category = "Korean Earrings"; price = 120; imageUrl = ""; description = "Cute lavender flower earrings" },
        { id = 3; name = "Mint Heart Drops"; category = "Korean Earrings"; price = 180; imageUrl = ""; description = "Stylish mint heart drop earrings" },
        { id = 4; name = "Pink Butterfly Earrings"; category = "Korean Earrings"; price = 200; imageUrl = ""; description = "Charming pink butterfly earrings" },
        // Korean Hair Clips
        { id = 5; name = "Pink Bow Hair Clip"; category = "Korean Hair Clips"; price = 130; imageUrl = ""; description = "Adorable pink bow hair clip" },
        { id = 6; name = "Lavender Daisy Clips"; category = "Korean Hair Clips"; price = 110; imageUrl = ""; description = "Pretty lavender daisy hair clips" },
        { id = 7; name = "Mint Claw Clip"; category = "Korean Hair Clips"; price = 150; imageUrl = ""; description = "Cool mint claw clip" },
        { id = 8; name = "Cream Banana Clip"; category = "Korean Hair Clips"; price = 140; imageUrl = ""; description = "Elegant cream banana hair clip" },
        // Tiny Bags
        { id = 9; name = "Pink Mini Crossbody"; category = "Tiny Bags"; price = 220; imageUrl = ""; description = "Stylish pink mini crossbody bag" },
        { id = 10; name = "Lavender Velvet Pouch"; category = "Tiny Bags"; price = 180; imageUrl = ""; description = "Cute lavender velvet pouch" },
        { id = 11; name = "Mint Bucket Bag"; category = "Tiny Bags"; price = 200; imageUrl = ""; description = "Trendy mint bucket bag" },
        { id = 12; name = "Cream Heart Bag"; category = "Tiny Bags"; price = 240; imageUrl = ""; description = "Charming cream heart-shaped bag" },
        // Seamless Chains
        { id = 13; name = "Gold Heart Chain"; category = "Seamless Chains"; price = 160; imageUrl = ""; description = "Elegant gold heart chain" },
        { id = 14; name = "Silver Star Chain"; category = "Seamless Chains"; price = 140; imageUrl = ""; description = "Stylish silver star chain" },
        { id = 15; name = "Gold Pearl Bracelet"; category = "Seamless Chains"; price = 170; imageUrl = ""; description = "Classy gold pearl bracelet" },
        { id = 16; name = "Layered Chain Set"; category = "Seamless Chains"; price = 250; imageUrl = ""; description = "Trendy layered chain set" },
      ];

      initialProducts.forEach(func(product : Product) { products.add(product.id, product) });
      nextProductId := 17;
    };
  };
};
