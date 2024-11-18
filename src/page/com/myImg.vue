<template>
  <img
    @click="chooseFn"
    :src="style.imgSrc"
    tabindex="0"
    :style="style"
    class="imgBg"
    ref="imgBg"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";

const emits = defineEmits(["chooseFn"]);
const props = defineProps(["container", "dragInfo", "style", "index"]); // 容器dom
const imgBg = ref(null); // 背景图dom

const chooseFn = () => {
  emits("chooseFn", props, imgBg.value);
};

watch(
  () => props.container,
  () => {
    setDomCanDrag(imgBg.value, props.dragInfo);
    setDomCanZoom(imgBg.value, props.dragInfo);
    transformFn(imgBg.value, props.dragInfo);
  }
);

onMounted(() => {
  if (!props.container) {
    return;
  }
  setDomCanDrag(imgBg.value, props.dragInfo);
  setDomCanZoom(imgBg.value, props.dragInfo);
  transformFn(imgBg.value, props.dragInfo);
});

// 设置某个元素可拖拽移动
const setDomCanDrag = (dom, info) => {
  let containerRect;
  dom.addEventListener("mousedown", (e) => {
    info.isTargetDrag = true;
    e.preventDefault(); // 阻止默认行为，比如选中文本
    // 记录鼠标点击时的初始位置
    info.startX = e.clientX;
    info.startY = e.clientY;
    // 获取容器边界信息并存储
    containerRect = props.container.getBoundingClientRect();
    // 更新上次拖动结束的位置为当前初始位置
    info.currentX = info.lastDragEndX;
    info.currentY = info.lastDragEndY;
  });

  props.container.addEventListener("mousemove", (e) => {
    if (e.target !== dom) return;
    if (!info.isTargetDrag) return;
    // 根据鼠标移动的偏移量来更新当前位置
    info.currentX = info.lastDragEndX + (e.clientX - info.startX);
    info.currentY = info.lastDragEndY + (e.clientY - info.startY);
    // 使用transform来更新位置和缩放
    transformFn(dom, info);
  });

  props.container.addEventListener("mouseup", () => {
    info.isTargetDrag = false;
    // 记录上次拖动结束的位置
    info.lastDragEndX = info.currentX;
    info.lastDragEndY = info.currentY;
  });
};

// 启用鼠标滚轮缩放功能
const setDomCanZoom = (dom, info) => {
  dom.addEventListener("wheel", (e) => {
    e.preventDefault();
    // 缩放比例调整
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    info.scale = Math.min(Math.max(info.scale + delta, 0.25), 4); // 限制缩放范围在 0.25 到 4 之间
    // 更新 transform
    transformFn(dom, info);
  });
};

const transformFn = (dom, info) => {
  dom.style.transform = `translate(${info.currentX}px, ${info.currentY}px) scale(${info.scale})`;
};
</script>

<style lang="less" scoped>
.imgBg {
  position: absolute;
  /* 使图片可以相对于容器定位 */
  transform-origin: center center;
  /* 设置缩放的中心点 */
  cursor: move;
}
.imgBg:active {
  outline: 3px dashed blue;
  outline-offset: 5px;
}
</style>
