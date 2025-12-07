import React, { useState, useEffect } from 'react';
import { Pet } from '../../types/pet';

export const PetsIndex: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/v1/pets', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }

      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/pets/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
        },
      });

      if (response.ok) {
        setPets(pets.filter(pet => pet.id !== id));
      } else {
        throw new Error('Failed to delete pet');
      }
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
    <div className="pets-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pets</h1>
        <a
          href="/pets/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Pet
        </a>
      </div>

      {pets.length === 0 ? (
        <p className="text-gray-500">No pets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
              {pet.nickname && (
                <p className="text-gray-600 text-sm mb-2">"{pet.nickname}"</p>
              )}
              <div className="mb-3">
                <p className="text-sm"><span className="font-medium">Type:</span> {pet.pet_type}</p>
                <p className="text-sm"><span className="font-medium">Breed:</span> {pet.breed}</p>
                {pet.gender && (
                  <p className="text-sm"><span className="font-medium">Gender:</span> {pet.gender}</p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Birthday:</span>{' '}
                  {new Date(pet.birthday).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <a
                  href={`/pets/${pet.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-bold py-1 px-3 rounded flex-1 text-center"
                >
                  View
                </a>
                <a
                  href={`/pets/${pet.id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-3 rounded flex-1 text-center"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(pet.id)}
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
