import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { useIsAdmin } from './hooks/useIsAdmin';
import { useAllPaymentRequests } from './hooks/useAllPaymentRequests';
import { useUpdatePaymentRequestStatus } from './hooks/useUpdatePaymentRequestStatus';
import { AccessDeniedCard } from './AccessDeniedCard';
import { PaymentStatus, PlanType } from '../../backend';
import { shortenPrincipal } from '../../lib/principal';

export function AdminPaymentRequestsPanel() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: paymentRequests, isLoading: requestsLoading } = useAllPaymentRequests();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdatePaymentRequestStatus();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  if (adminLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedCard />;
  }

  const filteredRequests = paymentRequests?.filter((req) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return req.status === PaymentStatus.pending;
    if (activeTab === 'approved') return req.status === PaymentStatus.approved;
    if (activeTab === 'rejected') return req.status === PaymentStatus.rejected;
    return true;
  }) ?? [];

  const pendingCount = paymentRequests?.filter(r => r.status === PaymentStatus.pending).length ?? 0;

  const handleApprove = (paymentId: string) => {
    if (confirm('Approve this payment request and activate premium subscription?')) {
      updateStatus({ paymentId, newStatus: PaymentStatus.approved });
    }
  };

  const handleReject = (paymentId: string) => {
    if (confirm('Reject this payment request?')) {
      updateStatus({ paymentId, newStatus: PaymentStatus.rejected });
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleString();
  };

  const getPlanName = (plan: PlanType) => {
    return plan === PlanType.pro ? 'Pro' : plan === PlanType.creator ? 'Creator' : 'Free';
  };

  const getStatusBadge = (status: PaymentStatus) => {
    if (status === PaymentStatus.pending) {
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
    if (status === PaymentStatus.approved) {
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
    }
    return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Payment Requests</CardTitle>
        <CardDescription>Review and approve manual UPI payment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">
              Pending {pendingCount > 0 && <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {requestsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No payment requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UTR</TableHead>
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {shortenPrincipal(request.userId.toString())}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getPlanName(request.plan)}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₹{Number(request.amount)}</TableCell>
                        <TableCell className="font-mono text-xs">{request.utr}</TableCell>
                        <TableCell>
                          {request.screenshot ? (
                            <a
                              href={request.screenshot.getDirectURL()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-purple hover:underline flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-xs">{formatDate(request.createdAt)}</TableCell>
                        <TableCell>
                          {request.status === PaymentStatus.pending && (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                disabled={isUpdating}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request.id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                              </Button>
                            </div>
                          )}
                          {request.status !== PaymentStatus.pending && request.reviewedAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(request.reviewedAt)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
