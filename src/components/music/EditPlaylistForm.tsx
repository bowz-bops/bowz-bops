'use client';

import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { ArrowCounterclockwise, Check2, MusicNoteList, Plus, Trash } from 'react-bootstrap-icons';

interface Song {
  id: string;
  name: string;
  artist: string;
  year: string;
  genre: string;
  link?: string;
}

interface EditablePlaylist {
  id: string;
  name: string;
  category: string;
  visibility: string;
  songs: Song[];
}

const DEFAULT_PLAYLIST: EditablePlaylist = {
  id: 'playlist-1',
  name: 'John\'s Bops',
  category: 'Beach',
  visibility: 'Public',
  songs: [
    {
      id: 'song-1',
      name: 'Somewhere over the rainbow',
      artist: 'Iz',
      year: '1993',
      genre: 'Island',
      link: '',
    },
  ],
};

interface EditPlaylistFormProps {
  initialPlaylist?: EditablePlaylist;
}

export default function EditPlaylistForm({
  initialPlaylist = DEFAULT_PLAYLIST,
}: EditPlaylistFormProps) {
  const [playlistName, setPlaylistName] = useState(initialPlaylist.name);
  const [category, setCategory] = useState(initialPlaylist.category);
  const [visibility, setVisibility] = useState(initialPlaylist.visibility);
  const [infoSaved, setInfoSaved] = useState(false);
  const [infoNotice, setInfoNotice] = useState('');

  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [link, setLink] = useState('');

  const [songs, setSongs] = useState<Song[]>(initialPlaylist.songs);

  const handleSavePlaylistInfo = () => {
    if (!playlistName.trim()) {
      setInfoSaved(false);
      setInfoNotice('Please enter a playlist name first.');
      return;
    }

    setInfoSaved(true);
    setInfoNotice(
      `Saved "${playlistName.trim()}" (${category} · ${visibility}).`
    );
  };

  const handleAddSong = () => {
    if (!songName.trim() || !artist.trim()) return;

    const newSong: Song = {
      id: crypto.randomUUID(),
      name: songName.trim(),
      artist: artist.trim(),
      year: year.trim() || 'Unknown',
      genre: genre.trim() || 'General',
      link: link.trim(),
    };

    setSongs((prev) => [...prev, newSong]);
    setSongName('');
    setArtist('');
    setYear('');
    setGenre('');
    setLink('');
  };

  const handleRemoveSong = (id: string) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
  };

  const handleResetChanges = () => {
    setPlaylistName(initialPlaylist.name);
    setCategory(initialPlaylist.category);
    setVisibility(initialPlaylist.visibility);
    setSongs(initialPlaylist.songs);
    setSongName('');
    setArtist('');
    setYear('');
    setGenre('');
    setLink('');
    setInfoSaved(false);
    setInfoNotice('Changes reset to original playlist.');
  };

  const handleFinish = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalName = playlistName.trim() || 'Untitled Playlist';
    alert(`Updated "${finalName}" with ${songs.length} songs!`);
  };

  return (
    <main className="music-page" id="edit-playlist-page">
      <div className="music-container">
        <div className="page-intro">
          <div>
            <p className="eyebrow">TUNE YOUR TRACKLIST</p>
            <h1>
              Edit playlist<span className="title-dot">.</span>
            </h1>
          </div>
          <span className="preview-badge">
            <span /> M1 mockup · sample data
          </span>
        </div>

        <Form onSubmit={handleFinish}>
          {/* Playlist Details */}
          <Card className="mb-4 shadow-sm p-3">
            <Card.Body>
              <h2 className="h3 mb-3">Playlist Details</h2>
              <Row className="g-3 align-items-end">
                <Col xs={12} md={5}>
                  <Form.Group controlId="editPlaylistName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., John's Bops"
                      value={playlistName}
                      onChange={(e) => {
                        setPlaylistName(e.target.value);
                        setInfoSaved(false);
                      }}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group controlId="editPlaylistCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setInfoSaved(false);
                      }}
                    >
                      <option value="Beach">Beach</option>
                      <option value="Indie">Indie</option>
                      <option value="Island">Island / Reggae</option>
                      <option value="Study">Study Beats</option>
                      <option value="Workout">Workout</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={2}>
                  <Form.Group controlId="editPlaylistVisibility">
                    <Form.Label>Visibility</Form.Label>
                    <Form.Select
                      value={visibility}
                      onChange={(e) => {
                        setVisibility(e.target.value);
                        setInfoSaved(false);
                      }}
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={2}>
                  <Button
                    type="button"
                    onClick={handleSavePlaylistInfo}
                    className="primary-music-button w-100"
                  >
                    {infoSaved ? (
                      <>
                        <Check2 size={16} /> Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </Col>
              </Row>

              {infoNotice && (
                <p className="demo-note mt-2 mb-0" role="status">
                  {infoNotice}
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Add Song */}
          <Card className="mb-4 shadow-sm p-3">
            <Card.Body>
              <h2 className="h3 mb-3">Add Song</h2>

              <Row className="g-3 align-items-end mb-3">
                <Col xs={12} md={3}>
                  <Form.Group controlId="editSongName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Song title"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group controlId="editSongArtist">
                    <Form.Label>Artist</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Artist name"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={2}>
                  <Form.Group controlId="editSongYear">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="YYYY"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group controlId="editSongGenre">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={1}>
                  <Button
                    type="button"
                    onClick={handleAddSong}
                    className="primary-music-button w-100"
                    title="Add song to list"
                    aria-label="Add song to list"
                  >
                    <Plus size={20} />
                  </Button>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12}>
                  <Form.Group controlId="editSongLink">
                    <Form.Label>Link (optional)</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://open.spotify.com/track/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />

              <h3 className="h5 mt-3 mb-3">Tracks ({songs.length})</h3>
              <div className="list-group">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <MusicNoteList size={16} aria-hidden="true" />
                      <span>
                      <strong>
                        {index + 1}. {song.name}
                      </strong>{' '}
                      | {song.artist} | {song.year} | {song.genre}
                      </span>
                    </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveSong(song.id)}
                      aria-label={`Remove ${song.name}`}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                {!songs.length && (
                  <p className="text-muted mb-0">No songs in this playlist yet.</p>
                )}
              </div>
            </Card.Body>
          </Card>

          <div className="d-flex flex-wrap gap-3">
            <Button
              type="submit"
              size="lg"
              className="primary-music-button px-5"
            >
              Save
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              type="button"
              onClick={handleResetChanges}
              className="d-inline-flex align-items-center gap-2"
            >
              <ArrowCounterclockwise /> Reset
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}