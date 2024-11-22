<template>
  <el-form :model="confItem.style" label-width="auto">
    <el-form-item label="图片">
      <el-image style="width: 72px; height: 72px" :src="confItem.style.imgSrc" />
    </el-form-item>
    <el-form-item label="位置">
      <div style="margin-right: 12px">
        X轴：{{ Math.round(confItem.dragInfo.currentX) }}
      </div>
      <div>Y轴：{{ Math.round(confItem.dragInfo.currentY) }}</div>
    </el-form-item>
    <el-form-item label="图片层级">
      <el-input-number v-model="confItem.style.zIndex" :min="1" :max="99999" :step="1" />
    </el-form-item>
    <el-form-item label="图片旋转">
      <el-input-number
        v-model="confItem.dragInfo.rotate"
        :min="-360"
        :max="360"
        :step="1"
        @change="changeRotate"
      />
      <div class="btnRotate">
        <el-button @click="rotate(1)" type="primary" size="small" plain
          >顺45°增</el-button
        >
        <el-button @click="rotate(-1)" type="primary" size="small" plain
          >逆45°减</el-button
        >
      </div>
    </el-form-item>
    <el-form-item label="水平镜像">
      <el-radio-group @change="changeScaleXY" v-model="confItem.dragInfo.scaleX">
        <el-radio :value="1" size="large">水平正镜像</el-radio>
        <el-radio :value="-1" size="large">水平翻转镜像</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="垂直镜像">
      <el-radio-group @change="changeScaleXY" v-model="confItem.dragInfo.scaleY">
        <el-radio :value="1" size="large">垂直正镜像</el-radio>
        <el-radio :value="-1" size="large">垂直翻转镜像</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button @click="delFn" style="width: 100%" type="warning">删除组件</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { transformDom } from "@/utils/index.js";

const props = defineProps(["confItem", "curDom"]);

const emits = defineEmits(["delFn"]);

const delFn = () => {
  emits("delFn", props.confItem);
};

const rotate = (t) => {
  props.confItem.dragInfo.rotate = props.confItem.dragInfo.rotate + t * 45;
  transformDom(props.curDom, props.confItem.dragInfo);
};

const changeRotate = () => {
  transformDom(props.curDom, props.confItem.dragInfo);
};

const changeScaleXY = () => {
  transformDom(props.curDom, props.confItem.dragInfo);
};
</script>

<style>
.btnRotate {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
