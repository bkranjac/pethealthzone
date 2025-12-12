import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { VaccinationSchedule, VaccinationScheduleFormData } from '../../types/vaccinationSchedule';
import { Pet } from '../../types/pet';
import { Vaccine } from '../../types/vaccine';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface VaccinationScheduleFormProps {
  mode: 'new' | 'edit';
}

export const VaccinationScheduleForm: React.FC<VaccinationScheduleFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const scheduleId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<VaccinationScheduleFormData>({
    pet_id: 0,
    vaccine_id: 0,
    frequency_id: 0,
    date_started: '',
    date_ended: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: pets, loading: petsLoading } = useResource<Pet>('/api/v1/pets');
  const { data: vaccines, loading: vaccinesLoading } = useResource<Vaccine>('/api/v1/vaccines');
  const { data: frequencies, loading: frequenciesLoading } = useResource<Frequency>('/api/v1/frequencies');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await apiCall<VaccinationSchedule>(`/api/v1/vaccination_schedules/${scheduleId}`);
        if (data) {
          setFormData({
            pet_id: data.pet_id,
            vaccine_id: data.vaccine_id,
            frequency_id: data.frequency_id,
            date_started: data.date_started,
            date_ended: data.date_ended || '',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vaccination schedule');
      }
    };

    if (mode === 'edit' && scheduleId) {
      fetchSchedule();
    }
  }, [mode, scheduleId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/vaccination_schedules'
        : `/api/v1/vaccination_schedules/${scheduleId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const schedule = await apiCall<VaccinationSchedule>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (schedule) {
        navigate(`/vaccination_schedules/${schedule.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pet_id', 'vaccine_id', 'frequency_id'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="vaccination-schedule-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Vaccination Schedule' : 'Edit Vaccination Schedule'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ResourceSelect
            label="Pet"
            name="pet_id"
            value={formData.pet_id}
            onChange={handleChange}
            options={pets}
            getLabel={(pet) => pet.name}
            required
            loading={petsLoading}
            placeholder="Select pet"
          />

          <ResourceSelect
            label="Vaccine"
            name="vaccine_id"
            value={formData.vaccine_id}
            onChange={handleChange}
            options={vaccines}
            getLabel={(vaccine) => vaccine.name}
            required
            loading={vaccinesLoading}
            placeholder="Select vaccine"
          />

          <ResourceSelect
            label="Frequency"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleChange}
            options={frequencies}
            getLabel={(freq) => freq.name}
            required
            loading={frequenciesLoading}
            placeholder="Select frequency"
          />

          <FormField
            label="Date Started"
            name="date_started"
            type="date"
            value={formData.date_started}
            onChange={handleChange}
            required
          />

          <FormField
            label="Date Ended"
            name="date_ended"
            type="date"
            value={formData.date_ended || ''}
            onChange={handleChange}
          />

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder="Enter any notes"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'new' ? 'Create Vaccination Schedule' : 'Update Vaccination Schedule'}
            </button>

            <Link
              to="/vaccination_schedules"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
