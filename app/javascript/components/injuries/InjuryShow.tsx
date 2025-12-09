import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Injury } from '../../types/injury';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const InjuryShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const injuryId = parseInt(id || '0', 10);
  const [injury, setInjury] = useState<Injury | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchInjury = async () => {
      try {
        const data = await apiCall<Injury>(`/api/v1/injuries/${injuryId}`);
        setInjury(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchInjury();
  }, [injuryId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this injury?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/injuries/${injuryId}`, { method: 'DELETE' });
      navigate('/injuries');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading injury...</div>;
  }

  if (error || !injury) {
    return <div className="text-center p-4 text-red-600">Error: {error || 'Injury not found'}</div>;
  }

  return (
    <div className="injury-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Injury #{injury.id}</h1>
          <div className="flex gap-2">
            <Link
              to={`/injuries/${injury.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit this injury
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Destroy this injury
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="font-semibold text-gray-700">Description:</dt>
            <dd className="mt-1 text-gray-900">{injury.description}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Severity:</dt>
            <dd className="mt-1">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                injury.severity === 'critical' ? 'bg-red-100 text-red-800' :
                injury.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                injury.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {injury.severity}
              </span>
            </dd>
          </div>
          {injury.created_at && (
            <div>
              <dt className="font-semibold text-gray-700">Created:</dt>
              <dd className="mt-1 text-gray-900">
                {new Date(injury.created_at).toLocaleString()}
              </dd>
            </div>
          )}
          {injury.updated_at && (
            <div>
              <dt className="font-semibold text-gray-700">Last Updated:</dt>
              <dd className="mt-1 text-gray-900">
                {new Date(injury.updated_at).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6">
          <Link
            to="/injuries"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
