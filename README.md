# 💎 GG Mindset Vault

A premium, gamified crypto money-mindset guide and personal progress tracker for crypto grinders and airdrop hunters.

## Features

### 📚 7 Main Chapters
1. **Before Anything Else → BOOK PROFIT** - The golden rule of crypto
2. **Where to Store Your Crypto** - The 40/15/25/20 rule
3. **Money / Risk / Time Management** - Master your resources
4. **Invest Wisely + The 80/20 Formula** - Smart allocation
5. **Buy Your Dream Things** - Balance and rewards
6. **Business & Future Plan** - Build for long term
7. **Backup Plan + Good Habits** - Prepare and sustain

### 🎮 Gamification
- XP points for every action
- Streak counter for daily visits
- Ranks: Newbie → Paper Hands → Hodler → Diamond Hands → Profit Booker → Whale → GG Legend
- Confetti celebrations on achievements
- Progress tracking for each chapter

### 🛠️ Built-in Tools
- **Profit Booking Calculator** - Calculate the 80% first sell + 50/50/50 strategy
- **Portfolio Allocation Tracker** - Track your 40/15/25/20 distribution
- **Bank Backup Tracker** - Monitor your emergency fund
- **Habit Tracker** - 7 daily habits from the guide
- **Monthly Income Tracker** - Track your crypto earnings
- **Profit Booking History** - Record all your secured gains

### 📊 Dashboard Features
- Big circular progress ring
- Current rank and XP
- Streak counter with fire emoji
- Portfolio pie chart
- Quick access to all tools

### 🎯 Additional Features
- **Financial Goals** - Set and track custom goals
- **Dream List** - Things you want to buy with profits
- **Journal** - Document your thoughts and lessons
- **Reminders** - Browser notifications for daily habits

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS 4**
- **Framer Motion** for animations
- **Recharts** for charts
- **Canvas Confetti** for celebrations
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to project
cd gg-mindset-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Project Structure

```
gg-mindset-vault/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProgressRing.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   └── guideData.js
│   ├── hooks/
│   │   └── useConfetti.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Chapters.jsx
│   │   ├── Tools.jsx
│   │   ├── Goals.jsx
│   │   ├── Dreams.jsx
│   │   ├── Journal.jsx
│   │   └── Reminders.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Usage

1. **Start your journey** - Open the app and explore the dashboard
2. **Go through chapters** - Mark sections as "Understood" and "Implemented"
3. **Use the tools** - Calculate profits, track portfolio, log habits
4. **Set goals** - Create financial targets to work towards
5. **Build your dream list** - Add things you want to fund with profits
6. **Journal your progress** - Document lessons and wins
7. **Stay consistent** - Build your streak by visiting daily

---

**Remember: The difference between you and them? You actually implement.**

*GG Mindset Vault - Book profits. Build wealth. Live legend.*
