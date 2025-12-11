import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vaccine, VaccineFormData } from '../../types/vaccine';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface VaccineFormProps {
  mode: 'new' | 'edit';
}

export const VaccineForm: React.FC<VaccineFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const vaccineId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<VaccineFormData>({
    name: '',
    description: '',
    frequency_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: frequencies, loading: frequenciesLoading } = useResource<Frequency>('/api/v1/frequencies');

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const data = await apiCall<Vaccine>(`/api/v1/vaccines/${vaccineId}`);
        if (data) {
          setFormData({
            name: data.name,
            description: data.description || '',
            frequency_id: data.frequency_id,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vaccine');
      }
    };

    if (mode === 'edit' && vaccineId) {
      fetchVaccine();
    }
  }, [mode, vaccineId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/vaccines'
        : `/api/v1/vaccines/${vaccineId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const vaccine = await apiCall<Vaccine>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (vaccine) {
        navigate(`/vaccines/${vaccine.id}`);
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
    <div className="vaccine-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Vaccine' : 'Edit Vaccine'}
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
            placeholder="Enter vaccine name"
          />

          <FormField
            label="Description"
            name="description"
            type="text"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter vaccine description"
          />

          <ResourceSelect
            label="Frequency"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleChange}
            options={frequencies}
            getLabel={(freq) => `Every ${freq.interval_days} ${freq.interval_days === 1 ? 'day' : 'days'}`}
            required
            loading={frequenciesLoading}
            placeholder="Select frequency"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Vaccine' : 'Update Vaccine'}
            </button>

            <Link
              to="/vaccines"
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
