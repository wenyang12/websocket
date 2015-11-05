/**
 * Created by Administrator on 2015/11/4.
 */
var ws = require("nodejs-websocket");//获取nodejs-websocket模块
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


