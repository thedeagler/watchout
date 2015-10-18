// Game elements
var enemyPositions = [];
var playerPosition = [window.innerWidth * 0.5, window.innerHeight * 0.7];
var ENEMY_RADIUS = 20;
var PLAYER_RADIUS = 30;
var ENEMY_COLOUR = '#CCDBDC'; // I'm so fancy
var PLAYER_COLOUR = '#63C7B2';
var highScore = 0;
var currentScore = 0;
var numCollisions = 0;
var numEnemies = 0;
var on = 0;


/***********************************

    Input Handling

***********************************/

// make a differently colored dot to represent the player, make it draggable
// Mouse Dragging behaviour handling
var drag = d3.behavior.drag()
  .on('drag', dragged);

function dragged(d) {
  playerPosition = [d3.event.x, d3.event.y];
  d3.select(this).attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')');
  isCollision([d]);
}

/***********************************

    Game board Manipulation

***********************************/

// Init the board with titles and players
function initialize() {
  // Create title text
  d3.select('.game').selectAll('container')
    .data(['texts'])
    .enter()
    .append('container')
    .attr('class', function(d) {return d;})

  var title = d3.select('.texts').selectAll('h1')
    .data(['title'])
    .enter()
    .append('h1')
    .attr('class', function(d) {return d;})
    .text('watch out!')
    .classed('zoomInUp animated', true);

  setTimeout(function(){
    title.classed('zoomInUp animated', false)
    title.classed('zoomOutUp animated', true);
    setTimeout(function() {
      d3.select('.texts').remove();
    }, 1000);
  }, 2000);

  // Generate enemy positions
  generateEnemyPositions();

  // add first enemy
  // draw svg circle enemies on svg board
  d3.select('.board').selectAll('circle')
    .data(enemyPositions)
    .enter()
    .append('circle')
    .attr('class', 'enemy')
    .attr('r', ENEMY_RADIUS)
    .attr('fill', ENEMY_COLOUR)
    .attr('cx', function(d) {
      return d[0];
    })
    .attr('cy', function(d) {
      return d[1];
    });
}

// Update the board
//  Add new enemies, and move old ones
function update() {
  d3.select('.board').selectAll('.enemy')
    .data(enemyPositions)
    .enter()
    .append('circle')
    .attr('class', 'enemy')
    .attr('r', ENEMY_RADIUS)
    .classed('flash animated', true)
    .attr('fill', ENEMY_COLOUR)
    .attr('cx', function(d) {
      return d[0];
    })
    .attr('cy', function(d) {
      return d[1];
    });

  // Update enemy positions
  d3.select('.board').selectAll('.enemy')
    .data(enemyPositions)
    .transition()
    .tween('custom', tweenWithCollisionDetection)
    .duration(2000)
    .ease('bounce-out');

  // Calculate new enemy positions
  generateEnemyPositions();
  numEnemies++;

  // update current score
  currentScore = numEnemies - 2 > 0 ? numEnemies - 2 : 0
  if (highScore < currentScore) {
    highScore = currentScore;
    d3.select('.highscore').select('span').text(highScore);
  }

  d3.select('.current').select('span').text(currentScore);
}

// Generates next enemy position
function generateEnemyPositions() {
  for (var i = 0; i < numEnemies; i++) {
    enemyPositions[i] = [Math.random() * window.innerWidth, Math.random() * window.innerHeight];
  }
}


/***********************************

    Event Handlers

***********************************/

// detect when an enemy touches you
function isCollision(d) {
  var distanceBetween = Math.sqrt(Math.pow(playerPosition[0] - d[0], 2) + Math.pow(playerPosition[1] - d[1], 2));
  var maxDistBeforeCollision = ENEMY_RADIUS + PLAYER_RADIUS;

  if (maxDistBeforeCollision > distanceBetween) {
    collisionHandler();
    numCollisions++;
    d3.select('.collisions').select('span').text(numCollisions);
  }
}

// Game end handler
function collisionHandler() {
  numEnemies = 0;
  enemyPositions = [];
  currentScore = 0;

  generateEnemyPositions();

  // Remove enemies
  d3.select('.board').selectAll('.enemy')
    .data(enemyPositions)
    .exit()
    .remove();

  // Set text elements
  d3.select('.current').select('span').text(0);

  // Show gameover text
  // Create title text
  d3.select('.game').selectAll('container')
    .data(['texts'])
    .enter()
    .append('container')
    .attr('class', function(d) {return d;})

  var title = d3.select('.texts').selectAll('h1')
    .data(['gameover'])
    .enter()
    .append('h1')
    .attr('class', function(d) {return d;})
    .text('game over!')
    .classed('zoomInUp animated', true);

  setTimeout(function(){
    title.classed('zoomInUp animated', false)
    title.classed('zoomOutUp animated', true);
    setTimeout(function() {
      d3.select('.texts').remove();
    }, 1000);
  }, 2000);

  // Reinit gameboard
  setTimeout(initialize, 2000);
}

// Tween Collision Calculations
function tweenWithCollisionDetection(endData) {
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

  return function(t) {
    var enemyNextPos;
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    var enemyArr = [enemyNextPos.x, enemyNextPos.y];
    isCollision(enemyArr);
    return enemy.attr('cx', parseFloat(enemyNextPos.x)).attr('cy', parseFloat(enemyNextPos.y));
  };
};

/***********************************

    GAME STARTS HERE!

***********************************/
initialize();

  // Draw the player dot
  d3.select('.board').append('circle').classed('player', true)
    .attr('transform', 'translate(' + playerPosition[0] + ',' + playerPosition[1] + ')')
    .attr('r', PLAYER_RADIUS)
    .attr('fill', PLAYER_COLOUR)
    .call(drag);

// call update function every 2 seconds
setInterval(update, 2000);
