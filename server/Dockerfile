FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o out
EXPOSE 5206
CMD ["dotnet", "out/server.dll"]