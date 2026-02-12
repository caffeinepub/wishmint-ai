import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  type UserProfile = {
    name : Text;
    bio : Text;
  };

  type PlanType = {
    #free;
    #pro;
    #creator;
  };

  type SubscriptionState = {
    #active;
    #canceled;
    #expired;
  };

  type SubscriptionStatus = {
    plan : PlanType;
    state : SubscriptionState;
    startedAt : Int;
    expiresAt : ?Int;
    updatedAt : Int;
  };

  type MessageQuota = {
    count : Nat;
    lastResetDate : Text;
  };

  type SurprisePayload = {
    id : Text;
    recipientName : Text;
    message : Text;
    createdBy : Principal;
    createdAt : Int;
  };

  type DownloadRecord = {
    timestamp : Int;
    contentType : Text;
    contentId : Nat;
  };

  type SavedTemplate = {
    templateId : Nat;
    savedAt : Int;
  };

  type TemplateId = Nat;
  type PostId = Nat;
  type ListingId = Nat;

  type CommunityPost = {
    id : PostId;
    creator : Principal;
    title : Text;
    description : Text;
    contentType : { #template : TemplateId; #sticker : Nat };
    createdAt : Int;
  };

  type MarketplaceListing = {
    id : ListingId;
    creator : Principal;
    title : Text;
    description : Text;
    price : Nat;
    contentType : { #template : TemplateId; #sticker : Nat };
    createdAt : Int;
  };

  type ListingInteraction = {
    listingId : ListingId;
    user : Principal;
    timestamp : Int;
  };

  type BuyerIntent = {
    listingId : ListingId;
    buyer : Principal;
    message : Text;
    status : { #pending; #accepted; #rejected };
  };

  type OldActor = {
    nextPostId : Nat;
    nextListingId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    communityPosts : Map.Map<PostId, CommunityPost>;
    marketplaceListings : Map.Map<ListingId, MarketplaceListing>;
    subscriptions : Map.Map<Principal, List.List<Principal>>;
    buyerIntents : Map.Map<ListingId, List.List<BuyerIntent>>;
  };

  type NewActor = {
    nextPostId : Nat;
    nextListingId : Nat;
    nextSurpriseId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    communityPosts : Map.Map<PostId, CommunityPost>;
    marketplaceListings : Map.Map<ListingId, MarketplaceListing>;
    subscriptions : Map.Map<Principal, List.List<Principal>>;
    userSubscriptionStatus : Map.Map<Principal, SubscriptionStatus>;
    messageQuotas : Map.Map<Principal, MessageQuota>;
    surprisePayloads : Map.Map<Text, SurprisePayload>;
    downloadHistory : Map.Map<Principal, List.List<DownloadRecord>>;
    savedTemplates : Map.Map<Principal, List.List<SavedTemplate>>;
    listingInteractions : Map.Map<ListingId, List.List<ListingInteraction>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextPostId = old.nextPostId;
      nextListingId = old.nextListingId;
      nextSurpriseId = 1;
      userProfiles = old.userProfiles;
      communityPosts = old.communityPosts;
      marketplaceListings = old.marketplaceListings;
      subscriptions = old.subscriptions;
      userSubscriptionStatus = Map.empty<Principal, SubscriptionStatus>();
      messageQuotas = Map.empty<Principal, MessageQuota>();
      surprisePayloads = Map.empty<Text, SurprisePayload>();
      downloadHistory = Map.empty<Principal, List.List<DownloadRecord>>();
      savedTemplates = Map.empty<Principal, List.List<SavedTemplate>>();
      listingInteractions = Map.empty<ListingId, List.List<ListingInteraction>>();
    };
  };
};
