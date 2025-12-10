import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Food } from '../../types/food';

export const FoodsIndex: React.FC = () => {
  const { data: foods, loading, error, deleteItem } = useResource<Food>('/api/v1/foods');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this food?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading foods...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="foods-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Foods</h1>
        <Link
          to="/foods/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New food
        </Link>
      </div>

      {foods.length === 0 ? (
        <p className="text-gray-600">No foods found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div
              key={food.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Brand:</span> {food.brand}
              </p>
              {food.ingredients && (
                <p className="text-gray-600 mb-3 text-sm">
                  <span className="font-medium">Ingredients:</span> {food.ingredients}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/foods/${food.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/foods/${food.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
