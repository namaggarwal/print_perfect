export const PRINT_CATEGORIES = {
  POPULAR: 'Popular Photo',
  METRIC: 'Metric & ISO',
  FRAME: 'Standard Frame',
  LARGE: 'Large Format',
  CUSTOM: 'Custom Size'
};

export const PRINT_PRESETS = [
  // Popular Photo Sizes
  { id: '4x6', name: '4 × 6 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 4, heightInches: 6, unit: 'in', metricName: '10.2 × 15.2 cm' },
  { id: '5x7', name: '5 × 7 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 5, heightInches: 7, unit: 'in', metricName: '12.7 × 17.8 cm' },
  { id: '8x10', name: '8 × 10 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 8, heightInches: 10, unit: 'in', metricName: '20.3 × 25.4 cm' },
  { id: '10x12', name: '10 × 12 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 10, heightInches: 12, unit: 'in', metricName: '25.4 × 30.5 cm' },
  { id: '11x14', name: '11 × 14 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 11, heightInches: 14, unit: 'in', metricName: '27.9 × 35.6 cm' },
  { id: '12x18', name: '12 × 18 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 12, heightInches: 18, unit: 'in', metricName: '30.5 × 45.7 cm' },
  { id: '16x20', name: '16 × 20 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 16, heightInches: 20, unit: 'in', metricName: '40.6 × 50.8 cm' },
  { id: '20x24', name: '20 × 24 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 20, heightInches: 24, unit: 'in', metricName: '50.8 × 61.0 cm' },
  { id: '24x36', name: '24 × 36 in', category: PRINT_CATEGORIES.POPULAR, widthInches: 24, heightInches: 36, unit: 'in', metricName: '61.0 × 91.4 cm' },

  // Metric & ISO
  { id: '6x4_m', name: '6 × 4 in', category: PRINT_CATEGORIES.METRIC, widthInches: 6, heightInches: 4, unit: 'in', metricName: '15.2 × 10.2 cm' },
  { id: '7x5_m', name: '7 × 5 in', category: PRINT_CATEGORIES.METRIC, widthInches: 7, heightInches: 5, unit: 'in', metricName: '17.8 × 12.7 cm' },
  { id: '8x6_m', name: '8 × 6 in', category: PRINT_CATEGORIES.METRIC, widthInches: 8, heightInches: 6, unit: 'in', metricName: '20.3 × 15.2 cm' },
  { id: '10x8_m', name: '10 × 8 in', category: PRINT_CATEGORIES.METRIC, widthInches: 10, heightInches: 8, unit: 'in', metricName: '25.4 × 20.3 cm' },
  { id: '12x8_m', name: '12 × 8 in', category: PRINT_CATEGORIES.METRIC, widthInches: 12, heightInches: 8, unit: 'in', metricName: '30.5 × 20.3 cm' },
  { id: '14x11_m', name: '14 × 11 in', category: PRINT_CATEGORIES.METRIC, widthInches: 14, heightInches: 11, unit: 'in', metricName: '35.6 × 27.9 cm' },
  { id: 'A5', name: 'A5 Paper', category: PRINT_CATEGORIES.METRIC, widthInches: 5.827, heightInches: 8.268, unit: 'mm', widthOriginal: 148, heightOriginal: 210, metricName: '148 × 210 mm' },
  { id: 'A4', name: 'A4 Paper', category: PRINT_CATEGORIES.METRIC, widthInches: 8.268, heightInches: 11.693, unit: 'mm', widthOriginal: 210, heightOriginal: 297, metricName: '210 × 297 mm' },
  { id: 'A3', name: 'A3 Paper', category: PRINT_CATEGORIES.METRIC, widthInches: 11.693, heightInches: 16.535, unit: 'mm', widthOriginal: 297, heightOriginal: 420, metricName: '297 × 420 mm' },

  // Frame Sizes
  { id: 'frame_8x10', name: '8 × 10 Frame', category: PRINT_CATEGORIES.FRAME, widthInches: 8, heightInches: 10, unit: 'in' },
  { id: 'frame_11x14', name: '11 × 14 Frame', category: PRINT_CATEGORIES.FRAME, widthInches: 11, heightInches: 14, unit: 'in' },
  { id: 'frame_16x20', name: '16 × 20 Frame', category: PRINT_CATEGORIES.FRAME, widthInches: 16, heightInches: 20, unit: 'in' },
  { id: 'frame_20x24', name: '20 × 24 Frame', category: PRINT_CATEGORIES.FRAME, widthInches: 20, heightInches: 24, unit: 'in' },

  // Large Format
  { id: 'large_12x18', name: '12 × 18 in', category: PRINT_CATEGORIES.LARGE, widthInches: 12, heightInches: 18, unit: 'in' },
  { id: 'large_16x24', name: '16 × 24 in', category: PRINT_CATEGORIES.LARGE, widthInches: 16, heightInches: 24, unit: 'in' },
  { id: 'large_20x30', name: '20 × 30 in', category: PRINT_CATEGORIES.LARGE, widthInches: 20, heightInches: 30, unit: 'in' },
  { id: 'large_24x36', name: '24 × 36 in', category: PRINT_CATEGORIES.LARGE, widthInches: 24, heightInches: 36, unit: 'in' }
];

export const DPI_OPTIONS = [
  { value: 150, label: '150 PPI (Draft / Wall View)' },
  { value: 200, label: '200 PPI (Standard Web / Large poster)' },
  { value: 240, label: '240 PPI (Very Good)' },
  { value: 300, label: '300 PPI (Professional Photo Print)', default: true }
];

export const FIT_MODES = {
  FILL: 'fill',       // Cover full print area (crops excess)
  FIT: 'fit',         // Fit full image inside print area (leaves margins/matting if needed)
  STRETCH: 'stretch', // Stretch image to print aspect ratio
  SMART: 'smart'      // Smart auto-subject crop & fill
};
