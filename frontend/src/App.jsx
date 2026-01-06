import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './pages/about';
import Contact from './pages/contact';
import Events from './pages/events';
import Home from './pages/home';
import Programs from './pages/programs';
import Profile from './pages/profile';
import AdminDashboard from './pages/admin';
import MentorDashboard from './pages/MentorDashboard';
import ResetPassword from './pages/ResetPassword';
import Confirmed from './pages/Confirmed';

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
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirmed" element={<Confirmed />} />
      </Routes>
    </Router>
  );
}

export default App;
