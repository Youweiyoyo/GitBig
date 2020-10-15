$(function () {
    var layer = layui.layer;
    var form = layui.form;
    getinformation();
    function getinformation() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 点击添加
    var indexAdd = null;
    $('#addCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dilong-add').html(),
        });
    });
    // 通过事件代理的形式绑定submit事件
    $('body').on('submit', '#addform', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                getinformation();
                layer.msg('添加成功')
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })
    // 给编辑按钮添加点击事件 添加编辑图层
    var indexEdit = null
    $('tbody').on('click', '.btn—bj', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dilong-Edit').html(),
        });
        var id = $(this).attr('data-id');
        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('editForm', res.data)
            }
        })

    })
    // 编辑按钮添加ajax请求
    $('body').on('submit', '#editForm', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功');
                getinformation();
                layer.close(indexEdit);
            }
        })
    })
    // 给删除按钮绑定事件
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    getinformation();
                    layer.close(index);
                }
            })
        });
    })
})