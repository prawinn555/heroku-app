const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const multer = require('multer');
const upload = multer();

// multer : form must be enctype="multipart/form-data"
// otherwise, it is possible to use bodyParser (urlEncoded or json)

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/logViewer', (req, res) => res.send('method must be POST'))
  .post('/logViewer', upload.none(), (req, res) => {
    console.log('logViewer', req.body);
    res.render('pages/logViewer', { body : req.body})}
  )
 .listen(PORT, () => console.log(`Listening on ${ PORT }`))
