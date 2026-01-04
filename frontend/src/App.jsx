import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './pages/about';
import Contact from './pages/contact';
import Events from './pages/events';
import Home from './pages/home';
import Programs from './pages/programs';
import Profile from './pages/profile';
import AdminDashboard from './pages/admin';
import ResetPassword from './pages/ResetPassword';

// Import Tailwind CSS
import './index.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
