// Game elements
var enemyPositions = [  ];
var playerPosition = [  ];
var ENEMY_RADIUS = 10;
var PLAYER_RADIUS = 20;
var ENEMY_COLOUR = "#53533B"; // I'm so fancy
var PLAYER_COLOUR = '#B6FFA6';

// Initialize 10 enemy dots with x,y-coordinates
generateEnemyPositions();
function generateEnemyPositions() {
  for(var i = 0; i < 15; i++) {
    enemyPositions[i] = [Math.random() * 600, Math.random() * 400];
  }
}


// add enemies
// draw svg circle enemies on svg board
d3.select('.board').selectAll('circle')
.data(enemyPositions)
.enter()
.append('circle')
.attr('r', ENEMY_RADIUS)
.attr('fill', ENEMY_COLOUR)
.attr('cx', function(d) { return d[0] })
.attr('cy', function(d) { return d[1] }); 

// make it so enemies move to a new random location every second

function update() {
  generateEnemyPositions();

  var enemies = d3.select('.board').selectAll('circle')
  .data(enemyPositions)
  .transition()
  .attr('cx', function(d) { return d[0] })
  .attr('cy', function(d) { return d[1] })
  .duration(1200)
  .ease('bounce-in');
}

setInterval(update, 2200);



// make a differently colored dot to represent the player, make it draggle
// Mouse Dragging behaviour handling
var drag = d3.behavior.drag()
.on("drag", dragged)

function dragged(d) {
  playerPosition = [ d3.event.x, d3.event.y ]
  d3.select(this).attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')');
  isCollision();
}

// Draw the player dot
d3.select('.board').append('circle')
.attr('transform', 'translate(' + 100 + ',' + 100 + ')')
.attr('r', PLAYER_RADIUS)
.attr('fill', PLAYER_COLOUR)
.call(drag);



// detect when an enemy touches you
var isCollision = function() {
  enemyPositions.forEach(function(enemy) {
    // for each enemy position 
    // calculate distance between the two
    // compare sum of two radii is < distance
    // return true
    var distanceBetween = Math.sqrt( (playerPosition[0]-enemy[0])*(playerPosition[0]-enemy[0]) + (playerPosition[1]-enemy[1])*(playerPosition[1]-enemy[1]) );
    var maxDistBeforeCollision = ENEMY_RADIUS + PLAYER_RADIUS;

    if (maxDistBeforeCollision > distanceBetween){
      console.log('hit');
      return true;
    }
    return false;
  })
}


// keep track of user's score and display it


// use css3 animations

// INFINTE LOOPS YO
var infiniteloop = function() {
  while(true) {
    if(isCollision()){
      console.log("YOU DIE");
      break;
    }
  }
}

// setTimeout(infiniteloop, 10000)
