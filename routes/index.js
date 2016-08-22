var express = require('express');
var router = express.Router();

var home = require('../controllers/home');


router.get('/', home.index);  // 首页
router.get('/index', home.index);


router.get('/login', home.showLogin);   // 进入登录页面
router.post('/login', home.login);      // 登录校验
router.get('/logout', home.logout);     // 登出


module.exports = router;
