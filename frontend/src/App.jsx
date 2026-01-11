import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './pages/about';
import Contact from './pages/contact';
import Events from './pages/events';
import Home from './pages/home';
import Programs from './pages/programs';
import ProfilePage from './pages/ProfilePage';
import LearnerDashboard from './pages/LearnerDashboard';
import AdminDashboard from './pages/admin';
import MentorDashboard from './pages/MentorDashboard';
import ResetPassword from './pages/ResetPassword';
import Confirmed from './pages/Confirmed';
import ConfirmEmail from './pages/ConfirmEmail';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/learner-dashboard" element={<LearnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        {/* Payment routes */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
}

export default App;
