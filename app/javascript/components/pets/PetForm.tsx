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
    <div className="pet-form max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'edit' ? 'Edit Pet' : 'New Pet'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nickname" className="block font-semibold mb-2">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pet_type" className="block font-semibold mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pet_type"
            name="pet_type"
            value={formData.pet_type}
            onChange={handleChange}
            required
            placeholder="e.g., Dog, Cat, Bird"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="breed" className="block font-semibold mb-2">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block font-semibold mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="birthday" className="block font-semibold mb-2">
            Birthday <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date_admitted" className="block font-semibold mb-2">
            Date Admitted <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date_admitted"
            name="date_admitted"
            value={formData.date_admitted}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="picture" className="block font-semibold mb-2">
            Picture
          </label>
          <input
            type="file"
            id="picture"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.picture && (
            <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid #d1d5db',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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

        <div className="mb-6">
          <label htmlFor="notes" className="block font-semibold mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Pet' : 'Create Pet'}
          </button>
          <Link
            to="/pets"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};
