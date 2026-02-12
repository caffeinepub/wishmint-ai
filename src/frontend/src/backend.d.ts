import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreatorEarnings {
    totalRevenue: bigint;
    totalDownloads: bigint;
}
export type PostId = bigint;
export type TemplateId = bigint;
export interface DownloadRecord {
    contentId: bigint;
    contentType: string;
    timestamp: bigint;
}
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
export interface SavedTemplate {
    templateId: bigint;
    savedAt: bigint;
}
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
export interface SubscriptionStatus {
    startedAt: bigint;
    expiresAt?: bigint;
    plan: PlanType;
    updatedAt: bigint;
    state: SubscriptionState;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export interface SurprisePayload {
    id: string;
    createdAt: bigint;
    createdBy: Principal;
    message: string;
    recipientName: string;
}
export enum PlanType {
    pro = "pro",
    creator = "creator",
    free = "free"
}
export enum SubscriptionState {
    active = "active",
    canceled = "canceled",
    expired = "expired"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
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
    createSurpriseLink(recipientName: string, message: string): Promise<string>;
    getAllCommunityPosts(): Promise<Array<CommunityPost>>;
    getAllMarketplaceListings(): Promise<Array<MarketplaceListing>>;
    getCallerDownloadHistory(): Promise<Array<DownloadRecord>>;
    getCallerSavedTemplates(): Promise<Array<SavedTemplate>>;
    getCallerSubscriptionStatus(): Promise<SubscriptionStatus>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityPost(id: PostId): Promise<CommunityPost | null>;
    getCreatorEarnings(): Promise<CreatorEarnings>;
    getCreatorListings(creator: Principal): Promise<Array<MarketplaceListing>>;
    getCreatorPosts(creator: Principal): Promise<Array<CommunityPost>>;
    getCreatorSubscribers(creator: Principal): Promise<Array<Principal>>;
    getListingInteractionCount(listingId: ListingId): Promise<bigint>;
    getMarketplaceListing(id: ListingId): Promise<MarketplaceListing | null>;
    getMessageQuotaStatus(): Promise<{
        total: bigint;
        remaining: bigint;
    }>;
    getSurprisePayload(surpriseId: string): Promise<SurprisePayload | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordDownload(contentType: string, contentId: bigint): Promise<void>;
    recordListingInteraction(listingId: ListingId): Promise<void>;
    recordMessageGeneration(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveTemplate(templateId: bigint): Promise<void>;
    subscribeToCreator(creator: Principal): Promise<void>;
    updateSubscriptionStatus(user: Principal, plan: PlanType, state: SubscriptionState, expiresAt: bigint | null): Promise<void>;
}
