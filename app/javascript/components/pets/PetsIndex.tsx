import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useResource } from '../../hooks/useResource';
import { PostItCard } from '../common/PostItCard';

export const PetsIndex: React.FC = () => {
  const { data: pets, loading, error, deleteItem } = useResource<Pet>('/api/v1/pets');

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      await deleteItem(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading pets...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="pets-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Pets</h1>
        <Link
          to="/pets/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add New Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pets found. Add your first pet to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet, index) => (
            <PostItCard key={pet.id} colorIndex={index}>
              <div className="min-h-[250px] flex flex-col">
                <h2 className="text-2xl font-bold mb-1 text-gray-800">{pet.name}</h2>
                {pet.nickname && (
                  <p className="text-gray-600 italic text-sm mb-3">"{pet.nickname}"</p>
                )}

                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Type:</span>{' '}
                      <span className="text-gray-600">{pet.pet_type}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Breed:</span>{' '}
                      <span className="text-gray-600">{pet.breed}</span>
                    </p>
                    {pet.gender && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Gender:</span>{' '}
                        <span className="text-gray-600">{pet.gender}</span>
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Birthday:</span>{' '}
                      <span className="text-gray-600">
                        {new Date(pet.birthday).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/pets/${pet.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(pet.id)}
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
