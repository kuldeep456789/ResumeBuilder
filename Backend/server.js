const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeResumeWithAI, getAvailableProviders } = require('./services/llmService');
const authRoutes = require('./routes/authRoutes');
const { ensureAuthSchema, isDatabaseConfigured } = require('./services/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const localDevOrigins = [
    'http://localhost:8000',
    'http://localhost:5173',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:5173'
];

const envOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || '').split(',')
]
    .map((origin) => (origin || '').trim())
    .filter(Boolean);

const configuredOrigins = [...new Set([...localDevOrigins, ...envOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = origin.trim();
        const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin);

        if (
            configuredOrigins.includes('*') ||
            configuredOrigins.includes(normalizedOrigin) ||
            isLocalhostOrigin ||
            process.env.NODE_ENV !== 'production'
        ) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${normalizedOrigin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Set Permissions Policy for Geolocation
app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "geolocation=*");
    next();
});
// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        providers: getAvailableProviders(),
        auth: {
            databaseConfigured: isDatabaseConfigured,
            googleConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
            githubConfigured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
            jwtConfigured: Boolean(process.env.JWT_SECRET)
        }
    });
});

// Auth endpoints
app.use('/api/auth', authRoutes);

// AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { resumeText, jobDescription, provider, location } = req.body;

        if (!resumeText) {
            return res.status(400).json({ error: "Resume text is required" });
        }

        const result = await analyzeResumeWithAI(resumeText, jobDescription, provider, location);
        res.json(result);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({
            error: "AI Analysis failed",
            details: error.message
        });
    }
});

const HOST = '0.0.0.0';

// When running locally start an HTTP server; in serverless (Vercel) we just export the Express handler.
if (require.main === module) {
    const startServer = async () => {
        if (isDatabaseConfigured) {
            try {
                await ensureAuthSchema();
                console.log('Auth database schema is ready');
            } catch (error) {
                console.error('Auth schema initialization failed:', error.message);
            }
        } else {
            console.warn('DATABASE_URL is not set. Auth endpoints will not work until configured.');
        }

        app.listen(PORT, HOST, () => {
            console.log(`Server running on http://${HOST}:${PORT}`);
            console.log(`Available Providers:`, getAvailableProviders());
        });
    };

    startServer();
}

// Handle unhandled rejections and exceptions to prevent the server from exiting silently
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

module.exports = app;
