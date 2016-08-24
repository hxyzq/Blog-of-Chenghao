/**
 * Created by wch on 16/8/24.
 */

var config = require('../config');
var EventProxy = require('eventproxy');

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
				title: '标签' + ' · ' + config.blogName,
				user: req.session.user ? req.session.user : null,
				tags: tags,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
};

// show all blogs of one tag
exports.showBlogs = function (req, res, next) {

	var ep = new EventProxy();
	ep.all('tag', 'blogs', function (tag, blogs) {
		return res.render('tags/tag', {
			title: tag.name + ' · ' + config.blogName,
			user: req.session.user ? req.session.user : null,
			blogs: blogs,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	ep.fail(function (err) {
		req.flash('error', err);
		return res.redirect('/tags');
	});

	Tag.findById(req.params.id, ep.done('tag'));
	Blog
		.find({'tags': req.params.id})
		.populate('tags')
		.exec(ep.done('blogs'));

};