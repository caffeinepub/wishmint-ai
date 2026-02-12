import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Download, Bookmark, TrendingUp, Shield } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerDownloadHistory, useGetCallerSavedTemplates, useGetCreatorEarnings } from '../hooks/useQueries';
import { useIsAdmin } from '../features/admin/hooks/useIsAdmin';
import { AdminPaymentRequestsPanel } from '../features/admin/AdminPaymentRequestsPanel';
import { useState } from 'react';
import { AuthEntryDialog } from '../components/auth/AuthEntryDialog';

export function DashboardSection() {
  const { identity } = useInternetIdentity();
  const { data: downloadHistory } = useGetCallerDownloadHistory();
  const { data: savedTemplates } = useGetCallerSavedTemplates();
  const { data: earnings } = useGetCreatorEarnings();
  const { isAdmin } = useIsAdmin();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <>
        <section id="dashboard" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background))' }}>
          <Reveal className="max-w-4xl mx-auto">
            <Card className="glass-card border-border/40 rounded-2xl">
              <CardContent className="py-12 text-center space-y-4">
                <LayoutDashboard className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Sign in to view your dashboard</h3>
                <p className="text-muted-foreground">Track your downloads, saved templates, and more</p>
                <Button onClick={() => setAuthDialogOpen(true)} className="premium-button">
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </section>
        <AuthEntryDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
        />
      </>
    );
  }

  return (
    <section id="dashboard" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background))' }}>
      <Reveal className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <LayoutDashboard className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Your Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">Activity Overview</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-border/40 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="w-4 h-4 text-brand-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{downloadHistory?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total downloads</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Templates</CardTitle>
              <Bookmark className="w-4 h-4 text-brand-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedTemplates?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Templates saved</p>
            </CardContent>
          </Card>

          {earnings && (
            <Card className="glass-card border-border/40 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creator Earnings</CardTitle>
                <TrendingUp className="w-4 h-4 text-brand-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(earnings.totalDownloads)}</div>
                <p className="text-xs text-muted-foreground">Total downloads</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-purple" />
              <h3 className="text-xl font-semibold">Admin Panel</h3>
            </div>
            <AdminPaymentRequestsPanel />
          </div>
        )}
      </Reveal>
    </section>
  );
}
