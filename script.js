function helloWorld() {
	console.log("Hello World!");
}

var hversion = document.getElementById("version").innerHTML

var cversion = getComputedStyle(document.documentElement).getPropertyValue('--version');

var jversion = "1";

async function checkVersion() {
  console.log(hversion);
  console.log(jversion);
  console.log(cversion);
  if (hversion != cversion) {
    console.log("Clear cache.");
    window.location.reload(true);
  } else if (hversion != jversion) {
    console.log("Clear cache.");
    window.location.reload(true);
  } else {
    console.log("All good.");
  }
}

// Canvas Variables
var grid = document.getElementById("grid");
var ctx = grid.getContext("2d");
var width = grid.width;
var height = grid.height;
var type = [19, 19];

function drawGrid() {
	/*for (i=0; i<(type[0] + 1); i++) {
		var cornerx = ((width/type[0])*i)
		for (j=0; j<(type[1] + 1); j++) {
			var cornery = ((height/type[1])*j)
			// Left
			ctx.moveTo(cornerx, cornery);
			ctx.lineTo(cornerx, (height/type[1]));
			ctx.stroke();
			// Right
			ctx.moveTo((width/type[0]), cornery);
			ctx.lineTo((width/type[0]), (height/type[1]));
			ctx.stroke();
			// Top
			ctx.moveTo(cornerx, cornery);
			ctx.lineTo((width/type[0]), cornery);
			ctx.stroke();
			// Bottom
			ctx.moveTo(cornerx, (height/type[1]));
			ctx.lineTo((width/type[0]), (height/type[1]));
			ctx.stroke();
		}
	}*/
	
	cellw = (width/type[0]);
	cellh = (height/type[1]);
	
	// Horizontal
	for (i=0; i<(type[1] + 1); i++) {
		ctx.moveTo(0, (cellh*i));
		ctx.lineTo(width, (cellh*i));
		ctx.stroke();
	}
	// Verticle
	for (i=0; i<(type[0] + 1); i++) {
		ctx.moveTo((cellw*i), 0);
		ctx.lineTo((cellw*i), height);
		ctx.stroke();
	}
}

function fillCell(x, y, w, h, c) {
	var cellw = (width/type[0]);
	var cellh = (height/type[1]);
	ctx.beginPath();
	/*if (x > type[0]) {
		document.getElementById("error").innerHTML = "Whoops! Invalid Coordinate!";
		return;
	}
	if (y > type[1]) {
		document.getElementById("error").innerHTML = "Whoops! Invalid Coordinate!";
		return;
	}*/
	var startx = (cellw*x);
	var starty = (cellh*y);
	var fw = (cellw*w);
	var fh = (cellh*h);
	if (c == false) {
		ctx.clearRect(startx, starty, fw, fh);
	} else {
		ctx.rect(startx, starty, fw, fh);
		ctx.fillStyle = c;
		ctx.fill();
	}
}

function drawImageToCell(image, x, y, w, h) {
	var cellw = (width/type[0]);
	var cellh = (height/type[1]);
	var startx = (cellw*x);
	var starty = (cellh*y);
	ctx.beginPath();
	ctx.drawImage(image, startx, starty, cellw, cellh);
}

// PACMAN
var direction = "up";
var curcords = {"x": 9, "y": 7};
var prevcords = {"x": 9, "y": 7};
var ghosts = [[[9, 15], [9, 15], 1, "up"]];
var dots;
var bigdots = [[1, 2], [17, 2], [1, 16], [17, 16]];
var score = 0;
var runaway = false;
var runawayticks = 20;
var delay = 0;
var win;


//sounds
var chomp = document.getElementById("chomp");
var intro = document.getElementById("intro");
var death = document.getElementById("death");
var tada = document.getElementById("tada");

var htmlscore = document.getElementById("score");

