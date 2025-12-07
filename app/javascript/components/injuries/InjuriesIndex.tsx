import React, { useState, useEffect } from 'react';
import { Injury } from '../../types/injury';

export const InjuriesIndex: React.FC = () => {
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInjuries();
  }, []);

  const fetchInjuries = async () => {
    try {
      const response = await fetch('/api/v1/injuries', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch injuries');
      }

      const data: Injury[] = await response.json();
      setInjuries(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this injury?')) {
      return;
    }

    try {
      const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

      const response = await fetch(`/api/v1/injuries/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete injury');
      }

      // Remove from local state
      setInjuries(injuries.filter(injury => injury.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading injuries...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="injuries-index max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Injuries</h1>
        <a
          href="/injuries/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Injury
        </a>
      </div>

      {injuries.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">
          <p className="text-gray-600">No injuries found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {injuries.map((injury) => (
            <div key={injury.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    Injury #{injury.id}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Description:</span> {injury.description}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Severity:</span>{' '}
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      injury.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      injury.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      injury.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {injury.severity}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <a
                    href={`/injuries/${injury.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </a>
                  <a
                    href={`/injuries/${injury.id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(injury.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
