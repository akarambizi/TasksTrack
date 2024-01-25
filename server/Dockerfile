# Use the official Microsoft .NET 7.0 SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build the app
COPY . ./
RUN dotnet publish -c Release -o /app

# Use the official Microsoft .NET 7.0 runtime image as the final base image
FROM mcr.microsoft.com/dotnet/runtime:7.0

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app .

# Set the command that will be run when the container starts
ENTRYPOINT ["dotnet", "server.dll"]