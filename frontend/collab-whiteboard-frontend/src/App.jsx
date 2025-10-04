import './App.css';
import Forms from './components/Forms/';
import { Route, Routes } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from "socket.io-client";
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import Loader from './components/Loader/Loader';
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';



const server = import.meta.env.VITE_BACKEND_URL;
const socket = io(server, {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
});

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? "dark" : "light");
    }
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const location = useLocation();


  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUser(data.user);
        setUsers(data.users);
      }
    });
    socket.on("allUsers", (data) => setUsers(data));
    socket.on("userJoinedMessageBroadcast", (data) => {
      toast.info(`${data} joined the room`, {
        position: "top-right",
        autoClose: 1500,
      })
    });

    socket.on("userLeftMessageBroadcast", (data) => toast.info(`${data} left the room`, {
      position: "top-right",
      autoClose: 1500,
    })
    );

    return () => {
      socket.off("userIsJoined");
      socket.off("allUsers");
      socket.off("userLeftMessageBroadcast");
      socket.off("userJoinedMessageBroadcast");
    };
  }, []);

  const uuid = () => {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <AnimatePresence>
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Loader theme={theme} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container-fluid min-vh-100 flex-column justify-content-center align-items-center">
            <ToastContainer
              position="top-right"
              autoClose={1500}           // match with toast calls or set default here
              closeButton={true}
              closeOnClick={true}
              pauseOnHover={true}
              pauseOnFocusLoss={true}
              draggable={true}
              theme={theme}
            />
            <header className="px-4 pt-3 d-flex flex-column align-items-center position-relative">
              <h1 className="main-heading" style={{
                fontWeight: "700",
                fontSize: "2.5rem",
                fontFamily: "Carien, serif"
              }}>
                COLLABPAD
              </h1>

              <div className="theme-toggle position-absolute top-0 end-0 me-4" style={{ marginTop: ".9rem" }}>
                <input
                  type="checkbox"
                  id="themeSwitch"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
                <label htmlFor="themeSwitch" className="switch">
                  <span className="sun"></span>
                  <span className="moon">🌙</span>
                  <span className="slider" />
                </label>
              </div>
            </header>
            <p className="text-center sub-heading" style={{
              fontSize: "1rem",
              fontFamily: "Carien, serif"
            }}>
              Connect, create, and collaborate seamlessly
            </p>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>

                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Forms uuid={uuid} socket={socket} setUser={setUser} />
                    <footer className="footer">
                      <p>Connect with the developer:</p>
                      <div className="footer-icons">
                        {/* GitHub */}
                        <a
                          href="https://github.com/neschal-s"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.26 1.86 1.26 1.08 1.86 2.83 1.33 3.52 1.02.1-.78.42-1.33.77-1.63-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.25-3.22-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.23 3.3-1.23.66 1.71.24 2.97.12 3.28.78.84 1.25 1.91 1.25 3.22 0 4.6-2.8 5.62-5.48 5.91.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3z" />
                          </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                          href="https://www.linkedin.com/in/neschal-singh/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                          </svg>
                        </a>

                        {/* X (Twitter) */}
                        <a
                          href="https://x.com/neschal_s"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter / X"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        </a>

                        {/* Gmail */}
                        <a
                          href="https://mail.google.com/mail/?view=cm&to=singhneschal@gmail.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Email"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </a>
                      </div>
                    </footer>



                  </motion.div>
                } />
                <Route path="/:roomId" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <RoomPage user={user} socket={socket} users={users} />
                  </motion.div>
                } />
              </Routes>
            </AnimatePresence>
          </div>

        </motion.div>

      )}
    </AnimatePresence>
  );
};

export default App;
