var placeSound = new Audio("/sounds/harddrop.ogg");
var lineClearSound = new Audio("/sounds/lineclear.ogg");

function playSound(sound, volume) {
  var click = sound.cloneNode();
  if (volume) click.volume = volume;
  click.play();
}

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
  "#AA00FE",
];
const barColors = [
  "#00FF82",
  "#00FF82",
  "#00FF41",
  "#00FF41",
  "#82FF00",
  "#bcFF00",
  "#FFFF00",
  "#FFFF00",
  "#FFbc00",
  "#FF8200",
  "#FF4100",
  "#FF0000",
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
    [4, 4, 0],
    [4, 4, 0],
    [0, 0, 0]
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
    [-1, 1],
    [0, -2],
    [-1, -2],
  ], //special
  "1-0": [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  "1-2": [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  "2-1": [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  "2-3": [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ], //special
  "3-2": [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  "3-0": [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  "0-3": [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  "0-2": [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
    [1, -1],
    [2, -1],
    [-1, 0],
    [-2, 0],
    [-1, -1],
    [-2, -1],
    [0, 1],
    [3, 0],
    [-3, 0],
  ], // 0>>2─ ┐
  "1-3": [
    [0, 0],
    [1, 0],
    [0, -1],
    [0, -2],
    [-1, -1],
    [-1, -2],
    [0, 1],
    [0, 2],
    [-1, 1],
    [-1, 2],
    [1, 0],
    [0, -3],
    [0, 3],
  ], // 1>>3─ ┼ ┐
  "2-0": [
    [0, 0],
    [0, -1],
    [-1, 0],
    [-2, 0],
    [-1, 1],
    [-2, 1],
    [1, 0],
    [2, 0],
    [1, 1],
    [2, 1],
    [0, -1],
    [-3, 0],
    [3, 0],
  ], // 2>>0─ ┘ │
  "3-1": [
    [0, 0],
    [-1, 0],
    [0, -1],
    [0, -2],
    [1, -1],
    [1, -2],
    [0, 1],
    [0, 2],
    [1, 1],
    [1, 2],
    [-1, 0],
    [0, -3],
    [0, 3],
  ],
};

const i_wallkicks = {
  "0-1": [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, -1],
    [1, 2],
  ],
  "1-0": [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, 1],
    [-1, -2],
  ],
  "1-2": [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 2],
    [2, -1],
  ],
  "2-1": [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, -2],
    [-2, 1],
  ],
  "2-3": [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, 1],
    [-1, -2],
  ],
  "3-2": [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, -1],
    [1, 2],
  ],
  "3-0": [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, -2],
    [-2, 1],
  ],
  "0-3": [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 2],
    [2, -1],
  ],
  "0-2": [
    [0, 0],
    [-1, 0],
    [-2, 0],
    [1, 0],
    [2, 0],
    [0, -1],
  ], // 0>>2─ ┐
  "1-3": [
    [0, 0],
    [0, -1],
    [0, -2],
    [0, 1],
    [0, 2],
    [-1, 0],
  ], // 1>>3─ ┼ ┐
  "2-0": [
    [0, 0],
    [1, 0],
    [2, 0],
    [-1, 0],
    [-2, 0],
    [0, 1],
  ], // 2>>0─ ┘ │
  "3-1": [
    [0, 0],
    [0, -1],
    [0, -2],
    [0, 1],
    [0, 2],
    [1, 0],
  ], // 3>>1─ ─ ┘
};

var piece_displacement = {
  I: [-0.5, -0.5],
  O: [0.5, 0],
};

var combo_table;
if (document.currentScript.hasAttribute("data-combo")) {
  combo_table = JSON.parse(document.currentScript.getAttribute("data-combo"));
} else {
  // combo_table = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; //PPT
  //combo_table = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2]; //NUKE WEIRD
  combo_table = [0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1]; //nuke bullu
}

var prefixes = [
  "Penta",
  "Hexa",
  "Hepta",
  "Octa",
  "Nona",
  "Deca",
  "Undeca",
  "Dodeca",
  "Tredeca",
  "Tetradeca",
  "Pentadeca",
  "Hexadeca",
  "Heptadeca",
  "Octodeca",
  "Novemdeca",
  "Viginti",
  "Unviginti",
];

var grav = 60;

// if (document.currentScript.hasAttribute("data-gravity")) {
//     grav = parseInt(document.currentScript.getAttribute('data-gravity'))
// } else {
//     grav = 60
// }

var lockDelay;

if (document.currentScript.hasAttribute("data-lockDelay")) {
  lockDelay = parseInt(document.currentScript.getAttribute("data-lockDelay"));
} else {
  lockDelay = 1200;
}

var floorLockDelay;
if (document.currentScript.hasAttribute("data-floorLockDelay")) {
  floorLockDelay = parseInt(document.currentScript.getAttribute("data-floorLockDelay"));
} else {
  floorLockDelay = grav;
}

var controls = localStorage.getItem("controls");

if (controls === null) {
  controls = {
    move_left: [37, "ArrowLeft"],
    move_right: [39, "ArrowRight"],
    rotate_left: [83, "s"],
    rotate_right: [38, "ArrowUp"],
    rotate_180: [88, "x"],
    softdrop: [40, "ArrowDown"],
    harddrop: [32, "Spacebar"],
    hold: [67, "c"],
  };
  localStorage.setItem("controls", JSON.stringify(controls));
} else {
  controls = JSON.parse(controls);
}

controls = { ...controls, restart: [115, "F4"], DAS: "198", ARR: "33", grav_ARR: "33" };

var matrixHeight;
if (document.currentScript.hasAttribute("data-matrixHeight")) {
  matrixHeight = parseInt(document.currentScript.getAttribute("data-matrixHeight"));
} else {
  matrixHeight = 24;
}

var matrixWidth;
if (document.currentScript.hasAttribute("data-matrixWidth")) {
  matrixWidth = parseInt(document.currentScript.getAttribute("data-matrixWidth"));
} else {
  matrixWidth = 10;
}

const empty_line = new Array(matrixWidth).fill(0);

const respawnTimers = [1, 1, 1];

const priorityDiv = document.getElementById("priorityTemplate");
const lobbyDiv = document.getElementsByClassName("lobby")[0];
const lobbyContainer = document.getElementsByClassName("lobbyContainer")[0];
const gameOverContainer = document.getElementsByClassName("gameOver")[0];
const gameOverTemplate = document.getElementById("gameOverTemplate");
const gameOverPlayersDiv = document.getElementsByClassName("gameOverPlayers")[0];
const ingameWrapper = document.getElementsByClassName("ingame")[0];
const mainDiv = document.getElementById("main-player");
const otherPlayersDiv = document.getElementsByClassName("other_players")[0];
const otherPlayersWrapper = document.getElementsByClassName("other_players_wrapper")[0];
const statusWrapper = document.getElementsByClassName("statuses")[0];
const templateDiv = document.getElementById("template");
const damageBar = document.getElementById("damage_bar");
const respawnBar = document.getElementById("respawn-bar");
const respawnOverlay = document.getElementById("respawn");
const clearTypeWrapper = document.getElementById("sentContainer");
const comboCounter = document.getElementById("combo");
const b2bTracker = document.getElementById("b2b");
const clearDisplay = document.getElementById("line-clear");
const bossHealthBar = document.getElementById("bossHealth");
const bossHealthText = document.getElementById("bossHealthText");
const warningGraphic = document.getElementById("warning");
const poisonGraphic = document.getElementById("poison");
const spectateButton = document.getElementById("spectateButton");
const scoreboard = document.getElementsByClassName("ingameScoreboard")[0];
const scoreboardTemplate = document.getElementById("scoreboardTemplate");

const boardCanvas = mainDiv.getElementsByClassName("board")[0];
const boardContext = boardCanvas.getContext("2d");
const boardHeight = boardCanvas.height;
const boardWidth = boardCanvas.width;

const queueCanvas = mainDiv.getElementsByClassName("queue")[0];
const queueContext = queueCanvas.getContext("2d");
const queueHeight = queueCanvas.height;
const queueWidth = queueCanvas.width;

const heldCanvas = mainDiv.getElementsByClassName("held")[0];
const heldContext = heldCanvas.getContext("2d");
const heldHeight = heldCanvas.height;
const heldWidth = heldCanvas.width;

const ratioHeight = boardHeight / matrixHeight;
const ratioWidth = boardWidth / matrixWidth;

const ratioQueueHeight = queueHeight / 18;
const ratioQueueWidth = queueWidth / 5;

const ratioHeldHeight = heldHeight / 12;
const ratioHeldWidth = heldWidth / 12;

const skin = new Image();
var useSkin = document.currentScript.hasAttribute("data-skin");
if (useSkin) {
  const skinUrl = document.currentScript.getAttribute("data-skin");
  skin.src = skinUrl;
  var skinSize;
  skin.onerror = function () {
    useSkin = false;
  };
  skin.onload = function () {
    skinSize = this.height;
    graficks();
  };
}

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

var interval;
var intervalToggle = true;
interval = setInterval(loop, 1000 / 60);

$(window)
  .focus(function () {
    // clearInterval(interval);
    // if (intervalToggle) {
    //     interval = setInterval(loop, 15);
    // }
    keyDict = {};
  })
  .blur(function () {
    // clearInterval(interval);
  });

var next_drop = grav;
var forceDrop = lockDelay;

var floorPlace = floorLockDelay;

var gameStarted = false;
var controlsDisabled = false;

//var frames;

// setInterval(() => {
//   console.log(frames)
//   frames = 0
// }, 1000)

const animateCSS = (element, animation, prefix = "animate__") => {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });
};

