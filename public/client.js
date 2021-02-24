const socket = io("wss://" + window.location.host);
const garbageConversion = [
  0,
  4,
  5,
  6,
  8,
  10,
  13,
  16,
  20,
  24,
  28,
  33,
  38,
  43,
  49,
  55,
  61,
  68,
  75,
  83,
  92,
  102,
  113,
  125,
  138,
  152,
  167,
  183,
  200,
  218,
  237,
];
function startTetris() {
  document.getElementById("selectionButtons").style.display = "none";

  var controls = localStorage.getItem("controls");
  controls = JSON.parse(controls);
  const pieces = ["Z", "L", "O", "S", "I", "J", "T"];
  const colors = [
    "#000000",
    "#555555",
    "#FF0100",
    "#FEAA00",
    "#FFFE02",
    "#00EA01",
    "#00DDFF",
    "#0000FF",
    "#CC00FE",
  ];
  const piece_matrix = {
    Z: [
      [2, 2, 0],
      [0, 2, 2],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0],
    ],
    O: [
      [4, 4],
      [4, 4],
    ],
    S: [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    I: [
      [0, 0, 0, 0],
      [6, 6, 6, 6],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [7, 0, 0],
      [7, 7, 7],
      [0, 0, 0],
    ],
    T: [
      [9, 8, 9],
      [8, 8, 8],
      [0, 0, 0],
    ],
    null: [[0]],
  };

  const wallkicks = {
    "0-1": [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ], //special
    "1-0": [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
    "1-2": [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
    "2-1": [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    "2-3": [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ], //special
    "3-2": [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    "3-0": [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    "0-3": [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
  };

  const i_wallkicks = {
    "0-1": [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, 1],
      [1, -2],
    ],
    "1-0": [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, -1],
      [-1, 2],
    ],
    "1-2": [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, -2],
      [2, 1],
    ],
    "2-1": [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, 2],
      [-2, -1],
    ],
    "2-3": [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, -1],
      [-1, 2],
    ],
    "3-2": [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, 1],
      [1, -2],
    ],
    "3-0": [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, 2],
      [-2, -1],
    ],
    "0-3": [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, -2],
      [2, 1],
    ],
    "0-2": [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ], // 0>>2─ ┐
    "1-3": [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, -1],
      [0, -2],
      [-1, 0],
    ], // 1>>3─ ┼ ┐
    "2-0": [
      [0, 0],
      [1, 0],
      [2, 0],
      [-1, 0],
      [-2, 0],
      [0, -1],
    ], // 2>>0─ ┘ │
    "3-1": [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, -1],
      [0, -2],
      [1, 0],
    ], // 3>>1─ ─ ┘
  };

  const empty_line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const combo_table = [
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    6,
  ];
  var board;
  var piece;
  var held;
  var queue;
  var rotation;
  var pieceX;
  var pieceY;
  var lastMoveRotate;
  var boardCanvas = document.getElementById("board");
  var boardWidth = boardCanvas.width;
  var boardHeight = boardCanvas.height;
  var boardContext = boardCanvas.getContext("2d");
  var holdCanvas = document.getElementById("holdCanvas");
  var holdWidth = holdCanvas.width;
  var holdHeight = holdCanvas.height;
  var holdContext = holdCanvas.getContext("2d");
  var queueCanvas = document.getElementById("queue");
  var queueWidth = queueCanvas.width;
  var queueHeight = queueCanvas.height;
  var queueContext = queueCanvas.getContext("2d");
  var b2b;
  var combo;
  var canHold;
  var linesReceived;

  function init() {
    board = [];
    canHold = true;
    queue = generateQueue();
    piece = queue.shift();
    held = null;
    rotation = 0;
    initPiecePos();
    lastMoveRotate = false;
    combo = 0;
    b2b = false;
    linesReceived = 0;
    render();
  }

  function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }

  function generateQueue() {
    bag = [...pieces];
    shuffleArray(bag);
    return bag;
  }

  function initPiecePos() {
    rotation = 0;
    if (piece == "O") {
      pieceX = 4;
    } else {
      pieceX = 3;
    }
    pieceY = 20;
  }

  function render() {
    boardContext.fillStyle = "#000000";
    boardContext.fillRect(0, 0, boardWidth, boardHeight);
    pieceMatrix = generatePieceMatrix(piece, rotation);
    boardContext.globalAlpha = 0.3;

    var tempY = pieceY;
    while (!collide(piece, pieceX, tempY - 1, rotation)) {
      tempY--;
    }
    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          boardContext.fillStyle = colors[pieceMatrix[i][j]];
          boardContext.fillRect(
            (j + pieceX) * 32,
            640 - (tempY - i) * 32,
            32,
            32
          );
        }
      }
    }
    boardContext.globalAlpha = 1;

    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          boardContext.fillStyle = colors[pieceMatrix[i][j]];
          boardContext.fillRect(
            (j + pieceX) * 32,
            640 - (pieceY - i) * 32,
            32,
            32
          );
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] != 0) {
          boardContext.fillStyle = colors[board[i][j]];
          boardContext.fillRect(j * 32, 640 - i * 32, 32, 32);
        }
      }
    }

    holdContext.fillStyle = "#000000";
    holdContext.fillRect(0, 0, holdWidth, holdHeight);
    if (held) {
      holdMatrix = generatePieceMatrix(held, 0);
      for (let i = 0; i < holdMatrix.length; i++) {
        for (let j = 0; j < holdMatrix[i].length; j++) {
          if (holdMatrix[i][j] != 0 && holdMatrix[i][j] != 9) {
            holdContext.fillStyle = colors[holdMatrix[i][j]];
            holdContext.fillRect(j * 32 + 12, i * 32 + 12, 32, 32);
          }
        }
      }
    }

    queueContext.fillStyle = "#000000";
    queueContext.fillRect(0, 0, queueWidth, queueHeight);
    for (let h = 0; h < queue.length; h++) {
      queueMatrix = generatePieceMatrix(queue[h]);
      for (let i = 0; i < queueMatrix.length; i++) {
        for (let j = 0; j < queueMatrix[i].length; j++) {
          if (queueMatrix[i][j] != 0 && queueMatrix[i][j] != 9) {
            queueContext.fillStyle = colors[queueMatrix[i][j]];
            queueContext.fillRect(j * 32 + 12, i * 32 + 12 + 120 * h, 32, 32);
          }
        }
      }
    }
  }

  function renderOther(id) {
    otherCanvas = otherPlayers[id].canvas;
    otherContext = otherCanvas.getContext("2d");
    otherContext.fillStyle = "#000000";
    otherContext.fillRect(0, 0, 320, 640);
    pieceData = otherPlayers[id].pieceData;
    pieceMatrix = generatePieceMatrix(pieceData[0], pieceData[3]);

    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          otherContext.fillStyle = colors[pieceMatrix[i][j]];
          otherContext.fillRect(
            (j + pieceX) * 32,
            640 - (pieceY - i) * 32,
            32,
            32
          );
        }
      }
    }
    for (let i = 0; i < otherPlayers[id].board.length; i++) {
      for (let j = 0; j < otherPlayers[id].board[i].length; j++) {
        if (otherPlayers[id].board[i][j] != 0) {
          otherContext.fillStyle = colors[otherPlayers[id].board[i][j]];
          otherContext.fillRect(j * 32, 640 - i * 32, 32, 32);
        }
      }
    }
  }

  function collide(piece, x, y, rotation) {
    pieceMatrix = generatePieceMatrix(piece, rotation);
    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] == 0 || pieceMatrix[i][j] == 9) {
          continue;
        }
        if (j + x < 0 || j + x > 9) {
          return true;
        }
        if (y - i <= 0) {
          return true;
        }
        if (y - i < board.length) {
          if (board[y - i][j + x] != 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function tryWallKicks(rotation1, rotation2) {
    if (piece == "I") {
      for (
        let i = 0;
        i < i_wallkicks[rotation1 + "-" + rotation2].length;
        i++
      ) {
        const coords = i_wallkicks[rotation1 + "-" + rotation2][i];
        if (
          !collide(piece, pieceX + coords[0], pieceY + coords[1], rotation2)
        ) {
          pieceX += coords[0];
          pieceY += coords[1];
          return true;
        }
      }
    } else {
      for (let i = 0; i < wallkicks[rotation1 + "-" + rotation2].length; i++) {
        const coords = wallkicks[rotation1 + "-" + rotation2][i];
        if (
          !collide(piece, pieceX + coords[0], pieceY - coords[1], rotation2)
        ) {
          pieceX += coords[0];
          pieceY -= coords[1];
          return true;
        }
      }
    }
    return false;
  }

  function generatePieceMatrix(piece, rotation) {
    tempMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (let i = 0; i < rotation; i++) {
      rotateMatrix(tempMatrix);
    }
    return tempMatrix;
  }

  var rotateMatrix = function (matrix) {
    flipMajorDiagonal(matrix);
    reverseEachRow(matrix);
    return matrix;
  };

  var flipMajorDiagonal = function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[0].length; j++) {
        let temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    return matrix;
  };

  var reverseEachRow = function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i].reverse();
    }
    return matrix;
  };

  function pieceGravity() {
    if (collide(piece, pieceX, pieceY - 1, rotation)) {
      placePiece();
    } else {
      pieceY--;
      render();
      lastMoveRotate = false;
    }
  }

  function placePiece() {
    var tspin = false;
    var cornersFilled = 0;
    var mini = false;
    pieceMatrix = generatePieceMatrix(piece, rotation);
    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        while (pieceY - i >= board.length) {
          board.push([...empty_line]);
        }
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          board[pieceY - i][j + pieceX] = pieceMatrix[i][j];
        }
        if (pieceMatrix[i][j] == 9) {
          if (board[pieceY - i][j] == 0) {
            mini = true;
          }
        }

        if (piece == "T") {
          if (
            (i == 0 || i == 2 || j == 0 || j == 2) &&
            board[pieceY - i][j] != 0
          ) {
            cornersFilled++;
          }
        }
      }
    }
    if (cornersFilled >= 3) {
      tspin = true;
    }
    linesCleared = clearLines();
    if (linesCleared == 0) {
      spawnGarbage();
    } else {
      lines_sent = sendLines(linesCleared, mini, tspin);
      console.log("Lines sent: " + lines_sent);
      trashSent = garbageConversion[lines_sent];
      if (otherPlayers.length > 0) {
        targets = Object.keys(otherPlayers);
        target = targets[Math.floor(Math.random() * otherPlayers.length)];
        socket.emit("sendLines", target, trashSent);
      }
    }

    removeExcessLines();
    spawnPiece();
    canHold = true;
    render();
    socket.emit("sendBoard", board);
  }
  function spawnGarbage() {
    if (linesReceived <= 0) {
      return;
    }
    // y = k ** x - k
    var hole = Math.floor(Math.random() * 10);
    var volatility = 2;
    var consecutiveLines = 0;
    for (var i = 0; i < linesReceived; i++) {
      tempLine = new Array(10).fill(1);
      tempLine[hole] = 0;
      board.unshift(tempLine);
      if (
        (volatility ** consecutiveLines - volatility) * 0.01 <
        Math.random()
      ) {
        consecutiveLines = 0;
        hole = Math.floor(Math.random() * 10);
      } else {
        consecutiveLines++;
      }
    }
    linesReceived = 0;
  }
  function clearLines() {
    if (board.length == 0) {
      return 0;
    }
    var linesCleared = 0;
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i].every((column) => column != 0)) {
        board.splice(i, 1);
        linesCleared++;
      }
    }
    return linesCleared;
  }
  function removeExcessLines() {
    testRow = board.length - 1;
    if (testRow <= 0) {
      return;
    }

    while (board[testRow].every((column) => column == 0)) {
      board.splice(testRow, 1);
      testRow--;
      if (testRow < 0) {
        return;
      }
    }
  }

  function sendLines(linesCleared, mini, tspin) {
    if (linesCleared == 0) {
      combo = 0;
      return 0;
    }
    lines_sent = 0;

    if (linesCleared == 4) {
      lines_sent += 4;
    }

    if (tspin && !mini) {
      lines_sent += linesCleared * 2;
    } else if (linesCleared <= 3) {
      lines_sent += linesCleared - 1;
    }

    if (tspin || linesCleared == 4) {
      if (b2b) {
        lines_sent += 1;
      }
      b2b = true;
    } else {
      b2b = false;
    }

    if (board.every((row) => row.every((col) => col == 0))) {
      lines_sent += 10;
    }

    lines_sent += combo_table[combo];
    combo++;

    return lines_sent;
  }

  function spawnPiece() {
    piece = queue.shift();
    initPiecePos();
    if (queue.length < 7) {
      queue.push(...generateQueue());
    }
    if (collide(piece, pieceX, pieceY, rotation)) {
      init();
    }
  }

  function move(key) {
    var keys = Object.keys(controls);
    for (var i = 0; i < keys.length; i++) {
      if (controls[keys[i]][0] == parseInt(key)) {
        move_type = keys[i];
        eval(move_type + "()");
        socket.emit("sendPieceData", [piece, pieceX, pieceY, rotation]);
        render();
      }
    }
  }

  function clockwise() {
    if (rotation < 3) {
      rotation++;
    } else {
      rotation = 0;
    }
  }

  function counterclockwise() {
    if (rotation > 0) {
      rotation--;
    } else {
      rotation = 3;
    }
  }
  function rotate_180() {
    if (!collide(piece, pieceX, pieceY, (rotation + 2) % 4)) {
      clockwise();
      clockwise();
      lastMoveRotate = true;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }
  function rotate_right() {
    if (collide(piece, pieceX, pieceY, (rotation + 1) % 4)) {
      if (tryWallKicks(rotation, (rotation + 1) % 4)) {
        clockwise();
        lastMoveRotate = true;
        if (collide(piece, pieceX, pieceY - 1, rotation)) {
          gravity = 0;
        }
      }
    } else {
      clockwise();
      lastMoveRotate = true;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function rotate_left() {
    if (collide(piece, pieceX, pieceY, (rotation + 3) % 4)) {
      if (tryWallKicks(rotation, (rotation + 3) % 4)) {
        counterclockwise();
        lastMoveRotate = true;
        if (collide(piece, pieceX, pieceY - 1, rotation)) {
          gravity = 0;
        }
      }
    } else {
      counterclockwise();
      lastMoveRotate = true;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function move_left() {
    if (!collide(piece, pieceX - 1, pieceY, rotation)) {
      pieceX--;
      lastMoveRotate = false;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function move_right() {
    if (!collide(piece, pieceX + 1, pieceY, rotation)) {
      pieceX++;
      lastMoveRotate = false;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function harddrop() {
    while (!collide(piece, pieceX, pieceY - 1, rotation)) {
      pieceY--;
    }
    placePiece();
    lastMoveRotate = false;
    gravity = 0;
  }

  function softdrop() {
    if (!collide(piece, pieceX, pieceY - 1, rotation)) {
      pieceY--;
      lastMoveRotate = false;
      gravity = 0;
    }
  }

  function hold() {
    if (!canHold) {
      return;
    }

    if (held == null) {
      held = piece;
      spawnPiece();
    } else {
      [held, piece] = [piece, held];
      initPiecePos();
    }
    canHold = false;
  }

  function restart() {
    init();
  }
var otherPlayers = {}

  function addNewPlayer(id, pieceData) {
    var isPuyo = false;
    if (pieceData[0].length == 2) {
      isPuyo = true;
    }
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = 320;
    tempCanvas.height = 640;
    document.appendChild(tempCanvas);
    otherPlayers[id] = {
      board: [],
      pieceData: pieceData,
      isPuyo: isPuyo,
      canvas: tempCanvas,
    };
  }
  socket.on("receiveLines", (target, amount) => {
    if (target == socket.id) {
      receivedLines += Math.max.apply(
        Math,
        garbageConversion.filter(function (x) {
          return x <= amount;
        })
      );
    }
  });
  
  socket.on("receivePieceData", (sender, pieceData) => {
    if (sender == socket.id) {
      return;
    }
    if (!(sender in otherPlayers)) {
      addNewPlayer(sender, pieceData);
    }
    otherPlayers[sender].pieceData = pieceData;
    renderOther(sender);
  });

  socket.on("receiveBoard", (sender, otherBoard) => {
    if (sender == socket.id) {
      return;
    }
    if (!(sender in otherPlayers)) {
      return;
    }
    otherPlayers[sender].board = otherBoard;
    renderOther(sender);
  });

  init();

  var keyDict = {};

  $("body").on("keydown", function (key) {
    for (var testKey in controls) {
      if (controls.hasOwnProperty(testKey)) {
        if (key.which == controls[testKey][0]) {
          key.preventDefault();
          // console.log(key.key);
        }
      }
    }
    if (keyDict[key.which] === undefined) {
      var currentTime = new Date().getTime();
      keyDict[key.which] = [currentTime, 0];
    }
  });

  $("body").on("keyup", function (key) {
    delete keyDict[key.which];
  });
  const gravityDelay = 60;
  var gravity = 0;

  loop = setInterval(() => {
    var keys = Object.keys(keyDict);
    leftRight = 0;
    var prio;
    for (var i = 0; i < keys.length; i++) {
      if (
        keys[i] == controls["move_left"][0] ||
        keys[i] == controls["move_right"][0]
      ) {
        leftRight++;
        prio = keys[i];
      }
      if (leftRight == 2) {
        if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
          prio = keys[1];
        } else {
          prio = keys[0];
        }
      }
    }
    for (var i = 0; i < keys.length; i++) {
      if (keyDict[keys[i]] === undefined) {
        continue;
      }
      if (
        keys[i] == controls["move_left"][0] ||
        keys[i] == controls["move_right"][0]
      ) {
        if (keys[i] == prio) {
          if (
            (new Date().getTime() - keyDict[keys[i]][0] >= controls.DAS &&
              new Date().getTime() - keyDict[keys[i]][1] >= controls.ARR) ||
            keyDict[keys[i]][1] == 0
          ) {
            if (controls.ARR == 0 && !keyDict[keys[i]][1] == 0) {
              for (var mov = 0; mov < 10; mov++) {
                move(keys[i]);
              }
            } else {
              move(keys[i]);
            }
            keyDict[keys[i]][1] = new Date().getTime();
          }
        }
      } else if (keys[i] != controls["softdrop"][0]) {
        // && keys[i] != controls["harddrop"][0]
        if (keyDict[keys[i]][1] == 0) {
          move(keys[i]);
          keyDict[keys[i]][1] = new Date().getTime();
        }
      } else if (keys[i] == controls["softdrop"][0]) {
        if (new Date().getTime() - keyDict[keys[i]][1] >= controls.grav_ARR) {
          if (controls.grav_ARR == 0) {
            for (var mov = 0; mov < 22; mov++) {
              move(keys[i]);
            }
          } else {
            move(keys[i]);

            keyDict[keys[i]][1] = new Date().getTime();
          }
        }
      }
    }
    gravity++;
    if (gravity >= gravityDelay) {
      gravity = 0;
      pieceGravity();
    }
  }, 1000 / 60);
}

function startPuyo() {
  var controls = localStorage.getItem("controls");
  controls = JSON.parse(controls);
  document.getElementById("selectionButtons").style.display = "none";

  const colors = [
    "#000000",
    "#555555",
    "#FF0100",

    "#00EA01",
    "#0000FF",
    "#CC00FE",
  ];

  const wallkicks = {
    "0-1": [[-1, 0]],
    "1-0": [[0, 0]],
    "1-2": [[0, 1]],
    "2-1": [[1, 0]],
    "2-3": [[1, 0]],
    "3-2": [[0, 1]],
    "3-0": [[0, 0]],
    "0-3": [[1, 0]],
  };

  const chain_table = [
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    6,
  ];
  const chainBonusTable = [
    0,
    8,
    16,
    32,
    64,
    96,
    128,
    160,
    192,
    224,
    256,
    288,
    320,
    352,
    384,
    416,
    448,
    480,
    512,
    544,
    576,
    608,
    640,
    672,
  ];
  const colorBonusTable = [0, 0, 3, 6, 12, 24];
  const groupBonusTable = [
    0,
    0,
    0,
    0,
    0,
    2,
    3,
    4,
    5,
    6,
    7,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
  ];
  const empty_line = [0, 0, 0, 0, 0, 0];
  var board;
  var piece;
  var held;
  var queue;
  var rotation;
  var pieceX;
  var pieceY;
  var boardCanvas = document.getElementById("board");
  var boardWidth = boardCanvas.width;
  var boardHeight = boardCanvas.height;
  var boardContext = boardCanvas.getContext("2d");
  var holdCanvas = document.getElementById("holdCanvas");
  var holdWidth = holdCanvas.width;
  var holdHeight = holdCanvas.height;
  var holdContext = holdCanvas.getContext("2d");
  var queueCanvas = document.getElementById("queue");
  var queueWidth = queueCanvas.width;
  var queueHeight = queueCanvas.height;
  var queueContext = queueCanvas.getContext("2d");
  var allclear;
  var canHold;
  var rotatePressed;
  var totalClearedGlobal;
  var startTime;
  var trashReceived;
  function init() {
    trashReceived = 0;
    allclear = false;
    rotatePressed = false;
    canHold = true;
    board = [];
    queue = generateQueue();
    piece = queue.shift();
    held = null;
    rotation = 0;
    initPiecePos();
    console.log(piece);
    totalClearedGlobal = 0;
    startTime = new Date().getTime();
    render();
  }

  function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }
  function genPuyo() {
    return [
      Math.floor(Math.random() * 4) + 2,
      Math.floor(Math.random() * 4) + 2,
    ];
  }

  function generateQueue() {
    bag = [];
    for (let i = 0; i < 7; i++) {
      bag.push(genPuyo());
    }
    return bag;
  }

  function initPiecePos() {
    rotation = 0;
    pieceX = 1;
    pieceY = 13;
  }

  function render() {
    boardContext.fillStyle = "#000000";
    boardContext.fillRect(0, 0, boardWidth, boardHeight);
    pieceMatrix = generatePieceMatrix(piece, rotation);

    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          boardContext.fillStyle = colors[pieceMatrix[i][j]];
          boardContext.fillRect(
            (j + pieceX) * (640 / 12),
            640 - (pieceY - i) * (640 / 12),
            640 / 12,
            640 / 12
          );
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] != 0) {
          boardContext.fillStyle = colors[board[i][j]];
          boardContext.fillRect(
            j * (640 / 12),
            640 - i * (640 / 12),
            640 / 12,
            640 / 12
          );
        }
      }
    }

    holdContext.fillStyle = "#000000";
    holdContext.fillRect(0, 0, holdWidth, holdHeight);
    if (held) {
      holdMatrix = generatePieceMatrix(held, 0);
      for (let i = 0; i < holdMatrix.length; i++) {
        for (let j = 0; j < holdMatrix[i].length; j++) {
          if (holdMatrix[i][j] != 0) {
            holdContext.fillStyle = colors[holdMatrix[i][j]];
            holdContext.fillRect(
              j * (640 / 12) + 12,
              i * (640 / 12) + 12,
              640 / 12,
              640 / 12
            );
          }
        }
      }
    }

    queueContext.fillStyle = "#000000";
    queueContext.fillRect(0, 0, queueWidth, queueHeight);
    for (let h = 0; h < queue.length; h++) {
      queueMatrix = generatePieceMatrix(queue[h]);
      for (let i = 0; i < queueMatrix.length; i++) {
        for (let j = 0; j < queueMatrix[i].length; j++) {
          if (queueMatrix[i][j] != 0 && queueMatrix[i][j] != 9) {
            queueContext.fillStyle = colors[queueMatrix[i][j]];
            queueContext.fillRect(
              j * (640 / 12) + 12,
              i * (640 / 12) + 12 + 120 * h,
              640 / 12,
              640 / 12
            );
          }
        }
      }
    }
  }

  function collide(piece, x, y, rotation) {
    pieceMatrix = generatePieceMatrix(piece, rotation);
    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        if (pieceMatrix[i][j] == 0) {
          continue;
        }
        if (j + x < 0 || j + x > 5) {
          return true;
        }
        if (y - i <= 0) {
          return true;
        }
        if (y - i < board.length) {
          if (board[y - i][j + x] != 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function tryWallKicks(rotation1, rotation2) {
    for (let i = 0; i < wallkicks[rotation1 + "-" + rotation2].length; i++) {
      const coords = wallkicks[rotation1 + "-" + rotation2][i];
      if (!collide(piece, pieceX + coords[0], pieceY + coords[1], rotation2)) {
        pieceX += coords[0];
        pieceY += coords[1];
        return true;
      }
    }

    return false;
  }

  function generatePieceMatrix(piece, rotation) {
    tempMatrix = [
      [0, piece[0], 0],
      [0, piece[1], 0],
      [0, 0, 0],
    ];
    for (let i = 0; i < rotation; i++) {
      rotateMatrix(tempMatrix);
    }
    return tempMatrix;
  }

  var rotateMatrix = function (matrix) {
    flipMajorDiagonal(matrix);
    reverseEachRow(matrix);
    return matrix;
  };

  var flipMajorDiagonal = function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[0].length; j++) {
        let temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    return matrix;
  };

  var reverseEachRow = function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i].reverse();
    }
    return matrix;
  };

  function pieceGravity() {
    if (collide(piece, pieceX, pieceY - 1, rotation)) {
      placePiece();
    } else {
      pieceY--;
      render();
      lastMoveRotate = false;
    }
  }

  function placePiece() {
    pieceMatrix = generatePieceMatrix(piece, rotation);
    for (let i = 0; i < pieceMatrix.length; i++) {
      for (let j = 0; j < pieceMatrix[i].length; j++) {
        while (pieceY - i >= board.length) {
          board.push([...empty_line]);
        }
        if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
          board[pieceY - i][j + pieceX] = pieceMatrix[i][j];
        }
      }
    }

    lines_sent = clearLines();
    console.log("Lines sent: " + lines_sent);
    removeExcessLines();
    spawnPiece();
    canHold = true;
    render();

    socket.emit("sendBoard", board);
  }
  function applyGravity() {
    coordinates = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] != 0 && i != 0) {
          coordinates.push([i, j]);
          tempY = i;
          while (board[tempY - 1][j] == 0 && tempY > 1) {
            tempY--;
          }
          if (tempY != i) {
            board[tempY][j] = board[i][j];
            board[i][j] = 0;
          }
        }
      }
    }
    return coordinates;
  }
  function tryChain(coordinates) {
    tempBoard = board.map((row) => [...row]);
    totalCleared = 0;
    totalColors = [];
    groupBonus = 0;
    for (let k = 0; k < coordinates; k++) {
      i = coordinates[k][0];
      j = coordinates[k][1];
      if (board[i][j] != 0) {
        puyoColor = board[i][j];
        puyosCleared = floodFill(i, j, puyoColor, tempBoard);

        console.log(puyosCleared);

        if (puyosCleared >= 4) {
          floodFill(i, j, puyoColor, board);
          totalCleared += puyosCleared;
          totalColors.push(puyoColor);
          groupBonus += groupBonusTable[puyosCleared];
        }
      } //  :)
    }
    console.log(tempBoard);
    return [totalColors, totalCleared, groupBonus];
  }
  function floodFill(i, j, color, matrix) {
    if (i < 0 || j < 0) {
      return 0;
    }
    if (i > matrix.length - 1 || j > matrix.length - 1) {
      return 0;
    }
    if (color !== matrix[i][j]) {
      return 0;
    }
    matrix[i][j] = 0;
    filledIn = 1;
    filledIn += floodFill(i + 1, j, color, matrix);

    filledIn += floodFill(i - 1, j, color, matrix);
    filledIn += floodFill(i, j + 1, color, matrix);
    filledIn += floodFill(i, j - 1, color, matrix);
    return filledIn;
  }

  function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs + "." + ms;
  }
  function clearLines() {
    if (board.length == 0) {
      return 0;
    }

    chain = 0;

    var coordinates = applyGravity();
    tempArray = tryChain(coordinates);
    var totalColors = tempArray[0];
    var totalPuyos = tempArray[1];
    var groupBonus = tempArray[2];

    while (tempArray[1] != 0) {
      coordinates = applyGravity();
      tempArray = tryChain(coordinates);
      totalColors.push(...tempArray[0]);
      totalPuyos += tempArray[1];
      groupBonus += tempArray[2];
      chain++;
    }
    totalClearedGlobal += totalPuyos;
    console.log("total puyos cleared: " + totalClearedGlobal);
    if (totalClearedGlobal >= 200) {
      console.log(
        "cleared 200 puyos in:" + msToTime(new Date().getTime() - startTime)
      );
    }
    totalColors = [...new Set(totalColors)];
    score =
      10 *
      totalPuyos *
      (chainBonusTable[chain] +
        groupBonus +
        colorBonusTable[totalColors.length]);
    lines_sent = score / 70;
    if (chain > 0 && allclear) {
      lines_sent += 30;
    }

    if (board.every((row) => row.every((column) => column === 0))) {
      allclear = true;
    }

    return lines_sent;
  }
  function removeExcessLines() {
    testRow = board.length - 1;
    if (testRow <= 0) {
      return;
    }

    while (board[testRow].every((column) => column == 0)) {
      board.splice(testRow, 1);
      testRow--;
      if (testRow < 0) {
        return;
      }
    }
  }

  function spawnPiece() {
    piece = queue.shift();
    initPiecePos();
    if (queue.length < 7) {
      queue.push(...generateQueue());
    }
    if (collide(piece, pieceX, pieceY, rotation)) {
      init();
    }
  }

  function move(key) {
    var keys = Object.keys(controls);
    for (var i = 0; i < keys.length; i++) {
      if (controls[keys[i]][0] == parseInt(key)) {
        move_type = keys[i];
        eval(move_type + "()");
        render();

        socket.emit("sendPieceData", [piece, pieceX, pieceY, rotation]);
      }
    }
  }

  function clockwise() {
    if (rotation < 3) {
      rotation++;
    } else {
      rotation = 0;
    }
  }

  function counterclockwise() {
    if (rotation > 0) {
      rotation--;
    } else {
      rotation = 3;
    }
  }

  function rotate_right() {
    if (collide(piece, pieceX, pieceY, (rotation + 1) % 4)) {
      if (tryWallKicks(rotation, (rotation + 1) % 4)) {
        clockwise();
        rotatePressed = true;

        if (collide(piece, pieceX, pieceY - 1, rotation)) {
          gravity = 0;
        }
      } else if (rotatePressed) {
        rotate_180();
        rotatePressed = false;
      } else if (rotatePressed == false) {
        rotatePressed = true;
      }
    } else {
      rotatePressed = true;
      clockwise();
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function rotate_left() {
    if (collide(piece, pieceX, pieceY, (rotation + 3) % 4)) {
      if (tryWallKicks(rotation, (rotation + 3) % 4)) {
        counterclockwise();
        rotatePress = true;
        if (collide(piece, pieceX, pieceY - 1, rotation)) {
          gravity = 0;
        }
      } else if (rotatePressed) {
        rotate_180();
        rotatePressed = false;
      } else if (!rotatePressed) {
        rotatePressed = true;
      }
    } else {
      counterclockwise();
      rotatePressed = true;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }
  function rotate_180() {
    clockwise();
    clockwise();
    if (rotation == 0) {
      pieceY--;
    } else if (rotation == 1) {
      pieceX--;
    } else if (rotation == 2) {
      pieceY++;
    } else if (rotation == 3) {
      pieceX++;
    }

    if (collide(piece, pieceX, pieceY - 1, rotation)) {
      gravity = 0;
    }
  }
  function move_left() {
    if (!collide(piece, pieceX - 1, pieceY, rotation)) {
      pieceX--;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function move_right() {
    if (!collide(piece, pieceX + 1, pieceY, rotation)) {
      pieceX++;
      if (collide(piece, pieceX, pieceY - 1, rotation)) {
        gravity = 0;
      }
    }
  }

  function harddrop() {
    while (!collide(piece, pieceX, pieceY - 1, rotation)) {
      pieceY--;
    }
    placePiece();
    gravity = 0;
  }

  function softdrop() {
    if (!collide(piece, pieceX, pieceY - 1, rotation)) {
      pieceY--;
      gravity = 0;
    }
  }

  function hold() {
    if (canHold == false) {
      return;
    }

    if (held == null) {
      held = piece;
      spawnPiece();
    } else {
      [held, piece] = [piece, held];
      initPiecePos();
    }
    canHold = false;
  }

  function restart() {
    init();
  }

  var otherPlayers = {};
  function addNewPlayer(id, pieceData) {
    var isPuyo = false;
    if (pieceData[0].length == 2) {
      isPuyo = true;
    }
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = 320;
    tempCanvas.height = 640;
    document.appendChild(tempCanvas);
    otherPlayers[id] = {
      board: [],
      pieceData: pieceData,
      isPuyo: isPuyo,
      canvas: tempCanvas,
    };
  }
  socket.on("receiveLines", (target, amount) => {
    if (target == socket.id) {
      receivedLines += amount;
    }
  });
  socket.on("receivePieceData", (sender, pieceData) => {
    if (sender == socket.id) {
      return;
    }
    if (!(sender in otherPlayers)) {
      addNewPlayer(sender, pieceData);
    }
    otherPlayers[sender].pieceData = pieceData;
    renderOther(sender);
  });

  socket.on("receiveBoard", (sender, otherBoard) => {
    if (sender == socket.id) {
      return;
    }
    if (!(sender in otherPlayers)) {
      return;
    }
    otherPlayers[sender].board = otherBoard;
    renderOther(sender);
  });
  init();

  var keyDict = {};

  $("body").on("keydown", function (key) {
    for (var testKey in controls) {
      if (controls.hasOwnProperty(testKey)) {
        if (key.which == controls[testKey][0]) {
          key.preventDefault();
          // console.log(key.key);
        }
      }
    }
    if (keyDict[key.which] === undefined) {
      var currentTime = new Date().getTime();
      keyDict[key.which] = [currentTime, 0];
    }
  });

  $("body").on("keyup", function (key) {
    delete keyDict[key.which];
  });
  const gravityDelay = 60;
  var gravity = 0;
  var rotatePressedDelay = 10;
  var rotatePressedCounter = 0;
  loop = setInterval(() => {
    var keys = Object.keys(keyDict);
    leftRight = 0;
    var prio;
    for (var i = 0; i < keys.length; i++) {
      if (
        keys[i] == controls["move_left"][0] ||
        keys[i] == controls["move_right"][0]
      ) {
        leftRight++;
        prio = keys[i];
      }
      if (leftRight == 2) {
        if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
          prio = keys[1];
        } else {
          prio = keys[0];
        }
      }
    }
    for (var i = 0; i < keys.length; i++) {
      if (keyDict[keys[i]] === undefined) {
        continue;
      }
      if (
        keys[i] == controls["move_left"][0] ||
        keys[i] == controls["move_right"][0]
      ) {
        if (keys[i] == prio) {
          if (
            (new Date().getTime() - keyDict[keys[i]][0] >= controls.DAS &&
              new Date().getTime() - keyDict[keys[i]][1] >= controls.ARR) ||
            keyDict[keys[i]][1] == 0
          ) {
            if (controls.ARR == 0 && !keyDict[keys[i]][1] == 0) {
              for (var mov = 0; mov < 6; mov++) {
                move(keys[i]);
              }
            } else {
              move(keys[i]);
            }
            keyDict[keys[i]][1] = new Date().getTime();
          }
        }
      } else if (keys[i] != controls["softdrop"][0]) {
        // && keys[i] != controls["harddrop"][0]
        if (keyDict[keys[i]][1] == 0) {
          move(keys[i]);
          keyDict[keys[i]][1] = new Date().getTime();
        }
      } else if (keys[i] == controls["softdrop"][0]) {
        if (new Date().getTime() - keyDict[keys[i]][1] >= controls.grav_ARR) {
          if (controls.grav_ARR == 0) {
            for (var mov = 0; mov < 13; mov++) {
              move(keys[i]);
            }
          } else {
            move(keys[i]);

            keyDict[keys[i]][1] = new Date().getTime();
          }
        }
      }
    }
    gravity++;
    if (gravity >= gravityDelay) {
      gravity = 0;
      pieceGravity();
    }
    if (rotatePressed) {
      rotatePressedCounter++;
      if (rotatePressedCounter >= rotatePressedDelay) {
        rotatePressed = false;
      }
    } else {
      rotatePressedCounter = 0;
    }
  }, 1000 / 60);
}
