import type { Metadata } from 'next';
import PlaylistDetails from '@/components/PlaylistDetails';
import '@/components/music/playlist-profile.css';
import '@/components/music/leaderboard.css';
import '@/components/music/my-playlists.css';

export const metadata: Metadata = {
  title: 'Playlist Details · Bowz Bops',
  description: 'View the full song list, tracks, and credits of UH Mānoa campus playlists.',
};

export default async function PlaylistDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ playlist?: string; id?: string }>;
}) {
  const params = await searchParams;
  return <PlaylistDetails initialPlaylist={params.playlist || params.id} />;
}
