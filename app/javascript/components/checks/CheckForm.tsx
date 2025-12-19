import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, CheckFormData } from '../../types/check';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface CheckFormProps {
  mode: 'new' | 'edit';
}

export const CheckForm: React.FC<CheckFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const checkId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<CheckFormData>({
    check_type: '',
    frequency_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: frequencies, loading: frequenciesLoading } = useResource<Frequency>('/api/v1/frequencies');

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        const data = await apiCall<Check>(`/api/v1/checks/${checkId}`);
        if (data) {
          setFormData({
            check_type: data.check_type,
            frequency_id: data.frequency_id,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch check');
      }
    };

    if (mode === 'edit' && checkId) {
      fetchCheck();
    }
  }, [mode, checkId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/checks'
        : `/api/v1/checks/${checkId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const check = await apiCall<Check>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (check) {
        navigate(`/checks/${check.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequency_id' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="check-form" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'new' ? 'New Check' : 'Edit Check'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3">📋 Basic Information</h2>
          <FormField
            label="Check Type"
            name="check_type"
            type="text"
            value={formData.check_type}
            onChange={handleChange}
            required
            placeholder="Enter check type (e.g., Physical, Dental)"
          />
        </div>

        {/* Frequency */}
        <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3">📅 Frequency</h2>
          <ResourceSelect
            label="How Often"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleChange}
            options={frequencies}
            getLabel={(freq) => freq.name}
            required
            loading={frequenciesLoading}
            placeholder="Select frequency"
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'new' ? 'Create Check' : 'Update Check'}
          </button>

          <Link
            to="/checks"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
