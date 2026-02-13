<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Problem Signal Finder 🎯

**🚀 Live Demo**: [https://snowman-5qu3.vercel.app](https://snowman-5qu3.vercel.app)

An AI-powered research dashboard that helps entrepreneurs and product builders discover validated business problems and market opportunities. Scans Reddit, IndieHackers, Product Hunt, and other platforms to find real user complaints and pain points, then uses AI to analyze and rank them by business potential.

## ✨ Features

- 🔍 **Intelligent Problem Discovery** - AI-generated research plans across multiple platforms
- 🤖 **AI-Powered Analysis** - Google Gemini AI clusters and scores problems on 5 dimensions
- 💳 **Pro Subscription** - One-time ₹99 payment for unlimited searches via Razorpay
- 📊 **Rich Problem Cards** - Direct quotes, competitor analysis, and actionable insights
- 🔐 **Secure Authentication** - Supabase auth with user profiles and credit tracking
- 🎨 **Modern UI** - Glass morphism design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- Razorpay account (for payments)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GREGORY070707/SNOWMAN.git
   cd SNOWMAN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini API Key
   API_KEY=your_gemini_api_key_here
   
   # Razorpay Keys (Test Mode)
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL migration in your Supabase SQL Editor:
   ```sql
   -- See supabase/migrations/001_initial_schema.sql
   ```

5. **Deploy Supabase Edge Functions** (for payment processing)
   ```bash
   supabase functions deploy razorpay-webhook
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
├── components/
│   ├── Auth.tsx                 # Authentication UI
│   ├── Layout.tsx               # App layout with sidebar
│   ├── ProblemCard.tsx          # Problem display cards
│   ├── ProgressIndicator.tsx    # Research progress UI
│   ├── SearchInput.tsx          # Topic search input
│   ├── UpgradeButton.tsx        # Pro upgrade button
│   └── VerifyPayment.tsx        # Payment verification
├── services/
│   ├── geminiService.ts         # Gemini AI integration
│   └── researchEngine.ts        # Research orchestration
├── lib/
│   └── supabase.ts              # Supabase client
├── supabase/
│   └── functions/               # Edge Functions
│       └── razorpay-webhook/    # Payment webhook handler
├── types.ts                     # TypeScript interfaces
├── App.tsx                      # Main app component
└── index.tsx                    # App entry point
```

## 🔧 Configuration

### Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard → Settings → API Keys
3. Create a Payment Link for ₹99
4. Configure webhook URL in Dashboard → Settings → Webhooks
5. Add webhook URL: `https://your-project.supabase.co/functions/v1/razorpay-webhook`

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run database migrations (see `supabase/migrations/`)
3. Deploy Edge Functions for payment processing
4. Set secrets for Razorpay keys:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=your_key
   supabase secrets set RAZORPAY_KEY_SECRET=your_secret
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

## 💳 Payment Flow

1. User clicks "Unlock Pro for ₹99"
2. Redirects to Razorpay payment link
3. User completes payment
4. Razorpay webhook notifies Supabase Edge Function
5. Function verifies payment and updates user profile
6. User clicks "Verify Payment" to refresh status
7. Pro badge appears, unlimited searches enabled

## 🧪 Testing

Use Razorpay test mode credentials:
- Test Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## 📦 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `API_KEY` (Gemini)
- `VITE_RAZORPAY_KEY_ID` (use live key)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Note**: `RAZORPAY_KEY_SECRET` should only be in Supabase Edge Function secrets, never in frontend env vars.

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Complete project overview and context
- [PAYMENT_INTEGRATION_COMPLETE.md](./PAYMENT_INTEGRATION_COMPLETE.md) - Payment integration guide
- [RAZORPAY_INTEGRATION_GUIDE.md](./RAZORPAY_INTEGRATION_GUIDE.md) - Detailed Razorpay setup

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind-style utilities, Glass morphism
- **AI**: Google Gemini AI (gemini-3-flash-preview)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Payments**: Razorpay
- **Icons**: Lucide React

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [documentation](./CLAUDE.md)
- Review [payment integration guide](./PAYMENT_INTEGRATION_COMPLETE.md)
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Real web scraping with Firecrawl API
- [ ] Export to CSV functionality
- [ ] Workspace management
- [ ] Real-time monitoring alerts
- [ ] Advanced filtering options
- [ ] Team collaboration features
- [ ] API access for programmatic use

---

Built with ❤️ for entrepreneurs finding their next big opportunity
