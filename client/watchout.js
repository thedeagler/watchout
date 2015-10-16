// start slingin' some d3 here.
// d3.select('body').append('svg');

// Draw the mouse
// var mouse = d3.mouse(this);




// add enemies





// draw enemies in svg element



// make it so enemies move to a new random location every second


// make a differently colored dot to represent the player, make it draggle
// Mouse Dragging behviour handling
var drag = d3.behavior.drag()
  .on("drag", dragged)

function dragged(d) {
  d3.select(this).attr('transform', 'translate(' + d3.event.x + ',' + d3.event.y + ')');
}

d3.select('.board').append('circle')
  .attr('transform', 'translate(' + 100 + ',' + 100 + ')')
  .attr('r', 10)
  .attr('fill', "black")
  .call(drag);



// detect when an enemy touches you


// keep track of user's score and display it


// use css3 animations