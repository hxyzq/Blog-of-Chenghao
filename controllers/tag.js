/**
 * Created by wch on 16/8/24.
 */

var models = require('../models');
var Tag = models.Tag;
var Blog = models.Blog;

// show all tags
exports.showTags = function (req, res, next) {
	Tag
		.find({})
		.exec(function (err, tags) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			return res.render('tags', {
				title: '所有标签',
				user: req.session.user ? req.session.user : null,
				tags: tags,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
};

// show all blogs of one tag
exports.showBlogs = function (req, res, next) {
	Blog
		.find({'tags': req.params.id})
		.populate('tags')
		.exec(function (err, blogs) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/tags');
			}
			return res.render('tags/tag', {
				title: '标签',
				user: req.session.user ? req.session.user : null,
				blogs: blogs,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		})
};