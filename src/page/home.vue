<template>
  <div class="dragBoxWrap" ref="dragBoxWrap">
    <div class="leftContent">
      <leftCom />
    </div>
    <div class="mainContent">
      <div class="container" ref="container" id="container">
        <template v-for="(item, index) in conf">
          <component
            ref="childRefs"
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
      <div v-show="conf.length > 0">
        <el-button class="dBtn1" type="success" @click="seeData">查看配置数据</el-button>
        <el-button class="dBtn2" type="success" @click="calFn">计算相对位置</el-button>
      </div>
    </div>
    <!-- <cropBox /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import myImg from "@/components/myImg.vue";
import myText from "@/components/myText.vue";
import cropBox from "@/components/cropBox.vue";
import leftCom from "./com/leftCom/leftCom.vue";
import textSet from "./com/rightCom/textSet.vue";
import imgSet from "./com/rightCom/imgSet.vue";
import { cloneDeep } from "lodash";
import { defaultDragInfo, defaultTextStyle, defaultImgStyle } from "./data.js";

import certificate from "@/assets/img/certificate.png";
import zhang from "@/assets/img/zhang.png";
import avantar from "@/assets/img/avantar.png";

const container = ref(null); // 容器dom
const dragBoxWrap = ref(null); // 总拖拽dom

const childRefs = ref([]);

defineOptions({
  name: "MyForm",
  components: { myImg, myText },
});

let conf = reactive([]);

onMounted(() => {
  initConf();
});

let jsonData = [
  {
    type: "myImg",
    dragInfo: {
      isTargetDrag: false,
      startX: 654,
      startY: 343,
      currentX: 102.39999389648438,
      currentY: 89.80000305175781,
      lastDragEndX: 102.39999389648438,
      lastDragEndY: 89.80000305175781,
      scale: 1,
      rotate: -360,
      scaleX: 1,
      scaleY: 1,
    },
    style: { zIndex: 1, imgSrc: certificate },
  },
  {
    type: "myImg",
    dragInfo: {
      isTargetDrag: false,
      startX: 858,
      startY: 454,
      currentX: 539.3999938964844,
      currentY: 324.9250030517578,
      lastDragEndX: 539.3999938964844,
      lastDragEndY: 324.9250030517578,
      scale: 1,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    },
    style: { zIndex: 1, imgSrc: zhang },
  },
  {
    type: "myText",
    dragInfo: {
      isTargetDrag: false,
      startX: 646,
      startY: 326,
      currentX: 378.3999938964844,
      currentY: 304.8000030517578,
      lastDragEndX: 378.3999938964844,
      lastDragEndY: 304.8000030517578,
      scale: 1,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    },
    style: {
      zIndex: 2,
      fontSize: 24,
      color: "#363636",
      backgroundColor: "rgba(0,0,0,0)",
      fontWeight: 700,
      textVal: "恭喜获奖666",
      fontFamily: "幼圆",
      fontStyle: "normal",
      letterSpacing: 1,
      wordSpacing: 1,
      lineHeight: 1,
      writingMode: "horizontalTb",
    },
  },
  {
    type: "myImg",
    dragInfo: {
      isTargetDrag: false,
      startX: 406,
      startY: 513,
      currentX: 38.399993896484375,
      currentY: 350.6499938964844,
      lastDragEndX: 38.399993896484375,
      lastDragEndY: 350.6499938964844,
      scale: 0.20000000000000015,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    },
    style: { zIndex: 1, imgSrc: avantar },
  },
];
const initConf = () => {
  conf.push(...jsonData);
  // conf.value.push(...[
  //   {
  //     type: "myText",
  //     dragInfo: { ...defaultDragInfo },
  //     style: { ...defaultTextStyle },
  //   },
  //   {
  //     type: "myImg",
  //     dragInfo: { ...defaultDragInfo },
  //     style: { ...defaultImgStyle },
  //   },
  // ])
};

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
  // curDom.value.parentNode.removeChild(curDom.value)
  conf.splice(curIndex.value, 1);
  curIndex.value = -1;
  curDom.value = null;

  nextTick(() => {
    childRefs.value.forEach((childRef, index) => {
      if (childRef) {
        childRef.reCalPosition();
      }
    });
  });
};

onMounted(() => {
  initDrag();
});

const curLeftDrag = ref(null);
const curLeftDragRelative = reactive({});
const initDrag = () => {
  // 拖拽开始事件
  dragBoxWrap.value.ondragstart = (e) => {
    // 更改拖动时候的鼠标状态
    e.dataTransfer.effectAllowed = "move";
    curLeftDrag.value = e.target;
    getCurRelative(curLeftDrag.value, e);
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

// 假设只有一个图片，一个文字
const calFn = () => {
  /**
   * 1. 拿到主要参照物底图，层级最低的图片
   * 2. 把剩余的元素拿出来依次对比，计算出相对位置
   * */
  let canvasDom = document.querySelector(".imgBg");
  let tarDom = document.querySelector(".targetDom");
  let canvasDomRect = canvasDom.getBoundingClientRect();
  let tarDomRect = tarDom.getBoundingClientRect();
  let leftPos = tarDomRect.left - canvasDomRect.left;
  let topPos = tarDomRect.top - canvasDomRect.top;
  console.log("-文字相对位置-", leftPos, topPos);
};

function getRelativePosition(domA, domB) {
  // 获取domA的位置
  const rectA = domA.getBoundingClientRect();
  // 获取domB的位置
  const rectB = domB.getBoundingClientRect();
  // 计算domB相对于domA的位置
  const relativeX = rectB.left - rectA.left;
  const relativeY = rectB.top - rectA.top;
  return { x: relativeX, y: relativeY };
}

// 获取当前拖拽的元素，相对于容器的坐标位置
const getDragInfoRelativeToContainer = (e) => {
  const bRect = container.value.getBoundingClientRect();
  const aClientX = e.clientX;
  const aClientY = e.clientY;
  const aRelativeX = aClientX - bRect.left - curLeftDragRelative.left;
  const aRelativeY = aClientY - bRect.top - curLeftDragRelative.top;
  let dragInfo = cloneDeep(defaultDragInfo);
  dragInfo.currentX = aRelativeX;
  dragInfo.currentY = aRelativeY;
  dragInfo.lastDragEndX = aRelativeX;
  dragInfo.lastDragEndY = aRelativeY;
  return dragInfo;
};

// 拖拽时刻鼠标相对于图片或文字的top和left的值
const getCurRelative = (curDom, e) => {
  const bRect = curDom.getBoundingClientRect();
  const aClientX = e.clientX;
  const aClientY = e.clientY;
  const aRelativeX = aClientX - bRect.left;
  const aRelativeY = aClientY - bRect.top;
  curLeftDragRelative.left = aRelativeX;
  curLeftDragRelative.top = aRelativeY;
  console.log("curLeftDragRelative", curLeftDragRelative);
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

const seeData = () => {
  console.log(JSON.stringify(conf));
};
</script>

<style lang="less" scoped>
.dragBoxWrap {
  min-height: 95vh;
  display: flex;
  width: 100%;

  .leftContent {
    height: 800px;
    width: 180px;
    margin-right: 12px;
  }

  .mainContent {
    flex: 1;
    display: flex;
    justify-content: center;

    .container {
      position: relative;
      height: 640px;
      width: 960px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
      overflow: hidden;
      z-index: 1;
    }
  }

  .rightContent {
    padding: 0 12px;
    width: 250px;
    text-align: center;
    .dBtn1 {
      width: 100%;
    }
    .dBtn2 {
      width: 100%;
      margin: 0;
      margin-top: 16px;
    }
  }
}
</style>
