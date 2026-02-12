/**
 * Prompt Mode edit controls for title/message/footer, tone, and regeneration
 */

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Wand2 } from 'lucide-react';
import type { CardContent, ToneType } from '../types';

const TONE_OPTIONS: ToneType[] = [
  'formal',
  'romantic',
  'emotional',
  'fun',
  'luxury',
  'cute',
  'professional',
  'casual',
];

interface PromptModeEditorPanelProps {
  content: CardContent;
  selectedTone: ToneType;
  onContentChange: (content: CardContent) => void;
  onToneChange: (tone: ToneType) => void;
  onRegenerateText: () => void;
  onRegenerateDesigns: () => void;
  isRegenerating: boolean;
}

export function PromptModeEditorPanel({
  content,
  selectedTone,
  onContentChange,
  onToneChange,
  onRegenerateText,
  onRegenerateDesigns,
  isRegenerating,
}: PromptModeEditorPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={content.title}
          onChange={(e) => onContentChange({ ...content, title: e.target.value })}
          className="bg-background/50 border-border/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-message">Message</Label>
        <Textarea
          id="edit-message"
          value={content.message}
          onChange={(e) => onContentChange({ ...content, message: e.target.value })}
          rows={4}
          className="bg-background/50 border-border/40 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-footer">Footer</Label>
        <Input
          id="edit-footer"
          value={content.footer}
          onChange={(e) => onContentChange({ ...content, footer: e.target.value })}
          className="bg-background/50 border-border/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone-select">Tone</Label>
        <Select value={selectedTone} onValueChange={(value) => onToneChange(value as ToneType)}>
          <SelectTrigger id="tone-select" className="bg-background/50 border-border/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TONE_OPTIONS.map((tone) => (
              <SelectItem key={tone} value={tone} className="capitalize">
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={onRegenerateText}
          disabled={isRegenerating}
          variant="outline"
          className="flex-1"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Regenerate Text
        </Button>
        <Button
          onClick={onRegenerateDesigns}
          disabled={isRegenerating}
          variant="outline"
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate Designs
        </Button>
      </div>
    </div>
  );
}
