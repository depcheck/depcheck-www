import session from 'express-session';
import fileStoreFactory from 'session-file-store';

const sessionSecret = process.env.SESSION_SECRET || 'SESSION_SECRET';
const FileStore = fileStoreFactory(session);

export default session({
  store: new FileStore(),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
});
