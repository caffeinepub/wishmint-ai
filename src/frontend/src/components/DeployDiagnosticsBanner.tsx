import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useActor } from '@/hooks/useActor';

/**
 * Diagnostics banner that displays when IC-related configuration or runtime issues are detected.
 * Only shows when there are actual problems to report.
 */
export function DeployDiagnosticsBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const { actor, isFetching } = useActor();

  useEffect(() => {
    const detectedIssues: string[] = [];

    // Check if actor initialization failed after loading completed
    if (!isFetching && !actor) {
      detectedIssues.push('Backend connection failed. The canister actor could not be initialized.');
    }

    // Check if running in development but canister IDs are missing
    if (typeof window !== 'undefined') {
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDev && !import.meta.env.CANISTER_ID_BACKEND) {
        detectedIssues.push('Backend canister ID is missing. Run "dfx deploy" to set up canisters.');
      }
    }

    setIssues(detectedIssues);
  }, [actor, isFetching]);

  // Don't show banner if dismissed or no issues
  if (dismissed || issues.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert variant="destructive" className="relative shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="pr-8">Deployment Configuration Issue</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          {issues.map((issue, index) => (
            <div key={index} className="text-sm">
              • {issue}
            </div>
          ))}
          <div className="mt-3 text-sm font-medium">
            Next steps: Ensure all canisters are deployed with <code className="px-1 py-0.5 bg-background/50 rounded">dfx deploy</code> and the frontend build completed successfully.
          </div>
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss diagnostics"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
