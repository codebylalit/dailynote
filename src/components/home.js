import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

    // Scroll event for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.removeEventListener("mousemove", cursorTrail);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();

  const goToNotes = () => {
    navigate("/notes");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <section className="bg-gray-900 text-white min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">DailyNote</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/notes" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200">
              Start Writing
            </Link>
            {user ? (
              <button
                onClick={goToDashboard}
                className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
              >
                My Notes
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={goToLogin}
                  className="text-gray-300 hover:text-yellow-500 transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={goToRegister}
                  className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-yellow-500 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 shadow-lg border-t border-gray-700">
            <div className="px-6 py-4 space-y-4">
              <Link to="/notes" className="block text-gray-300 hover:text-yellow-500 transition-colors duration-200">
                Start Writing
              </Link>
              {user ? (
                <button
                  onClick={goToDashboard}
                  className="w-full bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
                >
                  My Notes
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={goToLogin}
                    className="w-full text-gray-300 hover:text-yellow-500 transition-colors duration-200 text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={goToRegister}
                    className="w-full bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center mt-28 max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              No account required to start
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your thoughts,
            <br />
            <span className="text-yellow-500">organized simply</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A clean, fast, and beautiful note-taking app that helps you capture ideas and stay organized.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={goToNotes}
              className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Writing Now
            </button>
            {!user && (
              <button
                onClick={goToRegister}
                className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-500 hover:text-gray-900 transition-all duration-200"
              >
                Sign Up for Cloud Sync
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose DailyNote?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built for simplicity and productivity, with your privacy in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">
                Write and organize your notes instantly. No loading times, no delays - just pure productivity.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Private</h3>
              <p className="text-gray-300 leading-relaxed">
                Your notes stay on your device. No cloud storage, no data collection - complete privacy.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cloud Sync (Optional)</h3>
              <p className="text-gray-300 leading-relaxed">
                Sign up to sync your notes across all devices. Your choice - local or cloud storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-300">
              Get started in seconds, no matter your preference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Quick Start</h3>
              <p className="text-gray-300 mb-6">
                Click "Start Writing" and begin immediately. No account required, no setup needed.
              </p>
              <button
                onClick={goToNotes}
                className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
              >
                Start Writing
              </button>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cloud Sync</h3>
              <p className="text-gray-300 mb-6">
                Sign up for free to sync your notes across all your devices and never lose your ideas.
              </p>
              <button
                onClick={goToRegister}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2024 DailyNote. Made with ❤️ for better note-taking.
        </p>
      </footer>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-200 z-50"
          aria-label="Scroll to top"
        >
          ↑ Top
        </button>
      )}
    </section>
  );
};

export default Home;
