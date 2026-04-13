import { SongNode } from "./SongNode";

export class MusicPlayer<T> {

    length: number;
    head: SongNode<T> | null;
    tail: SongNode<T> | null;

    constructor() {
        this.length = 0;
        this.head = null;
        this.tail = null;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    private _getNode(index: number): SongNode<T> | null {
        if (index < 0 || index >= this.length) {
            return null;
        }

        let currentNode: SongNode<T> | null;
        if (index < this.length / 2) {
            currentNode = this.head;
            for (let i = 0; i < index; i++) {
                currentNode = currentNode!.next;
            }
        } else {
            currentNode = this.tail;
            for (let i = this.length - 1; i > index; i--) {
                currentNode = currentNode!.prev;
            }
        }
        return currentNode;
    }

    toArray(): Array<T> {
        const array: Array<T> = [];
        let currentNode = this.head;
        while (currentNode !== null) {
            array.push(currentNode.data);
            currentNode = currentNode.next;
        }
        return array;
    }

    push(data: T): void {
        const node = new SongNode(data);

        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail!.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.length++;
    }

    unshift(data: T): void {
        const node = new SongNode(data);

        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head!.prev = node;
            this.head = node;
        }
        this.length++;
    }

    insertAt(index: number, data: T): void {
        if (index < 0 || index > this.length) {
            throw new RangeError('Index out of bounds');
        }

        if (index === 0) {
            this.unshift(data);
            return;
        }

        if (index === this.length) {
            this.push(data);
            return;
        }

        const nextNode = this._getNode(index);
        if (!nextNode) {
            throw new RangeError('Index out of bounds');
        }

        const prevNode = nextNode.prev;
        const node = new SongNode(data);

        node.prev = prevNode;
        node.next = nextNode;
        if (prevNode !== null) {
            prevNode.next = node;
        }
        nextNode.prev = node;

        this.length++;
    }

    findIndex(data: T): number {
        let currentIndex = 0;
        let currentNode = this.head;

        while (currentNode !== null) {
            if (currentNode.data === data) {
                return currentIndex;
            }
            currentNode = currentNode.next;
            currentIndex++;
        }
        return -1;
    }

    removeByIndex(index: number): T | null {
        const nodeToRemove = this._getNode(index);
        if (!nodeToRemove) {
            return null;
        }
        return this._removeNode(nodeToRemove);
    }

    getData(index: number): T | null {
        const node = this._getNode(index);
        return node ? node.data : null;
    }

    removeByData(data: T): T | null {
        let currentNode = this.head;
        while (currentNode !== null) {
            if (currentNode.data === data) {
                return this._removeNode(currentNode);
            }
            currentNode = currentNode.next;
        }
        return null;
    }

    private _removeNode(nodeToRemove: SongNode<T>): T {
        if (nodeToRemove === this.head) {
            this.head = nodeToRemove.next;
        }

        if (nodeToRemove === this.tail) {
            this.tail = nodeToRemove.prev;
        }

        if (nodeToRemove.prev !== null) {
            nodeToRemove.prev.next = nodeToRemove.next;
        }

        if (nodeToRemove.next !== null) {
            nodeToRemove.next.prev = nodeToRemove.prev;
        }

        nodeToRemove.prev = null;
        nodeToRemove.next = null;

        this.length--;
        return nodeToRemove.data;
    }
}