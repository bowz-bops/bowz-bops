'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheckFill, Heart, Headphones, Trophy } from 'react-bootstrap-icons';
import { categories, playlists, type Playlist } from '@/lib/mockups/playlists';
import AlbumArt from './AlbumArt';
import PlaylistDialog from './PlaylistDialog';

export default function Leaderboard() {
  const [category, setCategory] = useState('All playlists');
  const [view, setView] = useState<Playlist | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const ranked = playlists.filter((p) => category === 'All playlists' || p.category === category).sort((a, b) => (b.likes + Number(liked.includes(b.id))) - (a.likes + Number(liked.includes(a.id))));
  const top = ranked.slice(0, 3);
  return (
    <main className="music-page" id="leaderboard-page"><div className="music-container">
      <div className="page-intro"><div><p className="eyebrow">THE CAMPUS HAS GOOD TASTE</p><h1>On everyone’s <span>rotation</span><span className="title-dot">.</span></h1></div><span className="preview-badge"><span /> M1 mockup · sample rankings</span></div>
      <section className="leaderboard-hero" aria-labelledby="leaderboard-title"><div className="chart-hero-copy"><span className="chart-edition"><Trophy /> THE BOWZ BOPS LEADERBOARD</span><h2 id="leaderboard-title">Big love for<br />these little mixes<span>✳</span></h2><p>From library late nights to North Shore drives.<br />Discover the playlists our campus is loving.</p><div className="chart-hero-bottom"><span className="mini-avatars"><i>L</i><i>K</i><i>M</i></span><span>Curated by students. Loved by the community.</span></div></div><div className="hero-disc" aria-hidden="true"><div className="disc-label"><Headphones /><span>BOWZ BOPS</span><strong>GOOD<br />ON REPEAT.</strong><small>SIDE A · MĀNOA SELECTS</small></div></div><span className="hero-stamp" aria-hidden="true">ALL CAMPUS<br />ALL GOOD.</span></section>
      <section className="charts-section" aria-labelledby="chart-heading"><div className="section-heading"><div><p className="eyebrow">A LITTLE COMPETITION. A LOT OF GOOD MUSIC.</p><h2 id="chart-heading">Campus favorites <span className="count-badge">{ranked.length}</span></h2><p>Ranked by likes. Find a mix that feels like you.</p></div><Link className="text-music-link" href="/my-playlists">Your collection <ArrowRight /></Link></div>
        <div className="category-tabs" role="group" aria-label="Filter leaderboard by category">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className={category === c ? 'selected' : ''}>{c === 'All playlists' && <DiscIcon />}{c}</button>)}</div>
        <div className="chart-section-label"><span><span className="live-dot" /> TOP OF THE ROTATION</span><span>Fictional M1 sample · ranked by likes</span></div>
        <div className="podium-grid">{top.map((p, i) => <article key={p.id} className={`podium-card podium-${i + 1}`}><div className="podium-art"><button className="cover-button" aria-label={`View ${p.title}`} onClick={() => setView(p)}><AlbumArt playlist={p} /><span className="cover-open"><ArrowUpRight /></span></button><span className="rank-medal">{i === 0 && <Trophy />}0{i + 1}</span></div><div className="podium-content"><span className="category-pill">{p.category}</span><h3><button onClick={() => setView(p)}>{p.title}</button></h3><p>by {p.creator} <span>· {p.songCount} songs</span></p><div className="podium-bottom"><span><Heart /> {p.likes + Number(liked.includes(p.id))} <small>likes</small></span><button onClick={() => setView(p)}>Meet your next favorite <ArrowUpRight /></button></div></div></article>)}</div>
        <div className="full-chart-heading"><h3>The full rotation</h3><span>{ranked.length} mixes, endless good company</span></div>
        <div className="chart-table-wrap"><table className="chart-table"><thead><tr><th scope="col">Rank</th><th scope="col">Playlist / creator</th><th scope="col" className="category-column">Category</th><th scope="col" className="songs-column">Songs</th><th scope="col">Likes</th><th scope="col"><span className="visually-hidden">Save playlist</span></th></tr></thead><tbody>{ranked.map((p, i) => <tr key={p.id}><td><span className="table-rank">{String(i + 1).padStart(2, '0')}</span></td><td><button className="table-playlist" onClick={() => setView(p)}><AlbumArt playlist={p} small /><span><strong>{p.title}</strong><span>by {p.creator}</span></span></button></td><td className="category-column"><span className="category-pill">{p.category}</span></td><td className="songs-column">{p.songCount}</td><td><button className={`like-control ${liked.includes(p.id) ? 'is-liked' : ''}`} aria-label={`${liked.includes(p.id) ? 'Unlike' : 'Like'} ${p.title}`} aria-pressed={liked.includes(p.id)} onClick={() => setLiked(liked.includes(p.id) ? liked.filter((id) => id !== p.id) : [...liked, p.id])}><Heart /> {p.likes + Number(liked.includes(p.id))}</button></td><td><button className="save-control" aria-label={`${saved.includes(p.id) ? 'Unsave' : 'Save'} ${p.title}`} aria-pressed={saved.includes(p.id)} onClick={() => { setSaved(saved.includes(p.id) ? saved.filter((id) => id !== p.id) : [...saved, p.id]); setNotice(`${p.title} ${saved.includes(p.id) ? 'removed from' : 'saved in'} this leaderboard preview.`); }}>{saved.includes(p.id) ? <BookmarkCheckFill /> : <Bookmark />}</button></td></tr>)}</tbody></table></div>
        <p className="chart-notice" role="status">{notice || 'Try a category, open a mix, or give a sample playlist some love.'}</p>
      </section>
      <aside className="chart-cta"><div><span className="eyebrow">THERE’S ROOM FOR YOUR SOUND, TOO.</span><h2>Your next playlist could be someone’s favorite.</h2></div><Link className="primary-music-button" href="/my-playlists">Make it yours <ArrowRight /></Link><ArrowDownRight className="cta-arrow" aria-hidden="true" /></aside>
      <p className="demo-note">Sample rankings for M1. Likes and saves are local to this page and reset on refresh; they do not update your collection.</p>
    </div><PlaylistDialog playlist={view} onClose={() => setView(null)} /></main>
  );
}
function DiscIcon() { return <span aria-hidden="true">◎</span>; }
