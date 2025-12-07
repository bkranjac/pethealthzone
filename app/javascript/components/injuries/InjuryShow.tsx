import React, { useState, useEffect } from 'react';
import { Injury } from '../../types/injury';

interface InjuryShowProps {
  injuryId: number;
}

export const InjuryShow: React.FC<InjuryShowProps> = ({ injuryId }) => {
  const [injury, setInjury] = useState<Injury | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInjury();
  }, [injuryId]);

  const fetchInjury = async () => {
    try {
      const response = await fetch(`/api/v1/injuries/${injuryId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch injury');
      }

      const data: Injury = await response.json();
      setInjury(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this injury?')) {
      return;
    }

    try {
      const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

      const response = await fetch(`/api/v1/injuries/${injuryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        try {
          window.location.assign('/injuries');
        } catch (navError) {
          // JSDOM throws "Not implemented: navigation" errors in test environment
          // Ignore only navigation errors, let other errors propagate
          if (navError instanceof Error && !navError.message.includes('navigation')) {
            throw navError;
          }
        }
      } else {
        throw new Error('Failed to delete injury');
      }
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
            <a
              href={`/injuries/${injury.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </a>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
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
          <a
            href="/injuries"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Injuries
          </a>
        </div>
      </div>
    </div>
  );
};
