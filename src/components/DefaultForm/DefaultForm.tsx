/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';
import { InputField } from '../InputField/InputField';
import { ButtonDefault } from '../Button/Button';
import { twMerge } from 'tailwind-merge';

interface FormProps<T extends ZodSchema<any>> {
  schema: T;
  onSubmit: (data: TypeOf<T>) => void;
  fields: {
    name: keyof TypeOf<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: string;
    options?: { label: string; value: string }[];
  }[];
  childrenButton?: string;
  isLoading?: boolean;
  className?: string;

  /** define layout do container de inputs — padrão é coluna */
  layoutType?: 'column' | 'grid';
  /** classes extras para ajustar grid */
  gridClassName?: string;
}

export function DefaultForm<T extends ZodSchema<any>>({
  schema,
  onSubmit,
  fields,
  childrenButton,
  isLoading,
  className,
  layoutType = 'column',
  gridClassName,
}: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
  });

  // 🔹 Decide o layout com base em layoutType
  const layoutClasses =
    layoutType === 'grid'
      ? twMerge('grid gap-4', gridClassName) // grid flexível
      : 'flex flex-col gap-4'; // padrão coluna

  const layoutButton =
    layoutType === 'grid'
      ? twMerge('mt-5 w-fit self-start px-8 py-2')
      : 'mt-5 px-8 py-2';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge('flex flex-col', className)}
    >
      <div className={layoutClasses}>
        {fields.map(
          ({
            name,
            label,
            type,
            placeholder,
            disabled,
            defaultValue,
            options,
          }) => (
            <InputField
              key={name as string}
              label={label}
              name={name as string}
              register={register}
              placeholder={placeholder}
              type={type || 'text'}
              error={errors[name] as FieldError | undefined}
              disabled={isLoading || disabled}
              defaultValue={defaultValue || ''}
              options={options}
              className="w-full"
            />
          ),
        )}
      </div>

      <ButtonDefault
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className={layoutButton}
      >
        {childrenButton}
      </ButtonDefault>
    </form>
  );
}
