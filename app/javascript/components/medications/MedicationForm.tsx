import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Medication, MedicationFormData } from '../../types/medication';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { FormField } from '../common/FormField';

interface MedicationFormProps {
  mode: 'new' | 'edit';
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const medicationId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    amount: '',
    purpose: '',
    expiration_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const data = await apiCall<Medication>(`/api/v1/medications/${medicationId}`);
        if (data) {
          setFormData({
            name: data.name,
            amount: data.amount,
            purpose: data.purpose,
            expiration_date: data.expiration_date,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch medication');
      }
    };

    if (mode === 'edit' && medicationId) {
      fetchMedication();
    }
  }, [mode, medicationId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/medications'
        : `/api/v1/medications/${medicationId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const medication = await apiCall<Medication>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (medication) {
        navigate(`/medications/${medication.id}`);
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
      [name]: value,
    }));
  };

  return (
    <div className="medication-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Medication' : 'Edit Medication'}
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
            placeholder="Enter medication name"
          />

          <FormField
            label="Amount"
            name="amount"
            type="text"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount (e.g., 10mg)"
          />

          <FormField
            label="Purpose"
            name="purpose"
            type="text"
            value={formData.purpose}
            onChange={handleChange}
            required
            placeholder="Enter purpose"
          />

          <FormField
            label="Expiration Date"
            name="expiration_date"
            type="date"
            value={formData.expiration_date}
            onChange={handleChange}
            required
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Medication' : 'Update Medication'}
            </button>

            <Link
              to="/medications"
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
