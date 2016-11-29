
/**
 *
 * 	Shapes Collection
 * 	
 */
function ShapesCollection(){
	this.shapes = {};

	//Adding
	this.add = function(key, shape){
		this.shapes[key] = shape;
	};

	//Checking
	this.loaded = function(){
		var loaded = true;
		for (var key in this.shapes){
			var shape = this.shapes[key];
			if ((shape == null)||(shape.loaded == false)){
				loaded = false;
				break;
			}
		}
		return loaded;
	};

	this.get = function(key){
		return this.shapes[key];
	};
}



/**
 *
 * 	Shape
 * 	
 */
function Shape(opts){
	//Properties
	var self = this;
	this.loaded = false;

	var defaults = {
		src : '',
		width : 0,
		height: 0,
		offset : {
			x : 0,
			y : 0
		},
		//Spread factor, the image will be downsized then the coordinates multiplied by this to encourage a pixel spread 'margin'
		spread : 1,
		loaded : function(){}
	};
	
	var _opts = $.extend({}, defaults, opts);

	this.opts = _opts;
	this.imageData = null;
	

	if ( this.opts.src != '' ){

		this.img = $('<img/>');
		this.img.bind('load', function(){
			self.loaded = true;
			self.process();
			self.opts.loaded(self);
		});
		this.img.attr('src', _opts.src);

	} else {

		//Array of points
		self.process();
		self.loaded = true;
		self.opts.loaded(self);

	}

	
}

//Read the image data
Shape.prototype.process = function() {
	var self = this;

	//Array of points
	this.visiblePixels = [];

	var width = Math.round( self.opts.width / self.opts.spread );
	var height = Math.round( self.opts.height / self.opts.spread );

	if ( this.img ){

		var canvas_dom = $('<canvas width="' + width + '" height="' + height + '">');
		var canvas = canvas_dom[0];
		var ctx = canvas.getContext('2d');
		ctx.drawImage(self.img[0], 0, 0, width, height);

		self.imageData = ctx.getImageData(0,0, canvas.width, canvas.height);

		for (var y=0; y<height; y++){
			for (var x=0; x<width; x++){
				//We're only reading the alpha value rgba (fourth position)
				//Looking at x,y
				var alpha_index = ((y * width * 4) + (x * 4) ) + 3;
				var alpha = self.imageData.data[alpha_index];
				if (alpha > 0){
					self.visiblePixels.push( new Point((x*self.opts.spread) + self.opts.offset.x, (y*self.opts.spread) + self.opts.offset.y ) );
				}
			}
		}

	} else {

		for (var x=0;x<width;x++ ){
			for (var y=0;y<height;y++ ){
				self.visiblePixels.push( new Point( (x * self.opts.spread ) + this.opts.offset.x, (y * self.opts.spread ) + this.opts.offset.y ) );
			}
		}

	}

	
};


Shape.prototype.getVisiblePixels = function(){
	return this.visiblePixels.slice(0);
};