var map = [
	// Colomn 0
	[0, 0],
	[0, 1],
	[0, 2],
	[0, 3],
	[0, 4],
	[0, 5],
	[0, 6],
	[0, 8],
	[0, 10],
	[0, 12],
	[0, 13],
	[0, 14],
	[0, 15],
	[0, 16],
	[0, 17],
	[0, 18],

	// Colomn 1
	[1, 0],
	[1, 6],
	[1, 8],
	[1, 10],
	[1, 12],
	[1, 18],

	// Colomn 2
	[2, 0],
	[2, 2],
	[2, 4],
	[2, 6],
	[2, 8],
	[2, 10],
	[2, 12],
	[2, 14],
	[2, 16],
	[2, 18],

	// Colomn 3
	[3, 0],
	[3, 2],
	[3, 4],
	[3, 6],
	[3, 7],
	[3, 8],
	[3, 10],
	[3, 11],
	[3, 12],
	[3, 14],
	[3, 16],
	[3, 18],

	// Column 4
	[4, 0],
	[4, 18],

	// Column 5
	[5, 0],
	[5, 2],
	[5, 4],
	[5, 5],
	[5, 6],
	[5, 7],
	[5, 8],
	[5, 10],
	[5, 11],
	[5, 12],
	[5, 13],
	[5, 14],
	[5, 16],
	[5, 18],

	// Column 6
	[6, 0],
	[6, 2],
	[6, 6],
	[6, 12],
	[6, 16],
	[6, 18],

	// Column 7
	[7, 0],
	[7, 2],
	[7, 4],
	[7, 6],
	[7, 8],
	[7, 9],
	[7, 10],
	[7, 12],
	[7, 14],
	[7, 16],
	[7, 18],

	// Column 8
	[8, 0],
	[8, 4],
	[8, 8],
	[8, 10],
	[8, 14],
	[8, 18],

	// Column 9
	[9, 0],
	[9, 1],
	[9, 2],
	[9, 4],
	[9, 5],
	[9, 6],
	[9, 8],
	[9, 10],
	[9, 12],
	[9, 13],
	[9, 14],
	[9, 16],
	[9, 17],
	[9, 18],

	// Column 10
	[10, 0],
	[10, 4],
	[10, 8],
	[10, 10],
	[10, 14],
	[10, 18],

	// Column 11
	[11, 0],
	[11, 2],
	[11, 4],
	[11, 6],
	[11, 8],
	[11, 9],
	[11, 10],
	[11, 12],
	[11, 14],
	[11, 16],
	[11, 18],

	// Column 12
	[12, 0],
	[12, 2],
	[12, 6],
	[12, 12],
	[12, 16],
	[12, 18],

	// Column 13
	[13, 0],
	[13, 2],
	[13, 4],
	[13, 5],
	[13, 6],
	[13, 7],
	[13, 8],
	[13, 10],
	[13, 11],
	[13, 12],
	[13, 13],
	[13, 14],
	[13, 16],
	[13, 18],

	// Column 14
	[14, 0],
	[14, 18],

	// Column 15
	[15, 0],
	[15, 2],
	[15, 4],
	[15, 6],
	[15, 7],
	[15, 8],
	[15, 10],
	[15, 11],
	[15, 12],
	[15, 14],
	[15, 16],
	[15, 18],
	
	// Column 16
	[16, 0],
	[16, 2],
	[16, 4],
	[16, 6],
	[16, 8],
	[16, 10],
	[16, 12],
	[16, 14],
	[16, 16],
	[16, 18],

	// Column 17
	[17, 0],
	[17, 6],
	[17, 8],
	[17, 10],
	[17, 12],
	[17, 18],

	// Column 18
	[18, 0],
	[18, 1],
	[18, 2],
	[18, 3],
	[18, 4],
	[18, 5],
	[18, 6],
	[18, 8],
	[18, 10],
	[18, 12],
	[18, 13],
	[18, 14],
	[18, 15],
	[18, 16],
	[18, 17],
	[18, 18],
]

function drawMap() {
	for (i=0; i<map.length; i++) {
		fillCell(map[i][0], map[i][1], 1, 1, "blue");
	}
}

function drawPacMan(x, y) {
	drawImageToCell(document.getElementById("pacman"), x, y, 1, 1);
}

