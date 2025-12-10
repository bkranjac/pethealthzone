import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Frequency } from '../../types/frequency';

export const FrequenciesIndex: React.FC = () => {
  const { data: frequencies, loading, error, deleteItem } = useResource<Frequency>('/api/v1/frequencies');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this frequency?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading frequencies...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="frequencies-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Frequencies</h1>
        <Link
          to="/frequencies/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New frequency
        </Link>
      </div>

      {frequencies.length === 0 ? (
        <p className="text-gray-600">No frequencies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frequencies.map((frequency) => (
            <div
              key={frequency.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                Every {frequency.interval_days} {frequency.interval_days === 1 ? 'day' : 'days'}
              </h2>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/frequencies/${frequency.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-bold py-1 px-3 rounded flex-1 text-center"
                >
                  View
                </Link>
                <Link
                  to={`/frequencies/${frequency.id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-3 rounded flex-1 text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(frequency.id)}
                  className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded flex-1"
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
