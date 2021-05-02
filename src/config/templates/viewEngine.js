import express from 'express'

/**
 * Config view engine for app
 * @param app from exactly express module
 * @param folder path express static
 */

const configViewEngine = (app, folder) => {
  // set the view engine to ejs
  app.set('view engine', 'pug');
  app.set('views', folder)

  app.use(express.static('src/public'))
}

export default { configViewEngine }
