import { createBrowserRouter, Link, NavLink, Outlet, RouterProvider } from 'react-router-dom';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { HomePage } from './pages/HomePage';
import { ErrorPage } from './pages/ErrorPage';

function Layout() {
  return (
    <>
      <a className="skip-link" href="#sisu">Liigu sisu juurde</a>
      <header className="site-header">
        <Link to="/" className="brand">Informaatika PS</Link>
        <nav aria-label="Peamenüü">
          <ul>
            <li><NavLink to="/" end>Avaleht</NavLink></li>
            <li><NavLink to="/blogi">Blogi</NavLink></li>
          </ul>
        </nav>
      </header>
      <main id="sisu">
        <Outlet />
      </main>
      <footer className="site-footer">© 2026 Informaatika PS</footer>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    // Kogu lehe veavaade on mõeldud ainult tõsistele vigadele – 3D-dekoratsiooni
    // tõrked püütakse Decor3D enda veapiiris kinni ega jõua kunagi siia.
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/blogi', element: <BlogIndexPage /> },
      { path: '/blogi/:slug', element: <BlogPostPage /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
