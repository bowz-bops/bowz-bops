'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Modal, Button } from 'react-bootstrap';
import { BoxArrowRight, Headphones, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import './music/music.css';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [plannedPage, setPlannedPage] = useState('');
  const currentUser = session?.user?.email;
  const role = session?.user?.role;
  const usesMusicNavbar = pathName === '/' || pathName === '/my-playlists' || pathName === '/leaderboard'
    || pathName.startsWith('/profiles/');
  if (!usesMusicNavbar) return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Next.js Application Template</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
            <Nav.Link href="/my-playlists">My Playlists</Nav.Link>
            {currentUser && (
              <>
                <Nav.Link id="add-stuff-nav" href="/add" active={pathName === '/add'}>
                  Add Stuff
                </Nav.Link>
                <Nav.Link id="list-stuff-nav" href="/list" active={pathName === '/list'}>
                  List Stuff
                </Nav.Link>
              </>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'}>
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
  return (
    <>
      <Navbar expand="lg" className="music-navbar" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/"><span className="brand-mark"><Headphones /></span>Bowz Bops<span style={{ color: '#efd477' }}>✳</span></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as="button" onClick={() => setPlannedPage('Discover Playlists')}>Discover</Nav.Link>
              <Nav.Link as="button" onClick={() => setPlannedPage('Create Playlist')}>Create Playlist</Nav.Link>
              <Nav.Link href="/leaderboard" active={pathName === '/leaderboard'}>Leaderboard</Nav.Link>
              <Nav.Link href="/my-playlists" active={pathName === '/my-playlists'}>My Playlists</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown id="login-dropdown" title={<><PersonFill /> {session ? (session.user?.name === currentUser ? currentUser?.split('@')[0] : session.user?.name || 'Account') : 'Sign In'}</>}>
                {session ? <>
                  <NavDropdown.Item href="/my-playlists">My profile & playlists</NavDropdown.Item>
                  <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout"><BoxArrowRight />Sign Out</NavDropdown.Item>
                  <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password"><Lock />Change Password</NavDropdown.Item>
                  <NavDropdown.Divider /><NavDropdown.Header>Template tools</NavDropdown.Header>
                  <NavDropdown.Item id="add-stuff-nav" href="/add">Add Stuff</NavDropdown.Item>
                  <NavDropdown.Item id="list-stuff-nav" href="/list">List Stuff</NavDropdown.Item>
                  {role === 'ADMIN' && <NavDropdown.Item id="admin-stuff-nav" href="/admin">Admin</NavDropdown.Item>}
                </> : <>
                  <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin"><PersonFill />Sign in</NavDropdown.Item>
                  <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup"><PersonPlusFill />Sign up</NavDropdown.Item>
                </>}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={!!plannedPage} onHide={() => setPlannedPage('')} centered contentClassName="music-modal"><Modal.Header closeButton><Modal.Title>{plannedPage}</Modal.Title></Modal.Header><Modal.Body>{plannedPage === 'Create Playlist' ? 'This will link to the Create Playlist page once it’s ready.' : <><p>This page is a separate team mockup and is still on its way.</p><p className="muted">You can explore sample playlists and try the profile controls on My Playlists.</p></>}</Modal.Body><Modal.Footer><Button variant="light" onClick={() => setPlannedPage('')}>Close</Button>{plannedPage !== 'Create Playlist' && <Button href="/my-playlists" className="primary-music-button">Go to My Playlists</Button>}</Modal.Footer></Modal>
    </>
  );
};
export default NavBar;
