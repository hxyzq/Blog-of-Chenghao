/**
 * Created by wch on 16/8/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title: String,
	content: String,
	user: String,
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	tags: [ String ]
});

BlogSchema.index({ create_at: -1 });

mongoose.model('Blog', BlogSchema);