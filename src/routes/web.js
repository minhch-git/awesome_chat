import authRoute from './authRoute'
import siteRoute from './siteRoute'
import userRoute from './userRoute'

/**
 * Init all routes
 * @param app from exactly express module
 */
const initRoutes = (app) => {
  app.use('/user', userRoute)
  app.use('/auth', authRoute)
  app.use('/', siteRoute)
}

export default initRoutes
