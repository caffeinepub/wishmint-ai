import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { shortenPrincipal } from '../lib/principal';
import { LogOut, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthEntryDialog } from './auth/AuthEntryDialog';

/**
 * Authentication controls component that provides sign-in/sign-out functionality
 * using Internet Identity with "Continue with Google" branding. Displays user principal when authenticated.
 * Supports forwarding ref to the sign-in button for focus management.
 */
export const AuthControls = forwardRef<HTMLButtonElement>((props, ref) => {
  const { clear, identity, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalString = identity?.getPrincipal().toString();

  const handleSignOut = async () => {
    await clear();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {isLoginError && loginError && !authDialogOpen && (
          <Alert variant="destructive" className="max-w-xs">
            <AlertDescription className="text-sm">
              {loginError.message}
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Signed in</span>
              <span className="text-sm font-mono text-foreground">
                {principalString ? shortenPrincipal(principalString) : '...'}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            ref={ref}
            onClick={() => setAuthDialogOpen(true)}
            disabled={isLoggingIn}
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <img
                  src="/assets/generated/google-g-logo.dim_24x24.png"
                  alt="Google"
                  className="w-4 h-4 mr-2"
                />
                Continue with Google
              </>
            )}
          </Button>
        )}
      </div>

      <AuthEntryDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </>
  );
});

AuthControls.displayName = 'AuthControls';
