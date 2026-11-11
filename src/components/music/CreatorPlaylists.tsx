'use client';

import { useState } from 'react';
import { ArrowUpRight, Heart } from 'react-bootstrap-icons';
import type { Playlist } from '@/lib/mockups/playlists';
import AlbumArt from './AlbumArt';
import PlaylistDialog from './PlaylistDialog';

export default function CreatorPlaylists({ collection }: { collection: Playlist[] }) {
  const [selected, setSelected] = useState<Playlist | null>(null);

  return (
    <>
      <div className="playlist-grid">
        {collection.map((playlist) => (
          <article className="playlist-card" key={playlist.id}>
            <button className="cover-button" aria-label={`View ${playlist.title}`} onClick={() => setSelected(playlist)}>
              <AlbumArt playlist={playlist} />
              <span className="cover-open"><ArrowUpRight /></span>
            </button>
            <div className="playlist-card-body">
              <div className="card-category-row">
                <span className="category-pill">{playlist.category}</span>
                <span className="card-likes"><Heart aria-label="likes" /> {playlist.likes}</span>
              </div>
              <h3><button onClick={() => setSelected(playlist)}>{playlist.title}</button></h3>
              <p>{playlist.songCount} songs · {playlist.duration}</p>
            </div>
          </article>
        ))}
      </div>
      <PlaylistDialog playlist={selected} onClose={() => setSelected(null)} />
    </>
  );
}
