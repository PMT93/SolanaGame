
require('dotenv').config()

const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3030;

const { transferSOLToken } = require('./libs/sendTransaction');
const { transferCustomToken } = require('./libs/sendCustomToken');
const { check } = require('./libs/pubickey');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  const isLoggedIn = req.cookies.isLoggedIn === 'true';
  if (isLoggedIn) {
    res.redirect('/game')
  } else {

    res.render('index');
  }

});


app.get('/game', (req, res) => {
  const isLoggedIn = req.cookies.isLoggedIn === 'true';
  if (isLoggedIn) {


    res.render('game');
  } else {
    res.redirect('/')


  }



});
app.post('/login', (req, res) => {
  const publickey = req.body.publicKey;

  if (check(publickey)) {
    // Tạo cookie để đánh dấu đã đăng nhập
    res.cookie('isLoggedIn', true);
    res.cookie('publickey', publickey);

    res.status(201).json({
      'status': 'success',
      'details': 'Logged in successfully'
    });
  } else {
    res.status(404).json({
      'status': 'failed',
      'details': 'Invalid value'
    });
  }
});

/* Transfer SOL Token */
app.post('/transfer-tokens', async (req, res, next) => {
  try {
    const recipientPublicKey = req.cookies.publickey;
    const token = 'SOL'
    const amount = Number((req.body.score / (req.body.bestScore*10000)).toFixed(5)); ;

   
    if (amount > 0) {
      let signature;
      if (token === 'SOL') {
        signature = await transferSOLToken(recipientPublicKey, amount);
      } else {
        signature = await transferCustomToken(recipientPublicKey, amount, token);
      }
      res.status(201).json({
        'status': 'success',
        'details': 'Token transferred successfully',
        "signature": signature,
        "amount":amount
      });
    }
  } catch (error) {
    next(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});