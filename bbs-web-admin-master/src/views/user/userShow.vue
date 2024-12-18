<!-- 用户查看 -->
<template>
    <div class="main">
        <div class="navbar">
            <!-- 返回上级节点 -->
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/user/manage/edit', query:{ id : $route.query.id,beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">修改</el-button>
            
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allTopic*','get')" @click="$router.push({path: '/admin/control/user/manage/allTopic', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">发表的话题</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allComment*','get')" @click="$router.push({path: '/admin/control/user/manage/allComment', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">发表的评论</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allReply*','get')" @click="$router.push({path: '/admin/control/user/manage/allReply', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">发表的回复</el-button>
            
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allQuestion*','get')" @click="$router.push({path: '/admin/control/user/manage/allQuestion', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">提交的问题</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allAnswer*','get')" @click="$router.push({path: '/admin/control/user/manage/allAnswer', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">提交的答案</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=allAnswerReply*','get')" @click="$router.push({path: '/admin/control/user/manage/allAnswerReply', query:{id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">提交的答案回复</el-button>
            
            
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/privateMessage/manage?method=privateMessageList&*','get')" @click="$router.push({path: '/admin/control/privateMessage/manage/privateMessageList', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">私信</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/systemNotify/manage?method=subscriptionSystemNotifyList&*','get')" @click="$router.push({path: '/admin/control/systemNotify/manage/subscriptionSystemNotifyList', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">系统通知</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/remind/manage?method=remindList&*','get')" @click="$router.push({path: '/admin/control/remind/manage/remindList', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">提醒</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/favorite/list*','get')" @click="$router.push({path: '/admin/control/favorite/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">收藏夹</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/like/list*','get')" @click="$router.push({path: '/admin/control/like/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">点赞</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/follow/list*','get')" @click="$router.push({path: '/admin/control/follow/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">关注</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/follower/list*','get')" @click="$router.push({path: '/admin/control/follower/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">粉丝</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/membershipCard/manage?method=membershipCardOrderList*','get')" @click="$router.push({path: '/admin/control/membershipCard/manage/membershipCardOrderList', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">会员卡订单</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/redEnvelope/giveRedEnvelope/list*','get')" @click="$router.push({path: '/admin/control/redEnvelope/giveRedEnvelope/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">发红包</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/redEnvelope/receiveRedEnvelope/list*','get')" @click="$router.push({path: '/admin/control/redEnvelope/receiveRedEnvelope/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">收红包</el-button>	
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/pointLog/list*','get')" @click="$router.push({path: '/admin/control/pointLog/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">积分日志</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/paymentLog/list*','get')" @click="$router.push({path: '/admin/control/paymentLog/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">支付日志</el-button>
            
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=payment&*','post')" @click="rechargeUI()">充值</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/userReport/list*','get')" @click="$router.push({path: '/admin/control/userReport/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">举报</el-button>
            
            <el-button type="primary" plain  v-if="verifyPermissionMenu('/control/userLoginLog/list*','get')" @click="$router.push({path: '/admin/control/userLoginLog/list', query:{ id : $route.query.id,userName : encodeURIComponent(state.user.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">登录日志</el-button>
            <el-button type="primary" plain  v-if="verifyPermissionMenu('/control/user/manage?method=updateAvatar*','post')" @click="changeAvatarUI()">更换头像</el-button>

            <el-button type="primary" plain  v-if="verifyPermissionMenu('/control/user/manage?method=cancelAccount*','post')" @click="cancelAccount()">注销账号</el-button>
        </div>
        
        
        <div class="rechargeModule">
            
            <el-dialog title="充值" width="80%" v-model="state.popup_recharge" @close="closeRechargeWindow">
                
                <div class="data-form" >
                    <el-form label-width="130px"  @submit.native.prevent>
                        <el-form-item label="充值方式">
                            <el-radio-group v-model="state.mode" size="large">
                                <el-radio-button :label="1">支付流水号充值</el-radio-button>
                                <el-radio-button :label="2">增减预存款</el-radio-button>
                                <el-radio-button :label="3">增减积分</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        
                        <el-form-item label="流水号支付金额" :required="true" :error="error.paymentRunningNumberAmount" v-if="state.mode==1">
                            <el-col :span="10">
                                <el-input v-model.trim="state.paymentRunningNumberAmount" maxlength="10" :clearable="true" show-word-limit></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="流水号" :required="true" :error="error.paymentRunningNumber" v-if="state.mode==1">
                            <el-row :gutter="10">
                                <el-col :span="22">
                                    <el-input v-model.trim="state.paymentRunningNumber" maxlength="40" :clearable="true" show-word-limit></el-input>
                                </el-col>
                                <el-col :span="2">
                                    <el-button :icon="Search" size="large" @click="paymentVerificationLogUI">流水号</el-button>
                                </el-col>
                            </el-row>
                            <div class="form-help" >流水号有效期为发起支付7天内</div>
                        </el-form-item>
                        <el-form-item label="备注" v-if="state.mode==1">
                            <el-input v-model="state.paymentRunningNumber_remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" ></el-input>
                        </el-form-item>
                        
                        <el-form-item label="预存款" :required="true" :error="error.deposit" v-if="state.mode==2">
                            <el-row :gutter="10">
                                <el-col :span="5">
                                    <el-select v-model="state.deposit_symbol" >
                                        <el-option v-for="item in state.deposit_symbol_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model.trim="state.deposit" maxlength="10" :clearable="true" show-word-limit></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="备注" v-if="state.mode==2">
                            <el-input v-model="state.deposit_remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" ></el-input>
                        </el-form-item>
                        
                        <el-form-item label="积分" :required="true" :error="error.point" v-if="state.mode==3">
                            <el-row :gutter="10">
                                <el-col :span="5">
                                    <el-select v-model="state.point_symbol" >
                                        <el-option v-for="item in state.point_symbol_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model.trim="state.point" maxlength="10" :clearable="true" show-word-limit></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="备注" v-if="state.mode==3">
                            <el-input v-model="state.point_remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" ></el-input>
                        </el-form-item>
    
                        <el-form-item>
                            <el-button type="primary" size="large" class="submitButton"  @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                        </el-form-item> 
                    </el-form>
                </div>
                
            </el-dialog>
            
            <div class="data-form">
                <el-dialog title="流水号列表" width="70%"  v-model="state.popup_paymentVerificationLog" >
                    <div class="dialog-data-table" >
                        <el-table :data="state.tableData" @cell-click="cellExpandRow" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                            <el-table-column label="选择" align="right" width="60">
                                <template #default="scope">
                                    <el-radio v-model="state.paymentRunningNumber" :label="state.paymentVerificationLogIdList[scope.$index]" >&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="id" label="流水号" align="center" ></el-table-column>
                            <el-table-column prop="paymentAmount" label="支付金额" align="center" width="120"></el-table-column>
                            <el-table-column prop="times" label="时间" align="center" width="180"></el-table-column>
                        </el-table>
                        <div class="pagination-wrapper" v-if="state.isShowPage">
                            <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
        
        <div class="changeAvatarModule">
            <el-dialog title="更换头像" width="630px" v-model="state.popup_changeAvatar" @close="closeChangeAvatarWindow">
                <div class="original-box">
                    <img ref="originalImageRef" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="原图"/>
                </div>
                <div class="preview-pane-square">
                    <div ref="previewSquareRef" class="preview-square"></div> 
                </div>
                <div class="preview-pane-round">
                    <div ref="previewRoundRef"  class="preview-round"></div> 
                </div>
                <div class="bottomInfo">
                    <div class="button-box">
                        <i id="progressBar" class="progressBar"></i>
                        <div class="container">               
                            <div class="progress">
                                <el-progress :text-inside="true" :stroke-width="20" :percentage="state.progressPercent" />
                            </div>
                            <div>
                                <el-upload ref="selectImageRef" v-model:file-list="fileList" action="#" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :accept="'image/*'">
                                    <el-button type="primary" size="large" class="selectImage" plain >选择图片</el-button>
                                </el-upload>
                            </div>
                            <div>
                                <el-button type="primary" size="large" class="uploadImage" @click="uploadAvatar" :disabled="state.submitForm_disabled">上传</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
        
        </div>
   
        
        <div class="data-view" >
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">账号：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.account}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">呢称：</div></el-col>
                <el-col :span="10"><div class="content">{{state.user.nickname}}</div></el-col>
                <el-col :span="10">
                    
                    <el-image class="avatar" v-if="state.user.avatarName != null && state.user.avatarName != ''" style="width: 120px; height: 120px;" fit="contain" :src="state.user.avatarPath + state.user.avatarName+'?version='+state.user.userVersion" :preview-src-list="[state.user.avatarPath+state.user.avatarName+'?version='+state.user.userVersion]" hide-on-click-modal ></el-image>
                    
                
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" v-if="state.user.cancelAccountTime != '-1'">
                <el-col :span="4"><div class="name">注销账号时间：</div></el-col>
                <el-col :span="20"><div class="content remind">{{state.user.cancelAccountTime}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">注册时间：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.registrationDate}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex" v-if="state.user.type == 20">
                <el-col :span="4"><div class="name">手机号：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.mobile}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">类型：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.user.type == 10">账号密码用户</span>
                        <span v-if="state.user.type == 20">手机用户</span>
                        <span v-if="state.user.type == 30">邮箱用户</span>
                        <span v-if="state.user.type == 40">微信用户</span>
                        <span v-if="state.user.type == 80">其他用户</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">等级：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.gradeName}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">Email地址：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.email}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">密码提示问题：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.issue}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">状态：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.user.state == 1">启用</span>
                        <span v-if="state.user.state == 2">停用</span>
                        <span v-if="state.user.state == 11">启用时删除</span>
                        <span v-if="state.user.state == 12">停用时删除</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">预存款：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.deposit}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">积分：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.point}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">备注：</div></el-col>
                <el-col :span="20"><div class="content">{{state.user.remarks}}</div></el-col>
            </el-row>
            
            <div v-for="(userCustom,index) in state.userCustomList">
                <el-row :gutter="10" type="flex" v-if="userCustom.chooseType ==1">
                    <el-col :span="4"><div class="name">{{userCustom.name}}：</div></el-col>
                    <el-col :span="20">
                        <div class="content">
                            <span v-for="(userInputValue) in userCustom.userInputValueList">{{userInputValue.content}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" v-if="userCustom.chooseType ==2">
                    <el-col :span="4"><div class="name">{{userCustom.name}}：</div></el-col>
                    <el-col :span="20">
                        <div class="content">
                            <span v-for="(value, key) in userCustom.itemValue"><!-- v-if="key==userInputValue.options" -->
                                <span v-for="userInputValue in userCustom.userInputValueList" >	
                                    <span class="blue-tag" v-if="String(key)==userInputValue.options">{{value}}</span>
                                </span>
                            </span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" v-if="userCustom.chooseType ==3">
                    <el-col :span="4"><div class="name">{{userCustom.name}}：</div></el-col>
                    <el-col :span="20">
                        <div class="content">
                            <span v-for="(value, key) in userCustom.itemValue" ><!-- v-if="key==userInputValue.options" -->
                                <span v-for="userInputValue in userCustom.userInputValueList" >	
                                    <span class="blue-tag"  v-if="String(key)==userInputValue.options">{{value}}</span>
                                </span>
                            </span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" v-if="userCustom.chooseType ==4">
                    <el-col :span="4"><div class="name">{{userCustom.name}}：</div></el-col>
                    <el-col :span="20">
                        <div class="content">
                            <span v-for="(value, key) in userCustom.itemValue" ><!-- v-if="key==userInputValue.options" -->
                                <span v-for="userInputValue in userCustom.userInputValueList" >	
                                    <span class="blue-tag" v-if="String(key)==userInputValue.options">{{value}}</span>
                                </span>
                            </span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" v-if="userCustom.chooseType ==5">
                    <el-col :span="4"><div class="name">{{userCustom.name}}：</div></el-col>
                    <el-col :span="20">
                        <div class="content">
                            <span v-for="(userInputValue) in userCustom.userInputValueList">{{userInputValue.content}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">角色：</div></el-col>
                <el-col :span="20" class="userModule">
                    <el-table ref="tableRef" :data="state.userRoleList" tooltip-effect="dark" :row-class-name="tableRowClassName" :show-header="false" stripe style="width: 100%" empty-text="没有角色">
                        <el-table-column label="角色名称" >
                            <template #default="scope">	
                                {{scope.row.name}}
                                <span class="form-help" style="margin-left: 6px" v-if="scope.row.defaultRole">(默认角色)</span>
                                
                            </template>
                        </el-table-column>
                        <el-table-column label="有效期" >
                            <template #default="scope">	
                                <span v-if="!scope.row.defaultRole">{{scope.row.validPeriodEnd}} 到期</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        
            
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'userShow',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.beforeUrl == undefined || to.query.beforeUrl==''){//前一个URL
			let parameterObj:any = new Object;
			parameterObj.path = from.path;
			let query = from.query;
			for(let q in query){
				query[q] = encodeURIComponent(query[q] as string);
			}
			
			parameterObj.query = query;
			//将请求参数转为base62
			let wordArray = enc.Utf8.parse(JSON.stringify(parameterObj));
            let encrypt = enc.Base64url.stringify(wordArray);
			
			let newFullPath = updateURLParameter(to.fullPath,'beforeUrl',encrypt);
			
			to.fullPath = newFullPath;
			
			let paramGroup = to.query;
			paramGroup.beforeUrl = encrypt;
			to.query = paramGroup;
		}
        next()
    }
}
</script>


<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable, UploadInstance, UploadUserFile } from 'element-plus';
    import { processErrorInfo, updateURLParameter,verifyPermissionMenu } from '@/utils/tool';
    import { SourceUrl, User, UserRole, UserCustom } from '@/types';
    import { enc} from 'crypto-js';
    import { Search } from '@element-plus/icons-vue'
    import dayjs from "dayjs"
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const tableRef = ref<InstanceType<typeof ElTable>>();
    const originalImageRef = ref<HTMLImageElement>()//原图
    const previewSquareRef = ref<HTMLElement>()//预览方框
    const previewRoundRef = ref<HTMLElement>()//预览圆框
    const selectImageRef = ref<UploadInstance>()//选择图片
    const fileList = ref<UploadUserFile[]>()//图片列表
        

 

    const state = reactive({
        popup_recharge:false,//是否弹出充值窗口
        mode:2,//充值方式
        paymentRunningNumberAmount:'',//支付流水号充值--支付金额
        paymentRunningNumber:'',//支付流水号充值--流水号
        paymentRunningNumber_remark:'',//支付流水号充值--备注
        
        deposit_symbol:'+',//增减预存款--增减金额
        deposit:'',//增减预存款--预存款
        deposit_remark:'',//增减预存款--备注
        deposit_symbol_options: [{
            value:  '+',
            label: '增加'
        }, {
            value:  '-',
            label: '减少'
        }],

        point_symbol:'+',//增减积分--增减积分
        point:'',//增减积分--积分
        point_remark:'',//增减积分--备注
        point_symbol_options: [{
            value:  '+',
            label: '增加'
        }, {
            value:  '-',
            label: '减少'
        }],
        
        
        
        popup_paymentVerificationLog:false,//是否弹出支付校验日志窗口
        
        paymentVerificationLogIdList: [] as Array<string>,
        tableData: [],//表格内容
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        
        
        popup_changeAvatar:false,//是否弹出更换头像窗口
        avatarCropper:null as any,//头像Cropper
        progressPercent: 0, // 进度条默认为0

        id:'',
        user:{} as User,
        userRoleList:[] as Array<UserRole>,
        userCustomList:[] as Array<UserCustom>,
        
        submitForm_disabled:false,//提交按钮是否禁用
        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });
    const error = reactive({
        paymentRunningNumberAmount:'',
        paymentRunningNumber:'',
        paymentRunningNumber_remark:'',//支付流水号充值--备注
        deposit_symbol:'',//增减预存款--增减金额
        deposit:'',//增减预存款--预存款
        deposit_remark:'',//增减预存款--备注
        point_symbol:'',//增减积分--增减积分
        point:'',//增减积分--积分
        point_remark:'',//增减积分--备注
    });


    //隐藏行
    const tableRowClassName = ({row,rowIndex}: {row: any,rowIndex: number}) => {
        //if(!row.selected){
        //	return 'hidden-row';
        //}
        return '';
    }

    //查询用户
    const queryUser = () => {
        state.userRoleList.length = 0;

        proxy?.$axios({
            url: '/control/user/manage',
            method: 'get',
            params: {
                method : 'show',
			    id : state.id,
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "userRoleList"){
			    				state.userRoleList = mapData[key];
			    			}else if(key == "userCustomList"){
			    				state.userCustomList = mapData[key];
			    			}else if(key == "user"){
			    				state.user = mapData[key];
			    				
			    				if(state.user.cancelAccountTime != "-1"){
			    					state.user.cancelAccountTime = dayjs(parseInt(state.user.cancelAccountTime)).format('YYYY-MM-DD HH:mm:ss');
			    				}
			    				
		    				}
			    		}
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });

    }

    //充值UI
    const rechargeUI = () => {
        state.popup_recharge=true;
        
        state.paymentRunningNumberAmount='';//支付流水号充值--支付金额
        state.paymentRunningNumber='';//支付流水号充值--流水号
        state.paymentRunningNumber_remark='';//支付流水号充值--备注
        
        state.deposit_symbol='+';//增减预存款--增减金额
        state.deposit='';//增减预存款--预存款
        state.deposit_remark='';//增减预存款--备注
        
        state.point_symbol='+';//增减积分--增减积分
        state.point='';//增减积分--积分
        state.point_remark='';//增减积分--备注
	    	
    }
    //关闭充值弹出框
    const closeRechargeWindow = () => {
        state.popup_recharge=false;
        state.popup_paymentVerificationLog=false;//关闭弹出支付校验日志窗口
    }
 	    
    //点击单元格选择
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            state.paymentRunningNumber = row.id;
            state.paymentRunningNumberAmount = row.paymentAmount;
            state.popup_paymentVerificationLog=false;
        }
    }
    //支付校验日志UI
    const paymentVerificationLogUI = () => {
        state.popup_paymentVerificationLog=true;//弹出支付校验日志窗口
        
        
        //清空数据
        state.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.currentpage = 1;
        state.totalpage = 1;//服务器返回的long类型已转为String类型
        state.maxresult = 12;
        state.isShowPage = false;//显示分页栏
        
        queryPaymentVerificationLogList(1);
    }
    //分页
    const page = (page:number) => {
        
        queryPaymentVerificationLogList(page);
    }
	    
	    
	//查询支付校验日志
    const queryPaymentVerificationLogList = (page:number) => {
	    state.tableData = [];
	    state.paymentVerificationLogIdList = [];


        proxy?.$axios({
            url: '/control/paymentLog/manage',
            method: 'get',
            params: {
                method : 'ajax_paymentVerificationLogPage',
                paymentModule : 5,
                parameterId :state.user.id,
                userName : state.user.userName,
                page : page
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let pageView = returnValue.data;
			    		let list = pageView.records;
			    		if(list != null && list.length >0){
			    			for(let i = 0; i<list.length; i++){
			    				let paymentVerificationLog = list[i];
			    				state.paymentVerificationLogIdList.push(paymentVerificationLog.id);
			    			
			    			}
			    			
			    			
			    			state.tableData = list;
			 
			    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.currentpage = pageView.currentpage;
							state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.maxresult = pageView.maxresult;
							state.isShowPage = true;//显示分页栏
			    		}
			    	}else if(returnValue.code === 500){//错误
			    		
			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
	}
    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('id', router.currentRoute.value.query.id as string);
        formData.append('type', String(state.mode));
        if(state.mode==1){//支付流水号充值
            formData.append('paymentRunningNumberAmount', state.paymentRunningNumberAmount);
            formData.append('paymentRunningNumber', state.paymentRunningNumber);
            formData.append('paymentRunningNumber_remark',state.paymentRunningNumber_remark);		
        }else if(state.mode==2){//增减预存款
            formData.append('deposit_symbol', state.deposit_symbol);
            formData.append('deposit', state.deposit);
            formData.append('deposit_remark', state.deposit_remark);
        }else if(state.mode==3){//增减积分
            formData.append('point_symbol', state.point_symbol);
            formData.append('point', state.point);
            formData.append('point_remark', state.point_remark);
            
        }

        proxy?.$axios({
            url: '/control/user/manage?method=payment&a=a',//a=a参数的作用是仅增加连接符&
            method: 'post',
            data: formData,
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
			    if(result){
                    let returnValue = JSON.parse(result);
			    	if(returnValue.code === 200){//成功
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
			    		state.popup_recharge=false;
  			    		queryUser();
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.submitForm_disabled = false;//提交按钮disabled状态
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;//提交按钮disabled状态
        });
    }

    //更换头像UI
    const changeAvatarUI = () => {
        state.popup_changeAvatar=true;
        state.progressPercent= 0; // 进度条默认为0
    
        if(state.avatarCropper != null){
            state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            state.avatarCropper = null;
        }
        nextTick(() => {
            originalImageRef.value!.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";//空白1像素图片
            selectImageRef.value!.clearFiles()	//清理上传列表

           
            createCropper();
            
        });
    }

    //创建Cropper
    const createCropper = () => {
        if(originalImageRef.value && previewSquareRef.value && previewRoundRef.value){
            state.avatarCropper = new Cropper(originalImageRef.value, {	
                viewMode: 1,//视图模式
                dragMode: 'crop',//拖拽模式
                initialAspectRatio: 1,//定义裁切框的初始宽高比。默认情况下，它与画布（图像包装器）的纵横比相同。这个值只有在aspectRatio值不进行设置的时候生效
                aspectRatio: 1,//裁剪框的宽高比
                preview:[ previewSquareRef.value, previewRoundRef.value],//添加额外的元素(容器)以供预览
                background: true,//显示容器的网格背景
                autoCropArea: 0.6,//定义自动裁剪面积大小(百分比)和图片进行对比。 就是裁剪框显示的大小
                zoomOnWheel: false,//是否可以通过移动鼠标来放大图像
                minContainerWidth:400,
                minContainerHeight:400,
            });
        }
        
    }

    //关闭更换头像弹出框
    const closeChangeAvatarWindow = () => {
        state.popup_changeAvatar=false;
        
        if(state.avatarCropper != null){
            state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            state.avatarCropper = null;
        }
    }

    //处理上传图片
    const handleChange = (file:any, fileList:any) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }
        
        var reader = new FileReader();
        //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
        reader.readAsDataURL(file.raw);
        reader.onload = (e)=>{
            let dataURL:any = reader.result;
            if(dataURL){
                //将img的src改为刚上传的文件的转换格式
                originalImageRef.value?.setAttribute("src",dataURL);
            }
            // form.avatarCropper.reset();
            if(state.avatarCropper != null){
                state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
                state.avatarCropper = null;
            }
            
            nextTick(()=>{
                createCropper();
            })
        }
        
	}

    //上传头像
    const uploadAvatar = () => {
        let formData = new FormData();
        state.submitForm_disabled = true;

        if(state.avatarCropper == null || originalImageRef.value?.getAttribute("src") == "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
           ElMessage({
                showClose: true,
                message: '请选择图片',
                type: 'error',
                onClose: ()=>{}
            })
            state.submitForm_disabled = false;
            return;
        }

        if(fileList.value != null && fileList.value.length >0){
            formData.append('file', fileList.value[0].raw!);
        }

        // - x裁切框距离左边的距离 
        // - y裁切框距离顶部的距离 
        // - width裁切框的宽度 
        // - height裁切框的高度 
        // - rotate裁切框的旋转的角度 
        // - scaleX缩放图像的横坐标 
        // - scaleY缩放图像的纵坐标 
        let dataObject = state.avatarCropper.getData(true);//返回裁剪区域基于原图片!原尺寸!的位置和尺寸 rounded默认为false 表示是否显示四舍五入后的数据
        formData.append('width', dataObject.width);
        formData.append('height', dataObject.height);
        formData.append('x', dataObject.x); 
        formData.append('y', dataObject.y);

        formData.append('id', state.id);
        
        proxy?.$axios({
            url: '/control/user/manage?method=updateAvatar',
            method: 'post',
            data: formData,
            timeout: 0,// 定义请求超时时间
            onUploadProgress: (progressEvent:any) => {
                if (progressEvent.lengthComputable) {
                    
                    let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
                    if (rate < 1) {
                        //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                        //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                        //等响应回来时，再将进度设为100%
                        // progressEvent.loaded:已上传文件大小
                        // progressEvent.total:被上传文件的总大小
                        state.progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
                    }
                }
            }
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
			    if(result){
                    let returnValue = JSON.parse(result);
			    	if(returnValue.code === 200){//成功
                        state.progressPercent = 100;
                        ElMessage({
                            showClose: true,
                            message: '上传头像成功',
                            type: 'success',
                            onClose: ()=>{}
                        })
                        
                            
                        //删除缓存
                        store.setCacheNumber();
                        state.popup_changeAvatar=false;
                        queryUser();
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.submitForm_disabled = false;
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;
        });
    }

    //注销账号
    const cancelAccount = () => {
        ElMessageBox.confirm('此操作将注销该账号, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            formData.append('id', state.user.id);
        

            proxy?.$axios({
                url: '/control/user/manage?method=cancelAccount',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
                            ElMessage({
                                showClose: true,
                                message: '注销账号成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryUser();
				    	}else if(returnValue.code === 500){//错误
				    		//处理错误信息
                            processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});
				    		
				    		
				    	}
				    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        })
        .catch(() => {
            //取消
        })
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))


        if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
		}
		
		//上级路由解码
		if(router.currentRoute.value.query.beforeUrl != undefined && router.currentRoute.value.query.beforeUrl != ''){
			let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.beforeUrl as string);
            let decrypt = parsedWordArray.toString(enc.Utf8);

			let decryptObject = JSON.parse(decrypt);
			
			let query = decryptObject.query;
			for(let q in query){
				query[q] = decodeURIComponent(query[q]);
			}
			state.sourceUrlObject = {
				path : decryptObject.path,
				query :query
			}
		}
		
		//初始化
		queryUser();
    
    }) 
