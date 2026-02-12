import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  public shared ({ caller }) func testAuthenticatedCaller() : async Principal.Principal {
    if (caller.isAnonymous()) {
      Runtime.trap("Caller must be authenticated. ");
    };
    caller;
  };
};
