// Design a data structure that works like a LRU (Least recently used) Cache. There are two public methods:
//
// SET x y: sets the value of the key x with value y
// GET x: gets the key of x if present
//
// The LRUCache class has two methods get() and set() which are defined as follows.

// The LRUCache class has two methods get() and set() which are defined as follows.
// get(key): returns the value of the key if it already exists in the cache.
// set(key, value): if the key is already present, update its value. If not present, add the key-value pair to the cache. If the cache reaches its capacity it should invalidate the least recently used item before inserting the new item.

type Item = {
  val: any,
  key: any,
  next: Item | null,
  prev: Item | null,
}

export default class LRUCache {
  maxSize: number;
  firstItem: Item | null;
  lastItem: Item | null;
  keyMap = new Map();

  constructor(maxSize: number) {
    if (maxSize <= 0) {
      throw new Error('Size cannot be zero or negative numver!');
    }

    this.maxSize = maxSize;
    this.firstItem = null;
    this.lastItem = null;
  }

  _insertAtFront(item: Item): void {
    item.next = this.firstItem;
    if (this.firstItem) {
      this.firstItem.prev = item;
    }

    this.firstItem = item;

    if (!this.lastItem) {
      this.lastItem = item;
    }
  }

  _retrieveItem(key: any) {
    const item = this.keyMap.get(key);

    if (item) {
      if (this.firstItem === item) {
        // no need to push it to front
        return item;
      }

      if (item.prev) {
        item.prev.next = item.next;
      }

      if (item.next) {
        item.next.prev = item.prev;
      }

      if (this.lastItem === item) {
        this.lastItem = item.prev;
      }

      this._insertAtFront(item);
    }

    return item;
  }

  _evictLastItem() {
    this.keyMap.delete(this.lastItem.key);
    this.lastItem = this.lastItem.prev
  }

  get(key: any) {
    return this._retrieveItem(key)?.val
  }

  set(key: any, val: any) {
    const existingItem = this._retrieveItem(key);
    if (existingItem) {
      existingItem.val = val;
      return;
    }

    if (this.keyMap.size === this.maxSize) {
      this._evictLastItem();
    }

    const newItem: Item = {
      key,
      val,
      next: null,
      prev: null,
    };

    this.keyMap.set(key, newItem);
    this._insertAtFront(newItem);
  }
}