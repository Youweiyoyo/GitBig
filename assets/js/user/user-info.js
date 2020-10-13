$(function () {
    var form = layui.form
    form.verify({
        nickname: function () {
            if (value.lenght > 6) {
                return '昵称的长度必须在1~6个字符之间'
            }
        }
    })
    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户登录信息失败')
                }
                console.log(res);
            }
        })
    }
})