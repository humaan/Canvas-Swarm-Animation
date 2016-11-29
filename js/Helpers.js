

/**
 *
 * 	Helper Functions
 * 	
 */
var Helpers = {

	/**
	 * 	Random
	 * 	- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	 * 	
	 */
	Random : {

		getRandomInt : function(min,max){
			return Math.floor(Math.random() * (max - min)) + min;
		},

		getRandomIntInclusive : function(min,max){
			return Helpers.Random.getRandomInt(min,max+1);
		},

		getRandomIndex : function(source_array){
			var min = 0;
			var max = source_array.length;
			var index = Helpers.Random.getRandomInt( 0, max );
			return index;
		}

	},


	/**
	 *  
	 *  Easing functions
	 *  http://gizma.com/easing/
	 *  t : current time
	 *  b : start value
	 *  c : change in value
	 *  d : duration
	 *  
	 */
	Easing : {

		linear : function(t,b,c,d){
			return c*t/d + b;
		},

		easeInOutQuad : function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		},

		easeOutQuad : function (t, b, c, d) {
			t /= d;
			return -c * t*(t-2) + b;
		},
		
		easeInQuad : function (t, b, c, d) {
			t /= d;
			return c*t*t + b;
		}

	}

	

};




/**
 *
 * 	Point Struct
 * 	
 */
function Point(x,y){
	this.x = x;
	this.y = y;
};