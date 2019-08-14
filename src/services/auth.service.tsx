import React, { useCallback } from 'react'
import { useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import { useCacheService } from './cache.service';

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
    useCacheService();
    return <Component {...props as P} />;
  }
}

export const signIn = (currentUserId: string) => {
  document.cookie = `currentUserId=${currentUserId}`;
  return Promise.resolve();
}

export const useSignOut = () => {
  const client = useApolloClient()
  return useCallback(() => {
    document.cookie = `currentUserId=;expires=${new Date(0)}`;
    return client.clearStore();
  }, [client])
}

export const isSignedIn = () => {
  return /currentUserId=.+(;|$)/.test(document.cookie);
}