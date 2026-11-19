'use client';

import { signOut } from 'next-auth/react'; // v5 compatible
import { Button, Col, Row } from 'react-bootstrap';
import '../auth-style.css';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <Col id="signout-page" className="text-center py-3 include-landing-background landing-text-style">
    <h2>Do you want to sign out?</h2>
    <Row>
      <Col xs={4} />
      <Col>
        <Button variant="danger" onClick={() => signOut({ callbackUrl: '/', redirect: true })}>
          Sign Out
        </Button>
      </Col>
      <Col>
        <Button variant="secondary" href="/">
          Cancel
        </Button>
      </Col>
      <Col xs={4} />
    </Row>
  </Col>
);

export default SignOut;
