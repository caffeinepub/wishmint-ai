import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, Download, Heart, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useSubscriptionStatus } from '../features/subscription/useSubscriptionStatus';
import { useMessageQuota } from '../features/quota/useMessageQuota';
import { useDownloadHistory, useSavedTemplates, useCreatorEarnings } from '../features/account/useAccountData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { PLAN_DEFINITIONS } from '../features/subscription/plans';
import { formatRelativeTime } from '../lib/datetime';
import { PlanType } from '../backend';

export const DashboardSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const subscriptionQuery = useSubscriptionStatus();
  const quotaQuery = useMessageQuota();
  const downloadHistoryQuery = useDownloadHistory();
  const savedTemplatesQuery = useSavedTemplates();
  const earningsQuery = useCreatorEarnings();

  if (!isAuthenticated) {
    return (
      <section ref={ref} id="dashboard" className="section-padding px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="section-container max-w-5xl">
          <Reveal>
            <Alert className="border-neon-purple/30 bg-neon-purple/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to access your dashboard.
              </AlertDescription>
            </Alert>
          </Reveal>
        </div>
      </section>
    );
  }

  const subscription = subscriptionQuery.data;
  const planMeta = subscription ? PLAN_DEFINITIONS[subscription.plan] : PLAN_DEFINITIONS[PlanType.free];
  const isCreator = subscription?.plan === PlanType.creator;

  return (
    <section ref={ref} id="dashboard" className="section-padding px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Your Dashboard
            </h2>
            <p className="section-subheading mt-4">
              Manage your account and track your activity
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription Status */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-neon-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-neon-purple" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionQuery.isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Plan</span>
                      <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                        {planMeta.name}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold">{planMeta.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={subscription?.state === 'active' ? 'default' : 'outline'}>
                        {subscription?.state || 'Active'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {/* Remaining Credits */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-neon-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-green" />
                  Message Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quotaQuery.isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining Today</span>
                      <span className="text-2xl font-bold text-neon-green">
                        {quotaQuery.remaining === 999999 ? '∞' : quotaQuery.remaining}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Limit</span>
                      <span className="font-semibold">
                        {quotaQuery.total === 999999 ? 'Unlimited' : quotaQuery.total}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {/* Download History */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download History
                </CardTitle>
                <CardDescription>Your recent downloads</CardDescription>
              </CardHeader>
              <CardContent>
                {downloadHistoryQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : downloadHistoryQuery.data && downloadHistoryQuery.data.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {downloadHistoryQuery.data.slice(0, 10).map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm">{record.contentType}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(Number(record.timestamp))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No downloads yet
                  </p>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {/* Saved Templates */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Saved Templates
                </CardTitle>
                <CardDescription>Your favorite templates</CardDescription>
              </CardHeader>
              <CardContent>
                {savedTemplatesQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : savedTemplatesQuery.data && savedTemplatesQuery.data.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {savedTemplatesQuery.data.slice(0, 10).map((template, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm">Template #{Number(template.templateId)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(Number(template.savedAt))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No saved templates yet
                  </p>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {/* Creator Earnings (only for Creator plan) */}
          {isCreator && (
            <Reveal>
              <Card className="bg-card/60 backdrop-blur-sm border-neon-green/20 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-neon-green" />
                    Creator Earnings
                  </CardTitle>
                  <CardDescription>Track your marketplace performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {earningsQuery.isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : earningsQuery.data ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                        <p className="text-3xl font-bold text-neon-green">
                          {Number(earningsQuery.data.totalDownloads)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold">
                          ₹{Number(earningsQuery.data.totalRevenue)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Payout integration coming soon
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Creator earnings data is not available. Start selling in the marketplace!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
});

DashboardSection.displayName = 'DashboardSection';
