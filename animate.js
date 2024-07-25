var two = new Two ({
    type: Two.types.canvas,
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

/* create road */

var amount = 32;
var points = [];

for (let i = 0; i < amount; i++) {

    var pct = i / (amount - 1);
    var theta = Math.PI * 2 * pct;
    var x = two.width / 20 * Math.cos(theta);
    var y = pct * two.height * 2 - two.height * 0.5;

    points.push(new Two.Anchor(x, y));
    
}

var sidewalk = two.makeCurve(points, true);
sidewalk.translation.set(two.width / 2, two.height / 2);
sidewalk.noFill().stroke = '#ccc';
sidewalk.linewidth = two.width / 4;

var road = two.makeCurve(points, true);
road.translation.set(two.width / 2, two.height / 2);
road.noFill().stroke = "#666";
road.linewidth = two.width / 6;

/* create an array of lines for our dashed lines */

var dashes = [];

for (let j = 0; j < 10; j++) {
    
    var gutter = -10;
    var length = two.height / (amount + gutter);
    var dash = two.makeLine((0, -length, 0, length));

    dash.noFill().stroke = '#fff';
    dash.linewidth = 3;
    dash.pct = j / (10 - 1);

    dash.translation.copy(points[j]).addSelf(road.translation);
    dashes.push(dash);

    
}