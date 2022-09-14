<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          style="margin: 10px 0px"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="90" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo" class="demo-form-inline">
          <el-form-item label="属性">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
          border
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="name" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
import { reqAttrList, reqAddOrUpdateAttr } from "@/api/product/atrr";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      //控制table的显示与隐藏
      isShowTable: true,
      //收集新增属性|修改属性
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件回调
    getCategoryId(categoryId) {
      this.category1Id = categoryId.category1Id;
      this.category2Id = categoryId.category2Id;
      this.category3Id = categoryId.category3Id;
      this.getAttrList();
    },
    async getAttrList() {
      if (this.category3Id) {
        const { category1Id, category2Id, category3Id } = this;
        let result = await reqAttrList(category1Id, category2Id, category3Id);
        if (result.code == 200) {
          this.attrList = result.data;
        }
      }
    },
    /**新增属性*/
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      //切换table的现实与隐藏
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改属性
    updateAttr(row) {
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面嵌套数组,数组里面嵌套对象,因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //失去焦点的事件
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message({
          message: "输入的值不能为空",
          type: "warning",
        });
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message({
          message: "输入的值不能重复",
          type: "warning",
        });
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      //获取input节点,实现自动聚焦
      //需要注意:点击span的时候,切换为input变为编辑模式,但是需要注意,对于浏览器而言,页面的重绘与重拍需要时间
      //因此在点击span的时候,没办法马上获取到input
      //$nextTick,当节点渲染完毕,会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //气泡确认框确认按钮
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //确认按钮
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try{
        await reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.getAttrList()
      }catch(error){
        this.$message.error('保存失败');
      }
    },
  },
};
</script>
<style scoped>
</style>