function loop() {
  //frames++
  if (!gameStarted || controlsDisabled) {
    return;
  }
  var keys = Object.keys(keyDict);
  leftRight = 0;
  var prio;
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
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
    if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
      if (keys[i] == prio) {
        if (
          (new Date().getTime() - keyDict[keys[i]][0] >= controls.DAS &&
            new Date().getTime() - keyDict[keys[i]][1] >= controls.ARR) ||
          keyDict[keys[i]][1] == 0
        ) {
          if (controls.ARR == 0 && !keyDict[keys[i]][1] == 0) {
            for (var mov = 0; mov < matrixWidth; mov++) {
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
        move(keys[i]);
        keyDict[keys[i]][1] = new Date().getTime();
      }
    }
  }
  next_drop--;
  floorPlace--;
  if (next_drop <= 0) {
    next_drop = grav;
    gravity();
    floorPlace = floorLockDelay;
  }

  forceDrop--;
  if (forceDrop <= 0) {
    forceDrop = lockDelay;
    floorPlace = floorLockDelay;
    harddrop();
  }
}

function gravity() {
  if (collide([pieceMatrix, x, y + 1, piece])) {
    if (floorPlace <= 0) {
      harddrop();
    }
  } else {
    y++;
    graficks();
    lastMoveRotate = false;
    socket.emit("piece_pos", piece, x, y, rotation);
  }
}

function clearTypeGraphic(text, clearType) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  div.className = "clearType " + clearType;
  clearTypeWrapper.prepend(div);
  div.style.opacity = 1;
  div.style.top = "0px";
  setTimeout(() => {
    div.style.opacity = 0;
    div.style.top = "200px";
  }, 1000 / 60);
  setTimeout(() => {
    div.remove();
  }, 2000);
}

function addGarbage() {
  var temp_send = 0;
  for (var i = 0; i < lines_received.length; i++) {
    var garbageIndexes = lines_received[i].garbage;
    //garbageIndexes.reverse();
    for (let j = garbageIndexes.length - 1; j >= 0; j--) {
      board.shift();
      tempLine = new Array(matrixWidth).fill(1);
      tempLine[garbageIndexes[0]] = 0;
      board.splice(zoneLines - 1, 0, tempLine);
      garbageIndexes.shift();
      temp_send++;
      last_sender = lines_received[i].sender;
      if (temp_send >= 10) {
        //garbageIndexes.reverse();
        break;
      }
    }
    if (temp_send >= 10) {
      break;
    }
  }
  lines_received = lines_received.filter((sentObj) => {
    return sentObj.garbage.length > 0;
  });
  updateBar();
  controlsDisabled = true;
  boardContext.clearRect(0, 0, boardWidth, boardHeight);
  graficks();
  garbageAnimation(50, temp_send);
  setTimeout(() => {
    controlsDisabled = false;
    boardContext.clearRect(0, 0, boardWidth, boardHeight);
    graficks();
    queueAnimation();
  }, 50 * temp_send);
}

function startPoison(intensity, duration, frequency) {
  poisonGraphic.style.opacity = "1";
  var prevNum = 10;
  var poisonLoop = setInterval(() => {
    var holeIndex = Math.floor(Math.random() * Math.floor(matrixWidth));
    var adder = Math.floor(Math.random() * Math.floor(matrixWidth - 1));
    if (holeIndex == prevNum) {
      holeIndex = (holeIndex + 1 + adder) % matrixWidth;
    }
    for (let i = 0; i < intensity; i++) {
      if (collide([pieceMatrix, x, y + 1])) {
        y--;
      }
      board.shift();
      tempLine = new Array(matrixWidth).fill(1);
      tempLine[holeIndex] = 0;
      board.splice(zoneLines - 1, 0, tempLine);
    }
  }, frequency);

  setTimeout(() => {
    clearInterval(poisonLoop);
    poisonGraphic.style.opacity = "0";
  }, duration);
}

function rotate(matrix) {
  const n = matrix.length;
  const x = Math.floor(n / 2);
  const y = n - 1;
  for (let i = 0; i < x; i++) {
    for (let j = i; j < y - i; j++) {
      k = matrix[i][j];
      matrix[i][j] = matrix[y - j][i];
      matrix[y - j][i] = matrix[y - i][y - j];
      matrix[y - i][y - j] = matrix[j][y - i];
      matrix[j][y - i] = k;
    }
  }
}

function collide(pieceData, checkMatrix = board) {
  //pieceData = [matrix, x, y]
  for (var testY = 0; testY < pieceData[0].length; testY++) {
    for (var testX = 0; testX < pieceData[0][0].length; testX++) {
      if (pieceData[0][testY][testX] != 0 && pieceData[0][testY][testX] != 9) {
        if (
          pieceData[2] + testY >= checkMatrix.length ||
          pieceData[1] + testX >= checkMatrix[0].length ||
          pieceData[2] + testY < 0 ||
          pieceData[1] + testX < 0
        ) {
          return true;
        }
        if (checkMatrix[pieceData[2] + testY][pieceData[1] + testX] != 0) {
          return true;
        }
      }
    }
  }
  return false;
}

function tryWallkick(prev, current) {
  if (piece == "I") {
    kicktable = i_wallkicks;
  } else {
    kicktable = wallkicks;
  }
  current_table = kicktable[prev.toString() + "-" + current.toString()];
  for (var i = 0; i < current_table.length; i++) {
    if (!collide([pieceMatrix, x + current_table[i][0], y - current_table[i][1], piece])) {
      if (
        (current_table[i][0] === -1 || current_table[i][0] === 1 || current_table[i][0] === 0) &&
        current_table[i][1] === -2
      ) {
        lastMoveRotate = "Force";
      } else {
        lastMoveRotate = true;
      }
      x += current_table[i][0];
      y -= current_table[i][1];
      return true;
    }
  }
  return false;
}

function addBag() {
  bag = [...pieces];
  bag.sort(() => seed() - 0.5);
  queue = queue.concat(bag);
}


