import { useState, useRef, useEffect } from "react";
import countryData from "@/utils/data/countryData.json";
import { hexToRGBA } from "@/utils/helpers";
import Globe from "react-globe.gl";
import Loading from "@/components/Loading";
import { countries } from "@/utils/data/Countries";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import * as turf from "@turf/turf";
import { useTheme } from "next-themes";

export default function LocationGlobe() {
  const globeEl = useRef<any>(null);
  const { resolvedTheme } = useTheme();
  const cloudsMeshRef = useRef<THREE.Mesh>();
  const shouldRotateCloudsRef = useRef(true); // Ref to control clouds rotation

  const [hoverD, setHoverD] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const countryId = usePathname().split("/")[1];
  const [isSpinning, setIsSpinning] = useState(false);
  const [globeSize, setGlobeSize] = useState({ width: 250, height: 250 });

  // Add clouds sphere
  const CLOUDS_IMG_URL = "./clouds.png";
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

  const darkImage = "./night.jpg";
  const lightImage = "./day.jpg";
  const isoCode = countries[countryId as keyof typeof countries].isoCode;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 768 ? 250 : window.innerWidth < 1024 ? 375 : 500;
      const height = window.innerWidth < 768 ? 250 : window.innerWidth < 1024 ? 375 : 500;
      setGlobeSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGlobeReady = () => {
    const globe = globeEl.current;

    const darkTexture = new THREE.TextureLoader().load("./blue-marble.jpg");
    const lightTexture = new THREE.TextureLoader().load("./day.jpg");

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      cloudsMeshRef.current = clouds;
      globe.scene().add(clouds);
      globe.controls().enableZoom = false;

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

      globe.pointOfView({ lat: coordinates[1], lng: coordinates[0], altitude: 1.8 }, 1000);
      rotateClouds();
      setIsLoading(false);
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
  };

  const startSpinning = () => {
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
  };

  return (
    <div className="relative w-[250px] h-[250px] md:w-[375px] md:h-[375px] lg:w-[500px] lg:h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loading size={100} />
        </div>
      )}
      <div className="flex justify-center items-center">
        <Globe
          ref={globeEl}
          onGlobeReady={handleGlobeReady}
          globeImageUrl={resolvedTheme === "dark" ? darkImage : lightImage}
          waitForGlobeReady={true}
          animateIn={true}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          width={globeSize.width}
          height={globeSize.height}
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
    </div>
  );
}
