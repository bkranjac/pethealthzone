import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MedicationSchedule, MedicationScheduleFormData } from '../../types/medicationSchedule';
import { Pet } from '../../types/pet';
import { Medication } from '../../types/medication';
import { Frequency } from '../../types/frequency';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface MedicationScheduleFormProps {
  mode: 'new' | 'edit';
}

export const MedicationScheduleForm: React.FC<MedicationScheduleFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const scheduleId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<MedicationScheduleFormData>({
    pet_id: 0,
    medication_id: 0,
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
  const { data: medications, loading: medicationsLoading } = useResource<Medication>('/api/v1/medications');
  const { data: frequencies, loading: frequenciesLoading } = useResource<Frequency>('/api/v1/frequencies');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await apiCall<MedicationSchedule>(`/api/v1/medication_schedules/${scheduleId}`);
        if (data) {
          setFormData({
            pet_id: data.pet_id,
            medication_id: data.medication_id,
            frequency_id: data.frequency_id,
            date_started: data.date_started,
            date_ended: data.date_ended || '',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch medication schedule');
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
        ? '/api/v1/medication_schedules'
        : `/api/v1/medication_schedules/${scheduleId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const schedule = await apiCall<MedicationSchedule>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (schedule) {
        navigate(`/medication_schedules/${schedule.id}`);
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
      [name]: ['pet_id', 'medication_id', 'frequency_id'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="medication-schedule-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Medication Schedule' : 'Edit Medication Schedule'}
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
            label="Medication"
            name="medication_id"
            value={formData.medication_id}
            onChange={handleChange}
            options={medications}
            getLabel={(medication) => medication.name}
            required
            loading={medicationsLoading}
            placeholder="Select medication"
          />

          <ResourceSelect
            label="Frequency"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleChange}
            options={frequencies}
            getLabel={(freq) => `Every ${freq.interval_days} ${freq.interval_days === 1 ? 'day' : 'days'}`}
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
              {loading ? 'Saving...' : mode === 'new' ? 'Create Medication Schedule' : 'Update Medication Schedule'}
            </button>

            <Link
              to="/medication_schedules"
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
