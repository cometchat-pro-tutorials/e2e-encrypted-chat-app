import { useRef, useContext, useEffect } from "react";
import Context from "../context";
import { auth, realTimeDb } from "../firebase";
import validator from "validator";
import withModal from "./Modal";
import SignUp from "./SignUp";
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

const Login = (props) => {
  const { user, setUser, setIsLoading, cometChat, setEThree } = useContext(Context);
  const { toggleModal } = props;
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) {
      history.push('/');
    }
  }, []);

  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  const registerEThree = async (eThree, user) => {
    if (eThree) {
      try {
        await eThree.register();
        // generate the backup key.
        if (user && user.keyPassword) {
          await eThree.backupPrivateKey(user.keyPassword);
        }
      } catch (err) {
        if (err.name === 'IdentityAlreadyExistsError') {
          console.log('EThree id already existed');
          // restore the private key
          const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();
          console.log(`${user.fullname} has local private key: ${hasLocalPrivateKey}`);
          if (!hasLocalPrivateKey) {
            await eThree.restorePrivateKey(user.keyPassword);
          }
        }
      }
    }
  };

  const initEthree = async (user) => {

    async function getVirgilToken() {
      const response = await fetch('http://localhost:8080/virgil-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: user.id
        })
      })
      return response.json().then(data => {
        localStorage.setItem('virgilToken', JSON.stringify(data.virgilToken));
        return data.virgilToken;
      });
    }

    const eThree = await window.E3kit.EThree.initialize(getVirgilToken);
    if (eThree) {
      console.log('Initialized EThree successfully');
      console.log(eThree);

      setEThree(eThree);

      await registerEThree(eThree, user);

      localStorage.setItem('auth', JSON.stringify(user));

      setUser(user);
      setIsLoading(false);

      history.push('/');
    }
  };

  const login = () => {
    setIsLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (isUserCredentialsValid(email, password)) {
      auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        const userEmail = userCredential.user.email;
        realTimeDb.ref().child('users').orderByChild('email').equalTo(userEmail).on("value", function (snapshot) {
          const val = snapshot.val();
          if (val) {
            const keys = Object.keys(val);
            const user = val[keys[0]];
            // generate the key backup to get the private key from other devices.
            if (!user.keyPassword) { 
              user.keyPassword = uuidv4();
              realTimeDb.ref(`users/${user.id}`).set(user);
            }
            cometChat.login(user.id, `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`).then(
              User => {
                initEthree(user);
              },
              error => {
              }
            );
          }
        });
      })
        .catch((error) => {
          setIsLoading(false);
          alert(`Your user's name or password is not correct`);
        });
    } else {
      setIsLoading(false);
      alert(`Your user's name or password is not correct`);
    }
  };

  const showModal = () => {
    toggleModal(true);
  };

  return (
    <div className="login__container">
      <div className="login__welcome">
        <div className="login__logo">
          <p>End to End Encrypted Chat App</p>
        </div>
        <p>Build End to End Encrypted Chat App with CometChat</p>
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
          <span className="login__signup" onClick={showModal}>Create New Account</span>
        </div>
      </div>
    </div>
  );
}

export default withModal(SignUp)(Login);
