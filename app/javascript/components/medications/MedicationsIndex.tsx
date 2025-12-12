import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Medication } from '../../types/medication';
import { PostItCard } from '../common/PostItCard';

export const MedicationsIndex: React.FC = () => {
  const { data: medications, loading, error, deleteItem } = useResource<Medication>('/api/v1/medications');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading medications...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="medications-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Medications</h1>
        <Link
          to="/medications/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Medication
        </Link>
      </div>

      {medications.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No medications found. Add your first medication to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medications.map((medication, index) => (
            <PostItCard key={medication.id} colorIndex={index}>
              <div className="min-h-[220px] flex flex-col">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{medication.name}</h2>
                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Amount:</span>{' '}
                      <span className="text-gray-600">{medication.amount}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Purpose:</span>{' '}
                      <span className="text-gray-600">{medication.purpose}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Expires:</span>{' '}
                      <span className="text-gray-600">
                        {new Date(medication.expiration_date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/medications/${medication.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/medications/${medication.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(medication.id)}
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
