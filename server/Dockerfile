FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app

# Copy project files
COPY *.csproj ./
RUN dotnet restore

# Install EF Core tools for migrations
RUN dotnet tool install --global dotnet-ef --version 8.0.*
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy source code
COPY . .
RUN dotnet build -c Release -o out

EXPOSE 5206
CMD ["dotnet", "out/server.dll"]