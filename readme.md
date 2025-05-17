# Maze Generator and Pathfinding Visualizer

A JavaScript application that generates random mazes and visualizes various pathfinding algorithms.

## Overview

This project consists of three main components:
- **MazeGenerator**: Creates random maze layouts using a depth-first search algorithm
- **MazeSolver**: Handles visualization and pathfinding algorithms
- **PriorityQueue**: Utility class for priority-based algorithms

## Features

- Random maze generation with customizable size
- Interactive maze exploration with start and end point selection
- Multiple pathfinding algorithm implementations:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - Greedy Best-First Search
  - Bidirectional Search
  - Depth-Limited Search

## Files

- `mazeGenerator.js`: Implements maze generation using a recursive backtracking algorithm
- `mazeSolver.js`: Contains visualization logic and pathfinding algorithms
- `priorityQueue.js`: Implements a priority queue for algorithms like Dijkstra's

## Usage

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
    <title>Maze Generator and Pathfinder</title>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <canvas id="mazeCanvas" width="500" height="500"></canvas>
    <div>
        <button id="generateMazeBtn">Generate New Maze</button>
        <select id="algorithmSelect">
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="bestFirst">Best-First Search</option>
            <option value="greedyBestFirst">Greedy Best-First Search</option>
            <option value="bidirectional">Bidirectional Search</option>
            <option value="depthLimited">Depth-Limited Search</option>
        </select>
        <button id="solveBtn">Solve Maze</button>
    </div>

    <script src="priorityQueue.js"></script>
    <script src="mazeGenerator.js"></script>
    <script src="mazeSolver.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const mazeSolver = new MazeSolver('mazeCanvas', 25);
            mazeSolver.generateMaze();
            mazeSolver.setupEventListeners();
            
            // Generate maze button
            document.getElementById('generateMazeBtn').addEventListener('click', () => {
                mazeSolver.generateMaze();
            });
            
            // Solve maze button
            document.getElementById('solveBtn').addEventListener('click', () => {
                const algorithm = document.getElementById('algorithmSelect').value;
                const path = mazeSolver.findPath(algorithm);
                mazeSolver.visualizePath(path);
            });
        });
    </script>
</body>
</html>
```

### How To Use

1. Open the HTML page in a browser
2. Click "Generate New Maze" to create a random maze
3. Click on any open cell (not a wall) to set the start point (green)
4. Click on another open cell to set the end point (red)
5. Select a pathfinding algorithm from the dropdown
6. Click "Solve Maze" to visualize the path between start and end points

## Algorithm Details

### Maze Generation

The maze is generated using a depth-first search with recursive backtracking:
- The algorithm starts with a grid filled with walls
- It randomly carves paths through the walls
- Additional random paths are sometimes added for more complexity

### Pathfinding Algorithms

#### Breadth-First Search (BFS)
- Explores all neighbors at the present depth before moving to nodes at the next depth level
- Guarantees the shortest path in an unweighted graph
- Useful for finding the shortest path in terms of the number of steps

#### Depth-First Search (DFS)
- Explores as far as possible along each branch before backtracking
- Not guaranteed to find the shortest path
- Useful for maze exploration

#### Dijkstra's Algorithm
- Finds the shortest path between nodes in a graph
- Considers the cost of movement between nodes
- Guaranteed to find the shortest path

#### Greedy Best-First Search
- Always moves toward the goal using a heuristic function
- Not guaranteed to find the shortest path
- Often faster than other algorithms

#### Bidirectional Search
- Runs two simultaneous searches: one from the start and one from the goal
- Stops when the two searches meet
- Can significantly reduce the search space

#### Depth-Limited Search
- A variant of DFS with a maximum depth limit
- Prevents the algorithm from going too deep into a branch
- Useful for very large mazes

## User Interface

The application provides a simple and intuitive user interface:

![Maze Solver UI](images/breadth-first%20search.png)

### UI Components

- **Canvas Area**: Displays the generated maze and pathfinding visualizations
- **Generate New Maze Button**: Creates a new random maze layout
- **Algorithm Selector**: Dropdown menu to choose the pathfinding algorithm
- **Solve Maze Button**: Runs the selected algorithm and visualizes the path

### Color Scheme

- **White Cells**: Open paths that can be traversed
- **Black Cells**: Walls that cannot be passed through
- **Green Cell**: Starting point (selected by first click)
- **Red Cell**: End point (selected by second click)
- **Purple Cells**: Path found by the algorithm from start to end

### Interaction

1. Click on an open (white) cell to set the start point
2. Click on another open cell to set the end point
3. Clicking again after both points are set will reset selection
4. The maze is interactive - you can change start/end points at any time
5. After selecting an algorithm and clicking "Solve", the path will be highlighted

## Customization

### Maze Size

You can adjust the maze size by changing the parameter when creating a new MazeSolver:

```javascript
// Create a 15x15 maze
const mazeSolver = new MazeSolver('mazeCanvas', 15);
```

### Cell Size

The cell size is automatically calculated based on the canvas size and maze dimensions:

```javascript
this.cellSize = this.canvas.width / mazeSize;
```

## Dependencies

- No external libraries required
- Uses HTML5 Canvas for rendering

## Browser Compatibility

- Works in modern browsers that support HTML5 Canvas
- Tested in Chrome, Firefox, and Edge
