import classNames from 'classnames';

function CategorySelect(props) {

    const sportClass = classNames({
        "checked": props.currentSelection === "SPORT"
    })

    const boardClass = classNames({
        "checked": props.currentSelection === "BOARD"
    })

    const cardClass = classNames({
        "checked": props.currentSelection === "CARD"
    })

    const videoClass = classNames({
        "checked": props.currentSelection === "VIDEO"
    })

    return (
        <React.Fragment>
        <div className="category-select-container">
            <label className={sportClass}>
                <input type="radio" name="Category" value="SPORT" 
                    className="category-button"
                    checked={props.currentSelection === "SPORT"}
                    onChange={(e) => props.makeSelection(e.target.value)} />
                Sport  
            </label>
            <label className={boardClass}>
                <input type="radio" name="Category" value="BOARD" 
                    className="category-button"
                    checked={props.currentSelection === "BOARD"}
                    onChange={(e) => props.makeSelection(e.target.value)} />
                Board Game
            </label>
            <label className={cardClass}>
                <input type="radio" name="Category" value="CARD"
                    className="category-button"
                    checked={props.currentSelection === "CARD"}
                    onChange={(e) => props.makeSelection(e.target.value)} />
                Card Game
            </label>
            <label className={videoClass}>
                <input type="radio" name="Category" value="VIDEO" 
                    className="category-button"
                    checked={props.currentSelection === "VIDEO"}
                    onChange={(e) => props.makeSelection(e.target.value)} />
                Video Game
            </label>
        </div>

        <style jsx>{`
            .category-select-container {
                display: inline-block;
                box-sizing: border-box;
            }

            .category-button {
                position: absolute;
                left: -9999em;
                top: -9999em;
            }

            label {
                float: left;
                font-size: 0.9em;
                font-weight: bold;
                text-align: center;
                width: 110px;
                cursor: pointer;
                padding: 0.25em;
                border: 2px solid var(--darkermatter);
                margin-right: -1px;
            }

            label:first-of-type {
                border-radius: 4px 0 0 4px;
            }

            label:last-of-type {
                border-radius: 0 4px 4px 0;
            }

            .checked {
                color: white;
                background-color: var(--darkermatter);
            }

        `}</style>
        </React.Fragment>
    );
}

export default CategorySelect;