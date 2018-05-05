let current = {}
let tabReg = /[?&]tab=(followers|following)/i
let pageReg = /[?&]page=(\d+)/i

async function main () {
  try {
    let meta = document.querySelector('meta[name="octolytics-actor-login"]')

    // unlogin
    // do nothing
    if (!meta) {
      return
    }

    let currentUser = meta.content
    let token = await getStorage('github_auth_token')

    if (!token) return console.log('has no token')

    let result = await fetch(`https://api.github.com/users/${currentUser}`, {
      credentials: 'same-origin',
      headers: {
        Authorization: token
      }
    })
    if (result.status === 200) {
      let data = await result.json()

      current = data
      current.token = token

      console.log(`welcome ${current.login}!`, location.href)
    }

    bindEvents()

    if (tabReg.test(location.search)) {
      await tabStatusHandler(tabReg.exec(location.search)[1], (pageReg.exec(location.search) || [0, 1])[1])
    }
  } catch (e) {
    console.error(e)
  }
}

main()

function bindEvents () {
  // let $followerNav = document.querySelector('.user-profile-nav a[title="Followers"]')
  // let $followingNav = document.querySelector('.user-profile-nav a[title="Following"]')

  // addEvents([].concat($followerNav, $followingNav), 'click', tabStatusHandler)

  let target = document.body
  let observer = new MutationObserver(tabStatusHandler.bind(this, {}))
  let config = {childList: true}
  observer.observe(target, config)
}

async function tabStatusHandler ({tabType, tabPage = 1}) {
  if (!tabReg.test(location.search)) return

  if (!tabType) {
    tabType = tabReg.exec(location.search)[1]
  }

  if (!tabPage) {
    tabPage = (pageReg.exec(location.search) || [0, 1])[1]
  }

  if (tabType === current.tab && tabPage === current.page) return
  current.tab = tabType
  current.page = tabPage
  tabType = tabType.toLowerCase()

  let $list = document.querySelectorAll('.position-relative>div.d-table')

  let results = {}

  await Promise.all(Array.from($list).map(async function (item) {
    // slice from `@`
    let target = item.querySelector('.avatar').alt.slice(1)

    if (tabType === 'followers') {
      // your followers list
      let result = await fetch(`https://api.github.com/users/${current.login}/following/${target}`, {
        credentials: 'same-origin',
        headers: {
          Authorization: current.token
        }
      })
      console.clear()
      if (result.status === 204) {
        let $btn = item.querySelector(`.user-following-container .unfollow button.btn`)
        results[target] = true
        // you has follow him
        $btn.classList.add('btn-primary', 'complete')
        $btn.innerHTML = 'Friend'
        item.querySelector(`.user-following-container .follow button.btn`).classList.add('complete')
      } else if (result.status === 404) {
        let $btn = item.querySelector(`.user-following-container .follow button.btn`)
        // you has not follow him
        results[target] = false
        $btn.classList.add('complete')
        item.querySelector(`.user-following-container .unfollow button.btn`).classList.add('complete')
      }
    } else if (tabType === 'following') {
      // your followling list
      let result = await fetch(`https://api.github.com/users/${target}/following/${current.login}`, {
        credentials: 'same-origin',
        headers: {
          Authorization: current.token
        }
      })
      console.clear()
      if (result.status === 204) {
        let $btn = item.querySelector(`.user-following-container .unfollow button.btn`)
        // he has follow you
        results[target] = true
        $btn.classList.add('btn-primary', 'complete')
        $btn.innerHTML = 'Friend'
      } else if (result.status === 404) {
        let $btn = item.querySelector(`.user-following-container .unfollow button.btn`)
        // he has not follow you
        results[target] = false
        $btn.classList.add('btn-danger', 'complete')
      }
      item.querySelector(`.user-following-container .follow button.btn`).classList.add('complete')
    }
  }))

  Object.entries(results).map(([name, status]) => {
    if (tabType === 'followers') {
      console.log(`you has has ${status ? '   ' : 'not'} follow ${name}`)
    } else if (tabType === 'following') {
      console.log(`${name.padEnd(16, ' ')} has ${status ? '   ' : 'not'} follow you`)
    }
  })
}

/**
 * a jquery like event listener
 */
function addEvents (tags, event, handler) {
  tags.forEach(tag => tag && event && handler && tag.addEventListener(event, handler))
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

// async function setStorage (key, value) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.set({[key]: value})
//     resolve()
//   })
// }
