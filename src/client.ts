import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';

const httpUri = process.env.REACT_APP_SERVER_URL + '/graphql';
const wsUri = httpUri.replace(/^https?/, 'ws');

const httpLink = new HttpLink({
  uri: httpUri,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
  }
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
)

const link = ApolloLink.from([terminatingLink]);

const inMemoryCache = new InMemoryCache();

export default new ApolloClient({
  link,
  cache: inMemoryCache,
});