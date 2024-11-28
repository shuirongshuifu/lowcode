// 判断是手机还是电脑
export function IsPhone() {
    var info = navigator.userAgent;
    var isPhone = /mobile/i.test(info);
    return isPhone;
}

// 移动、缩放、旋转某个dom元素
export function transformDom(dom, info) {
    console.log('位置变化');
    if(!dom) return
    dom.style.transform = `translate(${info.currentX}px, ${info.currentY}px) scale(${info.scale}) rotate(${info.rotate}deg) scaleX(${info.scaleX}) scaleY(${info.scaleY})`;
}