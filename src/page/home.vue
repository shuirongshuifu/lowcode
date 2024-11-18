<template>
  <div class="boxbox" ref="boxbox">
    <div class="tool">
      <el-collapse style="width: 100%" v-model="activeNames">
        <el-collapse-item v-for="item in toolArr" :title="item.label" :name="item.label">
          <template #title>
            <span style="font-weight: 600">{{ item.emoji }} {{ item.label }}</span>
          </template>
          <template v-if="item.type == 'myText'">
            <div
              class="mt-2"
              style="border: 1px solid #e9e9e9; padding: 2px; cursor: move"
              draggable="true"
              :data-type="item.type"
            >
              普通文本
            </div>
          </template>
          <template v-if="item.type == 'myImg'">
            <img
              draggable="true"
              style="width: 100%; cursor: move"
              class="mb-6"
              :data-type="item.type"
              v-for="img in item.imgList"
              :src="img"
            />
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
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
      <!-- <myCrop :container="container" /> -->
    </div>
    <div class="attrs">
      <template v-if="conf[curIndex].type == 'myText'">
        <h3 class="mb-4">文字属性设置</h3>
        <el-form :model="conf[curIndex].style" label-width="auto">
          <el-form-item label="文字内容">
            <el-input
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              v-model="conf[curIndex].style.textVal"
            />
          </el-form-item>
          <el-form-item label="文字层级">
            <el-input-number
              v-model="conf[curIndex].style.zIndex"
              :min="1"
              :max="99999"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="文字大小">
            <el-input-number
              v-model="conf[curIndex].style.fontSize"
              :min="10"
              :max="64"
            />
          </el-form-item>
          <el-form-item label="文字颜色">
            <el-color-picker v-model="conf[curIndex].style.color" />
          </el-form-item>
          <el-form-item label="文字背景色">
            <el-color-picker v-model="conf[curIndex].style.backgroundColor" />
          </el-form-item>
          <el-form-item label="文字粗细">
            <el-select v-model="conf[curIndex].style.fontWeight" placeholder="Select">
              <el-option
                v-for="item in fontWeightList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文字字体">
            <el-select v-model="conf[curIndex].style.fontFamily" placeholder="Select">
              <el-option
                v-for="item in fontFamilyList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文字风格">
            <el-select v-model="conf[curIndex].style.fontStyle" placeholder="Select">
              <el-option
                v-for="item in ['normal', 'italic']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文字方向">
            <el-select v-model="conf[curIndex].style.writingMode" placeholder="Select">
              <el-option
                v-for="item in ['horizontal-tb', 'vertical-lr']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文字间距">
            <el-input-number
              v-model="conf[curIndex].style.letterSpacing"
              :min="0"
              :max="60"
            />
          </el-form-item>
          <el-form-item label="字母间距">
            <el-input-number
              v-model="conf[curIndex].style.wordSpacing"
              :min="0"
              :max="60"
            />
          </el-form-item>
          <el-form-item label="行间距">
            <el-input-number
              v-model="conf[curIndex].style.lineHeight"
              :min="0"
              :max="10"
              :step="0.1"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="delFn" style="width: 100%" type="warning"
              >删除组件</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template v-if="conf[curIndex].type == 'myImg'">
        <h3 class="mb-4">图片属性设置</h3>
        <el-form :model="conf[curIndex].style" label-width="auto">
          <el-form-item label="图片层级">
            <el-input-number
              v-model="conf[curIndex].style.zIndex"
              :min="1"
              :max="99999"
              :step="1"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="delFn" style="width: 100%" type="warning"
              >删除组件</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import myCrop from "./com/myCrop.vue";
import myImg from "./com/myImg.vue";
import myText from "./com/myText.vue";
import { defaultDragInfo, defaultTextStyle, defaultImgStyle } from "./default.js";
import { cloneDeep } from "lodash";
import { fontWeightList, fontFamilyList } from "./enum.js";

const activeNames = ref(["1"]);

const container = ref(null); // 容器dom
const boxbox = ref(null); // 工具栏dom

const toolArr = [
  {
    label: "文字",
    emoji: "🗒️",
    type: "myText",
  },
  {
    label: "图片",
    emoji: "🖼️",
    type: "myImg",
    imgList: [
      "http://ashuai.work/static/img/avantar.png",
      "http://ashuai.work/api/tree.png",
      "http://ashuai.work/api/ca.png",
    ],
  },
  //   {
  //     label: "形状",
  //     type: "shape",
  //   },
];

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
  //   {
  //     type: "myImg",
  //     dragInfo: { ...defaultDragInfo },
  //     style: { ...defaultImgStyle },
  //   },
]);

watch(
  () => conf,
  (newVal, oldVal) => {
    console.log("newVal", newVal);
  },
  {
    deep: true,
  }
);

onMounted(() => {
  initDrag();
});

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
  curDom.value.parentNode.removeChild(curDom.value);
};

const curLeftDrag = ref(null);
const initDrag = () => {
  // 拖拽开始事件
  boxbox.value.ondragstart = (e) => {
    // 更改拖动时候的鼠标状态
    e.dataTransfer.effectAllowed = "move";
    curLeftDrag.value = e.target;
  };
  // 把拖拽的东西，拖拽到那个元素之上（触发频繁）
  boxbox.value.ondragover = (e) => {
    e.preventDefault(); // 允许元素被拖拽放上去
    // console.log('ondragover', e.target);
  };
  // 像鼠标移入事件 只触发一次，也可以拿到拖拽到那个元素之上
  boxbox.value.ondragenter = (e) => {
    // console.log('ondragenter', e.target);
  };
  // 拖拽完成放手之后，在那个元素上放手的
  boxbox.value.ondrop = (e) => {
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
.boxbox {
  min-height: 95vh;
  display: flex;
  width: 100%;

  .tool {
    height: 800px;
    width: 150px;
    margin-right: 12px;

    .tItem {
      margin: 12px 0;
      font-weight: 600;
      cursor: move;
    }
  }

  .container {
    /* 确保子元素可以相对于此容器定位 */
    position: relative;
    height: 800px;
    border: 1px solid #e9e9e9;
    background-color: #fff;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
    overflow: hidden;
    flex: 1;
  }

  .attrs {
    padding: 0 12px;
    width: 240px;
    text-align: center;
  }
}
</style>
