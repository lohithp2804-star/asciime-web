import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AsciiOptions } from '../types';
import { densityMaps } from '../types';
import { Camera, Save, Settings, X } from 'lucide-react';

interface ControlPanelProps {
  options: AsciiOptions;
  setOptions: Dispatch<SetStateAction<AsciiOptions>>;
  onCapture: () => void;
  onSaveSnapshot: () => void;
  isAnalyzing: boolean;
}

export function ControlPanel({ options, setOptions, onCapture, onSaveSnapshot, isAnalyzing }: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof AsciiOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main Control Panel Div */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-black/95 border-t border-[#00ff41]/40 z-30 transition-transform duration-300 md:relative md:translate-y-0 md:bg-black/80 md:z-10 backdrop-blur-md flex flex-col font-mono text-sm text-[#00ff41] ${
          isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-72px)] md:translate-y-0'
        }`}
      >
        {/* Toggle Header / Action Bar on Mobile */}
        <div className="flex md:hidden items-center justify-between px-4 h-[72px] border-b border-[#00ff41]/20 shrink-0 select-none">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#00ff41] border border-[#00ff41]/50 px-3 h-11 flex items-center justify-center gap-2 font-bold hover:bg-[#00ff41]/10 text-xs transition-colors"
          >
            {isExpanded ? <X size={16} /> : <Settings size={16} />}
            {isExpanded ? "[ CLOSE CTRL ]" : "[ OPTIONS ]"}
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={onCapture}
              disabled={isAnalyzing}
              className="flex items-center justify-center w-11 h-11 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isAnalyzing ? "ANALYZING..." : "CAPTURE & ANALYZE"}
            >
              <Camera size={18} />
            </button>
            <button 
              onClick={onSaveSnapshot}
              className="flex items-center justify-center w-11 h-11 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20 transition-colors"
              title="SAVE SNAPSHOT"
            >
              <Save size={18} />
            </button>
          </div>
        </div>

        {/* Control Inputs Container */}
        <div className="p-4 flex flex-col gap-6 max-h-[70vh] overflow-y-auto md:max-h-none md:overflow-visible">
          {/* Sliders and Selectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-center">
            
            {/* Sliders */}
            <div className="flex flex-col gap-1">
              <label className="flex justify-between text-xs sm:text-sm">
                <span>FONT.SIZE</span>
                <span>{options.fontSize}px</span>
              </label>
              <div className="h-11 flex items-center w-full">
                <input 
                  type="range" 
                  min="8" 
                  max="20" 
                  step="1" 
                  value={options.fontSize} 
                  onChange={e => handleChange('fontSize', Number(e.target.value))} 
                  className="accent-[#00ff41] w-full cursor-pointer h-2" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="flex justify-between text-xs sm:text-sm">
                <span>BRIGHTNESS</span>
                <span>{options.brightness.toFixed(1)}x</span>
              </label>
              <div className="h-11 flex items-center w-full">
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={options.brightness} 
                  onChange={e => handleChange('brightness', Number(e.target.value))} 
                  className="accent-[#00ff41] w-full cursor-pointer h-2" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="flex justify-between text-xs sm:text-sm">
                <span>CONTRAST</span>
                <span>{options.contrast.toFixed(1)}x</span>
              </label>
              <div className="h-11 flex items-center w-full">
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={options.contrast} 
                  onChange={e => handleChange('contrast', Number(e.target.value))} 
                  className="accent-[#00ff41] w-full cursor-pointer h-2" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="flex justify-between text-xs sm:text-sm">
                <span>RESOLUTION</span>
                <span>{options.resolution.toFixed(2)}</span>
              </label>
              <div className="h-11 flex items-center w-full">
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.5" 
                  step="0.05" 
                  value={options.resolution} 
                  onChange={e => handleChange('resolution', Number(e.target.value))} 
                  className="accent-[#00ff41] w-full cursor-pointer h-2" 
                />
              </div>
            </div>

            {/* Selectors */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm">COLOR.MODE</label>
              <div className="h-11 flex items-center w-full">
                <select 
                  value={options.colorMode} 
                  onChange={e => handleChange('colorMode', e.target.value)}
                  className="bg-black border border-[#00ff41] h-11 w-full px-2 text-[#00ff41] outline-none"
                >
                  <option value="matrix">MATRIX</option>
                  <option value="bw">B&W</option>
                  <option value="color">COLOR</option>
                  <option value="retro">RETRO</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm">DENSITY.MAP</label>
              <div className="h-11 flex items-center w-full">
                <select 
                  value={options.density} 
                  onChange={e => handleChange('density', e.target.value)}
                  className="bg-black border border-[#00ff41] h-11 w-full px-2 text-[#00ff41] outline-none"
                >
                  {Object.keys(densityMaps).map(key => (
                    <option key={key} value={key}>{key.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Action Buttons */}
          <div className="hidden md:flex justify-center gap-4 mt-2">
            <button 
              onClick={onCapture}
              disabled={isAnalyzing}
              className="flex items-center gap-2 border-2 border-[#00ff41] px-6 h-11 hover:bg-[#00ff41] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
            >
              <Camera size={20} />
              {isAnalyzing ? "ANALYZING..." : "CAPTURE & ANALYZE"}
            </button>
            <button 
              onClick={onSaveSnapshot}
              className="flex items-center gap-2 border-2 border-[#00ff41] px-6 h-11 hover:bg-[#00ff41] hover:text-black transition-colors cursor-pointer font-bold text-sm"
            >
              <Save size={20} />
              SAVE SNAPSHOT
            </button>
          </div>

          {/* Expanded Drawer Action Buttons on Mobile */}
          <div className="flex md:hidden flex-col gap-3 mt-4">
            <button 
              onClick={() => {
                setIsExpanded(false);
                onCapture();
              }}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 border-2 border-[#00ff41] w-full h-11 hover:bg-[#00ff41] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm cursor-pointer"
            >
              <Camera size={20} />
              {isAnalyzing ? "ANALYZING..." : "CAPTURE & ANALYZE"}
            </button>
            <button 
              onClick={() => {
                setIsExpanded(false);
                onSaveSnapshot();
              }}
              className="flex items-center justify-center gap-2 border-2 border-[#00ff41] w-full h-11 hover:bg-[#00ff41] hover:text-black transition-colors font-bold text-sm cursor-pointer"
            >
              <Save size={20} />
              SAVE SNAPSHOT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
