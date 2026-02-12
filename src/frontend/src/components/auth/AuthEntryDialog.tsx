import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ContinueWithGoogleButton } from './ContinueWithGoogleButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

/**
 * Auth dialog with Sign In and Sign Up tabs, each presenting the "Continue with Google" button.
 * Shows loading states, error messages, and auto-closes after successful authentication.
 */
export function AuthEntryDialog({ open, onOpenChange, onAuthSuccess }: AuthEntryDialogProps) {
  const { identity, isLoginError, loginError } = useInternetIdentity();
  const [showSuccess, setShowSuccess] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && open && !showSuccess) {
      setShowSuccess(true);
      // Auto-close after showing success briefly
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onAuthSuccess?.();
        onOpenChange(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, open, showSuccess, onAuthSuccess, onOpenChange]);

  // Reset success state when dialog closes
  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    // Allow closing the dialog
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Welcome!</h3>
              <p className="text-sm text-muted-foreground">
                You're all set. Redirecting...
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome to WishMint AI
              </DialogTitle>
              <DialogDescription className="text-center">
                Sign in or create an account to get started
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Continue with your Internet Identity to access your account
                  </p>
                  <ContinueWithGoogleButton />
                  {isLoginError && loginError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {loginError.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Create a new account with Internet Identity
                  </p>
                  <ContinueWithGoogleButton />
                  {isLoginError && loginError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {loginError.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
