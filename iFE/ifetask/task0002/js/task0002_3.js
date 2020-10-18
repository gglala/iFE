// 将图片排列成一排，一起向左运动，每次运动的距离刚好是一张图片的宽度。

// 对于下面的小圆点，使用事件代理，将事件传递给每个 a 标签。


var imgListDiv = $(".img-list");
var timerInner = null;
var timer = null;
var activeID = 1; // 默认选中第一个
var nextID = 0;
var imageWidth = $("img").offsetWidth; // offsetWidth 是一个只读属性，返回一个元素的 border-box 宽度
var circleArr = $(".circle").getElementsByTagName('a');
var intervalTime = 3000;

for (var i = 0; i < circleArr.length; i++) {
    circleArr[i].index = i + 1; // DOM节点对象也是对象，给对象添加一个 index 属性
}

/**
 * 里层轮播
 * @param {*} target 
 */
function startMove(target) {
    clearInterval(timerInner);
    timerInner = setInterval(function () {
        // 变速运动 速度=(目标值-当前值)/缩放系数
        var speed = (target - imgListDiv.offsetLeft) / 6;

        // 当 target==imgListDiv.offsetLeft 时，speed=0，left值不再改变，移动完成，可以把内层计时器取消
        if(speed == 0) clearInterval(timerInner)

        // 像素不能是小数，所以速度大于0的时候，向上取整。速度小于0时，向下取整
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

        // offsetLeft 和 style.left 是相同的属性，只不过一个是在赋值时使用，一个是在取值时使用
        imgListDiv.style.left = imgListDiv.offsetLeft + speed + "px";
    }, 30);
}

/**
 * 外层轮播
 * @param {*} clickID 
 */
function rotate(clickID) {
    // 自动轮播时，不传入 clickID；点击时会传入 clickID
    if (clickID) {
        nextID = clickID;
    } else {
        nextID = activeID <= 4 ? activeID + 1 : 1;
    }

    // 添加 active 类 （圆点颜色）
    removeClass(circleArr[activeID - 1], "active");
    addClass(circleArr[nextID - 1], "active");

    // 计算应该左移的距离
    startMove(-(nextID - 1) * imageWidth);
    activeID = nextID;
}

timer = setInterval(rotate, intervalTime);

// 给链接添加代理事件
$.delegate(".circle", "a", "click", function () {
    // 先停掉自动轮播的计时器
    clearInterval(timer);
    var clickID = this.index;
    rotate(clickID);
    timer = setInterval(rotate, intervalTime); // 重新设置计时器
});