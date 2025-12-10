import React from 'react';

interface ResourceSelectProps<T extends { id: number }> {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: T[];
  getLabel: (item: T) => string;
  required?: boolean;
  loading?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function ResourceSelect<T extends { id: number }>({
  label,
  name,
  value,
  onChange,
  options,
  getLabel,
  required = false,
  loading = false,
  placeholder = 'Select...',
  error,
  className = '',
}: ResourceSelectProps<T>) {
  const selectClasses = `
    mt-1 block w-full rounded-md border-gray-300 shadow-sm
    focus:border-blue-500 focus:ring-blue-500 sm:text-sm
    ${error ? 'border-red-500' : ''}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
        className={selectClasses}
      >
        <option value="">
          {loading ? 'Loading...' : placeholder}
        </option>

        {!loading && options.map((item) => (
          <option key={item.id} value={item.id}>
            {getLabel(item)}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
