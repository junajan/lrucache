
// Design a data structure that works like a LRU (Least recently used) Cache. There are two public methods:
//
// SET x y: sets the value of the key x with value y
// GET x: gets the key of x if present
//
//   The LRUCache class has two methods get() and set() which are defined as follows.


// The LRUCache class has two methods get() and set() which are defined as follows.
//   get(key): returns the value of the key if it already exists in the cache.
//
// set(key, value): if the key is already present, update its value. If not present, add the key-value pair to the cache. If the cache reaches its capacity it should invalidate the least recently used item before inserting the new item.

class LRUCache {
  size: number;
  index: number;
  store = {};

  constructor(size) {
    this.size = size;
    this.index = 0;
  }

  _retrieveItem(key) {
    if (this.store[key]) {
      this.store[key].index = this.index++;
      return this.store[key];
    }
  }

  _evictOldestItem() {
    let index = Number.MAX_VALUE;
    let oldestKey = null;
    for (const [key, val] of Object.entries(this.store)) {
      if (val.index < index) {
        index = val.index;
        oldestKey = key;
      }
    }

    console.log("Removing:", oldestKey)

    delete this.store[oldestKey];
  }

  get(key: any) {
    return this._retrieveItem(key)?.val
  }

  set(key, val) {
    const item = this._retrieveItem(key);

    if (!item) {
      const cacheSize = Object.keys(this.store).length;
      if (cacheSize === this.size) {
        this._evictOldestItem();
      }
    }

    this.store[key] = {
      val,
      index: this.index++,
    };
  }
}

const cache = new LRUCache(2);

cache.set('key1', 'value');
cache.set('key2', 'value');
cache.set('key1', 'value_updated');
cache.set('key3', 'value3');
cache.set('key3', 'value3');
cache.set('key4', 'value3');
// cache.set('key3', 'value');
// cache.set('key4', 'value');

const res = cache.get('key1');
console.log(res);