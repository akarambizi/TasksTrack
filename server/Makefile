build:
	dotnet build

run:
	dotnet run

clean:
	dotnet clean

restore:
	dotnet restore

publish:
	dotnet publish -c Release

test:
	dotnet test

test-coverage:
	dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov /p:CoverletOutput=./coverage/lcov.info

test-coverage-summary: test-coverage
	lcov-summary ./Tests/coverage/lcov.info

test-coverage-report: test-coverage
	reportgenerator "-reports:./Tests/coverage/lcov.info" "-targetdir:./Tests/coverage/report" -reporttypes:Html