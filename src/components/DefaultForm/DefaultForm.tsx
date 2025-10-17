/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';
import { InputField } from '../InputField/InputField';
import { ButtonDefault } from '../Button/Button';

interface FormProps<T extends ZodSchema<any>> {
  // "TypeOf<T> me dá o objeto de tipos."
  // "keyof TypeOf<T> me dá só os nomes das propriedades — que são exatamente os nomes dos inputs que o register() precisa."
  schema: T;
  onSubmit: (data: TypeOf<T>) => void;
  fields: {
    name: keyof TypeOf<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: string;
  }[];
  childrenButton?: string;
  isLoading?: boolean;
}

export function DefaultForm<T extends ZodSchema<any>>({
  schema,
  onSubmit,
  fields,
  childrenButton,
  isLoading,
}: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {fields.map(
        ({ name, label, type, placeholder, disabled, defaultValue }) => (
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
          />
        ),
      )}
      <ButtonDefault
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-5"
      >
        {childrenButton}
      </ButtonDefault>
    </form>
  );
}
