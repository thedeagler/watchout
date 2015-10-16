// Game elements
var enemyPositions = [   ];
var playerPosition = [  ]

for(var i = 0; i < 10; i++) {
	enemyPositions.push([Math.random() * 600, Math.random() * 400]);
}


// add enemies
// draw svg circle enemies on svg board

d3.select('.board').selectAll('circle')
.data(enemyPositions)
.enter()
.append('circle')
.attr('r', 10)
.attr('fill', "deeppink")
.attr('cx', function(d) { return d[0] })
.attr('cy', function(d) { return d[1] }); 






// make it so enemies move to a new random location every second



// make a differently colored dot to represent the player, make it draggle
// Mouse Dragging behaviour handling
var drag = d3.behavior.drag()
.on("drag", dragged)

function dragged(d) {
	playerPosition = [ d3.event.x, d3.event.y ]
	d3.select(this).attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')');
}

// Draw the player dot
d3.select('.board').append('circle')
.attr('transform', 'translate(' + 100 + ',' + 100 + ')')
.attr('r', 10)
.attr('fill', "black")
.call(drag);



// detect when an enemy touches you


// keep track of user's score and display it


// use css3 animations
