import { useContext } from 'react';

import { CometChatUI } from '../cometchat-pro-react-ui-kit/CometChatWorkspace/src';

import Header from './Header';

import Context from '../context';


const Home = () => {

  const { eThree, cometChat } = useContext(Context);

  if (!cometChat || !eThree) {
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ width: '100vw', height: '100vh', paddingTop: '3.5rem' }}>
        <CometChatUI eThree={eThree} />
      </div>
    </>
  );
};
export default Home;