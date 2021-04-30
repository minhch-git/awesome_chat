const configViewEngine = (app, folder) => {
  // set the view engine to ejs
  app.set('view engine', 'ejs');
  app.set('views', folder)

}

export default { configViewEngine }
