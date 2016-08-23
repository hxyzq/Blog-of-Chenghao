var express = require('express');
var router = express.Router();

var home = require('../controllers/home');
var blog = require('../controllers/blog');

router.get('/', home.index);  // 首页
router.get('/index', home.index);

router.get('/login', home.showLogin);   // 进入登录页面
router.post('/login', home.login);      // 登录校验
router.get('/logout', home.logout);     // 登出

router.get('/post', home.checkLogin, blog.showPost);    // 博客发表页
router.post('/post', home.checkLogin, blog.post);       // 发表博客

router.get('/blog/:id', blog.showContent);   // 博客内容页面


module.exports = router;
