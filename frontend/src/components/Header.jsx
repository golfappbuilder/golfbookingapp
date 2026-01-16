import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">&#9971;</span>
          Breakfast Ball
        </Link>
        <nav className="nav">
          <Link to="/">Plan a Trip</Link>
          <Link to="/courses">Browse Courses</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
