import { useState, useRef, useEffect } from "react";
import allData from "@/utils/data/allData.json";
import { hexToRGBA } from "@/utils/helpers";
import Globe from "react-globe.gl";
import Loading from "@/components/Loading";
import { countries } from "@/utils/data/Countries";
import { usePathname } from "next/navigation";
import { checkForAllCountries } from "@/utils/helpers";
import * as THREE from "three";

export default function LocationGlobe() {
  const globeEl = useRef<any>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>();
  const shouldRotateCloudsRef = useRef(true); // Ref to control clouds rotation

  const [hoverD, setHoverD] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const countryId = usePathname().split("/")[1];
  const [theme, setTheme] = useState("light");

  // Add clouds sphere
  const CLOUDS_IMG_URL = "./clouds.png";
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

  useEffect(() => {
    checkForAllCountries();
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setTheme(isDarkMode ? "dark" : "light");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleGlobeReady = () => {
    const globe = globeEl.current;
    setIsLoading(false);
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      cloudsMeshRef.current = clouds;
      globe.scene().add(clouds);

      const rotateClouds = () => {
        if (shouldRotateCloudsRef.current) {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          requestAnimationFrame(rotateClouds);
        }
      };
      rotateClouds();
    });
  };

  // Wrapper function to match expected signature
  const handlePolygonHover = (polygon: any) => {
    setHoverD(polygon);
  };

  const stopSpinning = () => {
    const controls = globeEl.current.controls();
    controls.autoRotate = false;
    shouldRotateCloudsRef.current = false;
  };

  const startSpinning = () => {
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    shouldRotateCloudsRef.current = true;
    if (cloudsMeshRef.current) {
      const rotateClouds = () => {
        if (shouldRotateCloudsRef.current && cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180; // Ensure this matches the initial speed
          requestAnimationFrame(rotateClouds);
        }
      };
      rotateClouds();
    }
  };

  const globeImageUrl = theme === "dark" ? "./blue-marble.jpg" : "./day.jpg";

  const isoCode = countries[countryId as keyof typeof countries].isoCode;

  return (
    <div className="relative w-[500px] h-[500px]" onMouseEnter={stopSpinning} onMouseLeave={startSpinning}>
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loading size={100} />
        </div>
      )}
      <Globe
        ref={globeEl}
        onGlobeReady={handleGlobeReady}
        waitForGlobeReady={true}
        animateIn={true}
        globeImageUrl={globeImageUrl} //"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        width={500}
        height={500}
        backgroundColor={hexToRGBA("#ffffff", 0)}
        polygonsData={allData.features.filter(
          (d) => d.properties.ISO_A2_EH === isoCode
        )}
        polygonAltitude={({ properties }: any) => (properties.ISO_A2_EH === isoCode ? 0.15 : 0.01)}
        polygonCapColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39, 174, 96, 0.7)"
              : "rgba(255, 255, 0, 0.5)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(70, 130, 180, 0.7)"
            : "rgba(255, 255, 255, 0.1)"
        }
        polygonSideColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39, 174, 96, 0.7)"
              : "rgba(0, 0, 0, 0.1)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(70, 130, 180, 0.7)"
            : "rgba(0, 0, 0, 0.1)"
        }
        polygonStrokeColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39,174,96,0.9)"
              : "rgba(255, 255, 255, 0.1)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(70, 130, 180, 0.9)"
            : "rgba(0, 0, 0, 0.1)"
        }
        polygonLabel={({ properties }: any) => `
          <b>${properties.ADMIN} (${properties.ISO_A2_EH}):</b> <br />
          Population: <i>${properties.POP_EST.toLocaleString()}</i>
        `}
        onPolygonHover={handlePolygonHover}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
