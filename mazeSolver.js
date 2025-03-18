class MazeSolver {
    constructor(canvasId, mazeSize = 25) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.mazeSize = mazeSize;
        this.cellSize = this.canvas.width / mazeSize;
        
        this.mazeGenerator = new MazeGenerator(mazeSize, mazeSize);
        this.maze = [];
        
        this.startPoint = null;
        this.endPoint = null;
    }

    generateMaze() {
        // Generate the maze with the current maze size
        this.mazeGenerator = new MazeGenerator(this.mazeSize, this.mazeSize);
        this.maze = this.mazeGenerator.generateMaze();
        this.drawMaze();
    }

    setupEventListeners() {
        // Remove any existing listeners first
        this.canvas.removeEventListener('click', this.boundHandleCanvasClick);
        
        // Create a bound version of the handler
        this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
        this.canvas.addEventListener('click', this.boundHandleCanvasClick);
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.cellSize);

        // Ensure click is within maze bounds and on a path
        if (x >= 0 && x < this.mazeSize && 
            y >= 0 && y < this.mazeSize && 
            this.maze[y][x] === 0) {
            
            if (!this.startPoint) {
                this.setStartPoint(x, y);
            } else if (!this.endPoint) {
                this.setEndPoint(x, y);
            } else {
                // Reset if both points are already set
                this.startPoint = null;
                this.endPoint = null;
                this.drawMaze();
            }
        }
    }

    initializeMaze() {
        // Initialize maze and visited arrays
        this.maze = Array.from({ length: this.mazeSize }, () => 
            Array(this.mazeSize).fill(0)
        );
        this.visited = Array.from({ length: this.mazeSize }, () => 
            Array(this.mazeSize).fill(false)
        );
    }

    setStartPoint(x, y) {
        this.startPoint = [x, y];
        this.drawMaze();
        this.highlightPoint(x, y, 'green');
    }

    setEndPoint(x, y) {
        this.endPoint = [x, y];
        this.drawMaze();
        this.highlightPoint(x, y, 'red');
    }

    highlightPoint(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.cellSize, 
            y * this.cellSize, 
            this.cellSize, 
            this.cellSize
        );
    }

    // Pathfinding Algorithms
    findPath(algorithm) {
        if (!this.startPoint || !this.endPoint) {
            console.error('Start or end point not set');
            return null;
        }

        // Reset visited array
        this.resetVisited();

        switch(algorithm) {
            case 'bfs':
                return this.breadthFirstSearch();
            case 'dfs':
                return this.depthFirstSearch();
            case 'dijkstra':
                return this.dijkstraSearch();
            case 'bestFirst':
                return this.bestFirstSearch();
            case 'depthLimited':
                return this.depthLimitedSearch();
            case 'bidirectional':
                return this.bidirectionalSearch();
            case 'greedyBestFirst':
                return this.greedyBestFirstSearch();
            default:
                console.error('Unknown algorithm');
                return null;
        }
    }

    breadthFirstSearch() {
        const queue = [[...this.startPoint]];
        const parentMap = new Map();
        const visited = new Set();

        visited.add(this.startPoint.join(','));

        while (queue.length > 0) {
            const [x, y] = queue.shift();

            if (x === this.endPoint[0] && y === this.endPoint[1]) {
                return this.reconstructPath(parentMap);
            }

            const neighbors = this.getValidNeighbors(x, y);
            
            for (const [nx, ny] of neighbors) {
                const key = `${nx},${ny}`;
                if (!visited.has(key)) {
                    queue.push([nx, ny]);
                    visited.add(key);
                    parentMap.set(key, [x, y]);
                }
            }
        }

        return null;
    }

    depthFirstSearch(maxDepth = Infinity) {
        const stack = [[...this.startPoint, 0]];
        const visited = new Set();
        const parentMap = new Map();

        while (stack.length > 0) {
            const [x, y, depth] = stack.pop();

            if (x === this.endPoint[0] && y === this.endPoint[1]) {
                return this.reconstructPath(parentMap);
            }

            const key = `${x},${y}`;
            if (visited.has(key) || depth > maxDepth) continue;

            visited.add(key);

            const neighbors = this.getValidNeighbors(x, y);
            
            for (const [nx, ny] of neighbors) {
                const neighborKey = `${nx},${ny}`;
                if (!visited.has(neighborKey)) {
                    stack.push([nx, ny, depth + 1]);
                    parentMap.set(neighborKey, [x, y]);
                }
            }
        }

        return null;
    }

    depthLimitedSearch(maxDepth = 10) {
        return this.depthFirstSearch(maxDepth);
    }

    dijkstraSearch() {
        const distances = Array.from({ length: this.mazeSize }, () => 
            Array(this.mazeSize).fill(Infinity)
        );
        const parentMap = new Map();
        const pq = new PriorityQueue((a, b) => a[2] < b[2]);
    
        distances[this.startPoint[1]][this.startPoint[0]] = 0;
        pq.enqueue([...this.startPoint, 0]);
    
        console.log('Start point:', this.startPoint);
        console.log('End point:', this.endPoint);
    
        while (!pq.isEmpty()) {
            const [x, y, dist] = pq.dequeue();
            
            console.log(`Exploring: (${x}, ${y}), distance: ${dist}`);
    
            if (x === this.endPoint[0] && y === this.endPoint[1]) {
                console.log('Path found!');
                return this.reconstructPath(parentMap);
            }
    
            if (dist > distances[y][x]) continue;
    
            const neighbors = this.getValidNeighbors(x, y);
            
            console.log('Neighbors:', neighbors);
            
            for (const [nx, ny] of neighbors) {
                const newDist = dist + 1;
                
                if (newDist < distances[ny][nx]) {
                    distances[ny][nx] = newDist;
                    parentMap.set(`${nx},${ny}`, [x, y]);
                    pq.enqueue([nx, ny, newDist]);
                }
            }
        }
    
        console.log('No path found');
        return null;
    }

    bestFirstSearch() {
        const pq = new PriorityQueue((a, b) => 
            this.heuristic(a[0], a[1]) < this.heuristic(b[0], b[1])
        );
        const parentMap = new Map();
        const visited = new Set();
    
        console.log('Start point:', this.startPoint);
        console.log('End point:', this.endPoint);
    
        pq.enqueue([...this.startPoint]);
        
        while (!pq.isEmpty()) {
            const [x, y] = pq.dequeue();
    
            console.log(`Exploring: (${x}, ${y}), Heuristic: ${this.heuristic(x, y)}`);
    
            if (x === this.endPoint[0] && y === this.endPoint[1]) {
                console.log('Path found!');
                return this.reconstructPath(parentMap);
            }
    
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);
    
            const neighbors = this.getValidNeighbors(x, y);
            
            console.log('Neighbors:', neighbors);
            
            for (const [nx, ny] of neighbors) {
                const neighborKey = `${nx},${ny}`;
                if (!visited.has(neighborKey)) {
                    pq.enqueue([nx, ny]);
                    parentMap.set(neighborKey, [x, y]);
                }
            }
        }
    
        console.log('No path found');
        return null;
    }

    greedyBestFirstSearch() {
        // Validate start and end points
        if (!this.startPoint || !this.endPoint) {
            console.error('Start or end point not set');
            return null;
        }
    
        // Create a priority queue with a custom comparator
        const pq = new PriorityQueue((a, b) => {
            const heuristicA = this.heuristic(a[0], a[1]);
            const heuristicB = this.heuristic(b[0], b[1]);
            return heuristicA < heuristicB;
        });
    
        // Track visited nodes and parent map for path reconstruction
        const visited = new Set();
        const parentMap = new Map();
    
        // Start from the initial point
        pq.enqueue([...this.startPoint]);
        
        // Debugging logs
        console.log('Greedy Best-First Search Started');
        console.log('Start Point:', this.startPoint);
        console.log('End Point:', this.endPoint);
    
        // Iteration limit to prevent infinite loops
        const MAX_ITERATIONS = this.mazeSize * this.mazeSize;
        let iterations = 0;
    
        while (!pq.isEmpty() && iterations < MAX_ITERATIONS) {
            iterations++;
    
            // Get the next node with the lowest heuristic value
            const [x, y] = pq.dequeue();
    
            // Debugging
            console.log(`Exploring: (${x}, ${y}), Heuristic: ${this.heuristic(x, y)}`);
    
            // Check if we've reached the goal
            if (x === this.endPoint[0] && y === this.endPoint[1]) {
                console.log('Path found!');
                return this.reconstructPath(parentMap);
            }
    
            // Create a unique key for the current node
            const key = `${x},${y}`;
    
            // Skip if already visited
            if (visited.has(key)) continue;
            visited.add(key);
    
            // Get valid neighboring nodes
            const neighbors = this.getValidNeighbors(x, y);
            
            // Debugging neighbors
            console.log('Neighbors:', neighbors);
    
            // Explore neighbors
            for (const [nx, ny] of neighbors) {
                const neighborKey = `${nx},${ny}`;
    
                // Only add unvisited neighbors
                if (!visited.has(neighborKey)) {
                    // Add to priority queue
                    pq.enqueue([nx, ny]);
                    
                    // Track parent for path reconstruction
                    parentMap.set(neighborKey, [x, y]);
                }
            }
        }
    
        // Handle no path found scenario
        if (iterations >= MAX_ITERATIONS) {
            console.warn('Search exceeded maximum iterations');
        } else {
            console.log('No path found');
        }
    
        return null;
    }

    heuristic(x, y) {
        // Euclidean distance heuristic (more accurate than Manhattan)
        return Math.sqrt(
            Math.pow(x - this.endPoint[0], 2) + 
            Math.pow(y - this.endPoint[1], 2)
        );
    }

    bidirectionalSearch() {
        const forwardQueue = [[...this.startPoint]];
        const backwardQueue = [[...this.endPoint]];
        const forwardVisited = new Map();
        const backwardVisited = new Map();

        forwardVisited.set(this.startPoint.join(','), null);
        backwardVisited.set(this.endPoint.join(','), null);

        while (forwardQueue.length > 0 && backwardQueue.length > 0) {
            // Forward search
            const forwardResult = this.expandSearch(
                forwardQueue, 
                forwardVisited, 
                backwardVisited, 
                true
            );

            if (forwardResult) return forwardResult;

            // Backward search
            const backwardResult = this.expandSearch(
                backwardQueue, 
                backwardVisited, 
                forwardVisited, 
                false
            );

            if (backwardResult) return backwardResult;
        }

        return null;
    }

    expandSearch(queue, visited, otherVisited, isForward) {
        const [x, y] = queue.shift();
        const key = `${x},${y}`;

        if (otherVisited.has(key)) {
            // Intersection found, reconstruct path
            return this.reconstructBidirectionalPath(
                visited, 
                otherVisited, 
                [x, y], 
                isForward
            );
        }

        const neighbors = this.getValidNeighbors(x, y);
        
        for (const [nx, ny] of neighbors) {
            const neighborKey = `${nx},${ny}`;
            
            if (!visited.has(neighborKey)) {
                queue.push([nx, ny]);
                visited.set(neighborKey, [x, y]);
            }
        }

        return null;
    }

    // Utility Methods
    getValidNeighbors(x, y) {
        const neighbors = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (this.isValidMove(x, y, nx, ny)) {
                neighbors.push([nx, ny]);
            }
        }

        return neighbors;
    }

    isValidMove(x, y, nx, ny) {
        // Check if the move is within maze bounds
        if (nx < 0 || nx >= this.mazeSize || ny < 0 || ny >= this.mazeSize) {
            return false;
        }

        // Check if the cell is not a wall
        return !this.maze[ny][nx];
    }

    heuristic(x, y) {
        // Manhattan distance heuristic
        return Math.abs(x - this.endPoint[0]) + Math.abs(y - this.endPoint[1]);
    }

    reconstructPath(parentMap) {
        const path = [];
        let current = this.endPoint.join(',');
        
        while (current !== this.startPoint.join(',')) {
            const [x, y] = current.split(',').map(Number);
            path.unshift([x, y]);
            current = parentMap.get(current).join(',');
        }
        
        path.unshift(this.startPoint);
        return path;
    }

    reconstructBidirectionalPath(forwardVisited, backwardVisited, intersection, isForward) {
        const forwardPath = [];
        const backwardPath = [];

        // Reconstruct forward path
        let current = intersection.join(',');
        while (current !== this.startPoint.join(',')) {
            const [x, y] = current.split(',').map(Number);
            forwardPath.unshift([x, y]);
            current = forwardVisited.get(current).join(',');
        }

        // Reconstruct backward path
        current = intersection.join(',');
        while (current !== this.endPoint.join(',')) {
            const [x, y] = current.split(',').map(Number);
            backwardPath.push([x, y]);
            current = backwardVisited.get(current).join(',');
        }

        return isForward 
            ? [...forwardPath, intersection, ...backwardPath.reverse()]
            : [...backwardPath, intersection, ...forwardPath.reverse()];
    }

    resetVisited() {
        this.visited = Array.from({ length: this.mazeSize }, () => 
            Array(this.mazeSize).fill(false)
        );
    }

    // Modify the drawMaze method to draw walls
    // Maze Visualization
    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid and walls
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] === 1) {
                    // Draw wall
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(
                        x * this.cellSize, 
                        y * this.cellSize, 
                        this.cellSize, 
                        this.cellSize
                    );
                }
            }
        }

        // Draw grid lines
        this.ctx.strokeStyle = '#ddd';
        for (let x = 0; x <= this.mazeSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.mazeSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }

        // Redraw start and end points if set
        if (this.startPoint) {
            this.highlightPoint(this.startPoint[0], this.startPoint[1], 'green');
        }
        if (this.endPoint) {
            this.highlightPoint(this.endPoint[0], this.endPoint[1], 'red');
        }
    }

    visualizePath(path) {
        if (!path) {
            console.log('No path found');
            return;
        }

        this.ctx.fillStyle = 'purple';
        path.forEach(([x, y]) => {
            this.ctx.fillRect(
                x * this.cellSize, 
                y * this.cellSize, 
                this.cellSize, 
                this.cellSize
            );
        });
    }
}