'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Form, Modal } from 'react-bootstrap';
import { ArrowRight, Bookmark, Check2, Disc, Headphones, Pencil, Plus, Search } from 'react-bootstrap-icons';
import { playlists, ownedPlaylists, savedPlaylists, type Playlist } from '@/lib/mockups/playlists';
import PlaylistCard from './PlaylistCard';
import PlaylistDialog from './PlaylistDialog';

export default function MyPlaylists({ initialPlaylist }: { initialPlaylist?: string }) {
  const [profile, setProfile] = useState({ name: 'Katrina', username: 'katrina', bio: 'UH Mānoa music fan. A little indie, a little island, and a playlist for every mood.' });
  const [draft, setDraft] = useState(profile);
  const [editProfile, setEditProfile] = useState(false);
  const [view, setView] = useState<Playlist | null>(playlists.find((item) => item.id === initialPlaylist) || null);
  const [share, setShare] = useState<Playlist | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [saved, setSaved] = useState(savedPlaylists);
  const [removed, setRemoved] = useState<Playlist | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [edit, setEdit] = useState<Playlist | null>(null);
  const [mine, setMine] = useState(ownedPlaylists);
  const shareUrl = share && typeof window !== 'undefined' ? `${window.location.origin}/my-playlists?playlist=${share.id}` : '';
  const filtered = mine.filter((p) => `${p.title} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  if (sort === 'likes') filtered.sort((a, b) => b.likes - a.likes);
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  const openShare = (p: Playlist) => { setShare(p); setCopied(false); setCopyError(false); };
  return (
    <main className="music-page" id="my-playlists-page">
      <div className="music-container">
        <div className="page-intro"><div><p className="eyebrow">YOUR LITTLE CORNER OF THE MIX</p><h1>My Profile <span>&</span> Playlists<span className="title-dot">.</span></h1></div><span className="preview-badge"><span /> M1 mockup · sample data</span></div>
        <section className="profile-banner" aria-label="Your sample profile">
          <div className="profile-topline"><span><span className="tiny-star">✳</span> MADE OF MUSIC. ROOTED IN MĀNOA.</span><span>EST. 2026</span></div>
          <div className="profile-main"><div className="profile-avatar"><Headphones /><span>K</span><i /></div><div className="profile-copy"><span className="profile-handle">@{profile.username}</span><h2>{profile.name}</h2><p>{profile.bio}</p><div className="profile-stats"><span><strong>{mine.length}</strong> playlists</span><span><strong>{mine.reduce((total, p) => total + p.likes, 0)}</strong> likes received</span><span><strong>{saved.length}</strong> saved</span></div></div><button className="edit-profile-button" onClick={() => { setDraft(profile); setEditProfile(true); }}><Pencil /> Edit Profile</button></div>
          <div className="banner-record" aria-hidden="true"><span /></div>
        </section>
        <section className="playlist-section" aria-labelledby="mine-heading">
          <div className="section-heading"><div><p className="eyebrow">CURATED BY YOU</p><h2 id="mine-heading">My Playlists <span className="count-badge">{mine.length}</span></h2><p>Your moods, your moments, your soundtrack.</p></div><button className="primary-music-button" onClick={() => setEdit({ ...ownedPlaylists[0], id: 'new', title: '', description: '', songCount: 0, likes: 0 })}><Plus size={21} /> Create Playlist</button></div>
          <div className="library-toolbar"><label className="library-search"><Search /><input aria-label="Search your playlists" placeholder="Find a playlist in your collection…" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="sort-control">Sort by <select aria-label="Sort your playlists" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently added</option><option value="likes">Most liked</option><option value="name">Playlist name</option></select></label></div>
          <div className="playlist-grid">{filtered.map((p) => <PlaylistCard key={p.id} playlist={p} onView={() => setView(p)} onEdit={() => setEdit(p)} onShare={() => openShare(p)} />)}</div>
          {!filtered.length && <div className="empty-library"><Disc /><h3>No playlists found</h3><p>Try another title or category.</p><button onClick={() => setQuery('')}>Clear search</button></div>}
        </section>
        <section className="playlist-section saved-section" id="saved-playlists" aria-labelledby="saved-heading">
          <div className="section-heading"><div><p className="eyebrow"><Bookmark /> GOOD FINDS, KEPT CLOSE</p><h2 id="saved-heading">Saved Playlists <span className="count-badge">{saved.length}</span></h2><p>Great mixes from around campus, all in one place.</p></div><Link className="text-music-link" href="/leaderboard">Find your next favorite <ArrowRight /></Link></div>
          {removed && <div className="undo-notice" role="status">Removed “{removed.title}” from this preview. <button onClick={() => { setSaved([...saved, removed]); setRemoved(null); }}>Undo</button></div>}
          <div className="playlist-grid">{saved.map((p) => <PlaylistCard key={p.id} playlist={p} saved onView={() => setView(p)} onShare={() => openShare(p)} onUnsave={() => { setSaved(saved.filter((item) => item.id !== p.id)); setRemoved(p); }} />)}</div>
          {!saved.length && <div className="empty-library"><Bookmark /><h3>A little room for discovery</h3><p>Your saved mixes will appear here.</p></div>}
        </section>
        <div className="collection-end"><Headphones /><p>Good music is better together.</p><span>SHARE A LITTLE OF YOUR WORLD.</span></div>
        <p className="demo-note">Fictional profile and playlists for M1. Edits and saved selections reset when you refresh.</p>
      </div>
      <PlaylistDialog playlist={view} onClose={() => setView(null)} />
      <Modal show={editProfile} onHide={() => setEditProfile(false)} centered contentClassName="music-modal"><Modal.Header closeButton><Modal.Title>Edit profile</Modal.Title></Modal.Header><Form onSubmit={(e) => { e.preventDefault(); setProfile(draft); setEditProfile(false); }}><Modal.Body><p className="muted">Make this little corner yours.</p><Form.Group className="mb-3" controlId="profile-name"><Form.Label>Display name</Form.Label><Form.Control required maxLength={40} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Form.Group><Form.Group className="mb-3" controlId="profile-username"><Form.Label>Username</Form.Label><Form.Control required pattern="[a-zA-Z0-9_]+" maxLength={30} value={draft.username} onChange={(e) => setDraft({ ...draft, username: e.target.value })} /></Form.Group><Form.Group controlId="profile-bio"><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={3} maxLength={180} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></Form.Group><p className="demo-note">Changes apply to this preview only.</p></Modal.Body><Modal.Footer><Button variant="light" onClick={() => setEditProfile(false)}>Cancel</Button><Button type="submit" className="primary-music-button">Save Changes</Button></Modal.Footer></Form></Modal>
      <Modal show={!!share} onHide={() => setShare(null)} centered contentClassName="music-modal"><Modal.Header closeButton><Modal.Title>Share {share?.title}</Modal.Title></Modal.Header><Modal.Body><p>Good finds deserve good company.</p><Form.Label htmlFor="share-link">Playlist preview link</Form.Label><Form.Control id="share-link" readOnly value={shareUrl} /><p className="demo-note">Links open this playlist’s sample preview.</p>{copyError && <p role="alert">Copy is unavailable here. Select the link above and copy it manually.</p>}</Modal.Body><Modal.Footer><Button variant="light" onClick={() => setShare(null)}>Close</Button><Button className="primary-music-button" onClick={async () => { try { await navigator.clipboard.writeText(shareUrl); setCopied(true); } catch { setCopyError(true); } }}>{copied ? <><Check2 /> Copied!</> : 'Copy Link'}</Button></Modal.Footer></Modal>
      <Modal show={!!edit} onHide={() => setEdit(null)} centered contentClassName="music-modal"><Modal.Header closeButton><Modal.Title>{edit?.id === 'new' ? 'Create playlist preview' : 'Edit playlist preview'}</Modal.Title></Modal.Header>{edit && <Form onSubmit={(e) => { e.preventDefault(); setMine(edit.id === 'new' ? [...mine, { ...edit, id: `preview-${Date.now()}`, songs: [], duration: '0 min' }] : mine.map((p) => p.id === edit.id ? edit : p)); setEdit(null); }}><Modal.Body><p className="demo-note">This small preview updates your cards locally. The full Create/Edit page is a separate team mockup.</p><Form.Group controlId="playlist-name" className="mb-3"><Form.Label>Playlist name</Form.Label><Form.Control required maxLength={60} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Form.Group><Form.Group controlId="playlist-description"><Form.Label>Description</Form.Label><Form.Control as="textarea" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Form.Group></Modal.Body><Modal.Footer><Button variant="light" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit" className="primary-music-button">Save Preview</Button></Modal.Footer></Form>}</Modal>
    </main>
  );
}
