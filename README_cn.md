# :octocat: chrome-github-relationship
一个`Chrome`浏览器插件，帮助你清晰的看到与好友的关系（`是否相互关注`）
专治那些说好的互粉，然后悄悄取消关注的人。

> [english docs](README_cn.md)

## 使用方法

**没有鉴权的话，请求API会被限制次数**
**这是一个本地的扩展，不会拿你的密码或token做任何事情，仅仅用来鉴权使用**

### 第一步

下载`.crx`文件（没有双币信用卡。。。没法激活`chrome`开发者）:  
[chrome-github-relationship.crx](/dist/chrome-github-relationship.crx)

### 第二步

拖拽到`chrome`中并安装

### 第三步

输入`token`或者`password`.  
![](/dist/example.png)

#### 如何生成使用的`token`

1. 打开你的GitHub主页 `https://github.com/<yourname>`
2. 点击`Settings`
3. 点击`Developer settings`
4. 点击`Personal access tokens`
5. 仅选择`user`对应的`scopes`即可
6. 复制`token`到`popup`页面中

### 第四步

点击`Generate`，生成`token`（本地只会生成一次，然后存放到`storage`中，因为这个鉴权头如果不重置的话是不会修改的）

### 第五步

像往常一样浏览`GitHub`页面即可

![](/dist/example.gif)
