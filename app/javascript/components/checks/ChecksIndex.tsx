import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Check } from '../../types/check';
import { PostItCard } from '../common/PostItCard';

export const ChecksIndex: React.FC = () => {
  const { data: checks, loading, error, deleteItem } = useResource<Check>('/api/v1/checks');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this check?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading checks...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="checks-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Health Checks</h1>
        <Link
          to="/checks/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Check
        </Link>
      </div>

      {checks.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No checks found. Add your first check to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {checks.map((check, index) => (
            <PostItCard key={check.id} colorIndex={index}>
              <div className="min-h-[180px] flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{check.name}</h2>
                {check.frequency && (
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Every {check.frequency.interval_days}{' '}
                    {check.frequency.interval_days === 1 ? 'day' : 'days'}
                  </p>
                )}

                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-300">
                  <Link
                    to={`/checks/${check.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-2 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/checks/${check.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-2 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(check.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-2 rounded flex-1 transition-colors"
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
