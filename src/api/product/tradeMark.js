import request from '@/utils/requests'
//获取品牌列表接口
export const reqTradeMarkList = (page,limit)=>request({
  url:`/admin/product/baseTrademark/${page}/${limit}`,
  method:'get'
});

//新增品牌
export const reqAddUpdateTradeMark = (tradeMark)=>{
  //如果携带id--修改商品品牌
  if (tradeMark.id) {
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  }else{
    //新增品牌
    return request({url:`/admin/product/baseTrademark/save`,method:'post',data:tradeMark})
  }
}

//删除品牌的接口
///admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id)=>request({
  url:`/admin/product/baseTrademark/remove/${id}`,
  method:'delete'
});