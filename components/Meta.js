export default function Meta() {

    return (
        <style jsx>{`
            @charset "UTF-8";
            @import url("https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700&display=swap");
            @import url('https://fonts.googleapis.com/css?family=Bitter:700&display=swap');

            :root {
                --greyapple: #ecf0f1;
                --greenapple: #2ecc71;
                --darkmatter: #34495e;
                --darkermatter: #2c3e50;
                --linkColor: #3399ff;
                --darkestTurf: #094d1c;
                --darkTurf: #45a049;
                --turf: #55ff64;
                --lightTurf: #3dec55;
                --lightestTurf: #00ff00;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                // outline: 1px solid red; // this can help see stuff
            }

            body {
                font-family: "IBM Plex Sans", Verdana, Geneva, Tahoma, sans-serif;
            }

            button {
                text-align: center;
                background-color: var(--darkermatter);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                overflow: hidden;
            }

            .btn {
                text-align: center;
                background-color: var(--darkermatter);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                overflow: hidden;
            }

            button:hover {
                background-color: var(--darkmatter);
            }

            a {
                text-decoration: none;
                color: black;
            }

            a:hover {
                color: var(--greenapple);
                cursor: pointer;
            }

            // SCROLLBAR
            /* Bar */
            ::-webkit-scrollbar {
                width: 5px;
                max-height: 10px;
            }

            /* Track */
            ::-webkit-scrollbar-track {
                box-shadow: inset 0 0 5px grey; 
                border-radius: 10px;
                margin: 2em;
            }
            
            /* Handle */
            ::-webkit-scrollbar-thumb {
                background: var(--darkmatter); 
                border-radius: 10px;
            }

            /* Handle on hover */
            ::-webkit-scrollbar-thumb:hover {
                background: var(--darkmatter); 
            }

            /***** REMOVE SCROLLBARS ON FINGER SCOLLING DEVICES *****/
            @media only screen and (max-width: 768px) {
                *::-webkit-scrollbar {
                    display: none;
                }
            }

            @media only screen and (max-height: 425px) {
                *::-webkit-scrollbar {
                    display: none;
                }
            }

        `}</style>
    );
}