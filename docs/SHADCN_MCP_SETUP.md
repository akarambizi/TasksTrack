# Shadcn/ui MCP Server Setup

This project includes a Model Context Protocol (MCP) server for shadcn/ui components
to help with following best practices and getting component information.

## What is the MCP Server?

The shadcn/ui MCP server provides AI assistants with access to:
- Component source code and examples
- Component documentation and usage patterns
- Best practices for shadcn/ui components
- Component metadata and configuration

## Setup

The MCP server has been configured for this workspace:

### Configuration Files
- **`.vscode/mcp.json`** - MCP server configuration
- **`.vscode/settings.json`** - VS Code workspace settings including MCP configuration
- **`package.json`** - Includes the `@jpisnice/shadcn-ui-mcp-server` dependency

### Running the Server

You can start the MCP server manually using:
```bash
npm run mcp:shadcn
```

Or directly with:
```bash
npx @jpisnice/shadcn-ui-mcp-server
```

## VS Code Integration

The MCP server is configured to work with VS Code extensions that support MCP, such as:
- GitHub Copilot (when MCP support is available)
- Claude for VS Code
- Other AI assistants with MCP integration

## Framework Configuration

The server is configured for React (matching our project setup):
- **Framework**: React
- **File extension**: `.tsx`
- **Components**: shadcn/ui v4 components

## Environment Variables

You can customize the behavior with environment variables:
- `FRAMEWORK=react|svelte|vue|react-native` - Framework selection
- `GITHUB_TOKEN` - For higher API rate limits (optional)

## Benefits

With the MCP server active, AI assistants can:
1. **Suggest best practices** for shadcn/ui component usage
2. **Provide accurate component examples** from the official documentation
3. **Help with component composition** following shadcn/ui patterns
4. **Offer component-specific guidance** for forms, dialogs, and other UI elements
5. **Ensure consistency** with shadcn/ui design system

## Usage in Development

When working with shadcn/ui components, AI assistants with MCP access can help:
- Choose the right component for your use case
- Follow proper component composition patterns
- Implement accessibility best practices
- Use proper TypeScript types for component props
- Apply consistent styling and theming

## Troubleshooting

If the MCP server isn't working:
1. Ensure the package is installed: `npm list @jpisnice/shadcn-ui-mcp-server`
2. Check VS Code settings include the MCP configuration
3. Restart VS Code to reload MCP servers
4. Check the VS Code output panel for MCP-related logs

## Repository

The MCP server source: <https://github.com/Jpisnice/shadcn-ui-mcp-server>