---
layout: post
title: "websocket 聊天室"
date: 2015-11-05 13:51:10 +0800
comments: true
categories: [websoket, 聊天室, html5]
---
## 一、目录结构如下
- websocket
    - chat.html `聊天客户端代码`
    - chat_server.js `服务端代码`
    - package.json `包管理文件`
    - support.html `检查浏览器是否支持websocket`

## 二、检查浏览器是否支持websocket
代码如下：

    if(window.WebSocket){
        document.getElementById("support").innerHTML = "您的浏览器支持HTML5的WebSocket协议";
    }
    else{
        document.getElementById("support").innerHTML = "您的浏览器不支持HTML5的WebSocket协议";
    }
    
## 三、创建 websocket node.js端服务器
- 安装依赖包 nodejs-websoket 依赖包官方地址可以移步[这里](https://www.npmjs.com/package/nodejs-websocket)
    >npm install nodejs-websoket --save-dev

    - 或者可以到我的github上下载源代码欢迎大家fork <https://github.com/wenyang12/websocket>
    - 下载后直接 `npm install` 安装即可
- 新建服务端代码文件 `chat_server.js` 目录为：`websocket/chat_server.js`

 
        var ws = require("nodejs-websocket"); //获取nodejs-websocket模块
        var server = ws.createServer(function(conn){ //创建websocket服务器
                conn.sendText('您好! 欢迎您加入聊天室！'); //向接入的客户端发送消息
                console.log("有新聊天者加入");
                conn.on("text", function(msg){//监听是否有客户端发送消息过来
                        broadcast(conn.server, msg);//向所有客户端广播消息
                        console.log(msg);
                    });
                conn.on("close", function(code, reason){//监听客户端关闭连接
                        console.log(code+" 连接关闭了");//关闭掉浏览器窗口断开连接code为1001，通过代码断开连接code：1005
                    })
            }).listen(8000, function(){//监听8000端口
                    console.log("Hello,Server is Running:8000");
                });
        function broadcast(server, msg){
                server.connections.forEach(function(conn){
                        conn.sendText(msg);
                    })
            }
    
    
- 新建客户端代码文件 `chat.html` 目录为 `websocket/chat.html`

        var s = new WebSocket("ws://localhost:8000/");//链接websocket服务器
        var valueLabel = document.getElementById('valueLabel');
        s.onopen = function(event) {//当链接成功时
            valueLabel.innerHTML="<p>已经链接到WebSocket服务器</p>";
            console.log("链接成功了！！！");
        };
        s.onmessage = function(event) {//收到服务器传来信息的事件处理
            valueLabel.innerHTML +="<p>"+event.data+" "+CurentTime()+"</p>";
        };
        s.onclose = function(event) { //链接关闭时的事件处理
            console.log("连接关闭了！！！");
            console.log("readyState " + s.readyState);
        };
        function send_msg() {//向服务器发出信息
            var msgName = document.getElementById('msgname').value;
            var msg = document.getElementById('msgtxt').value;
            s.send(msgName + " say: " + msg + " ========= " + CurentTime());
        }
        function disconect() {//断开链接的函数
            s.close();// 关闭连接
            valueLabel.innerHTML = "<p>已经断开了跟WebSocket服务器的链接</p>";
            alert("断开了！");
        }
        function CurentTime() {// 获取当前时间的函数
            return (new Date().toLocaleString());
        }

## 启动服务器
>node chat_server.js

看到返回以下信息即成功
>Hello,Server is Running:8000

然后在浏览器中打开客户端页面，即可加入聊天，打开多少个都没问题，赶紧试试吧。。。
![image](http://wenyang-public.stor.sinaapp.com/Uploads/20151105/1446709473_618194907.JPG)

