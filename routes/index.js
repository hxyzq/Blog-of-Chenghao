var express = require('express');
var router = express.Router();

var home = require('../controllers/home');
var blog = require('../controllers/blog');
var tag = require('../controllers/tag');

router.get('/', home.index);  // 首页
router.get('/index', home.index);

router.get('/login', home.showLogin);   // 登录页
router.post('/login', home.login);      // 登录校验
router.get('/logout', home.logout);     // 登出

router.get('/post', home.checkLogin, blog.showPost);    // 博客发表页
router.post('/post', home.checkLogin, blog.post);       // 发表博客

router.get('/blog', blog.index);              // 博客列表
router.post('/blog/loadMore', blog.loadMore);           // 加载更多
router.get('/blog/:id', blog.showContent);    // 博客内容页

router.get('/tags', tag.showTags);        // 标签列表页
router.get('/tags/:id', tag.showBlogs);   // 特定标签博客页

router.get('/archive', blog.archive);     // 归档页

module.exports = router;
