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
          <svg className="_bv" viewBox="0 0 154 52"><path d="M8.088 31.704c0 8.136 5.328 13.392 12.384 13.392 6.984 0 12.384-5.4 12.384-13.392V.6h7.56V51h-7.488v-4.68c-3.384 3.528-8.064 5.544-13.32 5.544-10.8 0-19.08-7.848-19.08-19.728V.6h7.56v31.104zM47.832 51V.6h7.272v18.36a18.156 18.156 0 0 1 13.032-5.472c10.8 0 19.296 8.568 19.296 19.224 0 10.584-8.496 19.152-19.296 19.152-5.112 0-9.792-2.088-13.104-5.472V51h-7.2zm7.128-18.288c0 7.056 5.616 12.744 12.672 12.744 6.912 0 12.6-5.688 12.6-12.744 0-7.128-5.688-12.744-12.6-12.744-6.984 0-12.672 5.616-12.672 12.744zm36.792-.072c0-10.368 8.136-19.08 18.864-19.08 10.584 0 18.36 8.136 18.36 19.08v2.376h-29.88c1.008 5.976 5.976 10.44 12.168 10.44 4.248 0 7.848-1.728 10.584-5.4l5.256 3.888c-3.672 4.896-9.144 7.848-15.84 7.848-11.016 0-19.512-8.208-19.512-19.152zm18.72-12.744c-5.4 0-9.936 3.744-11.232 9.36h22.392c-1.224-5.616-5.76-9.36-11.16-9.36zm42.696.864h-3.024c-4.752 0-8.208 3.672-8.208 9.36V51h-7.272V14.28h7.2v4.536c1.8-2.952 4.752-4.824 8.784-4.824h2.52v6.768z" fill="currentColor" fillRule="evenodd"></path></svg>
        </div>
        <p>Get moving with Uber</p>
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
