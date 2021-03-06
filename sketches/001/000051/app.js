(function() {
  document.addEventListener('DOMContentLoaded', function() {

    // Common
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Resize it
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var left = 0;
    var right = canvas.width;
    var top = 0;
    var bottom = canvas.height;

    // Lets make four grids
    var simpleGrid = new GridDimensional(10, 10, [0, 0], [canvas.width / 2, canvas.height / 4]);
    var angle = 24;
    var speed = 5;

    var radians = angle * Math.PI / 180;
    
    var vx = Math.cos(radians) * speed;
    var vy = Math.sin(radians) * speed;

    var allBalls = [];

    var ballRadius = simpleGrid.xGaps / 2;

    function makeThingsFromGrid(matrix, container, cfg) {
      for (var r = 0; r < matrix.length; r++) {
        for (var c = 0; c < matrix[r].length; c++) {
          var colStr = utils.getRandomColor(cfg);

          var newBall = new Ball(ballRadius, colStr);
          newBall.x = matrix[r][c][0];
          newBall.y = matrix[r][c][1];

          // Store a reference to the grid matrix point on the ball itself
          newBall.gridRef = {
            r: r,
            c: c
          };

          container.push(newBall);
        }
      }
    }

    makeThingsFromGrid(simpleGrid.gridMatrix, allBalls, {
      r: [25, 255],
      g: 0,
      b: [25, 90],
      o: 0.15
    })

    // Draw loop
    function drawFrame() {
      requestAnimationFrame(drawFrame, ctx);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Change the main boundaries of the grid

      simpleGrid.ul[0] += vx;
      simpleGrid.ul[1] += vy;
      simpleGrid.lr[0] += vx;
      simpleGrid.lr[1] += vy;

      // bounce check
      
      if (simpleGrid.lr[0] > right) {
        simpleGrid.lr[0] = right;
        vx *= -1;
      } else if (simpleGrid.ul[0] < left) {
        simpleGrid.ul[0] = left;
        vx *= -1;
      }

      if (simpleGrid.lr[1] > bottom) {
        simpleGrid.lr[1] = bottom;
        vy *= -1;
      } else if (simpleGrid.ul[1] < top) {
        simpleGrid.ul[1] = top;
        vy *= -1;
      }

      simpleGrid.offsetStraight(vx, vy);

      allBalls.forEach(function(b) {
        var gridPt = simpleGrid.gridMatrix[b.gridRef.r][b.gridRef.c];

        b.x = gridPt[0];
        b.y = gridPt[1];

        b.updateScale().draw(ctx);
      });

    }

    drawFrame();

  });
}());