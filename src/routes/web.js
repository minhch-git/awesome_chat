import authRoute from './authRoute'
import siteRoute from './siteRoute'

/**
 * Init all routes
 * @param app from exactly express module
 */
const initRoutes = (app) => {
  app.use('/auth', authRoute)
  app.use('/', siteRoute)
}

export default initRoutes
