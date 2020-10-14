$(function () {
    getUserinfo();
    // 点击按钮实现退出功能
    var layer = layui.layer;
    $('#btnlogout').on('click', function () {
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            //    layui自带的关闭询问框的功能
            layer.close(index);
            // 退出要做的事情
            // 1.跳转到登录页面
            location.href = '/login.html'
            // 2.清空localStorage中存储的数据
            localStorage.removeItem('token')
        });
    })
})
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
    });
}
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}