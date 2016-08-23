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



exports.Blog = mongoose.model('Blog');