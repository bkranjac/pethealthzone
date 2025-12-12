import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { VaccinationSchedule } from '../../types/vaccinationSchedule';
import { PostItCard } from '../common/PostItCard';

export const VaccinationSchedulesIndex: React.FC = () => {
  const { data: schedules, loading, error, deleteItem } = useResource<VaccinationSchedule>('/api/v1/vaccination_schedules');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vaccination schedule?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading vaccination schedules...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="vaccination-schedules-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Vaccination Schedules</h1>
        <Link
          to="/vaccination_schedules/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Schedule
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No vaccination schedules found. Add your first schedule to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedules.map((schedule, index) => (
            <PostItCard key={schedule.id} colorIndex={index}>
              <div className="min-h-[220px] flex flex-col">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Schedule #{schedule.id}</h2>
                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Pet ID:</span>{' '}
                      <span className="text-gray-600">{schedule.pet_id}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Vaccine ID:</span>{' '}
                      <span className="text-gray-600">{schedule.vaccine_id}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Frequency ID:</span>{' '}
                      <span className="text-gray-600">{schedule.frequency_id}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Started:</span>{' '}
                      <span className="text-gray-600">
                        {new Date(schedule.date_started).toLocaleDateString()}
                      </span>
                    </p>
                    {schedule.date_ended && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Ended:</span>{' '}
                        <span className="text-gray-600">
                          {new Date(schedule.date_ended).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {schedule.notes && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Notes:</span>{' '}
                        <span className="text-gray-600">{schedule.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/vaccination_schedules/${schedule.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/vaccination_schedules/${schedule.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 transition-colors"
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
