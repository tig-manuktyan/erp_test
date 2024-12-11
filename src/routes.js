import authRouter from './components/auth/auth.controller.js';
import fileRouter from './components/file/file.controller.js';

const registerRoutes = (app) => {
  app.use('/', authRouter);
  app.use('/file', fileRouter);
};

export default registerRoutes;
