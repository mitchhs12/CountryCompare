export interface GeoJsonGeometry {
  type: string; // Consider being more specific if possible (e.g., "Point", "MultiPolygon")
  coordinates: number[][][] | number[][];
}

export interface GeoJsonFeature {
  type: "Feature";
  properties: { [key: string]: any }; // Adjust according to the properties you expect
  geometry: GeoJsonGeometry;
}

export interface CountryFeatureCollection {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: "name";
    properties: {
      name: string;
    };
  };
  features: GeoJsonFeature[];
  bbox: number[]; // Assuming bbox is an array of numbers. Adjust if the structure is different.
}
