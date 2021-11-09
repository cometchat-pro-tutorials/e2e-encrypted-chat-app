import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import Context from './context';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);
  const [eThree, setEThree] = useState(null);

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  useEffect(() => {
    if (user) {
      initEthree(user);
    }
  }, [user]);

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/chat');
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
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
    if (user) {
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

        await eThree.cleanup();
        await registerEThree(eThree, user);

        setEThree(eThree);
      }
    }
  };

  return (
    <Context.Provider value={{ isLoading, setIsLoading, user, setUser, cometChat, eThree, setEThree }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
      {isLoading && <Loading />}
    </Context.Provider>
  );
}

export default App;
