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
  BoxArrowUpRight,
  Check2,
  Clock,
  Disc,
  Facebook,
  Headphones,
  Heart,
  HeartFill,
  Instagram,
  PauseFill,
  PlayFill,
  Plus,
  Search,
  Share,
  Spotify,
  TwitterX,
  Youtube,
} from 'react-bootstrap-icons';
import type { Playlist as PrismaPlaylist, Song as PrismaSong } from '@prisma/client';
import { playlists as mockupPlaylists, type Playlist as MockupPlaylist } from '@/lib/mockups/playlists';
import AlbumArt from './music/AlbumArt';

export type { MockupPlaylist };

/** Complete campus playlist collection accessible across components */
export const samplePlaylists: MockupPlaylist[] = [
  ...mockupPlaylists,
  {
    id: 'hamilton-stacks',
    title: 'Hamilton Stacks',
    category: 'Studying',
    creator: 'Katrina',
    username: 'katrina',
    songCount: 14,
    likes: 53,
    duration: '52 min',
    art: 'study',
    caption: 'FOURTH FLOOR SILENCE',
    description: 'Deep ambient soundscapes and quiet piano for crunch time and finals week.',
    songs: [
      { title: 'Treefingers', artist: 'Radiohead', duration: '3:42' },
      { title: 'Avril 14th', artist: 'Aphex Twin', duration: '2:05' },
      { title: 'An Ending (Ascent)', artist: 'Brian Eno', duration: '4:26' },
    ],
  },
  {
    id: 'sandy-afternoon',
    title: 'Sandy Afternoon',
    category: 'Beach',
    creator: 'Kai',
    username: 'kai',
    songCount: 18,
    likes: 62,
    duration: '1 hr 4 min',
    art: 'beach',
    caption: 'WARM SANDS',
    description: 'Acoustic jams, surf anthems, and sunshine rhythms for long days by the water.',
    songs: [
      { title: 'Santeria', artist: 'Sublime', duration: '3:03' },
      { title: 'Sunday Morning', artist: 'Maroon 5', duration: '4:02' },
      { title: 'Could You Be Loved', artist: 'Bob Marley', duration: '3:57' },
    ],
  },
  {
    id: 'pr-breaker',
    title: 'PR Breaker',
    category: 'Workout',
    creator: 'Koa',
    username: 'katrina',
    songCount: 12,
    likes: 48,
    duration: '44 min',
    art: 'gym',
    caption: 'HEAVY ROTATION',
    description: 'Bass drops, heavy beats, and adrenaline for the Stan Sheriff Center weight room.',
    songs: [
      { title: 'Till I Collapse', artist: 'Eminem', duration: '4:57' },
      { title: 'Power', artist: 'Kanye West', duration: '4:52' },
      { title: 'Remember the Name', artist: 'Fort Minor', duration: '3:50' },
    ],
  },
  {
    id: 'cardio-crush',
    title: 'Cardio Crush',
    category: 'Workout',
    creator: 'Katrina',
    username: 'katrina',
    songCount: 11,
    likes: 35,
    duration: '40 min',
    art: 'gym',
    caption: 'KEEP MOVING',
    description: 'Fast BPM tracks and driving synths for morning runs along Ala Moana.',
    songs: [
      { title: 'Can’t Hold Us', artist: 'Macklemore', duration: '4:18' },
      { title: 'Don’t You Worry Child', artist: 'Swedish House Mafia', duration: '3:32' },
      { title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:04' },
    ],
  },
  {
    id: 'sunset-lanai',
    title: 'Sunset Lānaʻi',
    category: 'Chill',
    creator: 'Leilani',
    username: 'leilani',
    songCount: 16,
    likes: 64,
    duration: '59 min',
    art: 'sunset',
    caption: 'EVENING GLOW',
    description: 'Cool trade winds and mellow acoustic melodies on the dorm balcony.',
    songs: [
      { title: 'Japanese Denim', artist: 'Daniel Caesar', duration: '4:30' },
      { title: 'Peach', artist: 'Kevin Abstract', duration: '2:56' },
      { title: 'Sunflower', artist: 'Rex Orange County', duration: '4:12' },
    ],
  },
  {
    id: 'manoa-house-party',
    title: 'Mānoa House Party',
    category: 'Party',
    creator: 'Maya',
    username: 'maya',
    songCount: 22,
    likes: 59,
    duration: '1 hr 18 min',
    art: 'night',
    caption: 'ALOHA FRIDAY',
    description: 'High energy bangers and throwback crowd-pleasers for Friday nights in the valley.',
    songs: [
      { title: 'Around the World', artist: 'Daft Punk', duration: '7:09' },
      { title: 'Dance the Night', artist: 'Dua Lipa', duration: '2:56' },
      { title: 'One More Time', artist: 'Daft Punk', duration: '5:20' },
    ],
  },
];

export const playlists: MockupPlaylist[] = samplePlaylists;

export function getPlaylists(): MockupPlaylist[] {
  return samplePlaylists;
}

export type NormalizedTrack = {
  id: string | number;
  title: string;
  artist: string;
  duration: string;
  date?: string;
  link?: string | null;
};

export type SongInput =
  | PrismaSong
  | {
      id?: string | number;
      title?: string;
      name?: string;
      artist?: string;
      author?: string;
      duration?: string;
      date?: string;
      link?: string | null;
      playlistId?: number | null;
    };

export type PlaylistInput =
  | PrismaPlaylist
  | MockupPlaylist
  | (PrismaPlaylist & { songs?: SongInput[] })
  | {
      id?: string | number;
      name?: string;
      title?: string;
      author?: string;
      creator?: string;
      username?: string;
      category?: string;
      likes?: number;
      duration?: string;
      art?: string;
      caption?: string;
      description?: string;
      songs?: SongInput[];
    };

export interface PlaylistDetailsProps {
  /**
   * Matches `MyPlaylists` parameter: selects a playlist by id or title.
   */
  initialPlaylist?: string;
  /**
   * Numeric or string ID of the playlist.
   */
  playlistId?: string | number;
  /**
   * Full playlist object from Prisma or mockup data.
   */
  playlist?: PlaylistInput | null;
  /**
   * List of songs (matching user's parameter `song: Song[]`).
   */
  song?: SongInput[];
  /**
   * Plural alias for `song`.
   */
  songs?: SongInput[];
}

const copyPlatforms = [
  { name: 'Instagram', Icon: Instagram, instructions: 'Paste the link into an Instagram message or Story link sticker.' },
  { name: 'Spotify', Icon: Spotify, instructions: 'Paste the link into the description of a Spotify playlist you own.' },
  { name: 'YouTube', Icon: Youtube, instructions: 'Paste the link into a YouTube video description.' },
];

/** Expanded full track lists for sample playlists to show a rich tracklist when no custom songs are provided */
const samplePlaylistTracks: Record<string, NormalizedTrack[]> = {
  'study-session': [
    { id: 'ss-1', title: 'Aruarian Dance', artist: 'Nujabes', duration: '4:10', date: '2004', link: 'https://open.spotify.com' },
    { id: 'ss-2', title: 'A Walk', artist: 'Tycho', duration: '5:16', date: '2011', link: 'https://open.spotify.com' },
    { id: 'ss-3', title: 'Weightless', artist: 'Marconi Union', duration: '8:09', date: '2011', link: 'https://open.spotify.com' },
    { id: 'ss-4', title: 'Feather', artist: 'Nujabes feat. Cise Starr', duration: '2:55', date: '2005', link: 'https://open.spotify.com' },
    { id: 'ss-5', title: 'First Breath After Coma', artist: 'Explosions in the Sky', duration: '9:33', date: '2003', link: 'https://open.spotify.com' },
    { id: 'ss-6', title: 'Awake', artist: 'Tycho', duration: '4:43', date: '2014', link: 'https://open.spotify.com' },
    { id: 'ss-7', title: 'Dayvan Cowboy', artist: 'Boards of Canada', duration: '5:00', date: '2005', link: 'https://open.spotify.com' },
    { id: 'ss-8', title: 'Ki', artist: 'Bonobo', duration: '3:57', date: '2010', link: 'https://open.spotify.com' },
    { id: 'ss-9', title: 'We Move Lightly', artist: 'Dustin O’Halloran', duration: '3:03', date: '2011', link: 'https://open.spotify.com' },
    { id: 'ss-10', title: 'An Ending (Ascent)', artist: 'Brian Eno', duration: '4:26', date: '1983', link: 'https://open.spotify.com' },
    { id: 'ss-11', title: 'Avril 14th', artist: 'Aphex Twin', duration: '2:05', date: '2001', link: 'https://open.spotify.com' },
    { id: 'ss-12', title: 'Treefingers', artist: 'Radiohead', duration: '3:42', date: '2000', link: 'https://open.spotify.com' },
  ],
  'beach-day': [
    { id: 'bd-1', title: 'Amber', artist: '311', duration: '3:28', date: '2001', link: 'https://open.spotify.com' },
    { id: 'bd-2', title: 'Better Together', artist: 'Jack Johnson', duration: '3:27', date: '2005', link: 'https://open.spotify.com' },
    { id: 'bd-3', title: 'Island in the Sun', artist: 'Weezer', duration: '3:20', date: '2001', link: 'https://open.spotify.com' },
    { id: 'bd-4', title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole', duration: '5:08', date: '1993', link: 'https://open.spotify.com' },
    { id: 'bd-5', title: 'Banana Pancakes', artist: 'Jack Johnson', duration: '3:12', date: '2005', link: 'https://open.spotify.com' },
    { id: 'bd-6', title: 'Santeria', artist: 'Sublime', duration: '3:03', date: '1996', link: 'https://open.spotify.com' },
    { id: 'bd-7', title: 'Waves', artist: 'Mr. Probz', duration: '3:28', date: '2013', link: 'https://open.spotify.com' },
    { id: 'bd-8', title: 'Put Your Records On', artist: 'Corinne Bailey Rae', duration: '3:35', date: '2006', link: 'https://open.spotify.com' },
    { id: 'bd-9', title: 'Sunday Morning', artist: 'Maroon 5', duration: '4:02', date: '2002', link: 'https://open.spotify.com' },
    { id: 'bd-10', title: 'Riptide', artist: 'Vance Joy', duration: '3:24', date: '2013', link: 'https://open.spotify.com' },
    { id: 'bd-11', title: 'Could You Be Loved', artist: 'Bob Marley & The Wailers', duration: '3:57', date: '1980', link: 'https://open.spotify.com' },
    { id: 'bd-12', title: 'Upside Down', artist: 'Jack Johnson', duration: '3:28', date: '2006', link: 'https://open.spotify.com' },
    { id: 'bd-13', title: 'Steal My Kisses', artist: 'Ben Harper', duration: '4:05', date: '1999', link: 'https://open.spotify.com' },
    { id: 'bd-14', title: 'Floating', artist: 'Surfaces', duration: '3:05', date: '2019', link: 'https://open.spotify.com' },
    { id: 'bd-15', title: 'Sittin’ On The Dock of the Bay', artist: 'Otis Redding', duration: '2:44', date: '1968', link: 'https://open.spotify.com' },
  ],
  'gym-mix': [
    { id: 'gm-1', title: 'Stronger', artist: 'Kanye West', duration: '5:12', date: '2007', link: 'https://open.spotify.com' },
    { id: 'gm-2', title: 'Titanium', artist: 'David Guetta, Sia', duration: '4:05', date: '2011', link: 'https://open.spotify.com' },
    { id: 'gm-3', title: 'Levels', artist: 'Avicii', duration: '3:19', date: '2011', link: 'https://open.spotify.com' },
    { id: 'gm-4', title: 'Till I Collapse', artist: 'Eminem, Nate Dogg', duration: '4:57', date: '2002', link: 'https://open.spotify.com' },
    { id: 'gm-5', title: 'Power', artist: 'Kanye West', duration: '4:52', date: '2010', link: 'https://open.spotify.com' },
    { id: 'gm-6', title: 'Can’t Hold Us', artist: 'Macklemore & Ryan Lewis', duration: '4:18', date: '2012', link: 'https://open.spotify.com' },
    { id: 'gm-7', title: 'Lose Yourself', artist: 'Eminem', duration: '5:26', date: '2002', link: 'https://open.spotify.com' },
    { id: 'gm-8', title: 'Don’t You Worry Child', artist: 'Swedish House Mafia', duration: '3:32', date: '2012', link: 'https://open.spotify.com' },
    { id: 'gm-9', title: 'Remember the Name', artist: 'Fort Minor', duration: '3:50', date: '2005', link: 'https://open.spotify.com' },
    { id: 'gm-10', title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:04', date: '1982', link: 'https://open.spotify.com' },
  ],
  'golden-hour': [
    { id: 'gh-1', title: 'Pink + White', artist: 'Frank Ocean', duration: '3:04', date: '2016', link: 'https://open.spotify.com' },
    { id: 'gh-2', title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:57', date: '2015', link: 'https://open.spotify.com' },
    { id: 'gh-3', title: 'golden hour', artist: 'JVKE', duration: '3:29', date: '2022', link: 'https://open.spotify.com' },
    { id: 'gh-4', title: 'Redbone', artist: 'Childish Gambino', duration: '5:26', date: '2016', link: 'https://open.spotify.com' },
    { id: 'gh-5', title: 'Electric Feel', artist: 'MGMT', duration: '3:49', date: '2007', link: 'https://open.spotify.com' },
    { id: 'gh-6', title: 'Location', artist: 'Khalid', duration: '3:39', date: '2017', link: 'https://open.spotify.com' },
    { id: 'gh-7', title: 'Best Part', artist: 'Daniel Caesar, H.E.R.', duration: '3:29', date: '2017', link: 'https://open.spotify.com' },
    { id: 'gh-8', title: 'Japanese Denim', artist: 'Daniel Caesar', duration: '4:30', date: '2016', link: 'https://open.spotify.com' },
    { id: 'gh-9', title: 'Peach', artist: 'Kevin Abstract', duration: '2:56', date: '2019', link: 'https://open.spotify.com' },
    { id: 'gh-10', title: 'Sunflower', artist: 'Rex Orange County', duration: '4:12', date: '2017', link: 'https://open.spotify.com' },
    { id: 'gh-11', title: 'Warm Thoughts', artist: 'Flume', duration: '3:48', date: '2012', link: 'https://open.spotify.com' },
    { id: 'gh-12', title: 'So Good At Being In Trouble', artist: 'Unknown Mortal Orchestra', duration: '3:50', date: '2013', link: 'https://open.spotify.com' },
  ],
};

function normalizeSong(song: SongInput, index: number): NormalizedTrack {
  const title =
    ('title' in song && song.title) ||
    ('name' in song && song.name) ||
    `Track ${index + 1}`;

  const artist =
    ('artist' in song && song.artist) ||
    ('author' in song && song.author) ||
    'Unknown Artist';

  let duration = '3:30';
  if ('duration' in song && song.duration) {
    duration = song.duration;
  } else if ('date' in song && song.date && /^\d+:\d+$/.test(song.date)) {
    duration = song.date;
  }

  const date = ('date' in song && song.date) || '2026';
  const link = ('link' in song && song.link) || null;
  const id = ('id' in song && song.id !== undefined) ? song.id : `track-${index + 1}`;

  return { id, title, artist, duration, date, link };
}

function parseDurationSeconds(dur: string): number {
  const parts = dur.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 210;
}

function formatTotalTime(tracks: NormalizedTrack[]): string {
  const totalSec = tracks.reduce((acc, t) => acc + parseDurationSeconds(t.duration), 0);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

export default function PlaylistDetails({
  initialPlaylist,
  playlistId,
  playlist: passedPlaylist,
  song: passedSongSingle,
  songs: passedSongPlural,
}: PlaylistDetailsProps = {}) {
  // Support initial lookup similar to MyPlaylists({ initialPlaylist })
  const defaultMock = samplePlaylists.find(
    (p) =>
      p.id === initialPlaylist ||
      p.id === String(playlistId) ||
      p.title.toLowerCase() === String(initialPlaylist).toLowerCase(),
  ) || samplePlaylists[0];

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(
    passedPlaylist && 'id' in passedPlaylist ? String(passedPlaylist.id) : defaultMock.id,
  );

  // Active playlist information
  const activeMockup = samplePlaylists.find((p) => p.id === selectedPlaylistId) || defaultMock;

  const playlistTitle =
    (passedPlaylist && (('title' in passedPlaylist && passedPlaylist.title) || ('name' in passedPlaylist && passedPlaylist.name))) ||
    activeMockup.title;

  const playlistCategory =
    (passedPlaylist && 'category' in passedPlaylist && passedPlaylist.category) ||
    activeMockup.category ||
    'Campus Mix';

  const playlistCreator =
    (passedPlaylist && (('creator' in passedPlaylist && passedPlaylist.creator) || ('author' in passedPlaylist && passedPlaylist.author))) ||
    activeMockup.creator;

  const playlistUsername =
    (passedPlaylist && 'username' in passedPlaylist && passedPlaylist.username) ||
    activeMockup.username;

  const playlistDescription =
    (passedPlaylist && 'description' in passedPlaylist && passedPlaylist.description) ||
    activeMockup.description;

  const playlistArt =
    (passedPlaylist && 'art' in passedPlaylist && passedPlaylist.art) ||
    activeMockup.art ||
    'study';

  const playlistCaption =
    (passedPlaylist && 'caption' in passedPlaylist && passedPlaylist.caption) ||
    activeMockup.caption ||
    'UH MĀNOA SELECTS';

  // Resolve songs list from props or sample data
  const rawSongList = useMemo(() => {
    if (passedSongPlural && passedSongPlural.length > 0) return passedSongPlural;
    if (passedSongSingle && passedSongSingle.length > 0) return passedSongSingle;
    if (passedPlaylist && 'songs' in passedPlaylist && Array.isArray(passedPlaylist.songs) && passedPlaylist.songs.length > 0) {
      return passedPlaylist.songs;
    }
    // Check rich sample dictionary
    if (samplePlaylistTracks[selectedPlaylistId]) {
      return samplePlaylistTracks[selectedPlaylistId];
    }
    // Fall back to mockup songs
    return activeMockup.songs;
  }, [passedSongPlural, passedSongSingle, passedPlaylist, selectedPlaylistId, activeMockup.songs]);

  const allTracks: NormalizedTrack[] = useMemo(() => {
    return rawSongList.map((item, index) => normalizeSong(item, index));
  }, [rawSongList]);

  // UI state variables matching MyPlaylists and Leaderboard
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'track' | 'title' | 'artist' | 'duration'>('track');
  const [likes, setLikes] = useState<number>(
    (passedPlaylist && passedPlaylist.likes !== undefined ? passedPlaylist.likes : activeMockup.likes) || 12,
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string | number>>(new Set());
  const [playingTrack, setPlayingTrack] = useState<NormalizedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Modals & sharing matching MyPlaylists
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [copyError, setCopyError] = useState(false);
  const [noticeModal, setNoticeModal] = useState<string | null>(null);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/my-playlists?playlist=${selectedPlaylistId}`
    : `https://bowz-bops.uh.edu/my-playlists?playlist=${selectedPlaylistId}`;

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
      setShareMessage(instructions || 'Could not copy automatically. Please copy the link above.');
    }
  };

  const toggleLikePlaylist = () => {
    if (isLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const toggleSavePlaylist = () => {
    setIsSaved((prev) => !prev);
  };

  const toggleLikeTrack = (id: string | number) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePlayTrack = (track: NormalizedTrack) => {
    if (playingTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingTrack(track);
      setIsPlaying(true);
    }
  };

  // Filter & sort tracks
  const filteredTracks = useMemo(() => {
    let result = allTracks.filter((t) =>
      `${t.title} ${t.artist} ${t.date || ''}`.toLowerCase().includes(query.toLowerCase()),
    );

    if (sort === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'artist') {
      result = [...result].sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sort === 'duration') {
      result = [...result].sort((a, b) => parseDurationSeconds(b.duration) - parseDurationSeconds(a.duration));
    }
    return result;
  }, [allTracks, query, sort]);

  const totalDurationText = formatTotalTime(allTracks);

  // Construct mock playlist object for AlbumArt
  const currentAlbumArtPlaylist: MockupPlaylist = {
    ...activeMockup,
    title: playlistTitle,
    category: playlistCategory,
    creator: playlistCreator,
    art: playlistArt,
    caption: playlistCaption,
  };

  return (
    <main className="music-page" id="playlist-details-page">
      <div className="music-container">
        {/* Navigation breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <Link className="text-music-link" href="/my-playlists">
            ← Back to My Playlists
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link className="text-music-link" href="/leaderboard">
              View Leaderboard <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Page Intro matching MyPlaylists / Leaderboard style */}
        <div className="page-intro">
          <div>
            <p className="eyebrow">BOWZ BOPS ROTATION · COMPLETE TRACKLIST</p>
            <h1>
              {playlistTitle} <span>Songs</span>
              <span className="title-dot">.</span>
            </h1>
          </div>
          <span className="preview-badge">
            <span /> {allTracks.length} tracks · {totalDurationText}
          </span>
        </div>

        {/* Playlist Hero / Banner */}
        <section className="profile-banner" aria-label={`${playlistTitle} overview`}>
          <div className="profile-topline">
            <span>
              <span className="tiny-star">✳</span> MADE OF MUSIC. ROOTED IN MĀNOA.
            </span>
            <span>EST. 2026</span>
          </div>

          <div className="profile-main flex-wrap">
            <div style={{ width: '160px', flexShrink: 0 }}>
              <AlbumArt playlist={currentAlbumArtPlaylist} small={false} />
            </div>

            <div className="profile-copy">
              <span className="category-pill mb-2">{playlistCategory}</span>
              <h2>{playlistTitle}</h2>
              <p>
                Curated by{' '}
                <Link className="creator-profile-link" href={`/profiles/${encodeURIComponent(playlistUsername)}`}>
                  {playlistCreator}
                </Link>{' '}
                <span className="muted">@{playlistUsername}</span>
              </p>
              <p className="muted" style={{ maxWidth: '620px' }}>
                {playlistDescription}
              </p>

              <div className="profile-stats">
                <span>
                  <strong>{allTracks.length}</strong> songs
                </span>
                <span>
                  <strong>{totalDurationText}</strong> length
                </span>
                <span>
                  <strong>{likes}</strong> likes
                </span>
              </div>

              {/* Action buttons matching MyPlaylists / Leaderboard */}
              <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                <button
                  className={`primary-music-button ${isLiked ? 'btn-success' : ''}`}
                  onClick={toggleLikePlaylist}
                  aria-label={isLiked ? 'Unlike playlist' : 'Like playlist'}
                >
                  {isLiked ? <HeartFill /> : <Heart />} {isLiked ? 'Liked' : 'Like'} ({likes})
                </button>

                <button
                  className="primary-music-button"
                  style={{ background: '#415e4f', borderColor: '#415e4f' }}
                  onClick={() => setShareOpen(true)}
                >
                  <Share /> Share Playlist
                </button>

                <button
                  className="primary-music-button"
                  style={{ background: isSaved ? '#274b36' : '#eff2e6', color: isSaved ? '#fff' : '#274b36', borderColor: '#d3dcce' }}
                  onClick={toggleSavePlaylist}
                  aria-label={isSaved ? 'Remove from saved' : 'Save playlist'}
                >
                  {isSaved ? <><BookmarkCheckFill /> Saved</> : <><Bookmark /> Save</>}
                </button>
              </div>
            </div>
          </div>

          <div className="banner-record" aria-hidden="true">
            <span />
          </div>
        </section>

        {/* Now Playing Bar (Interactive Audio Simulator) */}
        {playingTrack && (
          <aside
            className="chart-cta mt-4 p-3 d-flex align-items-center justify-content-between flex-wrap"
            role="region"
            aria-label="Now playing preview"
            style={{ background: '#eef2e3', border: '1px solid #d4dfcb' }}
          >
            <div className="d-flex align-items-center gap-3">
              <button
                className="primary-music-button p-2"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause preview' : 'Resume preview'}
              >
                {isPlaying ? <PauseFill size={20} /> : <PlayFill size={20} />}
              </button>
              <div>
                <span className="eyebrow" style={{ color: '#4d693f', display: 'block', marginBottom: '2px' }}>
                  {isPlaying ? 'NOW PLAYING PREVIEW' : 'PAUSED'}
                </span>
                <strong style={{ fontSize: '15px', color: '#173c30' }}>{playingTrack.title}</strong>
                <span className="muted ms-2">— {playingTrack.artist}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="category-pill">{playingTrack.duration}</span>
              {playingTrack.link && (
                <a
                  href={playingTrack.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-music-link"
                  title="Open in streaming service"
                >
                  Open Stream <BoxArrowUpRight size={13} />
                </a>
              )}
              <Button variant="link" size="sm" className="text-muted p-0" onClick={() => setPlayingTrack(null)}>
                Dismiss
              </Button>
            </div>
          </aside>
        )}

        {/* Tracklist Section */}
        <section className="playlist-section" aria-labelledby="tracklist-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURATED TRACKS</p>
              <h2 id="tracklist-heading">
                All Songs <span className="count-badge">{filteredTracks.length}</span>
              </h2>
              <p>Full list of tracks in this playlist rotation.</p>
            </div>
            <button className="primary-music-button" onClick={() => setNoticeModal('Add Song')}>
              <Plus size={21} /> Add Song
            </button>
          </div>

          {/* Library Toolbar matching MyPlaylists */}
          <div className="library-toolbar">
            <label className="library-search">
              <Search />
              <input
                aria-label="Search songs in playlist"
                placeholder="Find a song by title or artist…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <label className="sort-control">
              Sort by{' '}
              <select
                aria-label="Sort songs in playlist"
                value={sort}
                onChange={(e) => setSort(e.target.value as 'track' | 'title' | 'artist' | 'duration')}
              >
                <option value="track">Track order</option>
                <option value="title">Song title (A–Z)</option>
                <option value="artist">Artist (A–Z)</option>
                <option value="duration">Duration (longest)</option>
              </select>
            </label>
          </div>

          {/* Full Song Table matching Leaderboard chart-table design */}
          <div className="chart-table-wrap">
            <table className="chart-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '56px' }}>#</th>
                  <th scope="col">Track / Artist</th>
                  <th scope="col" className="category-column">Year / Date</th>
                  <th scope="col" className="songs-column"><Clock size={12} className="me-1" /> Duration</th>
                  <th scope="col">Stream</th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    <span className="visually-hidden">Favorite</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, idx) => {
                  const isCurrent = playingTrack?.id === track.id && isPlaying;
                  const isFavorited = likedTrackIds.has(track.id);

                  return (
                    <tr key={String(track.id)} style={isCurrent ? { background: '#f5f7ed' } : undefined}>
                      <td>
                        <button
                          className="table-playlist-cover play-track-btn"
                          onClick={() => togglePlayTrack(track)}
                          aria-label={isCurrent ? `Pause ${track.title}` : `Play ${track.title}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            color: isCurrent ? '#255038' : '#73836d',
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          {isCurrent ? <PauseFill size={16} /> : <PlayFill size={16} />}
                          <span className="table-rank ms-1">{String(idx + 1).padStart(2, '0')}</span>
                        </button>
                      </td>

                      <td>
                        <div className="table-playlist">
                          <span>
                            <strong style={{ color: isCurrent ? '#1d4834' : '#274d36' }}>
                              {track.title}
                            </strong>
                            <span>{track.artist}</span>
                          </span>
                        </div>
                      </td>

                      <td className="category-column">
                        <span className="category-pill">{track.date || '2026'}</span>
                      </td>

                      <td className="songs-column" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {track.duration}
                      </td>

                      <td>
                        {track.link ? (
                          <a
                            href={track.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-music-link"
                            title={`Listen to ${track.title}`}
                          >
                            Listen <ArrowUpRight size={12} />
                          </a>
                        ) : (
                          <span className="muted" style={{ fontSize: '11px' }}>Audio track</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`like-control ${isFavorited ? 'is-liked' : ''}`}
                          aria-label={isFavorited ? `Unlike ${track.title}` : `Like ${track.title}`}
                          aria-pressed={isFavorited}
                          onClick={() => toggleLikeTrack(track.id)}
                        >
                          {isFavorited ? <HeartFill /> : <Heart />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty search results state matching MyPlaylists */}
          {!filteredTracks.length && (
            <div className="empty-library mt-3">
              <Disc />
              <h3>No songs found</h3>
              <p>Try searching for a different song title or artist name.</p>
              <button onClick={() => setQuery('')}>Clear search</button>
            </div>
          )}
        </section>

        {/* Switch Playlist Section (Allow user to browse tracklists of other playlists) */}
        <section className="playlist-section saved-section mt-5" aria-labelledby="other-playlists-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE OTHER MIXES</p>
              <h2 id="other-playlists-heading">Other Campus Playlists</h2>
              <p>Check out the full song selections of other student favorites.</p>
            </div>
            <Link className="text-music-link" href="/leaderboard">
              View all on Leaderboard <ArrowRight />
            </Link>
          </div>

          <div className="category-tabs" role="group" aria-label="Switch playlist selection">
            {samplePlaylists.map((p) => (
              <button
                key={p.id}
                className={p.id === selectedPlaylistId ? 'selected' : ''}
                onClick={() => {
                  setSelectedPlaylistId(p.id);
                  setQuery('');
                  setPlayingTrack(null);
                }}
              >
                <span>◎</span> {p.title}
              </button>
            ))}
          </div>
        </section>

        {/* Bottom CTA & Community signature matching Leaderboard & MyPlaylists */}
        <aside className="chart-cta mt-5">
          <div>
            <span className="eyebrow">UH MĀNOA COMMUNITY SOUNDTRACK</span>
            <h2>Have songs to add or want to make your own mix?</h2>
          </div>
          <Link className="primary-music-button" href="/my-playlists">
            Create Playlist <ArrowRight />
          </Link>
          <ArrowDownRight className="cta-arrow" aria-hidden="true" />
        </aside>

        <div className="collection-end">
          <Headphones />
          <p>Good music is better together.</p>
          <span>SHARE A LITTLE OF YOUR WORLD.</span>
        </div>

        <p className="demo-note">
          Bowz Bops playlist detail view. Sample tracks, mock streams, and campus selections for M1 preview.
        </p>
      </div>

      {/* Share Modal matching MyPlaylists */}
      <Modal show={shareOpen} onHide={() => setShareOpen(false)} centered contentClassName="music-modal">
        <Modal.Header closeButton>
          <Modal.Title>Share {playlistTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="share-link-input">Playlist share link</Form.Label>
          <Form.Control id="share-link-input" readOnly value={shareUrl} />

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
              href={`https://twitter.com/intent/tweet?${new URLSearchParams({ text: playlistTitle, url: shareUrl })}`}
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
          {copyError && <p className="mt-3 mb-0" role="alert">Select the link above and copy it manually.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShareOpen(false)}>Close</Button>
          <Button className="primary-music-button" onClick={() => copyShareLink()}>
            {copied ? <><Check2 /> Copied!</> : 'Copy Link'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notice Modal matching MyPlaylists / Navbar */}
      <Modal show={!!noticeModal} onHide={() => setNoticeModal(null)} centered contentClassName="music-modal">
        <Modal.Header closeButton>
          <Modal.Title>{noticeModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will open the {noticeModal} flow once database integration is active. You can browse all songs in the current preview.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setNoticeModal(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
