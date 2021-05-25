import { expect } from "chai"
import 'mocha';

import DataCacheStorage from '../src/cache'

describe("Initialize data cache", () => {
  it('sets default value when no arguments', () => {
    const dataCache = new DataCacheStorage()
    expect(dataCache.cache).to.be.empty
    expect(dataCache.cacheMaxAge).to.equal(3600 * 1000)
    expect(dataCache.cacheAllocatedMemory).to.equal(64)
  })
  it('honours provided cache age when provided', () => {
    const dataCache = new DataCacheStorage(1000)
    expect(dataCache.cache).to.be.empty
    expect(dataCache.cacheMaxAge).to.equal(1000 * 1000)
    expect(dataCache.cacheAllocatedMemory).to.equal(64)
  })
  it('honours user provided configuration', () => {
    const dataCache = new DataCacheStorage(100, 20)
    expect(dataCache.cache).to.be.empty
    expect(dataCache.cacheMaxAge).to.equal(100 * 1000)
    expect(dataCache.cacheAllocatedMemory).to.equal(20)
  })
})

describe("Cache usage", () => {
  it("cache data", () => {
    const dataCache = new DataCacheStorage()
    const data = {name: 'test userr'}
    dataCache.setData({collection: 'test', id: 'alpha'}, data)

    expect(dataCache.getData({collection: 'test', id: 'alpha'})).to.equal(data)
    expect(dataCache.getData({collection: 'test', id: 'beta'})).to.be.null
  })
  it("expired cache data", () => {
    const dataCache = new DataCacheStorage(-1000)
    const data = {name: 'test userr'}
    dataCache.setData({collection: 'test', id: 'alpha'}, data)
    expect(dataCache.getData({collection: 'test', id: 'alpha'})).to.be.null
  })
})
