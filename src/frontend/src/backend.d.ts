import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: bigint;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface LoginLog {
    id: bigint;
    email: string;
    timestamp: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    totalAmount: bigint;
    address: string;
    timestamp: bigint;
    phone: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogin(password: string): Promise<{
        message: string;
        success: boolean;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllLoginLogs(): Promise<Array<LoginLog>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, password: string): Promise<{
        message: string;
        success: boolean;
    }>;
    placeOrder(customerName: string, phone: string, address: string, items: Array<OrderItem>): Promise<Order>;
    registerUser(email: string, password: string): Promise<{
        userId?: bigint;
        message: string;
        success: boolean;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<void>;
}
