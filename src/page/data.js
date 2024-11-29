import certificate from '@/assets/img/certificate.png'

// 默认拖拽信息配置
export const defaultDragInfo = {
    isTargetDrag: false, // 目标元素是否在拖拽中
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastDragEndX: 0,
    lastDragEndY: 0,
    scale: 1, // 缩放倍数
    rotate: 0, // 旋转角度
    scaleX: 1, // 水平镜像翻转
    scaleY: 1 // 垂直镜像翻转
};

// 默认文本样式
export const defaultTextStyle = {
    zIndex: 2,
    fontSize: 24,
    color: "#363636",
    backgroundColor: "rgba(0,0,0,0)",
    fontWeight: 400,
    textVal: "普通文本",
    fontFamily: "微软雅黑",
    fontStyle: "normal",
    letterSpacing: 1,
    wordSpacing: 1,
    lineHeight: 1,
    writingMode: 'horizontalTb'
};

// 默认图片样式
export const defaultImgStyle = {
    zIndex: 1,
    // imgSrc: 'http://ashuai.work/api/ca.png' // html2canvas只能截取自己的图片，外部图不能截取
    imgSrc: certificate
};