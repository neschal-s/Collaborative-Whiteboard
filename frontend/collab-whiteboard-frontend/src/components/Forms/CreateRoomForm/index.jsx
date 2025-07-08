import "./index.css";

const CreateRoomForm=()=>{
    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group pb-1">
                <input type="text" className="form-control my-2" placeholder="Enter your Name"/>
            </div>


            <div className="form-group border rounded">
                <div className="input-group d-flex align-items-center justify-content-center">
                    <input type="text" className="form-control my-2  ms-2 me-2 border rounded" disabled placeholder="Generate Room Code "/>
                    <div className="input-group-append">
                        <button className="btn btn-primary btn-sm me-2" type="button">
                            Generate
                        </button>
                        <button className="btn btn-outline-danger btn-sm me-2 hover:" type="button">
                            Copy
                        </button>
                    </div>
                    </div>
                </div>
                <button type="submit" className="mt-5 btn btn-primary btn-block btn-highlight form-control">
                    Generate Room
                </button>
        </form>
    )
};

export default CreateRoomForm;