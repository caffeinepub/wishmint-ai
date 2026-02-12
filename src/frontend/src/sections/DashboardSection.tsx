import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Calendar, Download, Bookmark, TrendingUp, Shield } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useSubscriptionStatus } from '../features/subscription/useSubscriptionStatus';
import { useMessageQuota } from '../features/quota/useMessageQuota';
import { useIsAdmin } from '../features/admin/hooks/useIsAdmin';
import { AdminPaymentRequestsPanel } from '../features/admin/AdminPaymentRequestsPanel';

export const DashboardSection = forwardRef<HTMLDivElement>((props, ref) => {
  const subscriptionQuery = useSubscriptionStatus();
  const quotaQuery = useMessageQuota();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const planName = subscriptionQuery.data?.plan || 'free';
  const planDisplay = planName.charAt(0).toUpperCase() + planName.slice(1);

  return (
    <section id="dashboard" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Reveal className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-2">
            <LayoutDashboard className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">Your Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Account Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your subscription and track your activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <Card className="border-neon-purple/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-neon-purple" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-gradient-to-r from-neon-purple to-neon-green text-white">
                {planDisplay} Plan
              </Badge>
              {subscriptionQuery.data?.expiresAt && (
                <p className="text-sm text-muted-foreground">
                  Expires: {new Date(Number(subscriptionQuery.data.expiresAt) / 1_000_000).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Message Quota */}
          <Card className="border-neon-purple/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-neon-green" />
                Message Quota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">
                {quotaQuery.remaining} / {quotaQuery.total}
              </div>
              <p className="text-sm text-muted-foreground">Messages remaining today</p>
            </CardContent>
          </Card>

          {/* Download History */}
          <Card className="border-neon-purple/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="w-5 h-5 text-neon-purple" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Total downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel */}
        {!isAdminLoading && isAdmin && (
          <div className="mt-12">
            <Card className="border-neon-purple/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neon-purple" />
                  Admin Panel
                </CardTitle>
                <CardDescription>Manage payment requests and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPaymentRequestsPanel />
              </CardContent>
            </Card>
          </div>
        )}
      </Reveal>
    </section>
  );
});

DashboardSection.displayName = 'DashboardSection';
