/**
 * Premium Coming Soon actions for Video and Voice features
 */

import { Button } from '@/components/ui/button';
import { Video, Mic } from 'lucide-react';
import { toast } from 'sonner';

export function PremiumComingSoonActions() {
  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} Coming Soon!`, {
      description: 'This premium feature will be available in the next update.',
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Premium Features</p>
      <div className="flex gap-2">
        <Button
          onClick={() => handleComingSoon('Video Invitation')}
          variant="outline"
          className="flex-1"
        >
          <Video className="w-4 h-4 mr-2" />
          Video Invitation
          <span className="ml-2 text-xs bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full">
            Soon
          </span>
        </Button>
        <Button
          onClick={() => handleComingSoon('Voice Message')}
          variant="outline"
          className="flex-1"
        >
          <Mic className="w-4 h-4 mr-2" />
          Voice Message
          <span className="ml-2 text-xs bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full">
            Soon
          </span>
        </Button>
      </div>
    </div>
  );
}