function place(pieceData) {
  //pieceData = [pieceMatrix, x, y, piece]
  playSound(placeSound, 0.3);
  piece_stored = piece;
  let filled = 0;
  let mini = 0;
  let pieceSpin = false;

  if (pieceData[3] != "T" && lastMoveRotate) {
    if (
      collide([pieceData[0], pieceData[1] + 1, pieceData[2], pieceData[3]]) &&
      collide([pieceData[0], pieceData[1] - 1, pieceData[2], pieceData[3]]) &&
      collide([pieceData[0], pieceData[1], pieceData[2] + 1, pieceData[3]]) &&
      collide([pieceData[0], pieceData[1], pieceData[2] - 1, pieceData[3]])
    ) {
      pieceSpin = true;
    }
  }

  for (var testY = 0; testY < pieceData[0].length; testY++) {
    for (var testX = 0; testX < pieceData[0][0].length; testX++) {
      if (pieceData[0][testY][testX] != 0) {
        if (pieceData[0][testY][testX] != 9) {
          board[pieceData[2] + testY][pieceData[1] + testX] = pieces.indexOf(pieceData[3]) + 2;
        } else if (board[pieceData[2] + testY][pieceData[1] + testX] == 0) {
          mini++;
        }
      }
      if (pieceData[0][testY][testX] == 0 || pieceData[0][testY][testX] == 9) {
        if (pieceData[3] == "T") {
          if ((testY == 0 || testY == 2) && (testX == 0 || testX == 2)) {
            if (pieceData[2] + testY >= board.length || pieceData[1] + testX >= board[0].length) {
              filled++;
            } else if (
              board[pieceData[2] + testY][pieceData[1] + testX] != 0 &&
              board[pieceData[2] + testY][pieceData[1] + testX] != 9
            ) {
              filled++;
            }
          }
        }
      }
    }
  }

  let tspin = false;
  let linesCleared = 0;
  if (pieceData[3] == "T" && filled >= 3 && lastMoveRotate) {
    tspin = true;
  }

  if (lastMoveRotate == "Force") {
    mini = 0;
  }

  testY = matrixHeight - 1;
  temp_board = JSON.parse(JSON.stringify(board));
  var clearedLinesTracker = [];
  var zoneLinesTracker = [];
  var zoneLinesCleared = 0;
  var zoneActivated = false;
  var pc = true;
  while (testY > 0) {
    for (var i = 0; i < matrixWidth; i++) {
      if (temp_board[testY][i] == 0) {
        break;
      }
      if (i == matrixWidth - 1) {
        // board.splice(testY, 1);
        // board[testY] = [...empty_line]
        clearedLinesTracker.push(testY);
        if (testY < zoneLines) {
          linesCleared += 1;
          zoneLinesTracker.push(testY);
        }
        zoneLinesCleared++;
      }
    }
    testY--;
  }

  if (combo > 0) {
    var tempPiece = queue[0];
    var tempPieceMatrix = JSON.parse(JSON.stringify(piece_matrix[tempPiece]));
    var tempPieceX = parseInt(matrixWidth / 2 - pieceMatrix.length / 2);
    var tempPieceY = 3;
    if (linesCleared == 0 || collide([tempPieceMatrix, tempPieceX, tempPieceY, tempPiece])) {
      zoneLines = matrixHeight;
      zoneActivated = true;
      console.log("zone activatee")
      linesCleared = zoneLinesCleared;
      for (let i = 0; i < combo; i++) {
        lines_sent += combo_table[i]
      }
      console.log(lines_sent + " lines sent")
      combo = 0;
    } else {
      playSound(lineClearSound);
    }
  }

  if (combo > 0) {
    combo++;
    if (combo == 2) {
      comboCounter.className = "combo";
      comboCounter.style.display = "block";
      animateCSS(".combo", "bounceIn");
      // comboCounter.classList.add('animate__animated', 'animate__bounceIn');
      comboCounter.textContent = `${combo - 1}x Combo`;
    } else if (combo > 2) {
      comboCounter.className = "combo";
      animateCSS(".combo", "bounce");
      // comboCounter.classList.add('animate__animated', 'animate__shakeX');
      comboCounter.textContent = `${combo - 1}x Combo`;
    }
    for (let i = 0; i < zoneLinesTracker.length; i++) {
      zoneLines--;
      var lineGraphic = document.createElement("div");
      lineGraphic.className = "perLineGraphic zone";
      lineGraphic.style.top = `${ratioHeight * zoneLinesTracker[i] - 32 * (matrixHeight - 20)}px`;
      var lineCanvas = document.createElement("canvas");
      var lineContext = lineCanvas.getContext("2d");
      lineCanvas.width = boardWidth;
      lineCanvas.height = ratioHeight;
      console.log(lineGraphic);
      // lineContext.drawImage(boardCanvas, 0, ratioHeight * zoneLinesTracker[i], boardWidth, ratioHeight, 0, 0, boardWidth, ratioHeight)
      for (let j = 0; j < matrixWidth; j++) {
        lineContext.drawImage(
          skin,
          0,
          0,
          skinSize,
          skinSize,
          ratioWidth * j,
          0,
          skinSize,
          skinSize
        );
      }
      lineGraphic.appendChild(lineCanvas);
      clearDisplay.appendChild(lineGraphic);
      lineCanvas.className = "lineCanvas";

      var moveDownFunctionGenerator = (lineGraphic, zoneLines) => {
        return () => (lineGraphic.style.top = `${32 * (zoneLines - (matrixHeight - 20))}px`);
      };

      /*
            setTimeout(() => {
                lineGraphic.style.top = `${32*(zoneLines-(matrixHeight-20))}px`
            }, 1000 / 60);
            */
      setTimeout(moveDownFunctionGenerator(lineGraphic, zoneLines), 1000 / 60);

      setTimeout(() => {
        clearDisplay.innerHTML = "";
      }, 500 + 1000 / 60);
      var [tempLine] = board.splice(zoneLinesTracker[i], 1);
      tempLine = new Array(matrixWidth).fill(9);
      board.splice(zoneLines, 0, tempLine);
      // board.push(tempLine)

      // if (lines_received) {
      //     addGarbage();
      // }
    }
    for (let i = matrixHeight - 1; i >= 0; i--) {
      if (i < zoneLines) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] != 0) {
            pc = false;
          }
        }
      }
    }
    var clearType = [];

    // if (tspin) {
    //   if (mini) {
    //     lines_sent++;
    //     tempTypeGraphic[("T-Spin Mini", "tsm")];
    //   } else {
    //     if (zoneLinesCleared > 1) {
    //       lines_sent += 1;
    //     }
    //     if (zoneLinesCleared > 2) {
    //       lines_sent += 1;
    //     }
    //     lines_sent += 2;
    //     tempTypeGraphic[("T-Spin", "ts")];
    //   }
    // }
    // if (pieceSpin) {
    //   tempTypeGraphic = [`${pieceData[3]}-Spin`, `${pieceData[3]}s`];
    //   lines_sent++;
    // }
    // if (zoneLinesCleared == 4 || pieceSpin || tspin) {
    //   if (b2b) {
    //     lines_sent++;
    //   }
    //   b2b = true;
    // } else {
    //   b2b = false;
    // }
    if (linesCleared == 1) {
      if (tspin == true) {
        if (b2b == true) {
          lines_sent += 1;
        }
        if (mini == 0) {
          lines_sent += 2;
          clearType = ["T-Spin Single", "tss"];
        } else {
          clearType = ["T-Spin Single Mini", "tssm"];
        }
        b2b = true;
      } else if (pieceSpin) {
        if (b2b == true) {
          lines_sent += 1;
        }
        clearType = [`${pieceData[3]}-Spin Single`, `${pieceData[3]}ss`];
        b2b = true;
      } else {
        b2b = false;
      }
    } else if (linesCleared == 2) {
      lines_sent++;
      if (tspin == true) {
        if (b2b == true) {
          lines_sent += 1;
        }
        if (mini == 0) {
          lines_sent += 3;
          clearType = ["T-Spin Double", "tsd"];
        } else {
          clearType = ["T-Spin Double Mini", "tsdm"];
        }
        b2b = true;
      } else if (pieceSpin) {
        if (b2b == true) {
          lines_sent += 1;
        }
        clearType = [`${pieceData[3]}-Spin Double`, `${pieceData[3]}sd`];
        b2b = true;
      } else {
        b2b = false;
      }
    } else if (linesCleared == 3) {
      lines_sent += 2;
      if (tspin == true) {
        if (b2b == true) {
          lines_sent += 1;
        }
        clearType = ["T-Spin Triple", "tst"];
        lines_sent += 4;
        b2b = true;
      } else if (pieceSpin) {
        if (b2b == true) {
          lines_sent += 1;
        }
        clearType = [`${pieceData[3]}-Spin Triple`, `${pieceData[3]}st`];
        b2b = true;
      } else {
        b2b = false;
      }
    } else if (linesCleared == 4) {
      if (b2b == true) {
        lines_sent += 1;
      }
      if (pieceSpin) {
        clearType = [`${pieceData[3]}-Spin Quadra`, `${pieceData[3]}sq`];
        b2b = true;
      } else {
        clearType = ["Quadra", "tetris"];
      }
      lines_sent += 4;
      b2b = true;
    }

    if (pc) {
      clearType = ["Perfect Clear", "pc"];
      lines_sent += 6;
    }

    if (pieceSpin) {
      lines_sent++;
    }

    if (clearType.length == 2) {
      clearTypeGraphic(...clearType);
    }

    if (b2b) {
      if (b2bTracker.style.display == "block") {
        b2bTracker.className = "b2b";
        animateCSS(".b2b", "headShake");
      } else {
        b2bTracker.style.display = "block";
        b2bTracker.className = "b2b";
        animateCSS(".b2b", "bounceIn");
      }
    } else {
      if (b2bTracker.style.display == "block") {
        b2bTracker.className = "b2b";
        animateCSS(".b2b", "bounceOut");
        setTimeout(() => {
          b2bTracker.style.display = "none";
        }, 700);
      }
    }
  } else {
    if (linesCleared != 0) {
      controlsDisabled = true;
      graficks();
      setTimeout(() => {
        clearDisplay.innerHTML = "";
        controlsDisabled = false;
        console.log("enabled controls");
        graficks();
        queueAnimation();
      }, 75 * linesCleared + 350);
      for (let i = 0; i < clearedLinesTracker.length; i++) {
        var lineGraphic = document.createElement("div");
        lineGraphic.className = "perLineGraphic clear";
        lineGraphic.style.top = `${ratioHeight * clearedLinesTracker[i] - 32 * (matrixHeight - 20)
          }px`;
        var lineCanvas = document.createElement("canvas");
        var lineContext = lineCanvas.getContext("2d");
        lineCanvas.width = boardWidth;
        lineCanvas.height = ratioHeight;
        lineContext.drawImage(
          boardCanvas,
          0,
          ratioHeight * clearedLinesTracker[i],
          boardWidth,
          ratioHeight,
          0,
          0,
          boardWidth,
          ratioHeight
        );
        lineGraphic.appendChild(lineCanvas);
        clearDisplay.appendChild(lineGraphic);
        lineCanvas.className = "lineCanvas";
        lineCanvas.style.opacity = 1; // water bottle
        lineCanvas.style.transition = `${(75 * linesCleared + 350) / 1000}s ease-out`;
        var fadeOutFunctionGenerator = (lineCanvas) => {
          console.log("aoweijfvoaiwejvoifajwOIJAFVWEIOJVEWIOJ");
          console.log(32 * (zoneLines - (matrixHeight - 20)));
          return () => (lineCanvas.style.opacity = 0);
        };

        setTimeout(fadeOutFunctionGenerator(lineCanvas), 1000 / 60);
        board.splice(clearedLinesTracker[i], 1);
      }
    }

    while (board.length < matrixHeight) {
      board.unshift([...empty_line]);
    }
    if (linesCleared == 0 && lines_received.length > 0) {
      addGarbage();
    }

    var clearType = [];

    if (linesCleared != 0) {
      if (!zoneActivated) {
        combo++;
      } else {
        comboCounter.className = "combo";
        animateCSS(".combo", "bounceOut");
        setTimeout(() => {
          comboCounter.style.display = "none";
        }, 700);
      }
      if (combo == 2) {
        comboCounter.className = "combo";
        comboCounter.style.display = "block";
        animateCSS(".combo", "bounceIn");
        // comboCounter.classList.add('animate__animated', 'animate__bounceIn');
        comboCounter.textContent = `${combo - 1}x Combo`;
      } else if (combo > 2) {
        comboCounter.className = "combo";
        animateCSS(".combo", "bounce");
        // comboCounter.classList.add('animate__animated', 'animate__shakeX');
        comboCounter.textContent = `${combo - 1}x Combo`;
      }
      //   if (combo < combo_table.length) {
      //     lines_sent += combo_table[combo];
      //   } else {
      //     lines_sent += combo_table[combo_table.length - 1];
      //   }
      if (zoneActivated) {
        if (lines_sent > 0) {
          clearType = [`${lines_sent}L Sent`, lines_sent];
        }
      } else if (linesCleared == 1) {
        if (tspin == true) {
          if (b2b == true) {
            lines_sent += 1;
          }
          if (mini == 0) {
            lines_sent += 2;
            clearType = ["T-Spin Single", "tss"];
          } else {
            clearType = ["T-Spin Single Mini", "tssm"];
          }
          b2b = true;
        } else if (pieceSpin) {
          if (b2b == true) {
            lines_sent += 1;
          }
          clearType = [`${pieceData[3]}-Spin Single`, `${pieceData[3]}ss`];
          b2b = true;
        } else {
          b2b = false;
        }
      } else if (linesCleared == 2) {
        lines_sent++;
        if (tspin == true) {
          if (b2b == true) {
            lines_sent += 1;
          }
          if (mini == 0) {
            lines_sent += 3;
            clearType = ["T-Spin Double", "tsd"];
          } else {
            clearType = ["T-Spin Double Mini", "tsdm"];
          }
          b2b = true;
        } else if (pieceSpin) {
          if (b2b == true) {
            lines_sent += 1;
          }
          clearType = [`${pieceData[3]}-Spin Double`, `${pieceData[3]}sd`];
          b2b = true;
        } else {
          b2b = false;
        }
      } else if (linesCleared == 3) {
        lines_sent += 2;
        if (tspin == true) {
          if (b2b == true) {
            lines_sent += 1;
          }
          clearType = ["T-Spin Triple", "tst"];
          lines_sent += 4;
          b2b = true;
        } else if (pieceSpin) {
          if (b2b == true) {
            lines_sent += 1;
          }
          clearType = [`${pieceData[3]}-Spin Triple`, `${pieceData[3]}st`];
          b2b = true;
        } else {
          b2b = false;
        }
      } else if (linesCleared == 4) {
        if (b2b == true) {
          lines_sent += 1;
        }
        if (pieceSpin) {
          clearType = [`${pieceData[3]}-Spin Quadra`, `${pieceData[3]}sq`];
          b2b = true;
        } else {
          clearType = ["Quadra", "tetris"];
        }
        lines_sent += 4;
        b2b = true;
      }

      if (pieceSpin) {
        lines_sent++;
      }

      pcY = matrixHeight - 1;
      while (pcY > 0) {
        for (var i = 0; i < matrixWidth; i++) {
          if (board[pcY][i] != 0) {
            pc = false;
            break;
          }
        }
        pcY--;
      }
      if (pc) {
        lines_sent += 6;
        clearType = [`Perfect Clear`, `pc`];
      }
      if (clearType.length != 0) {
        clearTypeGraphic(...clearType);
      }
      if (b2b) {
        if (b2bTracker.style.display == "block") {
          b2bTracker.className = "b2b";
          animateCSS(".b2b", "headShake");
        } else {
          b2bTracker.style.display = "block";
          b2bTracker.className = "b2b";
          animateCSS(".b2b", "bounceIn");
        }
      } else {
        if (b2bTracker.style.display == "block") {
          b2bTracker.className = "b2b";
          animateCSS(".b2b", "bounceOut");
          setTimeout(() => {
            b2bTracker.style.display = "none";
          }, 700);
        }
      }
    } else {
      if (combo > 1) {
        comboCounter.className = "combo";
        animateCSS(".combo", "bounceOut");
        setTimeout(() => {
          comboCounter.style.display = "none";
        }, 700);
      }
      combo = 0;
    }
  }

  if (lines_sent > 0 && combo < 2) {
    while (lines_received.length > 0 && lines_sent > 0) {
      lines_sent--;
      lines_received[0].garbage.shift();
      if (lines_received[0].garbage.length === 0) {
        lines_received.shift();
      }
    }
    updateBar();
    if (lines_sent > 0 && linesCleared != 0) {
      var playersAlive = playersList.filter((player) => player.alive);
      socket.emit("send_lines", lines_sent, playersAlive[target]?.id);

      total_lines_sent += lines_sent;
      if (gameType == "pvp") {
        updateScoreboard();
      }
    }
    lines_sent = 0;
  }

  if (queue.length < 10) {
    addBag();
  }
  piece = queue.shift();
  // graficks()

  pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
  blockInit();
  if (!controlsDisabled) {
    graficks()
    queueAnimation();
  }
  canHold = true;
  if (keyDict[controls["softdrop"][0]]) {
    keyDict[controls["softdrop"][0]][1] = new Date().getTime();
  }

  if (collide([pieceMatrix, x, y, piece])) {
    gameOver();
    return;
  }
  next_drop = grav;
  forceDrop = lockDelay;
  socket.emit("matrix", board);
}

