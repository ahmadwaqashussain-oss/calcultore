# React Calculator App

A fully functional calculator built with React.js featuring a modern, beautiful UI.

## Features

### Calculator Functions
- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Clear (C) and Clear Entry (CE) functions
- Backspace to delete last digit
- Decimal point support
- Toggle positive/negative numbers

### History Panel
- View all your calculations in real-time
- Calculation history with timestamps
- Clear history option
- Scrollable history list

### Cloud Storage ☁️ (NEW!)
- **Auto-sync to cloud**: Every calculation is automatically saved
- **Shareable links**: Share your calculator history with anyone
- **Cross-device access**: Access your history from any device
- **Real-time sync**: Changes sync instantly across all devices
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup instructions

### UI/UX
- Responsive design (works on desktop, tablet, and mobile)
- Modern dark theme with gradient background
- Smooth animations and hover effects
- Clean, intuitive interface

## Prerequisites

Before running this project, you need to have Node.js and npm installed on your system.

### Install Node.js and npm:

**Windows:**
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Restart your terminal/command prompt

**Verify installation:**
```bash
node --version
npm --version
```

## Installation

1. Navigate to the project directory:
```bash
cd calculator-app
```

2. Install dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm start
```

The application will automatically open in your default browser at [http://localhost:3000](http://localhost:3000)

## How to Use

- Click number buttons (0-9) to input numbers
- Click operation buttons (+, −, ×, ÷) to perform calculations
- Click "=" to get the result
- Click "C" to clear all
- Click "CE" to clear current entry
- Click "⌫" to delete the last digit
- Click "±" to toggle between positive and negative
- Click "." to add a decimal point

## Project Structure

```
calculator-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── Calculator.js
│   ├── Calculator.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- React 18.2.0
- React DOM 18.2.0
- CSS3 for styling
- React Hooks (useState)

## Building for Production

To create a production build:
```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## License

This project is open source and available for educational purposes.
