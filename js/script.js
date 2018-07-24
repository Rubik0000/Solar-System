function main()
{
	let canvas = document.getElementById("mainCanvas"); 
	let ctx = canvas.getContext("2d"); 
	canvas.width = $("body").width();
	canvas.height = $("body").height();
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
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
			draw : (x, y) => {
				ctx.beginPath();
				ctx.fillStyle = "grey"; 
				ctx.arc(x, y, 10, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			},

			getCoords : t => {
				let x = Math.cos(t) * 80;
				let y = Math.sin(t) * 80;		
				return {x : x, y : y};
			}
		}
	};

	/*let p1 = new SpaceObject(ctx, (t) => {
		let x = Math.cos(t / 2) * 100;
		let y = Math.sin(t / 2) * 100;		
		return {x : x, y : y};
		},
		[
			new SpaceObject
			(
				ctx, 
				(t) => {
					let x = Math.cos(t) * 50;
					let y = Math.sin(t) * 50;		
					return {x : x, y : y};  	
				},
				[ 
					new SpaceObject(ctx, (t) => {
						let x = Math.cos(t * 2) * 30;
						let y = Math.sin(t * 2) * 30;		
						return {x : x, y : y};
					})  	
				]
			)
		]
	);*/
	//let p2 = new SpaceObject(4000, 30, ctx, () => 50);
    let sun = new SpaceObject(
        system.sun.getCoords, 
        system.sun.draw,
        new SpaceObject(() => { return {x : 300, y : 300} } , undefined, undefined, undefined, 300, 300)
    );
    let earth = new SpaceObject(
        system.earth.getCoords, 
        system.earth.draw,
        sun
    );
    let moon = new SpaceObject(system.moon.getCoords, system.moon.draw, earth);
    earth.addSatellites([moon]);

    sun.addSatellites([earth]);

    pl = [
        sun
    ];
	requestAnimationFrame(function anim(time){
	   //angle += (time - prev) * 0.002;
	   ctx.fillStyle = "black";
	   ctx.fillRect(0, 0, canvas.width, canvas.height);
	   //ctx.clearRect(0, 0, 100, 100);
	   pl.forEach(planet => {
	   	planet.move(time * 0.002);
	   });

	   requestAnimationFrame(anim);
	});
}


/**
 *
 * @param u - the gravity parameter
 * @param r - the distance between central object and rotating object
 * @param a - the length of Semi-major axe of ellipse
 */
function getOrbitalSpeed(u, r, a) 
{
	return Math.sqrt( u * (2 / r - 1 / a) );
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
	constructor(
        getDecCoords = () => { return { x : 0, y : 0 }; }, 
        draw = () => {}, 
        parrent/* = new SpaceObject()*/,
        satellites = [],
        x = 0,
        y = 0) 
    {
		this._x = x;
		this._y = y;
		this.getDecCoords = getDecCoords;
		this.draw = draw;
        this.parrent = parrent;
		this.satellites = satellites;
		//this.ctx = ctx;
	}

	/*draw() {	

	}*/

	move(t, centX, centY) {
		//this.hide();
		let {x, y} = this.getDecCoords(t);
		this._x = x + this.parrent._x;
		this._y = y + this.parrent._y;
		this.satellites.forEach((sat) => {
			sat.move(t, this._x, this._y);
		});
		this.draw(this._x, this._y);
	}

    addParent(parrent) {
        this.parrent = parrent;
    }

    addSatellites(satellites) {
        this.satellites = satellites;
    }
}

/*class Earth extends SpaceObject {
	draw() {
		this.ctx.beginPath();
		this.ctx.fillStyle = "blue"; 
		this.ctx.arc(this._x, this._y, 20, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}
}*/

main();













