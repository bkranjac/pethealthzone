import React from 'react';
import { Link } from 'react-router-dom';
import { Injury } from '../../types/injury';
import { useResource } from '../../hooks/useResource';
import { useApi } from '../../hooks/useApi';
import { PostItCard } from '../common/PostItCard';

export const InjuriesIndex: React.FC = () => {
  const { data: injuries, loading, error, deleteItem, refetch } = useResource<Injury>('/api/v1/injuries');
  const { apiCall } = useApi();
  const [expandedInjuryId, setExpandedInjuryId] = React.useState<number | null>(null);
  const [editingInjuryId, setEditingInjuryId] = React.useState<number | null>(null);
  const [editFormData, setEditFormData] = React.useState<Partial<Injury>>({});

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

  const handleEditStart = (injury: Injury) => {
    setEditingInjuryId(injury.id);
    setExpandedInjuryId(null); // Close any expanded view
    setEditFormData({
      description: injury.description,
      severity: injury.severity,
    });
  };

  const handleEditCancel = () => {
    setEditingInjuryId(null);
    setEditFormData({});
  };

  const handleEditSave = async (id: number) => {
    try {
      await apiCall<Injury>(`/api/v1/injuries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ injury: editFormData }),
      });
      setEditingInjuryId(null);
      setEditFormData({});
      // Refetch the injury list to get updated data
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update injury');
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedInjuryId(expandedInjuryId === id ? null : id);
    setEditingInjuryId(null); // Close any edit form
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
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Injuries</h1>
      </div>

      {injuries.length === 0 ? (
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No injuries found. Hopefully it stays that way!</p>
        </div>
      ) : (
        <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', paddingTop: '70px' }}>
          {/* Add New Injury Button - Top Right */}
          <Link
            to="/injuries/new"
            className="inline-flex items-center justify-center text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '60px',
              height: '60px',
              backgroundColor: '#ef4444',
              border: '3px solid #dc2626',
              zIndex: 10
            }}
            title="Report New Injury"
          >
            <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Grid of Injury Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {injuries.map((injury, index) => {
            const isExpanded = expandedInjuryId === injury.id;
            const isEditing = editingInjuryId === injury.id;

            return (
              <div
                key={injury.id}
                style={{
                  gridColumn: isExpanded || isEditing ? 'span 2' : 'span 1',
                  animationDelay: `${index * 0.1}s`
                }}
                className="injury-card-entrance"
              >
                <PostItCard
                  colorIndex={getSeverityColor(injury.severity)}
                >
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">Edit Injury #{injury.id}</h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editFormData.description || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe the injury..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Severity
                      </label>
                      <select
                        value={editFormData.severity || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, severity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-300">
                      <button
                        onClick={() => handleEditSave(injury.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal/Expanded View
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold mb-2 text-gray-800">
                        Injury #{injury.id}
                      </h2>
                      <div className="space-y-1">
                        <p className="text-xs">
                          <span className="text-base mr-1">📝</span>
                          <span className="font-semibold text-gray-700">Description:</span>
                        </p>
                        <p className="text-xs text-gray-600 ml-5 line-clamp-2">{injury.description}</p>

                        <p className="text-xs">
                          <span className="text-base mr-1">⚠️</span>
                          <span className="font-semibold text-gray-700">Severity:</span>{' '}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                            injury.severity === 'critical' ? 'bg-red-700 text-white' :
                            injury.severity === 'high' ? 'bg-orange-600 text-white' :
                            injury.severity === 'medium' ? 'bg-yellow-600 text-white' :
                            'bg-green-600 text-white'
                          }`}>
                            {injury.severity}
                          </span>
                        </p>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
                            {injury.created_at && (
                              <p className="text-xs">
                                <span className="text-base mr-1">📅</span>
                                <span className="font-semibold text-gray-700">Created:</span>{' '}
                                <span className="text-gray-600">
                                  {new Date(injury.created_at).toLocaleDateString()}
                                </span>
                              </p>
                            )}
                            {injury.updated_at && (
                              <p className="text-xs">
                                <span className="text-base mr-1">🔄</span>
                                <span className="font-semibold text-gray-700">Updated:</span>{' '}
                                <span className="text-gray-600">
                                  {new Date(injury.updated_at).toLocaleDateString()}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-300">
                      <button
                        onClick={() => toggleExpanded(injury.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex-1 text-center transition-colors"
                        style={{ fontSize: '10px', padding: '6px 8px' }}
                      >
                        {isExpanded ? '▲ Less' : '▼ More'}
                      </button>
                      <button
                        onClick={() => handleEditStart(injury)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex-1 text-center transition-colors"
                        style={{ fontSize: '10px', padding: '6px 8px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(injury.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded flex-1 text-center transition-colors border-0"
                        style={{ cursor: 'pointer', fontSize: '10px', padding: '6px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </PostItCard>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};
