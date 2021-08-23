import authRoute from './authRoute'
import siteRoute from './siteRoute'
import userRoute from './userRoute'
import contactRoute from './contactRoute'
import notifRoute from './notifRoute'
import messageRoute from './messageRoute'
import groupChatRoute from './groupChatRoute'

/**
 * Init all routes
 * @param app from exactly express module
 */
const initRoutes = app => {
  app.use('/group-chat', groupChatRoute)
  app.use('/message', messageRoute)
  app.use('/notification', notifRoute)
  app.use('/contact', contactRoute)
  app.use('/user', userRoute)
  app.use('/auth', authRoute)
  app.use('/', siteRoute)
}

export default initRoutes
