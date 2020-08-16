'use strict'

const { spawnSync } = require('child_process')
const { readFileSync } = require('fs')
const { join } = require('path')

// Main Script
function main (username, repository) {
  // List all remotes
  const remotes = listRemotes()
  if (remotes.includes('origin')) {
    // Rename `origin` remote to `backup`
    renameRemote('origin', 'backup')
  }

  const originUrl = `https://github.com/${username}/${repository}.git`

  // Add new origin remote
  addRemote('origin', originUrl)
}

// Execute Script
const [username, repository] = process.argv.slice(2)
if (!username || !repository) {
  console.error('Invalid script input')
  process.exit(1)
}
main(username, repository)

// Helper Functions
function listRemotes () {
  const results = spawnSync('git', ['remote'])
  const { status, stdout, stderr } = results
  if (status !== 0) {
    console.error('Error listing git remotes')
    throw new Error(stderr.toString())
  }

  return stdout.toString().trim().split('\n')
}

function addRemote (name, url) {
  const results = spawnSync('git', ['remote', 'add', name, url])
  const { status, stderr } = results
  if (status !== 0) {
    console.error('Error adding git remote')
    throw new Error(stderr.toString())
  }

  console.log('GIT:', `Added ${name} remote with ${url}`)
}

function renameRemote (oldName, newName) {
  const results = spawnSync('git', ['remote', 'rename', oldName, newName])
  const { status, stderr } = results
  if (status !== 0) {
    console.error('Error renaming git remote')
    throw new Error(stderr.toString())
  }

  console.log('GIT: Successfully renamed remote', `(${oldName} -> ${newName})`)
}
