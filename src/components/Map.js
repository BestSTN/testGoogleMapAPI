import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import Places from "./Places";

const generateRandomMarker = (position) => {
  const randomMarkers = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    randomMarkers.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return randomMarkers;
};

function Map() {
  const [location, setLocation] = useState();
  const [marker, setMarker] = useState();
  const [selects, setSelects] = useState();

  const mapRef = useRef();

  const center = useMemo(() => ({ lat: 13.75, lng: 100.5 }), []);

  // const center = useMemo(() => {
  //   return navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log(position);
  //       return {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //     },
  //     () => ({ lat: 13.75, lng: 100.5 })
  //   );
  // }, []);

  const options = useMemo(
    () => ({
      mapId: "3713c985864a0e82",
      disableDefaultUI: true,
      clickableIcon: false,
    }),
    []
  );

  const onMapLoad = useCallback((map) => (mapRef.current = map), []);
  const onMapClick = useCallback((e) => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);
  const randomMarkers = useMemo(() => generateRandomMarker(center), [center]);

  return (
    <div className="h-screen">
      <div className="h-[15%] p-5 bg-slate-200">
        <h1>SearchBar</h1>
        <Places
          setLocation={(position) => {
            setLocation(position);
            mapRef.current?.panTo(position);
            // mapRef.current?.setZoom(15);
          }}
        />
      </div>
      <div className="h-[85%] w-full">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="h-full w-full"
          options={options}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
          {marker && <Marker key={marker.lat + marker.lng} position={marker} />}
          {location && (
            <>
              <Marker
                position={location}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />
              <MarkerClusterer
                onClick={(e) => {
                  // alert('click cluster')
                  // alert(e.getMarkers()[0].position.lat());
                  // alert(e.getMarkers()[0].position.lng());

                  setSelects(e.getMarkers());
                }}
                title="cluster"
                zoomOnClick={false}
              >
                {(clusterer) =>
                  randomMarkers.map((el) => (
                    <Marker
                      key={el.lat}
                      position={el}
                      clusterer={clusterer}
                      onClick={(e) => {
                        console.log(e);
                        setSelects(e);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={location} radius={15000} options={closeOptions} />
              <Circle
                center={location}
                radius={30000}
                options={middleOptions}
              />
              <Circle center={location} radius={45000} options={farOptions} />

              {selects && (
                <InfoWindow
                  position={center}
                  onCloseClick={() => {
                    setSelects(null);
                  }}
                >
                  <div>
                    <h1>hi</h1>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Map;

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.25,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};

const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.25,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};

const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.25,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
