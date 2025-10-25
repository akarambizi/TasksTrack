build:
	dotnet build

run:
	dotnet run

watch:
	dotnet watch run

clean:
	dotnet clean

restore:
	dotnet restore

publish:
	dotnet publish -c Release

test:
	dotnet test

test-coverage:
	dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov /p:CoverletOutput=./coverage/lcov.info \
		'/p:Include="[*]*Controllers*,[*]*Services*"'

test-coverage-summary: test-coverage
	lcov-summary ./Tests/coverage/lcov.info

test-coverage-report: test-coverage
	reportgenerator "-reports:./Tests/coverage/lcov.info" "-targetdir:./Tests/coverage/report" -reporttypes:Html
	@echo "Coverage report generated at: ./Tests/coverage/report/index.html"
	@echo "Focus: Controllers and Services only"

update-table:
	dotnet ef migrations add UpdateTableMigration
	dotnet ef database update