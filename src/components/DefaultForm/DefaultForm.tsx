/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  DefaultValues,
  UseFormReturn,
} from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';
import { ReactNode, useEffect } from 'react';

interface FormProps<T extends ZodSchema<any>> {
  schema: T;
  onSubmit: (
    data: TypeOf<T>,
    methods: UseFormReturn<TypeOf<T>>,
  ) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
  children: ReactNode | ((methods: UseFormReturn<TypeOf<T>>) => ReactNode);
  defaultValues?: DefaultValues<TypeOf<T>>;
}

export function DefaultForm<T extends ZodSchema<any>>(props: FormProps<T>) {
  const { schema, onSubmit, children, className, defaultValues } = props;

  const methods = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit(data, methods))}
        className={className}
      >
        <div className="flex flex-col gap-4">
          {typeof children === 'function' ? children(methods) : children}
        </div>
      </form>
    </FormProvider>
  );
}
