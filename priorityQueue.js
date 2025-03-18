class PriorityQueue {
    constructor(comparator) {
        this.elements = [];
        this.comparator = comparator || ((a, b) => a < b);
    }

    enqueue(item) {
        this.elements.push(item);
        // Sort in descending order based on comparator
        this.elements.sort((a, b) => this.comparator(a, b) ? -1 : 1);
    }

    dequeue() {
        return this.elements.pop();
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    peek() {
        return this.elements[this.elements.length - 1];
    }
}