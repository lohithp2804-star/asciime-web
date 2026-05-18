export interface AsciiOptions {
  fontSize: number;
  brightness: number;
  contrast: number;
  colorMode: 'matrix' | 'bw' | 'color' | 'retro';
  density: 'simple' | 'complex' | 'binary' | 'blocks';
  resolution: number;
}

export interface AnalysisResult {
  description: string;
  tags: string[];
  threatLevel: string;
}

export const densityMaps = {
  simple: " .:-=+*#%@",
  complex: " .^!*<&%$#@",
  binary: " 01",
  blocks: " ░▒▓█"
};
