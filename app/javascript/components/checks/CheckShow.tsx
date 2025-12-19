import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check } from '../../types/check';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const CheckShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const checkId = parseInt(id || '0', 10);
  const [check, setCheck] = useState<Check | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        const data = await apiCall<Check>(`/api/v1/checks/${checkId}`);
        if (data) {
          setCheck(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch check');
      } finally {
        setLoading(false);
      }
    };

    fetchCheck();
  }, [checkId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this check?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/checks/${checkId}`, {
        method: 'DELETE',
      });
      navigate('/checks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete check');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading check...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!check) {
    return <div>Check not found</div>;
  }

  return (
    <div className="check-show" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1rem' }}>
      <h1 className="text-3xl font-bold mb-6">{check.check_type}</h1>

      {/* Frequency Section */}
      <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)' }}>
        <h2 className="text-lg font-bold mb-3">📅 Frequency</h2>
        <p className="text-gray-900">
          {check.frequency?.interval_days
            ? `Every ${check.frequency.interval_days} ${check.frequency.interval_days === 1 ? 'day' : 'days'}`
            : `Frequency ID: ${check.frequency_id}`}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <Link
          to={`/checks/${check.id}/edit`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ marginLeft: '1rem' }}
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
        <Link
          to="/checks"
          className="text-blue-500 hover:text-blue-700 py-2"
        >
          Back to Checks
        </Link>
      </div>
    </div>
  );
};
