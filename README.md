# :octocat: chrome-github-relationship
a chrome extension, make your relationship clearer

> [中文版文档](README_cn.md)

## How to use

**No authentication will be limited to the number of API requests**
**That's a local extension, don't worry about you token or password**

### step 1

download the `.crx`:  
[chrome-github-relationship.crx](/dist/chrome-github-relationship.crx)

### step2

drop to chrome, install it.

### step3

input your `token` or `password`.  
![](/dist/example.png)

#### how to create a personal access token

1. Open `https://github.com/<yourname>`
2. Settings
3. Developer settings
4. Personal access tokens
5. Select `user` scopes
6. Copy your token to `popup`

### step4

Click `Generate`, set to `chrome.storage.local`, a static value.

### step5

Browse GitHub as usual

![](/dist/example.gif)

## TODO

others page supports  
only `Followers` and `Folling` for now.
