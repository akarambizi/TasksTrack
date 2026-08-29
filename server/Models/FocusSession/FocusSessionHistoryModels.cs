using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class FocusSessionHistoryFilterRequest
    {
        [Required]
        public required string StartDate { get; set; }

        [Required]
        public required string EndDate { get; set; }

        [Required]
        public required string Timezone { get; set; }

        [Range(1, int.MaxValue)]
        public int? HabitId { get; set; }

        public string? Category { get; set; }
    }

    public class CalendarHistoryResponse
    {
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public required string Timezone { get; set; }
        public required IEnumerable<CalendarDaySummaryResponse> Days { get; set; }
    }

    public class CalendarDaySummaryResponse
    {
        public required string LocalDate { get; set; }
        public bool IsActive { get; set; }
        public int SessionCount { get; set; }
        public int TotalFocusMinutes { get; set; }
        public int CompletedSessionCount { get; set; }
        public required IEnumerable<int> HabitIds { get; set; }
        public required IEnumerable<string> Categories { get; set; }
    }

    public class TimelineHistoryResponse
    {
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public required string Timezone { get; set; }
        public required IEnumerable<TimelineDayGroupResponse> Groups { get; set; }
    }

    public class TimelineDayGroupResponse
    {
        public required string LocalDate { get; set; }
        public required string DisplayLabel { get; set; }
        public int TotalFocusMinutes { get; set; }
        public required IEnumerable<SessionTimelineItemResponse> Sessions { get; set; }
    }

    public class SessionTimelineItemResponse
    {
        public int SessionId { get; set; }
        public int HabitId { get; set; }
        public required string HabitName { get; set; }
        public string? Category { get; set; }
        public DateTimeOffset StartTimeUtc { get; set; }
        public DateTimeOffset? EndTimeUtc { get; set; }
        public DateTimeOffset StartTimeLocal { get; set; }
        public DateTimeOffset? EndTimeLocal { get; set; }
        public required string Status { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
    }

    public class FocusSessionDayDetailResponse
    {
        public required string LocalDate { get; set; }
        public required string Timezone { get; set; }
        public required CalendarDaySummaryResponse Summary { get; set; }
        public required IEnumerable<SessionTimelineItemResponse> Sessions { get; set; }
    }
}
