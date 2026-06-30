# CA Shirish Vyas - Next.js Application

This is a Next.js conversion of the original React app for CA Shirish Vyas - CA Shirish Vyas | CA Shirish Vyas - CA CA Shirish Vyas.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd akgclass
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file (already provided) with the following variables:
```
NEXT_PUBLIC_BUTTER_CMS_API_KEY=your_buttercms_api_key
NEXT_PUBLIC_API_BASE_URL=https://prodapi.classiolabs.com
NEXT_PUBLIC_MEDIA_BASE_URL=https://classiocafinal.in-maa-1.linodeobjects.com
NEXT_PUBLIC_SITE_URL=https://ca-shiris-vyas.netlify.app/
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

Create an optimized production build:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
akgclass/
├── pages/              # Next.js pages (routes)
│   ├── _app.js        # App wrapper with providers
│   ├── _document.js   # HTML document structure
│   ├── index.js       # Home page
│   ├── cart.js        # Cart page
│   ├── store.js       # Store page
│   ├── blog/          # Blog pages
│   ├── book/          # Book detail pages
│   ├── course/        # Course detail pages
│   └── ...
├── components/        # Shared React components
│   ├── Layout.js      # Main layout wrapper
│   ├── Header/        # Header components
│   ├── Auth/          # Authentication modals
│   └── Shared/        # Shared UI components
├── page-components/   # Page-specific components
│   ├── Home/          # Home page sections
│   ├── Blog/          # Blog components
│   ├── Course/        # Course components
│   ├── Cart/          # Cart components
│   └── ...
├── config/            # Configuration files
│   ├── AuthContext.jsx      # Authentication context
│   ├── StudentContext.jsx   # Student data context
│   ├── endpoints.jsx        # API endpoints
│   ├── Network.jsx          # Network utilities
│   └── buttercms.js         # ButterCMS config
├── constants/         # Constants and icons
├── styles/            # Global styles
│   └── globals.css    # Global CSS with Tailwind
├── public/            # Static files
└── next.config.js     # Next.js configuration
```

## Key Differences from React App

1. **Routing**: Uses Next.js file-based routing instead of React Router
   - `/course/[courseId].js` instead of `<Route path="/course/:courseId">`
   - Dynamic routes use `router.query` instead of `useParams`
   
2. **Navigation**: Uses Next.js `useRouter()` instead of React Router's `useNavigate()`
   - `router.push('/path')` instead of `navigate('/path')`
   - `Link` component from `next/link` instead of `react-router-dom`

3. **State Management**: For navigation state (previously `location.state`)
   - Simple data uses query parameters
   - Complex data uses `sessionStorage` or `localStorage`

4. **Environment Variables**: 
   - All env vars must be prefixed with `NEXT_PUBLIC_` to be accessible in browser
   - Use `process.env.NEXT_PUBLIC_VAR_NAME` instead of `process.env.REACT_APP_VAR_NAME`

5. **Image Optimization**: Can use Next.js `Image` component for optimized images

6. **SEO**: Built-in `Head` component for meta tags in each page

## Features

- ✅ Course and Book listings
- ✅ Shopping cart functionality
- ✅ User authentication (Login/Signup)
- ✅ Blog with ButterCMS
- ✅ Free resources and MCQ tests
- ✅ Responsive design with Tailwind CSS
- ✅ Mobile-friendly navigation
- ✅ SEO optimized

## Technologies Used

- **Next.js 14** - React framework with SSR and routing
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **ButterCMS** - Headless CMS for blog
- **Lucide React** - Icon library

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Support

For support, contact the development team.
