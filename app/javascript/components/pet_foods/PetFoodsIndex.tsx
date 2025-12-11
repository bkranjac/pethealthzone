import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { PetFood } from '../../types/petFood';

export const PetFoodsIndex: React.FC = () => {
  const { data: petFoods, loading, error, deleteItem } = useResource<PetFood>('/api/v1/pet_foods');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this pet food?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pet foods...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="pet-foods-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pet Foods</h1>
        <Link
          to="/pet_foods/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New pet food
        </Link>
      </div>

      {petFoods.length === 0 ? (
        <p className="text-gray-600">No pet foods found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {petFoods.map((petFood) => (
            <div
              key={petFood.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <span className="font-medium text-gray-700">Pet ID:</span> {petFood.pet_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Food ID:</span> {petFood.food_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Frequency ID:</span> {petFood.frequency_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Started:</span>{' '}
                {new Date(petFood.date_started).toLocaleDateString()}
              </div>
              {petFood.date_ended && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Ended:</span>{' '}
                  {new Date(petFood.date_ended).toLocaleDateString()}
                </div>
              )}
              {petFood.notes && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Notes:</span> {petFood.notes}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/pet_foods/${petFood.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/pet_foods/${petFood.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(petFood.id)}
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
