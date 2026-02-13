# Problem Signal Finder - Project Overview

## What This Project Is

Problem Signal Finder is an AI-powered research dashboard that helps entrepreneurs and product builders discover validated business problems and market opportunities. It scans multiple online platforms (Reddit, IndieHackers, Product Hunt, review sites, forums) to find real user complaints and pain points, then uses AI to analyze and rank them by business potential.

## Core Functionality

### 1. Intelligent Problem Discovery
- Users enter a topic/industry they want to explore
- AI generates a comprehensive research plan (subreddits, search terms, competitor tools)
- System simulates web scraping across multiple platforms to find user complaints
- Focuses on phrases like "I hate", "why is there no", "frustrated with"

### 2. AI-Powered Analysis
- Uses Google Gemini AI (gemini-3-flash-preview) for fast processing
- Clusters raw complaints into 5-10 distinct business problems
- Scores each problem on 5 dimensions:
  - **Frequency** (how often mentioned)
  - **Pain Intensity** (how frustrated users are)
  - **Monetization** (willingness to pay)
  - **Solvability** (technical feasibility)
  - **Competitive Gap** (market opportunity)
- Calculates overall Signal Score: `(Freq×0.25) + (Pain×0.25) + (Money×0.3) + (Solvability×0.1) + (Gap×0.1)`

### 3. Rich Problem Cards
Each discovered problem includes:
- Problem statement
- Signal score and dimension breakdown
- Direct quotes from users with source links
- Existing competitor solutions with ratings
- Suggested next steps
- Metadata (mention count, sources, date)

### 4. User Management & Credits
- Supabase authentication (email/password)
- Credit-based system: each search costs 1 credit
- User profiles track credits and pro status
- Search history saved to database

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Lucide React** for icons
- Tailwind-style utility classes (custom glass morphism design)

### Backend Services
- **Supabase** - Authentication, database (profiles, searches tables)
- **Google Gemini AI** - Research planning and problem analysis
- **Firecrawl API** - Web scraping (mentioned but not yet implemented in code)

### Key Dependencies
```json
{
  "@google/genai": "^1.41.0",
  "@supabase/supabase-js": "^2.45.4",
  "react": "^19.2.4",
  "lucide-react": "^0.563.0"
}
```

## Project Structure

```
├── App.tsx                      # Main application component
├── components/
│   ├── Auth.tsx                 # Authentication UI
│   ├── Layout.tsx               # App layout with header/nav
│   ├── ProblemCard.tsx          # Individual problem display
│   ├── ProgressIndicator.tsx    # Research progress UI
│   └── SearchInput.tsx          # Topic search input
├── services/
│   ├── geminiService.ts         # Gemini AI integration
│   └── researchEngine.ts        # Main research orchestration
├── lib/
│   └── supabase.ts              # Supabase client config
├── types.ts                     # TypeScript interfaces
└── index.tsx                    # App entry point
```

## Key Features

### Current Features
✅ User authentication with Supabase
✅ Credit-based research system
✅ AI-powered research planning
✅ Multi-platform problem discovery
✅ Intelligent problem clustering and scoring
✅ Rich problem cards with evidence and competitors
✅ Search history tracking
✅ Responsive design with glass morphism UI

### Planned Features (UI exists but not implemented)
- Export to CSV
- Save to Workspace
- Auto-monitoring alerts
- Pro subscription upgrade

## Database Schema (Supabase)

### profiles table
- `id` (uuid, primary key)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- `credits` (integer)
- `is_pro` (boolean)

### searches table
- `user_id` (uuid, foreign key to profiles)
- `topic` (text)
- `results` (jsonb - array of Problem objects)
- `created_at` (timestamp)

## Environment Variables

Required in `.env.local`:
- `API_KEY` - Google Gemini API key

Hardcoded (should be moved to env):
- Supabase URL: `https://nbluagwqvjtvustolkse.supabase.co`
- Supabase Anon Key: (in lib/supabase.ts)

## User Flow

1. User lands on app → Supabase auth check
2. If not authenticated → Show Auth component
3. If authenticated → Show search interface with credit count
4. User enters topic → Validates credits available
5. Research engine runs:
   - Planning phase (generates research plan)
   - Searching phase (simulates web scraping)
   - Analyzing phase (clusters problems)
6. Results displayed as ranked problem cards
7. Credit deducted, search saved to database
8. User can export, save, or start new search

## Design System

- **Background**: Dark (#0d0d0d)
- **Accent**: Green (#10b981) for primary actions
- **Glass morphism**: Frosted glass effects with backdrop blur
- **Typography**: Bold, modern sans-serif
- **Animations**: Fade-in transitions, smooth hovers

## API Integration Points

### Google Gemini AI
- `generateResearchPlan()` - Creates targeted research strategy
- `analyzeAndCluster()` - Processes raw data into ranked problems
- Uses structured JSON output with schema validation

### Supabase
- Authentication (email/password)
- Profile management
- Credit tracking and deduction
- Search history storage

### Firecrawl (Mentioned but not implemented)
- Intended for actual web scraping
- Currently using simulated data via Gemini

## Known Limitations

1. Web scraping is simulated (not real Firecrawl integration yet)
2. Credit system works but no payment integration
3. Export CSV button is non-functional
4. Save to Workspace button is non-functional
5. Auto-monitoring feature not implemented
6. No pro upgrade flow
7. Supabase credentials hardcoded (security risk)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
```

## Future Enhancement Opportunities

1. **Real Web Scraping**: Integrate actual Firecrawl API
2. **Payment Integration**: Add Stripe/Razorpay for credits
3. **Export Functionality**: Implement CSV/PDF export
4. **Workspace Feature**: Add project management capabilities
5. **Real-time Monitoring**: Set up alerts for new complaints
6. **Advanced Filters**: Filter by platform, date, score ranges
7. **Collaboration**: Share research with team members
8. **API Access**: Provide API for programmatic access

---

*Last Updated: February 2026*
*Version: 0.0.0*
