import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold text-black">
          BUS 
        </Link>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link to="/login" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900">
            LogOut
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
