import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCreateCommunityPost } from '../hooks/useCreateCommunityPost';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';

interface CreateCommunityPostDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCommunityPostDialog({ open, onClose }: CreateCommunityPostDialogProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const createMutation = useCreateCommunityPost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'template' | 'sticker'>('template');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const contentTypeParam = contentType === 'template'
      ? { __kind__: 'template' as const, template: BigInt(1) }
      : { __kind__: 'sticker' as const, sticker: BigInt(1) };

    createMutation.mutate(
      { title, description, contentType: contentTypeParam },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setContentType('template');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setTitle('');
      setDescription('');
      setContentType('template');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Community Post</DialogTitle>
          <DialogDescription>
            Share your template or sticker with the community
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <Alert className="bg-neon-purple/10 border-neon-purple/20">
            <AlertCircle className="h-4 w-4 text-neon-purple" />
            <AlertDescription className="text-sm">
              Please sign in to create a post and share with the community.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your post a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)} disabled={createMutation.isPending}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="sticker">Sticker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your design, its features, and what makes it special"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                disabled={createMutation.isPending}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !title || !description}
                className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Post
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
