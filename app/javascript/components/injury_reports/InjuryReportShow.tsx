import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InjuryReport } from '../../types/injuryReport';
import { useApi } from '../../hooks/useApi';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const InjuryReportShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const reportId = parseInt(id || '0', 10);
  const [report, setReport] = useState<InjuryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall<InjuryReport>(`/api/v1/injury_reports/${reportId}`);
        if (data) {
          setReport(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch injury report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, apiCall]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this injury report?')) {
      return;
    }

    try {
      await apiCall(`/api/v1/injury_reports/${reportId}`, {
        method: 'DELETE',
      });
      navigate('/injury_reports');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete injury report');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading injury report...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!report) {
    return <div>Injury report not found</div>;
  }

  return (
    <div className="injury-report-show max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Injury Report #{report.id}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Pet ID:</span>
            <p className="text-gray-900 mt-1">{report.pet_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Injury ID:</span>
            <p className="text-gray-900 mt-1">{report.injury_id}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Date:</span>
            <p className="text-gray-900 mt-1">
              {new Date(report.date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Body Part:</span>
            <p className="text-gray-900 mt-1">{report.body_part}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Description:</span>
            <p className="text-gray-900 mt-1">{report.description}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            to={`/injury_reports/${report.id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit this injury report
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Destroy this injury report
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/injury_reports"
            className="text-blue-500 hover:text-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
