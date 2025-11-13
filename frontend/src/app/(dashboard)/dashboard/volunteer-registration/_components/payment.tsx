import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'

interface PaymentFormProps {
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  amount?: number;
}

const PaymentForm = ({ onSubmit, onBack, loading, amount }: PaymentFormProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="amount" className="text-sm sm:text-base">Amount (INR)</Label>
        {amount ? (
          <div
            id="amount"
            role="textbox"
            aria-readonly="true"
            aria-disabled="true"
            tabIndex={-1}
            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 sm:h-11 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base sm:text-lg font-semibold shadow-xs transition-[color,box-shadow] outline-none"
          >
            {`₹ ${amount.toLocaleString()}`}
          </div>
        ) : (
          <Input id="amount" type="text" value={""} placeholder="Amount will be set after selecting level" className="h-10 sm:h-11" disabled />
        )}
        <p className="text-xs sm:text-sm text-muted-foreground">
          Membership fee based on selected level
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onBack} className="h-9 sm:h-10 w-full sm:w-auto order-2 sm:order-1">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={loading || !amount} className="h-9 sm:h-10 w-full sm:w-auto order-1 sm:order-2">
          {loading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </div>
    </div>
  )
}

export default PaymentForm