function updateBar() {
  var tempColor;
  if (calculateLinesReceived(lines_received) < barColors.length) {
    tempColor = barColors[calculateLinesReceived(lines_received)];
  } else {
    tempColor = barColors[barColors.length - 1];
  }
  damageBar.setAttribute(
    "style",
    `background-color: ${tempColor}; height: ${32 * calculateLinesReceived(lines_received)}px;`
  );
}

function boardGraficks() {
  for (var pixelY = 0; pixelY < board.length; pixelY++) {
    for (var pixelX = 0; pixelX < board.length; pixelX++) {
      if (board[pixelY][pixelX] != 0) {
        var pixelColor = board[pixelY][pixelX];
        if (pixelColor == 9) {
          pixelColor = 0;
        }
        if (useSkin) {
          if (pixelY < zoneLines) {
            boardContext.drawImage(
              skin,
              skinSize * pixelColor,
              0,
              skinSize,
              skinSize,
              pixelX * ratioWidth,
              pixelY * ratioHeight,
              ratioWidth,
              ratioHeight
            );
          } else {
            boardContext.drawImage(
              skin,
              0,
              0,
              skinSize,
              skinSize,
              pixelX * ratioWidth,
              pixelY * ratioHeight,
              ratioWidth,
              ratioHeight
            );
          }
          // lineContext.drawImage(skin, 0, 0, skinSize, skinSize, ratioWidth * j, 0, skinSize, skinSize)
        } else {
          boardContext.fillStyle = colors[board[pixelY][pixelX]];
          boardContext.fillRect(pixelX * ratioWidth, pixelY * ratioHeight, ratioWidth, ratioHeight);
        }
        // boardContext.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
      }
    }
  }
}

function removeMatrix(matrix) {
  let newMatrix = matrix.filter(row => row.some(e => e != 0))  // filter the rows that have different values
    .map(row => row.slice(0));                  // copy them into newMatrix (so the original matrix isn't affected by altering them (the rows))

  if (newMatrix.length === 0) return newMatrix;                      // if newMatrix turned out to be rowless (then just retrun it without attempting to clean the columns)

  for (var i = newMatrix[0].length - 1; i >= 0; i--) {               // for each column (looping backwards so that removing  column won't affect the index i)
    if (matrix.every(row => row[i] === 0)) {                   // if all rows have the same value as first for the i-th column
      newMatrix.forEach(row => row.splice(i, 1));                 // then remove the i-th item (column) from each row
    }
  }

  return newMatrix;
}

function graficks() {
  //#909090
  // if (!gameStarted) {
  //     return
  // }

  boardContext.clearRect(0, 0, boardWidth, boardHeight);

  if (gameStarted && !controlsDisabled) {
    pieceGraficks();
  }

  // Generate Board
  boardGraficks();

  // Generates Held
  heldGraficks();

  queueGraficks()

}

function pieceGraficks() {
  // Generate Ghost piece
  boardContext.globalAlpha = 0.3;
  ghostY = y;
  while (!collide([pieceMatrix, x, ghostY + 1, piece])) {
    ghostY++;
  }
  for (var testY = 0; testY < pieceMatrix.length; testY++) {
    for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
      if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
        if (useSkin) {
          boardContext.drawImage(
            skin,
            skinSize * pieceMatrix[testY][testX],
            0,
            skinSize,
            skinSize,
            (testX + x) * ratioWidth,
            (testY + ghostY) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        } else {
          boardContext.fillStyle = "#202020";
          boardContext.fillRect(
            (testX + x) * ratioWidth,
            (testY + ghostY) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        }
      }
    }
  }
  boardContext.globalAlpha = 1;

  // Generate Current piece
  for (var testY = 0; testY < pieceMatrix.length; testY++) {
    for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
      if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
        if (useSkin) {
          boardContext.drawImage(
            skin,
            skinSize * pieceMatrix[testY][testX],
            0,
            skinSize,
            skinSize,
            (testX + x) * ratioWidth,
            (testY + y) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        } else {
          boardContext.fillStyle = colors[pieceMatrix[testY][testX]];
          boardContext.fillRect(
            (testX + x) * ratioWidth,
            (testY + y) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        }
      }
    }
  }
}

function heldGraficks() {
  heldContext.clearRect(0, 0, heldWidth, heldHeight);
  if (held) {
    tempMatrix = JSON.parse(JSON.stringify(piece_matrix[held]));

    fixedTempMatrix = removeMatrix(tempMatrix)

    if (fixedTempMatrix.length == 1) {
      fixedTempMatrix.push(new Array(fixedTempMatrix[0].length).fill(0));
      fixedTempMatrix.unshift(new Array(fixedTempMatrix[0].length).fill(0));
    }
    x_displace = heldWidth / 2 - (fixedTempMatrix[0].length * ratioWidth) / 2;
    y_displace = heldHeight / 2 - (fixedTempMatrix.length * ratioHeight) / 2;

    for (var queueY = 0; queueY < piece_matrix[held].length; queueY++) {
      for (var queueX = 0; queueX < piece_matrix[held][0].length; queueX++) {
        if (
          piece_matrix[held][queueY][queueX] != 0 &&
          piece_matrix[held][queueY][queueX] != 9
        ) {
          color = piece_matrix[held][queueY][queueX];

          if (useSkin) {
            heldContext.drawImage(
              skin,
              skinSize * color,
              0,
              skinSize,
              skinSize,
              queueX * ratioWidth + x_displace,
              queueY * ratioHeight + y_displace,
              ratioWidth,
              ratioHeight
            );
          } else {
            heldContext.fillStyle = colors[color];
            heldContext.fillRect(
              queueX * ratioWidth + x_displace,
              queueY * ratioHeight + y_displace,
              ratioWidth,
              ratioHeight
            );
          }
        }
      }
    }
  }
}

