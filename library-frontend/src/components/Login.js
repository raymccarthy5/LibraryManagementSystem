import { useRef, useState, useEffect } from "react"
import { useContext } from "react";
import {Link} from 'react-router-dom';
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const LOGIN_URL = '/auth/authenticate';

const Login = () => {
    const { setIsLoggedIn } = useContext(AuthContext);

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])
      
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(LOGIN_URL, 
                {email, password: pwd},
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(response?.data);

            const token = response?.data?.token;

            setEmail('');
            setPwd('');
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('token', token);
            setSuccess(true);
        
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    

    return(
        <>
        {success ? (
            <section className="success-page">
                <h1>Success!</h1>
                <p>
                   You are logged in!
                </p>
            </section>
        ) : (
        <section className="auth-form">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>)}
        </>
    )
}

export default Login