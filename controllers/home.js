/**
 * Created by wch on 16/8/22.
 */

var config = require('../config');

var models = require('../models');
var Blog = models.Blog;


// 博客首页
exports.index = function (req, res, next) {

	Blog
		.find({})
		.populate('tags')
		.exec(function (err, blogs) {
			if (err) {
				blogs = [];
			} else {

				return res.render('index', {
					title: '首页',
					user: req.session.user ? req.session.user : null,
					blogs: blogs,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});

			}
		});

};


// 登录控制
// show login page
exports.showLogin = function (req, res, next) {

	res.render('login', {
		title: '登录',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});

};

// handle login
exports.login = function (req, res, next) {

	if (req.body.loginUserName === config.loginUserName && req.body.loginPwd === config.loginPwd) {
		req.flash('success', '登录成功!');
		req.session.user = req.body.loginUserName;
		return res.redirect('/');
	} else {
		req.flash('error', '用户名或密码错误!');
		return res.redirect('/login');
	}

};

// logout
exports.logout = function (req, res, next) {

	req.session.user = null;
	req.flash('success', '登出成功!');
	res.redirect('/');

};

// check login
exports.checkLogin = function (req, res, next) {
	if (!req.session.user) {
		return res.redirect('/');
	}
	return next();
};