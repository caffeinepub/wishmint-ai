import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumDesignerState } from './usePremiumDesignerState';

interface CustomizationPanelProps {
  designerState: ReturnType<typeof usePremiumDesignerState>;
}

export function CustomizationPanel({ designerState }: CustomizationPanelProps) {
  const { state, setBackgroundStyle, setFontStyle, setFontColor, setTextAlignment, setEmojiDecorationsEnabled, setBorderStyle, setAnimationsEnabled, setUploadedPhoto, setPhotoPlacement } = designerState;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedPhoto(event.target?.result as string);
      toast.success('Photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background-style">Background Style</Label>
            <Select value={state.backgroundStyle} onValueChange={(value: any) => setBackgroundStyle(value)}>
              <SelectTrigger id="background-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-style">Font Style</Label>
            <Select value={state.fontStyle} onValueChange={(value: any) => setFontStyle(value)}>
              <SelectTrigger id="font-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="handwritten">Handwritten</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-color">Font Color</Label>
            <div className="flex gap-2">
              <Input
                id="font-color"
                type="color"
                value={state.fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={state.fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1"
                placeholder="#4A4A4A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-alignment">Text Alignment</Label>
            <Select value={state.textAlignment} onValueChange={(value: any) => setTextAlignment(value)}>
              <SelectTrigger id="text-alignment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Decorations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emoji-decorations">Emoji Decorations</Label>
            <Switch
              id="emoji-decorations"
              checked={state.emojiDecorationsEnabled}
              onCheckedChange={setEmojiDecorationsEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="border-style">Border Style</Label>
            <Select value={state.borderStyle} onValueChange={(value: any) => setBorderStyle(value)}>
              <SelectTrigger id="border-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="decorative">Decorative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="animations">Animations</Label>
            <Switch
              id="animations"
              checked={state.animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Upload Photo</Label>
            <div className="flex gap-2">
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {state.uploadedPhoto ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>

          {state.uploadedPhoto && (
            <>
              <div className="space-y-2">
                <Label htmlFor="photo-placement">Photo Placement</Label>
                <Select value={state.photoPlacement} onValueChange={(value: any) => setPhotoPlacement(value)}>
                  <SelectTrigger id="photo-placement">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setUploadedPhoto(null)}
              >
                Remove Photo
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
