
var two = new Two({
    type: Two.Types.canvas,
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

/* create road */

var amount = 32;
var points = [];
var mouseX = 0;

for (let i = 0; i < amount; i++) {

    var pct = i / (amount - 1);
    var x = mouseX;
    var y = pct * two.height * 1.5;

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

        var topVal = amount-i; 
        var v = points[topVal - 1];
        var prev = points[topVal - 2];
        
        if (topVal - 1 == 0) {
            //smoothing - get the new mouse x and average it with the last
            v.x = ((mouseX - two.width / 2) + points[topVal].x + points[topVal + 1].x)/3;
        } else if (i < amount-1) {
            v.x = prev.x;
        }

       
        

        var length = dashes.length;

        if (i > length - 1) {
            continue;
        }

        //animate the dashes
        //this can remain the same
        var dash = dashes[i];
        //assign calculation of the vector on the road to 'a'
        road.getPointAt(dash.pct, a);
        //get an arbitrary vector right behind 'a' in order to get the angle for the rotation of the dash
        road.getPointAt(dash.pct - 0.01, b);
        dash.translation.copy(a).addSelf(road.translation);
        dash.rotation = Two.Vector.angleBetween(a, b);

        dash.pct = mod(dash.pct + velocity, 1);
    }
});

//add mouse interaction
var mouseX = 0;
window.addEventListener('mousemove', function(e) {

    mouseX = e.clientX;

}, false);


function mod(v, l) {
    while (v < 0) {
        v += l;
    }

    return v%l;
}

