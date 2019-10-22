export default () => (
    <div>
        <style jsx global>{`
            @charset "UTF-8";
            @import url("https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700&display=swap");

            :root {
                --greyapple: #ecf0f1;
                --greenapple: #2ecc71;
                --darkmatter: #34495e;
                --darkermatter: #2c3e50;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: "IBM Plex Sans", Verdana, Geneva, Tahoma, sans-serif;
            }

            a {
                text-decoration: none;
                color: black;
            }

            a:hover {
                color: var(--greenapple);
                cursor: pointer;
            }

        `}</style>
    </div>
);