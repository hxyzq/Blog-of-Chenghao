/**
 * Created by wch on 16/8/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = require('./index').Tag;

var BlogSchema = new Schema({
	title: String,
	content: String,
	user: String,
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
});

BlogSchema.index({ create_at: -1 });

mongoose.model('Blog', BlogSchema);