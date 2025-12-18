import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useResource } from '../../hooks/useResource';
import { PostItCard } from '../common/PostItCard';
import { calculateAge, getPetTypeIcon, getGenderIcon } from '../../utils/dateUtils';

export const PetsIndex: React.FC = () => {
  const { data: pets, loading, error, deleteItem } = useResource<Pet>('/api/v1/pets');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [filterGender, setFilterGender] = React.useState('');

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

  // Filter pets based on search and filters
  const filteredPets = React.useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = searchTerm === '' ||
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.pet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.nickname && pet.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === '' || pet.pet_type.toLowerCase() === filterType.toLowerCase();
      const matchesGender = filterGender === '' || pet.gender?.toLowerCase() === filterGender.toLowerCase();

      return matchesSearch && matchesType && matchesGender;
    });
  }, [pets, searchTerm, filterType, filterGender]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterGender('');
  };

  // Get unique pet types and genders for filter options
  const petTypes = React.useMemo(() =>
    Array.from(new Set(pets.map(p => p.pet_type))).sort(),
    [pets]
  );

  const genders = React.useMemo(() =>
    Array.from(new Set(pets.map(p => p.gender).filter(Boolean))).sort(),
    [pets]
  );

  if (loading) {
    return <div className="text-center p-4">Loading pets...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="pets-index max-w-7xl mx-auto px-4 py-8">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pet-card-entrance {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">My Pets</h1>
        <Link
          to="/pets/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add New Pet
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, breed, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="min-w-[150px]">
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
              Pet Type
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {petTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label htmlFor="filterGender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="filterGender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          {(searchTerm || filterType || filterGender) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredPets.length} of {pets.length} pet{pets.length !== 1 ? 's' : ''}
          {(searchTerm || filterType || filterGender) && ' (filtered)'}
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pets found. Add your first pet to get started!</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pets match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
          {filteredPets.map((pet, index) => (
            <div
              key={pet.id}
              className="pet-card-entrance"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PostItCard colorIndex={index}>
              <div className="flex flex-col h-full" style={{ minHeight: '140px', position: 'relative' }}>
                {pet.picture && (
                  <div style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 10 }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #d1d5db',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
                <h2 className="text-lg font-bold mb-1 text-gray-800">{pet.name}</h2>
                <p className="text-gray-600 italic text-xs mb-2" style={{ minHeight: '16px' }}>
                  {pet.nickname ? `"${pet.nickname}"` : '\u00A0'}
                </p>

                <div className="flex-1">
                  <div className="space-y-0.5">
                    <p className="text-xs">
                      <span className="text-xl mr-1">{getPetTypeIcon(pet.pet_type)}</span>
                      <span className="font-semibold text-gray-700">Type:</span>{' '}
                      <span className="text-gray-600">{pet.pet_type}</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-xl mr-1">🏷️</span>
                      <span className="font-semibold text-gray-700">Breed:</span>{' '}
                      <span className="text-gray-600">{pet.breed}</span>
                    </p>
                    {pet.gender && (
                      <p className="text-xs">
                        <span className="text-xl mr-1">{getGenderIcon(pet.gender)}</span>
                        <span className="font-semibold text-gray-700">Gender:</span>{' '}
                        <span className="text-gray-600">{pet.gender}</span>
                      </p>
                    )}
                    <p className="text-xs">
                      <span className="text-xl mr-1">🎂</span>
                      <span className="font-semibold text-gray-700">Age:</span>{' '}
                      <span className="text-gray-600">{calculateAge(pet.birthday)}</span>
                    </p>
                    <p className="text-xs text-gray-500 ml-6">
                      Born: {new Date(pet.birthday).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-300">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block no-underline"
                    style={{ textDecoration: 'none', fontSize: '10px', padding: '6px 8px' }}
                  >
                    View
                  </Link>
                  <Link
                    to={`/pets/${pet.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block no-underline"
                    style={{ textDecoration: 'none', fontSize: '10px', padding: '6px 8px' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block border-0"
                    style={{ cursor: 'pointer', fontSize: '10px', padding: '6px 8px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </PostItCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