function queueGraficks() {
  queueContext.clearRect(0, 0, queueWidth, queueHeight);
  if (queue.length < 6) {
    return;
  }
  for (var q = 0; q < 6; q++) {
    tempMatrix = JSON.parse(JSON.stringify(piece_matrix[queue[q]]));
    fixedTempMatrix = removeMatrix(tempMatrix)
    if (fixedTempMatrix.length == 1) {
      fixedTempMatrix.push(new Array(fixedTempMatrix[0].length).fill(0));
      fixedTempMatrix.unshift(new Array(fixedTempMatrix[0].length).fill(0));
    }
    x_displace = queueWidth / 2 - (fixedTempMatrix[0].length * ratioWidth) / 2;
    y_displace = queueHeight / 12 - (fixedTempMatrix.length * ratioHeight) / 2;

    for (var queueY = 0; queueY < piece_matrix[queue[q]].length; queueY++) {
      for (var queueX = 0; queueX < piece_matrix[queue[q]][0].length; queueX++) {
        if (
          piece_matrix[queue[q]][queueY][queueX] != 0 &&
          piece_matrix[queue[q]][queueY][queueX] != 9
        ) {
          color = piece_matrix[queue[q]][queueY][queueX];

          if (useSkin) {
            queueContext.drawImage(
              skin,
              skinSize * color,
              0,
              skinSize,
              skinSize,
              queueX * ratioWidth + x_displace,
              queueY * ratioHeight + y_displace + ratioQueueHeight * 3 * q,
              ratioWidth,
              ratioHeight
            );
          } else {
            queueContext.fillStyle = colors[color];
            queueContext.fillRect(
              queueX * ratioWidth + x_displace,
              queueY * ratioHeight + y_displace + ratioQueueHeight * 3 * q,
              ratioWidth,
              ratioHeight
            );
          }
        }
      }
    }
  }
}

