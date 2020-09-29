import Auth0Lock from 'auth0-lock';

export default new Auth0Lock(
  process.env.REACT_APP_AUTH0_KEY,
  'perezvon.auth0.com',
  {
    allowedConnections: ['Username-Password-Authentication'],
    languageDictionary: {
      usernameOrEmailInputPlaceholder: 'username',
      title: 'Quartermaster Dashboard',
    },
  }
);
