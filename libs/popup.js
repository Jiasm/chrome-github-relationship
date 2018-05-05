// get some doms
let $panels = document.querySelectorAll(`.form-panel`)
let $navItems = document.querySelectorAll('.nav-item')
let $accounts = document.querySelectorAll('.account')
let $tokens = document.querySelectorAll('.token')
let $generates = document.querySelectorAll('.generate')
let $removes = document.querySelectorAll('.remove')

// default active panel
let cursorPanel
// add of remove token switch
let tokenStatus = false
// form data
let formData = {}

init()

/**
 * initialize
 */
async function init () {
  tokenStatus = Boolean(await getStorage('github_auth_token'))
  bindEvents()
  cursorPanel = await getStorage('cursor_nav') || 'token'
  activePanel(cursorPanel)
  changeRemoveButton(cursorPanel)
  await fillInputFromStorage()
}

async function fillInputFromStorage () {
  let cursor = await getStorage('cursor_nav')

  if (cursor) {
    let account = await getStorage('github_user_account') || ''
    let token = await getStorage('github_user_token') || ''

    document.querySelector(`.account[data-type="${cursor}"]`).value = account
    document.querySelector(`.token[data-type="${cursor}"]`).value = token
    // fill formData
    formData[cursor] = {
      account,
      token
    }

    changeButtonStatus()
  }
}

/**
 * bind form events
 */
function bindEvents () {
  addEvents($navItems, 'click', changeNavHandler)
  addEvents([].concat(...$accounts, ...$tokens), 'keyup', keyupHandler)
  addEvents($generates, 'click', generateHandler)
  addEvents($removes, 'click', removeHandler)
}

/**
 * a jquery like event listener
 */
function addEvents (tags, event, handler) {
  tags.forEach(tag => tag && event && handler && tag.addEventListener(event, handler))
}

// function removeEvents (tags, event, handler) {
//   tags.forEach(tag => tag && event && handler && tag.removeEventListener(event, handler))
// }

/**
 * active a panel
 */
function activePanel (cursor) {
  let $cursorPanel = document.querySelector(`.form-panel[data-type="${cursor}"]`)
  let $cursorNav = document.querySelector(`.nav-item[data-type="${cursor}"]`)

  hidePanels()
  $cursorPanel.classList.add('active')
  $cursorNav.classList.add('selected')
  setStorage('cursor_nav', cursor)
  // init formData
  formData[cursor] = formData[cursor] || {}
  // focus input
  document.querySelector(`.account[data-type="${cursor}"]`).focus()

  changeButtonStatus()
}

/**
 * hide all panel
 */
function hidePanels () {
  $panels.forEach($item => $item && $item.classList.remove('active'))
  $navItems.forEach($item => $item && $item.classList.remove('selected'))
}

function changeNavHandler (e) {
  let {target} = e

  let {type} = target.dataset

  if (type !== cursorPanel) {
    cursorPanel = type
    activePanel(cursorPanel)
  }
}

function keyupHandler (e) {
  let {target} = e

  formData[cursorPanel][target.dataset.field] = target.value

  console.log(formData)

  changeButtonStatus()
}

function changeButtonStatus () {
  let form = formData[cursorPanel]
  let $generate = document.querySelector(`.generate[data-type="${cursorPanel}"]`)
  if (form.account && form.token) {
    $generate.classList.remove('disabled')
  } else {
    $generate.classList.add('disabled')
  }
}

function changeRemoveButton (cursor) {
  let $generate = document.querySelector(`.generate[data-type="${cursor}"]`)
  let $remove = document.querySelector(`.remove[data-type="${cursor}"]`)
  if (tokenStatus) {
    $generate.classList.add('hide')
    $remove.classList.add('active')
  } else {
    $generate.classList.remove('hide')
    $remove.classList.remove('active')
  }
}

/**
 * generate token
 */
function generateHandler (e) {
  let {target} = e

  if (target.classList.contains('disabled')) return

  let form = formData[cursorPanel]
  if (form.account && form.token) {
    let token = `Basic ${window.btoa(`${form.account}:${form.token}`)}`

    setStorage('github_user_account', form.account)
    setStorage('github_user_token', form.token)
    setStorage('github_auth_token', token)

    // set btn with success
    tokenStatus = true
    // change dom
    changeRemoveButton(cursorPanel)
  }
}

function removeHandler (e) {
  let {target} = e

  if (target.classList.contains('disabled')) return

  // clear memory
  formData[cursorPanel] = {}
  tokenStatus = false

  // clear storage
  setStorage('github_user_account', null)
  setStorage('github_user_token', null)
  setStorage('github_auth_token', null)

  // change dom
  document.querySelector(`.account[data-type="${cursorPanel}"]`).value = ''
  document.querySelector(`.token[data-type="${cursorPanel}"]`).value = ''
  changeRemoveButton(cursorPanel)
  changeButtonStatus()
}

async function getStorage (key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, data => {
      if (data[key]) {
        resolve(data[key])
      } else {
        resolve()
      }
    })
  })
}

async function setStorage (key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({[key]: value})
    resolve()
  })
}
