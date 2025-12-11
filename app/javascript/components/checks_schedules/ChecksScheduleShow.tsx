import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChecksSchedule } from '../../types/checksSchedule';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const ChecksScheduleShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const scheduleId = parseInt(id || '0', 10);
  const [schedule, setSchedule] = useState<ChecksSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await apiCall<ChecksSchedule>(`/api/v1/checks_schedules/${scheduleId}`);
        if (data) {
          setSchedule(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch checks schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this checks schedule?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/checks_schedules/${scheduleId}`, {
        method: 'DELETE',
      });
      navigate('/checks_schedules');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete checks schedule');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading checks schedule...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!schedule) {
    return <div>Checks schedule not found</div>;
  }

  return (
    <div className="checks-schedule-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Checks Schedule #{schedule.id}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Pet ID:</span>
            <p className="text-gray-900 mt-1">{schedule.pet_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Check ID:</span>
            <p className="text-gray-900 mt-1">{schedule.check_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Scheduled Date:</span>
            <p className="text-gray-900 mt-1">
              {new Date(schedule.scheduled_date).toLocaleDateString()}
            </p>
          </div>

          {schedule.completed_date && (
            <div>
              <span className="font-semibold text-gray-700">Completed Date:</span>
              <p className="text-gray-900 mt-1">
                {new Date(schedule.completed_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {schedule.notes && (
            <div>
              <span className="font-semibold text-gray-700">Notes:</span>
              <p className="text-gray-900 mt-1">{schedule.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/checks_schedules/${schedule.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this checks schedule
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this checks schedule
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/checks_schedules"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
