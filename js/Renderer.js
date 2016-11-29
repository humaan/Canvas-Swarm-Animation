/**
 * 	
 * 	Renderer is a manager for the run loop consisting of the following phases
 * 	- clear
 * 	- draw
 * 	- queue
 *
 *	The draw method by default does nothing, we'll need to pass a custom method 
 *	through the constructor to run at each draw phase 
 *	
 */
function Renderer(opts){

	var defaults = {
		canvas : null,
		draw : function(){}
	};
	
	var _opts = $.extend({}, defaults, opts);

	this.stopped = false;
	this.request_id = null;

	this.canvas = _opts.canvas;
	this.ctx = this.canvas.getContext('2d');

	this.draw_function = _opts.draw;
}


Renderer.prototype.stop = function(){
	var self = this;
	self.stopped = true;
	window.cancelAnimationFrame( self.request_id );
	self.request_id = null;
};

Renderer.prototype.start = function(){
	var self = this;
	self.stopped = false;
	self.loop();
};


Renderer.prototype.loop = function() {
	var self = this;

	if ( self.stopped ){
		return;
	}

	self.clear();
	self.draw();
	self.queue();

};

Renderer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	return this;
};

Renderer.prototype.draw = function(){
	var self = this;
	//Renderer is passed into the user-defined draw_function
	self.draw_function(self);
	return self;
};

Renderer.prototype.queue = function() {
	var self = this;
	self.request_id = window.requestAnimationFrame(function(){
		self.loop.apply(self);
	});
};