
import { useEffect, useState } from 'react';
import { useFilterContext } from '../context/FilterContext';
import { fetchDistrictPerformance } from '../services/api';
import { Map, AlertTriangle } from 'lucide-react';

interface DistrictItem {
  district: string;
  totalSchools: number;
  participationRate: number;
  attendanceRate: number;
  riskStatus: string;
}

const DistrictBlock = () => {
  const { filters } = useFilterContext();
  const [districtData, setDistrictData] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchDistrictPerformance(filters.month);
        if (res.success) {
          setDistrictData(res.data);
        }
      } catch (error) {
        console.error("Failed to load district metrics for drilldown", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters.month]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
        Loading District Detail Cards...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* title header card */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Map className="text-indigo-600" size={26} />
          District & Block Drilldown
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed deterministic evaluation metrics compiled across active zones for <span className="font-semibold text-slate-700">{filters.month}</span>
        </p>
      </div>

      {/* grid layout cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districtData.map((dist: DistrictItem, index: number) => {
          const pblPercent = dist.participationRate * 100;
          const attPercent = dist.attendanceRate * 100;

          return (
            <div key={index} className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                {/* header row */}
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {dist.district || `Zone Cluster ${index + 1}`}
                  </h3>
                  <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 shadow-3xs">
                    {dist.totalSchools} Schools
                  </span>
                </div>
                
                {/* metrics progress bars */}
                <div className="space-y-4">
                  {/* pbl Metrics */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">PBL Completion</span>
                      <span className="font-bold text-slate-800">{pblPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${pblPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* attendance metrics */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Attendance Rate</span>
                      <span className="font-bold text-slate-800">{attPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${attPercent < 75 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                        style={{ width: `${attPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* dynamic warning alert for low attendance rows */}
              {attPercent < 75 && (
                <div className="mt-5 p-3 bg-amber-50 border border-amber-100/70 rounded-xl flex items-start gap-2 text-amber-800 text-xs leading-relaxed animate-fade-in">
                  <AlertTriangle size={16} className="mt-0.5 text-amber-600 shrink-0" />
                  <p>
                    <strong>Low Density Warning:</strong> Performance parameters dropped below structural baselines. Priority engagement recommended.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistrictBlock;