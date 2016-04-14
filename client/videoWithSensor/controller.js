// カメラ／マイクにアクセスするためのメソッドを取得しておく
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia;

var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall;  // 接続したコールを保存しておく変数
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
        var url = URL.createObjectURL(stream);

        // video要素のsrcに設定することで、映像を表示する
        $('#peer-video').prop('src', url);
    });
});

// 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
// - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
peer.on('connection', function(connection){
  　
    // データ通信用に connectionオブジェクトを保存しておく
    conn = connection;
 
    // メッセージ受信イベントの設定
    conn.on("data", onRecvMessage);
});

// メッセージ受信イベントの設定
function onRecvMessage(data) {
    // 画面に受信したメッセージを表示
    //$("#messages").append($("<p>").text(conn.id + ": " + data).css("font-weight", "bold"));
    $("#messages").text(conn.id + ": " + data + ", " + data.x + ", " + data.y).css("font-weight", "bold");
}

// DOM要素の構築が終わった場合に呼ばれるイベント
// - DOM要素に結びつく設定はこの中で行なう
$(function() {
    // カメラ／マイクのストリームを取得する
    // - 取得が完了したら、第二引数のFunctionが呼ばれる。呼び出し時の引数は自身の映像ストリーム
    // - 取得に失敗した場合、第三引数のFunctionが呼ばれる
    navigator.getUserMedia({audio: true, video: true}, function(stream){

        // このストリームを通話がかかってき場合と、通話をかける場合に利用するため、保存しておく
        localStream = stream;

        // 映像ストリームオブジェクトをURLに変換する
        // - video要素に表示できる形にするため変換している
        var url = URL.createObjectURL(stream);

        // video要素のsrcに設定することで、映像を表示する
        $('#my-video').prop('src', url);

    }, function() { alert("Error!"); });

    // Start Callボタンクリック時の動作
    $('#call-start').click(function(){

        // 接続先のIDをフォームから取得する
        var peer_id = $('#peer-id-input').val();

        // 相手と通話を開始して、自分のストリームを渡す
        var call = peer.call(peer_id, localStream);
            
        // 相手のストリームが渡された場合、このstreamイベントが呼ばれる
        // - 渡されるstreamオブジェクトは相手の映像についてのストリームオブジェクト
        call.on('stream', function(stream){
            // 相手のIDを表示する
            $("#peer-id").text(call.peer);

            // 映像ストリームオブジェクトをURLに変換する
            // - video要素に表示できる形にするため変換している
            var url = URL.createObjectURL(stream);

            // video要素のsrcに設定することで、映像を表示する
            $('#peer-video').prop('src', url);
        });
    });

    // End　Callボタンクリック時の動作
    $('#call-end').click(function(){
        // ビデオ通話を終了する
        connectedCall.close();
    });
});