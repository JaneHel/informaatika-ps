import { Link } from 'react-router-dom';

export function ErrorPage() {
  return (
    <main id="sisu" data-testid="page-error">
      <h1>Midagi läks valesti</h1>
      <p><Link to="/">Avalehele</Link></p>
    </main>
  );
}
