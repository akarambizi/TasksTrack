using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TasksTrack.Data;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<TasksTrackContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// DependencyInjectionSetup: Add services to the container.
builder.Services.AddApplicationServices(builder);

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey( // Secret key for validation
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ??
                    throw new InvalidOperationException("JWT Secret not configured"))),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.FromMinutes(5) // 5-minute tolerance for token renewal with refresh tokens
        };
    });

// Add Authorization services - enables [Authorize] attributes on controllers
builder.Services.AddAuthorization();

builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
                builder.WithOrigins("http://localhost:3000", "http://localhost:3001")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Production error handling
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.MapHealthChecks("/health");

app.UseHttpsRedirection();

app.UseCors();

// JWT middleware - order matters: Authentication before Authorization
app.UseAuthentication(); // Validates JWT tokens
app.UseAuthorization();  // Checks [Authorize] attributes

app.MapControllers();

app.Run();