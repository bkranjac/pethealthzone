import React from 'react';
import { Link } from 'react-router-dom';
import { Injury } from '../../types/injury';
import { useResource } from '../../hooks/useResource';
import { PostItCard } from '../common/PostItCard';

export const InjuriesIndex: React.FC = () => {
  const { data: injuries, loading, error, deleteItem } = useResource<Injury>('/api/v1/injuries');

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this injury?')) {
      return;
    }

    try {
      await deleteItem(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Map severity to color index for post-it notes
  const getSeverityColor = (severity: string): number => {
    const severityMap: { [key: string]: number } = {
      'critical': 7, // Coral/Red
      'high': 5,     // Peach/Orange
      'medium': 0,   // Yellow
      'low': 3,      // Green
    };
    return severityMap[severity.toLowerCase()] || 0;
  };

  if (loading) {
    return <div className="text-center p-4">Loading injuries...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="injuries-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Injuries</h1>
        <Link
          to="/injuries/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Report Injury
        </Link>
      </div>

      {injuries.length === 0 ? (
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No injuries found. Hopefully it stays that way!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {injuries.map((injury) => (
            <PostItCard key={injury.id} colorIndex={getSeverityColor(injury.severity)}>
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">
                    Injury #{injury.id}
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xl mr-1">📝</span>
                      <span className="font-semibold text-gray-700">Description:</span>
                      <p className="text-gray-600 mt-1 ml-6">{injury.description}</p>
                    </div>
                    <div>
                      <span className="text-xl mr-1">⚠️</span>
                      <span className="font-semibold text-gray-700">Severity:</span>{' '}
                      <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                        injury.severity === 'critical' ? 'bg-red-700 text-white' :
                        injury.severity === 'high' ? 'bg-orange-600 text-white' :
                        injury.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {injury.severity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link
                    to={`/injuries/${injury.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded text-center transition-colors whitespace-nowrap"
                  >
                    View
                  </Link>
                  <Link
                    to={`/injuries/${injury.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 px-4 rounded text-center transition-colors whitespace-nowrap"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(injury.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors whitespace-nowrap"
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