function other_graficks(id) {
  //#909090
  playerData = playersList.find((j) => j.id === id);
  var otherCanvas = playerData.element.getElementsByClassName("other_board")[0];
  var otherContext = otherCanvas.getContext("2d");
  otherContext.clearRect(0, 0, boardWidth, boardHeight);

  // Generate Ghost piece
  otherContext.globalAlpha = 0.3;
  ghostY = playerData.y;
  while (
    !collide(
      [playerData.pieceMatrix, playerData.x, ghostY + 1, playerData.piece],
      playerData.board
    ) ||
    ghostY < matrixHeight
  ) {
    ghostY++;
  }
  for (var testY = 0; testY < playerData.pieceMatrix.length; testY++) {
    for (var testX = 0; testX < playerData.pieceMatrix[0].length; testX++) {
      if (playerData.pieceMatrix[testY][testX] != 0 && playerData.pieceMatrix[testY][testX] != 9) {
        if (useSkin) {
          otherContext.drawImage(
            skin,
            skinSize * playerData.pieceMatrix[testY][testX],
            0,
            skinSize,
            skinSize,
            (testX + playerData.x) * ratioWidth,
            (testY + ghostY) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        } else {
          otherContext.fillStyle = "#202020";
          otherContext.fillRect(
            (testX + playerData.x) * ratioWidth,
            (testY + ghostY) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        }
      }
    }
  }
  otherContext.globalAlpha = 1;

  // Generate Current piece
  for (var testY = 0; testY < playerData.pieceMatrix.length; testY++) {
    for (var testX = 0; testX < playerData.pieceMatrix[0].length; testX++) {
      if (playerData.pieceMatrix[testY][testX] != 0 && playerData.pieceMatrix[testY][testX] != 9) {
        if (useSkin) {
          otherContext.drawImage(
            skin,
            skinSize * playerData.pieceMatrix[testY][testX],
            0,
            skinSize,
            skinSize,
            (testX + playerData.x) * ratioWidth,
            (testY + playerData.y) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        } else {
          otherContext.fillStyle = colors[playerData.pieceMatrix[testY][testX]];
          otherContext.fillRect(
            (testX + playerData.x) * ratioWidth,
            (testY + playerData.y) * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        }
      }
    }
  }

  // Generate Board
  for (var pixelY = 0; pixelY < playerData.board.length; pixelY++) {
    for (var pixelX = 0; pixelX < playerData.board.length; pixelX++) {
      if (playerData.board[pixelY][pixelX] != 0) {
        var pixelColor = playerData.board[pixelY][pixelX];
        if (pixelColor == 9) {
          pixelColor = 0;
        }
        if (useSkin) {
          otherContext.drawImage(
            skin,
            skinSize * pixelColor,
            0,
            skinSize,
            skinSize,
            pixelX * ratioWidth,
            pixelY * ratioHeight,
            ratioWidth,
            ratioHeight
          );
        } else {
          otherContext.fillStyle = colors[playerData.board[pixelY][pixelX]];
          otherContext.fillRect(pixelX * ratioWidth, pixelY * ratioHeight, ratioWidth, ratioHeight);
        }
        // otherContext.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
      }
    }
  }

  // // Generates Queue
  // queueContext.clearRect(0, 0, queueWidth, queueHeight);
  // for (var q = 0; q < 6; q++) {
  //     for (var queueY = 0; queueY < piece_matrix[queue[q]].length; queueY++) {
  //         for (var queueX = 0; queueX < piece_matrix[queue[q]][0].length; queueX++) {
  //             if (piece_matrix[queue[q]][queueY][queueX] != 0 && piece_matrix[queue[q]][queueY][queueX] != 9) {
  //                 color = piece_matrix[queue[q]][queueY][queueX]
  //                 tempRatioX = ratioQueueWidth * 4
  //                 tempRatioY = ratioQueueHeight * 4
  //                 x_displace = 0
  //                 y_displace = 0
  //                 if (queue[q] == "I" || queue[q] == "O") {
  //                     tempRatioX = ratioQueueWidth * 3
  //                     tempRatioY = ratioQueueHeight * 3
  //                     if (queue[q] == "O") {
  //                         x_displace = 1
  //                         y_displace = 1
  //                     }
  //                 }

  //                 if (useSkin) {
  //                     queueContext.drawImage(skin, skinSize * (color), 0, skinSize, skinSize, (queueX + x_displace) * tempRatioX, (queueY + y_displace) * tempRatioY + (ratioQueueHeight * 12) * q, tempRatioX, tempRatioY)
  //                 } else {
  //                     queueContext.fillStyle = colors[color];
  //                     queueContext.fillRect((queueX + x_displace) * tempRatioX, (queueY + y_displace) * tempRatioY + (ratioQueueHeight * 12) * q, tempRatioX, tempRatioY)
  //                 }
  //             }
  //         }
  //     }
  // }

  // // Generates Held
  // if (held) {
  //     heldContext.clearRect(0, 0, heldWidth, heldHeight);
  //     for (var queueY = 0; queueY < piece_matrix[held].length; queueY++) {
  //         for (var queueX = 0; queueX < piece_matrix[held][0].length; queueX++) {
  //             if (piece_matrix[held][queueY][queueX] != 0 && piece_matrix[held][queueY][queueX] != 9) {
  //                 tempRatioX = ratioQueueWidth * 4
  //                 tempRatioY = ratioQueueHeight * 4
  //                 x_displace = 0
  //                 y_displace = 0
  //                 if (held == "I" || held == "O") {
  //                     tempRatioX = ratioQueueWidth * 3
  //                     tempRatioY = ratioQueueHeight * 3
  //                     if (held == "O") {
  //                         x_displace = 1
  //                         y_displace = 1
  //                     }
  //                 }
  //                 color = piece_matrix[held][queueY][queueX]

  //                 if (useSkin) {
  //                     heldContext.drawImage(skin, skinSize * (color), 0, skinSize, skinSize, (queueX + x_displace) * tempRatioX, (queueY + y_displace) * tempRatioY, tempRatioX, tempRatioY)
  //                 } else {
  //                     heldContext.fillStyle = colors[color];
  //                     heldContext.fillRect((queueX + x_displace) * tempRatioX, (queueY + y_displace) * tempRatioY, tempRatioX, tempRatioY)
  //                 }
  //             }
  //         }
  //     }
  // }
}

function queueAnimation() {
  queueCanvas.style.transition = "0s";
  queueCanvas.style.top = `${ratioHeight * 3}px`;
  setTimeout(() => {
    queueCanvas.style.transition = "";
    queueCanvas.style.top = "0px";
  }, 1000 / 60);
}

function garbageAnimation(delay, distance) {
  boardCanvas.style.transition = "0s";
  boardCanvas.style.top = `${ratioHeight * distance - 32 * (matrixHeight - 20)}px`;
  setTimeout(() => {
    boardCanvas.style.transition = `${(delay * distance) / 1000}s`;
    boardCanvas.style.top = `-${32 * (matrixHeight - 20)}px`;
  }, 1000 / 60);
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function gameOver() {
  graficks()
  alive = false;
  if (gameType == "pvp") {
    updateScoreboard();
  }
  endGame();
  console.log(
    `${playersList.find((player) => player.id === last_sender)?.username || "boss"} killed you`
  );

  if (gameType == "pve") {
    var respawnCountdown = respawnTimers[lives];
    respawnBar.textContent = "Topped out";
  } else {
    respawnBar.textContent =
      ordinal_suffix_of(playersList.filter((player) => player.alive).length + 1) + " place";
  }
  if (lives > 0) {
    lives--;
  }
  socket.emit("send_respawn", last_sender);
  respawnBar.style.display = "block";
  respawnOverlay.style.display = "block";
  respawnBar.style.opacity = 0.7;
  respawnOverlay.style.opacity = 0.3;
  queueCanvas.style.transition = "1s";
  queueCanvas.style.opacity = 0;
  heldCanvas.style.transition = "1s";
  heldCanvas.style.opacity = 0;
  if (gameType === "unused") {
    boardCanvas.style.transition = "1s";
    boardCanvas.style.opacity = 0;
    setTimeout(() => {
      init();
    }, 1000);
    respawnInterval = setInterval(() => {
      respawnCountdown--;
      respawnBar.textContent = respawnCountdown;
      // respawnBar.style.display = 'block'
      // respawnOverlay.style.display = 'block'
      if (respawnCountdown <= 0) {
        // respawnBar.style.display = 'none'
        // respawnOverlay.style.display = 'none'
        respawnBar.style.opacity = 0;
        respawnOverlay.style.opacity = 0;
        boardCanvas.style.transition = "0s";
        boardCanvas.style.opacity = 1;
        queueCanvas.style.transition = "0s";
        queueCanvas.style.opacity = 1;
        heldCanvas.style.transition = "0s";
        heldCanvas.style.opacity = 1;
        gameStarted = true;
        graficks();
        lines_received = [];
        clearInterval(respawnInterval);
        return;
      }
    }, 1000);
  }
}

function endGame() {
  lines_received = [];
  updateBar();
  clearInterval(targetLoop);
  clearDisplay.innerHTML = "";
  gameStarted = false;
  keyDict = {};
  if (comboCounter.style.display == "block") {
    comboCounter.className = "combo";
    animateCSS(".combo", "bounceOut");
    setTimeout(() => {
      comboCounter.style.display = "none";
    }, 700);
  }
  if (b2bTracker.style.display == "block") {
    b2bTracker.className = "b2b";
    animateCSS(".b2b", "bounceOut");
    setTimeout(() => {
      b2bTracker.style.display = "none";
    }, 700);
  }
}

function otherRespawn(id) {
  playerData = playersList.find((j) => j.id === id);
  playerData.alive = false;
  if (gameType == "pvp") {
    updateScoreboard();
  }
  var respawnOverlayOther = playerData.element.getElementsByClassName("respawn_other")[0];
  var respawnBarOther = playerData.element.getElementsByClassName("respawn-bar_other")[0];

  respawnBarOther.style.opacity = 0.7;
  respawnOverlayOther.style.opacity = 0.3;
  if (gameType == "pve") {
    respawnBarOther.textContent = "Topped out";
  } else {
    var placement = playersList.filter((player) => player.alive).length + 1;
    if (currentlyPlaying) {
      placement++;
    }
    respawnBarOther.textContent = ordinal_suffix_of(placement) + " place";
  }

  // if (gameType === "unused") {
  //     var otherCanvas = playerData.element.getElementsByClassName("other_board")[0];

  //     otherCanvas.style.transition = "1s";
  //     otherCanvas.style.opacity = 0;
  //     var otherCountdown = time;
  //     respawnBarOther.textContent = otherCountdown;
  //     otherInterval = setInterval(() => {
  //         otherCountdown--;
  //         respawnBarOther.textContent = otherCountdown;
  //         if (otherCountdown <= 0) {
  //             other_board = [];
  //             while (other_board.length < matrixHeight) {
  //                 other_board.unshift([...empty_line]);
  //             }
  //             playerData = {
  //                 ...playerData,
  //                 piece: null,
  //                 x: 0,
  //                 y: 0,
  //                 rotation: 0,
  //                 board: other_board,
  //                 pieceMatrix: [0],
  //             };
  //             other_graficks(id);
  //             respawnBarOther.style.opacity = 0;
  //             respawnOverlayOther.style.opacity = 0;
  //             otherCanvas.style.transition = "0s";
  //             otherCanvas.style.opacity = 1;
  //             clearInterval(otherInterval);
  //             return;
  //         }
  //     }, 1000);
  // }
}

function move(key) {
  if (!gameStarted || controlsDisabled) {
    return;
  }
  var keys = Object.keys(controls);
  for (var i = 0; i < keys.length; i++) {
    if (controls[keys[i]][0] == parseInt(key)) {
      move_type = keys[i];
      eval(move_type + "()");
      pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
      for (var j = 0; j < rotation; j++) {
        rotate(pieceMatrix);
      }
      if (gameStarted && !controlsDisabled) {
        graficks();
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

  function hold() {
    if (!canHold) {
      return;
    }
    if (held == null || held == 0) {
      held = piece;
      piece = queue.shift();
      graficks();
      queueAnimation();
      if (queue.length < 10) {
        addBag();
      }
    } else {
      [held, piece] = [piece, held];
    }
    canHold = false;
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    blockInit();
    forceDrop = lockDelay;
  }

  function softdrop() {
    if (controls.grav_ARR == 0) {
      while (!collide([pieceMatrix, x, y + 1, piece])) {
        y++;
        socket.emit("piece_pos", piece, x, y, rotation);
        lastMoveRotate = false;
        floorPlace = grav;
      }
    } else if (!collide([pieceMatrix, x, y + 1, piece])) {
      y++;
      socket.emit("piece_pos", piece, x, y, rotation);
      lastMoveRotate = false;
      floorPlace = grav;
    }
  }

  function move_right() {
    if (!collide([pieceMatrix, x + 1, y, piece])) {
      x++;
      lastMoveRotate = false;
      floorPlace = grav;
      socket.emit("piece_pos", piece, x, y, rotation);
    }
  }

  function move_left() {
    if (!collide([pieceMatrix, x - 1, y, piece])) {
      x--;
      lastMoveRotate = false;
      floorPlace = grav;
      socket.emit("piece_pos", piece, x, y, rotation);
    }
  }

  function rotate_left() {
    old_rotation = rotation;
    counterclockwise();
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
      rotate(pieceMatrix);
    }
    if (!tryWallkick(old_rotation, rotation)) {
      clockwise();
    } else {
      floorPlace = grav;
      socket.emit("piece_pos", piece, x, y, rotation);
    }
  }

  function rotate_right() {
    old_rotation = rotation;
    clockwise();
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
      rotate(pieceMatrix);
    }
    if (!tryWallkick(old_rotation, rotation)) {
      counterclockwise();
    } else {
      floorPlace = grav;
      socket.emit("piece_pos", piece, x, y, rotation);
    }
  }

  function rotate_180() {
    old_rotation = rotation;
    clockwise();
    clockwise();
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
      rotate(pieceMatrix);
    }
    if (!tryWallkick(old_rotation, rotation)) {
      counterclockwise();
      counterclockwise();
    } else {
      floorPlace = grav;
    }
  }

  function restart() {
    console.log("cannot restart");
  }
}

function harddrop() {
  let dropY = y;
  while (!collide([pieceMatrix, x, dropY + 1, piece])) {
    dropY++;
    lastMoveRotate = false;
  }
  place([pieceMatrix, x, dropY, piece]);
  lastMoveRotate = false;
}

function calculateLinesReceived(receivedArray) {
  return receivedArray.reduce((a, b) => a + (b.garbage?.length || 0), 0);
}

function calculateHoles(totalSent) {
  var holeIndex = Math.floor(Math.random() * Math.floor(matrixWidth));
  var garbageIndexes = [];
  var chance = -.2;
  for (let i = 0; i < totalSent; i++) {
    garbageIndexes.push(holeIndex);
    var d = Math.random();
    if (d < chance) {
      var prevNum = holeIndex
      holeIndex = Math.floor(Math.random() * Math.floor(matrixWidth));
      var adder = Math.floor(Math.random() * Math.floor(matrixWidth - 1));
      if (holeIndex == prevNum) {
        holeIndex = (holeIndex + 1 + adder) % matrixWidth;
      }
      chance = -.2;
    } else {
      chance += 0.2;
    }
  }
  //console.log(garbageIndexes)
  return garbageIndexes;
}

function blockInit() {
  x = parseInt(matrixWidth / 2 - pieceMatrix.length / 2);
  if (piece == "O") {
    x++
  }
  y = 3;
  rotation = 0;
  socket.emit("piece_pos", piece, x, y, rotation);
}

function retarget() {
  if (previousTarget && document.getElementById(previousTarget)) {
    document.getElementById(previousTarget).getElementsByClassName("other_grid")[0].style.border =
      "solid white 9px";
  }
  target++;
  var playersAlive = playersList.filter((player) => player.alive);
  target = target % playersAlive.length;
  previousTarget = playersAlive[target].id;
  document
    .getElementById(playersAlive[target].id)
    .getElementsByClassName("other_grid")[0].style.border = "solid green 9px";
}

function init() {
  queueCanvas.style.transition = "0s";
  queueCanvas.style.opacity = 1;
  heldCanvas.style.transition = "0s";
  heldCanvas.style.opacity = 1;
  canHold = true;
  board = [];
  zoneLines = matrixHeight;
  while (board.length < matrixHeight) {
    board.unshift([...empty_line]);
  }
  combo = 0;
  queue = [];
  last_sender = socket.id;
  addBag();
  piece = null;
  held = null;
  lastMoveRotate = false;
  b2b = false;
  alive = true;
  lines_sent = 0;
  total_lines_sent = 0;
  lines_received = [];
  if (gameType == "pvp") {
    target = Math.floor(Math.random() * playersList.length);
    previousTarget = null;
    clearInterval(targetLoop);
    targetLoop = setInterval(() => {
      retarget();
    }, 1000);
  }
  //graficks();
  //socket.emit("matrix", board);
}

function startGame() {
  init();
  graficks();
  if (gameType == "pvp") {
    retarget();
  }
  currentlyPlaying = true;
  var countdown = 3;
  respawnBar.style.display = "block";
  respawnOverlay.style.display = "block";
  respawnBar.style.opacity = 0.7;
  respawnOverlay.style.opacity = 0.3;
  respawnBar.textContent = countdown;
  countdown--;
  var countdownInterval = setInterval(() => {
    respawnBar.textContent = countdown;
    if (countdown == 1) {
      respawnBar.style.opacity /= 5;
      respawnOverlay.style.opacity /= 5;
    }
    if (countdown === 0) {
      respawnBar.style.display = "none";
      respawnOverlay.style.display = "none";
      respawnBar.style.opacity = 0.7;
      respawnOverlay.style.opacity = 0.3;
      gameStarted = true;

      piece = queue.shift();
      pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
      blockInit();
      graficks();
      clearInterval(countdownInterval);
    }
    countdown--;
  }, 1000);
}

function initOther(id, username, sent = 0, alive = true) {
  var other_board;
  other_board = [];
  while (other_board.length < matrixHeight) {
    other_board.unshift([...empty_line]);
  }
  var clone = templateDiv.cloneNode(true); // true means clone all childNodes and all event handlers
  clone.id = id;
  clone.getElementsByClassName("username")[0].textContent = username;
  otherPlayersDiv.appendChild(clone);
  return {
    id: id,
    piece: null,
    x: 0,
    y: 0,
    rotation: 0,
    board: other_board,
    pieceMatrix: [0],
    element: clone,
    username: username,
    alive: alive,
    sent: sent,
  };
}

function initScoreboard() {
  scoreboard.innerHTML = `<div class="scoreboardTitle">
    <div class="scoreboardUsername">Username</div>
    <div class="scoreboardWins">Wins</div>
    <div class="scoreboardSent">Sent</div>
  </div>
  <div id="scoreboardTemplate" class="scoreboardItem">
    <div class="scoreboardUsername">0</div>
    <div class="scoreboardWins">0</div>
    <div class="scoreboardSent">0</div>
  </div>`;
  for (var i = 0; i < lobbyList.length; i++) {
    var clone = scoreboardTemplate.cloneNode(true);
    clone.getElementsByClassName("scoreboardUsername")[0].textContent = lobbyList[i].username;
    clone.id = lobbyList[i].id + "-scoreboard";
    clone.style.top = (i + 1) * 50 + "px";
    scoreboard.appendChild(clone);
  }
  scoreboard.style.height = (lobbyList.length + 1) * 50 + "px";
}

function orderScoreboard() {
  var sortedList = [...lobbyList];
  sortedList.sort((a, b) => b.wins - a.wins);
  scoreboard.style.height = (sortedList.length + 1) * 50 + "px";
  for (var i = 0; i < sortedList.length; i++) {
    var playerElement = document.getElementById(sortedList[i].id + "-scoreboard");
    playerElement.getElementsByClassName("scoreboardWins")[0].textContent = sortedList[i].wins;
    playerElement.style.color = "white";
    playerElement.style.top = (i + 1) * 50 + "px";
    playerElement.style.opacity = 1;
    playerElement.getElementsByClassName("scoreboardSent")[0].textContent = "0"
  }
}

function updateScoreboard() {
  var fullPlayerList = [...playersList];
  if (currentlyPlaying) {
    fullPlayerList.push({ id: socket.id, sent: total_lines_sent, alive: alive });
  }
  for (var i = 0; i < fullPlayerList.length; i++) {
    var playerElement = document.getElementById(fullPlayerList[i].id + "-scoreboard");
    playerElement.getElementsByClassName("scoreboardSent")[0].textContent = fullPlayerList[i].sent;
    if (!fullPlayerList[i].alive) {
      playerElement.style.color = "red";
      playerElement.style.opacity = 0.7;
    }
  }
}

function priorityHovered(element) {
  if (isSpectator) {
    return;
  }
  var playerIndex = lobbyList.findIndex((player) => player.id === socket.id);
  if (parseInt(element.id.substring(8)) - 1 == playerIndex) {
    if (lobbyList[playerIndex].ready) {
      element.getElementsByClassName("priorityUsername")[0].textContent = "Cancel";
    } else {
      element.getElementsByClassName("priorityUsername")[0].textContent = "Ready";
    }
  } else {
    element.getElementsByClassName("priorityUsername")[0].textContent = "Swap";
  }
  console.log(element);
}

function priorityUnhovered(element) {
  if (isSpectator) {
    return;
  }
  element.getElementsByClassName("priorityUsername")[0].textContent =
    lobbyList[parseInt(element.id.substring(8)) - 1].username;
}

function priorityClick(element) {
  if (isSpectator) {
    return;
  }
  var playerIndex = lobbyList.findIndex((player) => player.id === socket.id);
  var curIndex = parseInt(element.id.substring(8)) - 1;
  if (curIndex == playerIndex) {
    socket.emit("ready_toggle", playerIndex);
  } else {
    socket.emit("swap_priority", playerIndex, curIndex);
  }
}

function updateLobby() {
  lobbyDiv.innerHTML = "";
  console.log(lobbyList);
  var scale = lobbyList.length;
  if (scale == 1) {
    scale = 2;
  } else if (scale > 5) {
    scale = 5;
  }
  for (var i = 0; i < lobbyList.length; i++) {
    var playerItem = priorityDiv.cloneNode(true);
    playerItem.id = `priority${i + 1}`;
    playerItem.style.fontSize = `${150 / scale}px`;
    playerItem.getElementsByClassName("priorityText priorityUsername")[0].style.fontSize = `${150 / scale
      }px`;
    playerItem.getElementsByClassName("priorityText priorityNumber")[0].style.fontSize = `${150 / scale
      }px`;
    playerItem.style.borderWidth = `${60 / scale}px`;
    playerItem.style.lineHeight = `${600 / scale - 30}px`;
    playerItem.getElementsByClassName("priorityText priorityUsername")[0].textContent =
      lobbyList[i].username;

    playerItem.getElementsByClassName("priorityText priorityNumber")[0].textContent = `#${i + 1}`;
    if (lobbyList[i].ready) {
      playerItem.style.borderStyle = "inset";
    }
    lobbyDiv.appendChild(playerItem);
  }
}

function updateGameOver() {
  gameOverPlayersDiv.innerHTML = "";
  var tempLobbyList = [...lobbyList];
  if (gameType == "pve") {
    tempLobbyList.sort((a, b) => {
      return b.sent - a.sent;
    });
  } else {
    tempLobbyList.sort((a, b) => {
      return b.wins - a.wins;
    });
  }

  for (var i = 0; i < tempLobbyList.length; i++) {
    var playerItem = gameOverTemplate.cloneNode(true);
    playerItem.id = `gameOverPlayer${i}`;
    playerItem.getElementsByClassName("gameOverText gameOverRanking")[0].textContent = `#${i + 1}`;
    playerItem.getElementsByClassName("gameOverText gameOverUsername")[0].textContent =
      tempLobbyList[i].username;
    if (gameType == "pvp") {
      playerItem.getElementsByClassName("gameOverScoreItem")[0].style.display = "block";
      playerItem.getElementsByClassName("gameOverScoreItem")[2].style.display = "block";
      playerItem.getElementsByClassName("gameOverValue")[0].textContent = tempLobbyList[i].wins;
      playerItem.getElementsByClassName("gameOverValue")[2].textContent = tempLobbyList[i].kills;
      playerItem.getElementsByClassName("gameOverScoreItem")[1].style.display = "none";
      playerItem.getElementsByClassName("gameOverScoreItem")[3].style.display = "none";
    } else {
      playerItem.getElementsByClassName("gameOverScoreItem")[0].style.display = "none";
      playerItem.getElementsByClassName("gameOverScoreItem")[2].style.display = "none";
      playerItem.getElementsByClassName("gameOverValue")[1].textContent =
        tempLobbyList[i].sent + "L";
      playerItem.getElementsByClassName("gameOverValue")[3].textContent =
        tempLobbyList[i].received + "L";
    }
    gameOverPlayersDiv.appendChild(playerItem);
  }
}

function nextGameOver() {
  gameOverContainer.style.opacity = "0";
  setTimeout(() => {
    gameOverContainer.style.display = "none";
    lobbyContainer.style.display = "block";
    lobbyContainer.style.opacity = "0";
    setTimeout(() => {
      lobbyContainer.style.opacity = "1";
    }, 1000 / 60);
  }, 500);
}

function handleSpectator() {
  if (isSpectator) {
    if (maxPlayers <= lobbyList.length) {
      return;
    }
    isSpectator = false;
    spectateButton.textContent = "Spectate";
    socket.emit("from_spectator", username);
  } else {
    isSpectator = true;
    spectateButton.textContent = "Unspectate";
    socket.emit("to_spectator");
  }
}

function initSpectator() {
  mainDiv.style.display = "none";
  statusWrapper.style.display = "none";
  otherPlayersWrapper.style.width = "1014px";
  if (gameType == "pvp") {
    scoreboard.style.display = "block";
  } else {
    scoreboard.style.display = "none";
  }
}

function initPlayer() {
  mainDiv.style.display = "block";
  statusWrapper.style.display = "block";
  otherPlayersWrapper.style.width = "338px";
  if (gameType == "pvp") {
    // otherPlayersWrapper.style.position = "absolute";
    // otherPlayersWrapper.style.right = "90px";
    scoreboard.style.display = "block";
    statusWrapper.style.display = "none";
  } else {
    otherPlayersWrapper.style = "";
    scoreboard.style.display = "none";
    statusWrapper.style.display = "block";
  }
}

function resizeOtherPlayers() {
  var otherPlayerElements = otherPlayersDiv.getElementsByClassName("player_other");
  if (otherPlayerElements.length == 0) {
    return;
  }
  var playerAmounts = otherPlayerElements.length;
  if (isSpectator) {
    playerAmounts /= 3;
    console.log("scaleFactor");
  }
  var tempHeight = 723;
  var tempWidth = 338;

  var multiplier = Math.ceil(Math.sqrt(playerAmounts));
  var scaleFactor = 1 / multiplier;

  //var leftoverWidth = tempWidth * multiplier - playerAmounts * scaleFactor * tempWidth
  scaleFactor *= 698 / 698; //hehehehe
  if (isSpectator && playerAmounts < multiplier) {
    scaleFactor *= multiplier / playerAmounts;
    //this is fine
  }
  if (scaleFactor > 1) {
    scaleFactor = 1;
  }

  console.log(scaleFactor);
  for (var i = 0; i < otherPlayerElements.length; i++) {
    otherPlayerElements[i].style.transform = `scale(${scaleFactor}, ${scaleFactor})`;
    otherPlayerElements[i].style.marginTop = `${(tempHeight * scaleFactor - tempHeight) / 2}px`;
    otherPlayerElements[i].style.marginBottom = `${(tempHeight * scaleFactor - tempHeight) / 2}px`;
    otherPlayerElements[i].style.marginLeft = `${(tempWidth * scaleFactor - tempWidth) / 2}px`;
    otherPlayerElements[i].style.marginRight = `${(tempWidth * scaleFactor - tempWidth) / 2}px`;
    //otherPlayerElements[i].style.marginLeft = `${(leftoverWidth/playerAmounts) / 2}px`;
    //otherPlayerElements[i].style.marginRight = `${(leftoverWidth/playerAmounts) / 2}px`;
  }
}

var board;
var combo;
var queue;
var piece;
var held;
var y;
var rotation;
var lastMoveRotate;
var b2b;
var lines_sent;
var alive;
var total_lines_sent;
var canHold;
var lines_received;
var playersList = [];
var lobbyList = [];
var gameType;
var zoneLines;
var currentlyPlaying = false;
var isSpectator;
var lives = 2;
var username = sessionStorage.getItem("username");
document.getElementsByClassName("mainUsername")[0].textContent = username;
var maxPlayers;
var target;
var previousTarget;
var targetLoop;
var seed

//const socket = io('ws://68.49.156.186:3000');
const socket = io("wss://" + window.location.host);

socket.on("connect", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("room")) {
    socket.emit("room", params.get("room"), username);
  } else {
    socket.emit("room", "default", username);
  }
});
socket.on("start_game", (serverSeed) => {
  console.log(serverSeed)
  if (!currentlyPlaying) {
    lobbyContainer.style.opacity = "0";
    ingameWrapper.style.opacity = "0";
    gameOverContainer.style.opacity = "0";
    for (var i = 0; i < lobbyList.length; i++) {
      var playerData = lobbyList[i];
      if (playerData.id != socket.id) {
        playersList.push(initOther(playerData.id, playerData.username));
      }
    }
    if (gameType == "pvp") {
      initScoreboard();
    }
    for (var i = 0; i < playersList.length; i++) {
      var playerData = playersList[i];
      var respawnOverlayOther = playerData.element.getElementsByClassName("respawn_other")[0];
      var respawnBarOther = playerData.element.getElementsByClassName("respawn-bar_other")[0];

      respawnBarOther.style.opacity = 0;
      respawnOverlayOther.style.opacity = 0;
    }

    setTimeout(() => {
      gameOverContainer.style.display = "none";
      lobbyContainer.style.display = "none";
      ingameWrapper.style.display = "block";
      ingameWrapper.style.opacity = "1";
      resizeOtherPlayers();
      //window.onresize = resizeOtherPlayers;
    }, 500);
  }

  if (!isSpectator) {
    seed = new Math.seedrandom(serverSeed);
    initPlayer();
    startGame();
  } else {
    lobbyContainer.style.display = "none";
    ingameWrapper.style.display = "block";
    initSpectator();
    resizeOtherPlayers();
  }
});
socket.on("restart_game", (players, serverSeed) => {
  console.log(serverSeed)
  otherPlayersDiv.innerHTML = "";
  gameStarted = false;
  lobbyList = players;
  playersList = [];
  for (var i = 0; i < lobbyList.length; i++) {
    var playerData = lobbyList[i];
    if (playerData.id != socket.id) {
      playersList.push(initOther(playerData.id, playerData.username));
    }
  }
  if (gameType == "pvp") {
    orderScoreboard();
    //updateScoreboard();
  }
  resizeOtherPlayers();
  if (!isSpectator) {
    endGame();
    seed = new Math.seedrandom(serverSeed);
    startGame();
  }
});
socket.on("game_over", (data) => {
  //window.onresize = null
  lobbyList = data.players;
  updateLobby();
  playersList = [];
  currentlyPlaying = false;
  // gameStarted = false;
  if (gameType == "pvp") {
    orderScoreboard();
  }
  endGame();
  updateGameOver();
  // it's not pretty but it works
  setTimeout(() => {
    ingameWrapper.style.opacity = "0";

    setTimeout(() => {
      ingameWrapper.style.display = "none";
      otherPlayersDiv.innerHTML = "";
      gameOverContainer.style.opacity = "0";
      gameOverContainer.style.display = "block";
      setTimeout(() => {
        gameOverContainer.style.opacity = "1";
      }, 1000 / 60);

    }, 500);
  }, 1000);
});
socket.on("lobby_data", (data) => {
  lobbyList = data.players;
  maxPlayers = data.maxPlayers;
  if (lobbyList.find((player) => player.id == socket.id)) {
    isSpectator = false;
    spectateButton.textContent = "Spectate";
  } else {
    spectateButton.textContent = "Unspectate";
    isSpectator = true;
  }
  updateLobby();
  if (data.started && !currentlyPlaying) {
    isSpectator = true;
    lobbyContainer.style.display = "none";
    ingameWrapper.style.display = "block";
    ingameWrapper.style.opacity = 1;
    mainDiv.style.display = "none";
  } else if (!data.started) {
    lobbyContainer.style.display = "block";
    ingameWrapper.style.display = "none";
  }
  gameType = data.gametype;
});
// socket.on("add_player", (id, other_username, other_board) => {
//     if (id != socket.id && !playersList.some((e) => e.id === id)) {
//         playersList.push(initOther(id, other_username, other_board));
//         socket.emit("update_players", socket.id, id, username, board);
//     }
// });
socket.on("spectate_add_players", (players) => {
  for (var i = 0; i < players.length; i++) {
    playersList.push(
      initOther(players[i].id, players[i].username, players[i].sent, players[i].alive)
    );
  }
  lobbyList = players;
  if (gameType === "pvp") {
    initScoreboard();
    orderScoreboard();
    updateScoreboard();
  }

  isSpectator = true;
  initSpectator();
  resizeOtherPlayers();
});

socket.on("receive_lines", (lines, id, target) => {
  if (target == socket.id) {
    if (!gameStarted) {
      return;
    }
    var sentObj = { sender: id, garbage: calculateHoles(lines) };
    lines_received.push(sentObj);
    console.log("received lines");
    updateBar();
  }
  if (id != socket.id) {
    var sender = playersList.find((player) => player.id === id);
    if (sender) {
      sender.sent += lines;
      if (gameType == "pvp") {
        updateScoreboard();
      }
    }
  }
});

socket.on("delay_receive_lines", (lines, id, target, delay) => {
  if (target == socket.id) {
    if (!gameStarted) {
      return;
    }
    console.log(`sending ${lines} lines in ${delay}`);
    warningGraphic.style.opacity = "1";
    var warningLoop = setInterval(() => {
      if (warningGraphic.style.opacity == "0") {
        warningGraphic.style.opacity = "1";
      } else {
        warningGraphic.style.opacity = "0";
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(warningLoop);
      warningGraphic.style.opacity = 0;
      var sentObj = { sender: 0, garbage: calculateHoles(lines) };
      lines_received.push(sentObj);
      console.log("received delayed lines");
      updateBar();
    }, delay);
  }
});

socket.on("receive_piece", (Opiece, Ox, Oy, Orotation, id) => {
  if (id != socket.id) {
    playerData = playersList.find((j) => j.id === id);
    playerData.piece = Opiece;
    playerData.x = Ox;
    playerData.y = Oy;
    playerData.rotation = Orotation;
    playerData.pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[playerData.piece]));
    for (var j = 0; j < playerData.rotation; j++) {
      rotate(playerData.pieceMatrix);
    }
    other_graficks(id);
  }
});

socket.on("receive_matrix", (matrix, id) => {
  if (id != socket.id) {
    playerData = playersList.find((j) => j.id === id);
    playerData.board = matrix;
    other_graficks(id);
  }
});

socket.on("remove_player", (id) => {
  if (lobbyList.length > 0) {
    lobbyList = lobbyList.filter((j) => j.id != id);
  }
  if (gameStarted) {
    document.getElementById(id).remove();
    playersList = playersList.filter((j) => j.id != id);
    resizeOtherPlayers();
    if (currentlyPlaying && gameType == "pvp") {
      retarget();
    }
    if (gameType === "pvp") {
      var playerScoreboard = document.getElementById(id + "-scoreboard")
      playerScoreboard.parentNode.removeChild(playerScoreboard)
      orderScoreboard();
    }
  }
});

socket.on("player_dead", (id) => {
  if (id == socket.id) {
    return;
  }
  otherRespawn(id);
  if (currentlyPlaying && gameType == "pvp") {
    retarget();
  }
  if (gameType === "pvp") {
    updateScoreboard();
  }
});

socket.on("bossHp", (bossHp, maxHp) => {
  var all = document.getElementsByClassName("boss");
  for (var i = 0; i < all.length; i++) {
    all[i].style.display = "block";
  }
  bossHealthBar.style.width = `${Math.ceil((bossHp / maxHp) * 100)}%`;
  bossHealthText.textContent = `${Math.ceil(bossHp)}/${maxHp}`;
});

socket.on("poison", (intensity, duration, frequency, id) => {
  if (id != socket.id) {
    return;
  }
  startPoison(intensity, duration, frequency);
});

socket.on("poison_all", (intensity, duration, frequency) => {
  startPoison(intensity, duration, frequency);
});