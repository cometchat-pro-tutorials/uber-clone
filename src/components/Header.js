// import useContext
import { useContext } from 'react';
// import Context
import Context from '../Context';
// import react router
import { useHistory } from 'react-router-dom';

function Header() {
  const { user, setUser } = useContext(Context);

  const history = useHistory();

  /**
   * logout
   */
  const logout = () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      // remove local storage.
      localStorage.removeItem('auth');
      // remove authenticated user from context.
      setUser(null);
      // redirect to login page.
      history.push('/login');
    }
  }

  return (
    <div className="header">
      <div className="header__left">
        <svg width="53" height="18" viewBox="0 0 53 18" fill="#fff" xmlns="http://www.w3.org/2000/svg" className="c8 c9 ca da"><path fillRule="evenodd" clipRule="evenodd" d="M2.65437 10.9212V0H0V11.0727C0 15.2441 2.90695 18 6.69915 18C8.54492 18 10.188 17.2921 11.3761 16.0531V17.6966H14.0055V0H11.3507V10.9212C11.3507 13.7275 9.45512 15.6236 7.00253 15.6236C4.52504 15.6236 2.65437 13.7779 2.65437 10.9212ZM16.1035 17.6966H18.6318V16.0785C19.7945 17.2667 21.4381 18 23.233 18C27.0252 18 30.0084 14.9914 30.0084 11.275C30.0084 7.5336 27.0252 4.52504 23.233 4.52504C21.4381 4.52504 19.82 5.25836 18.6572 6.44657V0H16.1035V17.6966ZM18.6063 11.2751C18.6063 8.77271 20.6036 6.80091 23.0557 6.80091C25.4828 6.80091 27.48 8.77271 27.48 11.2751C27.48 13.7531 25.4828 15.7499 23.0557 15.7499C20.5781 15.7499 18.6063 13.7531 18.6063 11.2751ZM31.0192 11.2501C31.0192 15.0927 34.0024 17.9746 37.8703 17.9746C40.2217 17.9746 42.1427 16.938 43.4322 15.2192L41.5867 13.8537C40.6258 15.143 39.3618 15.7498 37.8703 15.7498C35.6962 15.7498 33.952 14.1824 33.5978 12.0841H44.0895V11.2501C44.0895 7.40712 41.3591 4.55054 37.6431 4.55054C33.8758 4.55054 31.0192 7.60937 31.0192 11.2501ZM37.5923 6.77546C39.4884 6.77546 41.0811 8.0897 41.511 10.062H33.6487C34.1035 8.0897 35.6962 6.77546 37.5923 6.77546ZM52.0782 7.07866V4.70234H51.1932C49.7775 4.70234 48.7411 5.35943 48.109 6.39614V4.80342H45.5806V17.6966H48.1346V10.3652C48.1346 8.36799 49.3476 7.07866 51.0166 7.07866H52.0782Z"></path></svg>
        {
          user && (
            <div className="header__right">
              <img src={user.avatar} alt={user.email}/>
              <span>Hello, {user.email}</span>
            </div>
          )
        }
      </div>
      <span className="header__logout" onClick={logout}><span>Logout</span></span>
    </div>
  );
}

export default Header;