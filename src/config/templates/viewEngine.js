import express from 'express'

const configViewEngine = (app, folder) => {
  // set the view engine to ejs
  app.set('view engine', 'pug');
  app.set('views', folder)

  app.use(express.static('src/public'))
}

export default { configViewEngine }
