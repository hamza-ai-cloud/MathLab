# MathLab - AI-Powered Math Solver

A professional SaaS platform for solving complex math problems with step-by-step AI guidance using Next.js, Supabase, and Google Gemini API.

## 🎯 Features

- **AI-Powered Solving**: Leverage Google Gemini for intelligent math problem solving
- **OCR Support**: Upload handwritten math problems for automatic recognition
- **Step-by-Step Solutions**: Clear breakdown of each solution step
- **User Authentication**: Secure Supabase authentication
- **Subscription Management**: Freemium model with multiple tiers
- **Responsive Design**: Modern UI with Tailwind CSS
- **Modular Architecture**: Clean separation of concerns for scalability

## 📁 Project Structure

```
mathlab/
├── app/                      # Next.js App Router
│   ├── (home)/              # Landing page routes
│   ├── dashboard/           # User dashboard
│   ├── solver/              # Math solver interface
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── math/                # Math-specific components
│   ├── layout/              # Layout components
│   └── shared/              # Shared utilities
├── lib/
│   ├── services/            # Business logic services
│   └── supabase/            # Supabase configuration
├── hooks/                   # Custom React hooks
├── services/                # External service integrations
├── types/                   # TypeScript interfaces
├── utils/                   # Helper functions
├── config/                  # Configuration constants
├── styles/                  # Global styles
└── middleware/              # Express-like middleware
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mathlab.git
   cd mathlab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase and Google API keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Add your URL and anonymous key to `.env.local`
3. Create required tables:
   - `users`
   - `problems`
   - `subscriptions`

### Google Gemini API
1. Get your API key from Google AI Studio
2. Add to `.env.local` as `GOOGLE_API_KEY`

## 📚 API Routes

### Math Solver
- `POST /api/gemini/solve` - Solve a math problem
- `POST /api/gemini/ocr` - Extract text from image

### Subscription
- `GET /api/subscription/check` - Check user subscription status

## 🎨 UI Components

### Core Components
- `Button` - Customizable button with variants
- `Card` - Container component
- `Input` - Form input with validation
- `Badge` - Status/label badges

### Math Components
- `MathCanvas` - Problem input interface
- `SolutionBoard` - Display solutions
- `StepCard` - Individual solution steps

## 🔐 Authentication

Uses Supabase Auth for secure user management. Includes:
- Email/password signup
- Session management
- OAuth integration ready

## 💳 Subscription Tiers

- **Free**: 10 problems/day
- **Pro**: 100 problems/day + PDF export
- **Premium**: Unlimited + Priority support

## 🌍 Internationalization (i18n)

Prepared for multiple languages. Update `config/constants.ts` to add new languages.

## 🚢 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Docker
Dockerfile template available in deployment docs.

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

Pull requests welcome! Please follow the code style and structure.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for students and educators**
