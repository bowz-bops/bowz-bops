'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Form, Modal } from 'react-bootstrap';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheckFill,
  ChevronDown,
  ChevronUp,
  Compass,
  Disc,
  Facebook,
  Headphones,
  Heart,
  HeartFill,
  Instagram,
  Plus,
  Search,
  Share,
  Spotify,
  TwitterX,
  Youtube,
} from 'react-bootstrap-icons';
import { samplePlaylists, type MockupPlaylist } from './PlaylistDetails';
import AlbumArt from './music/AlbumArt';
import PlaylistDialog from './music/PlaylistDialog';

export interface DiscoverPlaylistProps {
  initialCategory?: string;
  playlists?: MockupPlaylist[];
}

const categoryMetadata: Record<
  string,
  { eyebrow: string; subtitle: string; icon: string }
> = {
  Studying: {
    eyebrow: 'FOCUS, INSTRUMENTALS & LATE NIGHTS',
    subtitle: 'Soft beats, and quiet rhythms for getting in the zone at Hamilton.',
    icon: '📚',
  },
  Beach: {
    eyebrow: 'SALT IN THE AIR & ISLAND GROOVES',
    subtitle: 'Acoustic jams, surf anthems, and sunshine favorites for North Shore drives.',
    icon: '🌊',
  },
  Workout: {
    eyebrow: 'FIND YOUR TEMPO & HIT YOUR STRIDE',
    subtitle: 'Heavy basslines, fast BPMs, and adrenaline for the weight room.',
    icon: '⚡',
  },
  Chill: {
    eyebrow: 'MAGIC ISLAND SUNSETS & SLOW DOWNS',
    subtitle: 'Mellow neo-soul, warm vocals, and easy soundscapes for slowing down after class.',
    icon: '🌅',
  },
  Party: {
    eyebrow: 'WEEKEND SELECTS & ALOHA FRIDAY',
    subtitle: 'Upbeat bangers, dance floor anthems, and house mixes for when the group chat says one more song.',
    icon: '🪩',
  },
};

const copyPlatforms = [
  { name: 'Instagram', Icon: Instagram, instructions: 'Paste the link into an Instagram message or Story link sticker.' },
  { name: 'Spotify', Icon: Spotify, instructions: 'Paste the link into the description of a Spotify playlist you own.' },
  { name: 'YouTube', Icon: Youtube, instructions: 'Paste the link into a YouTube video description.' },
];

const INITIAL_VISIBLE_COUNT = 3;

