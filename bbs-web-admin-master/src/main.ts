import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
// 导入请求拦截器
import axiosInstance from '@/utils/http'//导入请求拦截器request


//import VueAxios from 'vue-axios'
import 'element-plus/theme-chalk/el-message.css'//全局 Message 消息提示(js文件中使用不支持自动导入的样式)
import "element-plus/theme-chalk/el-message-box.css";// messageBox的样式
import "element-plus/theme-chalk/el-overlay.css";// 遮罩层样式
import "element-plus/theme-chalk/el-loading.css";// loading的样式

import "element-plus/theme-chalk/el-table.css";// 表格的样式（el-main容器布局中不能自动引入）
import "element-plus/theme-chalk/el-image.css";// 图片容器的样式（el-main容器布局中不能自动引入）
import "element-plus/theme-chalk/el-image-viewer.css";// 图片预览的样式（el-main容器布局中不能自动引入）

//import 'element-plus/dist/index.css'//全部引入
import 'element-plus/es/components/form/style/css'//script setup中使用组件时不支持自动导入的样式
import 'element-plus/theme-chalk/el-affix.css'//全局 固钉
import pinia from "@/store/store"
import {useStore} from '@/store'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { ElAvatar, ElBadge, ElImage, ElPopover} from 'element-plus'
import Icon from "@/components/icon/Icon.vue";

import '@/assets/css/base.css'
//import '@/assets/css/module.less'

const store = useStore(pinia);


const app = createApp(App);
app.use(router);
//app.use(store);


//在跳转之前监听路由
router.beforeEach((to,from,next)=>{
    let scrollTop = 0;
    if(document.querySelector(".el-main")){
      scrollTop = document.querySelector(".el-main")!.scrollTop;
    }
    store.historyPath.forEach(function(value,key){
      
        let fullPathList = value;
        if(fullPathList != null && fullPathList.length >0){
            for(let i=0; i<fullPathList.length; i++){
                if(from.fullPath == fullPathList[i].url){
                    fullPathList[i].scrollTop = scrollTop;
                    let obj:any =new Object();
                    obj.key = key;
                    obj.value = fullPathList;
                    store.addHistoryPath(obj);
                }
            }
        }
    });
    
    next();
})

// 挂载到 Vue 根实例
app.use(pinia);

//axios
app.config.globalProperties.$axios=axiosInstance;
//app.use(VueAxios, Request.init())

//查询基本信息
//queryBaseInfo();


app.component('Icon', Icon)//富文本渲染展示需要全局注册
app.component('el-image', ElImage);//富文本渲染展示需要全局注册
app.component('el-popover', ElPopover);//富文本渲染展示需要全局注册
app.component('el-avatar', ElAvatar);//富文本渲染展示需要全局注册
app.component('el-badge', ElBadge);//富文本渲染展示需要全局注册


//ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//运行时支持原生自定义元素   player为引入的播放器使用标签
app.config.compilerOptions.isCustomElement = (tag) => ['player','hide'].includes(tag)

app.mount('#app');





