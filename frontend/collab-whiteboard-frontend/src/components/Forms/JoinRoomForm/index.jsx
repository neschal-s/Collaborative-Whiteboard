import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRoomJoin = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userid: uuid(),
      host: false,
      presenter: false,
    };
    setUser(roomData);
    socket.emit("UserJoined", roomData);
    navigate(`/${roomId}`);
    console.log(roomData);
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
          className="form-control border rounded"
          placeholder="Enter Room Code "
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-5 btn btn-primary btn-block btn-highlight form-control"
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
