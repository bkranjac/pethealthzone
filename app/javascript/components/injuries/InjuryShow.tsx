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
    <div className="injury-show" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Basic Information Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Injury Details</h2>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Injury #{injury.id}</h1>
          <div>
            <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
              <span className="text-3xl mr-2">📝</span>
              Description
            </dt>
            <dd className="ml-11 text-gray-900">{injury.description}</dd>
          </div>
        </div>

        {/* Severity Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Severity</h2>
          <div>
            <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
              <span className="text-3xl mr-2">⚠️</span>
              Level
            </dt>
            <dd className="ml-11">
              <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                injury.severity === 'critical' ? 'bg-red-700 text-white' :
                injury.severity === 'high' ? 'bg-orange-600 text-white' :
                injury.severity === 'medium' ? 'bg-yellow-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {injury.severity}
              </span>
            </dd>
          </div>
        </div>

        {/* Timestamps Section */}
        {(injury.created_at || injury.updated_at) && (
          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#e9d5ff', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
            <h2 className="text-lg font-bold mb-3 text-gray-800">Timestamps</h2>
            <dl className="space-y-3">
              {injury.created_at && (
                <div>
                  <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-3xl mr-2">📅</span>
                    Created
                  </dt>
                  <dd className="ml-11 text-gray-900">
                    {new Date(injury.created_at).toLocaleString()}
                  </dd>
                </div>
              )}
              {injury.updated_at && (
                <div>
                  <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-3xl mr-2">🔄</span>
                    Last Updated
                  </dt>
                  <dd className="ml-11 text-gray-900">
                    {new Date(injury.updated_at).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex pt-4 border-t border-gray-200" style={{ gap: '2rem' }}>
          <Link
            to="/injuries"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            ← Back To Injuries
          </Link>
          <Link
            to={`/injuries/${injury.id}/edit`}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            style={{ marginLeft: '1rem' }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
