import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  HandshakeIcon,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

/**
 * Maps a contract stage to a badge variant and label
 */
const STAGE_MAP = {
  initiated: { label: 'Initiated', variant: 'secondary' },
  negotiation: { label: 'Negotiation', variant: 'default' },
  payment: { label: 'Awaiting Payment', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

/**
 * Maps a payment status to a badge label
 */
const PAYMENT_MAP = {
  pending: { label: 'Unpaid', variant: 'outline' },
  paid: { label: 'Paid', variant: 'success' },
};

/**
 * ContractBanner
 * Displayed below the chat header when there is an active contract.
 *
 * Props:
 *  contract         – the contract object
 *  onInitiatePayment() – called when vendor clicks "Initiate Payment"
 *  onComplete()     – emits service-complete-contract
 *  onTerminate()    – emits service-terminate-contract
 *  isCompletePending   – loading flag
 *  isTerminatePending  – loading flag
 */
const ContractBanner = ({
  contract,
  onInitiatePayment,
  onComplete,
  onTerminate,
  isCompletePending,
  isTerminatePending,
}) => {
  if (!contract) return null;

  const { stage, clientStatus, name, currency, price, paymentStatus } = contract;

  // Don't render banner for terminal states
  if (stage === 'cancelled') return null;

  const stageInfo = STAGE_MAP[stage] || { label: stage, variant: 'secondary' };
  const paymentInfo = PAYMENT_MAP[paymentStatus] || { label: paymentStatus, variant: 'outline' };

  // Determine which actions are available (vendor perspective)
  const canInitiatePayment = stage === 'negotiation';
  const canComplete = stage === 'in_progress';
  const canTerminate = stage === 'initiated' || stage === 'negotiation';

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 border-b text-sm flex-wrap',
        stage === 'in_progress' && 'bg-blue-50 dark:bg-blue-950/20',
        stage === 'negotiation' && 'bg-amber-50 dark:bg-amber-950/20',
        stage === 'initiated' && 'bg-muted/60',
        stage === 'payment' && 'bg-purple-50 dark:bg-purple-950/20',
        stage === 'completed' || stage === 'confirmed'
          ? 'bg-green-50 dark:bg-green-950/20'
          : ''
      )}
    >
      {/* Icon */}
      <HandshakeIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

      {/* Contract Info */}
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
        <span className="font-medium truncate">{name || 'Contract'}</span>
        <Badge variant={stageInfo.variant} className="text-xs">
          {stageInfo.label}
        </Badge>
        {price > 0 && (
          <Badge variant={paymentInfo.variant} className="text-xs">
            {currency} {Number(price).toLocaleString()} · {paymentInfo.label}
          </Badge>
        )}
      </div>

      {/* Status hint */}
      {stage === 'initiated' && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Awaiting user confirmation…
        </span>
      )}

      {stage === 'payment' && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          User is being prompted to pay
        </span>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Initiate Payment */}
        {canInitiatePayment && (
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs"
            onClick={onInitiatePayment}
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Initiate Payment
          </Button>
        )}

        {/* Mark Complete */}
        {canComplete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/40"
                disabled={isCompletePending}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Mark Complete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Contract as Completed?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark <strong>{name || 'the contract'}</strong> as completed on your end.
                  The user will still need to confirm completion.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onComplete}>
                  Yes, Mark Complete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Terminate */}
        {canTerminate && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:bg-destructive/10"
                disabled={isTerminatePending}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Terminate
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Terminate Contract?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently cancel{' '}
                  <strong>{name || 'the contract'}</strong>. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Contract</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onTerminate}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Terminate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default ContractBanner;
