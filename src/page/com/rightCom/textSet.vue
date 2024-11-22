<template>
  <el-form :model="confItem.style" label-width="auto">
    <el-form-item label="文字内容">
      <el-input
        :autosize="{ minRows: 2, maxRows: 6 }"
        type="textarea"
        v-model="confItem.style.textVal"
      />
    </el-form-item>
    <el-form-item label="位置">
      <div style="margin-right: 16px">
        X轴：{{ Math.round(confItem.dragInfo.currentX) }}
      </div>
      <div>Y轴：{{ Math.round(confItem.dragInfo.currentY) }}</div>
    </el-form-item>
    <el-form-item label="文字层级">
      <el-input-number v-model="confItem.style.zIndex" :min="1" :max="99999" :step="1" />
    </el-form-item>
    <el-form-item label="文字大小">
      <el-input-number v-model="confItem.style.fontSize" :min="10" :max="64" />
    </el-form-item>
    <el-form-item label="文字颜色">
      <el-color-picker v-model="confItem.style.color" />
    </el-form-item>
    <el-form-item label="文字背景色">
      <el-color-picker v-model="confItem.style.backgroundColor" />
    </el-form-item>
    <el-form-item label="文字粗细">
      <el-select v-model="confItem.style.fontWeight" placeholder="Select">
        <el-option
          v-for="item in fontWeightList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字字体">
      <el-select v-model="confItem.style.fontFamily" placeholder="Select">
        <el-option
          v-for="item in fontFamilyList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字风格">
      <el-select v-model="confItem.style.fontStyle" placeholder="Select">
        <el-option
          v-for="item in ['normal', 'italic']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字方向">
      <el-select v-model="confItem.style.writingMode" placeholder="Select">
        <el-option
          v-for="item in ['horizontal-tb', 'vertical-lr']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字间距">
      <el-input-number v-model="confItem.style.letterSpacing" :min="0" :max="60" />
    </el-form-item>
    <el-form-item label="字母间距">
      <el-input-number v-model="confItem.style.wordSpacing" :min="0" :max="60" />
    </el-form-item>
    <el-form-item label="行间距">
      <el-input-number
        v-model="confItem.style.lineHeight"
        :min="0"
        :max="10"
        :step="0.1"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="delFn" style="width: 100%" type="warning">删除组件</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
const props = defineProps(["confItem"]);
const emits = defineEmits(["delFn"]);

const fontWeightList = [100, 200, 300, 400, 500, 600, 700];

const fontFamilyList = [
  "微软雅黑",
  "黑体",
  "宋体",
  "仿宋",
  "楷体",
  "幼圆",
  "Arial",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
];

const delFn = () => {
  emits("delFn", props.confItem);
};
</script>
