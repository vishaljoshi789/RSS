'use client';

import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AddressFormData } from '@/module/dashboard/volunteer';

interface AddressFormProps {
  data: AddressFormData;
  setData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  onNext: () => void;
  onBack?: () => void;
}

const AddressForm = ({ data, setData, onNext, onBack }: AddressFormProps) => {
  const { user } = useAuth();
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>({});


  useEffect(() => {
    if (!user) return;
    const updatedDisabled: Record<string, boolean> = {};
    const updatedData: Partial<AddressFormData> = {};

    
    const fields = [
      'street',
      'sub_district',
      'district',
      'city',
      'state',
      'country',
      'postal_code',
      'mandal',
    ];

    fields.forEach((key) => {
      const userValue = user[key as keyof typeof user];
      const currentValue = data[key as keyof AddressFormData];

      
      if (userValue && (!currentValue || currentValue === '')) {
        updatedData[key as keyof AddressFormData] = String(userValue);
        updatedDisabled[key] = true;
      }

      
      if (userValue && currentValue && String(currentValue) === String(userValue)) {
        updatedDisabled[key] = true;
      }
    });

    if (Object.keys(updatedData).length > 0) {
      setData((prev) => ({ ...prev, ...updatedData }));
    }

    
    setDisabledFields(updatedDisabled);
  }, [user, data, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.street || !data.city || !data.postal_code) {
      toast.error('Please fill in all required fields.');
      return;
    }

    onNext();
  };

  const renderInput = (
    label: string,
    name: keyof AddressFormData,
    required = false,
    placeholder?: string,
    pattern?: string,
    title?: string
  ) => (
    <div>
      <Label htmlFor={name} className="mb-2">
        {label} {required && '*'}
      </Label>

      {disabledFields[name as string] ? (
        <div
          id={String(name)}
          role="textbox"
          aria-readonly="true"
          aria-disabled="true"
          tabIndex={-1}
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          {data[name] || ''}
        </div>
      ) : (
        <Input
          id={name as string}
          name={name as string}
          value={data[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          pattern={pattern}
          title={title}
          required={required}
        />
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-lg mx-auto p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm"
    >
      {renderInput('Street', 'street', true, 'House No., Street name')}
      <div className="grid grid-cols-2 gap-4">
        {renderInput('Sub-District', 'sub_district', false, 'Sub-district or Block')}
        {renderInput('District', 'district', false, 'District')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderInput('City', 'city', true, 'City or Town')}
        {renderInput('State', 'state', false, 'State')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderInput('Country', 'country', true, 'Country')}
        {renderInput('Postal Code', 'postal_code', true, 'e.g. 110001', '^\\d{5,6}$', 'Enter a valid 5 or 6-digit postal code')}
        {renderInput('Mandal', 'mandal', true, 'Enter your mandal')}
      </div>

      <div className="flex justify-between pt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default AddressForm;