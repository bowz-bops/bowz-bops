import type { Metadata } from 'next';
import Leaderboard from '@/components/music/Leaderboard';
import '@/components/music/leaderboard.css';

export const metadata: Metadata = { title: 'Leaderboard · Bowz Bops', description: 'Discover the most loved playlists from the UH Mānoa community.' };
export default function LeaderboardPage() { return <Leaderboard />; }
