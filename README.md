
# Wechi Gebi Frontend (ወጪ ገቢ)

React + Vite Progressive Web App (PWA) for personal finance tracking in Ethiopian Birr (ETB)**.

# Features Implemented
- Secure login/register
- Dashboard with income, expenses, balance
- Add/edit/delete transactions
- Set monthly budgets per category
- Recurring expense management
- One-click Excel export
- PWA: Installable, works offline
- Fully responsive (Bootstrap)

# Tech Stack
- **Framework**: React + Vite
- **Styling**: Bootstrap 5
- **Routing**: React Router DOM
- **HTTP**: Axios
- **PWA**: vite-plugin-pwa
- **Date Handling**: date-fns

# Setup
1. `npm install`
2. Ensure backend is running at `http://localhost:5000`
3. `npm run dev`
4. Visit `http://localhost:5173`

# Pages
- `/login`, `/register`
- `/dashboard` – Financial summary
- `/transactions` – Income/expense list
- `/budgets` – Budget management
- `/recurring` – Recurring rules

# Deployment
- Frontend: Vercel (`https://wechi-gebi-frontend.vercel.app`)
- Backend: Render (`https://wechi-gebi-backend.onrender.com`)



- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
