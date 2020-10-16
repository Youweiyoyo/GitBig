$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }
                // 模板引擎渲染结构
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 给选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click();
    })
    // 监听coverfile的change事件
    $('#coverfile').on('change', function (e) {
        var files = e.target.files;
        if (files === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    })
    // 存为草稿或已发布
    var art_shougao = '已发布';
    $('#btnSevetwo').on('click', function () {
        art_shougao = '存为草稿';
    })
    // 给表单添加提交事件
    $('#addform').on('submit', function (e) {
        // 阻止提交行为
        e.preventDefault();
        // 创建一个Forem Data对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态，存到fd中
        fd.append('state', art_shougao);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                rst(fd);
            })
    })
    // 定义提交文章的ajax函数
    function rst(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 发布文章成功后跳转到文章列表页面
                location.href = '/article/art-list.html'
            }
        })
    }
})