import { useState, useRef } from 'react';
import { AsciiCanvas } from './components/AsciiCanvas';
import { ControlPanel } from './components/ControlPanel';
import { AnalysisModal } from './components/AnalysisModal';
import type { AsciiOptions, AnalysisResult } from './types';
import { analyzeImage } from './services/geminiService';
import { playStartSound, playCompleteSound } from './utils/soundEffects';
import { Terminal } from 'lucide-react';

function App() {
  const [options, setOptions] = useState<AsciiOptions>({
    fontSize: 12,
    brightness: 1.0,
    contrast: 1.0,
    colorMode: 'matrix',
    density: 'simple',
    resolution: 0.2,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // We use a ref to store the capture functions provided by AsciiCanvas
  const captureFnRef = useRef<() => string | null>(() => null);
  const saveAsciiFnRef = useRef<() => Promise<string | null>>(async () => null);

  const handleCapture = async () => {
    const dataUrl = captureFnRef.current();
    if (!dataUrl) return;

    playStartSound();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeImage(dataUrl);
    
    setAnalysisResult(result);
    setIsAnalyzing(false);
    playCompleteSound();
  };

  const handleSaveSnapshot = async () => {
    const dataUrl = await saveAsciiFnRef.current();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `cyberascii-snapshot-${Date.now()}.jpg`;
    link.click();
    playCompleteSound();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex flex-col font-mono text-[#00ff41] relative scanlines">
      {/* HUD Header */}
      <header className="h-14 bg-gradient-to-b from-black via-black/80 to-transparent border-b border-[#00ff41]/20 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="animate-pulse text-[#00ff41]" size={24} />
          <h1 className="text-xl tracking-widest font-bold drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">Asciime-Web v1.0</h1>
        </div>
        <div className="text-sm opacity-80 tracking-wider">
          SYS.STATUS: ONLINE · CAM.FEED: ACTIVE · REC <span className="text-red-500 animate-pulse">●</span>
        </div>
      </header>

      {/* Main ASCII Canvas */}
      <AsciiCanvas 
        options={options} 
        setCaptureFn={(fn) => { captureFnRef.current = fn; }} 
        setSaveAsciiFn={(fn) => { saveAsciiFnRef.current = fn; }}
      />

      {/* Bottom Control Panel */}
      <ControlPanel 
        options={options} 
        setOptions={setOptions} 
        onCapture={handleCapture}
        onSaveSnapshot={handleSaveSnapshot}
        isAnalyzing={isAnalyzing}
      />

      {/* Analysis Modal */}
      <AnalysisModal 
        result={analysisResult} 
        isLoading={isAnalyzing} 
        onClose={() => setAnalysisResult(null)} 
      />
    </div>
  );
}

export default App;
