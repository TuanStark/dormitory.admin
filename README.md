# Dormitory Management Dashboard

A comprehensive web application for managing dormitory operations, including buildings, rooms, bookings, reports, and user management.

## Features

- **Dashboard Overview**: View key metrics and recent bookings
- **Building Management**: Create, edit, and manage dormitory buildings
- **Room Management**: Track room status, occupancy, and details
- **Booking System**: Process and manage student room bookings
- **User Management**: Admin tools for managing student and staff accounts
- **Maintenance Reports**: Track and manage maintenance requests and issues
- **Reviews System**: Capture and respond to student feedback
- **Settings**: Configure system preferences and user profiles

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **UI Components**: Custom component library (Button, Card, Badge, etc.)
- **Icons**: Font Awesome
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dormitory-dashboard.git
   cd dormitory-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
src/
  ├── components/           # Reusable components
  │   ├── auth/             # Authentication related components
  │   ├── layout/           # Layout components
  │   ├── ui/               # UI components (Button, Card, etc.)
  │   ├── dashboard/        # Dashboard specific components
  │   ├── buildings/        # Building management components
  │   └── ...               # Other component categories
  ├── pages/                # Page components
  ├── context/              # React context providers
  ├── utils/                # Utility functions
  ├── hooks/                # Custom React hooks
  ├── data/                 # Mock data for development
  ├── App.jsx               # Main application component
  └── index.js              # Application entry point
```

## Authentication

The application uses a protected route system to ensure that only authenticated users can access the dashboard. During development, the system uses mock authentication. In production, it would connect to a backend API.

## Customization

### Theming

The dashboard uses Tailwind CSS for styling. You can customize the theme by modifying the `tailwind.config.js` file. The primary and secondary colors are already configured, but you can adjust them to match your brand.

## Deployment

1. Build the production-ready code:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the contents of the `build` folder to your preferred hosting provider.

## License

[MIT](LICENSE)

## Acknowledgments

- This project was created as part of a school project for dormitory management systems.
- Icons provided by [Font Awesome](https://fontawesome.com/)
