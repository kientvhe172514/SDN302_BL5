export const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-4 text-center">
          <p>&copy; {new Date().getFullYear()} Your University Name. All Rights Reserved.</p>
          <div className="mt-2">
            <a href="/contact" className="hover:underline mx-2">Contact</a>
            <a href="/privacy" className="hover:underline mx-2">Privacy Policy</a>
          </div>
        </div>
      </footer>
    );
  }