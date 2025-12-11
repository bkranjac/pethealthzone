import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MedicationSchedule } from '../../types/medicationSchedule';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const MedicationScheduleShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const scheduleId = parseInt(id || '0', 10);
  const [schedule, setSchedule] = useState<MedicationSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await apiCall<MedicationSchedule>(`/api/v1/medication_schedules/${scheduleId}`);
        if (data) {
          setSchedule(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch medication schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this medication schedule?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/medication_schedules/${scheduleId}`, {
        method: 'DELETE',
      });
      navigate('/medication_schedules');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication schedule');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading medication schedule...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!schedule) {
    return <div>Medication schedule not found</div>;
  }

  return (
    <div className="medication-schedule-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Medication Schedule #{schedule.id}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Pet ID:</span>
            <p className="text-gray-900 mt-1">{schedule.pet_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Medication ID:</span>
            <p className="text-gray-900 mt-1">{schedule.medication_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Frequency ID:</span>
            <p className="text-gray-900 mt-1">{schedule.frequency_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Date Started:</span>
            <p className="text-gray-900 mt-1">
              {new Date(schedule.date_started).toLocaleDateString()}
            </p>
          </div>

          {schedule.date_ended && (
            <div>
              <span className="font-semibold text-gray-700">Date Ended:</span>
              <p className="text-gray-900 mt-1">
                {new Date(schedule.date_ended).toLocaleDateString()}
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
            to={`/medication_schedules/${schedule.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this medication schedule
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this medication schedule
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/medication_schedules"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
