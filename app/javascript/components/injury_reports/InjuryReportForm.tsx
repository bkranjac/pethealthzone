import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InjuryReport, InjuryReportFormData } from '../../types/injuryReport';
import { Pet } from '../../types/pet';
import { Injury } from '../../types/injury';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useResource } from '../../hooks/useResource';
import { FormField } from '../common/FormField';
import { ResourceSelect } from '../common/ResourceSelect';

interface InjuryReportFormProps {
  mode: 'new' | 'edit';
}

export const InjuryReportForm: React.FC<InjuryReportFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const reportId = mode === 'edit' ? parseInt(id || '0', 10) : undefined;
  const [formData, setFormData] = useState<InjuryReportFormData>({
    pet_id: 0,
    injury_id: 0,
    report_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();
  const { data: pets, loading: petsLoading } = useResource<Pet>('/api/v1/pets');
  const { data: injuries, loading: injuriesLoading } = useResource<Injury>('/api/v1/injuries');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall<InjuryReport>(`/api/v1/injury_reports/${reportId}`);
        if (data) {
          setFormData({
            pet_id: data.pet_id,
            injury_id: data.injury_id,
            report_date: data.report_date,
            notes: data.notes || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch injury report');
      }
    };

    if (mode === 'edit' && reportId) {
      fetchReport();
    }
  }, [mode, reportId, apiCall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'new'
        ? '/api/v1/injury_reports'
        : `/api/v1/injury_reports/${reportId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const report = await apiCall<InjuryReport>(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (report) {
        navigate(`/injury_reports/${report.id}`);
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
      [name]: ['pet_id', 'injury_id'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="injury-report-form max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          {mode === 'new' ? 'New Injury Report' : 'Edit Injury Report'}
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
            label="Injury"
            name="injury_id"
            value={formData.injury_id}
            onChange={handleChange}
            options={injuries}
            getLabel={(injury) => injury.description}
            required
            loading={injuriesLoading}
            placeholder="Select injury"
          />

          <FormField
            label="Report Date"
            name="report_date"
            type="date"
            value={formData.report_date}
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
              {loading ? 'Saving...' : mode === 'new' ? 'Create Injury Report' : 'Update Injury Report'}
            </button>

            <Link
              to="/injury_reports"
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
