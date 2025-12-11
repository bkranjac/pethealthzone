import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { ChecksSchedule } from '../../types/checksSchedule';

export const ChecksSchedulesIndex: React.FC = () => {
  const { data: schedules, loading, error, deleteItem } = useResource<ChecksSchedule>('/api/v1/checks_schedules');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this checks schedule?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading checks schedules...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="checks-schedules-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Checks Schedules</h1>
        <Link
          to="/checks_schedules/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New checks schedule
        </Link>
      </div>

      {schedules.length === 0 ? (
        <p className="text-gray-600">No checks schedules found.</p>
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
                <span className="font-medium text-gray-700">Check ID:</span> {schedule.check_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Scheduled:</span>{' '}
                {new Date(schedule.scheduled_date).toLocaleDateString()}
              </div>
              {schedule.completed_date && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Completed:</span>{' '}
                  {new Date(schedule.completed_date).toLocaleDateString()}
                </div>
              )}
              {schedule.notes && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Notes:</span> {schedule.notes}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/checks_schedules/${schedule.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/checks_schedules/${schedule.id}/edit`}
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
