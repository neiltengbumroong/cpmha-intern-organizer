import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, user }) => {
  return (
    <Route render={
      props => {
        if (user || localStorage.getItem('remember') === 'true') {
          return <Component {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/unauthorized'
            }
          } />
        }
      }
    } />
  )
}

export default ProtectedRoute;