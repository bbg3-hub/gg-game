# Space Station Escape

A collaborative escape experience set on a space station where 1-4 players must solve individual puzzles to unlock the escape sequence.

## Features

- **Admin Dashboard**: Create and manage game sessions, monitor player progress in real-time
- **Private Player Screens**: Each player gets a unique URL with their own private puzzle flow
- **Sequential Puzzles**: Morse code → Greek meaning → Mini-game → Bonus questions
- **Real-time Progress**: Admin can see all players' progress, scores, and oxygen timer
- **Flexible Join**: Players can join at different times within the oxygen timer
- **Cryptic Interface**: Minimal, mystery-filled design with no spoilers

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

3. Set your admin password in `.env.local`:
```
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### For Admins

1. Go to `/admin` and log in with your password
2. Click "Create New Mission" to generate a game code
3. Share the 6-digit game code with players
4. Monitor progress on the dashboard
5. View final escape code when all players complete

### For Players

1. Go to the landing page and click "Join Mission"
2. Enter the game code and your name
3. Save your unique player URL (important!)
4. Solve puzzles sequentially:
   - Decode Morse transmission
   - Select correct Greek meaning
   - Play mini-game (click targets)
   - Answer bonus questions
5. Wait for final escape code from admin

### Game Flow

1. **Morse Code**: Listen to audio, decode the word (e.g., "HELP")
2. **Greek Meaning**: Select the correct meaning for a Greek word
3. **Mini-Game**: Click on targets to earn points in 30 seconds
4. **Bonus Questions**: Answer two space-related questions
5. **Complete**: Wait for team to finish and receive escape code

## Project Structure

```
app/
├── (public)/           # Public routes
│   ├── page.tsx        # Landing page
│   └── join/           # Join game form
├── admin/              # Admin routes
│   ├── page.tsx        # Admin login
│   └── dashboard/     # Admin dashboard
├── api/                # API routes
│   ├── admin/          # Admin endpoints
│   ├── game/           # Game endpoints
│   └── join-game/      # Join game endpoint
└── game/
    └── play/[playerToken]/  # Private player game
        └── page.tsx        # Player game interface

lib/
├── gameSession.ts      # Session management logic
└── adminAuth.ts        # Admin authentication
```

## Key Features

### Privacy
- Each player has a unique token in their URL
- Players cannot see other players' progress
- No player names shown on player screens
- Individual try limits and scores

### Security
- Game code required to join
- Admin password protected
- Sessions expire when game ends
- In-memory storage (no persistent data)

### Flexibility
- 1-4 players supported
- Players can join at different times
- Game starts when first player joins
- Admin can delete sessions

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Web Audio API** - Morse code playback

## Environment Variables

- `ADMIN_PASSWORD` - Password for admin dashboard (default: prometheus2024)
- `NEXT_PUBLIC_BASE_URL` - Base URL for generating player links

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

This project can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- Self-hosted with Node.js

## Notes

- Sessions are stored in memory and reset when the server restarts
- For production, consider using a database (Redis, PostgreSQL, etc.)
- The in-memory storage is suitable for development and testing
- Admin authentication is simple - consider NextAuth.js for production

## License

MIT
