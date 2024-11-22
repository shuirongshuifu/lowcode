<template>
  <div class="dragBoxWrap" ref="dragBoxWrap">
    <div class="leftContent">
      <leftCom />
    </div>
    <div class="mainContent">
      <div class="container" ref="container" id="container">
        <template v-for="(item, index) in conf">
          <component
            :is="item.type"
            :index="index"
            :dragInfo="item.dragInfo"
            :style="item.style"
            :container="container"
            @chooseFn="chooseFn"
            @inputFn="inputFn"
          >
          </component>
        </template>
      </div>
    </div>
    <div class="rightContent">
      <template v-if="conf[curIndex]?.type == 'myText'">
        <textSet :confItem="conf[curIndex]" @delFn="delFn" />
      </template>
      <template v-if="conf[curIndex]?.type == 'myImg'">
        <imgSet :curDom="curDom" :confItem="conf[curIndex]" @delFn="delFn" />
      </template>
    </div>
    <cropBox />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import myImg from "@/components/myImg.vue";
import myText from "@/components/myText.vue";
import cropBox from "@/components/cropBox.vue";
import leftCom from "./com/leftCom/leftCom.vue";
import textSet from "./com/rightCom/textSet.vue";
import imgSet from "./com/rightCom/imgSet.vue";
import { cloneDeep } from "lodash";
import { defaultDragInfo, defaultTextStyle, defaultImgStyle } from "./data.js";

const container = ref(null); // 容器dom
const dragBoxWrap = ref(null); // 总拖拽dom

defineOptions({
  name: "MyForm",
  components: { myImg, myText },
});

const conf = reactive([
  {
    type: "myText",
    dragInfo: { ...defaultDragInfo },
    style: { ...defaultTextStyle },
  },
  {
    type: "myImg",
    dragInfo: { ...defaultDragInfo },
    style: { ...defaultImgStyle },
  },
]);

const curIndex = ref(0);
const curDom = ref(null);

const chooseFn = (val, dom) => {
  curIndex.value = val.index;
  curDom.value = dom;
};

const inputFn = (val, textVal) => {
  let index = val.index;
  conf[index].style.textVal = textVal;
};

const delFn = () => {
  conf.splice(curIndex.value, 1);
  curIndex.value = -1;
  curDom.value = null;
};

onMounted(() => {
  initDrag();
});

const curLeftDrag = ref(null);
const initDrag = () => {
  // 拖拽开始事件
  dragBoxWrap.value.ondragstart = (e) => {
    // 更改拖动时候的鼠标状态
    e.dataTransfer.effectAllowed = "move";
    curLeftDrag.value = e.target;
  };
  // 把拖拽的东西，拖拽到那个元素之上（触发频繁）
  dragBoxWrap.value.ondragover = (e) => {
    e.preventDefault(); // 允许元素被拖拽放上去
  };
  // 像鼠标移入事件 只触发一次，也可以拿到拖拽到那个元素之上
  dragBoxWrap.value.ondragenter = (e) => {
    // console.log('ondragenter', e.target);
  };
  // 拖拽完成放手之后，在那个元素上放手的
  dragBoxWrap.value.ondrop = (e) => {
    if (!isCurDomInContainer(e.target)) return;
    if (curLeftDrag.value.dataset["type"] == "myText") {
      conf.push({
        type: "myText",
        dragInfo: { ...getDragInfoRelativeToContainer(e) },
        style: { ...defaultTextStyle },
      });
    }
    if (curLeftDrag.value.dataset["type"] == "myImg") {
      conf.push({
        type: "myImg",
        dragInfo: { ...getDragInfoRelativeToContainer(e) },
        style: {
          ...defaultImgStyle,
          imgSrc: curLeftDrag.value.src,
        },
      });
    }
  };
};

// 获取当前拖拽的元素，相对于容器的坐标位置
const getDragInfoRelativeToContainer = (e) => {
  const bRect = container.value.getBoundingClientRect();
  const aClientX = e.clientX;
  const aClientY = e.clientY;
  const aRelativeX = aClientX - bRect.left;
  const aRelativeY = aClientY - bRect.top;
  let dragInfo = cloneDeep(defaultDragInfo);
  dragInfo.currentX = aRelativeX;
  dragInfo.currentY = aRelativeY;
  dragInfo.lastDragEndX = aRelativeX;
  dragInfo.lastDragEndY = aRelativeY;
  return dragInfo;
};

// 当前拖拽的元素是否在container容器中
const isCurDomInContainer = (element) => {
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    if (currentElement.id === "container") {
      return true;
    }
    currentElement = currentElement.parentElement;
  }
  return false;
};
</script>

<style lang="less" scoped>
.dragBoxWrap {
  min-height: 95vh;
  display: flex;
  width: 100%;

  .leftContent {
    height: 800px;
    width: 150px;
    margin-right: 12px;
  }

  .mainContent {
    flex: 1;
    min-width: 800px;
    min-height: 800px;

    .container {
      position: relative;
      height: 800px;
      border: 1px solid #e9e9e9;
      background-color: #fff;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
      overflow: hidden;
    }
  }

  .rightContent {
    padding: 0 12px;
    width: 250px;
    text-align: center;
  }
}
</style>
