function main()
{
	// let canvas = document.getElementById("mainCanvas"); 
	// let ctx = canvas.getContext("2d"); 
	// canvas.width = $("body").width();
	// canvas.height = $("body").height();
	// ctx.fillStyle = "black";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);
	let system = {
        sun : {
            draw : (x, y) => {
                ctx.beginPath();
                ctx.fillStyle = "yellow"; 
                ctx.arc(x, y, 80, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            },

            getCoords : t => { return { x : 0, y : 0 }; }

        },

		earth : {
			draw : (x, y) => {
				ctx.beginPath();
				ctx.fillStyle = "blue"; 
				ctx.arc(x, y, 30, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			},

			getCoords : t => {
				let x = Math.cos(t / 2) * 200;
				let y = Math.sin(t / 2) * 200;		
				return {x : x, y : y}; 
			}
		},

		moon : {
			draw : canvas => {
        console.log($(canvas).width());
				$(canvas).drawArc({
          fillStyle: 'black',
          x: 20, 
          y: 20,
          radius : 20,
          //fromCenter : false,
        });
        // ctx.beginPath();
				// ctx.fillStyle = "grey"; 
				// ctx.arc(0, 0, 10, 0, Math.PI * 2);
				// ctx.fill();
				// ctx.closePath();
			},

			getCoords : t => {
				let x = Math.cos(t) * 80;
				let y = Math.sin(t) * 80;		
				return {x : x, y : y};
			}
		}
	};

  let dr1 = new CanvasDrawingObject(canvas => {
    canvas.width = 40;
    canvas.height = 50;
    $(canvas).drawArc({
      fillStyle: 'grey',
      x: 20, 
      y: 20,
      radius : 20,
    });
    $(canvas).on("click", () => console.log("pizda"));
  });

  let dr2 = new CanvasDrawingObject(canvas => {
    canvas.width = 30;
    canvas.height = 30;
    $(canvas).drawArc({
      fillStyle: 'red',
      x: 15, 
      y: 15,
      radius : 15,
    });
  });

  let planet2 = new SpaceObject({
    drawingObj : dr2,
    getDecCoords : system.moon.getCoords,
  });

  let planet1 = new SpaceObject({
    drawingObj : dr1,
    parrent : { x : 300, y : 300 },
    getDecCoords : system.earth.getCoords,
    satellites : [ planet2 ]
  });

  // let planet2 = new SpaceObject({
  //   parrent : { x : 300, y : 400 },
  // }); 
	requestAnimationFrame(function anim(time){
	   //angle += (time - prev) * 0.002;
	   //ctx.fillStyle = "black";
	   //ctx.fillRect(0, 0, canvas.width, canvas.height);
	   //ctx.clearRect(0, 0, 100, 100);
	   
	  planet1.move(time * 0.002);
    //planet2.move(time * 0.002);
	   

	   requestAnimationFrame(anim);
	});
}

/**
 *
 *
 * @param {object} ctx - context object of canvas
 * @param {function} getDecCoords - parametric function that get coordinates in
 * Cartesian coordinate system
 * @param {array} - an array of SpaceObject-like objects 
 * that are satellites of this object
 */
class SpaceObject {
  constructor({
    drawingObj = new CanvasDrawingObject(),
    getDecCoords = () => { return { x : 0, y : 0 }; }, 
    parrent = { x : 0, y : 0 },
    satellites = [],
  }) 
  {
  	this.getDecCoords = getDecCoords;
    if (!(drawingObj instanceof AbstractDrawingObject)) {
      throw new Error("It is not instanceof AbstractDrawingObject");
    }
    this._drawingObj = drawingObj;
    this._parrent = parrent;
  	this._satellites = satellites;

    this._satellites.forEach(sat => {
      sat.addParent(this);
    });
    this._drawingObj.draw();
  }

  get x() { return this._drawingObj.x; }
  get y() { return this._drawingObj.y; }

  move(t) {
  	//this.hide();
  	let {x, y} = this.getDecCoords(t);
  	this._drawingObj.x = x + this._parrent.x;
  	this._drawingObj.y = y + this._parrent.y;
  	this._satellites.forEach((sat) => {
  		sat.move(t);
  	});
  }

  addParent(parrent) {
    this._parrent = parrent;
  }

  addSatellites(satellites) {
    this._satellites = satellites;
  }
}//class SpaceObject


class AbstractDrawingObject {
  constructor() {}

  get x() {return 0;}
  get y() {return 0;}
  set x(value) {}
  set y(value) {}
  draw() {}
}


class CanvasDrawingObject extends AbstractDrawingObject {
  constructor(drawCanvasFunc = () => {}) {
    super();
    this._drawCanvasFunc = drawCanvasFunc;
    this._canvas = document.createElement("canvas");
    $(this._canvas).css("position", "absolute");
    this._drawCanvasFunc(this._canvas);
  }

  get x() { return $(this._canvas).position().left; }

  get y() { return $(this._canvas).position().top; }

  set x(value) { $(this._canvas).css("left", value); }

  set y(value) { return $(this._canvas).css("top", value); }

  draw() {
    this._drawCanvasFunc(this._canvas);
    $("body").append(this._canvas);
  }
}

main();













