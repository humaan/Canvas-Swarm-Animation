
var canvas, canvas_dom;
var shapes, piece_collection;
var renderer;
var current_shape = 'blankcanvas';





$(function(){

	//On-screen UI
	$('button').click(function(){
		var shape_name = $(this).data('shape')
		var shape = shapes.get( shape_name );
		if (shape){
			current_shape = shape_name;
			makeShape( shape );
		}
	});

	canvas_dom = $('#canvas');
	canvas = canvas_dom[0];

	var window_width = $(window).width();
	var window_height = $(window).height();

	canvas.width = window_width * 2;
	canvas.height = window_height * 2;
	canvas_dom.css({
		width: window_width,
		height: window_height
	});

	initShapes();
	initParticles();

	//Some simple resize-handling for aesthetics: we resize the canvas recreate the current shape onto the newly sized canvas
	$(window).resize(function(){
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){

			renderer.stop();

			var window_width = $(window).width();
			var window_height = $(window).height();

			canvas.width = window_width * 2;
			canvas.height = window_height * 2;
			canvas_dom.css({
				width: window_width,
				height: window_height
			});

			//Reinitialize shape to reset centres
			recenterShapes();
			makeShape( shapes.get( current_shape ) );

			renderer.start();

		}, 250);
	});

});





function initShapes(){

	shapes = new ShapesCollection();

	/**
	 * 	Initialize a shape with just rectangular dimensions (not an image)
	 *
	 * 	Spread:
	 * 	If specified the image will be divided by the spread factor to reduce the number available pixels. The available pixels
	 * 	are then readjusted back up with the spread factor, this is done to encourage more space between particles.
	*/
	shapes.add('blankcanvas', new Shape({
		width : canvas.width + 400,
		height : canvas.height + 400,
		offset : {
			x : -200,
			y : -200
		},
		spread : 5
	}));

	/**
	 * 
	 *	Template Images:
	 *		- img/circle.png (natural dimensions 100 x 100)
	 *		- img/triangle.png (natural dimensions 100 x 100)
	 *		- img/heart.png (natural dimensions 500 x 500)
	 *		- img/lee.png (natural dimensions 379 x 492)
	 *
	 * 	note:
	 * 	The actual shape template may rescale and reposition the shapes within the canvas. We're using data-urls in this demo
	 * 	however you can also use file URLs, but you may need to bind the start run method to the shapes' loaded callback
	 *
	 * 	ie.
	 *		shapes.add('foo', new Shape({
	 *			...
	 *			loaded : function(shape){
	 *				if (shapes.loaded()){
	 *					renderer.start();
	 *				}
	 *			}
	 *		}))
	 * 
	 */
	var circle_img = $('img#circle');
	shapes.add('circle', new Shape({
		src : circle_img.attr('src'),
		width: circle_img.attr('width'), // x 5
		height: circle_img.attr('height'), // x 5
		offset : {
			x : (canvas.width - circle_img.attr('width'))/ 2,
			y : (canvas.height - circle_img.attr('height'))/ 2
		},
		spread : 20
	}));

	var triangle_img = $('img#triangle');
	shapes.add('triangle', new Shape({
		src : triangle_img.attr('src'),
		width: triangle_img.attr('width'), // x 5
		height: triangle_img.attr('height'), // x 5
		offset : {
			x : (canvas.width - triangle_img.attr('width'))/ 2,
			y : (canvas.height - triangle_img.attr('height'))/ 2
		},
		spread : 20
	}));

	var heart_img = $('img#heart');
	shapes.add('heart', new Shape({
		src : heart_img.attr('src'),
		width: heart_img.attr('width'), // x 2
		height: heart_img.attr('height'), // x 2
		offset : {
			x : (canvas.width - heart_img.attr('width'))/2,
			y : (canvas.height- heart_img.attr('height'))/2
		},
		spread : 18
	}));

	var lee_img = $('img#lee');
	shapes.add('lee', new Shape({
		src : lee_img.attr('src'),
		width: lee_img.attr('width'), // x 1.5
		height : lee_img.attr('height'), // x 1.5
		offset : {
			x : (canvas.width - lee_img.attr('width'))/2,
			y : (canvas.height - lee_img.attr('height'))/2
		},
		spread : 18
	}));
	
}





/**
 * 
 * Recalculate shape offsets to center them on the canvas, used for window resize-handling in the demo
 * 
 */
