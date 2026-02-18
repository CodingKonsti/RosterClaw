# Duty Roster Planning Application

A modern Angular application for managing employee duty rosters with shift scheduling capabilities.

## Features

- **Employee Management**: Add, edit, and delete employees with name, role, email, and phone
- **Shift Type Management**: Create and customize shift types with name, time range, and color coding
- **Roster View**: Visual calendar grid showing employees and their assigned shifts
- **Flexible Scheduling**: Easily assign shifts to employees by clicking on calendar cells
- **Multiple Views**: Switch between weekly and monthly roster views
- **Pre-populated Data**: Includes ~50 dummy employees and sample shift assignments

## Technology Stack

- **Angular 21** (Standalone Components)
- **Angular Material** for UI components
- **TypeScript**
- **SCSS** for styling
- **RxJS** for reactive state management

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employees/          # Employee management component
│   │   ├── employee-dialog/    # Employee add/edit dialog
│   │   ├── shift-types/        # Shift type management component
│   │   ├── shift-type-dialog/  # Shift type add/edit dialog
│   │   └── roster/             # Main roster calendar view
│   ├── models/
│   │   ├── employee.model.ts
│   │   ├── shift-type.model.ts
│   │   └── shift-assignment.model.ts
│   ├── services/
│   │   └── data.service.ts     # In-memory data service
│   ├── app.ts                  # Main app component with navigation
│   ├── app.routes.ts           # Route configuration
│   └── app.config.ts           # App configuration
└── styles.scss                 # Global styles and Material theme

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)

### Installation

1. Navigate to the project directory:
   ```bash
   cd /home/node/.openclaw/workspace/testClaw/roster-app
   ```

2. Install dependencies (including dev dependencies):
   ```bash
   npm install --include=dev
   ```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Build the project:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

### Employee Management
1. Click on "Employees" in the sidebar
2. Add new employees with the "Add Employee" button
3. Edit or delete existing employees using the action buttons

### Shift Type Management
1. Click on "Shift Types" in the sidebar
2. Create custom shift types with specific time ranges and colors
3. Pre-configured shift types: Early (6:00-14:00), Late (14:00-22:00), Night (22:00-06:00), Day (8:00-17:00)

### Roster Planning
1. Click on "Roster" in the sidebar
2. Switch between week/month view using the dropdown
3. Navigate periods with the arrow buttons or "Today" button
4. Click on any employee/day cell to assign a shift
5. Select a shift type from the context menu
6. Remove shifts by clicking the cell and selecting "Remove Shift"

## Data

The application uses an in-memory data service with:
- 50 pre-populated employees across various roles (Nurse, Doctor, Assistant, Technician, Administrator)
- 4 default shift types
- Sample shift assignments for the current week

All data is stored in browser memory and will reset on page reload.

## Future Enhancements

Potential features to add:
- Business rules (max hours per week, rest periods, etc.)
- Conflict detection (overlapping shifts)
- Export roster to PDF/Excel
- Persistent storage (backend API or local storage)
- Shift patterns and templates
- Employee availability tracking
- Statistics and reporting

## License

This is a demo application created for duty roster planning purposes.
