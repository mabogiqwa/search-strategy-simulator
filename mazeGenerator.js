class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.maze = [];
    }

    generateMaze() {
        // Initialize the maze with all walls
        this.maze = Array.from({ length: this.height }, () => 
            Array(this.width).fill(1)
        );

        // Create the initial path
        this.createPath(1, 1);

        // Ensure borders are walls
        this.createBorders();

        return this.maze;
    }

    createPath(x, y) {
        // Mark current cell as path
        this.maze[y][x] = 0;

        // Possible directions: right, down, left, up
        const directions = [
            { dx: 2, dy: 0 },   // Right
            { dx: 0, dy: 2 },   // Down
            { dx: -2, dy: 0 },  // Left
            { dx: 0, dy: -2 }   // Up
        ];

        // Shuffle directions
        this.shuffleArray(directions);

        // Explore in each direction
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;

            // Check if new position is within bounds
            if (nx > 0 && nx < this.width - 1 && 
                ny > 0 && ny < this.height - 1) {
                
                // Check if the new cell is a wall
                if (this.maze[ny][nx] === 1) {
                    // Create a path between current and new cell
                    this.maze[y + dir.dy / 2][x + dir.dx / 2] = 0;
                    
                    // Recursively create path from new cell
                    this.createPath(nx, ny);
                }
            }
        }

        // Add some random extra paths for more complexity
        this.addExtraPaths(x, y);
    }

    createBorders() {
        // Create walls around the maze border
        for (let x = 0; x < this.width; x++) {
            this.maze[0][x] = 1;
            this.maze[this.height - 1][x] = 1;
        }
        
        for (let y = 0; y < this.height; y++) {
            this.maze[y][0] = 1;
            this.maze[y][this.width - 1] = 1;
        }
    }

    addExtraPaths(x, y) {
        // Randomly add additional paths with a lower probability
        if (Math.random() < 0.3) {
            const extraDirections = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            const dir = extraDirections[Math.floor(Math.random() * extraDirections.length)];
            const nx = x + dir.dx;
            const ny = y + dir.dy;

            if (nx > 0 && nx < this.width - 1 && 
                ny > 0 && ny < this.height - 1 && 
                this.maze[ny][nx] === 1) {
                this.maze[ny][nx] = 0;
            }
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}