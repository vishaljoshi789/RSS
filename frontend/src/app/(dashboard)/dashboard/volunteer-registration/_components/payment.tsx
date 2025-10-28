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
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount (INR)</Label>
        {amount ? (
          <div
            id="amount"
            role="textbox"
            aria-readonly="true"
            aria-disabled="true"
            tabIndex={-1}
            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            {`₹ ${amount.toLocaleString()}`}
          </div>
        ) : (
          <Input id="amount" type="text" value={""} placeholder="Amount will be set after selecting level" />
        )}
      </div>

      <div className="flex">
        <Button variant="secondary" onClick={onBack} className="mr-4">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={loading || !amount}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </div>
    </div>
  )
}

export default PaymentForm