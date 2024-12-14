<template>
  <el-collapse style="width: 180px;">
    <el-collapse-item style="text-align: center;" v-for="item in toolArr" :title="item.label" :name="item.label">
      <template #title>
        <div style="font-weight: 600">{{ item.emoji }} {{ item.label }}</div>
      </template>
      <template v-if="item.type == 'myText'">
        <div class="textStyle" draggable="true" :data-type="item.type">普通文本</div>
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
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import certificate from "@/assets/img/certificate.png";
import avantar from "@/assets/img/avantar.png";
import tree from "@/assets/img/tree.png";
import zhang from "@/assets/img/zhang.png";
import haha from "@/assets/img/haha.png";

const activeNames = ref(["1"]);
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
    imgList: [certificate, zhang, haha, avantar, tree],
  },
];
</script>

<style>
.textStyle {
  text-align: center;
  padding: 2px;
  cursor: move;
  margin-top: 6px;
  display: inline-block;
}
</style>