</script>
<style scoped lang="scss">


/* 更换头像 */
.changeAvatarModule {
	padding-left: 8px;padding-right: 8px;
	padding-top: 8px;
	padding-bottom: 12px;
	background: #fcfcfc;
    .original-box{
        width: 400px;
        height: 400px;
        background-color: #f6f6f6;
        img{
            display: block;
            max-width: 100%;
        }
    }
    /* 截图预览 -- 正方型 */
    .preview-pane-square {
        display: block;
        position: absolute;
        left:450px;
        top: 84px;
        z-index: 2100;	
        .preview-square {
            width: 120px;
            height: 120px;
            overflow: hidden;
        }
    }
    /* 截图预览 -- 圆型 */
    .preview-pane-round {
        display: block;
        position: absolute;
        left:450px;
        top: 250px;
        z-index: 2100;	
        .preview-round {
            width: 120px;
            height: 120px;
            border-radius:100%;
            overflow: hidden;
        }
    }
    .bottomInfo{
        margin-top: 8px;
        border-top: 1px solid #E4E7ED; 
        line-height:34px; 
        position: relative;
        padding-top: 6px;
        .progressBar{
            position: absolute;
            left: -220px;
            font-style:normal;
        }
        .button-box{
            margin-top:15px;
            width:100%;
            text-align:right;
            .container {
                display: flex;
                justify-content: flex-end;
                .progress{
                    width: 300px;
                    position: relative;
                    top: 10px;
                }
                .selectImage{
                    font-size: 15px;
                    padding: 8px 20px;
                    margin-left: 12px;
                }
                .uploadImage{
                    font-size: 15px;
                    padding: 8px 20px;
                    margin-left: 12px;
                }
            }
        }
    }
}
</style>