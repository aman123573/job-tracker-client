import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex gap-6 font-medium">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/stats"
          className="text-blue-600 hover:text-blue-800 transition"
        >
          Stats
        </Link>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition text-sm font-medium"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
