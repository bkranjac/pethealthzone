import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const PetShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const petId = parseInt(id || '0', 10);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await apiCall<Pet>(`/api/v1/pets/${petId}`);
        setPet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/pets/${petId}`, { method: 'DELETE' });
      navigate('/pets');
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
            <Link
              to={`/pets/${pet.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit this pet
            </Link>
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
          <Link
            to="/pets"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
