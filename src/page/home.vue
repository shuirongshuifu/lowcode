<template>
    <div class="boxbox" ref="boxbox">
        <div class="tool">
            <div draggable="true" class="tItem" v-for="item in toolArr">
                {{ item.label }}
            </div>
        </div>
        <div class="container" ref="container">
            <template v-for="(item, index) in conf">
                <component :is="item.type" :index="index" :dragInfo="item.dragInfo" :style="item.style"
                    :container="container" @chooseFn="chooseFn" @inputFn="inputFn">
                </component>
            </template>
            <myCrop :container="container" />
        </div>
        <div class="attrs">
            <template v-if="conf[curIndex].type == 'myText'">
                <h3 class="mb-4">文字属性设置</h3>
                <el-form :model="conf[curIndex].style" label-width="auto">
                    <el-form-item label="文字内容">
                        <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"
                            v-model="conf[curIndex].style.textVal" />
                    </el-form-item>
                    <el-form-item label="文字层级">
                        <el-input-number v-model="conf[curIndex].style.zIndex" :min="1" :max="99999" :step="1" />
                    </el-form-item>
                    <el-form-item label="文字大小">
                        <el-input-number v-model="conf[curIndex].style.fontSize" :min="10" :max="64" />
                    </el-form-item>
                    <el-form-item label="文字颜色">
                        <el-color-picker v-model="conf[curIndex].style.color" />
                    </el-form-item>
                    <el-form-item label="文字背景色">
                        <el-color-picker v-model="conf[curIndex].style.backgroundColor" />
                    </el-form-item>
                    <el-form-item label="文字粗细">
                        <el-select v-model="conf[curIndex].style.fontWeight" placeholder="Select">
                            <el-option v-for="item in [100, 200, 300, 400, 500, 600, 700]" :key="item" :label="item"
                                :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文字字体">
                        <el-select v-model="conf[curIndex].style.fontFamily" placeholder="Select">
                            <el-option
                                v-for="item in ['微软雅黑', '黑体', '宋体', '仿宋', '楷体', '幼圆', 'Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia']"
                                :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文字风格">
                        <el-select v-model="conf[curIndex].style.fontStyle" placeholder="Select">
                            <el-option v-for="item in ['normal', 'italic']" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文字间距">
                        <el-input-number v-model="conf[curIndex].style.letterSpacing" :min="0" :max="60" />
                    </el-form-item>
                    <el-form-item label="字母间距">
                        <el-input-number v-model="conf[curIndex].style.wordSpacing" :min="0" :max="60" />
                    </el-form-item>
                    <el-form-item label="行间距">
                        <el-input-number v-model="conf[curIndex].style.lineHeight" :min="0" :max="10" :step="0.1" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="delFn" style="width: 100%;" type="warning">删除组件</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-if="conf[curIndex].type == 'myImg'">
                <h3 class="mb-4">图片属性设置</h3>
                <el-form :model="conf[curIndex].style" label-width="auto">
                    <el-form-item label="图片层级">
                        <el-input-number v-model="conf[curIndex].style.zIndex" :min="1" :max="99999" :step="1" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="delFn" style="width: 100%;" type="warning">删除组件</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import myCrop from "./com/myCrop.vue";
import myImg from "./com/myImg.vue";
import myText from "./com/myText.vue";

/*
拖拽细分
工程化组件化细分
*/ 

const container = ref(null); // 容器dom
const boxbox = ref(null); // 工具栏dom

const toolArr = [
    {
        label: '文字',
        type: 'word'
    },
    {
        label: '图片',
        type: 'pic'
    },
    {
        label: '形状',
        type: 'shape'
    },
]

defineOptions({
    name: 'MyForm',
    components: { myImg, myText }
})

// 默认的拖拽信息数据
const defaultDragInfo = {
    isTargetDrag: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastDragEndX: 0,
    lastDragEndY: 0,
    scale: 1,
}

const defaultTextStyle = {
    zIndex: 1,
    fontSize: 60,
    color: '#363636',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 400,
    textVal: '你好，这个世界，hello world',
    fontFamily: '微软雅黑',
    fontStyle: 'normal',
    letterSpacing: 1,
    wordSpacing: 1,
    lineHeight: 1.25,
}

const conf = reactive([
    {
        type: 'myText',
        dragInfo: { ...defaultDragInfo },
        style: { ...defaultTextStyle }
    },
    {
        type: 'myImg',
        dragInfo: { ...defaultDragInfo },
        style: {
            // 默认图片样式
            zIndex: 1,
        }
    },
])

onMounted(() => {
    initDrag()
})

const curIndex = ref(0)
const curDom = ref(null)
const chooseFn = (val, dom) => {
    curIndex.value = val.index
    curDom.value = dom
}
const inputFn = (val, textVal) => {
    let index = val.index
    conf[index].style.textVal = textVal
}

const delFn = () => {
    curDom.value.parentNode.removeChild(curDom.value)
}

const initDrag = () => {
    // 拖拽开始事件
    boxbox.value.ondragstart = (e) => {
        // 更改拖动时候的鼠标状态
        e.dataTransfer.effectAllowed = 'move'
        console.log('ondragstart', e.target);
    }
    // 把拖拽的东西，拖拽到那个元素之上（触发频繁）
    boxbox.value.ondragover = (e) => {
        e.preventDefault() // 允许元素被拖拽放上去
        // console.log('ondragover', e.target);
    }
    // 像鼠标移入事件 只触发一次，也可以拿到拖拽到那个元素之上
    boxbox.value.ondragenter = (e) => {
        // console.log('ondragenter', e.target);
    }
    // 拖拽完成放手之后，在那个元素上放手的
    boxbox.value.ondrop = (e) => {
        if (e.target.classList.contains('imgBg') || e.target.classList.contains('container')) {
            conf.push({
                type: 'myText',
                dragInfo: { ...defaultDragInfo },
                style: { ...defaultTextStyle }
            },)
        }
    }
}
</script>

<style lang="less" scoped>
.boxbox {
    min-height: 95vh;
    display: flex;

    .tool {
        height: 800px;
        width: 108px;
        margin-right: 12px;
        border: 2px solid #e9e9e9;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 0;

        .tItem {
            margin: 12px 0;
            font-weight: 600;
            cursor: move;
        }
    }

    .container {
        position: relative;
        /* 确保子元素可以相对于此容器定位 */
        width: 1200px;
        height: 800px;
        border: 1px solid #e9e9e9;
        background-color: #fff;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
        overflow: hidden;
    }

    .attrs {
        padding: 0 12px;
    }
}
</style>
