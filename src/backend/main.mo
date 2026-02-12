import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    bio : Text;
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

  type BuyerIntent = {
    listingId : ListingId;
    buyer : Principal;
    message : Text;
    status : { #pending; #accepted; #rejected };
  };

  // State variables
  stable var nextPostId : Nat = 1;
  stable var nextListingId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let communityPosts = Map.empty<PostId, CommunityPost>();
  let marketplaceListings = Map.empty<ListingId, MarketplaceListing>();
  let subscriptions = Map.empty<Principal, List.List<Principal>>();
  let buyerIntents = Map.empty<ListingId, List.List<BuyerIntent>>();

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

  public shared ({ caller }) func createCommunityPost(
    title : Text,
    description : Text,
    contentType : { #template : TemplateId; #sticker : Nat }
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
      createdAt = 0;
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

  public shared ({ caller }) func createMarketplaceListing(
    title : Text,
    description : Text,
    price : Nat,
    contentType : { #template : TemplateId; #sticker : Nat }
  ) : async ListingId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };

    let newListing : MarketplaceListing = {
      id = nextListingId;
      creator = caller;
      title;
      description;
      price;
      contentType;
      createdAt = 0;
    };

    marketplaceListings.add(nextListingId, newListing);
    let listingId = nextListingId;
    nextListingId += 1;
    listingId;
  };

  public query ({ caller }) func getMarketplaceListing(id : ListingId) : async ?MarketplaceListing {
    marketplaceListings.get(id);
  };

  public query ({ caller }) func getAllMarketplaceListings() : async [MarketplaceListing] {
    marketplaceListings.values().toArray();
  };

  public query ({ caller }) func getCreatorListings(creator : Principal) : async [MarketplaceListing] {
    let allListings = marketplaceListings.values().toArray();
    let filteredListings = allListings.filter(func(listing) { listing.creator == creator });
    filteredListings;
  };

  public shared ({ caller }) func expressInterest(listingId : ListingId, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can express interest");
    };

    let _ = switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (_) {};
    };

    let newIntent : BuyerIntent = {
      listingId;
      buyer = caller;
      message;
      status = #pending;
    };

    let currentIntents = switch (buyerIntents.get(listingId)) {
      case (null) { List.empty<BuyerIntent>() };
      case (?intents) { intents };
    };

    let updatedIntents = List.fromArray<BuyerIntent>(currentIntents.toArray());
    updatedIntents.add(newIntent);
    buyerIntents.add(listingId, updatedIntents);
  };

  public query ({ caller }) func getListingIntents(listingId : ListingId) : async [BuyerIntent] {
    let listing = switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?l) { l };
    };

    if (caller != listing.creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the listing creator or admin can view intents");
    };

    switch (buyerIntents.get(listingId)) {
      case (null) { [] };
      case (?intents) { intents.toArray() };
    };
  };

  public shared ({ caller }) func updateIntentStatus(
    listingId : ListingId,
    buyer : Principal,
    newStatus : { #accepted; #rejected }
  ) : async () {
    let listing = switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?l) { l };
    };

    if (caller != listing.creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the listing creator or admin can update intent status");
    };

    let currentIntents = switch (buyerIntents.get(listingId)) {
      case (null) { Runtime.trap("No intents found for this listing") };
      case (?intents) { intents };
    };

    var found = false;
    let updatedIntents = currentIntents.map<BuyerIntent, BuyerIntent>(
      func(intent) {
        if (intent.buyer == buyer) {
          found := true;
          { intent with status = newStatus };
        } else {
          intent;
        };
      }
    );

    if (not found) {
      Runtime.trap("Buyer intent not found");
    };

    buyerIntents.add(listingId, updatedIntents);
  };
};
