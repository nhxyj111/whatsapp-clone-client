import React, { useCallback, useContext } from 'react'
import { useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import { useCacheService } from './cache.service';
import { useMeQuery, User, useSignInMutation, useSignUpMutation } from '../graphql/types';

const MyContext = React.createContext<User | null>(null);

export const useMe = () => {
  return useContext(MyContext)
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: any) => {
    if (!isSignedIn()) {
      if (props.history.location.pathname === '/sign-in') {
        return null
      }
      return <Redirect to="/sign-in" />;
    }
    const signOut = useSignOut();
    const { data, error, loading } = useMeQuery();

    useCacheService();

    if (loading) return null;

    if (data === undefined) return null;

    if (error || !data.me) {
      signOut();
      return <Redirect to="/sign-in" />;
    }

    return (
      <MyContext.Provider value={data.me}>
        <Component {...props as P} />
      </MyContext.Provider>
    )
  }
}

// export const signIn = (authToken: string) => {
//   document.cookie = `authToken=${authToken}`;
//   return Promise.resolve();
// }

export const useSignIn = useSignInMutation;
export const useSignUp = useSignUpMutation;

export const useSignOut = () => {
  const client = useApolloClient()
  return useCallback(() => {
    document.cookie = `authToken=;expires=${new Date(0)}`;
    return client.clearStore();
  }, [client])
}

export const isSignedIn = () => {
  return /authToken=.+(;|$)/.test(document.cookie);
}