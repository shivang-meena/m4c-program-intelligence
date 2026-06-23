
import { useEffect, useState } from 'react';
import { useFilterContext } from '../context/FilterContext';
import { fetchDistrictPerformance } from '../services/api';
import { ClipboardCheck, Copy, Check, Award, AlertTriangle, Star } from 'lucide-react';

interface DistrictItem {
  district: string;
  totalSchools: number;
  participationRate: number;
  attendanceRate: number;
  riskStatus: string;
}

const ReviewSummary = () => {
  const { filters } = useFilterContext();
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchDistrictPerformance(filters.month);
        if (res.success) setDistricts(res.data);
      } catch (error) {
        console.error("Failed to load metrics for review summary", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters.month]);

  if (loading) return <div className="p-6 text-center text-slate-500">Auto-generating Review Summary...</div>;

  //  deterministic logic engine for summary generation
  const highPerformers = districts.filter(d => d.attendanceRate * 100 >= 80);
  const criticalDistricts = districts.filter(d => d.attendanceRate * 100 < 75);
  
  const avgPbl = districts.length > 0 ? (districts.reduce((acc, d) => acc + d.participationRate, 0) / districts.length * 100).toFixed(1) : "0";
  const avgAtt = districts.length > 0 ? (districts.reduce((acc, d) => acc + d.attendanceRate, 0) / districts.length * 100).toFixed(1) : "0";

  //  SMART WORDING GENERATOR
  const getAchievementText = (rate: number, index: number) => {
    if (rate >= 99.9) {
      // 100 percent  walo ke liye 3 alag alag variations taaki repetitive na lage
      const phrases = [
        "Outstanding engagement levels at", 
        "Exceptional performance tracking", 
        "Perfect baseline maintained at"
      ];
      return `${phrases[index % phrases.length]} ${rate.toFixed(1)}% overall attendance.`;
    } else if (rate >= 88) {
      return `Strong engagement across clusters with ${rate.toFixed(1)}% attendance rate.`;
    } else {
      return `Good engagement noted, maintaining steady operations at ${rate.toFixed(1)}% attendance rate.`;
    }
  };

  // raw text block for copy action
  const rawSummaryText = `MONTHLY PROGRAM REVIEW SUMMARY (${filters.month})
---------------------------------------------
🎯 CORE METRICS OVERVIEW:
- Average Program Attendance: ${avgAtt}%
- Average Project Based Learning (PBL) Participation: ${avgPbl}%

⭐ KEY ACHIEVEMENTS:
${highPerformers.length > 0 ? highPerformers.map((d, i) => `- ${d.district || 'Unknown District'}: ${getAchievementText(d.attendanceRate * 100, i)}`).join('\n') : '- Baseline targets met across standard clusters.'}

⚠️ CRITICAL GAPS IDENTIFIED:
${criticalDistricts.length > 0 ? criticalDistricts.map(d => `- ${d.district || 'Unknown District'}: Low engagement metrics observed. Current attendance at ${(d.attendanceRate * 100).toFixed(1)}%.`).join('\n') : '- No major metric standard violations found.'}

🚨 TOP PRIORITY DISTRICTS FOR INTERVENTION:
${criticalDistricts.length > 0 ? criticalDistricts.map(d => `- ${d.district || 'Unknown District'} (Immediate follow-up required)`).join('\n') : '- Routine field visits standard across all zones.'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="text-indigo-600" size={28} />
            Review Assistant Summary
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Auto-generated deterministic reporting summary compiled for <span className="font-semibold text-slate-700">{filters.month}</span>
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Summary Report'}
        </button>
      </div>

      {/* main grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* left side  achievements and gaps blocks */}
        <div className="space-y-6">
          {/* achievements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Award className="text-emerald-500" />
              Key Achievements
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                Global metric performance tracked successfully with overall baseline participation running at <span className="font-semibold text-slate-800">{avgPbl}%</span>.
              </li>
              
              {highPerformers.map((d, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p><strong>{d.district}:</strong> {getAchievementText(d.attendanceRate * 100, index)}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* gaps section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-500" />
              Critical Gaps & Roadblocks
            </h3>
            <ul className="space-y-3">
              {criticalDistricts.length === 0 ? (
                <li className="text-sm text-slate-500">No major programmatic gaps identified for this time slice.</li>
              ) : (
                criticalDistricts.map((d, index) => (
                  <li key={index} className="text-sm text-slate-700 flex items-start gap-2 bg-amber-50/50 p-2 rounded-lg">
                    <span className="text-amber-600 font-bold">•</span>
                    <p>Metrics tracking shows significant dip in student density for <strong>{d.district}</strong> ({(d.attendanceRate * 100).toFixed(1)}%).</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* right side priority intervention and full generated view preview */}
        <div className="space-y-6">
          {/* priority districts box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Star className="text-indigo-500" fill="currentColor" size={18} />
              Priority Intervention Districts
            </h3>
            {criticalDistricts.length === 0 ? (
              <p className="text-sm text-slate-500 bg-emerald-50 text-emerald-700 p-3 rounded-xl font-medium">All districts are performing within standard safety parameters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {criticalDistricts.map((d, index) => (
                  <div key={index} className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex flex-col justify-between">
                    <span className="font-bold text-slate-800 text-sm">{d.district}</span>
                    <span className="text-xs font-semibold text-red-600 mt-2 bg-white px-2 py-1 rounded-md shadow-2xs w-fit">
                      Immediate Action
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* raw report terminal preview */}
          <div className="bg-slate-900 rounded-2xl p-4 shadow-sm overflow-hidden border border-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>OUTPUT PREVIEW REPORT</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap overflow-y-auto max-h-48 pt-3 leading-relaxed">
              {rawSummaryText}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewSummary;