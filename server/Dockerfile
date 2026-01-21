FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

# Install EF Core tools for migrations
RUN dotnet tool install --global dotnet-ef --version 9.0.*
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy project files and restore
COPY *.csproj ./
RUN dotnet restore

# Copy source code
COPY . .

# Build for production (creates optimized build)
RUN dotnet build -c Release -o out

EXPOSE 5206

# Default command - production build
CMD ["dotnet", "out/server.dll"]

# Development override: if no out/server.dll exists (volume mounted), fall back to dotnet run
# This is handled by docker-compose command override for development