function drawghost(x, y, c) {
	if (c == 1) {
		drawImageToCell(document.getElementById("redghost"), x, y, 1, 1);
	} else if (c == 2) {
		drawImageToCell(document.getElementById("blueghost"), x, y, 1, 1);
	}
}

function drawdot(x, y, c) {
	if (c == 1) {
		drawImageToCell(document.getElementById("smalldot"), x, y, 1, 1);
	} else if (c == 2) {
		drawImageToCell(document.getElementById("bigdot"), x, y, 1, 1);
	}
}

function move() {
	//console.log(curcords);
	//console.log(prevcords);
	if (direction == "up") {
		curcords.y -= 1;
	} else if (direction == "down") {
		curcords.y += 1;
	} else if (direction == "left") {
		curcords.x -= 1;
	} else if (direction == "right") {
		curcords.x += 1;
	}
	var stop = false;

	// don't let pacman go out of the map
	if ((curcords.x < 0) || (curcords.x > (type[0] - 1)) || (curcords.y < 0) || (curcords.y > (type[1] - 1))) {
		//curcords = prevcords;
		if (direction == "up") {
			curcords.y += 1;
		} else if (direction == "down") {
			curcords.y -= 1;
		} else if (direction == "left") {
			curcords.x += 1;
		} else if (direction == "right") {
			curcords.x -= 1;
		}
		stop = true;
	}
	var stopwalls = false

	// don't let pacman go through walls
	for (i=0; i<map.length; i++) {
		if ((map[i][0] == curcords.x) && (map[i][1] == curcords.y)) {
			if (direction == "up") {
				curcords.y += 1;
			} else if (direction == "down") {
				curcords.y -= 1;
			} else if (direction == "left") {
				curcords.x += 1;
			} else if (direction == "right") {
				curcords.x -= 1;
			}
			stopwalls = true;
		}
	}

	//onsole.log(curcords);
	if ((stop == false) && (stopwalls == false)) {
		drawPacMan(curcords.x, curcords.y);
		chomp.play();
		for (i=0; i < dots.length; i++) {
			if ((curcords.x == dots[i][0]) && (curcords.y == dots[i][1])) {
				score += 10;
				htmlscore.innerHTML = ("Score: " + score);
				dots.splice(i, 1);
			}
		}
		for (i=0; i < bigdots.length; i++) {
			if ((curcords.x == bigdots[i][0]) && (curcords.y == bigdots[i][1])) {
				runaway = true;
				bigdots.splice(i, 1);
				ghosts[0][2] = 2;
				runawayticks = 20;
			}
		}
		//console.log(prevcords);
		fillCell(prevcords.x, prevcords.y, 1, 1, "black");
		if (direction == "up") {
			prevcords.y -= 1;
		} else if (direction == "down") {
			prevcords.y += 1;
		} else if (direction == "left") {
			prevcords.x -= 1;
		} else if (direction == "right") {
			prevcords.x += 1;
		}
	}
}

var msdc = 0;

