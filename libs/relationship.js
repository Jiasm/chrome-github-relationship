async function test () {
  try {
    let currentUser = document.querySelector('meta[name="octolytics-actor-login"]').content

    // unlogin
    // do nothing
    if (!currentUser) {
      return
    }

    let result = await fetch(`https://api.github.com/users/${currentUser}`)
    if (result.status === 200) {
      let data = await result.json()

      console.log(data)
    }
  } catch (e) {
    console.error(e)
  }
}

test()
