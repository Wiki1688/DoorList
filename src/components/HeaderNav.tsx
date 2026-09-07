import React from 'react';
import { ClipboardList, BarChart3 } from 'lucide-react';
import { Screen } from '../types';

interface HeaderNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  flaggedCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onScreenChange,
  flaggedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-base shadow-sm">
            DL
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              DoorList
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-none">
              Registration Desk
            </p>
          </div>
        </div>

        {/* Right side: Tabs */}
        <div className="flex items-center gap-2">
          <nav className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60" aria-label="Screen tabs">
            <button
              id="nav-tab-desk"
              type="button"
              onClick={() => onScreenChange('desk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentScreen === 'desk'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Desk</span>
            </button>
            <button
              id="nav-tab-summary"
              type="button"
              onClick={() => onScreenChange('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all relative ${
                currentScreen === 'summary'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Summary</span>
              {flaggedCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {flaggedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
