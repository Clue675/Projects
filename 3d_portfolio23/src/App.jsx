import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas
} from './components';

const App = () => {
  return (
    <Router>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/works" element={<Works />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Contact />
        <StarsCanvas />
      </div>
    </Router>
  );
};

const Home = () => (
  <>
    <About />
    <Experience />
    <Tech />
    <Works />
    <Feedbacks />
  </>
);

export default App;
