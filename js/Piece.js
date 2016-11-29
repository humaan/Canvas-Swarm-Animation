/**
 * 
 * 	Pieces Collection
 * 
 */
function PiecesCollection(){
	this.pieces = [];
	this.add = function(piece){
		this.pieces.push(piece);
	};
};

PiecesCollection.prototype.setJitterFactor = function(jitter_factor) {
	for (var i=0;i<this.pieces.length;i++){
		var piece = this.pieces[i];
		piece.jitter_factor = jitter_factor;
	}
};








/**
 * 	
 * 	Piece
 * 	
 */
function Piece(opts){
	var defaults = {
		x : 0,
		y : 0,
		//jitter : function(){}
	};
	var _opts = $.extend({}, defaults, opts);
	this.point = new Point(_opts.x, _opts.y);
	this.presentationPoint = new Point(_opts.x, _opts.y);
	this.tweens = [];
	//this.jitter = _opts.jitter;
};


//Draw method
Piece.prototype.draw = function(canvas) {
	//Subclasses define their own drawing method
};

//Any calculations that need to be made on the presentation layer's point? ie. tweens etc
Piece.prototype.update = function(){
	var self = this;

	self.doTween();

};


Piece.prototype.doTween = function(){

	var self = this;
	
	var tween = null;
	for (var i=0;i<self.tweens.length;i++){
		var the_tween = self.tweens[i];
		if (the_tween.started){
			tween = the_tween;
			break;
		}
	}

	if ( !tween ){
		return;
	}
	
	var now = new Date().getTime();
	var delta = now - tween.started;

	if ( delta >= tween.duration ){

		//Tween completed, update the model to the target layer
		self.point.x = tween.to.x;
		self.point.y = tween.to.y;

		//Matching presentation layer
		self.presentationPoint.x = tween.to.x;
		self.presentationPoint.y = tween.to.y;

		//Remove current tween and move on to the next one, unless it's a repeating tween
		if ( !tween.repeat ){
			
			self.tweens.splice(0,1);
			if ( self.tweens.length > 0){
				var next_tween = self.tweens[0];
				next_tween.from = next_tween.original_from = new Point( this.presentationPoint.x, this.presentationPoint.y );
				next_tween.start();
			}

		} else {

			//Flip the from/to
			tween.reversing = !tween.reversing;

			if (tween.reversing){
				tween.to = tween.original_from;
			} else {
				tween.to = tween.original_to;
			}

			tween.from = new Point( this.presentationPoint.x, this.presentationPoint.y );
			tween.start();
		}
		

	} else {

		var range_x = tween.to.x - tween.from.x;
		var range_y = tween.to.y - tween.from.y;

		var current_x = tween.easing( delta, tween.from.x, range_x, tween.duration);
		var current_y = tween.easing( delta, tween.from.y, range_y, tween.duration);

		self.presentationPoint.x = current_x;
		self.presentationPoint.y = current_y;

	}
};


//Subclasses should define their own jitter function
Piece.prototype.jitter = function(point){
	return point;
};



Piece.prototype.clearTweens = function(){
	var self = this;
	self.tweens = [];
	this.point = new Point( this.presentationPoint.x, this.presentationPoint.y );
	return self;
};


Piece.prototype.addTween = function (tween){

	var self = this;
	
	self.tweens.push( tween );

	if ( self.tweens.length == 1 ){
		//Start immediately
		tween.from = tween.original_from = new Point( this.presentationPoint.x, this.presentationPoint.y );

		this.point = new Point( this.presentationPoint.x, this.presentationPoint.y );
		self.tweens[0].start();
	}

	return self;
};









