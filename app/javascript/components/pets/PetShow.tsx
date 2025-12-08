import React, { useState, useEffect } from 'react';
import { Pet } from '../../types/pet';

interface PetShowProps {
  petId: number;
}

export const PetShow: React.FC<PetShowProps> = ({ petId }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      const response = await fetch(`/api/v1/pets/${petId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pet');
      }

      const data = await response.json();
      setPet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
        },
      });

      if (response.ok) {
        try {
          window.location.assign('/pets');
        } catch (navError) {
          // JSDOM throws "Not implemented: navigation" errors in test environment
          // Ignore only navigation errors, let other errors propagate
          if (navError instanceof Error && !navError.message.includes('navigation')) {
            throw navError;
          }
        }
      } else {
        throw new Error('Failed to delete pet');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading pet...</div>;
  }

  if (error || !pet) {
    return <div className="text-center p-4 text-red-600">Error: {error || 'Pet not found'}</div>;
  }

  return (
    <div className="pet-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
            {pet.nickname && (
              <p className="text-gray-600 text-lg">"{pet.nickname}"</p>
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={`/pets/${pet.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit this pet
            </a>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Destroy this pet
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="font-semibold text-gray-700">Type:</dt>
            <dd className="mt-1">{pet.pet_type}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Breed:</dt>
            <dd className="mt-1">{pet.breed}</dd>
          </div>
          {pet.gender && (
            <div>
              <dt className="font-semibold text-gray-700">Gender:</dt>
              <dd className="mt-1">{pet.gender}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-gray-700">Birthday:</dt>
            <dd className="mt-1">{new Date(pet.birthday).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Date Admitted:</dt>
            <dd className="mt-1">{new Date(pet.date_admitted).toLocaleDateString()}</dd>
          </div>
          {pet.notes && (
            <div>
              <dt className="font-semibold text-gray-700">Notes:</dt>
              <dd className="mt-1 whitespace-pre-wrap">{pet.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6">
          <a
            href="/pets"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
};
