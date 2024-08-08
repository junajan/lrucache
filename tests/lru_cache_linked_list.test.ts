import { describe, test } from 'node:test';
import assert from 'node:assert';
import LRUCache from '../lru_cache_linked_list';

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
});