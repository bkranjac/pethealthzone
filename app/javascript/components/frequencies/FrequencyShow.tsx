import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const FrequencyShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const frequencyId = parseInt(id || '0', 10);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchFrequency = async () => {
      try {
        const data = await apiCall<Frequency>(`/api/v1/frequencies/${frequencyId}`);
        setFrequency(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFrequency();
  }, [frequencyId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this frequency?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/frequencies/${frequencyId}`, { method: 'DELETE' });
      navigate('/frequencies');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading frequency...</div>;
  }

  if (error || !frequency) {
    return <div className="text-center p-4 text-red-600">Error: {error || 'Frequency not found'}</div>;
  }

  return (
    <div className="frequency-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Every {frequency.interval_days} {frequency.interval_days === 1 ? 'day' : 'days'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/frequencies/${frequency.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit this frequency
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Destroy this frequency
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="font-semibold text-gray-700">Interval Days:</dt>
            <dd className="mt-1">{frequency.interval_days}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            to="/frequencies"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
