// get some doms
let $panels = document.querySelectorAll(`.form-panel`)
let $navItems = document.querySelectorAll('.nav-item')
let $accounts = document.querySelectorAll('.account')
let $tokens = document.querySelectorAll('.token')
let $generates = document.querySelectorAll('.generate')

// default active panel
let cursorPanel
// form data
let formData = {}

init()

/**
 * initialize
 */
async function init () {
  bindEvents()
  cursorPanel = await getCursorPanel() || 'token'
  activePanel(cursorPanel)
}

/**
 * bind form events
 */
function bindEvents () {
  addEvents($navItems, 'click', changeNavHandler)
  addEvents($accounts, 'keyup', keyupHandler)
  addEvents($tokens, 'keyup', keyupHandler)
  addEvents($generates, 'click', generateHandler)

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

    formData[cursorPanel][target.dataset.type] = target.value

    buttonStatus()
  }

  function buttonStatus () {
    let form = formData[cursorPanel]
    let $generate = document.querySelector(`.generate[data-type="${cursorPanel}"]`)
    if (form.account && form.token) {
      $generate.classList.remove('disabled')
    } else {
      $generate.classList.add('disabled')
    }
  }

  function generateHandler () {
    let form = formData[cursorPanel]
    if (form.account && form.token) {
      let token = `Basic ${window.btoa(`${formData.account}:${formData.token}`)}`

      // chrome.storage.local.set({'github_auth_token': token})

      alert('generate success')
    }
  }
}

/**
 * a jquery like event listener
 */
function addEvents (tags, event, handler) {
  tags.forEach(tag => tag && event && handler && tag.addEventListener(event, handler))
}

function removeEvents (tags, event, handler) {
  tags.forEach(tag => tag && event && handler && tag.removeEventListener(event, handler))
}

/**
 * active a panel
 */
function activePanel (cursor) {
  let $cursorPanel = document.querySelector(`.form-panel[data-type="${cursor}"]`)
  let $cursorNav = document.querySelector(`.nav-item[data-type="${cursor}"]`)

  hidePanels()
  $cursorPanel.classList.add('active')
  $cursorNav.classList.add('selected')
  chrome.storage.local.set({'cursor_nav': cursor})
  // init formData
  formData[cursor] = formData[cursor] || {}
}

/**
 * hide all panel
 */
function hidePanels () {
  $panels.forEach($item => $item && $item.classList.remove('active'))
  $navItems.forEach($item => $item && $item.classList.remove('selected'))
}

async function getCursorPanel () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('cursor_nav', data => {
      if (data.cursor_nav) {
        resolve(data.cursor_nav)
      } else {
        resolve()
      }
    })
  })
}

// chrome.storage.local.set({'github_auth_token': 'test'})
//
// chrome.storage.local.get('github_auth_token', data => {
//   if (data.address) {
//     document.querySelector('#username').value = data.address
//   }
// })
