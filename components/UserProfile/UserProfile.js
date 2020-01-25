import React, { useState, useRef, useCallback, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $userInput: userInput) {
    updateUser(id: $id, userInput: $userInput) {
        id
        status
    }
  }
`;

function UserProfile(props) {

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState();
    const [dob, setDOB] = useState();
    const [gender, setGender] = useState();
    const [status, setStatus] = useState(props.user.status);
    const [picMode, setPicMode] = useState(false);
    const [newPic, setNewPic] = useState(null);
    const [picPreview, setPicPreview] = useState(null);

    const statusInput = useRef();
    const overlay = useRef();

    const [updateProfile] = useMutation(UPDATE_USER);

    const fileCheck = useCallback((e) => {
        let files = e.target.files 
        let err = ''

        // Only allow one image 
        if (files.length > 1) {
            err = 'Only 1 image can be uploaded at a time\n'
            
        } 

        let size = 200000;
        if (files[0].size > size) {
            err += files[0].type + ' is too large\n';
        }
        
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']

        // compare file type find doesn't matach
        if (types.every(type => files[0].type !== type)) {
            // create error message and assign to container   
            err += files[0].type+' is not a supported format\n';
        }

        if (err !== '') { // if message not same old that mean has error 
            e.target.value = null // discard selected file
            console.log(err)
            return false;
        }

        return true;
    }, [])

    useEffect(() => {
        statusInput.current.innerText = new String(status);
        statusInput.current.addEventListener("input", e => {
            console.log(e.target.innerText)
            setStatus(e.target.innerText);
        })

        if (overlay.current) {
            overlay.current.addEventListener("click", e => {
                setPicMode(false)
            })
        }
    }, [picMode])

    return (
        <React.Fragment>
            {picMode ? <div className="overlay" ref={overlay}></div> : null}
            <div className="profile-container">
                <section className="user-main">
                    <article className="profile-pic"> 
                        <img 
                            src={picPreview ? picPreview : 'http://localhost:8080/images/' + props.user.profilePic}
                            className="image-round"
                            onClick={() => setPicMode(true)}
                        />
                    </article>

                    {picMode ?
                    <div className="pic-viewer" >
                        <label htmlFor="profile-upload" className="btn-pic-upload">
                        <img 
                            src={picPreview ? picPreview : 'http://localhost:8080/images/' + props.user.profilePic}
                            className="image-round"
                            onClick={() => setPicMode(true)}
                        />
                        </label>
                        {props.owner ?
                        <input 
                            type="file" 
                            id="profile-upload"
                            onChange={ e => {
                                if (fileCheck(e)) {
                                    setNewPic(e.target.files[0]);
                                    setPicPreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }}
                        />
                        :
                        null
                        }
                    </div>
                    :
                    null
                    }
                    
                    <article className="user-heading">
                        <h1 className="name">{props.user.name}</h1>
                        {props.owner ? 
                        <React.Fragment>
                            {(editMode || newPic) ?
                            <React.Fragment>
                                <button 
                                    className="btn-edit"
                                    onClick={() => {
                                        setEditMode(false);
                                        setNewPic(null);
                                        setPicPreview(null);
                                    }}
                                >Cancel</button>
                                <button 
                                    className="btn-edit btn-save"
                                    onClick={() => {
                                        if (newPic) {
                                            const data = new FormData();
                                            data.append('file', newPic);

                                            fetch('http://localhost:8080/post-image', {
                                                method: 'POST',
                                                headers: {
                                                    Authorization: 'Bearer ' + props.token
                                                },
                                                body: data
                                            })
                                            .then( response => {
                                                updateProfile({ variables: {
                                                    id: props.userId,
                                                    userInput: {
                                                        profilePic: "profile_" + props.user.id + '.' + newPic.name.split('.')[1],
                                                        name: name,
                                                        dob: dob,
                                                        gender: gender,
                                                        status: status.trim()
                                                    }
                                                }})
                                                .then( response => {
                                                    setNewPic(null);
                                                    setEditMode(false);
                                                })
                                            })
                                        } else {
                                            console.log(status)
                                            updateProfile({ variables: {
                                                id: props.userId,
                                                userInput: {
                                                    name: name,
                                                    dob: dob,
                                                    gender: gender,
                                                    status: status
                                                }
                                            }})
                                            .then( response => {
                                                setEditMode(false);
                                                props.refetch();
                                            })
                                        }
                                    }}
                                >Save</button>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <button 
                                    className="btn-edit"
                                    onClick={() => {
                                        setEditMode(true);
                                    }}
                                >Edit</button>
                            </React.Fragment>
                            }
                        </React.Fragment>
                        :
                        null}
                    </article>  

                    <article className="demographics">
                        <p className="city">{props.user.city}</p>
                        <p className="joined">{"Member since " + props.joinDate}</p>
                        {editMode ? 
                        <React.Fragment>
                            <p className="real-name">{"Name: "} 
                                <input 
                                    className="input-fields" 
                                    type="text"
                                    placeholder={props.user.name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </p>
                            <p className="age">{"Birth Date: "}
                            <input 
                                className="input-fields" 
                                type="date"
                                onChange={(e) => setDOB(e.target.value)}
                            />
                            </p>
                            <p className="gender">{"Gender: "}
                                <select 
                                    className="input-fields" 
                                    type="date"
                                    defaultValue={props.user.gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="N">Non-binary</option>
                                </select>
                            </p>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <p className="real-name">{"Name: " + props.user.name}</p>
                            <p className="age">{"Age: " + props.age}</p>
                            <p className="gender">{"Gender: " + props.user.gender}</p>
                        </React.Fragment>
                        }
                    </article>

                    <article className="status">
                        <div
                            className="status-input"
                            ref={statusInput}
                            contentEditable={editMode}
                            suppressContentEditableWarning={true}      
                            autoComplete="off"
                            maxLength="250"
                        />
                    </article>
                </section>
            </div>
                

            <style jsx>{`
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                .pic-viewer {
                    z-index: 11;
                    position: absolute;
                    left: 0; 
                    right: 0; 
                    margin-left: auto; 
                    margin-right: auto; 
                    width: 500px;
                    height: 500px;
                    background-color: white;
                    border-radius: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: hidden;
                }

                .profile-container {
                    width: 100%;
                    height: 76vh;
                    display: block;
                    justify-content: center;
                    padding: 1.5em;
                    // padding-top: 100%;
                    // position: relative;
                }

                section {
                    display: block;
                    background-color: var(--greenapple);
                    width: 100%;
                    height: 25%;
                    border-radius: 15px;
                    margin-bottom: 1em;
                    // position: absolute;
                    // top: 0;
                    // left: 0;
                    // bottom: 0;
                    // right: 0;
                }
                
                .user-main {
                    height: 50%;
                    display: inline-block;
                }

                article {
                    // border: 2px solid red;
                }

                .profile-pic {
                    display: inline-block;
                    float: left;
                    width: 33%;
                    height: 100%;   
                    cursor: pointer;
                }

                .image-round {
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                    border: 2px solid white;
                    cursor: pointer;
                }

                #profile-upload {
                    display: none;
                }

                .user-heading {
                    display: inline-block;
                    border-bottom: 2px solid white;
                    height: 15%;
                    margin-bottom: 1em;
                    width: 66%;
                    vertical-align: top;
                    font-weight: 800;
                    color: white;
                }

                .name {
                    display: inline-block;
                    font-size: 2.5em;
                    padding-left: 0.5em;
                }

                .btn-edit {
                    float: right;
                    width: 5em;
                    height: 2em;
                    margin-top: 1em;
                    margin-right: 1em;
                    font-size: 0.9em;
                }

                .btn-save {
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                .demographics {
                    display: inline-block;
                    height: 80%;
                    width: 25%;
                    vertical-align: top;
                    padding-left: 1em;
                    // font-size: 1.2em;
                    font-weight: bold;
                    // color: var(--darkermatter);
                    color: white;
                    line-height: 1.5em;
                }

                .city {
                    font-style: italic;
                }

                .joined {
                    font-style: italic;
                    margin-bottom: 1em;
                }

                .real-name {
                    font-size: 1.2em;
                }

                .age {
                    font-size: 1.2em;
                }

                .gender {
                    font-size: 1.2em;
                }

                .input-fields {
                    width: 100%;
                    padding: 12px 20px;
                    // margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .status {
                    display: inline-block;
                    width: 40%;
                    padding-left: 2em;
                    height: 80%;
                }

                .status-input {
                    width: 100%;
                    height: 100%;
                    resize: none;
                    overflow: hidden;
                    border: none;
                    font-weight: bold;
                    font-style: italic;
                    color: var(--darkermatter);
                    // word-wrap: break-word;
                    // white-space: pre-wrap;
                }


            `}</style>
        </React.Fragment>
    );
}

export default UserProfile;