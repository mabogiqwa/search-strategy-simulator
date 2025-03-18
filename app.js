document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mazeCanvas');
    const complexitySelect = document.getElementById('complexitySelect');
    const generateMazeBtn = document.getElementById('generateMazeBtn');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const findPathBtn = document.getElementById('findPathBtn');

    // Determine maze size based on complexity
    function getMazeSizeForComplexity(complexity) {
        switch(complexity) {
            case 'easy': return 15;
            case 'medium': return 25;
            case 'hard': return 35;
            default: return 25;
        }
    }

    // Create initial solver
    let solver = new MazeSolver('mazeCanvas', 25);
    
    // Generate initial maze
    solver.generateMaze();
    solver.setupEventListeners();

    // Generate Maze Button
    generateMazeBtn.addEventListener('click', () => {
        // Get current complexity
        const complexity = complexitySelect.value;
        const mazeSize = getMazeSizeForComplexity(complexity);
        
        // Recreate solver with new size
        solver = new MazeSolver('mazeCanvas', mazeSize);
        
        // Generate new maze
        solver.generateMaze();
        solver.setupEventListeners();
        
        // Reset start and end points
        solver.startPoint = null;
        solver.endPoint = null;
    });

    // Find Path Button
    findPathBtn.addEventListener('click', () => {
        // Check if start and end points are set
        if (!solver.startPoint || !solver.endPoint) {
            alert('Please set start and end points by clicking on the maze');
            return;
        }

        // Get selected algorithm
        const algorithm = algorithmSelect.value;

        // Find and visualize path
        const path = solver.findPath(algorithm);
        
        if (path) {
            solver.visualizePath(path);
        } else {
            alert('No path found!');
        }
    });

    // Complexity Select - Allow dynamic maze regeneration
    complexitySelect.addEventListener('change', () => {
        const complexity = complexitySelect.value;
        const mazeSize = getMazeSizeForComplexity(complexity);
        
        // Recreate solver with new size
        solver = new MazeSolver('mazeCanvas', mazeSize);
        
        // Generate new maze
        solver.generateMaze();
        solver.setupEventListeners();
        
        // Reset start and end points
        solver.startPoint = null;
        solver.endPoint = null;
    });
});