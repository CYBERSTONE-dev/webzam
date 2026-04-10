# Dr. Cheapcart 🛒

A modern, high-performance e-commerce platform built with React, Firebase, and Tailwind CSS.

## Features

- 🛍️ Product catalog with categories and search
- 🛒 Shopping cart with real-time updates
- 🔐 Firebase authentication (Google Sign-in)
- 📦 Order management and tracking
- 📱 Responsive design for all devices
- 🔒 Secure Firestore database with role-based access
- 📊 Admin dashboard with analytics
- 🎨 Modern UI with smooth animations

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/drfile.git
cd drfile

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Google Sign-in
3. Create Firestore database
4. Copy your Firebase config to `src/firebase.ts`

### Build for Production

```bash
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── admin/        # Admin dashboard components
├── context/          # React context providers
├── pages/            # Page components
├── firebase.ts       # Firebase configuration
└── App.tsx           # Main application
```

## Security

- Firestore security rules protect data
- Admin access restricted to `wealthwizard1k@gmail.com`, `abdulhadimonu@gmail.com`
- Authentication required for checkout
- HTTPS enforced

## Performance

| Category | Score |
|----------|-------|
| Performance | 76 |
| Accessibility | 88 |
| Best Practices | 100 |
| SEO | 100 |

## License

MIT License - feel free to use for your own projects!

## Author

Built with ❤️ for affordable shopping
