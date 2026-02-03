import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useApi } from '../../hooks/useApi';

export const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();

  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await apiCall<Pet>(`/api/v1/pets/${id}`);
        if (data) {
          setPet(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pet');
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id, apiCall]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Unable to load pet details</p>
          <p className="text-red-500 mt-2">This pet may no longer be available.</p>
          <Link
            to="/adopt"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Available Pets
          </Link>
        </div>
      </div>
    );
  }

  if (pet.adopted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {pet.name} Has Been Adopted!
          </h2>
          <p className="text-gray-600">
            This pet has found their forever home. Check out our other available pets!
          </p>
          <Link
            to="/adopt"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            View Available Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        to="/adopt"
        className="inline-block mb-6 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Back to All Pets
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div style={{ height: '24rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            {pet.picture ? (
              <img
                src={pet.picture}
                alt={pet.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-9xl">🐾</span>
              </div>
            )}
          </div>

          {/* Pet Details */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">{pet.name}</h1>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 min-w-[120px]">Type:</span>
                <span className="text-gray-600">
                  {pet.pet_type?.charAt(0).toUpperCase() + pet.pet_type?.slice(1)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 min-w-[120px]">Breed:</span>
                <span className="text-gray-600">{pet.breed}</span>
              </div>
              {pet.birthday && (
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 min-w-[120px]">Age:</span>
                  <span className="text-gray-600">
                    {Math.floor((Date.now() - new Date(pet.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                  </span>
                </div>
              )}
              {pet.gender && (
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 min-w-[120px]">Gender:</span>
                  <span className="text-gray-600">
                    {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                  </span>
                </div>
              )}
              {pet.nickname && (
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 min-w-[120px]">Nickname:</span>
                  <span className="text-gray-600">{pet.nickname}</span>
                </div>
              )}
              {pet.notes && (
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 min-w-[120px]">Notes:</span>
                  <span className="text-gray-600">{pet.notes}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Interested in Adopting {pet.name}?
              </h2>
              <p className="text-gray-600 mb-6">
                Download our adoption application form, fill it out, and submit it to our team.
                We'll review your application and get back to you as soon as possible.
              </p>
              <a
                href="/adoption-application.pdf"
                download="adoption-application.pdf"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Download Adoption Application
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
