$(function () {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新密码框
        samepwd: function (value) {
            if (value === $('[name = oldPwd]').val()) {
                return '新旧密码不能重复'
            };
        },
        // 确认密码框
        repwd: function (value) {
            if (value !== $('[name = newPwd]').val()) {
                return '两次输入密码不一致'
            }
        }
    });
    // 监听密码表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();  // 阻止默认提交行为
        // 发起ajax请求，将表单内的数据提交到后台
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})