import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Frequency, FrequencyFormData } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { FormField } from '../common/FormField';

interface FrequencyFormProps {
  mode: 'new' | 'edit';
}

export const FrequencyForm: React.FC<FrequencyFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const frequencyId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<FrequencyFormData>({
    name: '',
    interval_days: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchFrequency = async () => {
      try {
        const data = await apiCall<Frequency>(`/api/v1/frequencies/${frequencyId}`);
        if (data) {
          setFormData({
            name: data.name,
            interval_days: data.interval_days,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch frequency');
      }
    };

    if (mode === 'edit' && frequencyId) {
      fetchFrequency();
    }
  }, [mode, frequencyId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/frequencies'
        : `/api/v1/frequencies/${frequencyId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const frequency = await apiCall<Frequency>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (frequency) {
        navigate(`/frequencies/${frequency.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'interval_days' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="frequency-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Frequency' : 'Edit Frequency'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter frequency name (e.g., Daily, Weekly, Monthly)"
          />

          <FormField
            label="Interval Days"
            name="interval_days"
            type="number"
            value={formData.interval_days}
            onChange={handleChange}
            required
            placeholder="Enter number of days"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Frequency' : 'Update Frequency'}
            </button>

            <Link
              to="/frequencies"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
