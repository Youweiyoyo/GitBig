$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 给按钮绑定点击事件
    $('#btnsc').on('click', function () {
        $('#file').click();
    })
    // 给上传文件input绑定事件
    $('#file').on('change', function (e) {
        var filelist = e.target.files
        if (filelist.lenght === 0) {
            return layer.msg('请选择照片！')
        }
        // 1.拿到用户上传的文件
        var file = e.target.files[0];
        // 2.将文件转化为url路径
        var imgURL = URL.createObjectURL(file);
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 确定按钮上传图片
    $('#btnyes').on('click', function () {
        var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png');
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传头像失败');
                }
                layer.msg('上传头像成功');
                window.parent.getUserinfo();
            }
        })
    })
})
