export class SongNode<T> {

    data: T;
    next: SongNode<T> | null;
    prev: SongNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

}