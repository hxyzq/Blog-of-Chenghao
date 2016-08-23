/**
 * Created by wch on 16/8/23.
 */

var validator = require('validator');

var models = require('../models');
var Blog = models.Blog;

// show blog post page
exports.showPost = function (req, res, next) {

	res.render('post', {
		title: '发表博客',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});

};

// post a blog
exports.post = function (req, res, next) {
	console.log(req.body);

	var title = validator.trim(req.body.title);
	var content = validator.trim(req.body.content);
	var tags = [];
	for (var i in req.body.tags) {
		tags.push(validator.trim(req.body.tags[i]));
	}

	// 验证
	var error;
	if (title === '') {
		error = '标题不能是空的!';
	} else if (content === '') {
		error = '内容不可为空!';
	}

	if (error) {
		req.flash('error', error);
		return res.redirect('/post');
	}

	var blog = new Blog();
	blog.title = title;
	blog.content = content;
	blog.user = req.session.user;
	blog.tags = tags;
	blog.save(function (err) {
		if (err) {

			req.flash('error', err);
			return res.redirect('/post');

		} else {

			req.flash('success', '发表成功!');
			return res.redirect('/');

		}
	});

};