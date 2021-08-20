// import useContext.
import { useContext } from 'react';
// import Context.
import Context from '../Context';
// import cometchat ui.
import { CometChatMessages  } from '../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
function Chat() {

  const { user, currentRide } = useContext(Context);

  const findUser = () => {
    if (user && currentRide) { 
      if (user.role === 'user' && currentRide.driver && currentRide.driver.id) {
        return currentRide.driver.id;
      } else if (user.role === 'driver' && currentRide.requestor && currentRide.requestor.id) {
        return currentRide.requestor.id;
      }
    }
  }

  return (
    <div style={{width: '100vw', height:'100vh' }}>
      <CometChatMessages  chatWithUser={findUser()} />
    </div>
  );
}

export default Chat;