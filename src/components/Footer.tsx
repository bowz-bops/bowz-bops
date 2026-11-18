'use client';

import { usePathname } from 'next/navigation';
import { Col, Container } from 'react-bootstrap';

const Footer = () => {
  const path = usePathname();
  return <footer className="mt-auto music-footer"><div className="music-footer-inner"><div><strong>Bowz Bops ✳</strong> The sound of our campus.</div><span>Made for the UH Mānoa community · ICS 314</span><a href="https://bowz-bops.github.io/">About the project ↗</a></div></footer>;
  };
export default Footer;
