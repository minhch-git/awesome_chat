import authRoute from './authRoute'
import siteRoute from './siteRoute'
import userRoute from './userRoute'
import contactRoute from './contactRoute'
import notifRoute from './notifRoute'

/**
 * Init all routes
 * @param app from exactly express module
 */
const initRoutes = (app) => {
  app.use('/notification', notifRoute)
  app.use('/contact', contactRoute)
  app.use('/user', userRoute)
  app.use('/auth', authRoute)
  app.use('/', siteRoute)
}

export default initRoutes
