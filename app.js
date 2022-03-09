document.addEventListener('DOMContentLoaded', () => {

  // DOM elements
  const restartBtn = document.getElementById("restart-btn")
  const testBtn = document.getElementById("test-btn")
  const movesSpan = document.getElementById("last-moves")
  const grid = document.querySelector('.grid')

  let tileArray = []
  let testTileArray = []
  const testDataArray = []
  // color array for the tiles
  const tileColors = [
    { id: "red", value: "#FF4C4C" },
    { id: "green", value: "#5DFF00" },
    { id: "blue", value: "#41E5FF" },
    { id: "orange", value: "#FFD966" },
    { id: "pink", value: "#F98" },
    { id: "purple", value: "#E1579B" }
  ]
  //board width
  const width = 10
  // moves
  const moveCount = 50
  let moves = moveCount

  // create board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const tile = document.createElement("div")
      let randColourIndex = Math.floor(Math.random() * tileColors.length);
      tile.setAttribute("draggable", true)
      tile.setAttribute("id", i)
      tile.style.backgroundColor = tileColors[randColourIndex].value;
      tile.classList.add("tile");
      grid.appendChild(tile);
      tileArray = [...tileArray, tile];
    }
    movesSpan.textContent = moves
  }
  createBoard()

  // colors
  let colorDragged
  let colorReplaced
  // IDs
  let tileIdDragged
  let tileIdReplaced

  tileArray.forEach(element => element.addEventListener("dragstart", dragStart));
  tileArray.forEach(element => element.addEventListener("dragend", dragEnd));
  tileArray.forEach(element => element.addEventListener("dragover", dragOver));
  tileArray.forEach(element => element.addEventListener("dragenter", dragEnter));
  tileArray.forEach(element => element.addEventListener("dragleave", dragLeave));
  tileArray.forEach(element => element.addEventListener("drop", dragDrop));

  // drag start
  function dragStart() {
    tileIdDragged = parseInt(this.id)
    colorDragged = this.style.backgroundColor
  }
  // drag drop
  function dragDrop() {

    // set Id and color
    tileIdReplaced = parseInt(this.id)
    colorReplaced = this.style.backgroundColor

    // valid moves
    const validMoves = [
      tileIdDragged - 1,
      tileIdDragged + 1,
      tileIdDragged + 10,
      tileIdDragged - 10
    ]

    // check vaild moves
    if (validMoves.includes(tileIdReplaced) && colorReplaced !== "black" && colorDragged == "black") {
      this.style.backgroundColor = colorDragged
      tileArray[tileIdDragged].style.backgroundColor = colorReplaced

      // moves -1
      moves--
      movesSpan.textContent = moves
      // check vaild matches
      checkRowsMatch()
      checkColumnsMatch()

      if (moves < 1) {
        finishGame()
      }
    }
  }

  // drag end
  function dragEnd(e) { e.preventDefault() }
  // drag leave
  function dragLeave(e) { e.preventDefault() }
  // drag over
  function dragOver(e) { e.preventDefault() }
  // drag enter
  function dragEnter(e) { e.preventDefault() }

  function checkRowsMatch() {
    for (let i = 0; i < width * width; i++) {
      if (tileArray[i - 1] !== undefined && tileArray[i + 1] !== undefined) {
        if (
          tileArray[i - 1].style.backgroundColor == tileArray[i].style.backgroundColor
          && tileArray[i + 1].style.backgroundColor == tileArray[i].style.backgroundColor
        ) {
          tileArray[i - 1].style.backgroundColor = "black"
          tileArray[i].style.backgroundColor = "black"
          tileArray[i + 1].style.backgroundColor = "black"
        }
      }
    }
  }
  checkRowsMatch()
  function checkColumnsMatch() {
    for (let i = 0; i < width * width; i++) {
      if (tileArray[i - 10] !== undefined && tileArray[i + 10] !== undefined) {
        if (
          tileArray[i - 10].style.backgroundColor == tileArray[i].style.backgroundColor
          && tileArray[i + 10].style.backgroundColor == tileArray[i].style.backgroundColor
        ) {
          tileArray[i - 10].style.backgroundColor = "black"
          tileArray[i].style.backgroundColor = "black"
          tileArray[i + 10].style.backgroundColor = "black"
        }
      }
    }
  }
  checkColumnsMatch()

  // restart game
  restartBtn.addEventListener("click", restartGame)
  function restartGame() {
    moves = moveCount
    tileArray.length = 0
    testDataArray.length = 0
    testTileArray.length = 0
    grid.innerHTML = ""

    createBoard()
    checkColumnsMatch()
    checkRowsMatch()

    tileArray.forEach(element => element.addEventListener("dragstart", dragStart));
    tileArray.forEach(element => element.addEventListener("dragend", dragEnd));
    tileArray.forEach(element => element.addEventListener("dragover", dragOver));
    tileArray.forEach(element => element.addEventListener("dragenter", dragEnter));
    tileArray.forEach(element => element.addEventListener("dragleave", dragLeave));
    tileArray.forEach(element => element.addEventListener("drop", dragDrop));
  }

  // finish game
  function finishGame() {
    grid.innerHTML = ""
    // create test board
    for (let index = 0; index < width * width; index++) {
      const testTile = document.createElement("div")
      testTile.setAttribute("draggable", false)
      testTile.setAttribute("id", index)
      testTile.style.backgroundColor = tileArray[index].style.backgroundColor;
      testTile.classList.add("tile");
      grid.appendChild(testTile);
      testTileArray = [...testTileArray, testTile];

      // get id and color values 
      testDataArray.push({
        id: testTile.id,
        color: testTile.style.backgroundColor
      })
    }
    tileArray.length = 0
  }

  function testResult(dataArray) {

    if (testTileArray.length == 0) {
      console.log("game finished")
      finishGame()
    }
    runPathFinder(dataArray)
    console.log("testing")
  }

  // test btn clicked
  testBtn.addEventListener("click", () => testResult(testDataArray))

  /************ test algorithm ************************/
  const validMoves = [-1, 1, -10, 10]

  // return an adjancency list
  function adjacencyList(data, moves) {
    // return map
    const map = new Map()

    // every element inside of the grid
    data.forEach((el, index) => {
      if (el == 1) {
        const arr = []
        // check valid indexes
        moves.forEach(move => {
          if (data[index + move] == 1) {
            arr.push(`${index + move}`)
          }
        })
        map[index] = arr
      }
    });
    return map
  }

  // find the shortest path with breadth-first-search algorithm 
  function shortestePath(graph, start, end) {
    let queue = [start]
    let prev = { [start]: null }

    while (queue.length > 0) {
      let curr = queue.shift();

      if (curr === end) {
        let path = [];

        while (curr) {
          path.unshift(curr);
          curr = prev[curr];
        }

        return path;
      }

      if (curr in graph) {
        for (let v of graph[curr]) {
          if (!(v in prev)) {
            prev[v] = curr;
            queue.push(v);
          }
        }
      }
    }
  }

  // run test algorithms
  function runPathFinder(data) {
    // encode data
    const binaryData = data.map(el=>{
      if (el.color == "black") {
        return 1
      }
      else{
        return 0
      }
    })

    // implement list
    let list = adjacencyList(binaryData, validMoves)

    // get shortest path
    const path = shortestePath(list, "0", "99")
    
    // check result
    if (path == undefined) {
      //show result
      alert("Open a path from --Start-- to --End-- point of the board !!!")
      restartGame()
    }else{
      // show result
      showAlgorithmResult(path)
      alert("You Won")
    }
    
  }

  // show path result
  function showAlgorithmResult(pathData) {
    // create result board
    grid.innerHTML = ""
    for (let index = 0; index < width * width; index++) {
      
      const algorithmTile = document.createElement("div")
      algorithmTile.classList.add("tile")

      if (pathData.includes(`${index}`)) {
        algorithmTile.style.backgroundColor = "black";
      }
      else{
        algorithmTile.style.backgroundColor = tileColors[1].value;
      }

      algorithmTile.classList.add("tile");
      grid.appendChild(algorithmTile)
    }
  } 
})

