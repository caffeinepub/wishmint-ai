import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the access control system (Not persisted)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Auth Types
  public type UserAuth = {
    provider : Text;
    createdAt : Int;
    lastLoginAt : Int;
  };

  // User Profile Types
  public type UserProfile = {
    name : Text;
    bio : Text;
  };

  // Subscription Types
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
    lastResetDate : Text;
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

  // Payment and Subscription types
  public type PaymentStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type PaymentRequest = {
    id : Text;
    userId : Principal;
    email : Text;
    plan : PlanType;
    amount : Nat;
    utr : Text;
    screenshot : ?Storage.ExternalBlob;
    status : PaymentStatus;
    createdAt : Int;
    reviewedAt : ?Int;
  };

  public type Subscription = {
    userId : Principal;
    plan : PlanType;
    premiumUntil : ?Int;
    status : SubscriptionState;
  };

  // State variables
  var nextPostId : Nat = 1;
  var nextListingId : Nat = 1;
  var nextSurpriseId : Nat = 1;
  var nextPaymentId : Nat = 1;

  let userAuth = Map.empty<Principal, UserAuth>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let communityPosts = Map.empty<PostId, CommunityPost>();
  let marketplaceListings = Map.empty<ListingId, MarketplaceListing>();
  let subscriptionsMap = Map.empty<Principal, List.List<Principal>>();
  let userSubscriptionStatus = Map.empty<Principal, SubscriptionStatus>();
  let messageQuotas = Map.empty<Principal, MessageQuota>();
  let surprisePayloads = Map.empty<Text, SurprisePayload>();
  let downloadHistory = Map.empty<Principal, List.List<DownloadRecord>>();
  let savedTemplates = Map.empty<Principal, List.List<SavedTemplate>>();
  let listingInteractions = Map.empty<ListingId, List.List<ListingInteraction>>();
  let paymentRequests = Map.empty<Text, PaymentRequest>();
  let subscriptions = Map.empty<Principal, Subscription>();

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
      return true;
    };

    let currentDate = getCurrentDateString();
    switch (messageQuotas.get(caller)) {
      case (null) { true };
      case (?quota) {
        if (quota.lastResetDate != currentDate) {
          true;
        } else {
          quota.count < 3;
        };
      };
    };
  };

  // Helper function to increment message count
  private func incrementMessageCount(caller : Principal) {
    if (hasRequiredPlan(caller, #pro)) {
      return;
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

  // Persistent login verification and create-if-not-exists
  public shared ({ caller }) func createOrUpdateUserAuth(provider : Text) : async () {
    let now = Time.now();
    let newAuth : UserAuth = {
      provider;
      createdAt = now;
      lastLoginAt = now;
    };

    switch (userAuth.get(caller)) {
      case (null) {
        userAuth.add(caller, newAuth);
      };
      case (?existing) {
        let updatedAuth = { existing with lastLoginAt = now };
        userAuth.add(caller, updatedAuth);
      };
    };
  };

  public query ({ caller }) func getUserAuth() : async ?UserAuth {
    userAuth.get(caller);
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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
      return { remaining = 999999; total = 999999 };
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

  public query ({ caller }) func getSurprisePayload(surpriseId : Text) : async ?SurprisePayload {
    // Anyone can view surprise payloads (intended for sharing)
    surprisePayloads.get(surpriseId);
  };

  // Dashboard and Utilities
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
      totalRevenue = 0;
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
    // Public access - anyone can view community posts
    communityPosts.get(id);
  };

  public query ({ caller }) func getAllCommunityPosts() : async [CommunityPost] {
    // Public access - anyone can view community posts
    communityPosts.values().toArray();
  };

  public query ({ caller }) func getCreatorPosts(creator : Principal) : async [CommunityPost] {
    // Public access - anyone can view creator posts
    let allPosts = communityPosts.values().toArray();
    let filteredPosts = allPosts.filter(func(post) { post.creator == creator });
    filteredPosts;
  };

  // Subscription and Marketplace Functions
  public shared ({ caller }) func subscribeToCreator(creator : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe");
    };

    let currentSubs = switch (subscriptionsMap.get(creator)) {
      case (null) { List.empty<Principal>() };
      case (?subs) { subs };
    };

    let alreadySubscribed = currentSubs.any(func(p) { p == caller });
    if (alreadySubscribed) {
      Runtime.trap("Already subscribed to this creator");
    };

    let updatedSubs = List.fromArray(currentSubs.toArray());
    updatedSubs.add(caller);
    subscriptionsMap.add(creator, updatedSubs);
  };

  public query ({ caller }) func getCreatorSubscribers(creator : Principal) : async [Principal] {
    if (caller != creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the creator or admin can view subscribers");
    };
    switch (subscriptionsMap.get(creator)) {
      case (null) { [] };
      case (?subs) { subs.toArray() };
    };
  };

  public shared ({ caller }) func createMarketplaceListing(
    title : Text,
    description : Text,
    price : Nat,
    contentType : { #template : TemplateId; #sticker : Nat },
  ) : async ListingId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };

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
    // Public access - anyone can view marketplace listings
    marketplaceListings.get(id);
  };

  public query ({ caller }) func getAllMarketplaceListings() : async [MarketplaceListing] {
    // Public access - anyone can view marketplace listings
    marketplaceListings.values().toArray();
  };

  public query ({ caller }) func getCreatorListings(creator : Principal) : async [MarketplaceListing] {
    // Public access - anyone can view creator listings
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

  // Payment Functions
  public shared ({ caller }) func createPaymentRequest(
    email : Text,
    plan : PlanType,
    amount : Nat,
    utr : Text,
    screenshot : ?Storage.ExternalBlob,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create payment requests");
    };

    let id = nextPaymentId.toText();
    nextPaymentId += 1;

    let payment : PaymentRequest = {
      id;
      userId = caller;
      email;
      plan;
      amount;
      utr;
      screenshot;
      status = #pending;
      createdAt = Time.now();
      reviewedAt = null;
    };

    paymentRequests.add(id, payment);
    id;
  };

  public query ({ caller }) func getPaymentRequest(id : Text) : async ?PaymentRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payment requests");
    };

    switch (paymentRequests.get(id)) {
      case (null) { null };
      case (?payment) {
        // Users can only view their own payment requests, admins can view all
        if (payment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own payment requests");
        };
        ?payment;
      };
    };
  };

  public query ({ caller }) func getUserPaymentRequests() : async [PaymentRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payment requests");
    };

    let payments = paymentRequests.values().filter(
      func(p) { p.userId == caller }
    );
    payments.toArray();
  };

  public shared ({ caller }) func updatePaymentStatus(
    paymentId : Text,
    newStatus : PaymentStatus,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can change payment status");
    };

    switch (paymentRequests.get(paymentId)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) {
        let updatedPayment = { payment with status = newStatus; reviewedAt = ?Time.now() };
        paymentRequests.add(paymentId, updatedPayment);
      };
    };
  };

  public shared ({ caller }) func createSubscription(
    userId : Principal,
    plan : PlanType,
    status : SubscriptionState,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create subscriptions");
    };

    let subscription : Subscription = {
      userId;
      plan;
      premiumUntil = null;
      status;
    };

    subscriptions.add(userId, subscription);
  };

  public shared ({ caller }) func updatePaymentRequestStatus(
    paymentId : Text,
    newStatus : PaymentStatus,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update payment request status");
    };

    switch (paymentRequests.get(paymentId)) {
      case (null) { Runtime.trap("Payment request not found") };
      case (?payment) {
        let updatedPayment = {
          payment with
          status = newStatus;
          reviewedAt = ?Time.now();
        };
        paymentRequests.add(paymentId, updatedPayment);

        if (newStatus == #approved) {
          let premiumUntil = Time.now() + 30 * 24 * 60 * 60 * 1_000_000_000;
          switch (userSubscriptionStatus.get(payment.userId)) {
            case (null) {
              let newStatus : SubscriptionStatus = {
                plan = payment.plan;
                state = #active;
                startedAt = Time.now();
                expiresAt = ?premiumUntil;
                updatedAt = Time.now();
              };
              userSubscriptionStatus.add(payment.userId, newStatus);
            };
            case (?existing) {
              let updatedStatus = {
                existing with
                plan = payment.plan;
                state = #active;
                expiresAt = ?premiumUntil;
                updatedAt = Time.now();
              };
              userSubscriptionStatus.add(payment.userId, updatedStatus);
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllPaymentRequests() : async [PaymentRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all payment requests");
    };
    paymentRequests.values().toArray();
  };

  public query ({ caller }) func getUserSubscriptions() : async [Subscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscriptions");
    };

    subscriptions.values().filter(func(s) { s.userId == caller }).toArray();
  };

  public shared ({ caller }) func addScreenshotToPayment(paymentId : Text, screenshot : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add screenshots");
    };

    switch (paymentRequests.get(paymentId)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) {
        if (payment.userId != caller) {
          Runtime.trap("Unauthorized: Only the payment creator can add a screenshot");
        };

        let updatedPayment = { payment with screenshot = ?screenshot };
        paymentRequests.add(paymentId, updatedPayment);
      };
    };
  };

  public query ({ caller }) func getAllActiveSubscriptions() : async [Subscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all subscriptions");
    };
    subscriptions.values().filter(func(s) { s.status == #active }).toArray();
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
