using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert default categories
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Name", "Description", "Color", "Icon", "IsActive", "CreatedDate", "CreatedBy" },
                values: new object[,]
                {
                    { "Health", "Physical and mental well-being activities", "#22c55e", "Heart", true, DateTimeOffset.UtcNow, "system" },
                    { "Learning", "Educational and skill development activities", "#3b82f6", "BookOpen", true, DateTimeOffset.UtcNow, "system" },
                    { "Creative", "Artistic and creative pursuits", "#a855f7", "Palette", true, DateTimeOffset.UtcNow, "system" },
                    { "Social", "Social interactions and relationships", "#f59e0b", "Users", true, DateTimeOffset.UtcNow, "system" },
                    { "Work", "Professional and career-related activities", "#6b7280", "Briefcase", true, DateTimeOffset.UtcNow, "system" },
                    { "Personal", "Personal development and self-care", "#ec4899", "User", true, DateTimeOffset.UtcNow, "system" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove default categories
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Name",
                keyValues: new object[] { "Health", "Learning", "Creative", "Social", "Work", "Personal" });
        }
    }
}
