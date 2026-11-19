import type { Metadata } from 'next';
import DiscoverPlaylist from '@/components/DiscoverPlaylist';
import '@/components/music/playlist-profile.css';
import '@/components/music/leaderboard.css';
import '@/components/music/my-playlists.css';

export const metadata: Metadata = {
  title: 'Discover Playlists · Bowz Bops',
  description: 'Explore popular UH Mānoa campus playlists organized by category and mood.',
};

export default function DiscoverPage() {
  return <DiscoverPlaylist />;
}
