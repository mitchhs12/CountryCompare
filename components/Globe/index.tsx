import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import * as d3 from "d3";
import countryData from "@/utils/data/countryData.json";
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function MyGlobe() {
  const [hoverD, setHoverD] = useState(null);
  const [countries, setCountries] = useState({ features: [] });

  const getVal = (feat: any) => {
    return Math.max(1e5, Number(feat.properties.POP_EST));
  };

  useEffect(() => {
    setCountries(countryData);
  }, []);

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [countries]);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd).domain([0, maxVal]);
  return (
    <div>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        lineHoverPrecision={0}
        width={500}
        height={500}
        polygonsData={countryData.features.filter((d) => d.properties.ISO_A2 !== "AQ")}
        polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.06)}
        polygonCapColor={(d) => (d === hoverD ? "steelblue" : colorScale(getVal(d)))}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          Population: <i>${d.POP_EST}</i>
        `}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
