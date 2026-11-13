'use client';

import { Modal } from 'react-bootstrap';
import { Heart, MusicNoteBeamed } from 'react-bootstrap-icons';
import type { Playlist } from '@/lib/mockups/playlists';
import AlbumArt from './AlbumArt';

export default function PlaylistDialog({ playlist, onClose }: { playlist: Playlist | null; onClose: () => void }) {
  return (
    <Modal show={!!playlist} onHide={onClose} centered size="lg" contentClassName="music-modal">
      {playlist && <>
        <Modal.Header closeButton><Modal.Title>Playlist preview</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="playlist-dialog-heading"><AlbumArt playlist={playlist} /><div><span className="category-pill">{playlist.category}</span><h2>{playlist.title}</h2><p>Curated by {playlist.creator} <span className="muted">@{playlist.username}</span></p><p className="muted">{playlist.description}</p><span className="playlist-meta"><MusicNoteBeamed /> {playlist.songCount} songs · {playlist.duration} <Heart /> {playlist.likes}</span></div></div>
          <h3 className="song-preview-label">A few tracks from this mix</h3>
          <ol className="track-list">{playlist.songs.map((song) => <li key={song.title}><div><strong>{song.title}</strong><span>{song.artist}</span></div><span>{song.duration}</span></li>)}</ol>
          <p className="demo-note">Sample playlist for the M1 mockup. Music playback is not connected.</p>
        </Modal.Body>
      </>}
    </Modal>
  );
}
