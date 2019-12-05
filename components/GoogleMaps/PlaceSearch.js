import React, { useCallback, useRef } from 'react';
import Script from 'react-load-script';
import API from '../../api.json';

const PlaceSearch = (props) => {

    const searchBar = useRef();

    const handleScriptLoad = useCallback(() => {

        const options = {
            types: ['establishment']
        }

        const autoComplete = new google.maps.places.Autocomplete(searchBar.current, options);

        autoComplete.setFields(['formatted_address', 'geometry', 'place_id']);

        autoComplete.addListener('place_changed', () => {
            props.onChangeFunc(autoComplete.getPlace())
        })

    }, [props])


    return (
        <>
        <input 
            ref={searchBar}
            id="addressInput"
            type="text" 
            className="input-fields"
            placeholder={props.prevPlace}
        />
        <Script url={`https://maps.googleapis.com/maps/api/js?key=${API.key}&libraries=places`}
            onLoad={handleScriptLoad}
        />

        <style jsx>{`
            .input-fields {
                display: block;
                margin : 0 auto;
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            ::-webkit-input-placeholder {
                font-style: italic;
            }
        `}</style>
        </>
    );
}

export default PlaceSearch;