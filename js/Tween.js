/**
 *
 * 	xy Position Tween
 * 	
 */
function Tween(opts){

	var defaults = {
		/*
			from values will get populated first time tween runs
		*/
		to : {
			x : 0,
			y : 0
		},
		easing : 'linear',
		duration : 1000,
		repeat : false
	};
	
	var _opts = $.extend({}, defaults, opts);

	this.started = null;
	this.duration = _opts.duration;

	this.repeat = _opts.repeat;
	this.reversing = false;

	this.original_from = {
		x : null,
		y : null
	};

	this.original_to = {
		x : _opts.to.x,
		y : _opts.to.y
	};

	this.to = _opts.to;

	this.start = function(){
		this.started = new Date().getTime();
	};

	if ( _opts.easing in Helpers.Easing ){
		this.easing = Helpers.Easing[_opts.easing];
	} else {
		this.easing = Helpers.Easing.linear;
	}
};

Tween.prototype.setFrom = function(from){
	this.from = from;
	this.original_from = from;
};





