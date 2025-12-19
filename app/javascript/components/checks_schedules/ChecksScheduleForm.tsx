import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChecksSchedule, ChecksScheduleFormData } from '../../types/checksSchedule';
import { Pet } from '../../types/pet';
import { Check } from '../../types/check';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface ChecksScheduleFormProps {
  mode: 'new' | 'edit';
}

export const ChecksScheduleForm: React.FC<ChecksScheduleFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const scheduleId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<ChecksScheduleFormData>({
    pet_id: 0,
    check_id: 0,
    date_created: '',
    notes: '',
    performed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: pets, loading: petsLoading } = useResource<Pet>('/api/v1/pets');
  const { data: checks, loading: checksLoading } = useResource<Check>('/api/v1/checks');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await apiCall<ChecksSchedule>(`/api/v1/checks_schedules/${scheduleId}`);
        if (data) {
          setFormData({
            pet_id: data.pet_id,
            check_id: data.check_id,
            date_created: data.date_created,
            notes: data.notes || '',
            performed: data.performed,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch checks schedule');
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
        ? '/api/v1/checks_schedules'
        : `/api/v1/checks_schedules/${scheduleId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const schedule = await apiCall<ChecksSchedule>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (schedule) {
        navigate(`/checks_schedules/${schedule.id}`);
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
      [name]: ['pet_id', 'check_id'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="checks-schedule-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Checks Schedule' : 'Edit Checks Schedule'}
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
            label="Check"
            name="check_id"
            value={formData.check_id}
            onChange={handleChange}
            options={checks}
            getLabel={(check) => check.check_type}
            required
            loading={checksLoading}
            placeholder="Select check"
          />

          <FormField
            label="Date Created"
            name="date_created"
            type="date"
            value={formData.date_created}
            onChange={handleChange}
            required
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
              {loading ? 'Saving...' : mode === 'new' ? 'Create Checks Schedule' : 'Update Checks Schedule'}
            </button>

            <Link
              to="/checks_schedules"
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
