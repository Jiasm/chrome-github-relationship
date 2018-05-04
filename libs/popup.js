chrome.storage.local.set({'github_auth_token': 'test'})
//
// chrome.storage.local.get('github_auth_token', data => {
//   if (data.address) {
//     document.querySelector('#username').value = data.address
//   }
// })

let $account = document.querySelector('#account')
let $password = document.querySelector('#password')
let $generate = document.querySelector('#generate')
let formData = {}

$account.addEventListener('keyup', keyupHandler)
$password.addEventListener('keyup', keyupHandler)
$generate.addEventListener('click', generateHandler)

function keyupHandler (e) {
  let {target} = e

  formData[target.id] = target.value

  buttonStatus()
}

function buttonStatus () {
  if (formData.account && formData.password) {
    $generate.classList.remove('disabled')
  } else {
    $generate.classList.add('disabled')
  }
}

function generateHandler () {
  if (formData.account && formData.password) {
    let token = `Basic ${window.btoa(`${formData.account}:${formData.password}`)}`

    chrome.storage.local.set({'github_auth_token': token})

    alert('generate success')
  }
}
