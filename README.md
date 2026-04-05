```markdown
# Zorvyn Finance Dashboard

This is my submission for the Zorvyn FinTech Frontend Developer Intern assignment.
My goal was to build a dashboard that doesn't just display numbers, but provides a
high-fidelity "Intelligence" layer that feels like a premium, professional product.

I focused heavily on the feel of the application—ensuring that transitions
are smooth, the data is legible, and the interface responds intuitively to the user's role.

---

## Getting Started

To get the dashboard running on your local machine, follow these steps:

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Enter the project directory
cd DashBoard

# 3. Install the dependencies (recharts, lucide-react, framer-motion, tailwindcss)
npm install

# 4. Fire up the development server
npm run dev
```

The app will be live at **http://localhost:5173**.

## Project Layout

Based on the requirements for a clean, evaluatable project, I structured the source code as follows:

```text
ZORVYN/
└── DashBoard/
    ├── src/
    │   ├── App.jsx          # Core Engine: State, Providers, and Components
    │   ├── App.css          # Thematic styling and animation keyframes
    │   ├── index.css        # Tailwind directives and base reset
    │   └── main.jsx         # React entry point
    ├── postcss.config.js    # PostCSS setup for Tailwind v4
    ├── tailwind.config.js   # Custom animations and grid extensions
    └── README.md
```

## Behind the Architecture

### The "Flat" Component Strategy
You will notice that the majority of the logic lives in `App.jsx`. I did this intentionally for this assignment. Instead of making the reviewer navigate through a complex folder tree for a small-scale project, I have organized the code into clear functional blocks within one file. It is modular and easy to audit, but respects your time by keeping the context localized.

### State Management & Reliability
I avoided heavy external state libraries to keep the bundle light. Instead, I used:
* **React Context + useReducer**: This provides a predictable state flow for transactions and filters without the extra boilerplate.
* **Persistence**: I integrated `localStorage` hooks so your theme (Light/Dark) and Role (Admin/Viewer) don't reset when you refresh the page.

## Key Features

### 1. Financial Intelligence (The "IQ" Tab)
I added a dedicated Intelligence section that uses **monotoneX interpolation** on area charts to show balance trends over 30 days. It also features a "Jewel Tone" donut chart that calculates spending percentages on the fly.

### 2. Role-Based Access Control (RBAC)
The "Toggle" in the header isn't just for show. 
* **Admin Mode**: Full permissions. You can add, delete, and export data.
* **Viewer Mode**: The UI automatically shifts. "Add" buttons are disabled with custom tooltips, and "Delete" actions are hidden to protect data integrity.

### 3. "Dark" Theming
I didn't want a generic black-and-white toggle. I built a custom **Dark** mode using a `#020617` base. It includes an animated SVG starfield and "nebula" gradients that only activate in dark mode to provide a sense of depth and luxury.

### 4. Search & Precision Filtering
The transaction ledger supports real-time fuzzy search and category filtering. I also used `tabular-nums` for all financial figures so the numbers stay perfectly aligned—essential for any banking interface.

## Technical Stack

* **React 18 & Vite**: For the fastest possible development experience.
* **Tailwind CSS**: For utility-first styling and responsive layouts.
* **Recharts**: For the spline-based data visualizations.
* **Lucide React**: For consistent, lightweight iconography.
* **Framer Motion**: For the "Ink Bleed" transitions and role-switch animations.

---

Live link : 
