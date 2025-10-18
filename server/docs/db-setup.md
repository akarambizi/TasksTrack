# Setting up PostgreSQL Database with Entity Framework Core

## Prerequisites

- .NET Core SDK installed on your machine
- PostgreSQL server running

## Steps

### 1. Install Entity Framework Core tools globally

```bash
dotnet tool update --global dotnet-ef --version 7.0.3
```

This command updates the dotnet-ef tool globally to version 7.0.3, allowing you to use Entity Framework Core commands from the command line.

### 2. Add the Microsoft.EntityFrameworkCore.Design package

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design --version 7.0.3
```

This command adds the necessary design-time components to the project, allowing you to use Entity Framework Core commands like migrations.

### 3.Create the initial migration

```bash
 dotnet ef migrations add InitialCreate
```

This command creates an initial migration named `InitialCreate`. Migrations are a way to incrementally update the database schema based on changes to your data model.

### 4.Apply the initial migration to the database

```bash
dotnet ef database update
```

This command applies the initial migration to the database, ensuring that the database schema is in sync with the data model.

## Additional Commands

**Create a new migration after making changes to your data model:**

```bash
dotnet ef migrations add NewMigrationName
```

Replace `NewMigrationName` with a descriptive name for the migration.

**Apply the new migration to the database:**

```bash
dotnet ef database update
```

This command applies the pending migration to the database, updating the database schema to reflect the changes made to your data model.

**Remove the last migration:**

```bash
dotnet ef migrations remove
```

This command removes the last migration and updates the ModelSnapshot file to reflect the removal.


## TODO: Add User Secrets

User secrets are a secure way to store sensitive data during development. They are stored outside of the project tree, so there's less risk of accidentally committing them into source control.

First, you need to initialize user secrets for the project. In your terminal, navigate to the project directory and run:

```bash
dotnet user-secrets init
```

Then,set user secrets like this:

```bash
dotnet user-secrets set "Database:UserId" "your_username"
dotnet user-secrets set "Database:Password" "your_password"
```

In appsettings.json, you can then reference these user secrets:

```bash
"DefaultConnection": "Server=localhost;Database=taskstrackedb;User Id={UserId};Password={Password};MultipleActiveResult"
```

This command will list all the user secrets for the project in the terminal. The keys and values of the secrets will be displayed.

```bash
dotnet user-secrets list
```

## Helpful links

[Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
