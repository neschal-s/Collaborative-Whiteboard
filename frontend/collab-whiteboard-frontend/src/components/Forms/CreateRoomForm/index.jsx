import { use, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket } from "socket.io-client";

const CreateRoomForm=({uuid,socket,setUser})=>{

    const [roomId,setroomId]=useState(uuid());
    const [name,setName]=useState("");

    const navigate=useNavigate();

    const handleCreateRoom=(e)=>{
        e.preventDefault();

        const roomData={
            name,
            roomId,
            userId:uuid(),
            host:true,
            presenter:true
        }
        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined",roomData);

    }

    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group pb-1">
                <input type="text" className="form-control my-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your Name"/>
            </div>


            <div className="form-group border rounded">
                <div className="input-group d-flex align-items-center justify-content-center">
                    <input type="text" value={roomId} className="form-control my-2  ms-2 me-2 border rounded" disabled placeholder="Generate Room Code "/>
                    <div className="input-group-append">
                        <button className="btn btn-primary btn-sm me-2" onClick={()=>setroomId(uuid())} type="button">
                            Generate
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm me-2"
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(roomId);
                                toast.success("Room ID copied to clipboard!", {
                                position: "top-right",
                                autoClose: 1500,
                                });
                            }}
                            >
                                Copy
                                </button>

                    </div>
                    </div>
                </div>
                <button type="submit" className="mt-5 btn btn-primary btn-block btn-highlight form-control" onClick={handleCreateRoom} disabled={!name.trim()}>
                    Generate Room
                </button>
                <ToastContainer />
        </form>
    )
};

export default CreateRoomForm;