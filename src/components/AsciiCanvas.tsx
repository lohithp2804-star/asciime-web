import { useEffect, useRef, useState } from 'react';
import type { AsciiOptions } from '../types';
import { densityMaps } from '../types';
import html2canvas from 'html2canvas';

interface AsciiCanvasProps {
  options: AsciiOptions;
  setCaptureFn: (fn: () => string | null) => void;
  setSaveAsciiFn: (fn: () => Promise<string | null>) => void;
}

export function AsciiCanvas({ options, setCaptureFn, setSaveAsciiFn }: AsciiCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const requestRef = useRef<number>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [scale, setScale] = useState(1);

  // Monitor screen size to scale the base font size down on mobile automatically
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor canvas container and pre elements to calculate precise scale-to-fit
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !preRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      
      // Temporarily reset scale to measure natural width
      preRef.current.style.transform = 'scale(1)';
      const preWidth = preRef.current.scrollWidth;
      
      if (preWidth > containerWidth && containerWidth > 0) {
        const newScale = containerWidth / preWidth;
        setScale(newScale);
      } else {
        setScale(1);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [options, isSmallScreen]);

  const effectiveFontSize = isSmallScreen ? Math.max(6, options.fontSize - 4) : options.fontSize;

  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Failed to access camera", err);
      }
    };
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Provide capture function to parent
    setCaptureFn(() => {
      if (!canvasRef.current || !videoRef.current) return null;
      // Capture a higher quality snapshot
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = videoRef.current.videoWidth || 640;
      snapCanvas.height = videoRef.current.videoHeight || 480;
      const ctx = snapCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, snapCanvas.width, snapCanvas.height);
        return snapCanvas.toDataURL("image/jpeg", 0.8);
      }
      return null;
    });
  }, [setCaptureFn]);

  useEffect(() => {
    setSaveAsciiFn(async () => {
      if (!preRef.current) return null;
      try {
        const canvas = await html2canvas(preRef.current, {
          backgroundColor: '#000000',
          scale: 2 // High resolution
        });
        return canvas.toDataURL("image/jpeg", 0.9);
      } catch (err) {
        console.error("html2canvas error:", err);
        return null;
      }
    });
  }, [setSaveAsciiFn]);

  useEffect(() => {
    const renderAscii = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const pre = preRef.current;
      
      if (!video || !canvas || !pre || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestRef.current = requestAnimationFrame(renderAscii);
        return;
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      video.getBoundingClientRect(); // ensure layout is calculated if needed
      // The logical width/height can be dynamic, let's use the actual video dimensions
      const vWidth = video.videoWidth;
      const vHeight = video.videoHeight;
      
      if (vWidth === 0 || vHeight === 0) {
        requestRef.current = requestAnimationFrame(renderAscii);
        return;
      }

      // Calculate sampled dimensions based on resolution factor
      const w = Math.floor(vWidth * options.resolution);
      const h = Math.floor(vHeight * options.resolution);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // Draw downsampled video
      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      const densityStr = densityMaps[options.density];
      const densityLen = densityStr.length;

      let asciiFrame = "";
      
      for (let y = 0; y < h; y++) {
        let row = "";
        for (let x = 0; x < w; x++) {
          const offset = (y * w + x) * 4;
          let r = data[offset];
          let g = data[offset + 1];
          let b = data[offset + 2];
          
          // Apply brightness
          r = Math.min(255, r * options.brightness);
          g = Math.min(255, g * options.brightness);
          b = Math.min(255, b * options.brightness);
          
          // Apply contrast
          const applyContrast = (val: number) => {
            return Math.min(255, Math.max(0, ((val / 255 - 0.5) * options.contrast + 0.5) * 255));
          };
          r = applyContrast(r);
          g = applyContrast(g);
          b = applyContrast(b);

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIndex = Math.floor((brightness / 255) * (densityLen - 1));
          const char = densityStr[charIndex] || " ";

          if (options.colorMode === 'color') {
            // In color mode, we wrap chars in spans (expensive, but necessary for true color)
            // Or we could just use canvas for color rendering, but requirements say:
            // "render all characters to a visible <pre> or <canvas> element"
            // Let's use string if not color mode, otherwise we might need HTML.
            // Wait, building HTML string is okay for react if using dangerouslySetInnerHTML
            row += `<span style="color: rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})">${char === ' ' ? '&nbsp;' : char}</span>`;
          } else {
            row += char;
          }
        }
        asciiFrame += row + (options.colorMode === 'color' ? "<br/>" : "\n");
      }

      if (options.colorMode === 'color') {
        pre.innerHTML = asciiFrame;
      } else {
        pre.textContent = asciiFrame;
      }

      requestRef.current = requestAnimationFrame(renderAscii);
    };

    requestRef.current = requestAnimationFrame(renderAscii);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [options]);

  const getColorClass = () => {
    switch (options.colorMode) {
      case 'matrix': return 'text-[#00ff41]';
      case 'bw': return 'text-white';
      case 'retro': return 'text-[#ffb000]';
      case 'color': return '';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black flex-1 p-2">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <pre 
        ref={preRef} 
        className={`font-mono text-center leading-none ${getColorClass()} w-full max-w-full`}
        style={{ 
          fontSize: `${effectiveFontSize}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          whiteSpace: 'pre'
        }}
      />
    </div>
  );
}
