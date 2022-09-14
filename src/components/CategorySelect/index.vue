<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          clearable
          v-model="cForm.category1Id"
          @change="handle1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          clearable
          v-model="cForm.category2Id"
          @change="handle2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          clearable
          v-model="cForm.category3Id"
          @change="handle3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  reqCategory1List,
  reqCategory2List,
  reqCategory3List,
} from "@/api/product/atrr";
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      //收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      //获取一级分类的请求:不需求携带参数
      let result = await reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handle1() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      if (this.cForm.category1Id) {
        let result = await reqCategory2List(this.cForm.category1Id);
        if (result.code == 200) {
          this.list2 = result.data;
        }
      } else {
        this.list2 = [];
        this.list3 = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
      }
    },
    async handle2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      if (this.cForm.category2Id) {
        let result = await reqCategory3List(this.cForm.category2Id);
        if (result.code == 200) {
          this.list3 = result.data;
        }
      } else {
        this.list3 = [];
        this.cForm.category3Id = "";
      }
    },
    handle3(){
      if (this.cForm.category3Id) {
        this.$emit('getCategoryId',this.cForm)
      }
    },
  },
};
</script>
<style scoped>
</style>