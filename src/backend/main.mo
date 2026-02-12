import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    bio : Text;
  };

  // Plan Types
  public type PlanType = {
    #free;
    #pro;
    #creator;
  };

  public type SubscriptionState = {
    #active;
    #canceled;
    #expired;
  };

  public type SubscriptionStatus = {
    plan : PlanType;
    state : SubscriptionState;
    startedAt : Int;
    expiresAt : ?Int;
    updatedAt : Int;
  };

  public type MessageQuota = {
    count : Nat;
    lastResetDate : Text; // YYYY-MM-DD format
  };

  public type SurprisePayload = {
    id : Text;
    recipientName : Text;
    message : Text;
    createdBy : Principal;
    createdAt : Int;
  };

  public type DownloadRecord = {
    timestamp : Int;
    contentType : Text;
    contentId : Nat;
  };

  public type SavedTemplate = {
    templateId : Nat;
    savedAt : Int;
  };

  public type CreatorEarnings = {
    totalDownloads : Nat;
    totalRevenue : Nat;
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

  // State variables
  var nextPostId : Nat = 1;
  var nextListingId : Nat = 1;
  var nextSurpriseId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let communityPosts = Map.empty<PostId, CommunityPost>();
  let marketplaceListings = Map.empty<ListingId, MarketplaceListing>();
  let subscriptions = Map.empty<Principal, List.List<Principal>>();

  // New state for subscription management
  let userSubscriptionStatus = Map.empty<Principal, SubscriptionStatus>();
  let messageQuotas = Map.empty<Principal, MessageQuota>();
  let surprisePayloads = Map.empty<Text, SurprisePayload>();
  let downloadHistory = Map.empty<Principal, List.List<DownloadRecord>>();
  let savedTemplates = Map.empty<Principal, List.List<SavedTemplate>>();
  let listingInteractions = Map.empty<ListingId, List.List<ListingInteraction>>();

  // Helper function to get current date string
  private func getCurrentDateString() : Text {
    let now = Time.now();
    let days = now / (24 * 60 * 60 * 1_000_000_000);
    days.toText();
  };

  // Helper function to check if user has required plan
  private func hasRequiredPlan(caller : Principal, requiredPlan : PlanType) : Bool {
    switch (userSubscriptionStatus.get(caller)) {
      case (null) {
        // No subscription = Free plan
        switch (requiredPlan) {
          case (#free) { true };
          case (_) { false };
        };
      };
      case (?status) {
        if (status.state != #active) {
          return false;
        };
        switch (requiredPlan) {
          case (#free) { true };
          case (#pro) {
            switch (status.plan) {
              case (#pro) { true };
              case (#creator) { true };
              case (#free) { false };
            };
          };
          case (#creator) {
            switch (status.plan) {
              case (#creator) { true };
              case (_) { false };
            };
          };
        };
      };
    };
  };

  // Helper function to check and enforce message quota
  private func canGenerateMessage(caller : Principal) : Bool {
    if (hasRequiredPlan(caller, #pro)) {
      return true; // Pro and Creator have unlimited messages
    };

    let currentDate = getCurrentDateString();
    switch (messageQuotas.get(caller)) {
      case (null) { true }; // First message
      case (?quota) {
        if (quota.lastResetDate != currentDate) {
          true; // New day, quota resets
        } else {
          quota.count < 3; // Check if under limit
        };
      };
    };
  };

  // Helper function to increment message count
  private func incrementMessageCount(caller : Principal) {
    if (hasRequiredPlan(caller, #pro)) {
      return; // No quota for Pro/Creator
    };

    let currentDate = getCurrentDateString();
    switch (messageQuotas.get(caller)) {
      case (null) {
        messageQuotas.add(caller, { count = 1; lastResetDate = currentDate });
      };
      case (?quota) {
        if (quota.lastResetDate != currentDate) {
          messageQuotas.add(caller, { count = 1; lastResetDate = currentDate });
        } else {
          messageQuotas.add(caller, { count = quota.count + 1; lastResetDate = currentDate });
        };
      };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Subscription Management Functions
  public query ({ caller }) func getCallerSubscriptionStatus() : async SubscriptionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access subscription status");
    };

    switch (userSubscriptionStatus.get(caller)) {
      case (null) {
        // Default to Free plan
        {
          plan = #free;
          state = #active;
          startedAt = Time.now();
          expiresAt = null;
          updatedAt = Time.now();
        };
      };
      case (?status) { status };
    };
  };

  public shared ({ caller }) func updateSubscriptionStatus(
    user : Principal,
    plan : PlanType,
    state : SubscriptionState,
    expiresAt : ?Int,
  ) : async () {
    // This should be called after payment verification
    // For now, allow admins or the user themselves (for testing)
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != user) {
      Runtime.trap("Unauthorized: Only admins can update subscription status");
    };

    let now = Time.now();
    let newStatus : SubscriptionStatus = {
      plan = plan;
      state = state;
      startedAt = switch (userSubscriptionStatus.get(user)) {
        case (null) { now };
        case (?existing) { existing.startedAt };
      };
      expiresAt = expiresAt;
      updatedAt = now;
    };

    userSubscriptionStatus.add(user, newStatus);
  };

  public query ({ caller }) func getMessageQuotaStatus() : async { remaining : Nat; total : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check quota status");
    };

    if (hasRequiredPlan(caller, #pro)) {
      return { remaining = 999999; total = 999999 }; // Unlimited
    };

    let currentDate = getCurrentDateString();
    switch (messageQuotas.get(caller)) {
      case (null) { { remaining = 3; total = 3 } };
      case (?quota) {
        if (quota.lastResetDate != currentDate) {
          { remaining = 3; total = 3 };
        } else {
          { remaining = if (quota.count >= 3) { 0 } else { 3 - quota.count }; total = 3 };
        };
      };
    };
  };

  public shared ({ caller }) func recordMessageGeneration() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate messages");
    };

    if (not canGenerateMessage(caller)) {
      Runtime.trap("Message quota exceeded: Upgrade to Pro plan for unlimited messages");
    };

    incrementMessageCount(caller);
  };

  // Surprise Mode Functions (Pro/Creator only)
  public shared ({ caller }) func createSurpriseLink(
    recipientName : Text,
    message : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create surprise links");
    };

    if (not hasRequiredPlan(caller, #pro)) {
      Runtime.trap("Unauthorized: Surprise Mode requires Pro or Creator plan");
    };

    let surpriseId = "surprise_" # nextSurpriseId.toText();
    nextSurpriseId += 1;

    let payload : SurprisePayload = {
      id = surpriseId;
      recipientName;
      message;
      createdBy = caller;
      createdAt = Time.now();
    };

    surprisePayloads.add(surpriseId, payload);
    surpriseId;
  };

  public query func getSurprisePayload(surpriseId : Text) : async ?SurprisePayload {
    // Public access - anyone with the link can view
    surprisePayloads.get(surpriseId);
  };

  // Dashboard Functions
  public query ({ caller }) func getCallerDownloadHistory() : async [DownloadRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access download history");
    };

    switch (downloadHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.toArray() };
    };
  };

  public shared ({ caller }) func recordDownload(
    contentType : Text,
    contentId : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record downloads");
    };

    let record : DownloadRecord = {
      timestamp = Time.now();
      contentType;
      contentId;
    };

    let currentHistory = switch (downloadHistory.get(caller)) {
      case (null) { List.empty<DownloadRecord>() };
      case (?history) { history };
    };

    let updatedHistory = List.fromArray<DownloadRecord>(currentHistory.toArray());
    updatedHistory.add(record);
    downloadHistory.add(caller, updatedHistory);
  };

  public query ({ caller }) func getCallerSavedTemplates() : async [SavedTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved templates");
    };

    switch (savedTemplates.get(caller)) {
      case (null) { [] };
      case (?templates) { templates.toArray() };
    };
  };

  public shared ({ caller }) func saveTemplate(templateId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save templates");
    };

    let template : SavedTemplate = {
      templateId;
      savedAt = Time.now();
    };

    let currentTemplates = switch (savedTemplates.get(caller)) {
      case (null) { List.empty<SavedTemplate>() };
      case (?templates) { templates };
    };

    let updatedTemplates = List.fromArray<SavedTemplate>(currentTemplates.toArray());
    updatedTemplates.add(template);
    savedTemplates.add(caller, updatedTemplates);
  };

  public query ({ caller }) func getCreatorEarnings() : async CreatorEarnings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access earnings");
    };

    if (not hasRequiredPlan(caller, #creator)) {
      Runtime.trap("Unauthorized: Creator earnings require Creator plan");
    };

    // Calculate total interactions for this creator's listings
    let creatorListings = marketplaceListings.values().toArray().filter(
      func(listing) { listing.creator == caller }
    );

    var totalDownloads : Nat = 0;
    for (listing in creatorListings.vals()) {
      switch (listingInteractions.get(listing.id)) {
        case (null) {};
        case (?interactions) {
          totalDownloads += interactions.size();
        };
      };
    };

    {
      totalDownloads;
      totalRevenue = 0; // Placeholder - full payout system not implemented
    };
  };

  // Community Post Functions
  public shared ({ caller }) func createCommunityPost(
    title : Text,
    description : Text,
    contentType : { #template : TemplateId; #sticker : Nat },
  ) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let newPost : CommunityPost = {
      id = nextPostId;
      creator = caller;
      title;
      description;
      contentType;
      createdAt = Time.now();
    };

    communityPosts.add(nextPostId, newPost);
    let postId = nextPostId;
    nextPostId += 1;
    postId;
  };

  public query ({ caller }) func getCommunityPost(id : PostId) : async ?CommunityPost {
    communityPosts.get(id);
  };

  public query ({ caller }) func getAllCommunityPosts() : async [CommunityPost] {
    communityPosts.values().toArray();
  };

  public query ({ caller }) func getCreatorPosts(creator : Principal) : async [CommunityPost] {
    let allPosts = communityPosts.values().toArray();
    let filteredPosts = allPosts.filter(func(post) { post.creator == creator });
    filteredPosts;
  };

  // Subscription Functions
  public shared ({ caller }) func subscribeToCreator(creator : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe");
    };

    let currentSubs = switch (subscriptions.get(creator)) {
      case (null) { List.empty<Principal>() };
      case (?subs) { subs };
    };

    let alreadySubscribed = currentSubs.any(func(p) { p == caller });
    if (alreadySubscribed) {
      Runtime.trap("Already subscribed to this creator");
    };

    let updatedSubs = List.fromArray(currentSubs.toArray());
    updatedSubs.add(caller);
    subscriptions.add(creator, updatedSubs);
  };

  public query ({ caller }) func getCreatorSubscribers(creator : Principal) : async [Principal] {
    if (caller != creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the creator or admin can view subscribers");
    };
    switch (subscriptions.get(creator)) {
      case (null) { [] };
      case (?subs) { subs.toArray() };
    };
  };

  // Marketplace Functions
  public shared ({ caller }) func createMarketplaceListing(
    title : Text,
    description : Text,
    price : Nat,
    contentType : { #template : TemplateId; #sticker : Nat },
  ) : async ListingId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };

    // Restrict marketplace listing creation to Creator plan only
    if (not hasRequiredPlan(caller, #creator)) {
      Runtime.trap("Unauthorized: Creating marketplace listings requires Creator plan");
    };

    let newListing : MarketplaceListing = {
      id = nextListingId;
      creator = caller;
      title;
      description;
      price;
      contentType;
      createdAt = Time.now();
    };

    marketplaceListings.add(nextListingId, newListing);
    let listingId = nextListingId;
    nextListingId += 1;
    listingId;
  };

  public query ({ caller }) func getMarketplaceListing(id : ListingId) : async ?MarketplaceListing {
    // Anyone can browse listings
    marketplaceListings.get(id);
  };

  public query ({ caller }) func getAllMarketplaceListings() : async [MarketplaceListing] {
    // Anyone can browse listings
    marketplaceListings.values().toArray();
  };

  public query ({ caller }) func getCreatorListings(creator : Principal) : async [MarketplaceListing] {
    let allListings = marketplaceListings.values().toArray();
    let filteredListings = allListings.filter(func(listing) { listing.creator == creator });
    filteredListings;
  };

  public shared ({ caller }) func recordListingInteraction(listingId : ListingId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can interact with listings");
    };

    let interaction : ListingInteraction = {
      listingId;
      user = caller;
      timestamp = Time.now();
    };

    let currentInteractions = switch (listingInteractions.get(listingId)) {
      case (null) { List.empty<ListingInteraction>() };
      case (?interactions) { interactions };
    };

    let updatedInteractions = List.fromArray<ListingInteraction>(currentInteractions.toArray());
    updatedInteractions.add(interaction);
    listingInteractions.add(listingId, updatedInteractions);
  };

  public query ({ caller }) func getListingInteractionCount(listingId : ListingId) : async Nat {
    // Listing creator or admin can view interaction counts
    switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (caller != listing.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the listing creator or admin can view interaction counts");
        };

        switch (listingInteractions.get(listingId)) {
          case (null) { 0 };
          case (?interactions) { interactions.size() };
        };
      };
    };
  };
};
