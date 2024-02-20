import { useState, useRef, useEffect } from "react";
import countryData from "@/utils/data/countryData.json";
import { hexToRGBA } from "@/utils/helpers";
import Globe from "react-globe.gl";
import Loading from "@/components/Loading";
import { countries } from "@/utils/data/Countries";
import { usePathname } from "next/navigation";
import { FeatureCollection } from "geojson";
import * as THREE from "three";
import * as turf from "@turf/turf";

export default function LocationGlobe() {
  const globeEl = useRef<any>(null);

  const cloudsMeshRef = useRef<THREE.Mesh>();
  const shouldRotateCloudsRef = useRef(true); // Ref to control clouds rotation

  const [hoverD, setHoverD] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const countryId = usePathname().split("/")[1];
  const [theme, setTheme] = useState("light");
  const [isSpinning, setIsSpinning] = useState(false);

  // Add clouds sphere
  const CLOUDS_IMG_URL = "./clouds.png";
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

  const globeImageUrl = theme === "dark" ? "./blue-marble.jpg" : "./day.jpg";
  const isoCode = countries[countryId as keyof typeof countries].isoCode;

  useEffect(() => {
    // Function to update the theme based on the "dark" class in the document element
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setTheme(isDarkMode ? "dark" : "light");
    };

    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        globeEl.current?.pauseAnimation(); // Pause the globe animation when the document is hidden
      } else {
        globeEl.current?.resumeAnimation(); // Resume the globe animation when the document becomes visible again
      }
    };

    // Initial theme update and setting up an observer for class changes on the document element
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Adding event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to remove the event listener and disconnect the observer
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleGlobeReady = () => {
    const globe = globeEl.current;

    setIsLoading(false);
    const controls = globe.controls();
    controls.enableZoom = false;

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

      const countryFeatures = countryData.features.filter((d: any) => d.properties.ISO_A2_EH === isoCode);

      // Assuming countryFeatures is an array of GeoJSON Feature objects for the country
      //@ts-ignore
      const featureCollection = turf.featureCollection(countryFeatures);
      const centroid = turf.centroid(featureCollection);

      const coordinates = centroid.geometry.coordinates;

      globe.pointOfView({ lat: coordinates[1], lng: coordinates[0], altitude: 1.7 }, 1000);
      rotateClouds();
    });
  };

  const startStopSpinning = () => {
    if (isSpinning) {
      stopSpinning();
    } else {
      startSpinning();
    }
    setIsSpinning(!isSpinning);
  };

  // Wrapper function to match expected signature
  const handlePolygonHover = (polygon: any) => {
    setHoverD(polygon);
  };

  const stopSpinning = () => {
    const controls = globeEl.current.controls();
    controls.autoRotate = false;
    //shouldRotateCloudsRef.current = false;
  };

  const startSpinning = () => {
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    // shouldRotateCloudsRef.current = true;
    // if (cloudsMeshRef.current) {
    //   const rotateClouds = () => {
    //     if (shouldRotateCloudsRef.current && cloudsMeshRef.current) {
    //       cloudsMeshRef.current.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180; // Ensure this matches the initial speed
    //       requestAnimationFrame(rotateClouds);
    //     }
    //   };
    //   rotateClouds();
    // }
  };

  return (
    <div className="relative w-[500px] h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loading size={100} />
        </div>
      )}
      <Globe
        ref={globeEl}
        onGlobeReady={handleGlobeReady}
        waitForGlobeReady={true}
        animateIn={false}
        globeImageUrl={globeImageUrl} //"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        width={500}
        height={500}
        backgroundColor={hexToRGBA("#ffffff", 0)}
        polygonsData={countryData.features.filter((d: any) => d.properties.ISO_A2_EH === isoCode)}
        polygonAltitude={({ properties }: any) => (properties.ISO_A2_EH === isoCode ? 0.13 : 0.01)}
        polygonCapColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39, 174, 96, 0.7)"
              : "rgba(255, 255, 0, 0.5)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(255, 255, 0, 0.7)"
            : "rgba(255, 255, 255, 0.1)"
        }
        polygonSideColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39, 174, 96, 0.7)"
              : "rgba(0, 0, 0, 0.1)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(255, 255, 0, 0.7)"
            : "rgba(0, 0, 0, 0.1)"
        }
        polygonStrokeColor={(d: any) =>
          d == hoverD
            ? d.properties.ISO_A2_EH === isoCode
              ? "rgba(39,174,96,0.9)"
              : "rgba(255, 255, 255, 0.1)"
            : d.properties.ISO_A2_EH === isoCode
            ? "rgba(255, 255, 0, 0.9)"
            : "rgba(0, 0, 0, 0.1)"
        }
        polygonLabel={({ properties }: any) => `
          <b>${properties.ADMIN} (${properties.ISO_A2_EH}):</b> <br />
          Population: <i>${properties.POP_EST.toLocaleString()} (${properties.POP_YEAR})</i>
        `}
        onPolygonHover={handlePolygonHover}
        polygonsTransitionDuration={300}
        onGlobeClick={() => {
          startStopSpinning();
        }}
      />
    </div>
  );
}
