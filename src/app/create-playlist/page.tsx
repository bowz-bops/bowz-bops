import type { Metadata } from 'next';
import CreatePlaylistForm from '@/components/music/CreatePlaylistForm';
import '@/components/music/music.css';

export const metadata: Metadata = { 
  title: 'Create Playlist · Bowz Bops', 
  description: 'Create a new playlist.' 
};

export default function CreatePlaylistPage() {
  return <CreatePlaylistForm />;
}