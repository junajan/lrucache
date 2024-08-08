import { describe, test } from 'node:test';
import assert from 'node:assert';
import LRUCache, { Item } from '../lru_cache_linked_list';

function getLinkedListKeys(firstItem: Item) {
  const keys = [];
  let item = firstItem;

  while(item) {
    keys.push(item.key);
    item = item.next;
  }

  return keys;
}

describe('Test LRUCache', () => {
  test('Should return undefined when item is not in cache', () => {
    const cache = new LRUCache(10);

    const storedValue = cache.get('unknown');
    assert.strictEqual(storedValue, undefined);
  });

  test('Should set item to cache and retrieve it', () => {
    const items = [
      [1, 999],
      ['key', 'strValue'],
      [true, false],
      [null, null],
      [Object, Object],
      [Symbol('key'), Symbol('val')],
    ];

    const cache = new LRUCache(10);
    for (const [key, val] of items) {
      cache.set(key, val);
      assert.strictEqual(cache.get(key), val);
    }
  });

  test('Should evict oldest item when cache overflows', () => {
    const cache = new LRUCache(2);
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');

    const storedValue = cache.get('key1');
    assert.strictEqual(storedValue, undefined);
  });

  test('Should evict item based on the last usage time', () => {
    const cache = new LRUCache(2);
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.get('key1');
    cache.set('key3', 'value3');

    const storedValue1 = cache.get('key1');
    assert.strictEqual(storedValue1, 'value1');

    const storedValue2 = cache.get('key2');
    assert.strictEqual(storedValue2, undefined);
  });

  test('Should update value in cache', () => {
    const cache = new LRUCache(3);

    cache.set('key1', 'value1');
    cache.set('key1', 'value1_updated');
    assert.strictEqual(cache.get('key1'), 'value1_updated');
  });

  test('Should work with cache where max size is set to 1', () => {
    const cache = new LRUCache(1);

    cache.set('key1', 'value1');
    assert.strictEqual(cache.get('key1'), 'value1');

    cache.set('key1', 'value1_updated');
    assert.strictEqual(cache.get('key1'), 'value1_updated');

    cache.set('key2', 'value2');
    assert.strictEqual(cache.get('key2'), 'value2');
    assert.strictEqual(cache.get('key1'), undefined);
  });

  test('Should work with cache where max size is set to 1', () => {
    const cache = new LRUCache(1);

    cache.set('key1', 'value1');
    assert.strictEqual(cache.get('key1'), 'value1');

    cache.set('key1', 'value1_updated');
    assert.strictEqual(cache.get('key1'), 'value1_updated');

    cache.set('key2', 'value2');
    assert.strictEqual(cache.get('key2'), 'value2');
    assert.strictEqual(cache.get('key1'), undefined);
  });

  test('Should move item from the end of the list', () => {
    const cache = new LRUCache(3);

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.get('key1'); // will move key1 from the end to the front

    const listKeys = getLinkedListKeys(cache.firstItem);
    const expectedKeys = ['key1', 'key3', 'key2'];
    assert.deepEqual(expectedKeys, listKeys);
  });

  test('Should move item from the middle of the list', () => {
    const cache = new LRUCache(3);

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.get('key2'); // will persist key3 at the front

    const listKeys = getLinkedListKeys(cache.firstItem);
    const expectedKeys = ['key2', 'key3', 'key1'];
    assert.deepEqual(expectedKeys, listKeys);
  });

  test('Should move item from the start of the list', () => {
    const cache = new LRUCache(3);

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.get('key3'); // will persist key3 at the front

    const listKeys = getLinkedListKeys(cache.firstItem);
    const expectedKeys = ['key3', 'key2', 'key1'];
    assert.deepEqual(expectedKeys, listKeys);
  });
});