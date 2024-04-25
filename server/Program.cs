var builder = WebApplication.CreateBuilder(args);

// DependencyInjectionSetup: Add services to the container.
builder.Services.AddApplicationServices(builder);

builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
        builder.WithOrigins("http://localhost:3001") // Replace with your client's origin
               .AllowAnyHeader()
               .AllowAnyMethod());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(); // Use CORS middleware

app.UseAuthorization();

app.MapControllers();

app.Run();