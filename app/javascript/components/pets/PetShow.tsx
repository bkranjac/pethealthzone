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
    <div className="pet-show" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Basic Information Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Basic Information</h2>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            {/* Name and nickname on the left */}
            <div style={{ flex: 1 }}>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{pet.name}</h1>
              {pet.nickname && (
                <p className="text-gray-600 text-lg italic">"{pet.nickname}"</p>
              )}
            </div>

            {/* Photo on the right */}
            {pet.picture && (
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #d1d5db',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
          </div>
        </div>

        {/* Physical Details Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#d1fae5', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Physical Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-3xl mr-2">{getPetTypeIcon(pet.pet_type)}</span>
                Pet Type
              </dt>
              <dd className="ml-11 text-gray-900">{pet.pet_type}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-3xl mr-2">🏷️</span>
                Breed
              </dt>
              <dd className="ml-11 text-gray-900">{pet.breed}</dd>
            </div>
            {pet.gender && (
              <div>
                <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-3xl mr-2">{getGenderIcon(pet.gender)}</span>
                  Gender
                </dt>
                <dd className="ml-11 text-gray-900">{pet.gender}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Dates Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#e9d5ff', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Dates</h2>
          <dl className="space-y-3">
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-3xl mr-2">🎂</span>
                Age
              </dt>
              <dd className="ml-11">
                <div className="text-gray-900">{calculateAge(pet.birthday)}</div>
                <div className="text-sm text-gray-500">Born: {new Date(pet.birthday).toLocaleDateString()}</div>
              </dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <span className="text-3xl mr-2">📅</span>
                Date Admitted
              </dt>
              <dd className="ml-11 text-gray-900">{new Date(pet.date_admitted).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* Notes Section */}
        {pet.notes && (
          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
            <h2 className="text-lg font-bold mb-3 text-gray-800">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{pet.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex pt-4 border-t border-gray-200" style={{ gap: '2rem' }}>
          <Link
            to="/pets"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            ← Back To Pets
          </Link>
          <Link
            to={`/pets/${pet.id}/edit`}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            style={{ marginLeft: '1rem' }}
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
