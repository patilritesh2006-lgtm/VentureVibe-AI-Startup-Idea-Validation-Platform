# VentureVibe API Specification

## Auth
- `POST /auth/register` - Register a new user (email, password, name)
- `POST /auth/login` - Login user (email, password)
- `GET /auth/me` - Get current user profile

## Startup Analysis
- `POST /api/sessions` - Create a new startup analysis session
  - Request: `ideaTitle`, `ideaDescription`, `industry`, `targetMarket`
  - Response: Full analysis object
- `GET /api/sessions` - List user's sessions
- `GET /api/sessions/:id` - Get a specific session analysis
- `GET /api/leaderboard` - Get the global leaderboard of startup ideas
