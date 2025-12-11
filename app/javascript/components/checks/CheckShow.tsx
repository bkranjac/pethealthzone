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
    <div className="check-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{check.name}</h1>

        <div className="space-y-4">
          {check.frequency && (
            <div>
              <span className="font-semibold text-gray-700">Frequency:</span>
              <p className="text-gray-900 mt-1">
                Every {check.frequency.interval_days} {check.frequency.interval_days === 1 ? 'day' : 'days'}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/checks/${check.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this check
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this check
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/checks"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
