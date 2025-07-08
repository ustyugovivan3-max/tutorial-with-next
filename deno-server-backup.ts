// Deno HTTP Server for Dinosaur API

// Import data
import data from "./src/app/api/data.json" with { type: "json" };

const PORT = 8000;

// Route handlers
const routes = {
    // Main API route
    "/api": () => new Response(JSON.stringify("welcome to the dinosaur API"), {
        headers: { "content-type": "application/json" },
    }),

    // All dinosaurs route
    "/api/dinosaurs": () => new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
    }),

    // Specific dinosaur route (dynamic)
    "/api/dinosaurs/": (pathname: string) => {
        const dinosaurName = pathname.split("/api/dinosaurs/")[1];

        if (!dinosaurName) {
            return new Response(JSON.stringify("No dinosaur name provided."), {
                headers: { "content-type": "application/json" },
            });
        }

        const dinosaurData = data.find((item) =>
            item.name.toLowerCase() === dinosaurName.toLowerCase()
        );

        return new Response(
            JSON.stringify(dinosaurData ? dinosaurData : "No dinosaur found."),
            {
                headers: { "content-type": "application/json" },
            }
        );
    },
};

// Request handler
function handler(req: Request): Response {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle OPTIONS requests for CORS
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // API routes
    if (pathname === "/api") {
        const response = routes["/api"]();
        return new Response(response.body, {
            headers: { ...corsHeaders, "content-type": "application/json" },
        });
    }

    if (pathname === "/api/dinosaurs") {
        const response = routes["/api/dinosaurs"]();
        return new Response(response.body, {
            headers: { ...corsHeaders, "content-type": "application/json" },
        });
    }

    if (pathname.startsWith("/api/dinosaurs/")) {
        const response = routes["/api/dinosaurs/"](pathname);
        return new Response(response.body, {
            headers: { ...corsHeaders, "content-type": "application/json" },
        });
    }

    // Serve static files from public directory (simplified)
    if (pathname.startsWith("/public/") || pathname.startsWith("/static/")) {
        return new Response("Static file serving not implemented", { status: 404 });
    }

    // Serve a simple homepage
    if (pathname === "/" || pathname === "/index.html") {
        return new Response(getHomePage(), {
            headers: { "content-type": "text/html" },
        });
    }

    // 404 for other routes
    return new Response("Not Found", { status: 404 });
}

// Simple homepage
function getHomePage(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dinosaur API - Deno Version</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .api-endpoint {
            background: #ecf0f1;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        .api-endpoint h3 {
            margin: 0 0 10px 0;
            color: #2980b9;
        }
        .api-endpoint code {
            background: #34495e;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            display: inline-block;
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #7f8c8d;
        }
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 10px;
        }
        button:hover {
            background: #2980b9;
        }
        .result {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🦕 Dinosaur API</h1>
        <p>Welcome to the Dinosaur API running on Deno! This API provides information about various dinosaur species.</p>
        
        <div class="api-endpoint">
            <h3>GET /api</h3>
            <p>Welcome message</p>
            <code>GET http://localhost:${PORT}/api</code>
            <button onclick="testApi('/api')">Test</button>
            <div id="result-api" class="result" style="display:none;"></div>
        </div>

        <div class="api-endpoint">
            <h3>GET /api/dinosaurs</h3>
            <p>Get all dinosaurs</p>
            <code>GET http://localhost:${PORT}/api/dinosaurs</code>
            <button onclick="testApi('/api/dinosaurs')">Test</button>
            <div id="result-dinosaurs" class="result" style="display:none;"></div>
        </div>

        <div class="api-endpoint">
            <h3>GET /api/dinosaurs/{name}</h3>
            <p>Get specific dinosaur by name</p>
            <code>GET http://localhost:${PORT}/api/dinosaurs/tyrannosaurus</code>
            <button onclick="testApi('/api/dinosaurs/tyrannosaurus')">Test</button>
            <div id="result-specific" class="result" style="display:none;"></div>
        </div>

        <div class="footer">
            <p>Powered by Deno 🦕 | Running on port ${PORT}</p>
        </div>
    </div>

    <script>
        async function testApi(endpoint) {
            const resultId = 'result-' + endpoint.split('/').filter(p => p).join('-');
            const resultDiv = document.getElementById(resultId);
            
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                resultDiv.style.display = 'block';
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
                resultDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>
  `;
}

console.log(`🦕 Dinosaur API server starting on http://localhost:${PORT}`);
console.log("Available endpoints:");
console.log("  GET  /api");
console.log("  GET  /api/dinosaurs");
console.log("  GET  /api/dinosaurs/{name}");

Deno.serve({ port: PORT }, handler);
