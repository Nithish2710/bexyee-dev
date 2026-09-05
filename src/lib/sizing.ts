export type SizeCategory = "APPAREL_TOPS" | "APPAREL_BOTTOMS" | "FOOTWEAR" | "ACCESSORIES";

export type TopSizeMeasurements = {
  length: number;    // Inches
  chest: number;     // Inches
  shoulder: number;  // Inches
  sleeve: number;    // Inches
};

export type SizeChartMeasurements = Record<string, TopSizeMeasurements | Record<string, number>>;

export type SizeChart = {
  id: string;
  name: string;
  category: SizeCategory;
  unit: "INCHES" | "CM";
  measurements: Record<"S" | "M" | "L" | "XL" | string, TopSizeMeasurements>;
  isDefault: boolean;
  description?: string;
  fitDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Standard Default Apparel S/M/L/XL Size Chart
 * Length, Chest, Shoulder, Sleeve in inches.
 * Single source of truth for standard tops.
 */
export const DEFAULT_APPAREL_SIZE_CHART: SizeChart = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Standard Apparel Tops (S/M/L/XL)",
  category: "APPAREL_TOPS",
  unit: "INCHES",
  measurements: {
    S: { length: 28.5, chest: 42.0, shoulder: 20.5, sleeve: 8.5 },
    M: { length: 29.5, chest: 44.0, shoulder: 21.5, sleeve: 9.0 },
    L: { length: 30.5, chest: 46.0, shoulder: 22.5, sleeve: 9.5 },
    XL: { length: 31.5, chest: 48.0, shoulder: 23.5, sleeve: 10.0 },
  },
  isDefault: true,
};

/**
 * Resolves a size chart by ID or returns the default standard apparel chart
 */
export function resolveSizeChart(
  customChart?: Partial<SizeChart> | null
): SizeChart {
  if (!customChart || !customChart.measurements) {
    return DEFAULT_APPAREL_SIZE_CHART;
  }

  return {
    id: customChart.id || DEFAULT_APPAREL_SIZE_CHART.id,
    name: customChart.name || DEFAULT_APPAREL_SIZE_CHART.name,
    category: customChart.category || DEFAULT_APPAREL_SIZE_CHART.category,
    unit: customChart.unit || DEFAULT_APPAREL_SIZE_CHART.unit,
    measurements: {
      ...DEFAULT_APPAREL_SIZE_CHART.measurements,
      ...customChart.measurements,
    },
    isDefault: customChart.isDefault ?? false,
  };
}

/**
 * Converts inches to centimeters with 1 decimal precision
 */
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}
