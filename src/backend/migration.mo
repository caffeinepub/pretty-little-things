import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    imageUrl : Text;
    description : Text;
  };

  type OrderItem = {
    productId : Nat;
    productName : Text;
    price : Nat;
    quantity : Nat;
  };

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

  type User = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  type LoginLog = {
    id : Nat;
    email : Text;
    timestamp : Int;
  };

  type Actor = {
    products : Map.Map<Nat, Product>;
    orders : Map.Map<Nat, Order>;
    users : Map.Map<Nat, User>;
    usersByEmail : Map.Map<Text, User>;
    loginLogs : Map.Map<Nat, LoginLog>;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextUserId : Nat;
    nextLoginLogId : Nat;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
