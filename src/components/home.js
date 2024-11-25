import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 


  useEffect(() => {
    const cursorTrail = (e) => {
      const trail = document.createElement("div");
      trail.classList.add("cursor-trail");

      trail.style.left = `${e.pageX}px`;
      trail.style.top = `${e.pageY}px`;

      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 1000);
    };

    document.body.addEventListener("mousemove", cursorTrail);

    return () => {
      document.body.removeEventListener("mousemove", cursorTrail);
    };
  }, []);

  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <section className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <header className="flex justify-between w-full px-8 py-6">
        <div className="relative flex items-center space-x-4">
          <div className="absolute -left-0 w-14 h-14 rounded-full bg-yellow-500 z-0"></div>

          <h1 className="text-3xl font-bold text-white relative z-10">
            Dailynote
          </h1>
        </div>

        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <nav className="hidden sm:flex">
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={goToLogin}
                className="bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base"
              >
                Log in
              </button>
            </li>
            <li>
              <button
                onClick={goToRegister}
                className="bg-yellow-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-yellow-600 text-sm sm:text-base"
              >
                Sign up
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <nav
        className={`sm:hidden ${
          isMenuOpen ? "block" : "hidden"
        } w-full bg-gray-800 text-white p-4`}
      >
        <ul className="flex flex-col space-y-4">
          <li>
            <button
              onClick={goToLogin}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Log in
            </button>
          </li>
          <li>
            <button
              onClick={goToRegister}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
            >
              Sign up
            </button>
          </li>
        </ul>
      </nav>

      <div className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-white">
          Your notes at your fingertips with DailyNote
        </h2>
        <p className="text-xl mb-8 text-gray-400">
          All your notes, synced on all your devices. Available on iOS, Android,
          Mac, Windows, Linux, or in your browser.
        </p>
        <button
          onClick={goToRegister}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-yellow-600"
        >
          Join DailyNote today
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 px-14">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
          <div className="text-4xl text-yellow-500 mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Simple and Fast
          </h3>
          <p className="text-gray-400">
            Get started quickly and keep your notes organized effortlessly.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
          <div className="text-4xl text-yellow-500 mb-4">
            <i className="fas fa-lock"></i>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">Secure</h3>
          <p className="text-gray-400">
            Your notes are encrypted and kept safe in the cloud.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
          <div className="text-4xl text-yellow-500 mb-4">
            <i className="fas fa-share-alt"></i>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Syncing Your Notes
          </h3>
          <p className="text-gray-400">
            Access all your notes across any device.
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          &copy; 2024 Dailynote. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default Home;
