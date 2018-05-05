let current = {}

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

    let urlReg = /\?tab=(followers|following)/i
    if (urlReg.test(location.search)) {
      await tabStatusHandler(urlReg.exec(location.search)[1])
    }
  } catch (e) {
    console.error(e)
  }
}

main()

function bindEvents () {
  let $followerNav = document.querySelector('.user-profile-nav a[title="Followers"]')
  let $followingNav = document.querySelector('.user-profile-nav a[title="Following"]')

  addEvents([].concat($followerNav, $followingNav), 'click', tabStatusHandler)
}

async function tabStatusHandler (e) {
  let tabType
  // trigger by self
  if (typeof e === 'string') {
    tabType = e
  } else {
    tabType = e.target.title
  }

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
        results[target] = true
        // you has follow him
        // console.log(`you has follow ${target}`)
      } else if (result.status === 404) {
        // you has not follow him
        // console.log(`you has not follow ${target}`)
        results[target] = false
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
        // he has follow you
        results[target] = true
        // console.log(`${target} has follow you`)
      } else if (result.status === 404) {
        // he has not follow you
        results[target] = false
        // console.log(`${target} has not follow you`)
      }
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
