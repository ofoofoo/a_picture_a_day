import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import VANTA from "vanta/dist/vanta.waves.min"; // Import the specific Vanta effect
// import "vanta/dist/vanta.waves.min.css"; // Import the Vanta CSS if needed

const VantaComponent = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    if (vantaRef.current) {
      const vantaEffect = VANTA.WAVES({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x0f6d6e,
        waveHeight: 20.0,
        waveSpeed: 1.0,
        zoom: 1.0,
      });

      return () => {
        if (vantaEffect) vantaEffect.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    ></div>
  );
};

export default VantaComponent;
