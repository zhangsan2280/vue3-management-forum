<!-- 后台管理框架页 -->
<template>
    <div class="manageModule"><!-- 迷你模式收缩时全部缩进 -->
        <el-container style="height: 100%;" :class="state.mini ? 'mini' :''">
            <!-- 左侧菜单栏 -->
            <el-aside :class="state.isLeftNavigationMenuCollapse ? 'aside-shrink' :'aside-expand'" >
                   <!-- 迷你模式不显示 -->
                <div v-show="!state.mini" v-if="!state.isLeftNavigationMenuCollapse" class="logo-wrap"><div class=logo></div></div>
                <div v-show="!state.mini" v-if="state.isLeftNavigationMenuCollapse" class="logo-icon"><div class=logo></div></div>
                <el-scrollbar>
                    <el-menu v-if="state.topNavigationActiveIndex =='1' || state.mini" :default-active="state.leftNavigationMenuActive" :collapse="state.isLeftNavigationMenuCollapse" text-color="#606266" class="navigation-menu-left" @open="leftNavigationMenuOpen" @close="leftNavigationMenuClose"  @select="leftNavigationMenuSelect" :default-openeds="state.leftNavigationMenuOpeneds">
                        <el-sub-menu index="1-100100" v-show="letfNavigationMenuVerifyPermission('1-100100')">
                            <template #title >
                                <el-icon class="icon"><ChatLineSquare /></el-icon>
                                <span>话题管理</span>
                            </template>
                            <el-menu-item index="1-100100-1" v-if="navigationSubMenuVerifyPermission('1-100100-1')">话题列表</el-menu-item>
                            <el-menu-item index="1-100100-2" v-if="navigationSubMenuVerifyPermission('1-100100-2')">标签列表</el-menu-item>
                            <el-menu-item index="1-100100-3" v-if="navigationSubMenuVerifyPermission('1-100100-3')">全部待审核话题</el-menu-item>
                            <el-menu-item index="1-100100-4" v-if="navigationSubMenuVerifyPermission('1-100100-4')">全部待审核评论</el-menu-item>
                            <el-menu-item index="1-100100-5" v-if="navigationSubMenuVerifyPermission('1-100100-5')">全部待审核回复</el-menu-item>
                            <el-menu-item index="1-100100-6" v-if="navigationSubMenuVerifyPermission('1-100100-6')">话题搜索</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="1-100200" v-show="letfNavigationMenuVerifyPermission('1-100200')">
                            <template #title>
								<el-icon class="icon"><QuestionFilled /></el-icon>
                                <span>问答管理</span>
                            </template>
							<el-menu-item index="1-100200-1" v-if="navigationSubMenuVerifyPermission('1-100200-1')">问题列表</el-menu-item>
                            <el-menu-item index="1-100200-2" v-if="navigationSubMenuVerifyPermission('1-100200-2')">标签列表</el-menu-item>
                            <el-menu-item index="1-100200-3" v-if="navigationSubMenuVerifyPermission('1-100200-3')">全部待审核问题</el-menu-item>
                            <el-menu-item index="1-100200-4" v-if="navigationSubMenuVerifyPermission('1-100200-4')">全部待审核答案</el-menu-item>
                            <el-menu-item index="1-100200-5" v-if="navigationSubMenuVerifyPermission('1-100200-5')">全部待审核回复</el-menu-item>
                            <el-menu-item index="1-100200-6" v-if="navigationSubMenuVerifyPermission('1-100200-6')">问题搜索</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="1-100300" v-show="letfNavigationMenuVerifyPermission('1-100300')">
                            <template #title>
								<el-icon class="icon"><ChatDotSquare /></el-icon>
                                <span>留言管理</span>
                            </template>
                            <el-menu-item index="1-100300-1" v-if="navigationSubMenuVerifyPermission('1-100300-1')">留言列表</el-menu-item>
                        </el-sub-menu>
                         <el-sub-menu index="1-100400" v-show="letfNavigationMenuVerifyPermission('1-100400')">
                            <template #title>
								<el-icon class="icon"><Link /></el-icon>
                                <span>友情链接管理</span>
                            </template>
                            <el-menu-item index="1-100400-1" v-if="navigationSubMenuVerifyPermission('1-100400-1')">友情链接列表</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    
                    
                    <el-menu v-if="state.topNavigationActiveIndex =='2' || state.mini" :default-active="state.leftNavigationMenuActive" :collapse="state.isLeftNavigationMenuCollapse" text-color="#606266" class="navigation-menu-left" @open="leftNavigationMenuOpen" @close="leftNavigationMenuClose"  @select="leftNavigationMenuSelect" :default-openeds="state.leftNavigationMenuOpeneds">
                        <el-sub-menu index="2-200100" v-show="letfNavigationMenuVerifyPermission('2-200100')">
                            <template #title >
								<el-icon class="icon"><User /></el-icon>
                                <span>会员管理</span>
                            </template>
                            <el-menu-item index="2-200100-1" v-if="navigationSubMenuVerifyPermission('2-200100-1')">会员搜索</el-menu-item>
                            <el-menu-item index="2-200100-2" v-if="navigationSubMenuVerifyPermission('2-200100-2')">会员列表</el-menu-item>
                            <el-menu-item index="2-200100-3" v-if="navigationSubMenuVerifyPermission('2-200100-3')">会员角色</el-menu-item>
                            <el-menu-item index="2-200100-4" v-if="navigationSubMenuVerifyPermission('2-200100-4')">会员等级</el-menu-item>
                            <el-menu-item index="2-200100-5" v-if="navigationSubMenuVerifyPermission('2-200100-5')">会员注册项</el-menu-item>
                            <el-menu-item index="2-200100-6" v-if="navigationSubMenuVerifyPermission('2-200100-6')">会员注册禁止用户名称</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="2-200200" v-show="letfNavigationMenuVerifyPermission('2-200200')">
                            <template #title>
								<el-icon class="icon"><Tickets /></el-icon>
                                <span>会员卡管理</span>
                            </template>
                            <el-menu-item index="2-200200-1" v-if="navigationSubMenuVerifyPermission('2-200200-1')">会员卡列表</el-menu-item>
                            <el-menu-item index="2-200200-2" v-if="navigationSubMenuVerifyPermission('2-200200-2')">会员卡订单列表</el-menu-item>
                            <el-menu-item index="2-200200-3" v-if="navigationSubMenuVerifyPermission('2-200200-3')">会员卡赠送任务列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="2-200300" v-show="letfNavigationMenuVerifyPermission('2-200300')">
                            <template #title>
								<el-icon class="icon"><UserFilled /></el-icon>
                                <span>员工管理</span>
                            </template>
                            <el-menu-item index="2-200300-1" v-if="navigationSubMenuVerifyPermission('2-200300-1')">员工列表</el-menu-item>
                            <el-menu-item index="2-200300-2" v-if="navigationSubMenuVerifyPermission('2-200300-2')">角色列表</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    
                    <el-menu v-if="state.topNavigationActiveIndex =='3' || state.mini" :default-active="state.leftNavigationMenuActive" :collapse="state.isLeftNavigationMenuCollapse" text-color="#606266" class="navigation-menu-left" @open="leftNavigationMenuOpen" @close="leftNavigationMenuClose"  @select="leftNavigationMenuSelect" :default-openeds="state.leftNavigationMenuOpeneds">
                        <el-sub-menu index="3-300100" v-show="letfNavigationMenuVerifyPermission('3-300100')">
                            <template #title >
								<el-icon class="icon"><HelpFilled /></el-icon>
                                <span>帮助管理</span>
                            </template>
                            <el-menu-item index="3-300100-1" v-if="navigationSubMenuVerifyPermission('3-300100-1')">帮助分类</el-menu-item>
                            <el-menu-item index="3-300100-2" v-if="navigationSubMenuVerifyPermission('3-300100-2')">帮助列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="3-300200" v-show="letfNavigationMenuVerifyPermission('3-300200')">
                            <template #title>
								<el-icon class="icon"><Document /></el-icon>
                                <span>模板管理</span>
                            </template>
                            <el-menu-item index="3-300200-1" v-if="navigationSubMenuVerifyPermission('3-300200-1')">模板列表</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    
                    <el-menu v-if="state.topNavigationActiveIndex =='4' || state.mini" :default-active="state.leftNavigationMenuActive" :collapse="state.isLeftNavigationMenuCollapse" text-color="#606266" class="navigation-menu-left" @open="leftNavigationMenuOpen" @close="leftNavigationMenuClose"  @select="leftNavigationMenuSelect" :default-openeds="state.leftNavigationMenuOpeneds">
                        <el-sub-menu index="4-400100" v-show="letfNavigationMenuVerifyPermission('4-400100')">
                            <template #title >
								<el-icon class="icon"><View /></el-icon>
                                <span>浏览量管理</span>
                            </template>
                            <el-menu-item index="4-400100-1" v-if="navigationSubMenuVerifyPermission('4-400100-1')">浏览量列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="4-400200" v-show="letfNavigationMenuVerifyPermission('4-400200')">
                            <template #title>
								<el-icon class="icon"><Files /></el-icon>
                                <span>文件打包管理</span>
                            </template>
                            <el-menu-item index="4-400200-1" v-if="navigationSubMenuVerifyPermission('4-400200-1')">压缩文件列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="4-400300" v-show="letfNavigationMenuVerifyPermission('4-400300')">
                            <template #title>
								<el-icon class="icon"><Bell /></el-icon>
                                <span>系统通知管理</span>
                            </template>
                            <el-menu-item index="4-400300-1" v-if="navigationSubMenuVerifyPermission('4-400300-1')">系统通知列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="4-400400" v-show="letfNavigationMenuVerifyPermission('4-400400')">
                            <template #title>
								<el-icon class="icon"><Coin /></el-icon>
                                <span>平台收益管理</span>
                            </template>
                            <el-menu-item index="4-400400-1" v-if="navigationSubMenuVerifyPermission('4-400400-1')">解锁话题隐藏内容分成</el-menu-item>
                            <el-menu-item index="4-400400-2" v-if="navigationSubMenuVerifyPermission('4-400400-2')">问答悬赏平台分成</el-menu-item>
                        </el-sub-menu>
						<el-sub-menu index="4-400600" v-show="letfNavigationMenuVerifyPermission('4-400600')">
                            <template #title>
								<el-icon class="icon"><Warning /></el-icon>
                                <span>举报管理</span>
                            </template>
                            <el-menu-item index="4-400600-1" v-if="navigationSubMenuVerifyPermission('4-400600-1')">举报分类</el-menu-item>
                            <el-menu-item index="4-400600-2" v-if="navigationSubMenuVerifyPermission('4-400600-2')">举报列表</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    
                    <el-menu v-if="state.topNavigationActiveIndex =='5' || state.mini" :default-active="state.leftNavigationMenuActive" :collapse="state.isLeftNavigationMenuCollapse" text-color="#606266" class="navigation-menu-left" @open="leftNavigationMenuOpen" @close="leftNavigationMenuClose"  @select="leftNavigationMenuSelect" :default-openeds="state.leftNavigationMenuOpeneds">
                        <el-sub-menu index="5-500100" v-show="letfNavigationMenuVerifyPermission('5-500100')">
                            <template #title >
								<el-icon class="icon"><Setting /></el-icon>
                                <span>全站设置</span>
                            </template>
							<el-menu-item index="5-500100-1" v-if="navigationSubMenuVerifyPermission('5-500100-1')">基本设置</el-menu-item>
                            <el-menu-item index="5-500100-2" v-if="navigationSubMenuVerifyPermission('5-500100-2')">维护数据</el-menu-item>
                            <el-menu-item index="5-500100-3" v-if="navigationSubMenuVerifyPermission('5-500100-3')">敏感词</el-menu-item>
                            <el-menu-item index="5-500100-4" v-if="navigationSubMenuVerifyPermission('5-500100-4')">数据库备份/还原</el-menu-item>
                            <el-menu-item index="5-500100-5" v-if="navigationSubMenuVerifyPermission('5-500100-5')">服务器节点参数</el-menu-item>
                            <el-menu-item index="5-500100-6" v-if="navigationSubMenuVerifyPermission('5-500100-6')">升级</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="5-500200" v-show="letfNavigationMenuVerifyPermission('5-500200')">
                            <template #title>
								<el-icon class="icon"><Wallet /></el-icon>
                                <span>支付管理</span>
                            </template>
                            <el-menu-item index="5-500200-1" v-if="navigationSubMenuVerifyPermission('5-500200-1')">在线支付接口</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="5-500300" v-show="letfNavigationMenuVerifyPermission('5-500300')">
                            <template #title>
								<el-icon class="icon"><Message /></el-icon>
                                <span>短信管理</span>
                            </template>
                            <el-menu-item index="5-500300-1" v-if="navigationSubMenuVerifyPermission('5-500300-1')">短信接口列表</el-menu-item>
                            <el-menu-item index="5-500300-2" v-if="navigationSubMenuVerifyPermission('5-500300-2')">短信发送错误日志</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="5-500500" v-show="letfNavigationMenuVerifyPermission('5-500500')">
                            <template #title>
								<el-icon class="icon"><Platform /></el-icon>
                                <span>第三方服务管理</span>
                            </template>
                            <el-menu-item index="5-500500-1" v-if="navigationSubMenuVerifyPermission('5-500500-1')">第三方登录接口列表</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="5-500700" v-show="letfNavigationMenuVerifyPermission('5-500700')">
                            <template #title>
								<el-icon class="icon"><Picture /></el-icon>
                                <span>缩略图管理</span>
                            </template>
                            <el-menu-item index="5-500700-1" v-if="navigationSubMenuVerifyPermission('5-500700-1')">缩略图列表</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-scrollbar>
                
            </el-aside>
            <div class="leftNavigationArrow">
                <div class="toggleArrow" :title="state.isLeftNavigationMenuCollapse ? '展开' :'收缩'" @click="leftNavigationMenuCollapse">
					<el-icon v-if="!state.isLeftNavigationMenuCollapse" class="icon"><ArrowLeft /></el-icon>
					<el-icon v-if="state.isLeftNavigationMenuCollapse" class="icon"><ArrowRight /></el-icon>
					<svg width="10" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="null" fill-rule="evenodd" fill="#fff" d="m6.606031,3.611539l-6.606031,-3.611539l0,49.75l6.606031,-3.611539c1.926827,-1.053403 3.143969,-3.206725 3.143969,-5.562219l0,-31.402485c0,-2.355494 -1.217141,-4.508816 -3.143969,-5.562219z"/>
                    </svg>
                </div>
            </div>
            <el-container>
                <!-- 顶部菜单栏 -->
                <el-header>
                    <div class="header-box">
                    	<!-- 迷你模式不显示 -->
                    	<el-row :gutter="5"  v-show="!state.mini">
							<el-col :span="16">
								<div style="display: flex;">
									<el-menu :default-active="state.topNavigationActiveIndex" :ellipsis="false" class="navigation-menu-header" mode="horizontal" @select="topNavigationSelect" text-color="#606266" active-text-color="#409eff">
										<el-menu-item index="1" v-show="topNavigationMenuVerifyPermission('1')">内容管理</el-menu-item>
										<el-menu-item index="2" v-show="topNavigationMenuVerifyPermission('2')">会员管理</el-menu-item>
										<el-menu-item index="3" v-show="topNavigationMenuVerifyPermission('3')">页面管理</el-menu-item>
										<el-menu-item index="4" v-show="topNavigationMenuVerifyPermission('4')">运营管理</el-menu-item>
										<el-menu-item index="5" v-show="topNavigationMenuVerifyPermission('5')">系统设置</el-menu-item>
									</el-menu>
								
									<div class="browseButtonMenu">
										<div class="nav-list-item ">
											<div class="browserButton" @click ="retreat()" title="后退">
												<div class="circle"><el-icon class="icon"><Back /></el-icon></div>
											</div>
										</div>
										<div class="nav-list-item ">
											<div class="browserButton" @click ="advance()" title="前进">
												<div class="circle"><el-icon class="icon"><Right /></el-icon></div>
											</div>
										</div>
										<div class="nav-list-item ">
											<div class="browserButton" @click="refresh()" title="刷新">
												<div class="circle"><el-icon class="icon"><RefreshRight /></el-icon></div>
											</div>
										</div>
									</div>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="homeMenu">  
									<el-tooltip content="网站首页" placement="bottom" effect="light">
										<div class="nav-list-icon" >
											<a class="link-icon" hidefocus="true"  href="/" target="_blank"><el-icon><HomeFilled color="#ff9e00"/></el-icon></a>
										</div>
									</el-tooltip>
									<el-tooltip content="后台首页" placement="bottom" effect="light">
										<div class="nav-list-icon" >
											<div class="link-icon" @click="topNavigationHomeLink" >
												<el-icon><HomeFilled/></el-icon>
											</div>
										</div>
									</el-tooltip>
									<el-tooltip content="联系我们" placement="bottom" effect="light">
										<div class="nav-list-icon">	
											<a class="link-icon" hidefocus="true" href="http://www.diyhi.com" target=_blank><el-icon><PhoneFilled /></el-icon></a> 
										</div>
									</el-tooltip>
									<div class="nav-list-user">
										<el-dropdown size="large">
											<div>
												<div v-if="state.sysUsers.avatarName != null && state.sysUsers.avatarName != ''" class="avatarImg">
						                      		<el-image class="avatar" style="width: 40px; height: 40px;" fit="contain" :src="state.sysUsers.avatarPath + state.sysUsers.avatarName" ></el-image>
						                     	</div>
						                     	<div v-if="state.sysUsers.avatarName == null || state.sysUsers.avatarName == ''" class="avatarIcon">
													<el-avatar :icon="UserFilled" />
						                     	</div>

												<div class="user-info">
													<span class="name">{{state.sysUsers.fullName != null && state.sysUsers.fullName != '' ? state.sysUsers.fullName : state.sysUsers.userAccount}}</span>
													<span class="role">{{state.sysUsers.userDuty}}</span>
												</div>
												<div class="more"><el-icon><ArrowDown /></el-icon></div>
											</div>
											<template #dropdown>
												<el-dropdown-menu>
													<el-dropdown-item :icon="Tools" v-if="state.sysUsers.issys" @click="jumpPage(()=>{router.push({path : '/admin/control/staff/manage/editStaff',query:{userId : state.sysUsers.userId}})})">个人设置</el-dropdown-item>
													<el-dropdown-item :icon="Tools" :disabled="!verifyPermissionMenu('/control/staff/manage?method=editSelfInfo*','get')" v-if="!state.sysUsers.issys" @click="jumpPage(()=>{router.push({path : '/admin/control/staff/manage/editSelfInfo'})})">个人设置</el-dropdown-item>

													<el-dropdown-item :icon="SwitchButton"  @click="logout()">退出登录</el-dropdown-item>
												</el-dropdown-menu>
											</template>
										</el-dropdown>
									</div>
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="24">
								
								<div class="tagMenu clearfix">  
									<span :class="tag.active ? 'item active': 'item'" :key="tag.index" v-for="(tag,index) in state.linkTag">  
										<el-tag closable effect="plain" size="large" @click="selectWindow(tag)" @close="closeWindow(tag)">{{tag.name}}</el-tag>
									</span>
								</div>
							</el-col>
                		</el-row>
                	</div>
                  
                </el-header>
                
                <!-- 内容区 -->
                <el-main>
					<!-- :max 缓存组件最大数量 -->
                    <router-view v-slot="{ Component }" >
                        <keep-alive :include="cacheComponents" :max="200">
							<component :is="Component" :key="store.getCacheKey" v-if="state.isRouterAlive"/> 
                        </keep-alive>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>  
