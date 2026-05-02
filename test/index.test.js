const test = require('node:test')
const assert = require('node:assert')
const { buildButtonMessage, buildListMessage } = require('../src')

test('buildButtonMessage creates valid payload', () => {
  const payload = buildButtonMessage({
    text: 'Hello',
    buttons: [{ id: 'a', text: 'A' }],
  })

  assert.equal(payload.text, 'Hello')
  assert.equal(payload.buttons[0].buttonId, 'a')
})

test('buildListMessage creates valid payload', () => {
  const payload = buildListMessage({
    text: 'List',
    sections: [{ title: 'A', rows: [] }],
  })

  assert.equal(payload.text, 'List')
  assert.equal(payload.sections.length, 1)
})
