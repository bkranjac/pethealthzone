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
    <div className="injury-form" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === 'edit' ? 'Edit Injury' : 'Report New Injury'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        {/* Injury Details Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Injury Details</h2>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the injury in detail..."
            />
          </div>
        </div>

        {/* Severity Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Severity Level</h2>
          <div>
            <label htmlFor="severity" className="block text-sm font-semibold text-gray-700 mb-1">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select severity level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-8 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Injury' : 'Report Injury'}
          </button>
          <Link
            to="/injuries"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
