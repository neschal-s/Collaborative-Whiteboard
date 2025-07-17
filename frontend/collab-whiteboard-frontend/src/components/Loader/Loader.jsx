import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/coffee-machine.json";
import "./Loader.css";

// const Loader = ({ theme = "light" }) => {
//   const lottieRef = useRef();

//   useEffect(() => {
//     const colors = {
//       dark: {
//         stroke: "#ffffff",
//         fill: "#dddddd",
//       },
//       light: {
//         stroke: "#000000",
//         fill: "#444444",
//       },
//     };

//     const current = lottieRef.current;

//     if (current && current.renderer?.elements) {
//       const fillColor = colors[theme]?.fill;
//       const strokeColor = colors[theme]?.stroke;

//       current.renderer.elements.forEach((layer) => {
//         const paths = layer?.getElementsByTagName?.("path");
//         if (paths) {
//           Array.from(paths).forEach((path) => {
//             if (strokeColor) path.setAttribute("stroke", strokeColor);
//             if (fillColor) path.setAttribute("fill", fillColor);
//           });
//         }
//       });
//     }
//   }, [theme]);

//   return (
//     <div className="loader-container">
//       <Lottie
//         lottieRef={lottieRef}
//         animationData={animationData}
//         loop
//         autoplay
//         style={{ width: 250, height: 250 }}
//       />
//       <p className="loading-text">
//         Brewing your whiteboard ...
//       </p>
//     </div>
//   );
// };


const Loader = ({ theme = "light" }) => {
  return (
    <div className={`loader-container ${theme}`}>
      <Lottie animationData={animationData} loop={true} style={{ width: 250, height: 250 }} />
      <p className="loader-text">Brewing up your whiteboard...</p>
    </div>
  );
};

export default Loader;
