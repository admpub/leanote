# 运行Leanote

## 准备工作
1. 安装mongodb。例如MacOS系统执行以下命令安装
    ```
    brew tap mongodb/brew
    brew install mongodb-community@4.4
    ```
    然后导入初始数据。  
    导入方法参考本文后面“安装”章节中的“导入初始数据”

2. 执行命令
    ```
    go get -u github.com/revel/cmd/revel
    ```

## 开始运行
### 以开发模式运行Leanote:
```
$> revel run github.com/admpub/leanote dev [port]
如:
$> revel run github.com/admpub/leanote dev 9100
```
### 以生产模式运行Leanote:
```
$> revel run github.com/admpub/leanote prod [port]
如:
$> revel run github.com/admpub/leanote prod 8080
```
**端口号必须与配置文件 conf/app.conf 中的port值保持一致**

注意, 以开发模式运行Leanote笔记主页使用的view是note-dev.html, 以生产模式运行Leanote笔记主页使用的view是note.html.
使用eclipse开发Leanote

首先确保你的eclipse已安装goclipse插件, 然后直接将leanote导入到eclipse中(leanote已是一个eclipse项目, 直接导入即可)

为了确保eclipse能自动编译leanote, 你可以建一个symlink src 指向app(src是goclipse默认的源码路径)

当然, 你还可以用Sublime开发Leanote.
构建 Leanote 静态文件

以开发模式启动Leanote时, 使用的是note-dev.html, 发布Leanote时需要合并js, note-dev.html转成note.html.

Leanote前端通过gulp编译, 请在leanote根目录下执行:
```
$> npm install
$> npm run gulp
```
或者
```
$> yarn install
$> yarn gulp
```
在此之前你可能需要安装nodejs, gulp.

## 安装

1. 导入初始数据

    leanote初始数据存放在 `$GOPATH/src/github.com/  admpub/leanote/mongodb_backup/    leanote_install_data` 中。

    打开终端， 输入以下命令导入数据。
    ```
    $> mongorestore -h localhost -d leanote --dir   $GOPATH/src/github.com/admpub/leanote/    mongodb_backup/leanote_install_data
    ```
    现在在mongodb中已经新建了leanote数据库, 可用命令查看    下leanote有多少张"表":
    ```
    $> mongo
    > show dbs #　查看数据库
    leanote	0.203125GB
    local	0.078125GB
    > use leanote # 切换到leanote
    switched to db leanote
    > show collections # 查看表
    files
    has_share_notes
    note_content_histories
    note_contents
    ....
    ```
    初始数据的users表中已有2个用户:

    user1. username: `admin`, password: `abc123`    (管理员, 只有该用户才有权管理后台, 请及时修改密码)  
    user2. username: `demo@leanote.com`,    password: `demo@leanote.com` (仅供体验使用)

2. 配置leanote

    leanote的配置存储在文件 `conf/app.conf` 中。

    请务必修改`app.secret`一项, 在若干个随机位置处，将字符修改成一个其他的值, 否则会有安全隐患!

    其它的配置可暂时保持不变, 若需要配置数据库信息, 请参照 leanote问题汇总。

3. 运行leanote

    注意: 在此之前请确保mongodb已在运行!

    新开一个窗口, 运行:
    ```
    $> cd /home/user1/leanote/bin
    $> bash run.sh
    ```
    最后出现以下信息证明运行成功:
    ```
    ...
    TRACE 2013/06/06 15:01:27 watcher.go:72:    Watching: /home/life/leanote/bin/src/github.   com/leanote/leanote/conf/routes
    Go to /@tests to run the tests.
    Listening on :9000...
    ```
    恭喜你, 打开浏览器输入: http://localhost:9000 体验leanote吧!

- END 