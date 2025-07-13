const JoinRoomForm=({socket,setUser})=>{

    


    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group pb-1">
                <input type="text" className="form-control my-2" placeholder="Enter your Name"/>
            </div>


            <div className="form-group">
                    <input type="text" className="form-control border rounded" placeholder="Enter Room Code "/>
                </div>
                <button type="submit" className="mt-5 btn btn-primary btn-block btn-highlight form-control">
                    Join Room
                </button>
        </form>
    )
};

export default JoinRoomForm;
