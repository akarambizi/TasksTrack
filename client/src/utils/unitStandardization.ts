// Unit standardization and conversion utilities for analytics
// This ensures consistent data aggregation across habits

export const METRIC_TYPE_CONFIG = {
  duration: {
    label: 'Time/Duration',
    units: ['minutes', 'hours', 'seconds'],
    baseUnit: 'minutes',
    conversions: {
      seconds: (value: number) => value / 60,
      minutes: (value: number) => value,
      hours: (value: number) => value * 60
    }
  },
  count: {
    label: 'Count/Repetitions',
    units: ['times', 'reps', 'sets', 'pieces'],
    baseUnit: 'times',
    conversions: {
      times: (value: number) => value,
      reps: (value: number) => value,
      sets: (value: number) => value,
      pieces: (value: number) => value
    }
  },
  distance: {
    label: 'Distance',
    units: ['miles', 'kilometers', 'steps', 'meters'],
    baseUnit: 'kilometers',
    conversions: {
      meters: (value: number) => value / 1000,
      kilometers: (value: number) => value,
      miles: (value: number) => value * 1.60934,
      steps: (value: number) => value * 0.000762 // Average step = 0.762m
    }
  },
  pages: {
    label: 'Pages/Items',
    units: ['pages', 'chapters', 'articles', 'books'],
    baseUnit: 'pages',
    conversions: {
      pages: (value: number) => value,
      chapters: (value: number) => value * 20, // Estimate 20 pages per chapter
      articles: (value: number) => value * 3, // Estimate 3 pages per article
      books: (value: number) => value * 250 // Estimate 250 pages per book
    }
  },
  volume: {
    label: 'Volume/Quantity',
    units: ['cups', 'glasses', 'liters', 'ounces'],
    baseUnit: 'liters',
    conversions: {
      liters: (value: number) => value,
      cups: (value: number) => value * 0.236588, // US cup
      glasses: (value: number) => value * 0.25, // Typical glass
      ounces: (value: number) => value * 0.0295735 // US fluid ounce
    }
  },
  weight: {
    label: 'Weight',
    units: ['lbs', 'kg', 'grams', 'tons'],
    baseUnit: 'kg',
    conversions: {
      kg: (value: number) => value,
      lbs: (value: number) => value * 0.453592,
      grams: (value: number) => value / 1000,
      tons: (value: number) => value * 1000
    }
  },
  binary: {
    label: 'Yes/No Completion',
    units: ['completed'],
    baseUnit: 'completed',
    conversions: {
      completed: (value: number) => value // 1 or 0
    }
  },
  percentage: {
    label: 'Percentage/Score',
    units: ['percent', 'points', 'score'],
    baseUnit: 'percent',
    conversions: {
      percent: (value: number) => value,
      points: (value: number) => value, // Assuming points are already percentage-like
      score: (value: number) => value // Assuming score is already percentage-like
    }
  },
  currency: {
    label: 'Money/Cost',
    units: ['dollars', 'euros', 'pounds', 'cents'],
    baseUnit: 'dollars',
    conversions: {
      dollars: (value: number) => value,
      cents: (value: number) => value / 100,
      // Note: For real currency conversion, you'd need exchange rates
      euros: (value: number) => value, // Placeholder - would need API
      pounds: (value: number) => value // Placeholder - would need API
    }
  }
} as const;

export type MetricType = keyof typeof METRIC_TYPE_CONFIG;

/**
 * Convert a value from any unit to the base unit for a metric type
 * This enables consistent aggregation in analytics
 */
export function convertToBaseUnit(metricType: MetricType, value: number, fromUnit: string): number {
  const config = METRIC_TYPE_CONFIG[metricType];
  const converter = config.conversions[fromUnit as keyof typeof config.conversions];
  
  if (!converter) {
    console.warn(`Unknown unit '${fromUnit}' for metric type '${metricType}'. Using value as-is.`);
    return value;
  }
  
  return converter(value);
}

/**
 * Get the base unit for a metric type
 * Useful for displaying aggregated values in analytics
 */
export function getBaseUnit(metricType: MetricType): string {
  return METRIC_TYPE_CONFIG[metricType].baseUnit;
}

/**
 * Standardize habit log values for analytics aggregation
 * This function takes raw habit log data and converts all values to base units
 */
export interface HabitLogData {
  habitId: number;
  metricType: MetricType;
  unit: string;
  value: number;
}

export function standardizeHabitLogValues(logs: HabitLogData[]): HabitLogData[] {
  return logs.map(log => ({
    ...log,
    value: convertToBaseUnit(log.metricType, log.value, log.unit),
    unit: getBaseUnit(log.metricType)
  }));
}

// Additional utility functions for future analytics enhancements:
// - getAvailableUnits: Get all available units for a metric type
// - isValidUnit: Validate if a unit is valid for a metric type  
// - aggregateHabitLogsByMetricType: Group and aggregate logs by metric type
// - formatValueWithUnit: Format a value with its unit for display
// - getMetricTypeInfo: Get display-friendly metric type information
// These will be exported when analytics features are implemented