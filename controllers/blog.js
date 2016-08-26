/**
 * Created by wch on 16/8/23.
 */

var config = require('../config');
var validator = require('validator');
var marked = require('marked');
var EventProxy = require('eventproxy');
var ejs = require('ejs');
var fs = require('fs');

var models = require('../models');
var Blog = models.Blog;
var Tag = models.Tag;

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
});


// show blog post page
exports.showPost = function (req, res, next) {

	res.render('post', {
		title: '发表博客' + ' · ' + config.blogName,
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});

};

// post a blog
exports.post = function (req, res, next) {

	var title = validator.trim(req.body.title);
	var content = validator.trim(req.body.content);
	var tags = [];
	var tag;
	for (var i in req.body.tags) {
		tag = validator.trim(req.body.tags[i]);
		if (tag !== '') {
			tags.push(tag);
		}
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

	// 标签处理
	var ep = new EventProxy();
	ep.after('save_tags', tags.length, function (tagList) {

		// 保存博客
		var blog = new Blog();
		blog.title = title;
		blog.content = content;
		blog.user = req.session.user;
		blog.tags = tagList;

		blog.save(function (err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/post');
			} else {
				req.flash('success', '发表成功!');
				return res.redirect('/');
			}
		});

	});
	ep.fail(function (err) {
		req.flash('error', err);
		return res.redirect('/post');
	});

	for (var i = 0; i < tags.length; i++) {
		var conditions = {'name': tags[i]};
		var update = {'$inc': {'blog_count': 1}};
		var options = {new: true, upsert: true};
		Tag.findOneAndUpdate(conditions, update, options, ep.done('save_tags'));
	}

};

// show blog list
exports.index = function (req, res, next) {

	Blog
		.find()
		.populate('tags')
		.limit(config.blogListSize)
		.sort({ 'create_at': -1 })
		.exec(function (err, blogs) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			} else {

				return res.render('blog/index', {
					title: config.blogName,
					user: req.session.user ? req.session.user : null,
					blogs: blogs,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});

			}
		});

};

// load more blog list
exports.loadMore = function (req, res, next) {
	console.log(req.body);

	var page = parseInt(req.body.page);
	var blogListSize = config.blogListSize;

	var ep = EventProxy();
	ep.all('tpl', 'blogs', 'count', function (tpl, blogs, count) {

		console.log(arguments);
		var html = ejs.render(tpl, {
			blogs: blogs,
			isLastPage: (page * blogListSize + blogs.length) === count,
			page: page + 1
		});
		return res.json({
			html: html
		});

	});

	ep.fail(function (err) {
		req.flash('error', err);
		return res.redirect('/');
	});

	fs.readFile('./views/blog/_blog_list.ejs', 'utf-8', ep.done('tpl'));
	Blog
		.find()
		.populate('tags')
		.limit(blogListSize)
		.skip(page * blogListSize)
		.sort({ 'create_at': -1 })
		.exec(ep.done('blogs'));
	Blog
		.count()
		.exec(ep.done('count'));

};

// show blog content
exports.showContent = function (req, res, next) {

	Blog
		.findOne({ '_id': req.params.id })
		.populate('tags')
		.exec(function (err, blog) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}

			blog.content = marked(blog.content);
			return res.render('blog/content', {
				title: blog.title + ' · ' + config.blogName,
				user: req.session.user ? req.session.user : null,
				blog: blog,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});

		});

};

// show blog archive page
exports.archive = function (req, res, next) {

	Blog.find(function (err, blogs) {
		if (err) {
			blogs = [];
		} else {

			blogs.forEach(function (blog, index) {
				blog.year = blog.create_at.getFullYear();
				blog.month = blog.create_at.getMonth() + 1;
			});
			return res.render('blog/archive', {
				title: '归档' + ' · ' + config.blogName,
				user: req.session.user ? req.session.user : null,
				blogs: blogs,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});

		}
	});


};