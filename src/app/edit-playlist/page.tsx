import type { Metadata } from 'next';
import EditPlaylistForm from '@/components/music/EditPlaylistForm';
import '@/components/music/music.css';

export const metadata: Metadata = { 
  title: 'Edit Playlist · Bowz Bops', 
  description: 'Edit an existing playlist.' 
};

export const EDIT_PLAYLIST_PATH = '/edit-playlist';

export default function EditPlaylistPage() {
  return <EditPlaylistForm />;
}