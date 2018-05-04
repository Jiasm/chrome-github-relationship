async function test () {
  try {
    let meta = document.querySelector('meta[name="octolytics-actor-login"]')

    // unlogin
    // do nothing
    if (!meta) {
      return
    }

    let currentUser = meta.content

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
