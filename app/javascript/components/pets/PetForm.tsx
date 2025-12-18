import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pet, PetFormData } from '../../types/pet';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

interface PetFormProps {
  mode: 'new' | 'edit';
}

export const PetForm: React.FC<PetFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const petId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<PetFormData>({
    pet_type: '',
    breed: '',
    picture: '',
    birthday: '',
    name: '',
    nickname: '',
    gender: '',
    date_admitted: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const pet = await apiCall<Pet>(`/api/v1/pets/${petId}`);
        if (pet) {
          setFormData({
            pet_type: pet.pet_type,
            breed: pet.breed,
            picture: pet.picture || '',
            birthday: pet.birthday,
            name: pet.name,
            nickname: pet.nickname || '',
            gender: pet.gender || '',
            date_admitted: pet.date_admitted,
            notes: pet.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    if (mode === 'edit' && petId) {
      fetchPet();
    }
  }, [mode, petId, apiCall]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' ? `/api/v1/pets/${petId}` : '/api/v1/pets';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const pet = await apiCall<Pet>(url, {
        method,
        body: JSON.stringify({ pet: formData }),
      });

      if (pet) {
        navigate(`/pets/${pet.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality compression (0.7 = 70% quality)
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(resizedBase64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB before resize)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    try {
      // Resize image to max 400x400 while maintaining aspect ratio
      const resizedBase64 = await resizeImage(file, 400, 400);

      // Log the size for debugging
      console.log('Original file size:', (file.size / 1024).toFixed(2), 'KB');
      console.log('Resized base64 length:', (resizedBase64.length / 1024).toFixed(2), 'KB');

      setFormData(prev => ({ ...prev, picture: resizedBase64 }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  return (
    <div className="pet-form" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === 'edit' ? 'Edit Pet' : 'Add New Pet'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6" style={{ position: 'relative', width: '100%' }}>
        {/* Basic Information Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Basic Information</h2>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            {/* Fields on the left */}
            <div className="space-y-3" style={{ flex: 1 }}>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Buddy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="e.g., Bud"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Photo Preview on the right */}
            {formData.picture && (
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
                    src={formData.picture}
                    alt="Pet preview"
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
          <div className="space-y-3">
            <div>
              <label htmlFor="pet_type" className="block text-sm font-semibold text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="pet_type"
                name="pet_type"
                value={formData.pet_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Hamster">Hamster</option>
                <option value="Guinea Pig">Guinea Pig</option>
                <option value="Reptile">Reptile</option>
                <option value="Turtle">Turtle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-1">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Labrador"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#e9d5ff', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Dates</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="birthday" className="block text-sm font-semibold text-gray-700 mb-1">
                Birthday <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date_admitted" className="block text-sm font-semibold text-gray-700 mb-1">
                Date Admitted <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_admitted"
                name="date_admitted"
                value={formData.date_admitted}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fce7f3', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Photo</h2>
          <div>
            <label htmlFor="picture" className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Picture
            </label>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Max 10MB. Auto-resized.</p>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Additional Information</h2>
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Special information, medical conditions, dietary restrictions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-8 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Pet' : 'Add Pet'}
          </button>
          <Link
            to="/pets"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
