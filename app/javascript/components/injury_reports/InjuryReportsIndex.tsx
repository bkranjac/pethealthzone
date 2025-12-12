import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { InjuryReport } from '../../types/injuryReport';

export const InjuryReportsIndex: React.FC = () => {
  const { data: reports, loading, error, deleteItem } = useResource<InjuryReport>('/api/v1/injury_reports');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this injury report?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading injury reports...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="injury-reports-index">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Injury Reports</h1>
        <Link
          to="/injury_reports/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New injury report
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-600">No injury reports found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <span className="font-medium text-gray-700">Pet ID:</span> {report.pet_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Injury ID:</span> {report.injury_id}
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Report Date:</span>{' '}
                {new Date(report.report_date).toLocaleDateString()}
              </div>
              {report.notes && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Notes:</span> {report.notes}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/injury_reports/${report.id}`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View
                </Link>
                <Link
                  to={`/injury_reports/${report.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(report.id)}
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
