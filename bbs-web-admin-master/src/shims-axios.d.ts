import { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

//配置自定义属性
declare module 'axios' {
    export interface AxiosRequestConfig {
        loadingTarget?: string,
        showLoading?: boolean,//是否显示加载图标
        loadingMask?: boolean,//是否显示遮罩层
        timestamp?: boolean,//get请求是否增加时间戳
    }
}