
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Activity, FileText, ClipboardCheck, Map } from 'lucide-react'; // 👈 Added ClipboardCheck and Map icons
import { FilterProvider } from './context/FilterContext';
import { UIProvider } from './context/UIContext';
import DistrictBlock from './views/DistrictBlock';
import ReviewSummary from './views/ReviewSummary';
import GrantAssistant from './views/GrantAssistant.tsx';
import SchoolDashboard from './views/SchoolDashboard.tsx';

function App() {
  return (
    <UIProvider>
      <FilterProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50/50">
            {/* top navigation bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* logo or branding */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      M4C
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">Program Intelligence</span>
                  </div>

                  {/* navigation tabs */}
                  <nav className="flex gap-2 sm:gap-4">
                    {/* 1 school analytics */}
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Activity size={18} />
                      <span className="hidden md:inline">School Analytics</span>
                    </NavLink>

                    {/* 2 review summary (newly activated) */}
                    <NavLink
                      to="/review"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                          isActive 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <ClipboardCheck size={18} />
                      <span className="hidden md:inline">Review Summary</span>
                    </NavLink>

                    {/* 3. district drilldown (newly activated) */}
                    <NavLink
                      to="/district"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Map size={18} />
                      <span className="hidden md:inline">District Drilldown</span>
                    </NavLink>
                    
                    {/* 4 grant reporting */}
                    <NavLink
                      to="/grant-assistant"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                          isActive 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <FileText size={18} />
                      <span className="hidden md:inline">Grant Reporting</span>
                    </NavLink>
                  </nav>
                </div>
              </div>
            </header>

            {/* main content area */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/district" element={<DistrictBlock />} />
                <Route path="/review" element={<ReviewSummary />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<SchoolDashboard />} />
                <Route path="/grant-assistant" element={<GrantAssistant />} />
              </Routes>
            </main>
          </div>
        </Router>
      </FilterProvider>
    </UIProvider>
  );
}

export default App;