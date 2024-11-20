<template>
    <div @dblclick="chooseFn" class="cropBox" ref="cropBox">
        <!-- 左上方 -->
        <div class="resize-handle nw"></div>
        <!-- 右上方 -->
        <div class="resize-handle ne"></div>
        <!-- 左下方 -->
        <div class="resize-handle sw"></div>
        <!-- 右下方 -->
        <div class="resize-handle se"></div>
        <!-- 数据 -->
        <span class="val">宽{{ CropBoxInfo.currentWidth }} 高{{ CropBoxInfo.currentHeight }}</span>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import html2canvas from "html2canvas";

const chooseFn = ()=>{
  takeScreenshot()
}

function takeScreenshot() {
  // var element = document.querySelector(".cropBox");
  var element = document.querySelector(".container");
  html2canvas(element)
    .then(function (canvas) {
      var imDataURL = canvas.toDataURL("image/png");
      downloadImage(imDataURL)
      // console.log('imDataURL', imDataURL);
      // window.open(imDataURL, "_blank");
    })
    .catch(function (error) {
      console.error("Error while taking screenshot:", error);
    });
}

function downloadImage(dataURL, fileName = 'screenshot.png') {
            // 创建隐藏的可下载链接
            var downloadLink = document.createElement("a");
            downloadLink.href = dataURL;
            downloadLink.download = fileName; // 设置默认文件名
            // 隐藏链接
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            // 触发点击
            downloadLink.click();
            // 稍后移除链接
            setTimeout(function () {
                document.body.removeChild(downloadLink);
            }, 0);
        }

const props = defineProps(['container']) // 容器dom

const cropBox = ref(null); // 裁剪框

const CropBoxInfo = reactive({
    isDragging: false, // 是否在拖动裁剪框
    isResizing: false, // 是否在调整裁剪框大小
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastDragEndX: 0, // 上次拖动结束时的X坐标
    lastDragEndY: 0, // 上次拖动结束时的Y坐标
    initialWidth: 100, // 初始宽度
    initialHeight: 100, // 初始高度
    currentWidth: 100, // 当前宽度
    currentHeight: 100, // 当前高度
    resizeHandle: '' // 当前调整大小的手柄
});

watch(() => props.container, () => {
    // setCropBox(cropBox.value, CropBoxInfo);
})

setTimeout(() => {
  setCropBox(cropBox.value, CropBoxInfo);
}, 1000);

// 设置裁剪框可拖动和调整大小
const setCropBox = (dom, info) => {

    let containerRect;

    const updateCropBox = () => {
        dom.style.transform = `translate(${info.currentX}px, ${info.currentY}px)`;
        dom.style.width = `${info.currentWidth}px`;
        dom.style.height = `${info.currentHeight}px`;
    };

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('resize-handle')) {
            info.isResizing = true;
            info.resizeHandle = e.target.classList[1];
        } else {
            info.isDragging = true;
        }
        e.preventDefault();
        info.startX = e.clientX;
        info.startY = e.clientY;
        containerRect = props.container.getBoundingClientRect();
        // containerRect = document.querySelector('#app').getBoundingClientRect();
        info.currentX = info.lastDragEndX;
        info.currentY = info.lastDragEndY;
        info.currentWidth = info.initialWidth;
        info.currentHeight = info.initialHeight;
    };

    const handleMouseMove = (e) => {
        if (info.isDragging) {
            info.currentX = info.lastDragEndX + (e.clientX - info.startX);
            info.currentY = info.lastDragEndY + (e.clientY - info.startY);
            updateCropBox();
        } else if (info.isResizing) {
            const dx = e.clientX - info.startX;
            const dy = e.clientY - info.startY;
            switch (info.resizeHandle) {
                case 'nw':
                    info.currentX = info.lastDragEndX + dx;
                    info.currentY = info.lastDragEndY + dy;
                    info.currentWidth = info.initialWidth - dx;
                    info.currentHeight = info.initialHeight - dy;
                    break;
                case 'ne':
                    info.currentY = info.lastDragEndY + dy;
                    info.currentWidth = info.initialWidth + dx;
                    info.currentHeight = info.initialHeight - dy;
                    break;
                case 'sw':
                    info.currentX = info.lastDragEndX + dx;
                    info.currentWidth = info.initialWidth - dx;
                    info.currentHeight = info.initialHeight + dy;
                    break;
                case 'se':
                    info.currentWidth = info.initialWidth + dx;
                    info.currentHeight = info.initialHeight + dy;
                    break;
            }
            updateCropBox();
        }
    };

    const handleMouseUp = () => {
        info.isDragging = false;
        info.isResizing = false;
        info.lastDragEndX = info.currentX;
        info.lastDragEndY = info.currentY;
        info.initialWidth = info.currentWidth;
        info.initialHeight = info.currentHeight;
    };

    dom.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};
</script>

<style lang="less" scoped>
.cropBox {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid #67C23A;
    box-sizing: border-box;
    cursor: move;
    z-index: 999999999;

    .val {
        position: absolute;
        font-size: 12px;
        color: #333;
    }

    .resize-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #000;
        cursor: pointer;
    }

    .nw {
        top: -4px;
        left: -4px;
        cursor: nwse-resize;
    }

    .ne {
        top: -4px;
        right: -4px;
        cursor: nesw-resize;
    }

    .sw {
        bottom: -4px;
        left: -4px;
        cursor: nesw-resize;
    }

    .se {
        bottom: -4px;
        right: -4px;
        cursor: nwse-resize;
    }
}
</style>