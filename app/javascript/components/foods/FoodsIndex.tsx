import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Food } from '../../types/food';
import { PostItCard } from '../common/PostItCard';

export const FoodsIndex: React.FC = () => {
  const { data: foods, loading, error, deleteItem } = useResource<Food>('/api/v1/foods');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this food?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading foods...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="foods-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Foods</h1>
        <Link
          to="/foods/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Food
        </Link>
      </div>

      {foods.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No foods found. Add your first food to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food, index) => (
            <PostItCard key={food.id} colorIndex={index}>
              <div className="min-h-[200px] flex flex-col">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{food.name}</h2>
                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Type:</span>{' '}
                      <span className="text-gray-600">{food.food_type}</span>
                    </p>
                    {food.amount && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Amount:</span>{' '}
                        <span className="text-gray-600">{food.amount}</span>
                      </p>
                    )}
                    {food.purpose && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Purpose:</span>{' '}
                        <span className="text-gray-600">{food.purpose}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/foods/${food.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/foods/${food.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </PostItCard>
          ))}
        </div>
      )}
    </div>
  );
};
