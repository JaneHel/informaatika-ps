import { Link } from 'react-router-dom';
import { posts } from '../posts';

export function BlogIndexPage() {
  return (
    <>
      <h1>Blogi</h1>
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={`/blogi/${p.slug}`}>{p.title}</Link>
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
