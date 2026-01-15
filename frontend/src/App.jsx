import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TripPlanner from './pages/TripPlanner';
import TripResults from './pages/TripResults';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<TripPlanner />} />
          <Route path="/trip-results" element={<TripResults />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
