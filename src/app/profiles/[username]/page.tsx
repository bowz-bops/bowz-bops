import Link from 'next/link';
import { notFound } from 'next/navigation';
import CreatorPlaylists from '@/components/music/CreatorPlaylists';
import { playlists } from '@/lib/mockups/playlists';
import '@/components/music/music.css';

export default async function CreatorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const collection = playlists.filter((playlist) => playlist.username === username);
  const owner = collection[0];
  if (!owner) notFound();

  return (
    <main className="music-page">
      <div className="music-container">
        <Link className="text-music-link mb-3" href="/leaderboard">← Back to Leaderboard</Link>
        <header className="profile-banner">
          <div className="profile-main">
            <div className="creator-avatar" aria-hidden="true">{owner.creator[0]}</div>
            <div className="profile-copy">
              <h1>{owner.creator}</h1>
              <p className="profile-handle">@{owner.username}</p>
            </div>
          </div>
        </header>
        <section className="playlist-section" aria-labelledby="creator-playlists-heading">
          <div className="section-heading">
            <h2 id="creator-playlists-heading">Playlists by {owner.creator} <span className="count-badge">{collection.length}</span></h2>
          </div>
          <CreatorPlaylists collection={collection} />
          <p className="demo-note">Sample playlists for the M1 preview.</p>
        </section>
      </div>
    </main>
  );
}
