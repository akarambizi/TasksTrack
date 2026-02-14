namespace TasksTrack.Models
{
    public enum FocusSessionStatus
    {
        Active = 0,
        Paused = 1,
        Completed = 2,
        Interrupted = 3
    }

    public static class FocusSessionStatusExtensions
    {
        public static string ToStringValue(this FocusSessionStatus status)
        {
            return status switch
            {
                FocusSessionStatus.Active => "active",
                FocusSessionStatus.Paused => "paused",
                FocusSessionStatus.Completed => "completed",
                FocusSessionStatus.Interrupted => "interrupted",
                _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
            };
        }

        public static FocusSessionStatus FromStringValue(string status)
        {
            return status?.ToLowerInvariant() switch
            {
                "active" => FocusSessionStatus.Active,
                "paused" => FocusSessionStatus.Paused,
                "completed" => FocusSessionStatus.Completed,
                "interrupted" => FocusSessionStatus.Interrupted,
                _ => throw new ArgumentException($"Invalid status value: {status}", nameof(status))
            };
        }
    }
}