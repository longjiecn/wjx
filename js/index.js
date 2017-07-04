$(function(){
    /*动态响应式轮播图*/
    banner();
    /*初始化tabs页*/
    initTabs();
    /*初始化工具提示*/
    $('[data-toggle="tooltip"]').tooltip()
});
/*动态响应式轮播图*/
function banner(){
    /*
     *1.获取后台的轮播路  图片数据   （ajax）
     *2.需要判断当前的屏幕是移动端和是非移动端  （屏幕的宽度 768px以下都是移动端）
     *3.把后台数据渲染成对应的html字符串 （字符串拼接 & 模板引擎 artTemplate native-template）
     *   underscore 介绍和学习
     *4.把渲染完成的html填充在对应的盒子里面  也就是完成了页面渲染 （渲染到页面当中 .html()）
     *5.在屏幕尺寸改变的时候需要重新渲染页面 (监听页面尺寸的改变 resize)
     *6.在移动端需要 通过手势来控制图片的轮播 左 next 右的 prev  滑动
     * */

    /*申明全局的变量  接受数据  缓存在内存当中*/
    var myData;
    /*1.获取后台的轮播路  图片数据   （ajax）*/
    var getData = function(callback){
        if(myData){
            callback && callback(myData);
            return false;
        }
        /*ajax*/
        $.ajax({
            /*
             * js是被html引用的
             * 发出的请求是相对于html
             * html相对于 index.json  多了一层 js 文件夹
             * 相对路劲的话 还需要加目录
             * */
            url:'js/index.json',
            data:{},
            type:'get',
            dataType:'json',
            success:function(data){
                /*
                * 当我们已经请求成功之后  把数据缓存在内存当中
                * 当下次调用这个方法的时候  去判断内存当中有没有记录这个数据
                * 如果有记录  直接返回内存当中的
                * 如果没有  再做请求
                * */
                myData  = data;
                callback && callback(myData);
            }
        });
    }


    var renderHtml = function(){

        getData(function(data){

            var width = $(window).width();

            var isMobile = false;
            if(width < 768 ){
                isMobile = true;
            }

            var tempaltePoint = _.template($('#template_point').html());
            
            var templateImage = _.template($('#template_item').html());

            var pointHtml = tempaltePoint({model:data});
            var imageData = {
                list:data,
                isMobile:isMobile
            };
            var imageHtml = templateImage({model:imageData});
            /*渲染页面*/
            $(".carousel-indicators").html(pointHtml);
            $(".carousel-inner").html(imageHtml);
        });
    }

  
    $(window).on('resize',function(){

        renderHtml();
    }).trigger('resize');


    var startX = 0;
    var moveX =0;
    var distanceX = 0;
    var isMove = false;

    $('.wjs_banner').on('touchstart',function(e){

        startX = e.originalEvent.touches[0].clientX;
    });
    $('.wjs_banner').on('touchmove',function(e){
        moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX-startX;
        isMove = true;
        console.log(distanceX);
    });
    $('.wjs_banner').on('touchend',function(e){

        if(Math.abs(distanceX) > 50 && isMove){
            if(distanceX < 0){

                $('.carousel').carousel('next');/*bootstrap*/
            }else{

                $('.carousel').carousel('prev');/*bootstrap*/
            }
        }


        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;
    });

}

function initTabs(){

    var ul = $('.wjs_product .nav-tabs');
    var lis = ul.find('li');

    var width = 0;

    $.each(lis,function(i,o){

        width += $(o).innerWidth();
    })
    ul.width(width);

    itcast.iScroll({
        swipeDom:$('.wjs_product_tabsParent').get(0),
        swipeType:'x',
        swipeDistance:50
    });

}