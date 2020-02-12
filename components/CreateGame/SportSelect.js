import { useState } from 'react';
import Select from 'react-select';
import { SPORT, BOARD, CARD, VIDEO } from '../../lib/lists';

function SportSelect(props) {

    const [writeIn, setWriteIn] = useState(false);

    const style = 
        <style jsx="true">{`
            .input-fields {
                display: block;
                margin : 0 auto;
                width: 100%;
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
        `}</style>

    if (props.category === "SPORT") {
        return (
            <React.Fragment>
                <label style={{ color: "#4b4f56", fontWeight: "bold" }}>
                    Sport
                    <Select options={SPORT} className={props.sportClass} placeholder="Select sport" defaultInputValue={props.sport}
                        onChange={(sport) => {
                            props.setSport(sport.value)
                            if (sport.value === "OTHER") {
                                setWriteIn(true)
                            }
                        }}
                    />
                </label>

                {writeIn ?
                <label className="header">
                    Sport Name
                    <input
                        onChange={(e) => props.setSport(e.target.value)} 
                        type="text" 
                        className={props.sportClass}
                        placeholder="What will you be playing"
                    />
                </label>
                :
                null} 

                {style}
            </React.Fragment>
        );
    }
    else if (props.category === "BOARD") {
        return (
            <React.Fragment>
                <label>
                    Game
                    <Select options={BOARD} className={props.sportClass} placeholder="Select game" defaultInputValue={props.sport}
                        onChange={(sport) => {
                            props.setSport(sport.value)
                            if (sport.value === "OTHER") {
                                setWriteIn(true)
                            }
                        }}
                    />
                </label>

                {writeIn ?
                <label className="header">
                    Game Name
                    <input
                        onChange={(e) => props.setSport(e.target.value)} 
                        type="text" 
                        className={props.sportClass}
                        placeholder="What will you be playing"
                    />
                </label>
                :
                null} 

                {style}
            </React.Fragment>
        );
    }
    else if (props.category === "CARD") {
        return (
            <React.Fragment>
                <label>
                    Sport
                    <Select options={CARD} className={props.sportClass} placeholder="Select game" defaultInputValue={props.sport}
                        onChange={(sport) => {
                            props.setSport(sport.value)
                            if (sport.value === "OTHER") {
                                setWriteIn(true)
                            }
                        }}
                    />
                </label>

                {writeIn ?
                <label className="header">
                    Game Name
                    <input
                        onChange={(e) => props.setSport(e.target.value)} 
                        type="text" 
                        className={props.sportClass}
                        placeholder="What will you be playing"
                    />
                </label>
                :
                null} 

                {style}
            </React.Fragment>
        );
    }
    else if (props.category === "VIDEO") {
        return (
            <React.Fragment>
                <label>
                    Sport
                    <Select options={VIDEO} className={props.sportClass} placeholder="Select game" defaultInputValue={props.sport}
                        onChange={(sport) => {
                            props.setSport(sport.value)
                            if (sport.value === "OTHER") {
                                setWriteIn(true)
                            }
                        }}
                    />
                </label>

                {writeIn ?
                <label className="header">
                    Sport Name
                    <input
                        onChange={(e) => props.setSport(e.target.value)} 
                        type="text" 
                        className={props.sportClass}
                        placeholder="What will you be playing"
                    />
                </label>
                :
                null} 

                {style}
            </React.Fragment>
        );
    }
}

export default SportSelect;