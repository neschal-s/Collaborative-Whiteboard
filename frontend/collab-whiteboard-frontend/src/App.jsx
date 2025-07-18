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

const server = "http://127.0.0.1:5000";
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
    socket.on("userJoinedMessageBroadcast", (data) => {toast.info(`${data} joined the room`); });
  
    socket.on("userLeftMessageBroadcast", (data) => toast.info(`${data} left the room` ));
 
    return () => {
      socket.off("userIsJoined");
      socket.off("allUsers");
      socket.off("userLeftMessageBroadcast");
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
          <div className="container-fluid min-vh-100">
            <ToastContainer />
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
          <ToastContainer/>
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Forms uuid={uuid} socket={socket} setUser={setUser} />
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
