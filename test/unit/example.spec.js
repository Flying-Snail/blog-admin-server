'use strict'
const { test, trait } = use('Test/Suite')('User registeration')
const jwt = require('jsonwebtoken')

test('user token', async ({ assert }) => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWNmMTU3ZjIzYzk3M2UyZjMyYjYy
    M2RkIiwidXNlcl9uYW1lIjoiODQ0MDMwNDkxIiwiaWF0IjoxNTYwOTM4MDg2LCJleHAiOjE1NjE1NDI4ODZ9.tTXVGw8vlRnVmcLkHm
    TZaz76hPchSZ_ODkVpq427HEk`
  let sign = {}
  try {
    sign = jwt.verify(token, '844030491@qq.com')
  } catch (error) {
  }
  assert.deepEqual({}, sign)
})