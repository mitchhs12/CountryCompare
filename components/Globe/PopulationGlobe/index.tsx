import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import * as d3 from "d3";
import countryData from "@/utils/data/countryData.json";
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function PopulationGlobe() {
  const [hoverD, setHoverD] = useState(null);
  const countries = useMemo(() => countryData, []);

  const getVal = (feat: any) => {
    return Math.max(1e5, Number(feat.properties.POP_EST));
  };

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [countries]);

  // Wrapper function to match expected signature
  const handlePolygonHover = (polygon: any | null, prevPolygon: any | null) => {
    setHoverD(polygon);
  };

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd).domain([0, maxVal]);

  return (
    <div>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        //bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        lineHoverPrecision={0}
        width={1000}
        height={1000}
        polygonsData={countryData.features.filter((d) => d.properties.ISO_A2 !== "AQ")}
        polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.01)}
        polygonCapColor={(d) => (d === hoverD ? "yellow" : colorScale(getVal(d)))}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties }: any) => `
        <b>${properties.ADMIN} (${properties.ISO_A2}):</b> <br />
        Population: <i>${properties.POP_EST}</i>
      `}
        onPolygonHover={handlePolygonHover}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
