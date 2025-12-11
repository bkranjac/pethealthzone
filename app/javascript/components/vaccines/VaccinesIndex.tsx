import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Vaccine } from '../../types/vaccine';

export const VaccinesIndex: React.FC = () => {
  const { data: vaccines, loading, error, deleteItem } = useResource<Vaccine>('/api/v1/vaccines');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vaccine?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vaccines...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="vaccines-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vaccines</h1>
        <Link
          to="/vaccines/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New vaccine
        </Link>
      </div>

      {vaccines.length === 0 ? (
        <p className="text-gray-600">No vaccines found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccines.map((vaccine) => (
            <div
              key={vaccine.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{vaccine.name}</h2>
              {vaccine.description && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Description:</span> {vaccine.description}
                </p>
              )}
              {vaccine.frequency && (
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Frequency:</span> Every {vaccine.frequency.interval_days}{' '}
                  {vaccine.frequency.interval_days === 1 ? 'day' : 'days'}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/vaccines/${vaccine.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/vaccines/${vaccine.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(vaccine.id)}
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
