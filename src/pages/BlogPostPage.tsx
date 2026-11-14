import { Link, useParams } from 'react-router-dom';
import { Decor3D } from '../components/decor';
import { posts } from '../posts';

export function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <h1>Postitust ei leitud</h1>
        <p><Link to="/blogi">Tagasi blogi juurde</Link></p>
      </>
    );
  }

  return (
    <article className="post">
      <header className="post-header">
        <div>
          <h1>{post.title}</h1>
          <p className="post-date"><time dateTime={post.date}>{post.date}</time></p>
        </div>
        {/* Blogis on dekoratsioon teisejärguline – tõrke korral jääb see lihtsalt peitu. */}
        <Decor3D className="post-decor" fallback="hidden" />
      </header>
      {post.body.map((para, i) => <p key={i}>{para}</p>)}
      <p><Link to="/blogi">← Kõik postitused</Link></p>
    </article>
  );
}
