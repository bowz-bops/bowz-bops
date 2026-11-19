'use client';

import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Trash, Plus, Check2, MusicNoteList } from 'react-bootstrap-icons';

interface Song {
  id: number;
  name: string;
  artist: string;
  year: string;
  genre: string;
  link?: string;
}

export default function CreatePlaylistForm() {
  const [playlistName, setPlaylistName] = useState('');
  const [category, setCategory] = useState('Study');
  const [visibility, setVisibility] = useState('Public');
  const[savedInfo, setSavedInfo] = useState(false);
  const [infoNotice, setInfoNotice] = useState('');

  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [link, setLink] = useState('');

   const [songs, setSongs] = useState<Song[]>([
    { id: 1, name: 'Somewhere over the rainbow', artist: 'Iz', year: '1993', genre: 'Island', link: '' }
  ]);
  

  const handleSavePlaylistInfo = () => {
  if (!playlistName.trim()) {
    setSavedInfo(false);
    setInfoNotice('Please enter a playlist name before saving.');
    return;
  }
  setSavedInfo(true);
  setInfoNotice(`Saved "${playlistName.trim()}" (${category} · ${visibility}).`);
}; 

  const handleAddSong = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const handleRemoveSong = (id: number) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
  };

  const handleFinish = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Playlist "${playlistName}" created with ${songs.length} songs!`);
  };

  return (
      <main className="music-page" id="create-playlist-page">
      <div className="music-container">
        <div className="page-intro">
          <div>
            <p className="eyebrow">MAKE YOUR OWN MIX</p>
            <h1>
              Create a new playlist<span className="title-dot">.</span>
            </h1>
          </div>
          <span className="preview-badge">
            <span /> M1 mockup · sample data
          </span>
        </div>
    

        <Form onSubmit={handleFinish}>
          
          {/* Create Playlist Info */}
          <Card className="mb-4 shadow-sm p-3">
            <Card.Body>
              <h2 className="h3 mb-3">Create Playlist</h2>
              <Row className="g-3 align-items-end">
                <Col xs={12} md={5}>
                  <Form.Group controlId="playlistName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      placeholder="e.g., John's Bops"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group controlId="playlistCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                  <Form.Group controlId="playlistVisibility">
                    <Form.Label>Visibility</Form.Label>
                    <Form.Select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
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
                    {savedInfo ? (
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
              <h3 className="mb-3">Add Song</h3>

              {/* Name, Artist, Year, Genre + Enter Button */}
              <Row className="align-items-end mb-3">
                <Col md={3}>
                  <Form.Group controlId="songName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Song title"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId="songArtist">
                    <Form.Label>Artist</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Artist name"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group controlId="songYear">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="YYYY"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId="songGenre">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={1} className="text-end">
                  <Button
                    variant="success"
                    type="button"
                    onClick={handleAddSong}
                    className="primary-music-button"
                    title="Add song to list"
                  >
                    <Plus size={20} />
                  </Button>
                </Col>
              </Row>

              {/* Link (optional) */}
              <Row className="mb-4">
                <Col md={12}>
                  <Form.Group controlId="songLink">
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

              {/* Song Preview List */}
              <h5 className="mt-3 mb-3">Playlist Tracks ({songs.length})</h5>
              <div className="list-group">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>
                        {index + 1}. {song.name}
                      </strong>{' '}
                      | {song.artist} | {song.year} | {song.genre}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveSong(song.id)}
                      aria-label={`Remove ${song.name}`}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                {!songs.length && (
                  <p className="text-muted mb-0">No songs added yet.</p>
                )}
              </div>
            </Card.Body>
          </Card>


          <div>
            <Button variant="primary" type="submit" size="lg" className="primary-music-button">
              Finish
            </Button>
          </div>

        </Form>

      </div>
    </main>
  );
}