function moveghosts() {
	console.log("delay: " + delay);
	if (delay == 0) {
	var newdirection = determineghostdirection(0);
	if (newdirection != "same") {
		ghosts[0][3] = newdirection;
		msdc++;
	} else {
		console.log("Same.");
	}

	console.log("direction: " + ghosts[0][3]);
	const prevgcords = [ghosts[0][0][0], ghosts[0][0][1]];
	console.log(prevgcords);
	if (ghosts[0][3] == "up") {
		ghosts[0][0][1] -= 1;
	} else if (ghosts[0][3] == "down") {
		ghosts[0][0][1] += 1;
	} else if (ghosts[0][3] == "left") {
		ghosts[0][0][0] -= 1;
	} else if (ghosts[0][3] == "right") {
		ghosts[0][0][0] += 1;
	}

	drawghost(ghosts[0][0][0], ghosts[0][0][1], ghosts[0][2]);
	console.log(ghosts[0][0]);

	var prevcell = 0;
	for (i=0; i < dots.length; i++) {
		if ((prevgcords[0] == dots[i][0]) && (prevgcords[1] == dots[i][1])) {
			prevcell = 1;
		}
	}
	for (i=0; i < bigdots.length; i++) {
		if ((prevgcords[0] == bigdots[i][0]) && (prevgcords[1] == bigdots[i][1])) {
			prevcell = 2;
		}
	}
	if ((prevgcords[0] == curcords.x) && (prevgcords[1] == curcords.y)) {
		prevcell = 3;
	}
	if (prevcell == 0) {
		fillCell(prevgcords[0], prevgcords[1], 1, 1, "black");
	} else if (prevcell == 1) {
		drawdot(prevgcords[0], prevgcords[1], 1);
	} else if (prevcell == 2) {
		drawdot(prevgcords[0], prevgcords[1], 2);
	} else if (prevcell == 3) {
		drawPacMan(prevgcords[0], prevgcords[1]);
	}

	} else {
		console.log("DELAYED");
		delay -= 1;
	}
	if ((ghosts[0][0][0] == curcords.x) && (ghosts[0][0][1] == curcords.y)) {
		alive = false;
		if (runaway == true) {
			win = true;
		} else {
			win = false;
		}
	}

	/*if (ghosts[0][3] == "up") {
		ghosts[0][1][1] -= 1;
	} else if (ghosts[0][3] == "down") {
		ghosts[0][1][1] += 1;
	} else if (ghosts[0][3] == "left") {
		ghosts[0][1][0] -= 1;
	} else if (ghosts[0][3] == "right") {
		ghosts[0][1][0] += 1;
	}*/
}

function determineghostdirection(ghost) {
	var testcords = [ghosts[ghost][0][0], ghosts[ghost][0][1]];
	
	if (ghosts[ghost][3] == "up") {
		testcords[1] -= 1;
	} else if (ghosts[ghost][3] == "down") {
		testcords[1] += 1;
	} else if (ghosts[ghost][3] == "left") {
		testcords[0] -= 1;
	} else if (ghosts[ghost][3] == "right") {
		testcords[0] += 1;
	}

	var willhit = false;

	if ((testcords[0] < 0) || (testcords[1] < 0) || (testcords[0] > (type[0] - 1)) || (testcords[1] > (type[1] - 1))) {
		willhit = true;
	}

	for (i=0; i < map.length; i++) {
		if ((map[i][0] == testcords[0]) && (map[i][1] == testcords[1])) {
			willhit = true;
		}
	}

	if (msdc > 1) {
		willhit = true;
		msdc = 0;
	}

	if (willhit == false) {
		return "same";
	} else {
		console.log("Calculating...")
		var gg0 = ghosts[ghost][0][0];
		var gg1 = ghosts[ghost][0][1];
		var upcords = [gg0, (gg1 - 1)];
		var downcords = [gg0, (gg1 + 1)];
		var leftcords = [(gg0 - 1), gg1];
		var rightcords = [(gg0 + 1), gg1];

		for (i=0; i < map.length; i++) {
			if ((upcords[0] == map[i][0]) && (upcords[1] == map[i][1])) {
				upcords = false;
				console.log("Up would hit a wall.");
			}
			if ((downcords[0] == map[i][0]) && (downcords[1] == map[i][1])) {
				downcords = false;
				console.log("Down would hit a wall.");
			}
			if ((leftcords[0] == map[i][0]) && (leftcords[1] == map[i][1])) {
				leftcords = false;
			}
			if ((rightcords[0] == map[i][0]) && (rightcords[1] == map[i][1])) {
				rightcords = false;
			}
		}

		if (upcords != false) {
			var upd = distanceformula(upcords[0], upcords[1], curcords.x, curcords.y);
		} else {
			if (runaway == true) {
				var upd = 0;
			} else {
				var upd = 100;
			}
		}
		if (downcords != false) {
			var downd = distanceformula(downcords[0], downcords[1], curcords.x, curcords.y);
		} else {
			if (runaway == true) {
				var downd = 0;
			} else {
				var downd = 100;
			}
		}
		if (leftcords != false) {
			var leftd = distanceformula(leftcords[0], leftcords[1], curcords.x, curcords.y);
		} else {
			if (runaway == true) {
				var leftd = 0;
			} else {
				var leftd = 100;
			}
		}
		if (rightcords != false) {
			var rightd = distanceformula(rightcords[0], rightcords[1], curcords.x, curcords.y);
		} else {
			if (runaway == true) {
				var rightd = 0;
			} else {
				var rightd = 100;
			}
		}

		console.log("upd: " + upd + "; downd: " + downd + "; leftd: " + leftd + "; rightd: " + rightd);
		if (runaway == true) {
			console.log("RUN AWAY")
			var closest = Math.max(upd, downd, leftd, rightd);
			runawayticks -= 1;
			delay = 1;
			console.log("rat: " + runawayticks);
			if (runawayticks <= 0) {
				runaway = false;
				ghosts[0][2] = 1;
			}
		} else {
			var closest = Math.min(upd, downd, leftd, rightd);
		}
		console.log("Closest: " + closest);

		console.log("Reviewing...")
		if (upd == closest) {
			console.log("We go up.");
			return "up";
		} else if (downd == closest) {
			console.log("We go down.");
			return "down";
		} else if (leftd == closest) {
			console.log("We go left.");
			return "left";
		} else if (rightd == closest) {
			console.log("We go right.");
			return "right";
		}
	}
}

