import { Col, Container, Button, Row } from 'react-bootstrap';

/** The Home page. 
  AI Usage Note: The background image on this page was generated with AI 
*/
const Home = () => (
  <main id="landing-page">
    <Container fluid className="py-3">
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center pt-5">
          <h2>Welcome to</h2>
          <h1>Bowz Bops</h1>
          <p>A place to share and discover playlists</p>
          <p>that UH Mānoa students are listening to!</p>
        </Col>
      </Row>
      <Row>
        <Col xs={5}></Col>
        <Col xs={1}>
          <Button href="auth/signin" variant='outline-info'>Sign In</Button>
        </Col>
        <Col xs={2}>
          <Button href="auth/signup" variant='outline-info'>Create Account</Button>
        </Col>
        <Col xs={5}></Col>
      </Row>
    </Container>
  </main>
);

export default Home;
