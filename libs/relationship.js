async function test () {
  try {
    let meta = document.querySelector('meta[name="octolytics-actor-login"]')

    // unlogin
    // do nothing
    if (!meta) {
      return
    }

    let currentUser = meta.content
    let token = await getToken()

    if (!token) return console.log('has no token')

    let result = await fetch(`https://api.github.com/users/${currentUser}`, {
      credentials: 'same-origin',
      headers: {
        Authorization: token
      }
    })
    if (result.status === 200) {
      let data = await result.json()

      console.log(data)
    }
  } catch (e) {
    console.error(e)
  }
}

test()

function getToken () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('github_auth_token', data => {
      if (data.address) {
        resolve(data.address)
      } else {
        resolve()
      }
    })
  })
}
