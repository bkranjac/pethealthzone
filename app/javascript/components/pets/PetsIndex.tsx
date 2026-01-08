import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { useResource } from '../../hooks/useResource';
import { useApi } from '../../hooks/useApi';
import { PostItCard } from '../common/PostItCard';
import { calculateAge, getPetTypeIcon, getGenderIcon } from '../../utils/dateUtils';

export const PetsIndex: React.FC = () => {
  const { data: pets, loading, error, deleteItem, refetch } = useResource<Pet>('/api/v1/pets');
  const { apiCall } = useApi();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [filterGender, setFilterGender] = React.useState('');
  const [expandedPetId, setExpandedPetId] = React.useState<number | null>(null);
  const [editingPetId, setEditingPetId] = React.useState<number | null>(null);
  const [editFormData, setEditFormData] = React.useState<Partial<Pet>>({});

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

  const handleEditStart = (pet: Pet) => {
    setEditingPetId(pet.id);
    setExpandedPetId(null); // Close any expanded view
    setEditFormData({
      name: pet.name,
      nickname: pet.nickname || '',
      pet_type: pet.pet_type,
      breed: pet.breed,
      gender: pet.gender,
      birthday: pet.birthday,
      date_admitted: pet.date_admitted,
      notes: pet.notes || '',
      picture: pet.picture || '',
    });
  };

  const handleEditCancel = () => {
    setEditingPetId(null);
    setEditFormData({});
  };

  const handleEditSave = async (id: number) => {
    try {
      await apiCall<Pet>(`/api/v1/pets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ pet: editFormData }),
      });
      setEditingPetId(null);
      setEditFormData({});
      // Refetch the pet list to get updated data
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update pet');
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedPetId(expandedPetId === id ? null : id);
    setEditingPetId(null); // Close any edit form
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
        .expanded-content {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
      `}</style>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Pets</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#dbeafe', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
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
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No pets found. Add your first pet to get started!</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No pets match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Grid of Pet Cards with Add New button */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>

          {filteredPets.map((pet, index) => {
            const isExpanded = expandedPetId === pet.id;
            const isEditing = editingPetId === pet.id;

            return (
              <div
                key={pet.id}
                className="pet-card-entrance"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  gridColumn: 'span 1'
                }}
              >
                <PostItCard colorIndex={index}>
                  <div className="flex flex-col h-full" style={{ minHeight: isExpanded || isEditing ? 'auto' : '140px', position: 'relative' }}>
                    {/* Pet picture */}
                    {pet.picture && !isEditing && (
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

                    {/* EDITING MODE */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold mb-2 text-gray-800">Edit Pet</h2>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Nickname</label>
                          <input
                            type="text"
                            value={editFormData.nickname || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Pet Type</label>
                          <input
                            type="text"
                            value={editFormData.pet_type || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, pet_type: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Breed</label>
                          <input
                            type="text"
                            value={editFormData.breed || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, breed: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                          <select
                            value={editFormData.gender || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Birthday</label>
                          <input
                            type="date"
                            value={editFormData.birthday || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, birthday: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Date Admitted</label>
                          <input
                            type="date"
                            value={editFormData.date_admitted || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, date_admitted: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Picture URL</label>
                          <input
                            type="text"
                            value={editFormData.picture || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, picture: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={editFormData.notes || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-300">
                          <button
                            onClick={() => handleEditSave(pet.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded flex-1 transition-colors"
                            style={{ fontSize: '10px', padding: '6px 8px' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded flex-1 transition-colors"
                            style={{ fontSize: '10px', padding: '6px 8px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* NORMAL/EXPANDED VIEW */
                      <>
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
                            {!isExpanded && (
                              <p className="text-xs text-gray-500 ml-6">
                                Born: {new Date(pet.birthday).toLocaleDateString()}
                              </p>
                            )}

                            {/* EXPANDED DETAILS */}
                            {isExpanded && (
                              <div className="expanded-content mt-3 pt-3 border-t border-gray-300 space-y-2">
                                <p className="text-xs">
                                  <span className="text-xl mr-1">📅</span>
                                  <span className="font-semibold text-gray-700">Birthday:</span>{' '}
                                  <span className="text-gray-600">{new Date(pet.birthday).toLocaleDateString()}</span>
                                </p>
                                <p className="text-xs">
                                  <span className="text-xl mr-1">📌</span>
                                  <span className="font-semibold text-gray-700">Admitted:</span>{' '}
                                  <span className="text-gray-600">{new Date(pet.date_admitted).toLocaleDateString()}</span>
                                </p>
                                {pet.notes && (
                                  <div className="mt-2 p-2 bg-white bg-opacity-40 rounded">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">📝 Notes:</p>
                                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{pet.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-300">
                          <button
                            onClick={() => toggleExpanded(pet.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex-1 text-center transition-colors"
                            style={{ fontSize: '10px', padding: '6px 8px' }}
                          >
                            {isExpanded ? '▲ Less' : '▼ More'}
                          </button>
                          <button
                            onClick={() => handleEditStart(pet)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex-1 text-center transition-colors"
                            style={{ fontSize: '10px', padding: '6px 8px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pet.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded flex-1 text-center transition-colors border-0"
                            style={{ cursor: 'pointer', fontSize: '10px', padding: '6px 8px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </PostItCard>
              </div>
            );
          })}

          {/* Add New Pet Button Card - After all pets */}
          <Link
            to="/pets/new"
            className="pet-card-entrance"
            title="Add New Pet"
            style={{
              gridColumn: 'span 1',
              animationDelay: `${filteredPets.length * 0.1}s`,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              padding: '1rem',
            }}
          >
            <div
              className="inline-flex items-center justify-center text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#bbf7d0',
                border: '3px solid #86efac',
              }}
            >
              <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="#16a34a" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '14px', fontWeight: '600', color: '#16a34a', textAlign: 'center' }}>
              Add New Pet
            </div>
          </Link>
          </div>
        </div>
      )}
    </div>
  );
};
