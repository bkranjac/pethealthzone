import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { MedicationSchedule } from '../../types/medicationSchedule';

export const MedicationSchedulesIndex: React.FC = () => {
  const { data: schedules, loading, error, deleteItem } = useResource<MedicationSchedule>('/api/v1/medication_schedules');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medication schedule?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading medication schedules...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="medication-schedules-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Schedules</h1>
        <Link
          to="/medication_schedules/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New medication schedule
        </Link>
      </div>

      {schedules.length === 0 ? (
        <p className="text-gray-600">No medication schedules found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <span className="font-medium text-gray-700">Pet ID:</span> {schedule.pet_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Medication ID:</span> {schedule.medication_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Frequency ID:</span> {schedule.frequency_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Started:</span>{' '}
                {new Date(schedule.date_started).toLocaleDateString()}
              </div>
              {schedule.date_ended && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Ended:</span>{' '}
                  {new Date(schedule.date_ended).toLocaleDateString()}
                </div>
              )}
              {schedule.notes && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Notes:</span> {schedule.notes}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/medication_schedules/${schedule.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/medication_schedules/${schedule.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(schedule.id)}
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
