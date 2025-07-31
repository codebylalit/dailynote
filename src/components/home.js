import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = ({ user }) => {
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

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <section className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <header className="flex justify-between w-full px-8 py-6">
        <div className="relative flex items-center space-x-4">
          <div className="absolute -left-0 w-14 h-14 rounded-full bg-yellow-500 z-0"></div>
          <h1 className="text-3xl font-bold text-white relative z-10">
            DailyNote
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
            {user ? (
              <li>
                <button
                  onClick={goToDashboard}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold"
                >
                  Dashboard
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={goToLogin}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold"
                  >
                    Log in
                  </button>
                </li>
                <li>
                  <button
                    onClick={goToRegister}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold"
                  >
                    Sign up
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <nav
        className={`sm:hidden ${
          isMenuOpen ? "block" : "hidden"
        } w-full bg-white/10 backdrop-blur-lg border-b border-white/20 text-white p-4`}
      >
        <ul className="flex flex-col space-y-4">
          {user ? (
            <li>
              <button
                onClick={goToDashboard}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold w-full"
              >
                Dashboard
              </button>
            </li>
          ) : (
            <>
              <li>
                <button
                  onClick={goToLogin}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold w-full"
                >
                  Log in
                </button>
              </li>
              <li>
                <button
                  onClick={goToRegister}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold w-full"
                >
                  Sign up
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="text-center py-24 px-6 max-w-4xl mx-auto">
        {user ? (
          <>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Welcome back to DailyNote!
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Ready to continue organizing your thoughts? Access your notes and
              create new ones.
            </p>
            <button
              onClick={goToDashboard}
              className="bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-yellow-600 transition-all duration-200 font-semibold"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Your notes at your fingertips with DailyNote
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              All your notes, synced on all your devices. Available on iOS,
              Android, Mac, Windows, Linux, or in your browser.
            </p>
            <button
              onClick={goToRegister}
              className="bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-yellow-600 transition-all duration-200 font-semibold"
            >
              Join DailyNote today
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 px-14">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center border border-white/20 hover:border-white/30 transition-all duration-200">
          <div className="text-4xl text-yellow-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Simple and Fast
          </h3>
          <p className="text-gray-300">
            Get started quickly and keep your notes organized effortlessly.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center border border-white/20 hover:border-white/30 transition-all duration-200">
          <div className="text-4xl text-yellow-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">Secure</h3>
          <p className="text-gray-300">
            Your notes are encrypted and kept safe in the cloud.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center border border-white/20 hover:border-white/30 transition-all duration-200">
          <div className="text-4xl text-yellow-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Syncing Your Notes
          </h3>
          <p className="text-gray-300">
            Access all your notes across any device.
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          &copy; 2024 DailyNote. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default Home;
