/**
 * Created by wch on 16/8/23.
 */

var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {
	server: { poolSize: 20 }
}, function (err) {
	if (err) {
		console.log(err);
	}
});

require('./blog');
require('./tag');


exports.Blog = mongoose.model('Blog');
exports.Tag = mongoose.model('Tag');