function recenterShapes(){

	for (var shape_key in shapes.shapes){

		var img = $('img#' + shape_key);
		if ( img.length == 0 ){
			continue;
		}

		var shape = shapes.get( shape_key );
		shape.opts.offset.x = (canvas.width - img.attr('width')) / 2;
		shape.opts.offset.y = (canvas.height - img.attr('height')) / 2;

		//Reprocess visible pixels
		shape.process();
	}

	//Special case for blankcanvas
	var blankcanvas = shapes.get( 'blankcanvas' );
	blankcanvas.opts.width = canvas.width + 400;
	blankcanvas.opts.height = canvas.height + 400;
	blankcanvas.process();

}





/**
 * 
 * Initialize all the particles on the canvas and start the renderer process
 * 
 */
function initParticles(){

	piece_collection = new PiecesCollection();

	// Particle image img/particle.png (natural dimensions 24 x 21)
	var particle_img = $('img#particle');

	//Initialize 500 particles Just put it at a random location on the canvas
	var spots = shapes.get('blankcanvas').getVisiblePixels();

	for (var i=0;i<500;i++){

		var random_index = Helpers.Random.getRandomIndex(spots);
		var point = spots.splice( random_index, 1 )[0];

		//Bubble Piece
		piece_collection.add(new BubblePiece({
			x : point.x,
			y : point.y,
			scale : (Helpers.Random.getRandomIntInclusive(5,10)/10),
			img : particle_img,
			img_width : particle_img.attr('width'),
			img_height : particle_img.attr('height'),
			jitter_radius : Helpers.Random.getRandomIntInclusive(1,5),
			jitter_speed : Helpers.Random.getRandomIntInclusive(800,1000)
		}));

		//Or alternatively a Circle Piece
		/*
		piece_collection.add(new CirclePiece({
			x : point.x,
			y : point.y,
			radius : 6,
			fillStyle : 'rgba(255,0,0,1)'
		}));
		*/

	}

	//Initialize the Renderer
	renderer = new Renderer({
		canvas : canvas,
		draw : function(r){
			for (var i=0;i<piece_collection.pieces.length; i++){
				var piece = piece_collection.pieces[i];
				piece.draw( r.canvas );
			}
		}
	});

	//Finally start
	renderer.start();
	
}



/**
 * 
 * A helper function to transition from one shape to the next, this function demonstrates a transition to a target shape via 
 * an intermediate random explosion
 * 
 */
function makeShape( shape ){

	//Blow it up first
	var blankcanvas = shapes.get('blankcanvas');
	toShape(blankcanvas, {
		'easing' : 'easeOutQuad',
		'speed' : 300
	});

	//.. then transition to shape
	toShape(shape, {
		'easing' : 'easeInOutQuad',
		'speed' : 500,
		'additive' : true
	});

}





/**
 *
 * The gist of morphing a swarm into a shape is by iterating all the pieces in the collection, find an available spot on
 * the target shape, and tweening the position of the piece towards the target spot
 * 
 */
function toShape( shape, opts ){

	var defaults = {
		easing : 'easeOutQuad',
		speed : 2000,
		additive : false,
		random : false,
		range : 0,
		repeat : false
	};

	var _opts = $.extend({}, defaults, opts);

	var spots = shape.getVisiblePixels();

	for (var i=0;i<piece_collection.pieces.length;i++){

		var piece = piece_collection.pieces[i];

		//Find a spot
		if ( spots.length > 0 ){

			//Find a solid point on the image
			var random_index = Helpers.Random.getRandomIndex(spots);
			var point = spots.splice( random_index, 1 )[0];

		} else {

			//Random point on canvas
			var x = Helpers.Random.getRandomIntInclusive(0, canvas.width-1);
			var y = Helpers.Random.getRandomIntInclusive(0, canvas.height-1);
			var point = new Point(x,y);
		}
		
		var speed = _opts.speed;
		if ( _opts.random && ( _opts.range > 0 ) ){
			speed = _opts.speed - Math.round( _opts.range/2 ) + Helpers.Random.getRandomIntInclusive( 0, _opts.range );
		}

		var tween = new Tween({
			from : piece.presentationPoint,
			to : new Point(point.x, point.y),
			easing : _opts.easing,
			duration : speed,
			repeat : _opts.repeat
		});

		if ( !_opts.additive ){
			piece.clearTweens();
		}

		piece.addTween(tween);

	}


}





