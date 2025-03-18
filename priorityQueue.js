// Priority Queue for algorithms that need it
class PriorityQueue {
    constructor(comparator = (a, b) => a < b) {
        this.heap = [];
        this.comparator = comparator;
    }

    enqueue(element) {
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
    }

    dequeue() {
        const first = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        
        return first;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[parentIndex], this.heap[index])) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const lastIndex = this.heap.length - 1;
        
        while (true) {
            const leftIndex = 2 * index + 1;
            const rightIndex = 2 * index + 2;
            let smallestIndex = index;
            
            if (leftIndex <= lastIndex && 
                this.comparator(this.heap[leftIndex], this.heap[smallestIndex])) {
                smallestIndex = leftIndex;
            }
            
            if (rightIndex <= lastIndex && 
                this.comparator(this.heap[rightIndex], this.heap[smallestIndex])) {
                smallestIndex = rightIndex;
            }
            
            if (smallestIndex === index) break;
            
            this.swap(index, smallestIndex);
            index = smallestIndex;
        }
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}