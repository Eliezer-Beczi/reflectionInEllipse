var WIDTH = 1024;
var HEIGHT = 640;

var C;
var A = 450;
var B = 300;

var NUM_OF_POINTS = 1;

var colors = [];
var collisionX = [];
var collisionY = [];

var symmetryX = [];
var symmetryY = [];

var intersectionX = [];
var intersectionY = [];

var currFocusX;
var distanceSlider;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	background(0);
	init();
}

function draw() {
	translate(WIDTH / 2, HEIGHT / 2);

	getSymmetryPoint();
	getIntersectionPoint();

	drawRay();
	// drawFoci();
	drawEllipse();

	updatePoints();
}

function init() {
	angleMode(DEGREES);

	C = sqrt(pow(A, 2) - pow(B, 2));

	for (let i = 0; i < NUM_OF_POINTS; ++i) {
		let aux = random(360);
		collisionX[i] = A * cos(aux);
		collisionY[i] = B * sin(aux);
		colors[i] = color(random(256), random(256), random(256), random(256));
	}

	currFocusX = -C;
	distanceSlider = createSlider(0, A, C);
	distanceSlider.position(WIDTH + 30, HEIGHT / 2);
}

function drawEllipse() {
	noFill();
	stroke(255);
	ellipse(0, 0, A * 2, B * 2);
}

function drawFoci() {
	fill(0, 255, 0);
	stroke(0, 255, 0);
	ellipse(currFocusX, 0, 6);
	ellipse((-1) * currFocusX, 0, 6);
}

function getSymmetryPoint() {
	angleMode(RADIANS);

	for (let i = 0; i < NUM_OF_POINTS; ++i) {
		let iranyTenyezo = (-1) * (pow(B, 2) * collisionX[i]) / (pow(A, 2) * collisionY[i]);
		let angle = atan(iranyTenyezo);
		let szabadTag = pow(B, 2) / collisionY[i];

		symmetryX[i] = currFocusX * cos(2 * angle) - szabadTag * sin(2 * angle);
		symmetryY[i] = currFocusX * sin(2 * angle) + 2 * szabadTag * pow(cos(angle), 2);
	}
}

function drawRay() {
	for (let i = 0; i < NUM_OF_POINTS; ++i) {
		stroke(colors[i]);
		line(currFocusX, 0, collisionX[i], collisionY[i]);
		line(collisionX[i], collisionY[i], (-1) * currFocusX, 0);
	}
}

function distance(x1, y1, x2, y2) {
	return pow(x2 - x1, 2) + pow(y2 - y1, 2);
}

function getIntersectionPoint() {
	for (let i = 0; i < NUM_OF_POINTS; ++i) {
		let iranyTenyezo = (collisionY[i] - symmetryY[i]) / (collisionX[i] - symmetryX[i]);
		let szabadTag = collisionY[i] - iranyTenyezo * collisionX[i];

		let nevezo = pow(A, 2) * pow(iranyTenyezo, 2) + pow(B, 2);
		let szamlalo1 = (-1) * pow(A, 2) * iranyTenyezo * szabadTag;
		let szamlalo2 = A * B * sqrt(pow(A, 2) * pow(iranyTenyezo, 2) + pow(B, 2) - pow(szabadTag, 2));

		let x1 = (szamlalo1 + szamlalo2) / nevezo;
		let x2 = (szamlalo1 - szamlalo2) / nevezo;

		let y1 = iranyTenyezo * x1 + szabadTag;
		let y2 = iranyTenyezo * x2 + szabadTag;

		if (distance(collisionX[i], collisionY[i], x1, y1) < distance(collisionX[i], collisionY[i], x2, y2)) {
			intersectionX[i] = x2;
			intersectionY[i] = y2;
		} else {
			intersectionX[i] = x1;
			intersectionY[i] = y1;
		}
	}
}

function updatePoints() {
	for (let i = 0; i < NUM_OF_POINTS; ++i) {
		collisionX[i] = intersectionX[i];
		collisionY[i] = intersectionY[i];
	}

	if (currFocusX < 0) {
		currFocusX = distanceSlider.value();
	} else {
		currFocusX = (-1) * distanceSlider.value();
	}
}