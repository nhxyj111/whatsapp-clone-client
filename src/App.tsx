import React from 'react';
import { BrowserRouter, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import ChatRoomScreen from './components/ChatRoomScreen';
import AuthScreen from './components/AuthScreen';
import ChatsListScreen from './components/ChatsListScreen';
import ChatCreationScreen from './components/ChatCreationScreen';
import AnimatedSwitch from './components/AnimatedSwitch';
// import { useCacheService } from './services/cache.service';
import { withAuth } from './services/auth.service';

const App: React.FC = () => {
  // useCacheService();

  return (
    <BrowserRouter>
      <AnimatedSwitch>
        <Route exact path="/sign-(in|up)" component={AuthScreen} />
        <Route exact path="/chats" component={withAuth(ChatsListScreen)} />
        <Route
          exact
          path="/chats/:chatId"
          component={withAuth(
            ({ match, history }: RouteComponentProps<{ chatId: string }>) => (
              <ChatRoomScreen chatId={match.params.chatId} history={history} />
            )
          )}
        />
        <Route exact path="/new-chat" component={withAuth(ChatCreationScreen)} />
      </AnimatedSwitch>
      <Route exact path="/" render={redirectToChats} />
    </BrowserRouter>
  );
};

const redirectToChats = () => <Redirect to="/chats" />;

export default App;