import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Check } from '../../types/check';
import { PostItCard } from '../common/PostItCard';

export const ChecksIndex: React.FC = () => {
  const { data: checks, loading, error, deleteItem } = useResource<Check>('/api/v1/checks');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this check?')) {
      return;
    }

    try {
      await deleteItem(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Filter checks based on search
  const filteredChecks = React.useMemo(() => {
    return checks.filter(check => {
      const matchesSearch = searchTerm === '' ||
        check.check_type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [checks, searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
  };

  if (loading) {
    return <div className="text-center p-4">Loading checks...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="checks-index max-w-7xl mx-auto px-4 py-8">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .check-card-entrance {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Health Checks</h1>
        <Link
          to="/checks/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add New Check
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#dbeafe', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by check type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {searchTerm && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredChecks.length} of {checks.length} check{checks.length !== 1 ? 's' : ''}
          {searchTerm && ' (filtered)'}
        </div>
      </div>

      {checks.length === 0 ? (
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fef3c7', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No checks found. Add your first check to get started!</p>
        </div>
      ) : filteredChecks.length === 0 ? (
        <div className="text-center p-12 rounded-lg" style={{ backgroundColor: '#fed7aa', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
          <p className="text-gray-700 text-lg font-semibold">No checks match your search.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
          {filteredChecks.map((check, index) => (
            <div
              key={check.id}
              className="check-card-entrance"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PostItCard colorIndex={index}>
                <div className="flex flex-col h-full" style={{ minHeight: '140px', position: 'relative' }}>
                  <h2 className="text-lg font-bold mb-1 text-gray-800">{check.check_type}</h2>

                  <div className="flex-1">
                    <div className="space-y-0.5">
                      {check.frequency && (
                        <p className="text-xs">
                          <span className="text-xl mr-1">📅</span>
                          <span className="font-semibold text-gray-700">Frequency:</span>{' '}
                          <span className="text-gray-600">
                            Every {check.frequency.interval_days}{' '}
                            {check.frequency.interval_days === 1 ? 'day' : 'days'}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-300">
                    <Link
                      to={`/checks/${check.id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block no-underline"
                      style={{ textDecoration: 'none', fontSize: '10px', padding: '6px 8px' }}
                    >
                      View
                    </Link>
                    <Link
                      to={`/checks/${check.id}/edit`}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block no-underline"
                      style={{ textDecoration: 'none', fontSize: '10px', padding: '6px 8px' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(check.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold rounded flex-1 text-center transition-colors inline-block border-0"
                      style={{ cursor: 'pointer', fontSize: '10px', padding: '6px 8px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </PostItCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
