"use strict";
var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall;  // 接続したコールを保存しておく変数
let url = null;
let conn = null;

// SkyWayのシグナリングサーバーへ接続する (APIキーを置き換える必要あり）
var peer = new Peer({ key: 'wqxgosr3rfwdn29', debug: 3});

// シグナリングサーバへの接続が確立したときに、このopenイベントが呼ばれる
peer.on('open', function(){
    // 自分のIDを表示する
    // - 自分のIDはpeerオブジェクトのidプロパティに存在する
    // - 相手はこのIDを指定することで、通話を開始することができる
    $('#my-id').text(peer.id);
});

// 相手からビデオ通話がかかってきた場合、このcallイベントが呼ばれる
// - 渡されるcallオブジェクトを操作することで、ビデオ映像を送受信できる
peer.on('call', function(call){
  　
    // 切断時に利用するため、コールオブジェクトを保存しておく
    connectedCall = call;

    // 相手のIDを表示する
    // - 相手のIDはCallオブジェクトのpeerプロパティに存在する
    $("#peer-id").text(call.peer);

    // 自分の映像ストリームを相手に渡す
    // - getUserMediaで取得したストリームオブジェクトを指定する
    call.answer(localStream);

    // 相手のストリームが渡された場合、このstreamイベントが呼ばれる
    // - 渡されるstreamオブジェクトは相手の映像についてのストリームオブジェクト
    call.on('stream', function(stream){

        // 映像ストリームオブジェクトをURLに変換する
        // - video要素に表示できる形にするため変換している
        //var url = URL.createObjectURL(stream);
        url = URL.createObjectURL(stream);

        // video要素のsrcに設定することで、映像を表示する
        $('#peer-video').prop('src', url);
    });
    console.log("hello peer");
    //console.log("peer id : " + call.peer);
    conn = peer.connect(call.peer);

});

// DOM要素の構築が終わった場合に呼ばれるイベント
// - DOM要素に結びつく設定はこの中で行なう
$(function() {
    //get devise rotation
    var $textX;
    var $textY;

    $(function() {
        $textX = $("#text-x");
        $textY = $("#text-y");

        // DeviceOrientation Event
        window.addEventListener("deviceorientation", deviceorientationHandler);
    });

    // ジャイロセンサーの値が変化
    function deviceorientationHandler(event) {
        // 地面に対して水平を90としたいため調整
        // X軸
        var beta = Math.floor(event.beta + 90);
        
        // Y軸
        var gamma = Math.floor(event.gamma + 90);
        var rot = {
            x : beta,
            y : gamma
        }
        $textX.html("X : " + rot.x);
        $textY.html("Y : " + rot.y);

        //data send to controller
        conn.send(rot);
    }

    // Sendボタンクリック時の動作
    $("#send").click(function() {
        // 送信テキストの取得
        var message = "helo world peeeeeeeeer";
 
        // 送信
        conn.send(message);
        console.log(message);
    });
});