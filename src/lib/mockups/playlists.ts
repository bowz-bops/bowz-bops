/** Shared fictional content for the M1 mockups; no database records are changed. */
export type Playlist = {
  id: string;
  title: string;
  category: string;
  creator: string;
  username: string;
  songCount: number;
  likes: number;
  duration: string;
  art: string;
  caption: string;
  description: string;
  songs: { title: string; artist: string; duration: string }[];
};

export const categories = ['All playlists', 'Studying', 'Beach', 'Workout', 'Chill', 'Party'];
export const playlists: Playlist[] = [
  { id: 'study-session', title: 'Study Session', category: 'Studying', creator: 'Katrina', username: 'katrina', songCount: 12, likes: 8, duration: '42 min', art: 'study', caption: 'ONE MORE CHAPTER', description: 'Soft beats, open books, and a little motivation. Your soundtrack for the Hamilton Library late shift.', songs: [{ title: 'Aruarian Dance', artist: 'Nujabes', duration: '4:10' }, { title: 'A Walk', artist: 'Tycho', duration: '5:16' }, { title: 'Weightless', artist: 'Marconi Union', duration: '8:09' }] },
  { id: 'beach-day', title: 'Beach Day', category: 'Beach', creator: 'Katrina', username: 'katrina', songCount: 15, likes: 5, duration: '54 min', art: 'beach', caption: 'SALT IN THE AIR', description: 'Windows down on the way to the North Shore. A little sunshine for wherever you are.', songs: [{ title: 'Amber', artist: '311', duration: '3:28' }, { title: 'Better Together', artist: 'Jack Johnson', duration: '3:27' }, { title: 'Island in the Sun', artist: 'Weezer', duration: '3:20' }] },
  { id: 'gym-mix', title: 'Gym Mix', category: 'Workout', creator: 'Katrina', username: 'katrina', songCount: 10, likes: 6, duration: '36 min', art: 'gym', caption: 'FIND YOUR TEMPO', description: 'For that last set you almost skipped. Turn it up and keep moving.', songs: [{ title: 'Stronger', artist: 'Kanye West', duration: '5:12' }, { title: 'Titanium', artist: 'David Guetta, Sia', duration: '4:05' }, { title: 'Levels', artist: 'Avicii', duration: '3:19' }] },
  { id: 'golden-hour', title: 'Golden Hour', category: 'Chill', creator: 'Leilani', username: 'leilani', songCount: 18, likes: 128, duration: '1 hr 8 min', art: 'sunset', caption: 'STAY A LITTLE LONGER', description: 'A sunset at Magic Island, in playlist form. Warm sounds for slowing down.', songs: [{ title: 'Pink + White', artist: 'Frank Ocean', duration: '3:04' }, { title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:57' }, { title: 'golden hour', artist: 'JVKE', duration: '3:29' }] },
  { id: 'north-shore', title: 'North Shore Radio', category: 'Beach', creator: 'Kai', username: 'kai', songCount: 24, likes: 96, duration: '1 hr 26 min', art: 'ocean', caption: 'GOOD WAVES ONLY', description: 'Easy island favorites for the long way home. No rush, just good waves.', songs: [{ title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole', duration: '5:08' }, { title: 'Banana Pancakes', artist: 'Jack Johnson', duration: '3:12' }, { title: 'Waves', artist: 'Mr. Probz', duration: '3:28' }] },
  { id: 'after-hours', title: 'After Hours', category: 'Party', creator: 'Maya', username: 'maya', songCount: 20, likes: 84, duration: '1 hr 12 min', art: 'night', caption: 'THE NIGHT IS YOUNG', description: 'The group chat said one more song. A weekend rotation worth sharing.', songs: [{ title: 'One More Time', artist: 'Daft Punk', duration: '5:20' }, { title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' }, { title: 'Midnight City', artist: 'M83', duration: '4:03' }] },
  { id: 'library-loops', title: 'Library Loops', category: 'Studying', creator: 'Noah', username: 'noah', songCount: 16, likes: 72, duration: '58 min', art: 'loops', caption: 'DO NOT DISTURB', description: 'Headphones on. Everything else off. Instrumental favorites for getting in the zone.', songs: [{ title: 'Feather', artist: 'Nujabes', duration: '2:55' }, { title: 'First Breath After Coma', artist: 'Explosions in the Sky', duration: '9:33' }, { title: 'Awake', artist: 'Tycho', duration: '4:43' }] },
];
export const ownedPlaylists = playlists.filter((playlist) => playlist.username === 'katrina');
export const savedPlaylists = playlists.filter((playlist) => ['golden-hour', 'north-shore', 'after-hours'].includes(playlist.id));
