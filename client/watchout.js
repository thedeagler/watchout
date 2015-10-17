// Game elements
var enemyPositions = [  ];
var playerPosition = [100,200];
var ENEMY_RADIUS = 10;
var PLAYER_RADIUS = 20;
var ENEMY_COLOUR = "#DBD56E"; // I'm so fancy
var PLAYER_COLOUR = '#66D7D1';
var highScore = 0;
var currentScore = 0;
// var numCollisions = 0;
var numEnemies = 1;

// Initialize 10 enemy dots with x,y-coordinates
function generateEnemyPositions() {
  for(var i = 0; i < numEnemies; i++) {
    enemyPositions[i] = [Math.random() * 600, Math.random() * 400];
  }
  numEnemies++;
}
generateEnemyPositions();

// add enemies
// draw svg circle enemies on svg board
d3.select('.board').selectAll('circle')
.data(enemyPositions)
.enter()
.append('circle')
.attr('class', 'enemy')
.attr('r', ENEMY_RADIUS)
.attr('fill', ENEMY_COLOUR)
.attr('cx', function(d) { return d[0] })
.attr('cy', function(d) { return d[1] })



// Tween Collision
tweenWithCollisionDetection = function(endData) {
  var endPos, enemy, startPos;
  enemy = d3.select(this);
  startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };
  endPos = {
    x: endData[0],
    y: endData[1]
  };
  // console.log(startPos.x + ' : ' + endData[0]);
  return function(t) {
    var enemyNextPos;
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    var wah = [enemyNextPos.x, enemyNextPos.y]
    isCollision(wah);
    return enemy.attr('cx', parseFloat(enemyNextPos.x)).attr('cy', parseFloat(enemyNextPos.y));
  };
};


// make it so enemies move to a new random location every second
function update() {
  d3.select('.board').selectAll('circle')
  .data(enemyPositions)
  .enter()
  .append('circle')
  .attr('class', 'enemy')
  .attr('r', ENEMY_RADIUS)
  .attr('fill', ENEMY_COLOUR)
  .attr('cx', function(d) { return d[0] })
  .attr('cy', function(d) { return d[1] })

  // Update enemy positions
  var enemies = d3.select('.board').selectAll('circle')
  .data(enemyPositions)
  .transition()
  .tween('custom', tweenWithCollisionDetection)
  // .attr('cx', function(d) { return d[0] })
  // .attr('cy', function(d) { return d[1] })
  .duration(2000)
  .ease('bounce-in');

  // Calculate ne enemy positions
  generateEnemyPositions();

  // update current score 
  currentScore++;
  if (highScore < currentScore) {
    highScore = currentScore;
    d3.select('.highscore').select('span').text(highScore);
  }

  d3.select('.current').select('span').text(currentScore)
}

// call update function every 2 seconds
setInterval(update, 2000);





// make a differently colored dot to represent the player, make it draggle
// Mouse Dragging behaviour handling
var drag = d3.behavior.drag()
.on("drag", dragged)

function dragged(d) {
  playerPosition = [ d3.event.x, d3.event.y ]
  d3.select(this).attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')');
  isCollision([d]);
}




// Draw the player dot
d3.select('.board').append('circle')
.attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')')
.attr('r', PLAYER_RADIUS)
.attr('fill', PLAYER_COLOUR)
.call(drag);




// detect when an enemy touches you
function isCollision(d) {
  // var enemyCoords;
  // if (d) {
  //   enemyCoords = [d];
  // } else {
  //   enemyCoords = enemyPositions;
  // }
  // enemyCoords.forEach(function(enemy) {
    // for each enemy position 
    // calculate distance between the two
    // compare sum of two radii is < distance
    // return true

    var distanceBetween = Math.sqrt(Math.pow(playerPosition[0] - d[0], 2) + Math.pow(playerPosition[1] - d[1], 2));

    var maxDistBeforeCollision = ENEMY_RADIUS + PLAYER_RADIUS;

    // console.log(
    //   'distance between: ' + distanceBetween + "\n"
    //   +' player position x: ' + playerPosition[0] + "\n"
    //   +' enemy position x : ' + enemy[0] + "\n"
    //   +' player position y: ' + playerPosition[1] + "\n"
    //   +' enemy position y : ' + enemy[1] + "\n"
    //   + ' dist between perimeters: ' + (distanceBetween - maxDistBeforeCollision) + '\n'
    //   + "wolfram: sqrt( (" + playerPosition[0] + '-' + enemy[0] + ')^2 + (' + playerPosition[1] + '-' + enemy[1] + ')^2 )'
    //   )
    if (maxDistBeforeCollision > distanceBetween) {
      collisionHandler();
    }
  }


function collisionHandler() {
  console.log('hit')
  // End game
  numEnemies = 1;
  enemyPositions = [];
  generateEnemyPositions();
  // debugger;

  d3.select('.board').selectAll('.enemy')
  .data(enemyPositions)
  .exit()
  .remove();

  currentScore = 0;
  d3.select('.current').select('span').text(0);
}

