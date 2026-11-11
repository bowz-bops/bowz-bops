import type { Metadata } from 'next';
import MyPlaylists from '@/components/music/MyPlaylists';
import '@/components/music/music.css';

export const metadata: Metadata = { title: 'My Playlists · Bowz Bops', description: 'Your profile, your playlists, and your favorite campus mixes.' };
export default async function MyPlaylistsPage({ searchParams }: { searchParams: Promise<{ playlist?: string }> }) {
  const params = await searchParams;
  return <MyPlaylists initialPlaylist={params.playlist} />;
}
