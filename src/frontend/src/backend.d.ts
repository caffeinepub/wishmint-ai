import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MarketplaceListing {
    id: ListingId;
    title: string;
    creator: Principal;
    contentType: {
        __kind__: "template";
        template: TemplateId;
    } | {
        __kind__: "sticker";
        sticker: bigint;
    };
    createdAt: bigint;
    description: string;
    price: bigint;
}
export type ListingId = bigint;
export interface BuyerIntent {
    status: Variant_pending_rejected_accepted;
    listingId: ListingId;
    message: string;
    buyer: Principal;
}
export type PostId = bigint;
export type TemplateId = bigint;
export interface CommunityPost {
    id: PostId;
    title: string;
    creator: Principal;
    contentType: {
        __kind__: "template";
        template: TemplateId;
    } | {
        __kind__: "sticker";
        sticker: bigint;
    };
    createdAt: bigint;
    description: string;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_rejected_accepted {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum Variant_rejected_accepted {
    rejected = "rejected",
    accepted = "accepted"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCommunityPost(title: string, description: string, contentType: {
        __kind__: "template";
        template: TemplateId;
    } | {
        __kind__: "sticker";
        sticker: bigint;
    }): Promise<PostId>;
    createMarketplaceListing(title: string, description: string, price: bigint, contentType: {
        __kind__: "template";
        template: TemplateId;
    } | {
        __kind__: "sticker";
        sticker: bigint;
    }): Promise<ListingId>;
    expressInterest(listingId: ListingId, message: string): Promise<void>;
    getAllCommunityPosts(): Promise<Array<CommunityPost>>;
    getAllMarketplaceListings(): Promise<Array<MarketplaceListing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityPost(id: PostId): Promise<CommunityPost | null>;
    getCreatorListings(creator: Principal): Promise<Array<MarketplaceListing>>;
    getCreatorPosts(creator: Principal): Promise<Array<CommunityPost>>;
    getCreatorSubscribers(creator: Principal): Promise<Array<Principal>>;
    getListingIntents(listingId: ListingId): Promise<Array<BuyerIntent>>;
    getMarketplaceListing(id: ListingId): Promise<MarketplaceListing | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribeToCreator(creator: Principal): Promise<void>;
    updateIntentStatus(listingId: ListingId, buyer: Principal, newStatus: Variant_rejected_accepted): Promise<void>;
}