function distanceformula(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        console.log("Up!");
        direction = "up";
    }
    else if (e.keyCode == '40') {
        // down arrow
        console.log("Down!");
        direction = "down";
    }
    else if (e.keyCode == '37') {
       // left arrow
       console.log("Left!");
       direction = "left";
       /*if (direction == "up") {
		   direction = "left";
	   } else if (direction == "left") {
		   direction = "down";
	   } else if (direction == "down") {
		   direction = "right";
	   } else if (direction == "right") {
		   direction = "up";
	   }*/
    }
    else if (e.keyCode == '39') {
       // right arrow
       console.log("Right!");
       direction = "right";
       /*if (direction == "up") {
		   direction = "right";
	   } else if (direction == "left") {
		   direction = "up";
	   } else if (direction == "down") {
		   direction = "left";
	   } else if (direction == "right") {
		   direction = "down";
	   }*/
    }

}

function calculateDots() {
	var dots = [];
	for (i=0; i < type[0]; i++) {
		for (j=0; j < type[1]; j++) {
			var iswall = false;
			for (k=0; k < map.length; k++) {
				if ((i == map[k][0]) && (j == map[k][1])) {
					iswall = true;
				}
			}
			for (k=0; k < bigdots.length; k++) {
				if ((i == bigdots[k][0]) && (j == bigdots[k][1])) {
					iswall = true;
				}
			}
			if (iswall == false) {
				dots.push([i, j]);
			} else {
			}
		}
	}
	return dots;
}

function drawdots() {
	for (i=0; i < dots.length; i++) {
		drawdot(dots[i][0], dots[i][1], 1);
	}
	for (i=0; i < bigdots.length; i++) {
		drawdot(bigdots[i][0], bigdots[i][1], 2);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function go() {
	direction = "up";
	curcords = {"x": 9, "y": 7};
	prevcords = {"x": 9, "y": 7};
	ghosts = [[[9, 15], [9, 15], 1, "up"]];
	bigdots = [[1, 2], [17, 2], [1, 16], [17, 16]];
	score = 0;
	runaway = false;
	runawayticks = 20;
	delay = 0;
	win;

	htmlscore.style.color = "black";
	speed = 250;
	alive = true;
	drawMap();
	dots = calculateDots();
	drawdots();
	drawPacMan(curcords.x, curcords.y);
	intro.play();
	await sleep(5000);
	
	while (alive == true) {
		move();
		moveghosts();
		await sleep(speed);
	}
	if (win == true) {
		tada.play();
		htmlscore.style.color = "green";
	} else {
		death.play();
		htmlscore.style.color = "red";
	}
}