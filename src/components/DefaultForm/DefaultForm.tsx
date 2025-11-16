/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, DefaultValues } from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';
import { ReactNode } from 'react';

interface FormProps<T extends ZodSchema<any>> {
  schema: T;
  onSubmit: (data: TypeOf<T>) => void;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
  defaultValues?: DefaultValues<TypeOf<T>>;
}

export function DefaultForm<T extends ZodSchema<any>>(props: FormProps<T>) {
  const { schema, onSubmit, children, className, defaultValues } = props;

  const methods = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        <div className="flex flex-col gap-4">{children}</div>
      </form>
    </FormProvider>
  );
}
