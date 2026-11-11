'use client';

import { usePathname } from 'next/navigation';
import { Col, Container } from 'react-bootstrap';

const Footer = () => {
  const path = usePathname();
  if (path === '/my-playlists' || path === '/leaderboard') return <footer className="mt-auto music-footer"><div className="music-footer-inner"><div><strong>Bowz Bops ✳</strong> The sound of our campus.</div><span>Made for the UH Mānoa community · ICS 314</span><a href="https://bowz-bops.github.io/">About the project ↗</a></div></footer>;
  return <footer className="mt-auto py-3 bg-light"><Container><Col className="text-center">Department of Information and Computer Sciences<br />University of Hawaii<br />Honolulu, HI 96822<br /><a href="http://ics-software-engineering.github.io/nextjs-application-template">Template Home Page</a></Col></Container></footer>;
};
export default Footer;
