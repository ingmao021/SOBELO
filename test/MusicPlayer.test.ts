import { MusicPlayer } from '../src/MusicPlayer';
import { SongNode } from '../src/SongNode'; // Import generic SongNode
import * as assert from 'assert'; // Use import * as assert
import { TestMusicPlayer } from './testMusicPlayer';

// Example data types for testing
type TestData = { prop: string | number };
const createTestData = (val: string | number): TestData => ({ prop: val });
const createRandomNumber = (): number => Math.random();

describe('MusicPlayer<T>', () => {

    describe('MusicPlayer.push() into empty list', () => {
        const list = new MusicPlayer<TestData>(); // Specify type
        const data = createTestData("value");
        list.push(data);

        it('should increase list length to 1.', () => {
            assert.strictEqual(list.length, 1);
        });

        it('MusicPlayer.head should contain the correct data', () => {
            // Head/Tail can be null, check first
            assert.ok(list.head, 'Head should not be null');
            assert.strictEqual(list.head.data, data);
        });

        it('MusicPlayer.tail should contain the correct data', () => {
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.tail.data, data);
        });

        it('Head and Tail should be the same node', () => {
            assert.strictEqual(list.head, list.tail);
        });

        it('Head.prev and Head.next should be null', () => {
            assert.ok(list.head, 'Head should not be null');
            assert.strictEqual(list.head.prev, null);
            assert.strictEqual(list.head.next, null);
        });
    });

    describe('MusicPlayer.push() into populated list, 2 items', () => {
        const list = new MusicPlayer<TestData>();
        const data1 = createTestData("value1");
        const data2 = createTestData(222);
        list.push(data1);
        list.push(data2);

        it('MusicPlayer.head should contain the first data item', () => {
            assert.ok(list.head, 'Head should not be null');
            assert.strictEqual(list.head.data, data1);
        });

        it('MusicPlayer.tail should contain the second data item', () => {
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.tail.data, data2);
        });

        it('head.next should be tail, tail.prev should be head', () => {
            assert.ok(list.head, 'Head should not be null');
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.head.next, list.tail);
            assert.strictEqual(list.tail.prev, list.head);
        });

         it('Head.prev should be null, Tail.next should be null', () => {
            assert.ok(list.head, 'Head should not be null');
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.head.prev, null);
            assert.strictEqual(list.tail.next, null);
        });
    });

    describe('MusicPlayer.push() into populated list 2+ items (using TestList)', () => {
        const listLength = 5;
        // Use number type and the number generator
        const testList = new TestMusicPlayer<number>(listLength, listLength - 1, createRandomNumber);

        it('MusicPlayer.head should contain the correct data', () => {
            assert.ok(testList.head, 'Head should not be null');
            assert.strictEqual(testList.musicPlayer.head, testList.head);
            assert.strictEqual(testList.musicPlayer.head?.data, testList.asArray[0]);
        });

        it('MusicPlayer.tail should contain the correct data', () => {
            assert.ok(testList.tail, 'Tail should not be null');
            assert.strictEqual(testList.musicPlayer.tail, testList.tail);
             assert.strictEqual(testList.musicPlayer.tail?.data, testList.asArray[listLength - 1]);
        });

        it('MusicPlayer.length should be the specified length', () => {
            assert.strictEqual(testList.musicPlayer.length, listLength);
        });
    });

    describe('MusicPlayer.unshift()', () => {
        it('should add to start in an empty list', () => {
            const list = new MusicPlayer<number>();
            list.unshift(10);

            assert.strictEqual(list.length, 1);
            assert.ok(list.head, 'Head should not be null');
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.head.data, 10);
            assert.strictEqual(list.tail.data, 10);
            assert.strictEqual(list.head, list.tail);
            assert.strictEqual(list.head.prev, null);
            assert.strictEqual(list.head.next, null);
        });

        it('should add to start in a populated list and keep links valid', () => {
            const list = new MusicPlayer<number>();
            list.push(20);
            list.push(30);
            list.unshift(10);

            assert.strictEqual(list.length, 3);
            assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
            assert.ok(list.head, 'Head should not be null');
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.head.prev, null);
            assert.strictEqual(list.head.next?.data, 20);
            assert.strictEqual(list.tail.next, null);
        });
    });

    describe('MusicPlayer.insertAt()', () => {
        it('should insert at index 0', () => {
            const list = new MusicPlayer<number>();
            list.push(20);
            list.push(30);
            list.insertAt(0, 10);

            assert.strictEqual(list.length, 3);
            assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
            assert.ok(list.head, 'Head should not be null');
            assert.strictEqual(list.head.prev, null);
        });

        it('should insert at a middle index', () => {
            const list = new MusicPlayer<number>();
            list.push(10);
            list.push(30);
            list.insertAt(1, 20);

            assert.strictEqual(list.length, 3);
            assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
            assert.ok(list.head?.next, 'Middle node should exist');
            assert.strictEqual(list.head?.next?.prev, list.head);
            assert.strictEqual(list.head?.next?.next, list.tail);
        });

        it('should insert at index length (append)', () => {
            const list = new MusicPlayer<number>();
            list.push(10);
            list.push(20);
            list.insertAt(2, 30);

            assert.strictEqual(list.length, 3);
            assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
            assert.ok(list.tail, 'Tail should not be null');
            assert.strictEqual(list.tail.next, null);
            assert.strictEqual(list.tail.prev?.data, 20);
        });

        it('should throw RangeError for index < 0', () => {
            const list = new MusicPlayer<number>();
            list.push(10);

            assert.throws(() => list.insertAt(-1, 5), RangeError);
            assert.deepStrictEqual(list.toArray(), [10]);
        });

        it('should throw RangeError for index > length', () => {
            const list = new MusicPlayer<number>();
            list.push(10);

            assert.throws(() => list.insertAt(2, 20), RangeError);
            assert.deepStrictEqual(list.toArray(), [10]);
        });
    });

    describe('MusicPlayer.findIndex()', () => {
        const listLength = 19;
        const testList = new TestMusicPlayer<number>(listLength, listLength - 1, createRandomNumber);
        const headData = testList.asArray[0];
        const tailData = testList.asArray[listLength - 1];
        const sampleData = testList.dataSample;

        // findIndex doesn't accept null according to its type T
        // it('should return -1 from a null input', () => {
        //     assert.strictEqual(testList.list.findIndex(null), -1); // This would be a type error now
        // });

        it('should find the head as index 0', () => {
            const dataIndex = testList.musicPlayer.findIndex(headData);
            assert.strictEqual(dataIndex, 0);
        });

        it(`should find the tail as index list.length - 1 (${listLength - 1})`, () => {
            const dataIndex = testList.musicPlayer.findIndex(tailData);
            assert.strictEqual(dataIndex, listLength - 1);
        });

        it('should find the correct index for the sample data', () => {
            assert.ok(sampleData !== undefined, 'Sample data should exist');
            const dataIndex = testList.musicPlayer.findIndex(sampleData!);
            assert.strictEqual(dataIndex, listLength - 1);
        });

        it('should return -1 for data not in the list', () => {
             const nonExistentData = createRandomNumber() + 1000; // Ensure it's different
             const dataIndex = testList.musicPlayer.findIndex(nonExistentData);
             assert.strictEqual(dataIndex, -1);
        });
    });

    describe('MusicPlayer.removeByData()', () => {
        const listLength = 19;
        let testList: TestMusicPlayer<number>; // Use let for reassignment
        let dataToRemove: number;

        // Setup before each test in this block
        beforeEach(() => {
            testList = new TestMusicPlayer<number>(listLength, listLength - 2, createRandomNumber); // sample index 17
            dataToRemove = testList.dataSample!;
            assert.ok(dataToRemove !== undefined, 'Test setup failed: dataToRemove is undefined');
        });

        it('should return null if data not found', () => {
            const nonExistentData = createRandomNumber() + 1000;
            const removed = testList.musicPlayer.removeByData(nonExistentData);
            assert.strictEqual(removed, null);
            assert.strictEqual(testList.musicPlayer.length, listLength); // Length should not change
        });

        it('should remove the correct data and return it', () => {
            const originalArray = [...testList.asArray]; // Copy before removal
            const removedData = testList.musicPlayer.removeByData(dataToRemove);

            assert.strictEqual(removedData, dataToRemove);
            const foundIndex = testList.musicPlayer.findIndex(dataToRemove);
            assert.strictEqual(foundIndex, -1, 'Data should no longer be found');

            // Verify remaining elements are correct
            const expectedArray = originalArray.filter(d => d !== dataToRemove);
            assert.deepStrictEqual(testList.musicPlayer.toArray(), expectedArray);
        });

        it('should decrease the list length by 1', () => {
            testList.musicPlayer.removeByData(dataToRemove);
            assert.strictEqual(testList.musicPlayer.length, listLength - 1);
        });

        it('should correctly update pointers when removing middle node', () => {
             // Find the node-to-remove's data first
             const indexToRemove = listLength - 2; // Original index 17
             const dataToRemove = testList.asArray[indexToRemove];

             // Find node before and node after MANUALLY
             let nodeBefore: SongNode<number> | null = testList.musicPlayer.head;
             for (let i = 0; i < indexToRemove - 1; i++) {
                nodeBefore = nodeBefore?.next ?? null;
             }
             const nodeAfter = nodeBefore?.next?.next ?? null; // Element after the one to be removed

             testList.musicPlayer.removeByData(dataToRemove); // Remove node at index 17

             // NodeBefore should still be the same object, its 'next' pointer should have changed.
             assert.ok(nodeBefore, 'Previous element should exist');
             assert.ok(nodeAfter, 'Next element should exist');
             assert.strictEqual(nodeBefore.next, nodeAfter, 'Previous element should now point to next element');
             assert.strictEqual(nodeAfter.prev, nodeBefore, 'Next element should now point back to previous element');
        });

        it('should correctly update head when removing head node', () => {
            const headData = testList.musicPlayer.head!.data;
            const secondNode = testList.musicPlayer.head!.next;
            const removed = testList.musicPlayer.removeByData(headData);

            assert.strictEqual(removed, headData);
            assert.strictEqual(testList.musicPlayer.head, secondNode);
            assert.ok(testList.musicPlayer.head, 'New head should exist');
            assert.strictEqual(testList.musicPlayer.head!.prev, null, 'New head.prev should be null');
            assert.strictEqual(testList.musicPlayer.length, listLength - 1);
        });

        it('should correctly update tail when removing tail node', () => {
            const tailData = testList.musicPlayer.tail!.data;
            const secondLastNode = testList.musicPlayer.tail!.prev;
            const removed = testList.musicPlayer.removeByData(tailData);

            assert.strictEqual(removed, tailData);
            assert.strictEqual(testList.musicPlayer.tail, secondLastNode);
            assert.ok(testList.musicPlayer.tail, 'New tail should exist');
            assert.strictEqual(testList.musicPlayer.tail!.next, null, 'New tail.next should be null');
             assert.strictEqual(testList.musicPlayer.length, listLength - 1);
        });

        it('should correctly remove the only node', () => {
            const singleList = new MusicPlayer<string>();
            singleList.push('only');
            const removed = singleList.removeByData('only');

            assert.strictEqual(removed, 'only');
            assert.strictEqual(singleList.length, 0);
            assert.strictEqual(singleList.head, null);
            assert.strictEqual(singleList.tail, null);
            assert.ok(singleList.isEmpty());
        });
    });

     describe('MusicPlayer.removeByIndex()', () => {
        const listLength = 10;
        let testList: TestMusicPlayer<number>;

        beforeEach(() => {
             testList = new TestMusicPlayer<number>(listLength, 5, createRandomNumber);
        });

        it('should return null for out-of-bounds index', () => {
            assert.strictEqual(testList.musicPlayer.removeByIndex(-1), null);
            assert.strictEqual(testList.musicPlayer.removeByIndex(listLength), null);
            assert.strictEqual(testList.musicPlayer.length, listLength);
        });

        it('should remove the element at the specified index and return it', () => {
            const indexToRemove = 3;
            const dataAtIndex = testList.asArray[indexToRemove];
            const removedData = testList.musicPlayer.removeByIndex(indexToRemove);
            const expectedArray = testList.asArray.filter((_, i) => i !== indexToRemove);

            assert.strictEqual(removedData, dataAtIndex);
            assert.strictEqual(testList.musicPlayer.length, listLength - 1);
            assert.deepStrictEqual(testList.musicPlayer.toArray(), expectedArray);
        });

        // Add tests for removing head (index 0) and tail (index length - 1) similar to removeByData
        it('should correctly remove head using index 0', () => {
            const headData = testList.asArray[0];
            const secondData = testList.asArray[1];
            const removed = testList.musicPlayer.removeByIndex(0);

            assert.strictEqual(removed, headData);
            assert.strictEqual(testList.musicPlayer.length, listLength - 1);
            assert.ok(testList.musicPlayer.head, 'New head should exist');
            assert.strictEqual(testList.musicPlayer.head!.data, secondData);
            assert.strictEqual(testList.musicPlayer.head!.prev, null);
        });

        it('should correctly remove tail using index length - 1', () => {
            const tailIndex = listLength - 1;
            const tailData = testList.asArray[tailIndex];
            const secondLastData = testList.asArray[tailIndex - 1];
            const removed = testList.musicPlayer.removeByIndex(tailIndex);

            assert.strictEqual(removed, tailData);
            assert.strictEqual(testList.musicPlayer.length, listLength - 1);
            assert.ok(testList.musicPlayer.tail, 'New tail should exist');
            assert.strictEqual(testList.musicPlayer.tail!.data, secondLastData);
            assert.strictEqual(testList.musicPlayer.tail!.next, null);
        });
     });

    describe('MusicPlayer.isEmpty()', () => {
        it('should return true from an empty list', () => {
            const list = new MusicPlayer<string>();
            assert.strictEqual(list.isEmpty(), true);
        });

        it('should return false from a populated list', () => {
            const list = new MusicPlayer<number>();
            list.push(1);
            assert.strictEqual(list.isEmpty(), false);
        });
    });

    describe('MusicPlayer.toArray()', () => {
        it('should return an empty array for an empty list', () => {
                        const list = new MusicPlayer<number>();
                        assert.deepStrictEqual(list.toArray(), []);
        });

        it('should return an array with elements in the correct order', () => {
            const listLength = 5;
            const testList = new TestMusicPlayer<number>(listLength, 0, createRandomNumber);
            const array = testList.musicPlayer.toArray();

            assert.strictEqual(Array.isArray(array), true);
            assert.strictEqual(array.length, listLength);
            assert.deepStrictEqual(array, testList.asArray, 'Array content should match original data order');
        });
    });

    describe('MusicPlayer.getData()', () => {
        const listLength = 7;
        const testList = new TestMusicPlayer<string>(listLength, 0, () => Math.random().toString(36).substring(7));

        it('should return null for out-of-bounds index', () => {
            assert.strictEqual(testList.musicPlayer.getData(-1), null);
            assert.strictEqual(testList.musicPlayer.getData(listLength), null);
        });

        it('should return the correct data for a valid index', () => {
             const index = 4;
             const expectedData = testList.asArray[index];
             assert.strictEqual(testList.musicPlayer.getData(index), expectedData);
        });

        it('should return head data for index 0', () => {
            const expectedData = testList.asArray[0];
            assert.strictEqual(testList.musicPlayer.getData(0), expectedData);
        });

         it('should return tail data for index length - 1', () => {
            const index = listLength - 1;
            const expectedData = testList.asArray[index];
            assert.strictEqual(testList.musicPlayer.getData(index), expectedData);
        });
    });
}); 