import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vaccine } from '../../types/vaccine';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const VaccineShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vaccineId = parseInt(id || '0', 10);
  const [vaccine, setVaccine] = useState<Vaccine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const data = await apiCall<Vaccine>(`/api/v1/vaccines/${vaccineId}`);
        if (data) {
          setVaccine(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vaccine');
      } finally {
        setLoading(false);
      }
    };

    fetchVaccine();
  }, [vaccineId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vaccine?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/vaccines/${vaccineId}`, {
        method: 'DELETE',
      });
      navigate('/vaccines');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vaccine');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vaccine...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!vaccine) {
    return <div>Vaccine not found</div>;
  }

  return (
    <div className="vaccine-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{vaccine.name}</h1>

        <div className="space-y-4">
          {vaccine.description && (
            <div>
              <span className="font-semibold text-gray-700">Description:</span>
              <p className="text-gray-900 mt-1">{vaccine.description}</p>
            </div>
          )}

          <div>
            <span className="font-semibold text-gray-700">Frequency:</span>
            <p className="text-gray-900 mt-1">
              {vaccine.frequency?.interval_days
                ? `Every ${vaccine.frequency.interval_days} ${vaccine.frequency.interval_days === 1 ? 'day' : 'days'}`
                : `Frequency ID: ${vaccine.frequency_id}`}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/vaccines/${vaccine.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this vaccine
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this vaccine
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/vaccines"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
