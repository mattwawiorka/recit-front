import React, { useCallback, useRef } from 'react';
import API from '../../api.json';
import Map from 'google-map-react';

const MapContainer = (props) => {

  const handleApiLoaded = useCallback((map, maps) => {

    props.getMapBounds([
      map.getBounds().getNorthEast().lat(),
      map.getBounds().getNorthEast().lng(),
      map.getBounds().getSouthWest().lat(),
      map.getBounds().getSouthWest().lng()
    ])

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
      ])
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
                    zoomControl: false,
                    styles: 
                    [
                        {
                          "elementType": "geometry.stroke",
                          "stylers": [
                            {
                              "weight": 3
                            }
                          ]
                        },
                        {
                          "elementType": "labels.icon",
                          "stylers": [
                            {
                              "visibility": "off"
                            }
                          ]
                        },
                        {
                          "elementType": "labels.text",
                          "stylers": [
                            {
                              "color": "#34495e"
                            },
                            {
                              "saturation": 5
                            },
                            {
                              "lightness": -20
                            },
                            {
                              "weight": 0.5
                            }
                          ]
                        },
                        {
                          "featureType": "landscape",
                          "elementType": "geometry.fill",
                          "stylers": [
                            {
                              "color": "#2ecc71"
                            },
                            {
                              "lightness": 60
                            }
                          ]
                        },
                        {
                          "featureType": "poi.business",
                          "elementType": "labels.icon",
                          "stylers": [
                            {
                              "visibility": "off"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.business",
                          "elementType": "labels.text",
                          "stylers": [
                            {
                              "visibility": "off"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.park",
                          "elementType": "geometry.fill",
                          "stylers": [
                            {
                              "color": "#2ecc71"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.school",
                          "elementType": "geometry.fill",
                          "stylers": [
                            {
                              "color": "#2ecc71"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.sports_complex",
                          "elementType": "geometry.fill",
                          "stylers": [
                            {
                              "color": "#2ecc71"
                            }
                          ]
                        },
                        {
                          "featureType": "water",
                          "elementType": "geometry.fill",
                          "stylers": [
                            {
                              "saturation": 85
                            },
                            {
                              "lightness": -15
                            },
                            {
                              "weight": 5.5
                            }
                          ]
                        }
                      ]
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