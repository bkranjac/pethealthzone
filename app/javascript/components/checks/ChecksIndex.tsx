import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Check } from '../../types/check';

export const ChecksIndex: React.FC = () => {
  const { data: checks, loading, error, deleteItem } = useResource<Check>('/api/v1/checks');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this check?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading checks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="checks-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Checks</h1>
        <Link
          to="/checks/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New check
        </Link>
      </div>

      {checks.length === 0 ? (
        <p className="text-gray-600">No checks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{check.name}</h2>
              {check.frequency && (
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Frequency:</span> Every {check.frequency.interval_days}{' '}
                  {check.frequency.interval_days === 1 ? 'day' : 'days'}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/checks/${check.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/checks/${check.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(check.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
