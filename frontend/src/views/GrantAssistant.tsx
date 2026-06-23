
import React, { useState, useEffect } from 'react';
import { fetchAvailableGrants, fetchGrantDetails, generateReportNarrative } from '../services/api';
import { FileText, Image as ImageIcon, DollarSign, Activity, Bot, ShieldAlert } from 'lucide-react';

const GrantAssistant = () => {
  const [grants, setGrants] = useState<any[]>([]);
  const [selectedGrant, setSelectedGrant] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  
  const [grantData, setGrantData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  
  const [narrative, setNarrative] = useState('');
  const [narrativeSource, setNarrativeSource] = useState('');
  const [isAiDisabled, setIsAiDisabled] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);


  useEffect(() => {
    fetchAvailableGrants().then(res => {
      if (res.success) {
        setGrants(res.data);
        if (res.data.length > 0) setSelectedGrant(res.data[0]._id);
      }
    });
  }, []);


  useEffect(() => {
    if (!selectedGrant || !selectedMonth) return;
    
    const loadDetails = async () => {
      setLoadingData(true);
      setNarrative('');
      try {
        const res = await fetchGrantDetails(selectedGrant, selectedMonth);
        if (res.success) setGrantData(res.data);
      } catch (err) {
        console.error("Error fetching grant details", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadDetails();
  }, [selectedGrant, selectedMonth]);

  const handleGenerateReport = async () => {
    setGeneratingAi(true);
    try {
      const res = await generateReportNarrative(selectedGrant, selectedMonth, isAiDisabled);
      if (res.success) {
        setNarrative(res.data.narrative);
        setNarrativeSource(res.data.source);
      }
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Grant Reporting Assistant</h1>
          <p className="text-sm text-slate-500">Review finances, performance, and generate donor reports.</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedGrant}
            onChange={(e) => setSelectedGrant(e.target.value)}
          >
            {grants.map(g => (
              <option key={g._id} value={g._id}>{g.grantName} ({g.donor})</option>
            ))}
          </select>

          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2025-07">July 2025</option>
            <option value="2025-08">August 2025</option>
            <option value="2025-09">September 2025</option>
          </select>
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center h-64 text-slate-500">Loading Grant Data...</div>
      ) : grantData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
         
          <div className="lg:col-span-2 space-y-6">
            
            {/* KPI Cards for randering deatilas  */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  
  {/* PBL Completion Card */}
  <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 ${
    (grantData.performance.pbl_completion_rate * 100) >= 75 
      ? 'border-l-emerald-500' 
      : (grantData.performance.pbl_completion_rate * 100) >= 50 
        ? 'border-l-amber-500' 
        : 'border-l-red-500'
  }`}>
    <p className="text-sm text-slate-500">PBL Completion</p>
    <p className="text-2xl font-bold">{(grantData.performance.pbl_completion_rate * 100).toFixed(1)}%</p>
  </div>

  {/* Evidence Submission Card */}
  <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 ${
    (grantData.performance.evidence_submission_rate * 100) >= 75 
      ? 'border-l-emerald-500' 
      : (grantData.performance.evidence_submission_rate * 100) >= 50 
        ? 'border-l-amber-500' 
        : 'border-l-red-500'
  }`}>
    <p className="text-sm text-slate-500">Evidence Submission</p>
    <p className="text-2xl font-bold">{(grantData.performance.evidence_submission_rate * 100).toFixed(1)}%</p>
  </div>

  {/* Risk Status Card */}
  <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 ${
    grantData.performance.risk_status === 'Behind' 
      ? 'border-l-orange-500' 
      : (grantData.performance.risk_status === 'At Risk' || grantData.performance.risk_status === 'Critical')
      ? 'border-l-red-500' 
      : 'border-l-emerald-500'
  }`}>
    <p className="text-sm text-slate-500">Risk Status</p>
    <p className={`text-xl font-bold mt-1 ${
      grantData.performance.risk_status === 'Behind' 
        ? 'text-orange-600' 
        : (grantData.performance.risk_status === 'At Risk' || grantData.performance.risk_status === 'Critical')
        ? 'text-red-600' 
        : 'text-emerald-600'
    }`}>
      {grantData.performance.risk_status}
    </p>
  </div>

</div>

            {/* Financial Budgets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <DollarSign size={18} className="text-slate-500"/>
                <h2 className="text-lg font-semibold text-slate-800">Financial Utilization</h2>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Budget Line</th>
                    <th className="px-6 py-3 font-medium">Approved Units</th>
                    <th className="px-6 py-3 font-medium">Utilized</th>
                    <th className="px-6 py-3 font-medium">Utilization Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {grantData.finances.map((finance: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 font-medium">{finance.budget_line}</td>
                      <td className="px-6 py-4">{finance.approved_budget_units}</td>
                      <td className="px-6 py-4">{finance.cumulative_utilized_units}</td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${finance.cumulative_utilization_rate * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 inline-block">{(finance.cumulative_utilization_rate * 100).toFixed(1)}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Evidence ad Media Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <ImageIcon size={18} className="text-slate-500"/>
                <h2 className="text-lg font-semibold text-slate-800">Evidence Media</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {grantData.media.map((item: any) => (
                  <div key={item._id} className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                    {/* Make sure images are in frontend/public/images/ */}
                    <img src={`/${item.relative_path}`} alt={item.title} className="w-full h-40 object-cover rounded-md mb-2 bg-slate-200" />
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.usage_note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* right column  ai narrative generator */}
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden flex flex-col h-full">
              <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-indigo-700"/>
                  <h2 className="text-lg font-semibold text-indigo-900">AI Report Generator</h2>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col gap-4">
                <p className="text-sm text-indigo-800">
                  Generate a donor-ready summary based strictly on the deterministic metrics shown.
                </p>

                {/* the guardrail toggel */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">AI Generation Engine</span>
                    <span className="text-xs text-slate-500">Disable to see fallback raw facts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={!isAiDisabled} onChange={() => setIsAiDisabled(!isAiDisabled)} />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <button 
                  onClick={handleGenerateReport}
                  disabled={generatingAi}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generatingAi ? 'Generating...' : (isAiDisabled ? 'Fetch Raw Facts' : 'Draft Narrative')}
                </button>

                {/* result box */}
                {narrative && (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="p-4 bg-white border border-indigo-200 rounded-lg text-sm text-slate-700 leading-relaxed min-h-[150px]">
                      {narrative}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 justify-end">
                      {isAiDisabled ? <ShieldAlert size={12}/> : <Bot size={12}/>}
                      Generated via {narrativeSource}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default GrantAssistant;