<script lang="ts" setup>
    import { ComponentInternalInstance, computed, getCurrentInstance, nextTick, onMounted, reactive, watch, watchEffect } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRoute, useRouter } from 'vue-router';
	import { analyzeUrlParam, objToStrMap, strMapToObj,verifyPermissionMenu } from '@/utils/tool';
	import { ElMessage } from 'element-plus';
	import { MenuLinkTag, SysUsers } from '@/types';
    import { UserFilled,Tools,SwitchButton } from '@element-plus/icons-vue'

    const store = useStore(pinia);
	const {permissionMenuList:store_permissionMenuList} = storeToRefs(store)

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
	const route = useRoute();
	
    const state = reactive({
        mini:false,//是否进入迷你模式
			
        isRouterAlive: true, //控制视图是否显示的变量
        //顶部导航菜单默认选中项
        topNavigationActiveIndex: '1',
        //顶部链接标签
        linkTag: [] as Array<MenuLinkTag>,
        //顶部导航展示项
		topNavigationDisplayItem: [] as Array<string>,
        
        //左侧菜单栏是否水平折叠收起菜单
        isLeftNavigationMenuCollapse:false,
        //左侧菜单栏二级菜单当前激活选中项
        leftNavigationMenuActive:"",
        //左侧菜单栏一级菜单当前展开选中项
        leftNavigationMenuOpeneds:["1-100100"],
        //左侧导航菜单一级菜单是否展开 Map格式 key= 左侧菜单栏索引 value=是否展开(boolean类型)
        leftNavigationMenuExpand :new Map([
                ["1-100100", true], 
                ["2-200100", true],
                ["2-200200", true],
                ["2-200300", true],
                ["3-300100", true],
                ["3-300200", true],
                ["4-400100", true],
                ["4-400200", true],
                ["4-400300", true],
                ["4-400400", true],
                ["4-400500", true],
				["4-400600", true],
                ["5-500100", true]]
        ),
        
        sysUsers :{} as SysUsers,
    });

	const cacheComponents = computed(() => {
    	return store.getCacheComponents
	});
	
    
    //判断是否需要进入迷你模式
    const miniMode = () => {
        if(window.screen.width <=600){//进入迷你模式
            state.mini = true;
        }
    }

	//跳转网页
	const jumpPage = (callback: () => void) => {
		createWindow("2-200300-1");
		callback();
    }
		
    //查询后台管理框架页信息(本页不查询使用的文件存储系统，由App.vue页查询，因为本页在http://127.0.0.1:8080/admin/control/topic/manage/add?visible=true&page= 页查询时比control/topic/manage/add页的结果慢)
    const queryManageFramework = () => {
        
        proxy?.$axios({
            url: '/control/manage/index',
            method: 'get',
            params:  {
            }
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        let mapData = returnValue.data;
                        for(let key in mapData){
                            if(key == "sysUsers"){
                                state.sysUsers = mapData[key];
                            }else if(key == "permissionMenuList"){
                                let permissionMenuList = mapData[key];
                                store_permissionMenuList.value = permissionMenuList
                            }/**
							else if(key == "fileStorageSystem"){
                                let fileStorageSystem = mapData[key];
                                store.setFileStorageSystem(fileStorageSystem)
                            } */
                        }
                    }else if(returnValue.code === 500){//错误
                        
                        
                    }
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
		
	//顶部导航选择
    const topNavigationSelect = (key:string, keyPath:string) => {
        state.topNavigationActiveIndex = key;
        //清空数组
        state.leftNavigationMenuOpeneds = [];
        
        state.leftNavigationMenuExpand.forEach(function(value,key){
            if(value){
                state.leftNavigationMenuOpeneds.push(key);
            }
        });
    }
	//左侧导航菜单展开
	const leftNavigationMenuOpen = (key:string, keyPath:string) => {
		state.leftNavigationMenuExpand.set(key, true);
	}
	//左侧导航菜单收缩
	const leftNavigationMenuClose = (key:string, keyPath:string) => {
		state.leftNavigationMenuExpand.set(key, false);
	}

	//左侧菜单栏水平折叠收起菜单
	const leftNavigationMenuCollapse = () => {
		if(state.isLeftNavigationMenuCollapse){
			
			let index = state.topNavigationActiveIndex;
			state.isLeftNavigationMenuCollapse = false;
			//因为折叠收起菜单时一级节点不能自动展开，所以切换到不存在的节点再切换回来
			state.topNavigationActiveIndex= '99999';//99999为不存在的节点
			
			nextTick(() =>{
				state.topNavigationActiveIndex= index;
				//清空数组
				state.leftNavigationMenuOpeneds = [];
				
				state.leftNavigationMenuExpand.forEach(function(value,key){
					if(value){
						state.leftNavigationMenuOpeneds.push(key);
					}
				});
			});
		}else{
			state.isLeftNavigationMenuCollapse = true;
		}
	}
	    
	//左侧导航菜单自动展开
	const leftNavigationMenuAutoOpen = () => {
		let oldIndex = state.topNavigationActiveIndex;
		
		//因为折叠收起菜单时一级节点不能自动展开，所以切换到不存在的节点再切换回来
		state.topNavigationActiveIndex= '99999';//99999为不存在的节点
		
		nextTick(() => {
			state.topNavigationActiveIndex= oldIndex;
			//清空数组
			state.leftNavigationMenuOpeneds = [];
			
			state.leftNavigationMenuExpand.forEach(function(value,key){
				if(value){
					state.leftNavigationMenuOpeneds.push(key);
				}
			});
		});
	}
	    
	//左侧导航菜单点击
	const leftNavigationMenuSelect = (key:string, keyPath:string) => {	
		//创建窗口
		createWindow(key);
	}

	    
	//顶部菜单首页链接
	const topNavigationHomeLink = () => {	
		//创建窗口
		createWindow("0-000000-0");
		
	}
	    
	    
	//创建窗口  index：左侧菜单栏二级菜单索引
	const createWindow = (index:string) => {	
		//所有标签取消选中
		for(let i=0; i<state.linkTag.length; i++){
			let tag = state.linkTag[i];
			if(tag.active){
				let newTab:any =new Object();
				newTab.name = tag.name;
				newTab.index = tag.index;
				newTab.active = false;//是否激活
				state.linkTag.splice(i,1,newTab);
			}
		}
		let flag = false;//是否已添加标签
		//如果已添加标签，则选中
		for(let i=0; i<state.linkTag.length; i++){
			let tag = state.linkTag[i];
			if(tag.index == index){
				
				let newTab:any =new Object();
				newTab.name = tag.name;
				newTab.index = index;
				newTab.active = true;//是否激活	
				state.linkTag.splice(i,1,newTab);
				flag = true;
			}
		}
		
		//如果未添加
		if(!flag){
			
			let linkList = store.allLinkList;
			for(let i=0; i<linkList.length; i++){
				let link = linkList[i];
				if(link.meta.index == index){
					let tab:any =new Object();
					tab.name = link.meta.title;
					tab.index = index;
					tab.active = true;//是否激活
					state.linkTag.push(tab);
				}
			}
		}
		
		
		for(let i=0; i<state.linkTag.length; i++){
			let tag = state.linkTag[i];
			if(tag.active){//激活的标签
				//跳转链接
				toLink(tag);
				
				break;
			}
		}
		
	}
	//选择窗口
	const selectWindow = (tag:MenuLinkTag) => {	
		//所有标签取消选中
		for(let i=0; i<state.linkTag.length; i++){
			let _tag = state.linkTag[i];
			if(_tag.active){
				let newTab:any =new Object();
				newTab.name = _tag.name;
				newTab.index = _tag.index;
				newTab.active = false;//是否激活
				
				state.linkTag.splice(i,1,newTab);
			}
			
		}
		//选中当前项
		for(let i=0; i<state.linkTag.length; i++){
			let _tag = state.linkTag[i];
			if(_tag.index == tag.index){
				
				let newTab:any =new Object();
				newTab.name = _tag.name;
				newTab.index = _tag.index;
				newTab.active = true;//是否激活
				
				state.linkTag.splice(i,1,newTab);
				
			}
		}
		
		//跳转链接
		toLink(tag);
		
	}
	//关闭窗口
	const closeWindow = (tag:MenuLinkTag) => {	
		//如果是最后一项，则不允许删除
		if(state.linkTag.length <=1){
			return;
		}
		let index = state.linkTag.indexOf(tag);
		
		state.linkTag.splice(index,1);
		
		//删除当前窗口对应的路由数据
		store.deleteHistoryPath(tag.index)
		
		
		//是否有激活
		let isActive = false;
		//所有标签取消选中
		for(let i=0; i<state.linkTag.length; i++){
			let tag = state.linkTag[i];
			if(tag.active){
				isActive = tag.active;
			}
			
		}
		
		
		//窗口最新URL集合
		let new_windowNewestURLList = new Array();
		
		//窗口旧URL集合
		let old_windowNewestURLList = new Array();
		
		let _windowNewestURLList = window.sessionStorage.getItem('windowNewestURLList');
		if(_windowNewestURLList != null){
			let _old_windowNewestURLList = JSON.parse(_windowNewestURLList);
			if(_old_windowNewestURLList != null && _old_windowNewestURLList.length >0){
				old_windowNewestURLList = _old_windowNewestURLList;
			}
		}
		for(let i=0; i<state.linkTag.length; i++){
			let _tag = state.linkTag[i];

			for(let j=0; j<old_windowNewestURLList.length; j++){
				let windowNewestURL = old_windowNewestURLList[j];
				if(windowNewestURL.index == _tag.index){
					new_windowNewestURLList.push(windowNewestURL);
				}
			}

		}
		//保存窗口最后打开的URL
		window.sessionStorage.setItem('windowNewestURLList', JSON.stringify(new_windowNewestURLList));

		
		if(isActive){
			return;
		}
		
		//新选中标签索引
		let newIndex = index-1;
		if(index==0){//如果是第一项
			newIndex = 0;
		}
		
		
		//删除后标签选中前一项
		for(let i=0; i<state.linkTag.length; i++){
			let tag = state.linkTag[i];
			if(i==newIndex){
				//tag.active = false;
				let newTab:any =new Object();
				newTab.name = tag.name;
				newTab.index = tag.index;
				newTab.active = true;//是否激活

				state.linkTag.splice(i,1,newTab);
				
				//跳转链接
				toLink(newTab);
			}
			
		}
	}
	
	//跳转链接
	const toLink = (tag:MenuLinkTag) => {	
		//URL集合
		let fullPathList = new Array();
		//获取当前窗口对应的URL集合
		store.historyPath.forEach(function(value,key){
			if(key == tag.index){
				fullPathList = value;
			}
		});
		
		if(fullPathList != null && fullPathList.length >0){//如果是已打开的窗口
			//如果在窗口执行了后退按钮
			let windowBrowseStatus = store.windowBrowseStatus.get(tag.index);
			if(windowBrowseStatus != null && windowBrowseStatus.step <0){//如果执行过"前进/后退"
				let _fullPath:any = "";
				let count = windowBrowseStatus.step*-1;
				for(let i = fullPathList.length-1; i>=0; i--){//倒序循环
					let fullPath = fullPathList[i];
					
					if(count == 0){
						_fullPath = fullPath;
						break;
					}
					count--;
					
					
				}
				
				
				//窗口浏览状态
				let _windowBrowseStatus:any = new Object();
				_windowBrowseStatus.isRecordPath = false;//是否记录路径 
				_windowBrowseStatus.step = windowBrowseStatus.step;	//步长 0为没有执行"前进/后退"命令
				
				
				let obj:any =new Object();
				obj.key = tag.index;
				obj.value = _windowBrowseStatus;
				//添加窗口浏览状态
				store.addWindowBrowseStatus(obj)
				
				if(_fullPath != ""){
					//解析url参数
					let paramObject = analyzeUrlParam(_fullPath.url);
					
					
					if (Object.keys(paramObject).length === 0) {//如果为空
						router.push({
							path : _fullPath.url
						});
					}else{
						//含有中文的值要解码
						for(let param in paramObject){
							paramObject[param] = decodeURIComponent(paramObject[param]);
						}
						
						router.push({
							path : _fullPath.url,
							query : paramObject
						});
						
						
					}
					
				}
			}else{
				//最后一个URL
				let end_fullPath = fullPathList[fullPathList.length-1];
				
				//解析url参数
				let paramObject = analyzeUrlParam(end_fullPath.url);
				
				
				if (Object.keys(paramObject).length === 0) {//如果为空
					router.push({
						path : end_fullPath.url
					});
					
				}else{
					//含有中文的值要解码
					for(let param in paramObject){
						paramObject[param] = decodeURIComponent(paramObject[param]);
					}
					
					router.push({
						path : end_fullPath.url,
						query : paramObject
					});
				}
				
			}
			
		}else{//如果是未打开的窗口
			
			let linkList = store.allLinkList;
			
			
			for(let j=0; j<linkList.length; j++){
				let _link = linkList[j];
				if(_link.meta.index == tag.index){
					if(_link.query != undefined){//如果带有参数
						router.push({
							path : _link.path,
							query : _link.query
						});
					}else{
						router.push({
							path : _link.path,
						});
						
					}
					
					break;
				}
			}
			
		}
	}

	//后退
	const retreat = () => {	
		//当前窗口索引
		let currentWindowIndex = "";
		
		let _linkTag = window.sessionStorage.getItem('linkTag');
		if(_linkTag != null){
			let linkTag = JSON.parse(_linkTag);
			
			for(let i=0; i<linkTag.length; i++){
				let _tag = linkTag[i];
				if(_tag.active){//如果已激活
					currentWindowIndex = _tag.index;
					break;
				}
			}
		}

		if(currentWindowIndex != ''){
			let old_windowBrowseStatus = store.windowBrowseStatus.get(currentWindowIndex);
			let old_step = 0;//原来的步长
			if(old_windowBrowseStatus != null){
				old_step = old_windowBrowseStatus.step;
			}
			
			
			
			//浏览URL全路径集合
			let fullPathList = new Array();
			
			//获取当前窗口对应的URL集合
			store.historyPath.forEach(function(value,key){
				if(key == currentWindowIndex){
					fullPathList = value;
				}
			});
			
			let step = old_step;//步长 0为没有执行"前进/后退"命令
			let _fullPath:any = "";
			let count = (old_step-1)*-1;
			for(let i = fullPathList.length-1; i>=0; i--){//倒序循环
				let fullPath = fullPathList[i];
				
				if(count == 0){
					_fullPath = fullPath;
					step = old_step-1;
					break;
				}
				count--;
				
				
			}
			
			/**
			let count = 0;
			for(let i = fullPathList.length-1; i>=0; i--){//倒序循环
				let fullPath = fullPathList[i];
				
				if(count == (old_step*(-1))+1 ){
					_fullPath = fullPath;
					step = old_step-1;
					break;
				}
				count++;
				
				
			}**/
			
			
			if(_fullPath != ""){
				//窗口浏览状态
				let windowBrowseStatus:any = new Object();
				windowBrowseStatus.isRecordPath = false;//是否记录路径 
				windowBrowseStatus.step = step;	//步长 0为没有执行"前进/后退"命令
				
				
				let obj:any =new Object();
				obj.key = currentWindowIndex;
				obj.value = windowBrowseStatus;
				//添加窗口浏览状态
				store.addWindowBrowseStatus(obj)
				
				
				//解析url参数
				let paramObject = analyzeUrlParam(_fullPath.url);
				
				
				if (Object.keys(paramObject).length === 0) {//如果为空
					router.push({
						path : _fullPath.url
					});
				}else{
					//含有中文的值要解码
					for(let param in paramObject){
						paramObject[param] = decodeURIComponent(paramObject[param]);
					}
					
					router.push({
						path : _fullPath.url,
						query : paramObject
					});
				}
			}
			
		}
	}

	//前进
	const advance = () => {	
		//当前窗口索引
		let currentWindowIndex = "";
		
		let _linkTag = window.sessionStorage.getItem('linkTag');
		if(_linkTag != null){
			let linkTag = JSON.parse(_linkTag);
			
			for(let i=0; i<linkTag.length; i++){
				let _tag = linkTag[i];
				if(_tag.active){//如果已激活
					currentWindowIndex = _tag.index;
					break;
				}
			}
		}

		if(currentWindowIndex != ''){
			let old_windowBrowseStatus = store.windowBrowseStatus.get(currentWindowIndex);
			let old_step = 0;//原来的步长
			if(old_windowBrowseStatus != null){
				old_step = old_windowBrowseStatus.step;
			}
			
			let step = old_step +1;//步长 0为没有执行"前进/后退"命令
			if(step >0){
				step = 0;
			}
			
			if(step  <= 0){
				//浏览URL全路径集合
				let fullPathList = new Array();
				
				//获取当前窗口对应的URL集合
				store.historyPath.forEach(function(value,key){
					if(key == currentWindowIndex){
						fullPathList = value;
					}
				});
				
				
				let _fullPath:any = "";
				let count = step*(-1);
				for(let i = fullPathList.length-1; i>=0; i--){//倒序循环
					let fullPath = fullPathList[i];
					
					if(count == 0){
						_fullPath = fullPath;
						break;
					}
					count--;
				}
				
				if(step ==0 && _fullPath.url==route.fullPath){//如果步长为0并且前进的URL和当前路由相同
					return;
				}
				
				
				if(_fullPath != ""){
					//窗口浏览状态
					let windowBrowseStatus:any = new Object();
					windowBrowseStatus.isRecordPath = false;//是否记录路径 
					windowBrowseStatus.step = step;	//步长 0为没有执行"前进/后退"命令
					
					let obj:any =new Object();
					obj.key = currentWindowIndex;
					obj.value = windowBrowseStatus;
					//添加窗口浏览状态
					store.addWindowBrowseStatus(obj)
					
					
					//解析url参数
					let paramObject = analyzeUrlParam(_fullPath.url);
					
					if (Object.keys(paramObject).length === 0) {//如果为空
						router.push({
							path : _fullPath.url
						});
					}else{
						//含有中文的值要解码
						for(let param in paramObject){
							paramObject[param] = decodeURIComponent(paramObject[param]);
						}
						router.push({
							path : _fullPath.url,
							query : paramObject
						});
					}
				}
				
				
			}
		}
	}
	//刷新
	const refresh = () => {	
		state.isRouterAlive = false; //先关闭
		//删除缓存组件
        store.deleteCacheComponents(String(router.currentRoute.value.name))
		nextTick(()=> {
			store.setCacheNumber()
			state.isRouterAlive = true; //再打开
		});
		
	}

	//退出登录
	const logout = () => {
		proxy?.$axios({
			url: '/admin/logout',
			method: 'post',
			params:  {
			}
		})
		.then((response: AxiosResponse) => {
			if(response){
				const result: any = response.data;
				if(result){
					let returnValue = JSON.parse(result);
					
					if(returnValue.code === 200){//成功
						//删除sessionStorage中全部数据
						window.sessionStorage.clear(); 

						router.push("/admin/login");

					}else if(returnValue.code === 500){//错误
						let errorMap = returnValue.data;
						for (let key in errorMap){
							ElMessage({
								showClose: true,
								message: errorMap[key],
								type: 'error'
							})
						}
						
						
					}
				}
			}
		}).catch((error: any) =>{
			console.log(error);
		});
	}

	
	//导航菜单索引映射
	const navigationMenuIndexMapping = new Map<string,string>([
		["1-100100-1", "/control/topic/list*"],//话题列表
		["1-100100-2", "/control/tag/list*"],//标签列表
		["1-100100-3", "/control/topic/allAuditTopic*"], //全部待审核话题
		["1-100100-4", "/control/topic/allAuditComment*"], //全部待审核评论
		["1-100100-5", "/control/topic/allAuditReply*"], //全部待审核回复
		["1-100100-6", "/control/topic/search*"], //话题搜索

		["1-100200-1", "/control/question/list*"], //问题列表
		["1-100200-2", "/control/questionTag/list*"], //标签列表
		["1-100200-3", "/control/question/allAuditQuestion*"], //全部待审核问题
		["1-100200-4", "/control/question/allAuditAnswer*"], //全部待审核答案
		["1-100200-5", "/control/question/allAuditAnswerReply*"], //全部待审核回复
		["1-100200-6", "/control/question/search*"], //问题搜索

		["1-100300-1", "/control/feedback/list*"], //留言列表

		["1-100400-1", "/control/links/list*"], //友情链接列表

		["2-200100-1", "/control/user/search*"], //会员搜索
		["2-200100-2", "/control/user/list*"], //会员列表
		["2-200100-3", "/control/userRole/list*"], //会员角色
		["2-200100-4", "/control/userGrade/list*"], //会员等级
		["2-200100-5", "/control/userCustom/list*"], //会员注册项
		["2-200100-6", "/control/disableUserName/list*"], //会员注册禁止用户名称

		["2-200200-1", "/control/membershipCard/list*"], //会员卡列表
		["2-200200-2", "/control/membershipCardOrder/list*"], //会员卡订单列表
		["2-200200-3", "/control/membershipCardGiftTask/list*"], //会员卡赠送任务列表

		["2-200300-1", "/control/staff/list*"], //员工列表
		["2-200300-2", "/control/roles/list*"], //角色列表

		["3-300100-1", "/control/helpType/list*"], //帮助分类
		["3-300100-2", "/control/help/list*"], //帮助列表

		["3-300200-1", "/control/template/list*"], //模板列表

		["4-400100-1", "/control/pageView/list*"], //浏览量列表
		
		["4-400200-1", "/control/filePackage/list*"], //压缩文件列表
		["4-400300-1", "/control/systemNotify/list*"], //系统通知列表
		["4-400400-1", "/control/topicUnhidePlatformShare/list*"], //解锁话题隐藏内容分成
		["4-400400-2", "/control/questionRewardPlatformShare/list*"], //问答悬赏平台分成
		["4-400500-1", "/control/mediaProcessQueue/list*"], //媒体待处理列表
		["4-400500-2", "/control/mediaProcessSetting/manage/edit*"], //媒体处理设置
		["4-400600-1", "/control/reportType/list*"], //举报分类
		["4-400600-2", "/control/report/list*"], //举报列表

		["5-500100-1", "/control/systemSetting/manage/edit*"], //基本设置
		["5-500100-2", "/control/systemSetting/manage?method=maintainData*"], //维护数据
		["5-500100-3", "/control/filterWord/manage?method=view*"], //敏感词
		["5-500100-4", "/control/dataBase/list*"], //数据库备份/还原
		["5-500100-5", "/control/systemSetting/manage?method=nodeParameter*"], //服务器节点参数
		["5-500100-6", "/control/upgrade/manage?method=upgradeSystemList*"], //升级
		["5-500200-1", "/control/onlinePaymentInterface/list*"], //在线支付接口
		["5-500300-1", "/control/smsInterface/list*"], //短信接口列表
		["5-500300-2", "/control/sendSmsLog/list*"], //短信发送错误日志
		["5-500400-1", "/control/fileSystemInterface/list*"], //文件系统接口列表
		["5-500500-1", "/control/thirdPartyLoginInterface/list*"], //第三方登录接口列表
		["5-500600-1", "/control/quartz/list*"], //定时任务列表
		["5-500700-1", "/control/thumbnail/list*"], //缩略图列表
	]);


	//顶部导航数量索引
	const maxTopIndexCount = () => {
		let indexList = new Array<string>();
		for (let item of navigationMenuIndexMapping){
			let topIndex = item[0].split("-")[0];
			
			if (!indexList.includes(topIndex)) {
				indexList.push(topIndex);
			}
        }
		return indexList.length;
	}

	//顶部导航菜单校验权限
	const topNavigationMenuVerifyPermission = (index:string) => {
		for (let item of navigationMenuIndexMapping){
			if(item[0].startsWith(index+"-")){
				if(verifyPermissionMenu(item[1],'get')){
					//顶部导航展示项
					if (!state.topNavigationDisplayItem.includes(index)) {
						state.topNavigationDisplayItem.push(index);
					}
					return true;
				}
			}
		}
		nextTick(()=>{
			if(state.topNavigationActiveIndex == index){//如果已选中当前项
				if(state.topNavigationDisplayItem != null && state.topNavigationDisplayItem.length >0){
					state.topNavigationActiveIndex = state.topNavigationDisplayItem[0];//选中第一项
				}else{
					
					if(maxTopIndexCount() >= parseInt(state.topNavigationActiveIndex)){
						state.topNavigationActiveIndex = "1";//选中第一项
					}else{
						state.topNavigationActiveIndex = String(parseInt(state.topNavigationActiveIndex)+1);//选中下一项
					}
					
				}
			}
		})
	}

	//左侧导航菜单校验权限
	const letfNavigationMenuVerifyPermission = (index:string) => {
        for (let item of navigationMenuIndexMapping){
			if(item[0].startsWith(index+"-")){
				if(verifyPermissionMenu(item[1],'get')){
					return true;
				}
			}
        }
		return false;
	}

	//导航子菜单校验权限
	const navigationSubMenuVerifyPermission = (index:string) => {
		let path = navigationMenuIndexMapping.get(index);
		if(path){
			return verifyPermissionMenu(path,'get')
		}
		return false;
	}
    




	//监听数据
	watch(() => state.topNavigationActiveIndex, (val, old) => {
        window.sessionStorage.setItem('topNavigationActiveIndex', state.topNavigationActiveIndex);
    })
	watch(() => state.linkTag, (val, old) => {
        window.sessionStorage.setItem('linkTag', JSON.stringify(state.linkTag));
    },{deep: true})
	watch(() => state.leftNavigationMenuOpeneds, (val, old) => {
        window.sessionStorage.setItem('leftNavigationMenuOpeneds', JSON.stringify(state.leftNavigationMenuOpeneds));
    },{deep: true})
	watch(() => state.leftNavigationMenuExpand, (val, old) => {
		window.sessionStorage.setItem('leftNavigationMenuExpand', JSON.stringify(strMapToObj(state.leftNavigationMenuExpand)));
    },{deep: true})


	
	// 监听路由 历史记录
	watch(() => route.path, (newValue) => {
		nextTick(()=>{//渲染结束再监听，防止识别窗口错误
			//当前窗口索引
			let currentWindowIndex = "";
			let _linkTag = window.sessionStorage.getItem('linkTag');
			if(_linkTag != null){
				let linkTag = JSON.parse(_linkTag);
				
				for(let i=0; i<linkTag.length; i++){
					let _tag = linkTag[i];
					if(_tag.active){//如果已激活
						currentWindowIndex = _tag.index;
						break;
					}
				}
			}

			if(currentWindowIndex != ''){//如果URL对应当前窗口 	
				let isRecordPath = true;//是否记录路径 
				let windowBrowseStatus = store.windowBrowseStatus.get(currentWindowIndex);
				if(windowBrowseStatus != null){
					isRecordPath = windowBrowseStatus.isRecordPath;
				}
				//删除窗口浏览状态
				store.deleteWindowBrowseStatus(currentWindowIndex);
				
				if(!isRecordPath){//如果不记录路径
					//窗口浏览状态
					let _windowBrowseStatus:any = new Object();
					_windowBrowseStatus.isRecordPath = true;//是否记录路径 
					_windowBrowseStatus.step = windowBrowseStatus.step;	//步长 0为没有执行"前进/后退"命令
					
					let obj:any =new Object();
					obj.key = currentWindowIndex;
					obj.value = _windowBrowseStatus;
					//添加窗口浏览状态
					store.addWindowBrowseStatus(obj)
				}else{
					//浏览URL全路径集合
					let fullPathList = new Array();
					
					
					//获取当前窗口对应的URL集合
					store.historyPath.forEach(function(value,key){
						if(key == currentWindowIndex){
							fullPathList = value;
						}
					});
					
					
					
					if(windowBrowseStatus != null && windowBrowseStatus.step <0){//如果执行过"前进/后退"
						let count = windowBrowseStatus.step*-1;
						for(let i = fullPathList.length-1; i>=0; i--){//倒序循环
							
							//删除"前进/后退"到的URL之后的URL
							if(count > 0){
								fullPathList.splice(i, 1);
							}
							count--;
						}
						let obj:any =new Object();
						obj.key = currentWindowIndex;
						obj.value = fullPathList;
						store.addHistoryPath(obj);
						
						
					}
					
					
					
					let isSame = false;//是否和上一条记录相同
					//如果和上一条记录相同，则本条不记录
					if(fullPathList.length >0 && fullPathList[fullPathList.length-1]){
						let fullPath = fullPathList[fullPathList.length-1];
						if(fullPath.url == route.fullPath){
							isSame = true;
						}
					}
					if(!isSame){
						//如果当前组超出100条历史记录，则删除超出部分
						if(fullPathList.length >=100){
							fullPathList.shift();//删除第一个
						}
						
						
						let fullPath:any =new Object();
						fullPath.url = route.fullPath;
						fullPath.scrollTop = 0;
						
						fullPathList.push(fullPath);
						
						let obj:any =new Object();
						obj.key = currentWindowIndex;
						obj.value = fullPathList;
						store.addHistoryPath(obj);
						
						
					}
					
					
				}
				
				
			}
			
			//窗口最新URL集合
			let new_windowNewestURLList = new Array();
			
			//窗口旧URL集合
			let old_windowNewestURLList = new Array();
			
			let _windowNewestURLList = window.sessionStorage.getItem('windowNewestURLList');
			if(_windowNewestURLList != null){
				let _old_windowNewestURLList = JSON.parse(_windowNewestURLList);
				if(_old_windowNewestURLList != null && _old_windowNewestURLList.length >0){
					old_windowNewestURLList = _old_windowNewestURLList;
				}
			}
			
			
			
			let new_linkTag = window.sessionStorage.getItem('linkTag');
			if(new_linkTag != null){
				let linkTag = JSON.parse(new_linkTag);
				if(linkTag != null && linkTag.length >0){
					for(let i=0; i<linkTag.length; i++){
						let _tag = linkTag[i];
						
						
						if(_tag.active){//如果已激活
							let flag = false;//是否已添加窗口URL
							for(let j=0; j<old_windowNewestURLList.length; j++){
								let windowNewestURL = old_windowNewestURLList[j];
								if(windowNewestURL.index == _tag.index){
									windowNewestURL.url = route.fullPath;
									flag = true;
								}
							}
							
							if(!flag){
								old_windowNewestURLList.push({
									index:_tag.index,
									url: route.fullPath,
								});
								
							}
						}
						
						
						for(let j=0; j<old_windowNewestURLList.length; j++){
							let windowNewestURL = old_windowNewestURLList[j];
							if(windowNewestURL.index == _tag.index){
								new_windowNewestURLList.push(windowNewestURL);
								break;
							}
						}
					}
					
				}
				
			}
			//保存窗口最后打开的URL
			window.sessionStorage.setItem('windowNewestURLList', JSON.stringify(new_windowNewestURLList));
		    	
		})
	},{immediate: true,deep: true})

	
    onMounted(() => {
        miniMode();
		
		//初始化
		queryManageFramework();
		
		let _topNavigationActiveIndex = window.sessionStorage.getItem('topNavigationActiveIndex');
		if(_topNavigationActiveIndex != null){
			state.topNavigationActiveIndex = _topNavigationActiveIndex;
		}
		 //左侧导航菜单自动展开
		 leftNavigationMenuAutoOpen();

		let _linkTag = window.sessionStorage.getItem('linkTag');
		if(_linkTag != null){
			state.linkTag = JSON.parse(_linkTag);
		}
		let _leftNavigationMenuExpand = window.sessionStorage.getItem('leftNavigationMenuExpand');
		if(_leftNavigationMenuExpand != null){
			state.leftNavigationMenuExpand = objToStrMap(JSON.parse(_leftNavigationMenuExpand));
		}
		let _leftNavigationMenuOpeneds = window.sessionStorage.getItem('leftNavigationMenuOpeneds');
		if(_leftNavigationMenuOpeneds != null){
			state.leftNavigationMenuOpeneds = JSON.parse(_leftNavigationMenuOpeneds);
		}
		
		
		
		if(state.linkTag.length ==0){//如果标签为0
			//创建窗口
			createWindow("0-000000-0");
		}
		
		//当前路由是否和窗口最后打开的URL相同
		let sameRoute = false;
		
		//窗口最后打开的URL
		let _windowNewestURLList = window.sessionStorage.getItem('windowNewestURLList');
		if(_windowNewestURLList != null){
			let windowNewestURLList = JSON.parse(_windowNewestURLList);
			if(windowNewestURLList != null && windowNewestURLList.length >0){
				for(let i=0; i<windowNewestURLList.length; i++){
					let windowNewestURL = windowNewestURLList[i];
					
					//浏览URL全路径集合
			    	let fullPathList = new Array();
			    	let fullPath:any =new Object();
			    	fullPath.url = windowNewestURL.url;
			    	fullPath.scrollTop = 0;
			    	fullPathList.push(fullPath);
					//写入历史记录
			    	let obj:any =new Object();
				    obj.key = windowNewestURL.index;
				    obj.value = fullPathList;
					store.addHistoryPath(obj)
				    
				    if(route.fullPath == windowNewestURL.url){
				    	
				    	sameRoute = true;
				    }
				    
				}
			}
		}
		

		if(!sameRoute){
			let fullPath = route.path;//当前的路由
			let linkList = store.allLinkList;
			for(let i=0; i<linkList.length; i++){
	    		let link = linkList[i];
	    		
	    		if(link.path == fullPath){
	    			let flag = false;
	    			if(link.query != undefined && link.query.method != undefined){
	    				if(link.query.method == route.query.method){
	    					flag = true;
	    				}
	    				
	    			}else{
	    				flag = true;
	    			}
	    			if(flag){//如果请求的URL属于配置的URL
	    				
	    				//是否已有打开窗口
	    		    	let isOpenWindow = false;
	    		    	for(let j=0; j<state.linkTag.length; j++){
	    		    		let tag = state.linkTag[j];
	    		    		if(tag.index == link.meta.index || tag.index == link.meta.parent){
	    		    			
	    		    			isOpenWindow = true;
	    		    			
	    		    			//所有标签取消选中
	    		    	    	for(let k=0; k<state.linkTag.length; k++){
	    		    	    		let tag = state.linkTag[k];
	    		    	    		if(tag.active){
	    		    	    			let newTab:any =new Object();
	    		    	    	    	newTab.name = tag.name;
	    		    	    	    	newTab.index = tag.index;
	    		    	    	    	newTab.active = false;//是否激活
	    		    	    			state.linkTag.splice(k,1,newTab);
	    		    	    		}
	    		    	    	}
	    		    			
	    		    			
	    		    			//激活当前标签
	    		    			let newTab:any =new Object();
	    		    	    	newTab.name = tag.name;
	    		    	    	newTab.index = tag.index ;
	    		    	    	newTab.active = true;//是否激活	
	    		    			state.linkTag.splice(j,1,newTab);
	    		    			
	    		    			break;
	    		    		}
	    		    		
	    		    	}
	    		    	
	    		    	
	    		    	if(link.meta.index == undefined){//如果当前路由没有导航索引
	    		    		let parentIndex = link.meta.parent;
	    		    		for(let p=0; p<linkList.length; p++){
	    		        		let parent_link = linkList[p];
	    		        		if(parent_link.meta.index == parentIndex){
	    		        			
	    		        			
	    		        			if(!isOpenWindow){//如果还没打开窗口
	    	        					//所有标签取消选中
	    	    		    	    	for(let k=0; k<state.linkTag.length; k++){
	    	    		    	    		let tag = state.linkTag[k];
	    	    		    	    		if(tag.active){
	    	    		    	    			let newTab:any =new Object();
	    	    		    	    	    	newTab.name = tag.name;
	    	    		    	    	    	newTab.index = tag.index;
	    	    		    	    	    	newTab.active = false;//是否激活
	    	    		    	    			state.linkTag.splice(k,1,newTab);
	    	    		    	    		}
	    	    		    	    	}
	    	    		    	    	
	    	        					let tab:any =new Object();
	    	    		    	    	tab.name = parent_link.meta.title;
	    	    		    	    	tab.index = parent_link.meta.index;
	    	    		    	    	tab.active = true;//是否激活
	    	    		    	    	state.linkTag.push(tab);
	    	        				}
	    		        			
	    		        			
	    		        			break;
	    		        		}
	    		        		
	    		    		}
	    		    		
	    		    		
	    		    		
	    		    		
	    		    	}else{
	    		    		if(!isOpenWindow){//如果还没打开窗口
	        					//所有标签取消选中
	    		    	    	for(let k=0; k<state.linkTag.length; k++){
	    		    	    		let tag = state.linkTag[k];
	    		    	    		if(tag.active){
	    		    	    			let newTab:any =new Object();
	    		    	    	    	newTab.name = tag.name;
	    		    	    	    	newTab.index = tag.index;
	    		    	    	    	newTab.active = false;//是否激活
	    		    	    			state.linkTag.splice(k,1,newTab);
	    		    	    		}
	    		    	    	}
	    		    	    	
	        					let tab:any =new Object();
	    		    	    	tab.name = link.meta.title;
	    		    	    	tab.index = link.meta.index;
	    		    	    	tab.active = true;//是否激活
	    		    	    	state.linkTag.push(tab);
	        				}
	    		    	}
	    				break;
	    			}
	    		}
	    	}
		}
        
    }) 

</script>
<style scoped lang="scss">

.manageModule{
	height:100%;
	/* 顶部菜单栏 */
	.el-header{
		padding: 0px 0px 0px 0px;
		/**
		-webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
		box-shadow: 0 2px 4px rgb(0 0 0 / 8%);**/
			/** box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);**/
			/*box-shadow: rgb(0 0 0 / 8%) 0 5px 5px -5px;*/
			/* box-shadow: 0 2px 4px 0 rgb(114 144 179 / 6%);*/
		z-index: 1;
		
		height: auto !important;
		/* min-height: 115px !important;*/
		.header-box{
			background: #fff;
			.el-row{
				margin-left: 0px !important;
				margin-right: 0px !important;
				.el-col{
					padding-left: 0px !important;
					padding-right: 0px !important;
				}
			}
			/* 顶部菜单栏--导航菜单 */
			.navigation-menu-header{
				margin-left: 0px;
				.el-menu-item{
					font-size: 18px;
				}
			}
			.navigation-menu-header>.el-menu-item{
				height: 50px;
				line-height: 50px;
			}
			.navigation-menu-header.el-menu--horizontal {
				border-bottom: solid 1px transparent;
			}
			/* 顶部菜单栏--浏览按钮 */
			.browseButtonMenu{
				display: flex;
				justify-content: flex-start;
				.nav-list-item {
					width: 60px;
					display: block;
					float: right;
					text-align: center;
					.browserButton{
						display:inline-block;border-radius:100%;margin-top: 8px;
						.circle{
							border-radius:100%;
							width: 38px;height: 38px;background: #f1f5f7;
							-webkit-transition:0.4s;
							transition:0.4s;
							&:hover{
								box-shadow: 0 0 0 1px #f1f5f7,0 0 0 2px #f1f5f7;
								cursor: pointer;
							}
							.icon{
								font-size: 26px;color: #409eff;margin-top: 6px;display: inline-block;
							}
						}
					}
				}
			}
			.homeMenu {
				display: flex;
				justify-content: flex-end;
				.nav-list-icon {
					width: 60px;
					display: block;
					float: right;
					text-align: center;
					.link-icon {
						background: #fff;
						border-radius: 50%;
					/**	-webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
								box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);**/
								
						background-color: #f1f5f7;
						display: inline-block;
						height: 34px;
						position: relative;
						width: 34px;
						text-align: center;
						margin-top: 12px;
						i{
							font-size: 20px;margin-top: 7px; color:#53a8ff;display: inline-block;
						}
					}
				}
				.nav-list-user {
					display: block;
					float: right;
					text-align: right;
					margin-left: 13px;
					&:hover{
						cursor: pointer;
					}
					.avatarImg{
						display:inline-block;
						border-radius:100%; 
						margin-top: 8px;
						.avatar{
							border-radius:100%;
						}
					}
					.avatarIcon{
						display:inline-block;
						border-radius:100%; 
						margin-top: 8px;
						.el-avatar {
							background: #ebebeb;
							color: #cccccc;
						}
						.el-avatar--icon {
							font-size: 28px;
						}
					}
					.user-info {
						float: right;padding-left: 5px;padding-right: 25px;text-align: left;min-width: 44px;margin-top: 10px;
						.name {
							display: block;
							font-size: 15px;
							line-height: 18px;
							max-width:100px;
							overflow:hidden;
							text-overflow:ellipsis; 
							white-space:nowrap;
						}
						.role {
							display: block;
							color: #acacac;
							font-size: 12px;
							line-height: 16px;
						}
					}
					.more{
						font-size: 13px;position: absolute;right: 10px;top: 22px;color: #acacac;
					}
				}
			}
			:deep(.tagMenu){
				background: #f8f8f8;
				padding: 1px 14px 9px 14px;
				margin-top:6px;
				/**white-space:nowrap;**/
				border-radius:3px;
				margin-bottom: 10px;
				.item{
					margin-right:8px;
					margin-top:8px;
					float:left; white-space:nowrap;
				}
				
				.el-tag{
					border-color: transparent;
					font-size: 14px;
					color: #606266;
					cursor: pointer;
					&:hover {
						background-color: #ebebeb;
					}
					.el-tag__close{
						color: #606266;
						&:hover {
							color: #FFF;
							background-color: #919191;
						}
					}
				}
				.active{
					.el-tag{
						color: #409EFF;
						&:hover{
							background-color: #d9ecff;
						}
						.el-tag__close{
							color: #409EFF;
							&:hover {
								color: #FFF;
								background-color: #409EFF;
							}
						}
					}
				} 
			}

		}
	}
	/* 左侧菜单栏 */
	.el-aside {
		background-color: #fff;
		padding-bottom: 50px;
		width: auto !important;
		min-width: 64px;
		max-width: 200px;
	}
	/* 左侧菜单栏 展开 */
	.aside-expand {
		min-width: 200px;
	}
	
	/* 左侧菜单栏 收缩 */
	.aside-shrink {
		min-width: 64px;
	}
	/* 迷你模式 */
	.mini{
		.aside-shrink {
			display: none;
		}
	}
	.el-aside {
		&::-webkit-scrollbar {
			display: none; /* Chrome Safari */
		}
		scrollbar-width: none; /* firefox */
		-ms-overflow-style: none; /* IE 10+ */
		overflow-y: hidden;
		.logo-wrap{
			margin-left: 8px;
			.logo {
				background: url(@/assets/images/logo.gif) no-repeat 0px 0px; width: 180px; height: 50px
			}
		}
		.logo-icon{
			margin-left: -8px;
			.logo {
				background: url(@/assets/images/logo.gif) no-repeat 0px 0px; width: 60px; height: 50px
			}
		}
		.navigation-menu-left {
			border-right: solid 1px transparent; 
			margin-top: 2px;
			.el-sub-menu{
				.fa {
					vertical-align: middle;
					margin-right: 10px;
					margin-left:5px;
					width: 24px;
					text-align: center;
					font-size: 16px;
					
				}
				.el-menu-item{
					text-indent:10px;/*二级菜单缩进*/
				}
				.is-active{
					background-color: #ecf5ff;
				}
			}
			.is-opened{
				:deep(.el-sub-menu__title){
					color: #409eff !important;
					.icon {
						color: #409eff;
					}
				}
			}
		}
	}
	/* 左侧菜单栏切换按钮 */
	.leftNavigationArrow{
		position: relative;
		.toggleArrow{
			position: absolute;
			width: 10px;
			height: 50px;
			right:-10px;
			top: calc(50% - 10px);
			-webkit-transform: translate(0, -50%);
			transform: translate(0, -50%);
			cursor: pointer;
			color: #909399;
			z-index:999;
			&:hover{
				svg{
					path{
						fill: #ecf5ff;
						
					}
				}
				&:hover{
					color: #55a8ff;
				}
			}
			i.icon {
				position: absolute;
				margin-top: 19px;
				margin-left: -2px;
				
			}
		}
	}
	/* 内容区 */
	.el-main {
		background-color: #f8f8f8;
		padding: 14px;
		min-width: 1020px;/*屏幕最小宽度*/
	} 
}
</style>