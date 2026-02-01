using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDateTimeToDateTimeOffset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration is intentionally empty.
            // The conversion from DateTime to DateTimeOffset was handled at the model level
            // and PostgreSQL timestamp columns are compatible with both types.
            // EF Core migrations detected the change but no actual database schema changes were needed.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No database changes to revert
        }
    }
}
