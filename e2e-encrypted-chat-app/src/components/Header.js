import { useContext } from "react";

import { useHistory } from 'react-router-dom';

import Context from "../context";

const Header = () => {
  const { user, setUser, eThree, cometChat } = useContext(Context);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm("Do you want to log out ?");
    if (isLogout) {
      await cometChat.logout();
      await eThree.cleanup();
      localStorage.removeItem("auth");
      setUser(null);
      history.push("/login");
    }
  };

  return (
    <div className="header">
      <div className="header__left">
        <p>Encrypted Chat App</p>
        {user && (
          <div className="header__right">
            <span>Hello, {user.fullname}</span>
          </div>
        )}
      </div>
      <span className="header__logout">
        <div>
          <svg onClick={logout} style={{ width: '1.5rem', height: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
      </span>
    </div>
  );
};

export default Header;