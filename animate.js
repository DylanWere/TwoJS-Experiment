
var two = new Two({
    type: Two.Types.canvas,
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

//cached variable that go in the nimation loop

var a = new Two.Vector(), b = new Two.Vector();
var velocity = 0.0125;

two.bind('update', function(frameCount, timeDelta){
    if (!timeDelta) {
        return;
    }

    for (var i = 0; i < amount; i++) {

        //animate the road
        var v = points[i];
        var pct = i / (amount - 1);
        var offset = pct * Math.PI * 2;
        var theta = offset + frameCount / 20;
        v.x = two.width / 20 * Math.cos(theta);

        var length = dashes.length;

        if (i > length - 1) {
            continue;
        }

        //animate the dashes

        var dash = dashes[i];
        //assign calculation of the vector on the road to 'a'
        road.getPointAt(dash.pct, a);
        //get an arbitrary vector right behind 'a' in order to get the angle for the rotation of the dash
        road.getPointAt(dash.pct - 0.01, b);
        dash.translation.copy(a).addSelf(road.translation);
        dash.rotation = Two.Vector.angleBetween(a, b) + Math.PI / 2;

        dash.pct = mod(dash.pct + velocity, 1);
    }
});

//add mouse interaction
window.addEventListener('mousemove', function(e) {
    var pct = (e.clientY / window.innerHeight - 0.5) * 2;
    velocity = pct * 0.3;
}, false);

window.addEventListener('touchmove', function(e) {
    var touch = e.changedTouches[1];

    if (!touch){
        return;
    }

    var pct = (e.clientY / window.innerHeight - 0.5) * 2;
    velocity = pct * 0.3; 
});

function mod(v, l) {
    while (v < 0) {
        v += l;
    }

    return v%l;
}

