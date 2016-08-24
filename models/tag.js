/**
 * Created by wch on 16/8/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name: String,
	blog_count: { type: Number, default: 1 }
});

mongoose.model('Tag', TagSchema);