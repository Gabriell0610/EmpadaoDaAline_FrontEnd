/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

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
  onBlur?: (event: any) => void;
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
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name as keyof typeof errors] as FieldError | undefined;

  const baseClass =
    'rounded-md border border-text-secondary px-4 py-2 focus:outline-none cursor-pointer';

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
        <input
          id={name}
          {...register(name)}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={baseClass}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          onBlur={onBlur}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-details-error">{error.message}</p>
      )}
    </div>
  );
}
