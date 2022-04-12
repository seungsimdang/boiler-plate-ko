const express = require('express');
const app = express();
const port = 5000;

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

//application/x-www-form-urlencoded의 data
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { Router } = require('express');
const { json } = require('express/lib/response');
mongoose
  .connect(config.mongoURI, {
    //userNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFineAndModify: false
  })
  .then(() => console.log('MongoDb Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users/register', (req, res) => {
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공되는 이메일에 해당하는 유저가 없습니다.',
      });
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀빈호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      //비밀번호까지 맞다면 token을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? ex) 쿠키, 로컬스토리지
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//role이 1이면 admin, role이 2이면 특정 부서 admin
//role이 0이면 일반 유저, role이 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
