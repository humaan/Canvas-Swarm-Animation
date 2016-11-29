/*
	Circle Piece
*/
function CirclePiece(opts){
	Piece.call(this, opts);

	var defaults = {
		x : 0,
		y : 0,
		radius : 5,
		fillStyle : 'rgba(0,0,0,1)'
	};
	var _opts = $.extend({}, defaults, opts);
	this.point = new Point(_opts.x, _opts.y);
	this.presentationPoint = new Point(_opts.x, _opts.y);
	this.radius = _opts.radius;
	this.fillStyle = _opts.fillStyle;
}

CirclePiece.prototype = new Piece();
CirclePiece.prototype.constructor = CirclePiece;

CirclePiece.prototype.draw = function(canvas){

	var self = this;

	//Update
	self.update();

	//Draw
	var point = self.jitter(self.presentationPoint);

	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.arc(point.x, point.y, self.radius, 0, 2 * Math.PI, false );
	ctx.fillStyle = self.fillStyle;
	ctx.fill();

};



CirclePiece.prototype.jitter = function(source){
	return source;
};
