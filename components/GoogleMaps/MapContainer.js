import React, { useCallback } from 'react';
import API from '../../api.json';
import Map from 'google-map-react';
import mapStyles from './mapStyles.json';
import classNames from 'classnames';

function MapContainer(props) {

  // For view select on mobile
  const mapClass = classNames({
    "map-container": true,
    "hide": !props.viewMode
  })

  const handleApiLoaded = useCallback((map, maps) => {

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
    <div className={mapClass}>
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
                disableDoubleClickZoom: true,
                styles: mapStyles
            }}
        >
            {props.markers}
        </Map>
    </div>

    <style jsx>{`
      .map-container {
        height: 85vh;
        width: 55vw;
      }

      @media only screen and (max-width: 768px) {
        .map-container {
          width: 575px;
        }
      }

      @media only screen and (max-width: 600px) {
        .hide {
          display: none;
        }
      }

      @media only screen and (max-height: 425px) {
        .hide {
          display: none;
        }

        .map-container {
          width: 100%;
        }
      }
    `}</style>
    </>
  );
}

export default MapContainer;