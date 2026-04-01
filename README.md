# 🏥 Smart Queue Alert — Hospital Management System

A modern, mobile-first **hospital queue management system** built with **React Native (Expo)**. It streamlines patient registration, token-based queuing, real-time notifications, and staff workflows — all from a single cross-platform app.

---

## ✨ Features

### 🧑‍⚕️ Patient Portal
- **OTP-based Phone Authentication** — Secure login via Supabase Auth + Twilio OTP
- **Patient Registration** — Capture name, age, gender, phone, and department selection
- **Token Generation** — Automatic queue tokens with QR codes for easy verification
- **Three Queue Lanes:**
  - 🟢 **General** — Standard walk-in appointments
  - 🔴 **Emergency** — Priority fast-track with instant alerts to staff
  - ♿ **Accessibility** — Dedicated lane for disabled / special-needs patients
- **Real-time Wait Estimates** — AI-optimized time predictions based on queue position, department load, and peak hours
- **Consultation Completed Screen** — Post-visit summary with visit details
- **Patient History** — View all past booked tokens sorted by priority and time

### 👨‍⚕️ Staff / Doctor Dashboard
- **Staff Login** — Secure staff ID + password authentication
- **Live Queue View** — Displays active patient (1) + upcoming patients (3) at a glance
- **QR Scanner** — Scan patient QR codes to auto-complete appointments
- **Mark Complete** — One-tap completion moves the queue forward automatically
- **Department Statistics** — Real-time analytics for token counts and wait times

### 🤖 AI & Smart Features
- **Agentic Chatbot** — AI-powered assistant for patient queries and navigation
- **AI Predictive Insights** — Queue forecasting and department load predictions
- **Smart Scheduling** — Optimal time-slot calculation accounting for peak hours and doctor availability

### 🌐 Multilingual Support
- Built-in Hindi and English translations
- Extensible translation system via `src/translations/`

### 🔔 Real-time Notifications
- Emergency alerts pushed to affected queue patients
- Delay warnings with estimated additional wait time
- Auto-clearing notification panel (30-second TTL)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native + Expo SDK 52 |
| **Language** | JavaScript (JSX) |
| **Auth & Backend** | Supabase (Auth, Database, RLS) |
| **OTP Provider** | Twilio (via Supabase Phone Auth) |
| **State Management** | React Context API + AsyncStorage |
| **QR Codes** | `react-native-qrcode-svg` |
| **Camera / Scanner** | `expo-camera` |
| **Animations** | `react-native-reanimated` |
| **Icons** | `@expo/vector-icons`, `lucide-react-native` |
| **Toasts** | `sonner-native` |
| **Navigation** | Custom view-based routing |

---

## 📁 Project Structure

