'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form, Modal } from 'react-bootstrap';
import { ArrowRight, Bookmark, Check2, Disc, Facebook, Headphones, Instagram, Pencil, Plus, Search, Spotify, TwitterX, Youtube } from 'react-bootstrap-icons';
import { playlists, ownedPlaylists, savedPlaylists, type Playlist } from '@/lib/mockups/playlists';
import PlaylistCard from './PlaylistCard';
import PlaylistDialog from './PlaylistDialog';

const copyPlatforms = [
  { name: 'Instagram', Icon: Instagram, instructions: 'Paste the link into an Instagram message or a Story link sticker.' },
  { name: 'Spotify', Icon: Spotify, instructions: 'Paste the link into the description of a Spotify playlist you own.' },
  { name: 'YouTube', Icon: Youtube, instructions: 'Paste the link into a YouTube video description.' },
];

async function readProfileImage(file: FormDataEntryValue | null, fallback: string): Promise<string> {
  if (!(file instanceof File) || !file.size) return fallback;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error('Choose a JPG, PNG, or WebP image up to 5 MB.');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export default function MyPlaylists({ initialPlaylist }: { initialPlaylist?: string }) {
  const [profile, setProfile] = useState({ name: 'Katrina', username: 'katrina', bio: 'UH Mānoa music fan. A little indie, a little island, and a playlist for every mood.', photo: '/profiles/katrina.jpg', background: '' });
  const [draft, setDraft] = useState(profile);
  const [editProfile, setEditProfile] = useState(false);
  const [view, setView] = useState<Playlist | null>(playlists.find((item) => item.id === initialPlaylist) || null);
  const [share, setShare] = useState<Playlist | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [saved, setSaved] = useState(savedPlaylists);
  const [removed, setRemoved] = useState<Playlist | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [playlistNotice, setPlaylistNotice] = useState<'Create Playlist' | 'Edit Playlist' | null>(null);
  const mine = ownedPlaylists;
  const shareUrl = share && typeof window !== 'undefined' ? `${window.location.origin}/my-playlists?playlist=${share.id}` : '';
  const filtered = mine.filter((p) => `${p.title} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  if (sort === 'likes') filtered.sort((a, b) => b.likes - a.likes);
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  const openShare = (p: Playlist) => { setShare(p); setCopied(false); setCopyError(false); setShareMessage(''); };
  const copyShareLink = async (instructions = '') => {
    setShareMessage('');
    setCopyError(false);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareMessage(instructions ? `Link copied. ${instructions}` : 'Link copied.');
    } catch {
      setCopyError(true);
      setShareMessage(instructions);
    }
  };

  return (
    <main className="music-page" id="my-playlists-page">
      <div className="music-container">
        <div className="page-intro"><div><p className="eyebrow">YOUR LITTLE CORNER OF THE MIX</p><h1>My Profile <span>&</span> Playlists<span className="title-dot">.</span></h1></div><span className="preview-badge"><span /> M1 mockup · sample data</span></div>
        <section
          className="profile-banner"
          aria-label="Your sample profile"
          style={profile.background ? {
            backgroundImage: `linear-gradient(90deg, #122a21ed, #122a2199), url("${profile.background}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          <div className="profile-topline"><span><span className="tiny-star">✳</span> MADE OF MUSIC. ROOTED IN MĀNOA.</span><span>EST. 2026</span></div>
          <div className="profile-main"><div className="profile-avatar"><Image src={profile.photo} alt={`${profile.name}’s profile photo`} unoptimized={profile.photo.startsWith('data:')} width={256} height={256} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><div className="profile-copy"><span className="profile-handle">@{profile.username}</span><h2>{profile.name}</h2><p>{profile.bio}</p><div className="profile-stats"><span><strong>{mine.length}</strong> playlists</span><span><strong>{mine.reduce((total, p) => total + p.likes, 0)}</strong> likes received</span><span><strong>{saved.length}</strong> saved</span></div></div><button className="edit-profile-button" onClick={() => { setDraft(profile); setProfileError(''); setEditProfile(true); }}><Pencil /> Edit Profile</button></div>
          <div className="banner-record" aria-hidden="true"><span /></div>
        </section>
        <section className="playlist-section" aria-labelledby="mine-heading">
          <div className="section-heading"><div><p className="eyebrow">CURATED BY YOU</p><h2 id="mine-heading">My Playlists <span className="count-badge">{mine.length}</span></h2><p>Your moods, your moments, your soundtrack.</p></div><button className="primary-music-button" onClick={() => setPlaylistNotice('Create Playlist')}><Plus size={21} /> Create Playlist</button></div>
          <div className="library-toolbar"><label className="library-search"><Search /><input aria-label="Search your playlists" placeholder="Find a playlist in your collection…" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="sort-control">Sort by <select aria-label="Sort your playlists" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently added</option><option value="likes">Most liked</option><option value="name">Playlist name</option></select></label></div>
          <div className="playlist-grid">{filtered.map((p) => <PlaylistCard key={p.id} playlist={p} onView={() => setView(p)} onEdit={() => setPlaylistNotice('Edit Playlist')} onShare={() => openShare(p)} />)}</div>
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
      <Modal
        show={editProfile}
        onHide={() => { if (!savingProfile) setEditProfile(false); }}
        centered
        contentClassName="music-modal"
      >
        <Form onSubmit={async (event) => {
          event.preventDefault();
          const fields = new FormData(event.currentTarget);
          setProfileError('');
          setSavingProfile(true);
          try {
            const [photo, background] = await Promise.all([
              readProfileImage(fields.get('photo'), draft.photo),
              readProfileImage(fields.get('background'), draft.background),
            ]);
            setProfile({ ...draft, photo, background });
            setEditProfile(false);
          } catch (error) {
            setProfileError(error instanceof Error ? error.message : 'Could not update the profile.');
          } finally {
            setSavingProfile(false);
          }
        }}>
          <Modal.Header closeButton={!savingProfile}><Modal.Title>Edit profile</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="profile-name">
              <Form.Label>Display name</Form.Label>
              <Form.Control required maxLength={40} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profile-username">
              <Form.Label>Username</Form.Label>
              <Form.Control required pattern="[a-zA-Z0-9_]+" maxLength={30} value={draft.username} onChange={(e) => setDraft({ ...draft, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profile-bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={3} maxLength={180} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profile-photo">
              <Form.Label>Edit profile picture</Form.Label>
              <Form.Control name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
            </Form.Group>
            <Form.Group controlId="profile-background">
              <Form.Label>Edit background</Form.Label>
              <Form.Control name="background" type="file" accept="image/jpeg,image/png,image/webp" />
            </Form.Group>
            <p className="demo-note">JPG, PNG, or WebP, up to 5 MB each. Changes apply to this preview only.</p>
            {profileError && <p className="text-danger mt-2" role="alert">{profileError}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" disabled={savingProfile} onClick={() => setEditProfile(false)}>Cancel</Button>
            <Button type="submit" className="primary-music-button" disabled={savingProfile}>Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={!!share} onHide={() => setShare(null)} centered contentClassName="music-modal">
        <Modal.Header closeButton><Modal.Title>Share {share?.title}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="share-link">Playlist preview link</Form.Label>
          <Form.Control id="share-link" readOnly value={shareUrl} />
          <div className="d-flex flex-wrap gap-2 mt-3" role="group" aria-label="Share destinations">
            <Button variant="outline-secondary" className="d-inline-flex align-items-center justify-content-center p-2" target="_blank" rel="noopener noreferrer"
              aria-label="Share on Facebook" title="Share on Facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>
              <Facebook size={24} aria-hidden="true" />
            </Button>
            <Button variant="outline-secondary" className="d-inline-flex align-items-center justify-content-center p-2" target="_blank" rel="noopener noreferrer"
              aria-label="Share on Twitter / X" title="Share on Twitter / X"
              href={`https://twitter.com/intent/tweet?${new URLSearchParams({ text: share?.title ?? '', url: shareUrl })}`}>
              <TwitterX size={24} aria-hidden="true" />
            </Button>
            {copyPlatforms.map(({ name, Icon, instructions }) => (
              <Button
                key={name}
                variant="outline-secondary"
                className="d-inline-flex align-items-center justify-content-center p-2"
                aria-label={`Copy link for ${name}`}
                title={`Copy link for ${name}`}
                onClick={() => copyShareLink(instructions)}
              >
                <Icon size={24} aria-hidden="true" />
              </Button>
            ))}
          </div>
          {shareMessage && <p className="mt-3 mb-0" role="status">{shareMessage}</p>}
          {copyError && <p className="mt-3 mb-0" role="alert">Select the link above and copy it manually.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShare(null)}>Close</Button>
          <Button className="primary-music-button" onClick={() => copyShareLink()}>
            {copied ? <><Check2 /> Copied!</> : 'Copy Link'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={!!playlistNotice} onHide={() => setPlaylistNotice(null)} centered contentClassName="music-modal">
        <Modal.Header closeButton><Modal.Title>{playlistNotice}</Modal.Title></Modal.Header>
        <Modal.Body>This will link to the {playlistNotice} page once it’s ready.</Modal.Body>
        <Modal.Footer><Button variant="light" onClick={() => setPlaylistNotice(null)}>Close</Button></Modal.Footer>
      </Modal>
    </main>
  );
}
