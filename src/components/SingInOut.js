import React, {useContext} from "react";
import '../css/singInOut.css';
import {BrowserRouter as Router,Route,
    Redirect,Switch} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from 'react-google-login';
import {FACEBOOK_ID, GOOGLE_ID} from "../const";
import {baseUrl} from "../const";
import {UserContext} from "../context/UserContext";

const SingInOut = () => {
    const [user,setUser] = useContext(UserContext);

    const responseLogin = (response) => {
        const id = response.id || response.googleId;
        const name = response.name || `${response.profileObj.givenName} ${response.profileObj.familyName}`;
        if (response) {
            fetch(`${baseUrl}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id}),
            })
                .then((response) => response.json())
                .then((data) => {
                    return data;
                })
                .then((data) => {
                    setUser({authenticated:true,id,name,favoritesCocktails:data});
                });
        }
    }

    if (user.authenticated) {
        return <Redirect  to="/favorites" />
    }

    return(
        <>
            <div id="sing-in">
            <div className='container sing-in' >
                    <div className="overlay">
                            <h1 className='sing-header'>Hello, Friend!</h1>
                            <p className='sing-p white'>Click to sing in and start journey with us</p>
                            <h1 className='sing-header'>Sign in</h1>
                            <div className="social-container">
                                <GoogleLogin
                                    clientId={GOOGLE_ID}
                                    render={renderProps => (
                                        <button onClick={renderProps.onClick} disabled={renderProps.disabled}  className="social google-login">
                                        <FontAwesomeIcon className='icon-singin-google' icon={faGoogle} size={"2x"} />
                                        Login with Google
                                        </button>
                                    )}
                                    onSuccess={responseLogin}
                                    onFailure={data=>console.log(data)}
                                    cookiePolicy={'single_host_origin'}
                                />
                                <FacebookLogin
                                    appId={FACEBOOK_ID}
                                    autoLoad={false}
                                    cookie={true}
                                    redirectUri={baseUrl}
                                    disableMobileRedirect={true}
                                    callback={responseLogin}
                                    render={renderProps => (
                                        <button onClick={renderProps.onClick}  className="social facebook-btn">
                                            <FontAwesomeIcon className='icon-singin' icon={faFacebook} size={"2x"} />
                                            Login with Facebook
                                        </button>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )
};
export default SingInOut;
