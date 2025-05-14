# Rankd

**Rankd** is a ranking and recommendation mobile app that allows users to rank items in various categories—including albums, movies, TV shows, video games, and restaurants—using a pairwise comparison algorithm similar to dating apps. The app uses API integrations to provide personalized recommendations based on user preferences and trends.

---

## Team Members

- **Samarth Sreenivas** – Software Engineer  
- **Leon Chien** – Software Engineer  
- **Neel Nigam** – Software Engineer  
- **Jaidev Shankar** – Software Engineer  

---

## Components

### 1. Frontend (React Native App)
- **Functionality:**  
  - Provides the user interface for ranking items, viewing recommendations, and browsing rankings.  
  - Handles user interactions and state management.  
- **Programming Language:** Swift  
- **Major Libraries/Frameworks:**  
  - SwiftUI  
- **Testing Methodology:**  
  - Swift Testing for SwiftUI components  
- **Interactions:**  
  - Communicates with the backend API to fetch and submit ranking data.

### 2. Backend (FastAPI Server)
- **Functionality:**  
  - Processes ranking data, stores user preferences, and serves recommendations.  
  - Implements the pairwise comparison algorithm and recommendation logic.  
- **Programming Language:** Python (FastAPI)  
- **Major Libraries:**  
  - FastAPI  
  - Pydantic (data validation)  
- **Testing Methodology:**  
  - Pytest for unit and integration tests  
  - Postman for manual API testing  
- **Interactions:**  
  - Serves JSON data to the frontend  
  - Interfaces with the database for storage and retrieval

### 3. Database (Supabase – PostgreSQL Cloud Storage)
- **Functionality:**  
  - Stores user profiles, rankings, categories, and API-fetched item data.  
- **Programming Language:** SQL (PostgreSQL)  
- **Major Libraries/Tools:**  
  - Supabase Python client  
- **Testing Methodology:**  
  - Schema validation  
  - Query benchmarking  
- **Interactions:**  
  - Backend connects to Supabase for all CRUD operations

### 4. External APIs (Spotify, Yelp, IMDB, etc.)
- **Functionality:**  
  - Fetches metadata and content for ranking categories (e.g., album details, restaurant info, movie metadata).  
- **Programming Language:** N/A (RESTful API calls)  
- **Major Libraries/Tools:**  
  - Frontend: fetch/axios/Next.js API routes  
  - Backend: `requests` library  
- **Testing Methodology:**  
  - Mock API responses in Postman  
- **Interactions:**  
  - Backend services call external APIs, process responses, and store relevant data in the database

---

## Getting Started

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/your-org/rankd.git
   cd rankd


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
