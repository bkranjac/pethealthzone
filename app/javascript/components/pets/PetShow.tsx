import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { calculateAge, getPetTypeIcon, getGenderIcon } from '../../utils/dateUtils';

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
      <div className="bg-white shadow rounded-lg p-6" style={{ position: 'relative' }}>
        {pet.picture && (
          <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
            <div
              style={{
                width: '256px',
                height: '256px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #d1d5db',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={pet.picture}
                alt={pet.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        <div className="mb-6" style={{ marginRight: pet.picture ? '280px' : '0' }}>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">{pet.name}</h1>
          {pet.nickname && (
            <p className="text-gray-600 text-xl italic">"{pet.nickname}"</p>
          )}
        </div>

        {/* Pet Information Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6" style={{ marginRight: pet.picture ? '280px' : '0' }}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Information</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-2xl mr-2">{getPetTypeIcon(pet.pet_type)}</span>
                Pet Type
              </dt>
              <dd className="ml-9 text-gray-900">{pet.pet_type}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-2xl mr-2">🏷️</span>
                Breed
              </dt>
              <dd className="ml-9 text-gray-900">{pet.breed}</dd>
            </div>
            {pet.gender && (
              <div>
                <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-2xl mr-2">{getGenderIcon(pet.gender)}</span>
                  Gender
                </dt>
                <dd className="ml-9 text-gray-900">{pet.gender}</dd>
              </div>
            )}
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-2xl mr-2">🎂</span>
                Age
              </dt>
              <dd className="ml-9">
                <div className="text-gray-900">{calculateAge(pet.birthday)}</div>
                <div className="text-sm text-gray-500">Born: {new Date(pet.birthday).toLocaleDateString()}</div>
              </dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-2xl mr-2">📅</span>
                Date Admitted
              </dt>
              <dd className="ml-9 text-gray-900">{new Date(pet.date_admitted).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* Notes Section */}
        {pet.notes && (
          <div className="bg-amber-50 rounded-lg p-6 mb-6" style={{ marginRight: pet.picture ? '280px' : '0' }}>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{pet.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/pets"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            ← Back to Pets
          </Link>
          <Link
            to={`/pets/${pet.id}/edit`}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
