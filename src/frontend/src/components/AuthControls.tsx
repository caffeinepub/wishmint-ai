import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { shortenPrincipal } from '../lib/principal';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Authentication controls component that provides sign-in/sign-out functionality
 * using Internet Identity. Displays user principal when authenticated.
 * Supports forwarding ref to the sign-in button for focus management.
 */
export const AuthControls = forwardRef<HTMLButtonElement>((props, ref) => {
  const { login, clear, loginStatus, identity, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalString = identity?.getPrincipal().toString();

  return (
    <div className="flex items-center gap-3">
      {isLoginError && loginError && (
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
            onClick={clear}
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
          onClick={login}
          disabled={isLoggingIn || loginStatus === 'initializing'}
          size="sm"
          className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign in
            </>
          )}
        </Button>
      )}
    </div>
  );
});

AuthControls.displayName = 'AuthControls';
