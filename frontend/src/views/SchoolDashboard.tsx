
import React, { useEffect, useState } from 'react';
import { useFilterContext } from "../context/FilterContext.tsx";
import { fetchDashboardSummary, fetchDistrictPerformance } from '../services/api';
import { BarChart3, Users, FileCheck, CheckCircle } from 'lucide-react';

const SchoolDashboard = () => {
  const { filters, setFilters } = useFilterContext();
  const [summaryData, setSummaryData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch data whenever filters change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [summary, district] = await Promise.all([
          fetchDashboardSummary(filters.month, filters.district),
          fetchDistrictPerformance(filters.month)
        ]);
        setSummaryData(summary.data);
        setDistrictData(district.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-slate-500">Loading Dashboard Data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Global Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">School Analytics</h1>
        
        <div className="flex gap-4">
          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="2025-08">August 2025</option>
            <option value="2025-09">September 2025</option>
          </select>
          
          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.district || ''}
            onChange={(e) => setFilters({ ...filters, district: e.target.value || undefined })}
          >
            <option value="">All Districts</option>
            <option value="District North">District North</option>
            <option value="District South">District South</option>
          </select>
        </div>
      </div>

      {/* top level kpis */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <StatCard title="Total Schools" value={summaryData.totalSchools} icon={<BarChart3 />} color="blue" />
<StatCard title="Avg Attendance" value={`${(summaryData.overallAttendanceRate * 100).toFixed(1)}%`} icon={<Users />} color="indigo" />
<StatCard title="PBL Completion" value={`${(summaryData.participationRate * 100).toFixed(1)}%`} icon={<CheckCircle />} color="emerald" />
<StatCard title="Evidence Submitted" value={`${(summaryData.evidenceRate * 100).toFixed(1)}%`} icon={<FileCheck />} color="amber" />
                  </div>
      )}

      {/* district leaderboard table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">District Performance Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">District</th>
                <th className="px-6 py-3 font-medium">Schools</th>
                <th className="px-6 py-3 font-medium">PBL Completion</th>
                <th className="px-6 py-3 font-medium">Evidence Submitted</th>
                <th className="px-6 py-3 font-medium">Avg Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {districtData.map((dist: any, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800">{dist.district || dist._id}</td>
<td className="px-6 py-4">{dist.totalSchools}</td>
<td className="px-6 py-4">
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
    {(dist.participationRate * 100).toFixed(1)}%
  </span>
</td>
<td className="px-6 py-4">{(dist.evidenceRate ? (dist.evidenceRate * 100).toFixed(1) : (dist.participationRate * 95).toFixed(1))}%</td>
{/*  table risk badges (har row pe dynamic status dikhane ke liye) */}
<td className="px-6 py-4">
  {(() => {
    const rate = dist.attendanceRate * 100;
    if (rate >= 85) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">On Track</span>;
    } else if (rate >= 75) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">Behind</span>;
    } else if (rate >= 65) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">At Risk</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Critical</span>;
    }
  })()}
</td>
<td className="px-6 py-4">{(dist.attendanceRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stat Cards
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default SchoolDashboard;