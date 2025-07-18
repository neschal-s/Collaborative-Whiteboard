import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/coffee-machine.json";
import "./Loader.css";


const Loader = ({ theme = "light" }) => {
  return (
    <div className={`loader-container ${theme}`}>
      <Lottie animationData={animationData} loop={true} style={{ width: 250, height: 250 }} />
      <p className="loader-text">Brewing up your whiteboard...</p>
    </div>
  );
};

export default Loader;
