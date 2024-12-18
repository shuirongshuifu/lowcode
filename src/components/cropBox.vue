<template>
  <div class="cropBox" :class="{ isHideBorder: isHideBorder }" id="cropBox">
    <div
      v-for="dot in dotList"
      :class="'resize-handle ' + dot"
      :style="{
        opacity: isHideBorder ? 0 : 1,
      }"
    ></div>
    <span class="val">宽 200 高 200</span>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import html2canvas from "html2canvas";

let dotList = ["nw", "ne", "sw", "se"];

onMounted(() => {
  init();
});

// 截图时，要把边框点点隐藏
const isHideBorder = ref(false);

const init = () => {
  const cropBox = document.getElementById("cropBox");
  const val = cropBox.querySelector(".val");
  const content = document.body;

  let isDragging = false;
  let isResizing = false;
  let startX, startY, startWidth, startHeight, startLeft, startTop, handleClass;

  const updateInfo = (width, height) => {
    val.textContent = `宽 ${Math.round(width)} 高 ${Math.round(height)}`;
  };

  // 开始拖拽或缩放
  cropBox.addEventListener("mousedown", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("resize-handle")) {
      isResizing = true;
      handleClass = e.target.classList[1];
    } else {
      isDragging = true;
    }

    startX = e.clientX;
    startY = e.clientY;

    const rect = cropBox.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left;
    startTop = rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      cropBox.style.left = `${startLeft + dx}px`;
      cropBox.style.top = `${startTop + dy}px`;
    }

    if (isResizing) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch (handleClass) {
        case "nw":
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case "ne":
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case "sw":
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
          break;
        case "se":
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
      }

      if (newWidth > 50) {
        cropBox.style.width = `${newWidth}px`;
        cropBox.style.left = `${newLeft}px`;
      }
      if (newHeight > 50) {
        cropBox.style.height = `${newHeight}px`;
        cropBox.style.top = `${newTop}px`;
      }

      updateInfo(newWidth, newHeight);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
  });

  // 双击触发截图功能
  cropBox.addEventListener("dblclick", () => {
    isHideBorder.value = true;
    nextTick(() => {
      const rect = cropBox.getBoundingClientRect(); // 获取截图区域位置和尺寸
      const scale = window.devicePixelRatio; // 获取设备像素比
      html2canvas(content, { scale }).then((canvas) => {
        const croppedCanvas = document.createElement("canvas");
        const ctx = croppedCanvas.getContext("2d");

        // 设置裁剪画布的尺寸，考虑设备像素比
        /**
         * 图片的实际宽高rect.width、rect.height
         * */
        croppedCanvas.width = rect.width * scale;
        croppedCanvas.height = rect.height * scale;

        console.log("croppedCanvas", croppedCanvas);
        // 在裁剪画布上绘制图片
        ctx.drawImage(
          canvas,
          rect.left * scale, // 裁剪的起始 x 坐标（考虑像素比）
          rect.top * scale, // 裁剪的起始 y 坐标（考虑像素比）
          rect.width * scale, // 裁剪的宽度（像素比）
          rect.height * scale, // 裁剪的高度（像素比）
          0,
          0,
          rect.width * scale, // 绘制到目标画布的宽度
          rect.height * scale // 绘制到目标画布的高度
        );

        isHideBorder.value = false;

        // 导出裁剪后的图片
        croppedCanvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "screenshot.png";
          link.click();
        });
      });
    });
  });
};
</script>

<style>
.cropBox {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 200px;
  height: 200px;
  border: 3px dashed;
  box-sizing: border-box;
  cursor: move;
  z-index: 9999;
  box-sizing: border-box;
  border-color: #67c23a;
  transition: border-color 1.2s;
}

.isHideBorder {
  border-color: rgba(0, 0, 0, 0);
}

.val {
  position: absolute;
  font-size: 12px;
  color: #fff;
  top: -22px;
  right: 5px;
  background-color: #999;
  padding: 1px 4px;
  box-sizing: border-box;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #333;
  cursor: pointer;
  border-radius: 50%;
  opacity: 1;
  transition: opacity 1.2s;
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

.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
