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
 * Shows loading states, error messages, and success confirmation after authentication.
 */
export function AuthEntryDialog({ open, onOpenChange, onAuthSuccess }: AuthEntryDialogProps) {
  const { identity, isLoginError, loginError } = useInternetIdentity();
  const [showSuccess, setShowSuccess] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && open) {
      setShowSuccess(true);
    }
  }, [isAuthenticated, open]);

  const handleGoToDashboard = () => {
    onAuthSuccess?.();
    onOpenChange(false);
    setShowSuccess(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setShowSuccess(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {showSuccess && isAuthenticated ? (
          <div className="py-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-neon-green" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Signed in successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  You now have access to all features
                </p>
              </div>
            </div>
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome to WishMint AI
              </DialogTitle>
              <DialogDescription className="text-center">
                Sign in or create an account to unlock all features
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <ContinueWithGoogleButton fullWidth />
                  
                  {isLoginError && loginError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {loginError.message || 'Failed to sign in. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <ContinueWithGoogleButton fullWidth />
                  
                  {isLoginError && loginError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {loginError.message || 'Failed to create account. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
