import type { AnalysisResult } from '../types';
import { X } from 'lucide-react';

interface AnalysisModalProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  onClose: () => void;
}

export function AnalysisModal({ result, isLoading, onClose }: AnalysisModalProps) {
  if (!isLoading && !result) return null;

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-[#00ff41] border-[#00ff41]';
      case 'MODERATE': return 'text-yellow-400 border-yellow-400';
      case 'HIGH':
      case 'CRITICAL': return 'text-red-500 border-red-500';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto select-none">
      <div className="bg-black border-2 border-[#00ff41] p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-2xl shadow-[0_0_20px_rgba(0,255,65,0.3)] font-mono text-[#00ff41] relative flex flex-col max-h-[85vh] sm:max-h-none overflow-hidden my-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-50"></div>
        
        <div className="flex justify-between items-center border-b border-[#00ff41]/30 pb-3 mb-4 shrink-0 gap-2">
          <h2 className="text-sm sm:text-xl tracking-widest font-bold truncate">NEURAL.ANALYSIS.REPORT</h2>
          <button 
            onClick={onClose} 
            className="hover:text-white hover:bg-[#00ff41]/10 border border-[#00ff41]/40 px-3 h-11 flex items-center justify-center gap-1.5 transition-all text-xs sm:text-sm cursor-pointer shrink-0"
          >
            <X size={14} />
            <span>[ CLOSE ]</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 select-text">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="animate-spin w-12 h-12 border-4 border-t-[#00ff41] border-r-[#00ff41] border-b-transparent border-l-transparent rounded-full"></div>
              <p className="animate-pulse text-xs sm:text-sm">PROCESSING VISUAL DATA STREAM...</p>
            </div>
          ) : (
            result && (
              <div className="flex flex-col gap-5 sm:gap-6 pb-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs sm:text-sm opacity-70">THREAT_LEVEL:</span>
                  <div className={`px-4 py-1 border-2 font-bold tracking-wider text-xs sm:text-sm ${getThreatColor(result.threatLevel)}`}>
                    {result.threatLevel}
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm opacity-70 block mb-2">SCENE_DESCRIPTION:</span>
                  <p className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">{result.description}</p>
                </div>

                <div>
                  <span className="text-xs sm:text-sm opacity-70 block mb-2">IDENTIFIED_TAGS:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="bg-[#00ff41]/10 px-2 py-1 text-xs border border-[#00ff41]/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

