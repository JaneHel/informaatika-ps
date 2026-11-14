import { Link } from 'react-router-dom';
import { Decor3D } from '../components/decor';
import { posts } from '../posts';

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Tere tulemast informaatika õpikeskkonda</h1>
          <p>Siit leiad selgitusi algoritmide, programmeerimise ja veebitehnoloogiate kohta.</p>
          <p><Link className="button" to="/blogi">Loe blogi</Link></p>
        </div>
        <Decor3D className="hero-decor" />
      </section>
      <section aria-labelledby="viimased">
        <h2 id="viimased">Viimased postitused</h2>
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to={`/blogi/${p.slug}`}>{p.title}</Link>
              <p>{p.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
