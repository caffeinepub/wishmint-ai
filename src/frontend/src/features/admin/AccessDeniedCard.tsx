import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export function AccessDeniedCard() {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Admin privileges required</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this admin panel. Only authorized administrators can view and manage payment requests.
        </p>
      </CardContent>
    </Card>
  );
}
