import { useEffect, useMemo, useState } from "react";
import { fetchCatalog } from "../api";

function MovieRow({ title, items }) {
  return (
    <section className="movie-row">
      <h3>{title}</h3>
      <div className="movie-grid">
        {items.map((movie) => (
          <article key={movie.imdbID} className="movie-card" title={movie.Title}>
            <img src={movie.Poster} alt={movie.Title} loading="lazy" />
            <div className="movie-meta">
              <strong>{movie.Title}</strong>
              <span>{movie.Year}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomePage({ token, user, onLogout }) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await fetchCatalog(token);
        if (mounted) {
          setCatalog(data.categories || []);
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      mounted = false;
    };
  }, [token]);

  const featured = useMemo(() => catalog[0]?.items?.[0], [catalog]);

  return (
    <div className="home-shell">
      <header className="home-nav">
        <h1>NETFLIX</h1>
        <div className="right-actions">
          <span>{user?.name || user?.email}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section
        className="hero"
        style={
          featured
            ? {
                backgroundImage: `linear-gradient(to top, #141414 20%, rgba(20,20,20,.25) 70%), url(${featured.Poster})`
              }
            : undefined
        }
      >
        <div className="hero-content">
          <h2>{featured?.Title || "Unlimited movies, TV shows and more."}</h2>
          <p>
            {featured
              ? `Watch ${featured.Title} (${featured.Year}) and discover more movie picks curated from OMDb.`
              : "Loading featured movie..."}
          </p>
          <div className="hero-buttons">
            <button className="play">Play</button>
            <button className="more">More Info</button>
          </div>
        </div>
      </section>

      <main className="rows-wrap">
        {loading && <p className="status">Loading catalog...</p>}
        {error && <p className="status error-text">{error}</p>}
        {!loading &&
          !error &&
          catalog.map((category) => (
            <MovieRow key={category.key} title={category.title} items={category.items} />
          ))}
      </main>
    </div>
  );
}

export default HomePage;
