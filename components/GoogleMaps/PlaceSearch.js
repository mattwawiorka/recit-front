import React, { useCallback, useRef } from 'react';
import Script from 'react-load-script';
import classNames from 'classnames';

function PlaceSearch(props) {

    const searchBar = useRef();

    const handleScriptLoad = useCallback(() => {

        const options = {
            types: ['establishment']
        }

        const autoComplete = new google.maps.places.Autocomplete(searchBar.current, options);

        autoComplete.setFields(['formatted_address', 'geometry', 'name']);

        autoComplete.addListener('place_changed', () => {
            props.onChangeFunc(autoComplete.getPlace())
        })

    }, [props])

    const addressInput = classNames({
        "input-fields": true,
        "needs-input": props.needsInput
    })


    return (
        <React.Fragment>
        <input 
            ref={searchBar}
            type="text" 
            className={addressInput}
            placeholder={props.prevPlace}
        />
        <Script url={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&libraries=places`}
            onLoad={handleScriptLoad}
        />

        <style jsx>{`
            .input-fields {
                display: block;
                margin : 0 auto;
                width: 100%;
                height: 40px;
                padding: 12px 20px;
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                outline: none;
            }

            .needs-input {
                outline: solid;
                outline-color: var(--greenapple);
            }

            ::-webkit-input-placeholder {
                font-style: italic;
            }
        `}</style>
        </React.Fragment>
    );
}

export default PlaceSearch;