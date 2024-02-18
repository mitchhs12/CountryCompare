import dynamic from "next/dynamic";
import { useState, useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import countryData from "@/utils/data/countryData.json";
import { hexToRGBA } from "@/utils/helpers";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function LocationGlobe() {
  const globeEl = useRef<any>();
  const [hoverD, setHoverD] = useState(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);

  useEffect(() => {
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.1;
  }, []);

  // Wrapper function to match expected signature
  const handlePolygonHover = (polygon: any | null, prevPolygon: any | null) => {
    setHoverD(polygon);
  };

  return (
    <div>
      {isGlobeLoaded && (
        <div>
          <Globe
            ref={globeEl}
            animateIn={false}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            //bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            lineHoverPrecision={0}
            width={500}
            height={500}
            backgroundColor={hexToRGBA("#ffffff", 0)}
            polygonsData={countryData.features.filter((d) => d.properties.ISO_A2 !== "AQ")}
            polygonAltitude={({ properties }: any) => (properties.ISO_A2 === "DZ" ? 0.12 : 0.01)}
            polygonCapColor={(d: any) =>
              d == hoverD
                ? d.properties.ISO_A2 === "DZ"
                  ? "rgba(39, 174, 96, 0.7)"
                  : "rgba(255, 255, 255, 0.5)"
                : d.properties.ISO_A2 === "DZ"
                ? "rgba(70, 130, 180, 0.7)"
                : "rgba(255, 255, 255, 0.1)"
            }
            polygonSideColor={(d: any) =>
              d == hoverD
                ? d.properties.ISO_A2 === "DZ"
                  ? "rgba(39, 174, 96, 0.7)"
                  : "rgba(0, 0, 0, 0.1)"
                : d.properties.ISO_A2 === "DZ"
                ? "rgba(70, 130, 180, 0.7)"
                : "rgba(0, 0, 0, 0.1)"
            }
            polygonStrokeColor={(d: any) =>
              d == hoverD
                ? d.properties.ISO_A2 === "DZ"
                  ? "rgba(39,174,96,0.9)"
                  : "rgba(255, 255, 255, 0.1)"
                : d.properties.ISO_A2 === "DZ"
                ? "rgba(70, 130, 180, 0.9)"
                : "rgba(0, 0, 0, 0.1)"
            }
            polygonLabel={({ properties }: any) => `
          <b>${properties.ADMIN} (${properties.ISO_A2}):</b> <br />
          Population: <i>${properties.POP_EST}</i>
        `}
            onPolygonHover={handlePolygonHover}
            polygonsTransitionDuration={300}
          />
        </div>
      )}
    </div>
  );
}
