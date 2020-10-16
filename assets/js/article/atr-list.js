$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义时间函数
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = padnZero(dt.getFullYear());
        var m = padnZero(dt.getMonth() + 1);
        var d = padnZero(dt.getHours());

        var hh = padnZero(dt.getHours());
        var mm = padnZero(dt.getMinutes());
        var ss = padnZero(dt.getSeconds());
        return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
    }
    // 定义补零函数
    function padnZero(n) {
        return n > 9 ? n : '0' + n;
    }
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', //文章分类的id
        state: '', // 文章的发布状态
    }
    initTable();
    initCata();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-tabla', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCata() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 模板引擎渲染页面
                var htmlStr = template('tpl-fl', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 为筛选表单绑定 submit事件  //筛选未验证
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initCata();
    })
    // 定义分页渲染的方法
    function renderPage(total) {
        console.log(total);
        laypage.render({
            elem: 'pageBox',  // 分页容器的Id
            count: total,  // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,  // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }
    // 通过代理的形式给删除按钮绑定事件
    $('tbody').on('click', '.btn-deler', function () {
        // 获取到删除按钮的数量
        var len = $('.btn-deler').length;
        // 获取到点击到的文章的Id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')
                    layer.close(index);
                    // 当删除按钮的数量等于一时，证明删除数据完毕，页面上没有任何数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

        });
    })
})