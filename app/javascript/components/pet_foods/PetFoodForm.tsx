import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PetFood, PetFoodFormData } from '../../types/petFood';
import { Pet } from '../../types/pet';
import { Food } from '../../types/food';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface PetFoodFormProps {
  mode: 'new' | 'edit';
}

export const PetFoodForm: React.FC<PetFoodFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const petFoodId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<PetFoodFormData>({
    pet_id: 0,
    food_id: 0,
    frequency_id: 0,
    date_started: '',
    date_ended: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: pets, loading: petsLoading } = useResource<Pet>('/api/v1/pets');
  const { data: foods, loading: foodsLoading } = useResource<Food>('/api/v1/foods');
  const { data: frequencies, loading: frequenciesLoading } = useResource<Frequency>('/api/v1/frequencies');

  useEffect(() => {
    const fetchPetFood = async () => {
      try {
        const data = await apiCall<PetFood>(`/api/v1/pet_foods/${petFoodId}`);
        if (data) {
          setFormData({
            pet_id: data.pet_id,
            food_id: data.food_id,
            frequency_id: data.frequency_id,
            date_started: data.date_started,
            date_ended: data.date_ended || '',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pet food');
      }
    };

    if (mode === 'edit' && petFoodId) {
      fetchPetFood();
    }
  }, [mode, petFoodId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/pet_foods'
        : `/api/v1/pet_foods/${petFoodId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const petFood = await apiCall<PetFood>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (petFood) {
        navigate(`/pet_foods/${petFood.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pet_id', 'food_id', 'frequency_id'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="pet-food-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Pet Food' : 'Edit Pet Food'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ResourceSelect
            label="Pet"
            name="pet_id"
            value={formData.pet_id}
            onChange={handleChange}
            options={pets}
            getLabel={(pet) => pet.name}
            required
            loading={petsLoading}
            placeholder="Select pet"
          />

          <ResourceSelect
            label="Food"
            name="food_id"
            value={formData.food_id}
            onChange={handleChange}
            options={foods}
            getLabel={(food) => food.name}
            required
            loading={foodsLoading}
            placeholder="Select food"
          />

          <ResourceSelect
            label="Frequency"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleChange}
            options={frequencies}
            getLabel={(freq) => freq.name}
            required
            loading={frequenciesLoading}
            placeholder="Select frequency"
          />

          <FormField
            label="Date Started"
            name="date_started"
            type="date"
            value={formData.date_started}
            onChange={handleChange}
            required
          />

          <FormField
            label="Date Ended"
            name="date_ended"
            type="date"
            value={formData.date_ended || ''}
            onChange={handleChange}
          />

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder="Enter any notes"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Pet Food' : 'Update Pet Food'}
            </button>

            <Link
              to="/pet_foods"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
