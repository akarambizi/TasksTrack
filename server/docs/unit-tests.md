# Tests Overview

## Tests.csproj

### PackageReference

[Tests.csproj](../Tests/Tests.csproj)

The `PackageReference` elements define the NuGet packages that the project depends on.

- `coverlet.msbuild` is a cross platform code coverage library for .NET.
  It's used to collect code coverage data when the tests are run.
- `Microsoft.NET.Test.Sdk` is the Test SDK that provides the `dotnet test` command. It's required for running tests.
- `Moq` is a popular mocking framework for .NET. It's used to create mock objects in unit tests.
- `xunit` is a unit testing tool for the .NET Framework. It's used to write and run tests.
- `xunit.runner.visualstudio` allows running xUnit.net tests in Visual Studio and on Azure DevOps.
- `coverlet.collector` is used to collect code coverage data and is part of the Coverlet code coverage tool.

### ProjectReference

The `ProjectReference` element defines a dependency on another project. In this case, it's the `server.csproj` project.
This means that the test project has access to the classes and methods defined in the `server.csproj` project,
and can use them in tests.

## Commands

[Tests Commands Makefile](../Makefile)

- `test`: This command runs the `dotnet test` command, which executes the unit tests in the project.

- `test-coverage`: This command runs the `dotnet test` command with additional parameters to collect code coverage data.
  The `/p:CollectCoverage=true` parameter enables code coverage collection, the `/p:CoverletOutputFormat=lcov` parameter
  sets the output format to lcov, and the `/p:CoverletOutput=./coverage/lcov.info` parameter specifies the output file
  for the coverage data.

- `test-coverage-summary`: This command depends on the `test-coverage` target, meaning it will run `test-coverage` first.
  After that, it runs the `lcov-summary` command on the coverage data file, which generates a summary of the code coverage data.

- `test-coverage-report`: This command also depends on the `test-coverage` target. After running `test-coverage`,
  it runs the `reportgenerator` command, which generates a detailed HTML report of the code coverage data.
  The `-reports:./Tests/coverage/lcov.info` parameter specifies the input file for the report,
  the `-targetdir:./Tests/coverage/report` parameter specifies the output directory for the report,
  and the `-reporttypes:Html` parameter sets the report type to HTML.

## Vscode Settings

These settings are for the [.NET Test Explorer extension](
https://marketplace.visualstudio.com/items?itemName=formulahendry.dotnet-test-explorer) in Visual Studio Code,
which provides a UI for running and debugging .NET tests.

[Vscode Settings file](../../.vscode/settings.json)

- `"dotnet-test-explorer.autoExpandTree": true`: This setting controls whether the test explorer tree view
  should automatically expand all nodes when tests are discovered.

- `"dotnet-test-explorer.autoWatch": true`: This setting controls whether the test explorer should automatically
  re-run tests when changes are detected in the project.

- `"dotnet-test-explorer.treeMode": "full"`: This setting controls how the test explorer tree view is organized.
  The "full" mode shows a hierarchical view of namespaces, classes, and methods.

- `"dotnet-test-explorer.testArguments": "/p:CollectCoverage=true /p:CoverletOutputFormat=lcov /p:CoverletOutput=./coverage/lcov.info"`:
  This setting specifies additional arguments to pass to the `dotnet test` command. In this case, it enables code coverage
  collection and specifies the output format and file for the coverage data.

- `"dotnet-test-explorer.testProjectPath": "**/server.csproj"`: This setting specifies the path to the test project.
  The `**/server.csproj` pattern will match any `server.csproj` file in any directory or subdirectory.
