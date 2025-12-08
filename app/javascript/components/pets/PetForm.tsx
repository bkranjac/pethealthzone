import React, { useState, useEffect, FormEvent } from 'react';
import { Pet, PetFormData } from '../../types/pet';

interface PetFormProps {
  petId?: number;
  mode: 'new' | 'edit';
}

export const PetForm: React.FC<PetFormProps> = ({ petId, mode }) => {
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

  useEffect(() => {
    if (mode === 'edit' && petId) {
      fetchPet();
    }
  }, [mode, petId]);

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

      const pet: Pet = await response.json();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' ? `/api/v1/pets/${petId}` : '/api/v1/pets';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
        },
        body: JSON.stringify({ pet: formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'Failed to save pet');
      }

      const pet: Pet = await response.json();
      try {
        window.location.assign(`/pets/${pet.id}`);
      } catch (navError) {
        // JSDOM throws "Not implemented: navigation" errors in test environment
        // Ignore only navigation errors, let other errors propagate
        if (navError instanceof Error && !navError.message.includes('navigation')) {
          throw navError;
        }
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
            Picture URL
          </label>
          <input
            type="text"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <a
            href="/pets"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Back
          </a>
        </div>
      </form>
    </div>
  );
};
