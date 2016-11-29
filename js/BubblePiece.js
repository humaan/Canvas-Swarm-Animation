/**
 * 
 *	Bubble Piece (inerhits from Piece)
 * 
*/
function BubblePiece(opts){
	Piece.call(this, opts);

	var defaults = {
		x : 0,
		y : 0,
		scale : 1,
		img : null,
		//Natural dimensions
		img_width : 0,
		img_height : 0,
		jitter_factor : 1,
		jitter_radius : 10,
		jitter_speed : 1000
	};


	var _opts = $.extend({}, defaults, opts);
	this.point = new Point(_opts.x, _opts.y);
	this.presentationPoint = new Point(_opts.x, _opts.y);
	this.scale = _opts.scale;

	this.img = _opts.img;
	this.img_width = _opts.img_width;
	this.img_height = _opts.img_height;

	//Jitter
	this.jitter_factor = _opts.jitter_factor;
	this.jitter_radius = _opts.jitter_radius;
	this.jitter_speed = _opts.jitter_speed;
}

BubblePiece.prototype = new Piece();
BubblePiece.prototype.constructor = BubblePiece;

BubblePiece.prototype.draw = function(canvas){

	var self = this;

	//Update
	self.update();

	//Draw
	var point = self.jitter(self.presentationPoint);

	var ctx = canvas.getContext('2d');
	var scaled_width = self.scale * self.img_width;
	var scaled_height = self.scale * self.img_height;

	ctx.drawImage(self.img[0], point.x - (scaled_width/2), point.y - (scaled_height/2), scaled_width, scaled_height );

};



BubblePiece.prototype.jitter = function(source){

	var self = this;

	var point = new Point(source.x, source.y);

	/**
	 * 	Circular orbit
	 * 	- x = cx + r * cos(a)
	 * 	- y = cy + r * sin(a)
	 * 	note A is in radians
	 */
	 
	//How fast for a full rotation 360deg or 2PI
	var speed = self.jitter_speed;
	
	//Calculate phase
	var now = new Date().getTime();
	var rem = now % speed;
	var phase = rem/speed;
	var angle = phase * (2 * Math.PI);
	var radius = self.jitter_radius * self.jitter_factor;

	point.x = point.x + radius * Math.cos(angle);
	point.y = point.y + radius * Math.sin(angle);
	

	return point;
};
