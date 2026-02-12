import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Video, Images } from 'lucide-react';

export function ComingSoonTiles() {
  const comingSoonFeatures = [
    {
      icon: Mic,
      title: 'AI Voice Message Card',
      description: 'Generate personalized voice messages with AI',
    },
    {
      icon: Video,
      title: 'Birthday Video Slideshow',
      description: 'Create stunning video slideshows from photos',
    },
    {
      icon: Images,
      title: 'Memory Photo Collage',
      description: 'Beautiful collages from your favorite memories',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">More Premium Features</h3>
        <p className="text-sm text-muted-foreground">Exciting new card types coming soon!</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {comingSoonFeatures.map((feature) => (
          <Card key={feature.title} className="relative opacity-75">
            <Badge className="absolute top-4 right-4" variant="secondary">
              Coming Soon
            </Badge>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <feature.icon className="w-5 h-5" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
