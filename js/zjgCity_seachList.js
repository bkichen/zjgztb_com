
var DanWeiType = "13";
var $pager = $("#pager");
var pageIndex = 0;
var pageSize = 15;
var DanWeiName = "";
var result = [];
$(function () {
    getData(DanWeiName);
});

$("#searchbtn").on("click", function () {
    var danweiname = $("#titletxt2").val();
    getData(danweiname, DanWeiType, pageIndex, pageSize);
})

function getData(danweiName) {
    $.ajax({
        type: "post",
        url: "/EpointWebService/rest/PublicDeclaration/getdanweiinfo",
        dataType: 'json',
        data: {
            "danweiname": danweiName
        },
        success: function (msg) {
            if (msg.dwinfo) {
                result = msg.dwinfo;
                renderPage(result, pageIndex, pageSize, msg.count);
            }
        }
    });
}

function renderPage(result, pageIndex, pageSize, count) {
    var curArray = [];
    for (var i = pageIndex * pageSize; i < pageIndex * pageSize + pageSize && i < count; i++) {
        curArray.push(result[i]);
    }
    $("#xxList").html(Mustache.render($("#info-template").html(), { Table: curArray }));
    renderPager(result, pageIndex, pageSize, count);
}

// 渲染页码
var renderPager = function (result, pageindex, pagesize, total) {
    if ($pager.pagination()) {
        $pager.pagination('destroy');
    }
    if (!total) {
        return;
    }
    var pagerConfig = {
        pageIndex: pageindex,
        pageSize: pagesize,
        total: total,
        showJump: true,
        jumpBtnText: 'Go',
        pageBtnCount: 10,
        showFirstLastBtn: true,
        showInfo: true,
        infoFormat: '共 {total} 条'
    }
    $pager.pagination(pagerConfig);

    $("#pager").on("pageClicked", function (event, data) {
        renderPage(result, data.pageIndex, data.pageSize, total);
    });
    $("#pager").on("jumpClicked", function (event, data) {
        renderPage(result, data.pageIndex, data.pageSize, total);
    });
}