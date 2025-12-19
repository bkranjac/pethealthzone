import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Food, FoodFormData } from '../../types/food';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { FormField } from '../common/FormField';

interface FoodFormProps {
  mode: 'new' | 'edit';
}

export const FoodForm: React.FC<FoodFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const foodId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<FoodFormData>({
    name: '',
    food_type: '',
    amount: '',
    description: '',
    purpose: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await apiCall<Food>(`/api/v1/foods/${foodId}`);
        if (data) {
          setFormData({
            name: data.name,
            food_type: data.food_type,
            amount: data.amount || '',
            description: data.description || '',
            purpose: data.purpose || '',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch food');
      }
    };

    if (mode === 'edit' && foodId) {
      fetchFood();
    }
  }, [mode, foodId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/foods'
        : `/api/v1/foods/${foodId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const food = await apiCall<Food>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (food) {
        navigate(`/foods/${food.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="food-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Food' : 'Edit Food'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter food name"
          />

          <FormField
            label="Food Type"
            name="food_type"
            type="text"
            value={formData.food_type}
            onChange={handleChange}
            required
            placeholder="Enter food type (e.g., Dry, Wet, Raw)"
          />

          <FormField
            label="Amount"
            name="amount"
            type="text"
            value={formData.amount || ''}
            onChange={handleChange}
            placeholder="Enter amount (e.g., 5kg, 12oz)"
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter description (optional)"
          />

          <FormField
            label="Purpose"
            name="purpose"
            type="text"
            value={formData.purpose || ''}
            onChange={handleChange}
            placeholder="Enter purpose (e.g., Weight Management, Sensitive Stomach)"
          />

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder="Enter any additional notes (optional)"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Food' : 'Update Food'}
            </button>

            <Link
              to="/foods"
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
