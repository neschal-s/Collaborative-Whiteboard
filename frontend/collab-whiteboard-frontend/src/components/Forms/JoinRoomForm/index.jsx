import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ uuid, socket, setUser, setFormLoading }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRoomJoin = (e) => {
    e.preventDefault();

    if (!name.trim() || !roomId.trim()) return;

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };
    setFormLoading(true); // Start loader
    setUser(roomData);
    socket.emit("userJoined", roomData);  
  setTimeout(() => {
    navigate(`/${roomId}`);
    setFormLoading(false);
  }, 3000);
  };

  return (
    <form className="form col-md-12 mt-5" onSubmit={handleRoomJoin}>
      <div className="form-group pb-1">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control border rounded my-2"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-5 btn btn-primary btn-block btn-highlight form-control"
        disabled={!roomId.trim()}
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
