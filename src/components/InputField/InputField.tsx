/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

type InputProps = ComponentProps<'input'>;

interface InputsFieldsProps extends InputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
  label: string;
  name: string;
  defaultValue: string;
}

export function InputField({
  label,
  name,
  register,
  error,
  placeholder,
  type,
  defaultValue,
  ...rest
}: InputsFieldsProps) {
  return (
    <div className="my-2 flex w-full flex-col">
      <label htmlFor={name} className="text-text-primary">
        {label}
      </label>
      <input
        id={name}
        {...register(name)}
        className="rounded-md border border-text-secondary px-4 py-2 focus:outline-none"
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        {...rest}
      />
      {error && <p className="text-details-error">{error.message}</p>}
    </div>
  );
}
