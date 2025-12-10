import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Medication } from '../../types/medication';

export const MedicationsIndex: React.FC = () => {
  const { data: medications, loading, error, deleteItem } = useResource<Medication>('/api/v1/medications');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading medications...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="medications-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medications</h1>
        <Link
          to="/medications/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New medication
        </Link>
      </div>

      {medications.length === 0 ? (
        <p className="text-gray-600">No medications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{medication.name}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Amount:</span> {medication.amount}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Purpose:</span> {medication.purpose}
              </p>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Expires:</span>{' '}
                {new Date(medication.expiration_date).toLocaleDateString()}
              </p>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/medications/${medication.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/medications/${medication.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(medication.id)}
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
