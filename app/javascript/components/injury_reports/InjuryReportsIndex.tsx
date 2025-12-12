import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { InjuryReport } from '../../types/injuryReport';
import { PostItCard } from '../common/PostItCard';

export const InjuryReportsIndex: React.FC = () => {
  const { data: reports, loading, error, deleteItem } = useResource<InjuryReport>('/api/v1/injury_reports');

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this injury report?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading injury reports...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="injury-reports-index max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Injury Reports</h1>
        <Link
          to="/injury_reports/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          + Add Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No injury reports found. Hopefully it stays that way!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <PostItCard key={report.id} colorIndex={index}>
              <div className="min-h-[180px] flex flex-col">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Report #{report.id}</h2>
                <div className="mb-4 flex-grow">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Pet ID:</span>{' '}
                      <span className="text-gray-600">{report.pet_id}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Injury ID:</span>{' '}
                      <span className="text-gray-600">{report.injury_id}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Report Date:</span>{' '}
                      <span className="text-gray-600">
                        {new Date(report.report_date).toLocaleDateString()}
                      </span>
                    </p>
                    {report.notes && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Notes:</span>{' '}
                        <span className="text-gray-600">{report.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-300">
                  <Link
                    to={`/injury_reports/${report.id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/injury_reports/${report.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded flex-1 text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id)}
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
