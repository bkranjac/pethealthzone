import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PetFood } from '../../types/petFood';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const PetFoodShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const petFoodId = parseInt(id || '0', 10);
  const [petFood, setPetFood] = useState<PetFood | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchPetFood = async () => {
      try {
        const data = await apiCall<PetFood>(`/api/v1/pet_foods/${petFoodId}`);
        if (data) {
          setPetFood(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pet food');
      } finally {
        setLoading(false);
      }
    };

    fetchPetFood();
  }, [petFoodId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pet food?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/pet_foods/${petFoodId}`, {
        method: 'DELETE',
      });
      navigate('/pet_foods');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pet food');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pet food...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!petFood) {
    return <div>Pet food not found</div>;
  }

  return (
    <div className="pet-food-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Pet Food #{petFood.id}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Pet ID:</span>
            <p className="text-gray-900 mt-1">{petFood.pet_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Food ID:</span>
            <p className="text-gray-900 mt-1">{petFood.food_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Frequency ID:</span>
            <p className="text-gray-900 mt-1">{petFood.frequency_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Date Started:</span>
            <p className="text-gray-900 mt-1">
              {new Date(petFood.date_started).toLocaleDateString()}
            </p>
          </div>

          {petFood.date_ended && (
            <div>
              <span className="font-semibold text-gray-700">Date Ended:</span>
              <p className="text-gray-900 mt-1">
                {new Date(petFood.date_ended).toLocaleDateString()}
              </p>
            </div>
          )}

          {petFood.notes && (
            <div>
              <span className="font-semibold text-gray-700">Notes:</span>
              <p className="text-gray-900 mt-1">{petFood.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/pet_foods/${petFood.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this pet food
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this pet food
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/pet_foods"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
