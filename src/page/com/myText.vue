<template>
  <div
    class="targetDom"
    :style="styleComputed"
    ref="targetDom"
    @click="chooseFn"
    @input="inputFn"
    @keydown="handleKeydown"
    contenteditable="true"
  >
    {{ style.textVal }}
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";

const emits = defineEmits(["chooseFn", "inputFn"]);
const props = defineProps(["container", "dragInfo", "style", "index"]);
const targetDom = ref(null);

const chooseFn = () => {
  emits("chooseFn", props, targetDom.value);
};
const inputFn = (e) => {
  emits("inputFn", props, e.target.innerText);
};

const handleKeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // 阻止默认行为，不允许换行
  }
};

watch(
  () => props.container,
  () => {
    setDomCanDrag(targetDom.value, props.dragInfo);
    transformFn(targetDom.value, props.dragInfo);
  }
);

onMounted(() => {
  if (!props.container) {
    return;
  }
  setDomCanDrag(targetDom.value, props.dragInfo);
  transformFn(targetDom.value, props.dragInfo);
});

// 针对于文字样式的处理
const styleComputed = computed(() => {
  props.style.fontSize ? (props.style.fontSize = props.style.fontSize + "px") : null;
  props.style.letterSpacing
    ? (props.style.letterSpacing = props.style.letterSpacing + "px")
    : null;
  props.style.wordSpacing
    ? (props.style.wordSpacing = props.style.wordSpacing + "px")
    : null;
  return props.style;
});

// 设置某个元素可拖拽移动
const setDomCanDrag = (dom, info) => {
  let containerRect;
  dom.addEventListener("mousedown", (e) => {
    info.isTargetDrag = true;
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

/**
 * 更改位置
 * */
// setTimeout(() => {
//     dragInfo.currentX = 100
//     dragInfo.currentY = 100
//     dragInfo.lastDragEndX = 100
//     dragInfo.lastDragEndY = 100
//     transformFn(targetDom.value, dragInfo)
// }, 2000);
const transformFn = (dom, info) => {
  dom.style.transform = `translate(${info.currentX}px, ${info.currentY}px) scale(${info.scale})`;
};
</script>

<style lang="less" scoped>
.targetDom {
  position: absolute;
  transform-origin: center center;
  cursor: move;
  outline: none;
}

.targetDom:active {
  outline: 3px dashed blue;
  outline-offset: 5px;
}
</style>
