using System;
using System.Collections.Generic;

namespace TasksTrack.Services
{
    /// <summary>
    /// Unit standardization and conversion utilities for analytics
    /// Ensures consistent data aggregation across habits with different units
    /// </summary>
    public static class UnitStandardizationService
    {
        // Metric type configuration for standardization
        private static readonly Dictionary<string, (string BaseUnit, Dictionary<string, Func<decimal, decimal>> Conversions)> MetricTypeConfig = new()
        {
            ["duration"] = ("minutes", new Dictionary<string, Func<decimal, decimal>>
            {
                ["seconds"] = value => value / 60m,
                ["minutes"] = value => value,
                ["hours"] = value => value * 60m
            }),
            ["count"] = ("times", new Dictionary<string, Func<decimal, decimal>>
            {
                ["times"] = value => value,
                ["reps"] = value => value,
                ["sets"] = value => value,
                ["pieces"] = value => value
            }),
            ["distance"] = ("kilometers", new Dictionary<string, Func<decimal, decimal>>
            {
                ["meters"] = value => value / 1000m,
                ["kilometers"] = value => value,
                ["miles"] = value => value * 1.60934m,
                ["steps"] = value => value * 0.000762m // Average step = 0.762m
            }),
            ["pages"] = ("pages", new Dictionary<string, Func<decimal, decimal>>
            {
                ["pages"] = value => value,
                ["chapters"] = value => value * 20m, // Estimate 20 pages per chapter
                ["articles"] = value => value * 3m, // Estimate 3 pages per article
                ["books"] = value => value * 250m // Estimate 250 pages per book
            }),
            ["volume"] = ("liters", new Dictionary<string, Func<decimal, decimal>>
            {
                ["liters"] = value => value,
                ["cups"] = value => value * 0.236588m, // US cup
                ["glasses"] = value => value * 0.25m, // Typical glass
                ["ounces"] = value => value * 0.0295735m // US fluid ounce
            }),
            ["weight"] = ("kg", new Dictionary<string, Func<decimal, decimal>>
            {
                ["kg"] = value => value,
                ["lbs"] = value => value * 0.453592m,
                ["grams"] = value => value / 1000m,
                ["tons"] = value => value * 1000m
            }),
            ["binary"] = ("completed", new Dictionary<string, Func<decimal, decimal>>
            {
                ["completed"] = value => value // 1 or 0
            }),
            ["percentage"] = ("percent", new Dictionary<string, Func<decimal, decimal>>
            {
                ["percent"] = value => value,
                ["points"] = value => value, // Assuming points are already percentage-like
                ["score"] = value => value // Assuming score is already percentage-like
            }),
            ["currency"] = ("dollars", new Dictionary<string, Func<decimal, decimal>>
            {
                ["dollars"] = value => value,
                ["cents"] = value => value / 100m,
                // Note: For real currency conversion, you'd need exchange rates from an API
                ["euros"] = value => value, // Placeholder
                ["pounds"] = value => value // Placeholder
            })
        };

        /// <summary>
        /// Convert a value from any unit to the base unit for a metric type
        /// This enables consistent aggregation in analytics
        /// </summary>
        public static decimal ConvertToBaseUnit(string metricType, decimal value, string fromUnit)
        {
            if (!MetricTypeConfig.TryGetValue(metricType.ToLowerInvariant(), out var config))
            {
                // If metric type is not recognized, return the value as-is
                return value;
            }

            if (!config.Conversions.TryGetValue(fromUnit.ToLowerInvariant(), out var converter))
            {
                // If unit is not recognized for this metric type, return the value as-is
                return value;
            }

            return converter(value);
        }

        /// <summary>
        /// Get the base unit for a metric type
        /// Useful for displaying aggregated values in analytics
        /// </summary>
        public static string GetBaseUnit(string metricType)
        {
            if (!MetricTypeConfig.TryGetValue(metricType.ToLowerInvariant(), out var config))
            {
                return "units"; // Default fallback
            }

            return config.BaseUnit;
        }

        /// <summary>
        /// Validate if a unit is valid for a metric type
        /// </summary>
        public static bool IsValidUnit(string metricType, string unit)
        {
            if (!MetricTypeConfig.TryGetValue(metricType.ToLowerInvariant(), out var config))
            {
                return false;
            }

            return config.Conversions.ContainsKey(unit.ToLowerInvariant());
        }

        /// <summary>
        /// Get all available units for a metric type
        /// </summary>
        public static IEnumerable<string> GetAvailableUnits(string metricType)
        {
            if (!MetricTypeConfig.TryGetValue(metricType.ToLowerInvariant(), out var config))
            {
                return new[] { "units" }; // Default fallback
            }

            return config.Conversions.Keys;
        }

        /// <summary>
        /// Standardize a collection of habit log values for analytics aggregation
        /// All values will be converted to their respective base units
        /// </summary>
        public static IEnumerable<(int HabitId, string MetricType, string Unit, decimal StandardizedValue)>
            StandardizeHabitLogValues(IEnumerable<(int HabitId, string MetricType, string Unit, decimal Value)> logs)
        {
            foreach (var log in logs)
            {
                var standardizedValue = ConvertToBaseUnit(log.MetricType, log.Value, log.Unit);
                var baseUnit = GetBaseUnit(log.MetricType);

                yield return (log.HabitId, log.MetricType, baseUnit, standardizedValue);
            }
        }

        /// <summary>
        /// Format a value with its unit for display
        /// </summary>
        public static string FormatValueWithUnit(decimal value, string unit)
        {
            var formattedValue = value % 1 == 0 ? value.ToString("F0") : value.ToString("F2");
            return $"{formattedValue} {unit}";
        }
    }
}