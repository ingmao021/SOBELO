class Node<T> {
	data: T
	next: Node<T> | null
	prev: Node<T> | null

	constructor(data: T) {
		this.data = data
		this.next = null
		this.prev = null
	}
}

export class List<T> {
	length: number
	head: Node<T> | null
	tail: Node<T> | null

	constructor() {
		this.length = 0
		this.head = null
		this.tail = null
	}

	isEmpty(): boolean {
		return this.length === 0
	}

	private getNode(index: number): Node<T> | null {
		if (index < 0 || index >= this.length) {
			return null
		}

		let currentNode: Node<T> | null
		if (index < this.length / 2) {
			currentNode = this.head
			for (let i = 0; i < index; i += 1) {
				currentNode = currentNode!.next
			}
		} else {
			currentNode = this.tail
			for (let i = this.length - 1; i > index; i -= 1) {
				currentNode = currentNode!.prev
			}
		}

		return currentNode
	}

	toArray(): T[] {
		const array: T[] = []
		let currentNode = this.head

		while (currentNode !== null) {
			array.push(currentNode.data)
			currentNode = currentNode.next
		}

		return array
	}

	push(data: T): void {
		const node = new Node(data)

		if (this.isEmpty()) {
			this.head = node
			this.tail = node
		} else {
			this.tail!.next = node
			node.prev = this.tail
			this.tail = node
		}

		this.length += 1
	}

	unshift(data: T): void {
		const node = new Node(data)

		if (this.isEmpty()) {
			this.head = node
			this.tail = node
		} else {
			node.next = this.head
			this.head!.prev = node
			this.head = node
		}

		this.length += 1
	}

	insertAt(index: number, data: T): void {
		if (index < 0 || index > this.length) {
			throw new RangeError('Index out of bounds')
		}

		if (index === 0) {
			this.unshift(data)
			return
		}

		if (index === this.length) {
			this.push(data)
			return
		}

		const nextNode = this.getNode(index)
		if (!nextNode) {
			throw new RangeError('Index out of bounds')
		}

		const prevNode = nextNode.prev
		const node = new Node(data)

		node.prev = prevNode
		node.next = nextNode
		if (prevNode !== null) {
			prevNode.next = node
		}
		nextNode.prev = node

		this.length += 1
	}

	removeByData(data: T): T | null {
		let currentNode = this.head

		while (currentNode !== null) {
			if (currentNode.data === data) {
				return this.removeNode(currentNode)
			}
			currentNode = currentNode.next
		}

		return null
	}

	removeByIndex(index: number): T | null {
		const node = this.getNode(index)
		if (!node) {
			return null
		}

		return this.removeNode(node)
	}

	private removeNode(nodeToRemove: Node<T>): T {
		if (nodeToRemove === this.head) {
			this.head = nodeToRemove.next
		}

		if (nodeToRemove === this.tail) {
			this.tail = nodeToRemove.prev
		}

		if (nodeToRemove.prev !== null) {
			nodeToRemove.prev.next = nodeToRemove.next
		}

		if (nodeToRemove.next !== null) {
			nodeToRemove.next.prev = nodeToRemove.prev
		}

		nodeToRemove.prev = null
		nodeToRemove.next = null
		this.length -= 1

		return nodeToRemove.data
	}
}
