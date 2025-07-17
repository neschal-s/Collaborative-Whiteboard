import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";
import { useState } from "react";
import Loader from "../Loader/Loader";

const Forms = ({ uuid, socket, setUser }) => {
  const [formLoading, setFormLoading] = useState(false);
  const theme = document.body.getAttribute("data-theme") || "dark";

  return formLoading ? (
    <Loader theme={theme} />
  ) : (
    <div className="container h-100 pt-5">
      <div className="row justify-content-center gap-4">
        <div className="col-12 col-md-5 form-box py-4 px-5 border border-primary rounded-3 d-flex flex-column align-items-center shadow-sm">
          <h1 className="text-primary fw-bold mb-4 text-center" style={{ fontFamily: 'Carien, serif' }}>
            Create Room
          </h1>
          <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} setFormLoading={setFormLoading} />
        </div>

        <div className="col-12 col-md-5 form-box py-4 px-5 border border-primary rounded-3 d-flex flex-column align-items-center shadow-sm">
          <h1 className="text-primary fw-bold mb-4 text-center" style={{ fontFamily: 'Carien, serif' }}>
            Join Room
          </h1>
          <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} setFormLoading={setFormLoading} />
        </div>
      </div>
    </div>
  );
};

export default Forms;
