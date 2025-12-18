import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Vaccine } from '../../types/vaccine';
import { PostItCard } from '../common/PostItCard';

export const VaccinesIndex: React.FC = () => {
  const { data: vaccines, loading, error, deleteItem } = useResource<Vaccine>('/api/v1/vaccines');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vaccine?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading vaccines...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="vaccines-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Vaccines</h1>
        <Link
          to="/vaccines/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Vaccine
        </Link>
      </div>

      {vaccines.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No vaccines found. Add your first vaccine to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vaccines.map((vaccine, index) => (
            <PostItCard key={vaccine.id} colorIndex={index}>
              <div className="min-h-[200px] flex flex-col">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{vaccine.name}</h2>
                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Required:</span>{' '}
                      <span className="text-gray-600">{vaccine.mandatory ? 'Yes' : 'No'}</span>
                    </p>
                    {vaccine.frequency && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Frequency:</span>{' '}
                        <span className="text-gray-600">
                          Every {vaccine.frequency.interval_days}{' '}
                          {vaccine.frequency.interval_days === 1 ? 'day' : 'days'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/vaccines/${vaccine.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/vaccines/${vaccine.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vaccine.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </PostItCard>
          ))}
        </div>
      )}
    </div>
  );
};
