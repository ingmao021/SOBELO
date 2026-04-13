import { SongNode } from '../src/SongNode';
import { MusicPlayer } from '../src/MusicPlayer';

export class TestMusicPlayer<T> {

    dataSample: T | undefined;        /** is returned as data from an index you specify with sampleIndex */
    musicPlayer: MusicPlayer<T>;             /** the MusicPlayer which is returned */
    asArray: Array<T>;    /** an array (in order) containing the data of the list */
    head: SongNode<T> | null;              /** The head of the list */
    tail: SongNode<T> | null;              /** The tail of the list */

    private listLength: number;     /** how long the list is */
    private sampleIndex: number;    /** should be less than listLength */
    private dataGenerator: () => T;  /** Function to generate data of type T */

    constructor(listLength: number, sampleIndex: number, dataGenerator: () => T){
        this.musicPlayer = new MusicPlayer<T>();
        this.asArray = [];
        this.listLength = listLength;
        this.sampleIndex = sampleIndex;
        this.dataGenerator = dataGenerator;
        this.generateList();
        this.asArray = this.musicPlayer.toArray();
        this.head = this.musicPlayer.head;
        this.tail = this.musicPlayer.tail;
    }

    generateList(): void {
        for (let i = 0; i < this.listLength; i++) {
            const data = this.dataGenerator();
            if (i === this.sampleIndex) this.dataSample = data;
            this.musicPlayer.push(data);
        }
    }
    
}