export const Header = () => {
    return (
      <header className="bg-white shadow-md fixed w-full top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Đã đổi <Link> thành <a> */}
          <a href="#" className="flex items-center space-x-2">
            {/* Đã đổi <Image> thành <img> */}
            <img src="https://placehold.co/100x24/000000/FFFFFF?text=Logo" alt="Logo" width="100" height="24" />
            <span className="text-xl font-bold text-gray-800">Academic Portal</span>
          </a>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Profile</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Logout</a>
          </nav>
        </div>
      </header>
    );
  }