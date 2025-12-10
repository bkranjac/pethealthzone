import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Medication } from '../../types/medication';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const MedicationShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const medicationId = parseInt(id || '0', 10);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const data = await apiCall<Medication>(`/api/v1/medications/${medicationId}`);
        if (data) {
          setMedication(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch medication');
      } finally {
        setLoading(false);
      }
    };

    fetchMedication();
  }, [medicationId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/medications/${medicationId}`, {
        method: 'DELETE',
      });
      navigate('/medications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading medication...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!medication) {
    return <div>Medication not found</div>;
  }

  return (
    <div className="medication-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{medication.name}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Amount:</span>
            <p className="text-gray-900 mt-1">{medication.amount}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Purpose:</span>
            <p className="text-gray-900 mt-1">{medication.purpose}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Expiration Date:</span>
            <p className="text-gray-900 mt-1">
              {new Date(medication.expiration_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/medications/${medication.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this medication
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this medication
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/medications"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
