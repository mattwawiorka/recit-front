import React, { useCallback } from 'react';
import API from '../../api.json';
import Map from 'google-map-react';
import mapStyles from './mapStyles.json';

function MapContainer(props) {

  const handleApiLoaded = useCallback((map, maps) => {

    console.log('map here')

    maps.event.addListener(map, 'dragend', () => {
      props.getMapBounds([
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getNorthEast().lng(),
        map.getBounds().getSouthWest().lat(),
        map.getBounds().getSouthWest().lng()
      ])
    })

    maps.event.addListener(map, 'zoom_changed', () => {
      props.getMapBounds([
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getNorthEast().lng(),
        map.getBounds().getSouthWest().lat(),
        map.getBounds().getSouthWest().lng()
      ], map.getZoom())
    })
  })

  return (
    <>
    <div className="map-container">
        <Map
            bootstrapURLKeys={{ key: API.key }}
            defaultCenter={ 
                {
                    lat: props.currentLoc[0],
                    lng: props.currentLoc[1]
                }
            }
            defaultZoom={12}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            options={{
                maxZoom: 16,
                zoomControl: false,
                styles: mapStyles
            }}
        >
            {props.markers}
        </Map>
    </div>

    <style jsx>{`
        .map-container {
            height: 80vh;
            width: 50vw;
            border-radius: 15px;
        }
    `}</style>
    </>
  );
}

export default MapContainer;