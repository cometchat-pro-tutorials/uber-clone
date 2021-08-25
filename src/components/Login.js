// import useRef and useContext
import { useRef, useContext } from "react";
// import Context to get shared data from React context.
import Context from "../Context";
// import firebase authentication and real time database.
import { auth, realTimeDb } from "../firebase";
// import validator to validate user's credentials.
import validator from "validator";
// import custom componnets.
import withModal from "./Modal";
import SignUp from "./SignUp";
// import history
import { useHistory } from 'react-router-dom';
// import logo 
import logoBlack from '../logo_black.png';

function Login(props) {
  // get shared data from context.
  const { setUser, setIsLoading, cometChat } = useContext(Context);
  // get toggle modal function from withModal - higher order component.
  const { toggleModal } = props;
  // create ref to get user's email and user's password.
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const history = useHistory();

  /**
   * validate user's credentials.
   * @param {*} email 
   * @param {*} password 
   * @returns 
   */
  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  /**
   * login
   */
  const login = () => {
    // show loading indicator.
    setIsLoading(true);
    // get the user's creadentials.
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (isUserCredentialsValid(email, password)) {
      // if the user's credentials are valid, call Firebase authentication service.
      auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
          const userEmail = userCredential.user.email;
          realTimeDb.ref().child('users').orderByChild('email').equalTo(userEmail).on("value", function(snapshot) {
            const val = snapshot.val();
            if (val) {
              const keys = Object.keys(val);
              const user = val[keys[0]];
              // login cometchat.
              cometChat.login(user.id, `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`).then(
                User => {
                  // User loged in successfully.
                  // save authenticated user to local storage.
                  localStorage.setItem('auth', JSON.stringify(user));
                  // save authenticated user to context.
                  setUser(user);
                  // hide loading.
                  setIsLoading(false);
                  // redirect to home page.
                  history.push('/');
                },
                error => {
                  // User login failed, check error and take appropriate action.
                }
              );
            }
          });
        })
        .catch((error) => {      
          // hide loading indicator.
          setIsLoading(false);
          alert(`Your user's name or password is not correct`);
        });
    } else {
      // hide loading indicator.
      setIsLoading(false);
      alert(`Your user's name or password is not correct`);
    }
  };

  return (
    <div className="login__container">
      <div className="login__welcome">
        <div className="login__logo">
          <img src={logoBlack} alt="Uber Clone" />
        </div>
        <p>Get moving with Ober</p>
      </div>
      <div className="login__form-container">
        <div className="login__form">
          <input
            type="text"
            placeholder="Email or phone number"
            ref={emailRef}
          />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button className="login__submit-btn" onClick={login}>
            Login
          </button>
          <span className="login__forgot-password">Forgot password?</span>
          <span className="login__signup" onClick={() => toggleModal(true)}>Create New Account</span>
        </div>
      </div>
    </div>
  );
}

export default withModal(SignUp)(Login);
