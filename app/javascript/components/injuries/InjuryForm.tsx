import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Injury } from '../../types/injury';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

interface InjuryFormProps {
  mode: 'new' | 'edit';
}

interface FormData {
  description: string;
  severity: string;
}

export const InjuryForm: React.FC<InjuryFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const injuryId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<FormData>({
    description: '',
    severity: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchInjury = async () => {
      try {
        const injury = await apiCall<Injury>(`/api/v1/injuries/${injuryId}`);
        if (injury) {
          setFormData({
            description: injury.description,
            severity: injury.severity,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    if (mode === 'edit' && injuryId) {
      fetchInjury();
    }
  }, [mode, injuryId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' ? `/api/v1/injuries/${injuryId}` : '/api/v1/injuries';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const injury = await apiCall<Injury>(url, {
        method,
        body: JSON.stringify({ injury: formData }),
      });

      if (injury) {
        navigate(`/injuries/${injury.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="injury-form max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'edit' ? 'Edit Injury' : 'New Injury'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the injury..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="severity" className="block font-semibold mb-2">
            Severity <span className="text-red-500">*</span>
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Injury' : 'Create Injury'}
          </button>
          <Link
            to="/injuries"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};
