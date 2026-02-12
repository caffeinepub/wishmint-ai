import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export interface UserAuth {
    provider: string;
    lastLoginAt: bigint;
    createdAt: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CreatorEarnings {
    totalRevenue: bigint;
    totalDownloads: bigint;
}
export type TemplateId = bigint;
export type PostId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Subscription {
    status: SubscriptionState;
    premiumUntil?: bigint;
    userId: Principal;
    plan: PlanType;
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
export interface DownloadRecord {
    contentId: bigint;
    contentType: string;
    timestamp: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
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
export interface PaymentRequest {
    id: string;
    utr: string;
    status: PaymentStatus;
    userId: Principal;
    createdAt: bigint;
    plan: PlanType;
    reviewedAt?: bigint;
    email: string;
    amount: bigint;
    screenshot?: ExternalBlob;
}
export interface SubscriptionStatus {
    startedAt: bigint;
    expiresAt?: bigint;
    plan: PlanType;
    updatedAt: bigint;
    state: SubscriptionState;
}
export interface SurprisePayload {
    id: string;
    createdAt: bigint;
    createdBy: Principal;
    message: string;
    recipientName: string;
}
export enum PaymentStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
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
    addScreenshotToPayment(paymentId: string, screenshot: ExternalBlob): Promise<void>;
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
    createOrUpdateUserAuth(provider: string): Promise<void>;
    createPaymentRequest(email: string, plan: PlanType, amount: bigint, utr: string, screenshot: ExternalBlob | null): Promise<string>;
    createSubscription(userId: Principal, plan: PlanType, status: SubscriptionState): Promise<void>;
    createSurpriseLink(recipientName: string, message: string): Promise<string>;
    getAllActiveSubscriptions(): Promise<Array<Subscription>>;
    getAllCommunityPosts(): Promise<Array<CommunityPost>>;
    getAllMarketplaceListings(): Promise<Array<MarketplaceListing>>;
    getAllPaymentRequests(): Promise<Array<PaymentRequest>>;
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
    getPaymentRequest(id: string): Promise<PaymentRequest | null>;
    getSurprisePayload(surpriseId: string): Promise<SurprisePayload | null>;
    getUserAuth(): Promise<UserAuth | null>;
    getUserPaymentRequests(): Promise<Array<PaymentRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSubscriptions(): Promise<Array<Subscription>>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    recordDownload(contentType: string, contentId: bigint): Promise<void>;
    recordListingInteraction(listingId: ListingId): Promise<void>;
    recordMessageGeneration(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveTemplate(templateId: bigint): Promise<void>;
    subscribeToCreator(creator: Principal): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updatePaymentRequestStatus(paymentId: string, newStatus: PaymentStatus): Promise<void>;
    updatePaymentStatus(paymentId: string, newStatus: PaymentStatus): Promise<void>;
    updateSubscriptionStatus(user: Principal, plan: PlanType, state: SubscriptionState, expiresAt: bigint | null): Promise<void>;
}
