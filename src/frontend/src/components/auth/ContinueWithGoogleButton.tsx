import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface ContinueWithGoogleButtonProps {
  fullWidth?: boolean;
  className?: string;
}

/**
 * Reusable "Continue with Google" button that triggers Internet Identity login.
 * Displays Google branding with white background and shows loading/error states.
 */
export function ContinueWithGoogleButton({ fullWidth = false, className = '' }: ContinueWithGoogleButtonProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <Button
      onClick={login}
      disabled={isLoggingIn}
      variant="outline"
      size="lg"
      className={`bg-white hover:bg-gray-50 text-gray-900 border-gray-300 font-medium ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <img
            src="/assets/generated/google-g-logo.dim_24x24.png"
            alt="Google"
            className="w-5 h-5 mr-3"
          />
          Continue with Google
        </>
      )}
    </Button>
  );
}
