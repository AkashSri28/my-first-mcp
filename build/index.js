import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "My First MCP Server",
    description: "A simple MCP server implemented in TypeScript",
    version: "1.0.0",
});
server.tool("get_github_repo", "Get Github Repositories from given username", {
    username: z.string().describe("The username of the Github user"),
}, async ({ username }) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            "User-Agent": "MCP-Server",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    const data = await response.json();
    return {
        content: [{
                type: "text",
                text: `The repositories for ${username} are ${data.map((repo) => repo.name).join(", ")}.`
            }]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Error starting MCP server:", error);
    process.exit(1);
});
