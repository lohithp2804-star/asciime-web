import type { Dispatch, SetStateAction } from 'react';
import type { AsciiOptions } from '../types';
import { densityMaps } from '../types';
import { Camera, Save } from 'lucide-react';

interface ControlPanelProps {
  options: AsciiOptions;
  setOptions: Dispatch<SetStateAction<AsciiOptions>>;
  onCapture: () => void;
  onSaveSnapshot: () => void;
  isAnalyzing: boolean;
}

export function ControlPanel({ options, setOptions, onCapture, onSaveSnapshot, isAnalyzing }: ControlPanelProps) {
  const handleChange = (key: keyof AsciiOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-black/80 border-t border-[#00ff41]/50 p-4 text-[#00ff41] font-mono text-sm z-10 flex flex-col gap-4 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-center">
        
        {/* Sliders */}
        <div className="flex flex-col gap-1">
          <label className="flex justify-between"><span>FONT.SIZE</span><span>{options.fontSize}px</span></label>
          <input type="range" min="8" max="20" step="1" value={options.fontSize} onChange={e => handleChange('fontSize', Number(e.target.value))} className="accent-[#00ff41]" />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="flex justify-between"><span>BRIGHTNESS</span><span>{options.brightness.toFixed(1)}x</span></label>
          <input type="range" min="0.5" max="2.0" step="0.1" value={options.brightness} onChange={e => handleChange('brightness', Number(e.target.value))} className="accent-[#00ff41]" />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="flex justify-between"><span>CONTRAST</span><span>{options.contrast.toFixed(1)}x</span></label>
          <input type="range" min="0.5" max="2.0" step="0.1" value={options.contrast} onChange={e => handleChange('contrast', Number(e.target.value))} className="accent-[#00ff41]" />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="flex justify-between"><span>RESOLUTION</span><span>{options.resolution.toFixed(2)}</span></label>
          <input type="range" min="0.1" max="0.5" step="0.05" value={options.resolution} onChange={e => handleChange('resolution', Number(e.target.value))} className="accent-[#00ff41]" />
        </div>

        {/* Selectors */}
        <div className="flex flex-col gap-1">
          <label>COLOR.MODE</label>
          <select 
            value={options.colorMode} 
            onChange={e => handleChange('colorMode', e.target.value)}
            className="bg-black border border-[#00ff41] p-1 text-[#00ff41] outline-none"
          >
            <option value="matrix">MATRIX</option>
            <option value="bw">B&W</option>
            <option value="color">COLOR</option>
            <option value="retro">RETRO</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>DENSITY.MAP</label>
          <select 
            value={options.density} 
            onChange={e => handleChange('density', e.target.value)}
            className="bg-black border border-[#00ff41] p-1 text-[#00ff41] outline-none"
          >
            {Object.keys(densityMaps).map(key => (
              <option key={key} value={key}>{key.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <button 
          onClick={onCapture}
          disabled={isAnalyzing}
          className="flex items-center gap-2 border-2 border-[#00ff41] px-6 py-2 hover:bg-[#00ff41] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera size={20} />
          {isAnalyzing ? "ANALYZING..." : "CAPTURE & ANALYZE"}
        </button>
        <button 
          onClick={onSaveSnapshot}
          className="flex items-center gap-2 border-2 border-[#00ff41] px-6 py-2 hover:bg-[#00ff41] hover:text-black transition-colors"
        >
          <Save size={20} />
          SAVE SNAPSHOT
        </button>
      </div>
    </div>
  );
}
