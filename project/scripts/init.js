'use strict'

const init = require('init-package-json')
const path = require('path')

const initFile = path.resolve(__dirname, 'project-init.js')

const dir = process.cwd()

const configData = {}

init(dir, initFile, configData, (err, data) => {
  if (err) {
    console.error('Failed to initialize project...')
    throw err
  }

  console.log('Successfully Initialized Project!')
})
