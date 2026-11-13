import type { Playlist } from '@/lib/mockups/playlists';

export default function AlbumArt({ playlist, small = false }: { playlist: Playlist; small?: boolean }) {
  return (
    <div className={`album-art art-${playlist.art}${small ? ' album-small' : ''}`} role="img" aria-label={`${playlist.title} illustrated playlist cover`}>
      <div className="art-grain" />
      <span className="art-label">BOWZ BOPS SELECTS</span>
      <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
      <div className="art-sun" /><div className="art-hill hill-one" /><div className="art-hill hill-two" />
      <div className="art-record"><span /></div>
      <span className="art-title">{playlist.title}</span>
      <span className="art-caption">{playlist.caption}</span>
      <span className="art-star" aria-hidden="true">✳</span>
    </div>
  );
}
