# Arithmancy - Mathematical Calculator

A clean, minimalist web application for solving mathematical problems with step-by-step explanations and visualizations.

## Features

### 🧮 Mathematical Functions
- **Quadratic Equations**: Solve with visual graphs, find roots, and calculate vertex points
- **Fibonacci Sequences**: Generate sequences with beautiful spiral visualizations
- **Factorial Calculations**: Calculate with detailed step-by-step breakdowns
- **Prime Number Generation**: Generate prime numbers and explore number theory

### 🎨 User Interface
- **Clean Minimalist Design**: No gradient backgrounds, distraction-free interface
- **Dynamic 3-Button System**: Shows only 3 function buttons at a time
- **Navigation Pages**: Overview, About Us, and Solve Now sections
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Features
- **Interactive Charts**: Zoom, pan, and explore mathematical functions
- **Real-time Updates**: See results and visualizations instantly
- **Step-by-step Explanations**: Understand the mathematical process
- **Modern Web Technologies**: Built with Go, Chart.js, and Tailwind CSS

## How to Use

1. **Navigate**: Use the navigation menu to explore different sections
2. **Select Function**: Choose from the available mathematical functions
3. **Enter Parameters**: Input your values in the calculator interface
4. **Solve**: Click "Solve" to get results with explanations
5. **Explore**: Use the "Back to Functions" button to try different calculations

## Dynamic 3-Button System

The calculator implements a smart button management system:
- Initially shows all 4 function buttons
- When you select a function, it disappears from the button list
- Only 3 buttons remain visible for easy selection
- Use "Back to Functions" to reset and see all options again

## Running the Application

```bash
cd arithmancy
go run .
```

Then open your browser to `http://localhost:8080`

## Technology Stack

- **Backend**: Go (Golang)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js with zoom/pan capabilities
- **Styling**: Tailwind CSS for clean, responsive design
- **Visualization**: Custom Canvas API for Fibonacci spirals

## Pages

### Overview
Learn about the application and its capabilities with detailed explanations of each mathematical function.

### About Us
Discover the mission and values behind Arithmancy, along with information about the technology stack.

### Solve Now
The main calculator interface where you can:
- Select mathematical functions
- Input parameters
- View results and visualizations
- Get step-by-step explanations

## Mathematical Functions

### Quadratic Equations
- Input coefficients a, b, c
- View interactive graph
- Find roots and vertex
- Get detailed step-by-step solution

### Fibonacci Sequences
- Input number of terms
- View beautiful spiral visualization
- See sequence generation process
- Interactive spiral with color coding

### Factorial Calculations
- Input positive integer
- See step-by-step multiplication
- Get final result with explanation

### Prime Number Generation
- Input count of primes needed
- Get list of prime numbers
- Understand prime number concepts 