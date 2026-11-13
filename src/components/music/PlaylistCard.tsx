'use client';

import { ArrowUpRight, BookmarkCheckFill, Heart, Pencil, Share } from 'react-bootstrap-icons';
import type { Playlist } from '@/lib/mockups/playlists';
import AlbumArt from './AlbumArt';

type Props = { playlist: Playlist; saved?: boolean; onView: () => void; onEdit?: () => void; onShare: () => void; onUnsave?: () => void };
export default function PlaylistCard({ playlist, saved, onView, onEdit, onShare, onUnsave }: Props) {
  return (
    <article className="playlist-card">
      <button className="cover-button" onClick={onView} aria-label={`View ${playlist.title}`}><AlbumArt playlist={playlist} /><span className="cover-open"><ArrowUpRight /></span></button>
      <div className="playlist-card-body"><div className="card-category-row"><span className="category-pill">{playlist.category}</span><span className="card-likes"><Heart aria-label="likes" /> {playlist.likes}</span></div>
        <h3><button onClick={onView}>{playlist.title}</button></h3>
        <p>{saved ? `by ${playlist.creator} · ` : ''}{playlist.songCount} songs <span>·</span> {playlist.duration}</p>
        <div className="card-actions"><button onClick={onView}>View <ArrowUpRight /></button>{saved ? <button onClick={onUnsave} aria-label={`Remove ${playlist.title} from saved playlists`}><BookmarkCheckFill /> Saved</button> : <button onClick={onEdit}><Pencil /> Edit</button>}<button onClick={onShare}><Share /> Share</button></div>
      </div>
    </article>
  );
}