```
Smart Queue Alert Hospital Management System/
├── App.jsx                    # Root entry (re-exports src/App.jsx)
├── app.json                   # Expo configuration
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (Supabase keys)
│
├── lib/
│   └── supabase.js            # Supabase client initialization
│
├── screens/                   # OTP auth flow screens
│   ├── HomeScreen.js
│   ├── PhoneLoginScreen.js
│   └── OtpScreen.js
│
├── src/
│   ├── App.jsx                # Main application with routing & state
│   ├── types.js               # Shared type definitions
│   │
│   ├── components/
│   │   ├── LoginPortal.jsx         # Landing page with patient/staff entry
│   │   ├── PatientPortal.jsx       # Patient service selection
│   │   ├── CommonUserFlow.jsx      # General appointment flow
│   │   ├── EmergencyUserFlow.jsx   # Emergency registration flow
│   │   ├── DisabledUserFlow.jsx    # Accessibility registration flow
│   │   ├── TokenDisplay.jsx        # Generated token + QR code display
│   │   ├── PatientDetails.jsx      # Detailed patient information
│   │   ├── PatientHistory.jsx      # All past visits & tokens
│   │   ├── ConsultationCompleted.jsx # Post-consultation summary
│   │   ├── QueueCard.jsx           # Queue position card
│   │   ├── HomeScreen.jsx          # Home component
│   │   ├── Settings.jsx            # App settings (theme, language)
│   │   ├── DepartmentStatistics.jsx # Department analytics
│   │   ├── OTPInput.jsx            # OTP input component
│   │   ├── AgenticChatbot.jsx      # AI-powered chatbot
│   │   ├── Chatbot.jsx             # Basic chatbot fallback
│   │   ├── AIAgent.jsx             # AI agent logic
│   │   ├── AIPredictiveInsights.jsx # Predictive analytics UI
│   │   ├── auth/
│   │   │   ├── AuthRouter.jsx      # Auth flow router
│   │   │   └── LoginPage.jsx       # Login page UI
│   │   ├── figma/                  # Design reference components
│   │   └── ui/                     # Reusable UI primitives
│   │
│   ├── screens/
│   │   ├── PatientRegistrationScreen.jsx
│   │   ├── OTPVerificationScreen.jsx
│   │   ├── StaffLoginScreen.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── MedicalServicesDashboard.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx          # Global app state & departments
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx         # Supabase auth context provider
│   │
│   ├── services/
│   │   └── supabaseClient.js       # Supabase service client
│   │
│   ├── supabase/
│   │   ├── schema.sql              # Database schema (patients, staff)
│   │   └── functions/              # Supabase Edge Functions
│   │
│   ├── hooks/
│   │   └── useTranslation.js       # i18n hook
│   │
│   ├── translations/
│   │   ├── translations.js         # All translation strings
│   │   └── languages.js            # Supported language definitions
│   │
│   ├── styles/
│   │   └── globals.css             # Global stylesheet
│   │
│   ├── theme/                      # Theme configuration
│   ├── guidelines/
│   │   └── Guidelines.md           # UI/UX design guidelines
│   └── utils/                      # Utility helpers
│
└── assets/
    ├── icon.png
    ├── adaptive-icon.png
    ├── splash-icon.png
    └── favicon.png
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **npm** or **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- **Supabase Account** — [supabase.com](https://supabase.com)
- **Expo Go** app on your phone (for testing)

### 1. Clone the Repository

```bash
git clone https://github.com/Sameer4821/Smart-Queue-Management.git
cd "Smart Queue Alert Hospital Management System"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up the Database

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Paste and run the contents of [`src/supabase/schema.sql`](src/supabase/schema.sql)

This creates the `patients` and `staff_accounts` tables with Row Level Security (RLS) policies.

### 5. Run the App

```bash
npx expo start
```

Then scan the QR code with **Expo Go** (Android) or the **Camera** app (iOS).

| Platform | Command |
|---|---|
| Android | `npm run android` |
| iOS | `npm run ios` |
| Web | `npm run web` |

---

## 🗄️ Database Schema

### `patients`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Matches Supabase Auth `auth.uid()` |
| `phone_number` | TEXT (UNIQUE) | Patient's phone number |
| `created_at` | TIMESTAMPTZ | Auto-generated creation time |

### `staff_accounts`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `staff_id` | TEXT (UNIQUE) | Staff login ID |
| `password_hash` | TEXT | Hashed password |
| `role` | TEXT | `'staff'` or `'admin'` |
| `created_at` | TIMESTAMPTZ | Auto-generated creation time |

Both tables have **Row Level Security** enabled — users can only access their own records.

---

## 📱 App Screens & Flow

```mermaid
flowchart TD
    A[Login Portal] --> B{User Type}
    B -->|Patient| C[Phone OTP Login]
    B -->|Staff / Doctor| D[Staff ID Login]
    
    C --> E[Patient Registration]
    E --> F[Medical Services Dashboard]
    
    F --> G[General Queue]
    F --> H[Emergency Queue]
    F --> I[Accessibility Queue]
    
    G --> J[Token Generated + QR Code]
    H --> J
    I --> J
    
    J --> K[Wait in Queue]
    K --> L[Consultation Completed]
    
    D --> M[Staff Dashboard]
    M --> N[View Active Patient]
    M --> O[Scan QR / Verify Token]
    M --> P[Mark Complete → Next Patient]
```

---

## ⚙️ Configuration

### Expo (`app.json`)

- **App Name**: Smart Queue Management
- **Orientation**: Portrait only
- **New Architecture**: Enabled
- **Platforms**: iOS, Android, Web

### Supabase Auth

Phone OTP authentication is configured through Supabase with Twilio as the SMS provider. Ensure your Supabase project has:
1. **Phone Auth** enabled under Authentication → Providers
2. **Twilio** credentials configured (Account SID, Auth Token, Messaging Service SID)

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for smarter hospital queues
</p>