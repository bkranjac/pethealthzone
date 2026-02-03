import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pet } from '../../types/pet';
import { MedicationSchedule } from '../../types/medicationSchedule';
import { VaccinationSchedule } from '../../types/vaccinationSchedule';
import { ChecksSchedule } from '../../types/checksSchedule';
import { InjuryReport } from '../../types/injuryReport';
import { PetFood } from '../../types/petFood';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const PetDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const petId = parseInt(id || '0', 10);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [medicationSchedules, setMedicationSchedules] = useState<MedicationSchedule[]>([]);
  const [vaccinationSchedules, setVaccinationSchedules] = useState<VaccinationSchedule[]>([]);
  const [checksSchedules, setChecksSchedules] = useState<ChecksSchedule[]>([]);
  const [injuryReports, setInjuryReports] = useState<InjuryReport[]>([]);
  const [petFoods, setPetFoods] = useState<PetFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          petData,
          medSchedules,
          vaccSchedules,
          checkSchedules,
          injuries,
          foods
        ] = await Promise.all([
          apiCall<Pet>(`/api/v1/pets/${petId}`),
          apiCall<MedicationSchedule[]>(`/api/v1/medication_schedules`),
          apiCall<VaccinationSchedule[]>(`/api/v1/vaccination_schedules`),
          apiCall<ChecksSchedule[]>(`/api/v1/checks_schedules`),
          apiCall<InjuryReport[]>(`/api/v1/injury_reports`),
          apiCall<PetFood[]>(`/api/v1/pet_foods`)
        ]);

        setPet(petData);

        // Filter schedules by pet_id
        setMedicationSchedules(medSchedules?.filter(s => s.pet_id === petId) || []);
        setVaccinationSchedules(vaccSchedules?.filter(s => s.pet_id === petId) || []);
        setChecksSchedules(checkSchedules?.filter(s => s.pet_id === petId) || []);
        setInjuryReports(injuries?.filter(r => r.pet_id === petId) || []);
        setPetFoods(foods?.filter(f => f.pet_id === petId) || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchDashboardData();
    }
  }, [petId, apiCall]);

  const calculateAge = (birthday: string): string => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months < 0) {
      return `${years - 1} year${years - 1 !== 1 ? 's' : ''}, ${12 + months} month${12 + months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? `, ${months} month${months !== 1 ? 's' : ''}` : ''}`;
    }
  };

  const getActiveMedications = () => {
    const today = new Date().toISOString().split('T')[0];
    return medicationSchedules.filter(schedule => {
      const ended = schedule.date_ended;
      return !ended || ended >= today;
    });
  };

  const getRecentInjuries = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return injuryReports.filter(report =>
      new Date(report.date) >= thirtyDaysAgo
    );
  };

  const getPetTypeEmoji = (petType: string): string => {
    const type = petType?.toLowerCase() || '';
    if (type.includes('dog')) return '🐕';
    if (type.includes('cat')) return '🐱';
    if (type.includes('bird')) return '🐦';
    if (type.includes('fish')) return '🐠';
    if (type.includes('rabbit')) return '🐰';
    if (type.includes('hamster')) return '🐹';
    return '🐾';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">{error || 'Pet not found'}</p>
        <Link to="/pets" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Pets
        </Link>
      </div>
    );
  }

  const activeMeds = getActiveMedications();
  const recentInjuries = getRecentInjuries();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {pet.picture && (
              <img
                src={pet.picture}
                alt={pet.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold">{pet.name}</h1>
                <span className="text-4xl">{getPetTypeEmoji(pet.pet_type)}</span>
              </div>
              {pet.nickname && (
                <p className="text-xl text-purple-100">"{pet.nickname}"</p>
              )}
              <p className="text-lg mt-2">
                {pet.breed} • {pet.gender} • Age: {calculateAge(pet.birthday)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/pets/${pet.id}/edit`}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Edit Info
            </Link>
            <Link
              to="/pets"
              className="bg-purple-600 bg-opacity-50 text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-70 transition"
            >
              ← All Pets
            </Link>
          </div>
        </div>
      </div>

      {/* Health Overview Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  💊 Medications
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  💉 Vaccines
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  🩺 Checkups
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  🚨 Injuries
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  🥘 Special Diet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-gray-200">
                {/* Medications Column */}
                <td className="px-6 py-4 align-top border-r border-gray-100">
                  {activeMeds.length > 0 ? (
                    <ul className="space-y-2">
                      {activeMeds.slice(0, 3).map((schedule) => (
                        <li key={schedule.id} className="text-sm">
                          <Link
                            to={`/medication_schedules/${schedule.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Med Schedule #{schedule.id}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Started: {new Date(schedule.date_started).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                      {activeMeds.length > 3 && (
                        <li className="text-xs text-blue-500 font-medium">
                          +{activeMeds.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">None</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-blue-700">
                    Total: {activeMeds.length}
                  </div>
                </td>

                {/* Vaccines Column */}
                <td className="px-6 py-4 align-top border-r border-gray-100">
                  {vaccinationSchedules.length > 0 ? (
                    <ul className="space-y-2">
                      {vaccinationSchedules.slice(0, 3).map((schedule) => (
                        <li key={schedule.id} className="text-sm">
                          <Link
                            to={`/vaccination_schedules/${schedule.id}`}
                            className="text-green-600 hover:underline font-medium"
                          >
                            Vaccine Schedule #{schedule.id}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Given: {new Date(schedule.date_given).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                      {vaccinationSchedules.length > 3 && (
                        <li className="text-xs text-green-500 font-medium">
                          +{vaccinationSchedules.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">None</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-green-700">
                    Total: {vaccinationSchedules.length}
                  </div>
                </td>

                {/* Checkups Column */}
                <td className="px-6 py-4 align-top border-r border-gray-100">
                  {checksSchedules.length > 0 ? (
                    <ul className="space-y-2">
                      {checksSchedules.slice(0, 3).map((schedule) => (
                        <li key={schedule.id} className="text-sm">
                          <Link
                            to={`/checks_schedules/${schedule.id}`}
                            className="text-purple-600 hover:underline font-medium"
                          >
                            Check Schedule #{schedule.id}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Date: {new Date(schedule.date).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                      {checksSchedules.length > 3 && (
                        <li className="text-xs text-purple-500 font-medium">
                          +{checksSchedules.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">None</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-purple-700">
                    Total: {checksSchedules.length}
                  </div>
                </td>

                {/* Injuries Column */}
                <td className="px-6 py-4 align-top border-r border-gray-100">
                  {recentInjuries.length > 0 ? (
                    <ul className="space-y-2">
                      {recentInjuries.slice(0, 3).map((report) => (
                        <li key={report.id} className="text-sm">
                          <Link
                            to={`/injury_reports/${report.id}`}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Injury Report #{report.id}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Date: {new Date(report.date).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                      {recentInjuries.length > 3 && (
                        <li className="text-xs text-red-500 font-medium">
                          +{recentInjuries.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">None</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-red-700">
                    Last 30 days: {recentInjuries.length}
                  </div>
                </td>

                {/* Special Diet Column */}
                <td className="px-6 py-4 align-top">
                  {petFoods.length > 0 ? (
                    <ul className="space-y-2">
                      {petFoods.slice(0, 3).map((food) => (
                        <li key={food.id} className="text-sm">
                          <Link
                            to={`/pet_foods/${food.id}`}
                            className="text-orange-600 hover:underline font-medium"
                          >
                            Pet Food #{food.id}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Started: {new Date(food.date_started).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                      {petFoods.length > 3 && (
                        <li className="text-xs text-orange-500 font-medium">
                          +{petFoods.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">None</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-orange-700">
                    Total: {petFoods.length}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        {/* Medications Section */}
        {activeMeds.length > 0 && (
          <div id="medications" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💊</span> Active Medications
            </h2>
            <div className="space-y-3">
              {activeMeds.map((schedule) => (
                <div key={schedule.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">Medication Schedule #{schedule.id}</p>
                      <p className="text-sm text-gray-600">
                        Started: {new Date(schedule.date_started).toLocaleDateString()}
                      </p>
                      {schedule.date_ended && (
                        <p className="text-sm text-gray-600">
                          Ends: {new Date(schedule.date_ended).toLocaleDateString()}
                        </p>
                      )}
                      {schedule.notes && (
                        <p className="text-sm text-gray-700 mt-2">{schedule.notes}</p>
                      )}
                    </div>
                    <Link
                      to={`/medication_schedules/${schedule.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vaccinations Section */}
        {vaccinationSchedules.length > 0 && (
          <div id="vaccines" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💉</span> Vaccination History
            </h2>
            <div className="space-y-3">
              {vaccinationSchedules.map((schedule) => (
                <div key={schedule.id} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">Vaccination Schedule #{schedule.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(schedule.date_given).toLocaleDateString()}
                      </p>
                      {schedule.notes && (
                        <p className="text-sm text-gray-700 mt-2">{schedule.notes}</p>
                      )}
                    </div>
                    <Link
                      to={`/vaccination_schedules/${schedule.id}`}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkups Section */}
        {checksSchedules.length > 0 && (
          <div id="checkups" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🩺</span> Scheduled Checkups
            </h2>
            <div className="space-y-3">
              {checksSchedules.map((schedule) => (
                <div key={schedule.id} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">
                        Checkup {schedule.performed ? '✅ Completed' : '⏰ Scheduled'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(schedule.date_created).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/checks_schedules/${schedule.id}`}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Injuries Section */}
        {recentInjuries.length > 0 && (
          <div id="injuries" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🚨</span> Recent Injuries (Last 30 Days)
            </h2>
            <div className="space-y-3">
              {recentInjuries.map((report) => (
                <div key={report.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{report.body_part}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(report.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{report.description}</p>
                    </div>
                    <Link
                      to={`/injury_reports/${report.id}`}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diet Section */}
        {petFoods.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🍖</span> Diet & Nutrition
            </h2>
            <div className="space-y-3">
              {petFoods.map((petFood) => (
                <div key={petFood.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">Pet Food Assignment #{petFood.id}</p>
                      <p className="text-sm text-gray-600">Food ID: {petFood.food_id}</p>
                    </div>
                    <Link
                      to={`/pet_foods/${petFood.id}`}
                      className="text-orange-600 hover:underline text-sm"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {pet.notes && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📝</span> Notes
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{pet.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