export default function DiscoverPlaylist({
  initialCategory,
  playlists: customPlaylists,
}: DiscoverPlaylistProps = {}) {
  // Playlist library obtained directly from PlaylistDetails
  const allPlaylists = useMemo(() => {
    return customPlaylists && customPlaylists.length > 0 ? customPlaylists : samplePlaylists;
  }, [customPlaylists]);

  // Distinct categories (excluding "All playlists")
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    allPlaylists.forEach((p) => {
      if (p.category && p.category !== 'All playlists') set.add(p.category);
    });
    return Array.from(set);
  }, [allPlaylists]);

  // Interactive user state
  const [query, setQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['golden-hour', 'north-shore']));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(initialCategory ? [initialCategory] : []),
  );
  const [viewPlaylist, setViewPlaylist] = useState<MockupPlaylist | null>(null);
  const [notice, setNotice] = useState('');

  // Sharing state
  const [sharePlaylist, setSharePlaylist] = useState<MockupPlaylist | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [copyError, setCopyError] = useState(false);

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const toggleLike = (playlist: MockupPlaylist) => {
    const isCurrentlyLiked = likedIds.has(playlist.id);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(playlist.id);
      else next.add(playlist.id);
      return next;
    });
    setNotice(
      isCurrentlyLiked
        ? `Removed like from “${playlist.title}”.`
        : `Liked “${playlist.title}”! Count updated in this preview.`,
    );
  };

  const toggleSave = (playlist: MockupPlaylist) => {
    const isCurrentlySaved = savedIds.has(playlist.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(playlist.id);
      else next.add(playlist.id);
      return next;
    });
    setNotice(
      isCurrentlySaved
        ? `Removed “${playlist.title}” from your saved mixes.`
        : `Saved “${playlist.title}” to your collection!`,
    );
  };

  const openShare = (playlist: MockupPlaylist) => {
    setSharePlaylist(playlist);
    setCopied(false);
    setCopyError(false);
    setShareMessage('');
  };

  const shareUrl = sharePlaylist && typeof window !== 'undefined'
    ? `${window.location.origin}/discover?playlist=${sharePlaylist.id}`
    : 'https://bowz-bops.uh.edu/discover';

  const copyShareLink = async (instructions = '') => {
    setShareMessage('');
    setCopyError(false);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareMessage(instructions ? `Link copied. ${instructions}` : 'Link copied to clipboard.');
    } catch {
      setCopyError(true);
      setShareMessage(instructions || 'Select the link and copy manually.');
    }
  };

  const scrollToCategory = (category: string) => {
    const target = document.getElementById(`category-${category.toLowerCase()}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="music-page" id="discover-playlists-page">
      <div className="music-container">
        {/* Breadcrumb & Navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <Link className="text-music-link" href="/leaderboard">
            ← View Campus Leaderboard
          </Link>
          <Link className="text-music-link" href="/my-playlists">
            My Collection & Playlists <ArrowRight />
          </Link>
        </div>

        {/* Page Intro matching Leaderboard & MyPlaylists style */}
        <div className="page-intro">
          <div>
            <p className="eyebrow">THE CAMPUS SOUND DIRECTORY</p>
            <h1>
              Discover <span>Playlists</span>
              <span className="title-dot">.</span>
            </h1>
          </div>
          <span className="preview-badge">
            <span /> M1 mockup · categorized by popular demand
          </span>
        </div>

        {/* Hero Banner inspired by Leaderboard */}
        <section className="leaderboard-hero" aria-labelledby="discover-hero-title">
          <div className="chart-hero-copy">
            <span className="chart-edition">
              <Compass /> DISCOVER BY MOOD & VIBE
            </span>
            <h2 id="discover-hero-title">
              Find the sound for<br />every moment<span>✳</span>
            </h2>
            <p>
              From late night library grinds to sunny North Shore drives.<br />
              Explore our campus community’s most popular playlists by category.
            </p>
            <div className="chart-hero-bottom">
              <span className="mini-avatars">
                <i>L</i><i>K</i><i>M</i>
              </span>
              <span>Curated by students. Rooted in Mānoa.</span>
            </div>
          </div>

          <div className="hero-disc" aria-hidden="true">
            <div className="disc-label">
              <Headphones />
              <span>BOWZ BOPS</span>
              <strong>DISCOVER<br />CAMPUS VIBES.</strong>
              <small>SIDE A · MĀNOA DIRECTORY</small>
            </div>
          </div>
          <span className="hero-stamp" aria-hidden="true">
            CAMPUS<br />MIXES.
          </span>
        </section>

        {/* Category Quick Jump Bar */}
        <nav className="mt-4 pt-2" aria-label="Jump to category section">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <span className="eyebrow mb-0">JUMP TO A CATEGORY:</span>
            <span className="muted" style={{ fontSize: '11px' }}>
              {categoriesList.length} dedicated categories
            </span>
          </div>
          <div className="category-tabs" role="group" aria-label="Quick jump categories">
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                title={`Jump to ${category} section`}
              >
                <span>{categoryMetadata[category]?.icon || '◎'}</span> {category}
              </button>
            ))}
          </div>
        </nav>

        {/* Search & Notice Bar matching MyPlaylists */}
        <div className="library-toolbar mt-3">
          <label className="library-search" style={{ maxWidth: '420px' }}>
            <Search />
            <input
              aria-label="Search playlists across all categories"
              placeholder="Search playlists, creators, or keywords…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          {query && (
            <button
              className="text-music-link"
              onClick={() => setQuery('')}
              style={{ fontSize: '12px' }}
            >
              Clear search filter
            </button>
          )}
        </div>

        {notice && (
          <div className="undo-notice mt-3 mb-2" role="status">
            {notice}
          </div>
        )}

        {/* Dedicated Sections for Each Category */}
        <div className="category-sections-wrapper">
          {categoriesList.map((category) => {
            const meta = categoryMetadata[category] || {
              eyebrow: 'CAMPUS ROTATION',
              subtitle: 'Curated playlists loved by students.',
              icon: '◎',
            };

            // Filter playlists in this category and rank by popularity (likes)
            const categoryPlaylists = allPlaylists
              .filter((p) => p.category.toLowerCase() === category.toLowerCase())
              .filter((p) => {
                if (!query) return true;
                const searchTarget = `${p.title} ${p.creator} ${p.username} ${p.description}`.toLowerCase();
                return searchTarget.includes(query.toLowerCase());
              })
              .sort((a, b) => {
                const aLikes = a.likes + (likedIds.has(a.id) ? 1 : 0);
                const bLikes = b.likes + (likedIds.has(b.id) ? 1 : 0);
                return bLikes - aLikes;
              });

            const isExpanded = expandedCategories.has(category) || Boolean(query);
            const visiblePlaylists = isExpanded
              ? categoryPlaylists
              : categoryPlaylists.slice(0, INITIAL_VISIBLE_COUNT);

            const hasMoreToExpand = categoryPlaylists.length > INITIAL_VISIBLE_COUNT && !query;

            return (
              <section
                key={category}
                id={`category-${category.toLowerCase()}`}
                className="playlist-section"
                aria-labelledby={`heading-${category.toLowerCase()}`}
              >
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">
                      <span className="tiny-star">✳</span> {meta.eyebrow}
                    </p>
                    <h2 id={`heading-${category.toLowerCase()}`}>
                      {category} <span className="count-badge">{categoryPlaylists.length}</span>
                    </h2>
                    <p>{meta.subtitle}</p>
                  </div>

                  {hasMoreToExpand && (
                    <button
                      className="text-music-link"
                      onClick={() => toggleExpand(category)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? `Show fewer ${category} playlists` : `Expand all ${categoryPlaylists.length} playlists`}
                    >
                      {isExpanded ? (
                        <>Show top {INITIAL_VISIBLE_COUNT} <ChevronUp /></>
                      ) : (
                        <>Expand all {categoryPlaylists.length} playlists <ChevronDown /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Playlist Grid */}
                {categoryPlaylists.length > 0 ? (
                  <>
                    <div className="playlist-grid">
                      {visiblePlaylists.map((playlist) => {
                        const isLiked = likedIds.has(playlist.id);
                        const isSaved = savedIds.has(playlist.id);
                        const currentLikes = playlist.likes + (isLiked ? 1 : 0);

                        return (
                          <article className="playlist-card" key={playlist.id}>
                            <button
                              className="cover-button"
                              onClick={() => setViewPlaylist(playlist)}
                              aria-label={`View ${playlist.title} playlist`}
                            >
                              <AlbumArt playlist={playlist} />
                              <span className="cover-open">
                                <ArrowUpRight />
                              </span>
                            </button>

                            <div className="playlist-card-body">
                              <div className="card-category-row">
                                <span className="category-pill">{playlist.category}</span>
                                <span className="card-likes">
                                  <HeartFill style={{ color: isLiked ? '#b16748' : '#7e8878' }} /> {currentLikes}
                                </span>
                              </div>

                              <h3>
                                <button onClick={() => setViewPlaylist(playlist)}>
                                  {playlist.title}
                                </button>
                              </h3>

                              <p>
                                by{' '}
                                <Link
                                  className="creator-profile-link"
                                  href={`/profiles/${encodeURIComponent(playlist.username)}`}
                                >
                                  {playlist.creator}
                                </Link>{' '}
                                <span>·</span> {playlist.songCount} songs <span>·</span> {playlist.duration}
                              </p>

                              {/* Card Actions: View, Save, Like, Share */}
                              <div className="card-actions" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                                <button onClick={() => setViewPlaylist(playlist)} title="View playlist tracks">
                                  View <ArrowUpRight />
                                </button>

                                <button
                                  onClick={() => toggleLike(playlist)}
                                  className={isLiked ? 'text-danger' : ''}
                                  title={isLiked ? 'Unlike playlist' : 'Like playlist'}
                                  aria-pressed={isLiked}
                                >
                                  {isLiked ? <HeartFill /> : <Heart />} {isLiked ? 'Liked' : 'Like'}
                                </button>

                                <button
                                  onClick={() => toggleSave(playlist)}
                                  title={isSaved ? 'Remove from saved' : 'Save for later'}
                                  aria-pressed={isSaved}
                                  style={{ color: isSaved ? '#274b36' : undefined, fontWeight: isSaved ? 700 : undefined }}
                                >
                                  {isSaved ? <BookmarkCheckFill /> : <Bookmark />} {isSaved ? 'Saved' : 'Save'}
                                </button>

                                <button onClick={() => openShare(playlist)} title="Share playlist link">
                                  <Share /> Share
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {/* Bottom Expand Toggle Button */}
                    {hasMoreToExpand && (
                      <div className="text-center mt-3 pt-2">
                        <button
                          className="primary-music-button"
                          style={{
                            background: isExpanded ? '#335342' : '#eff2e6',
                            color: isExpanded ? '#fff' : '#274b36',
                            borderColor: '#d3dcce',
                          }}
                          onClick={() => toggleExpand(category)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <>Show fewer in {category} <ChevronUp /></>
                          ) : (
                            <>
                              Expand for more {category} playlists ({categoryPlaylists.length - INITIAL_VISIBLE_COUNT} more) <ChevronDown />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-library">
                    <Disc />
                    <h3>No {category} playlists found</h3>
                    <p>Try clearing your search query to see all mixes in this category.</p>
                    <button onClick={() => setQuery('')}>Clear search filter</button>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Bottom CTA & Campus Signature matching Leaderboard */}
        <aside className="chart-cta mt-5">
          <div>
            <span className="eyebrow">YOUR SOUND HAS A HOME AT MĀNOA</span>
            <h2>Created a playlist that belongs in one of these categories?</h2>
          </div>
          <Link className="primary-music-button" href="/my-playlists">
            Create Playlist <ArrowRight />
          </Link>
          <ArrowDownRight className="cta-arrow" aria-hidden="true" />
        </aside>

        <div className="collection-end">
          <Headphones />
          <p>Good music is better together.</p>
          <span>DISCOVER. LISTEN. SHARE.</span>
        </div>

        <p className="demo-note">
          Bowz Bops Discover view. Categories, likes, and saved states are reactive for this preview session.
        </p>
      </div>

      {/* Reusable Playlist Dialog (Shows tracks with direct link to full tracklist page) */}
      <PlaylistDialog playlist={viewPlaylist} onClose={() => setViewPlaylist(null)} />

      {/* Share Modal matching MyPlaylists */}
      <Modal show={!!sharePlaylist} onHide={() => setSharePlaylist(null)} centered contentClassName="music-modal">
        <Modal.Header closeButton>
          <Modal.Title>Share {sharePlaylist?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="discover-share-link">Playlist link</Form.Label>
          <Form.Control id="discover-share-link" readOnly value={shareUrl} />

          <div className="d-flex flex-wrap gap-2 mt-3" role="group" aria-label="Share destinations">
            <Button
              variant="outline-secondary"
              className="d-inline-flex align-items-center justify-content-center p-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              title="Share on Facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            >
              <Facebook size={24} aria-hidden="true" />
            </Button>

            <Button
              variant="outline-secondary"
              className="d-inline-flex align-items-center justify-content-center p-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter / X"
              title="Share on Twitter / X"
              href={`https://twitter.com/intent/tweet?${new URLSearchParams({
                text: sharePlaylist?.title ?? 'Bowz Bops Playlist',
                url: shareUrl,
              })}`}
            >
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
          {copyError && <p className="mt-3 mb-0" role="alert">Select the link above and copy manually.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSharePlaylist(null)}>Close</Button>
          <Button className="primary-music-button" onClick={() => copyShareLink()}>
            {copied ? <>Copied!</> : 'Copy Link'}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
