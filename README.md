# HouseHunt

HouseHunt is a modern real estate web application that allows users to seamlessly search for, list, and manage properties. Designed with a sleek, user-friendly interface, it caters to buyers, tenants, owners, and agents alike.

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks & Context API

### Backend
- **Server:** Node.js with [Express.js](https://expressjs.com/)
- **Database:** PostgreSQL (using `pg` driver)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod

## Project Structure

The repository is divided into two main workspaces:
- `frontend/`: The Next.js client application.
- `backend/`: The Express REST API server.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) database server

### 1. Database Setup
Ensure you have PostgreSQL running. Create a database named `househunt` (or your preferred name).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment:
   - Copy the `.env.example` file in the root to `backend/.env`.
   - Update the `DATABASE_URL` with your PostgreSQL connection string.
4. Run migrations and seed the database (optional but recommended for testing):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Key Features
- **Advanced Search & Filtering:** Filter properties by type, budget, location, and amenities.
- **Authentication:** Secure JWT-based login and registration for different roles (Buyer, Agent, Builder).
- **Interactive UI:** Smooth transitions, responsive design, and intuitive property cards.
- **Property Inquiries:** Directly contact property owners/agents and schedule visits.
- **Save & Shortlist:** Save your favorite properties to view later.

## License
MIT License
