/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeClosed } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { ButtonDefault } from '../Button/Button';

type CommonProps = {
  label: string;
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  type: string;
  disabled?: boolean | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  min?: number | string | undefined;
  max?: number | string | undefined;
  onBlur?: (event: any) => void;
  setShowPassword?: Dispatch<SetStateAction<boolean>> | undefined;
  showPassword?: boolean;
};

interface InputProps extends CommonProps {
  options?: never; // 🔒 impede uso de options quando for input
}

interface SelectProps extends CommonProps {
  options: { label: string; value: string }[];
}

type InputsFieldsProps = InputProps | SelectProps;

export function InputField(props: InputsFieldsProps) {
  const {
    label,
    name,
    placeholder,
    type,
    className,
    defaultValue,
    options,
    disabled,
    maxLength,
    minLength,
    onBlur,
    setShowPassword,
    showPassword,
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name as keyof typeof errors] as FieldError | undefined;

  const baseClass =
    'rounded-md border border-text-secondary px-4 py-2 focus:outline-none cursor-text';

  const selectClass = twMerge(
    baseClass,
    'bg-white cursor-pointer appearance-none',
  );

  return (
    <div className={twMerge('flex w-full flex-col', className)}>
      <label htmlFor={name} className="mb-1 text-text-primary">
        {label}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          {...register(name)}
          defaultValue={defaultValue}
          className={selectClass}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder || 'Selecione uma opção'}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={name}
            {...register(name)}
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={twMerge(
              baseClass,
              'w-full',
              type === 'password' && 'pr-10',
            )}
            disabled={disabled}
            minLength={minLength}
            maxLength={maxLength}
            onBlur={onBlur}
          />
          {type === 'password' && setShowPassword && (
            <ButtonDefault
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              variant="normal"
            >
              {showPassword ? (
                <EyeClosed className="text-text-primary" />
              ) : (
                <Eye className="text-text-primary" />
              )}
            </ButtonDefault>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-details-error">{error.message}</p>
      )}
    </div>
  );
}
