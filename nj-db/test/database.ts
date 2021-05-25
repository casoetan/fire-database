import { expect } from "chai"
import 'mocha';

import Database from '../src'

describe('Database', () => {
  it('initialize database object', () => {
    const project_id = 'alpha'
    const database = new Database({project_id})
  
    expect(database.projectId).to.equal(project_id)
    expect(database.db).to.not.be.empty
    expect(database.dataCache).to.not.be.empty
  })

  it('writes to database store', () => {
    // test cache
    // mock firestore
  })

  it('reads one object from database store', () => {
    // test data not in cache
    // test data storred in cache
  })

  it('reads one object from database cache', () => {
    // test object in cache
  })

  it('reads many object from database store', () => {
    // test list is stored in cache
  })
})
