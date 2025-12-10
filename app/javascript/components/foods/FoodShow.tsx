import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Food } from '../../types/food';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const FoodShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const foodId = parseInt(id || '0', 10);
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await apiCall<Food>(`/api/v1/foods/${foodId}`);
        if (data) {
          setFood(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch food');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this food?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/foods/${foodId}`, {
        method: 'DELETE',
      });
      navigate('/foods');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete food');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading food...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!food) {
    return <div>Food not found</div>;
  }

  return (
    <div className="food-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{food.name}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Brand:</span>
            <p className="text-gray-900 mt-1">{food.brand}</p>
          </div>

          {food.ingredients && (
            <div>
              <span className="font-semibold text-gray-700">Ingredients:</span>
              <p className="text-gray-900 mt-1">{food.ingredients}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/foods/${food.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this food
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this food
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/foods"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
