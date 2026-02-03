import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Pet } from '../../types/pet';

export const AdoptablePets: React.FC = () => {
  const { data: pets, loading, error } = useResource<Pet>('/api/v1/pets', { autoFetch: true });

  // Filter for available pets (not adopted)
  const availablePets = pets?.filter(pet => !pet.adopted) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Available Pets for Adoption
        </h1>
        <p className="text-lg text-gray-600">
          Meet our wonderful animals looking for their forever homes. Each pet has been carefully
          cared for and is ready to become part of your family.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading available pets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Unable to load pets</p>
          <p className="text-red-500 mt-2">Please try again later or contact us for assistance.</p>
        </div>
      )}

      {!loading && !error && availablePets.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Pets Available Right Now
          </h2>
          <p className="text-gray-600">
            All of our pets have found loving homes! Check back soon for new arrivals.
          </p>
        </div>
      )}

      {!loading && !error && availablePets.length > 0 && (
        <>
          <div className="mb-6 text-gray-700">
            <span className="font-semibold">{availablePets.length}</span>{' '}
            {availablePets.length === 1 ? 'pet' : 'pets'} available for adoption
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availablePets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {pet.picture ? (
                  <div style={{ width: '100%', height: '16rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                    <img
                      src={pet.picture}
                      alt={pet.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl">🐾</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {pet.name}
                  </h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <p className="flex items-center">
                      <span className="font-semibold min-w-[80px]">Type:</span>
                      <span>{pet.pet_type?.charAt(0).toUpperCase() + pet.pet_type?.slice(1)}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold min-w-[80px]">Breed:</span>
                      <span>{pet.breed}</span>
                    </p>
                    {pet.birthday && (
                      <p className="flex items-center">
                        <span className="font-semibold min-w-[80px]">Age:</span>
                        <span>{Math.floor((Date.now() - new Date(pet.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years</span>
                      </p>
                    )}
                    {pet.gender && (
                      <p className="flex items-center">
                        <span className="font-semibold min-w-[80px]">Gender:</span>
                        <span>{pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</span>
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/adopt/${pet.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
