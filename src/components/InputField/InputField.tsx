/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type CommonProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  type: string;
  disabled: boolean | undefined;
};

// 🔹 Tipo para campos de input
interface InputProps extends CommonProps {
  options?: never; // 🔒 impede uso de options quando for input
}

// 🔹 Tipo para campos de select
interface SelectProps extends CommonProps {
  options: { label: string; value: string }[];
}

// 🔹 União discriminada — TS entende o tipo baseado no valor de `type`
type InputsFieldsProps = InputProps | SelectProps;

export function InputField(props: InputsFieldsProps) {
  const {
    label,
    name,
    register,
    error,
    placeholder,
    type = 'text',
    defaultValue,
    className,
    disabled,
  } = props;
  const baseClass =
    'rounded-md border border-text-secondary px-4 py-2 focus:outline-none cursor-pointer';

  const selectClass = twMerge(
    baseClass,
    'bg-white px-4 py-[0.6rem] cursor-pointer', // padding levemente reduzido
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
          className={twMerge(selectClass)}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder || 'Selecione uma opção'}
          </option>
          {props.options?.map((opt) => (
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
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-details-error">{error.message}</p>
      )}
    </div>
  );
}
