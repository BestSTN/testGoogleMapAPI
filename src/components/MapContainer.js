import { useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import Map from "./Map";

function MapContainer() {
  const libraries = useMemo(() => ["places"], []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  if (loadError) return <div>Load Error</div>;
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

export default MapContainer;
