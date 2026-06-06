# College Task Dashboard

A modern course and subject management system built with Next.js and Firebase. Track your coursework across multiple courses, manage subject tasks (video, reading, quiz), and monitor progress with visual indicators.

## Features

- **Course Management**: Create and organize multiple courses (e.g., Fall 2026, Spring 2027)
- **Subject Tracking**: Add subjects to courses with three task types per subject:
  - Video
  - Reading
  - Quiz
- **Progress Tracking**: Visual progress bars for individual subjects and overall course completion
- **Released Status**: Mark subjects as "released" to prioritize them in the display order
- **Real-time Sync**: Built with Firebase Firestore for real-time data synchronization
- **Responsive Design**: Clean, modern UI built with Tailwind CSS that works on all devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: Firebase Firestore
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js >= 20.0.0
- npm, yarn, pnpm, or bun
- A Firebase project with Firestore enabled

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd study
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database in your Firebase project
   - Create a web app in your Firebase project settings
   - Copy your Firebase configuration

4. **Set up environment variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Firebase credentials in `.env.local`:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Adding a Course
1. Enter a course name (e.g., "Fall 2026") in the input field
2. Click "Add Course"
3. The course will appear as a tab at the top

### Adding Subjects
1. Select a course from the dropdown
2. Enter subject names (separated by commas or newlines)
3. Click "Add Subject"
4. Subjects will be created with default tasks (video, reading, quiz)

### Managing Tasks
- Click on any task checkbox to mark it as complete/incomplete
- Progress bars update automatically as you complete tasks
- Fully completed subjects get a green highlight

### Released Status
- Click the "Released/Unreleased" button on a subject card to toggle its status
- Released subjects appear before unreleased ones
- Within each group, subjects are sorted by completion count

### Resetting Tasks
- Click "Reset All Tasks" in the header to mark all tasks as incomplete

## Project Structure

```
study/
├── app/
│   ├── components/
│   │   └── subject-card.tsx    # Individual subject display component
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── firestore.ts        # Firestore operations
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main application page
│   └── types.ts                # TypeScript type definitions
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Firestore Security Rules

Make sure your Firestore security rules allow read/write access for authenticated users or appropriate rules for your use case. For development, you may use test mode, but for production, implement proper authentication and authorization.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy

### Other Platforms
This Next.js app can be deployed to any platform that supports Node.js, such as:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## License

This project is private and proprietary.
