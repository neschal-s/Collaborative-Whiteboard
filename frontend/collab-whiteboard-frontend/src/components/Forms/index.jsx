import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";

const Forms=({uuid, socket,setUser})=>{
    return (
        <div className="row h-100 pt-5">
            <div className="col-md-4 mt-5 form-box py-3 px-5 border mx-auto border-primary rounded-2 d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold mt-3">Create Room</h1>
                <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
            </div>

            <div className="col-md-4 mt-5 form-box py-3 px-5 border mx-auto border-primary rounded-2 d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold mt-3">Join Room</h1>
                <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
            </div>
        </div>
    )
};
export default Forms;