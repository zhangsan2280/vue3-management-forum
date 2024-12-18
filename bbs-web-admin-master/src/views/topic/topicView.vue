<!-- 话题查看 -->
<template>
    <div class="main blankBackground" >
        <div class="navbar">
            
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
        
        </div>
        <div class="topicViewModule" v-if="state.topic != undefined && state.topic != null && Object.keys(state.topic).length>0">
            <div class="topic-wrap">
                <div class="topicTag">
                    <span class="tag">{{state.topic.tagName}}</span>
                </div>

                
                <div class="operat">
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topic/manage?method=auditTopic*','post')" v-if="state.topic.status == 10" @click="auditTopic(state.topic.id);">审核</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topicLike/list*','get')" @click="$router.push({path: '/admin/control/topicLike/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),itemId:state.topic.id,likeModule:10,topicPage:($route.query.page != undefined ? $route.query.page:'')}})">点赞用户</el-link>
                    
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/redEnvelope/redEnvelopeAmountDistribution/list*','get')" v-if="state.topic.giveRedEnvelopeId != null && state.topic.giveRedEnvelopeId != ''" @click="$router.push({path: '/admin/control/redEnvelope/redEnvelopeAmountDistribution/list', query:{giveRedEnvelopeId:state.topic.giveRedEnvelopeId, visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:'')}})">红包</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topicFavorite/list*','get')" @click="$router.push({path: '/admin/control/topicFavorite/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:'')}})">收藏用户</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topicReport/list*','get')" @click="$router.push({path: '/admin/control/topicReport/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:''), parameterId:state.topic.id,module:10}})">举报</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topic/topicUnhideList*','get')" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/topicUnhideList', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:'')}})">解锁隐藏内容用户</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topic/manage?method=edit*','get')" @click="editTopicUI();">修改</el-link>
                    <el-link class="item" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/topic/manage?method=delete*','post')" @click="deleteTopic(state.topic.id)">删除</el-link>
                    
                </div>
                
                <div class="editTopic-post" v-show="state.editTopicFormView">
                    <div class="editTopic data-form">
                        <el-form label-width="120" @submit.native.prevent>
                            <el-form-item label="标题" :required="true" :error="error.title">
                                <el-input v-model.trim="state.title" maxlength="150" :clearable="true" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="标签" :required="true" :error="error.tagId">
                                <el-select v-model="state.tagIdGroup" @focus="queryTagList" @change="selectedTag" no-match-text="还没有标签" placeholder="选择标签">
                                    <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="排序" :required="true" :error="error.sort">
                                <el-input-number ref="sort_ref" v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                                <div class="form-help" >数字越大越在前</div>
                            </el-form-item>
                            <el-form-item label="允许评论" :required="true">
                                <el-switch v-model="state.allow" ></el-switch>
                            </el-form-item>
                            <el-form-item label="精华" :error="error.essence">
                                <el-switch v-model="state.essence" ></el-switch>
                            </el-form-item>
                            <el-form-item label="状态" :required="true">
                                <el-radio-group v-model="state.status">
                                    <el-radio :label="10">待审核</el-radio>
                                    <el-radio :label="20">已发布</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="内容" :required="true">
                                <textarea ref="topicContentRef" style="width:100%;height:300px;visibility:hidden;"></textarea>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="submitButton" type="primary" size="large" @mousedown.native="editTopic" :disabled="state.editTopic_disabled">提交</el-button>
                                <el-button class="submitButton" type="primary" size="large" plain @mousedown.native="cancelEditTopic();">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
               
                <div class="head">
                    <div class="title">
                        {{state.topic.title}}
                        <span class="essence" v-if="state.topic.essence == true">精华</span>
                        <span class="top" v-if="state.topic.sort >0">置顶</span>
                    </div>
                    <div class="topicInfo clearfix" >
                        <div class="avatar">
                            <el-popover effect="light" trigger="hover" placement="top">
                                <template #default>
                                    <p v-if="state.topic.nickname != null && state.topic.nickname != ''">呢称: {{state.topic.nickname}}</p>
                                    <p>账号: {{state.topic.account}}</p>
                                    <p v-if="state.topic.userRoleNameList != null && state.topic.userRoleNameList.length >0" >角色: 
                                        <span class="topicViewModule_topic-wrap_head_topicInfo_userRoleName" v-for="roleName in state.topic.userRoleNameList" >{{roleName}}</span>
                                    </p> 
                                    
                                    
                                </template>
                                <template #reference v-if="state.topic.isStaff == false">
                                    <div class="avatar-wrapper" >
                                        <div class="avatar-badge" v-if="state.topic.avatarName == null || state.topic.avatarName == ''">
                                            <el-avatar shape="square" :size="64" :icon="UserFilled"></el-avatar>
                                        </div>
                                        <div class="avatar-badge" v-if="state.topic.avatarName != null && state.topic.avatarName != ''">
                                            <el-avatar shape="square" :size="64" :src="state.topic.avatarPath+'100x100/'+state.topic.avatarName"></el-avatar>
                                        </div>
                                    </div>
                                </template>
                                
                                <template #reference v-if="state.topic.isStaff == true">
                                    <div class="avatar-wrapper">
                                        <el-badge value="员工" type="warning" class="avatar-badge" v-if="state.topic.avatarName == null || state.topic.avatarName == ''">
                                            <el-avatar shape="square" :size="64" :icon="UserFilled"></el-avatar>
                                        </el-badge>
                                        <el-badge value="员工" type="warning" class="avatar-badge" v-if="state.topic.avatarName != null && state.topic.avatarName != ''">
                                            <el-avatar shape="square" :size="64" :src="state.topic.avatarPath+'100x100/'+state.topic.avatarName"></el-avatar>
                                        </el-badge>
                                    </div>
                                </template>
                            </el-popover>
                        </div>
                        <div class="userName" title="账号">
                            {{state.topic.account}}
                            <div class="nickname" title="呢称">
                                {{state.topic.nickname}}
                                <span class="topicViewModule_topic-wrap_head_topicInfo_userRoleName" v-if="state.topic.userRoleNameList != null && state.topic.userRoleNameList.length >0" v-for="roleName in state.topic.userRoleNameList" title="角色">{{roleName}}</span> 
                            </div>
                        </div>
                        <div class="postTime" title="发表时间">{{state.topic.postTime}}</div>
                        <div class="viewTotal-icon" title="查看总数"><el-icon><View /></el-icon></div>
                        <div class="viewTotal" title="查看总数">{{state.topic.viewTotal}}次阅读</div>
                        <div class="comment-icon" title="评论总数"><el-icon><ChatDotRound /></el-icon></div>
                        <div class="comment" title="评论总数">{{state.topic.commentTotal}}个评论</div>
                        
                        <div class="ipAddress" title="IP地址">
                            {{state.topic.ip}}&nbsp;{{state.topic.ipAddress}}
                            
                            <div class="statusTagInfo">
                                <span class="orange-tag" v-if="state.topic.status ==10" title="话题状态">待审核</span>
                                <span class="green-tag" v-if="state.topic.status ==20" title="话题状态">已发布</span>
                                <span class="red-tag" v-if="state.topic.status ==110" title="话题状态">待审核员工删除</span>
                                <span class="red-tag" v-if="state.topic.status ==120" title="话题状态">已发布员工删除</span>	
                                <span v-if="state.topic.giveRedEnvelopeId != null && state.topic.giveRedEnvelopeId != ''" class="redEnvelope" title="发红包">红包 {{state.giveRedEnvelope.totalAmount}} 元</span>
                        
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main" :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 10 ? 'reportMark' : ''">
                    <div v-if="state.topic.lastUpdateTime != null" class="lastUpdateTime" >最后修改时间：{{state.topic.lastUpdateTime}}</div>
                    <div :ref="'topic_'+state.topic.id">
                        <RenderTemplate :html="state.topic.content"></RenderTemplate>
                    </div>
                </div>
                
            </div>
        </div>
        
        
        <div class="commentModule">
            <div class="commentList">
                <div class="item" :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 20 && comment.id == router.currentRoute.value.query.commentId ? 'reportMark' : ''" v-for="(comment,index) in state.commentList" :key="comment.id" :commentId="comment.id"  :ref="'comment_'+comment.id">
                    <div class="head">
                        <div class="avatarBox">
                            <el-popover effect="light" trigger="hover" placement="top">
                                <template #default>
                                    <p v-if="comment.nickname != null && comment.nickname != ''">呢称: {{comment.nickname}}</p>
                                    <p>账号: {{comment.account}}</p>
                                    <p v-if="comment.userRoleNameList != null && comment.userRoleNameList.length >0" >角色: 
                                        <span class="topicViewModule_topic-wrap_head_topicInfo_userRoleName" v-for="roleName in comment.userRoleNameList" >{{roleName}}</span>
                                    </p> 
                                    
                                    
                                </template>
                                <template #reference v-if="comment.isStaff == false">
                                    <div class="avatar-wrapper" >
                                        <div class="avatar-badge" v-if="comment.avatarName == null || comment.avatarName == ''">
                                            <el-avatar shape="square" :size="64" :icon="UserFilled"></el-avatar>
                                        </div>
                                        <div class="avatar-badge" v-if="comment.avatarName != null && comment.avatarName != ''">
                                            <el-avatar shape="square" :size="64" :src="comment.avatarPath+'100x100/'+comment.avatarName"></el-avatar>
                                        </div>
                                    </div>
                                </template>
                                
                                <template #reference v-if="comment.isStaff == true">
                                    <div class="avatar-wrapper">
                                        <el-badge value="员工" type="warning" class="avatar-badge" v-if="comment.avatarName == null || comment.avatarName == ''">
                                            <el-avatar shape="square" :size="64" :icon="UserFilled"></el-avatar>
                                        </el-badge>
                                        <el-badge value="员工" type="warning" class="avatar-badge" v-if="comment.avatarName != null && comment.avatarName != ''">
                                            <el-avatar shape="square" :size="64" :src="comment.avatarPath+'100x100/'+comment.avatarName"></el-avatar>
                                        </el-badge>
                                    </div>
                                </template>
                            </el-popover>
                        </div>
                    
                    
                        <span class="info" >
                            <h2 class="clearfix" >
                                
                                <div class="userName">
                                    {{comment.account}}
                                    <div class="nickname" >
                                        {{comment.nickname}}
                                        <i class="userRoleName" v-for="roleName in comment.userRoleNameList" >{{roleName}}</i>
                                        <i class="master" v-if="comment.userName == state.topic.userName && comment.isStaff == state.topic.isStaff">作者</i>
                                    </div>
                                </div>
                                
                            </h2>
                            
                            <div class="time clearfix">{{comment.postTime}}</div>
                        </span>
                        <span class="floor">{{index+1}}楼</span>                     
                    </div>
                   
                    <div class="main">
                        <div class="quote"  v-if="comment.quoteList != null && comment.quoteList.length >0" >
                            <RenderTemplate :html="state.quoteData.get(comment.id)"></RenderTemplate>
                        </div>
                        

                        <div class="commentContent" :ref="'commentContent_'+comment.id">
                            <RenderTemplate :html="comment.content"></RenderTemplate>
                        </div>
                        
                        <div class="clearfix"></div>
                        
                        <div class="replyList" v-if="comment.replyList.length >0">
                            
                            <ul class="timeline box">
                                
                                <li class="timeline-item replyItem-container" v-for="(reply,index2) in comment.replyList" :key="reply.id"  :replyId="reply.id" :ref="handleReplyNodes">
                                    
                                    <div class="tail" v-if="state.line.get(reply.id)"></div>
                                    <div class="node node--normal" v-if="state.dot.get(reply.id)"></div>
                                    <div class="replyItem">
                                        <div :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 30 && reply.id == router.currentRoute.value.query.replyId ? 'reply-reportMark' : ''">
                                            <div class="reply-top" >
                                                <div class="avatarBox">
                                                    <el-popover effect="light" trigger="hover" placement="top">
                                                        <template #default>
                                                            <p v-if="reply.nickname != null && reply.nickname != ''">呢称: {{reply.nickname}}</p>
                                                            <p>账号: {{reply.account}}</p>
                                                            <p v-if="reply.userRoleNameList != null && reply.userRoleNameList.length >0" >角色: 
                                                                <span class="topicViewModule_topic-wrap_head_topicInfo_userRoleName" v-for="roleName in reply.userRoleNameList" >{{roleName}}</span>
                                                            </p> 
                                                            
                                                            
                                                        </template>
                                                        <template #reference v-if="reply.isStaff == false">
                                                            <div class="avatar-wrapper" >
                                                                <div class="avatar-badge" v-if="reply.avatarName == null || reply.avatarName == ''">
                                                                    <el-avatar shape="square" :size="48" :icon="UserFilled"></el-avatar>
                                                                </div>
                                                                <div class="avatar-badge" v-if="reply.avatarName != null && reply.avatarName != ''">
                                                                    <el-avatar shape="square" :size="48" :src="reply.avatarPath+'100x100/'+reply.avatarName"></el-avatar>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        
                                                        <template #reference v-if="reply.isStaff == true">
                                                            <div class="avatar-wrapper">
                                                                <el-badge value="员工" type="warning" class="avatar-badge" v-if="reply.avatarName == null || reply.avatarName == ''">
                                                                    <el-avatar shape="square" :size="48" :icon="UserFilled"></el-avatar>
                                                                </el-badge>
                                                                <el-badge value="员工" type="warning" class="avatar-badge" v-if="reply.avatarName != null && reply.avatarName != ''">
                                                                    <el-avatar shape="square" :size="48" :src="reply.avatarPath+'100x100/'+reply.avatarName"></el-avatar>
                                                                </el-badge>
                                                            </div>
                                                        </template>
                                                    </el-popover>
                                                </div>
                                                <span class="info" >
                                                    <h2 class="clearfix" >
                                                        
                                                        <div class="userName">
                                                            <div class="nickname" >
                                                                {{reply.nickname}}
                                                                <i class="userRoleName" v-for="roleName in reply.userRoleNameList" >{{roleName}}</i>
                                                                <i class="master" v-if="reply.userName == state.topic.userName && reply.isStaff == state.topic.isStaff">作者</i>
                                                            </div>
                                                            <div class="account" >{{reply.account}}<span class="time">{{reply.postTime}}</span></div>
                                                        </div>
                                                    </h2>
                                                </span>

                                                
                                                <span class="friendInfo" v-if="reply.friendUserName != null && reply.friendUserName != ''">
                                                    <span class="arrow">
                                                        <el-icon><CaretRight /></el-icon>
                                                    </span>
                                                    <div class="friendAvatarBox">
                                                        <el-popover effect="light" trigger="hover" placement="top">
                                                            <template #default>
                                                                <p v-if="reply.friendNickname != null && reply.friendNickname != ''">呢称: {{reply.friendNickname}}</p>
                                                                <p>账号: {{reply.friendAccount}}</p>
                                                            </template>
                                                            <template #reference v-if="reply.isFriendStaff == false">
                                                                <div class="avatar-wrapper" >
                                                                    <div class="avatar-badge" v-if="reply.friendAvatarName == null || reply.friendAvatarName == ''">
                                                                        <el-avatar shape="square" :size="48" :icon="UserFilled"></el-avatar>
                                                                    </div>
                                                                    <div class="avatar-badge" v-if="reply.friendAvatarName != null && reply.friendAvatarName != ''">
                                                                        <el-avatar shape="square" :size="48" :src="reply.friendAvatarPath+'100x100/'+reply.friendAvatarName"></el-avatar>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            
                                                            <template #reference v-if="reply.isFriendStaff == true">
                                                                <div class="avatar-wrapper">
                                                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="reply.friendAvatarName == null || reply.friendAvatarName == ''">
                                                                        <el-avatar shape="square" :size="48" :icon="UserFilled"></el-avatar>
                                                                    </el-badge>
                                                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="reply.friendAvatarName != null && reply.friendAvatarName != ''">
                                                                        <el-avatar shape="square" :size="48" :src="reply.friendAvatarPath+'100x100/'+reply.friendAvatarName"></el-avatar>
                                                                    </el-badge>
                                                                </div>
                                                            </template>
                                                        </el-popover>
                                                    </div>
                                                
                                                    <h2 class="nameInfo clearfix" >
                                                        <div class="userName">
                                                            {{reply.friendAccount}}
                                                            <div class="nickname" >
                                                                {{reply.friendNickname}}
                                                                <i class="master" v-if="reply.friendUserName == state.topic.userName && reply.isFriendStaff == state.topic.isStaff">作者</i>
                                                            </div>
                                                        </div>
                                                    </h2>
                                                </span>
                                                
                                                <div class="operatInfo">
                                                    <span class="orange-tag" v-if="reply.status ==10" title="回复状态">待审核</span>
                                                    <span class="green-tag" v-if="reply.status ==20" title="回复状态">已发布</span>
                                                    <span class="red-tag" v-if="reply.status ==110" title="回复状态">待审核用户删除</span>
                                                    <span class="red-tag" v-if="reply.status ==120" title="回复状态">已发布用户删除</span>
                                                    <span class="red-tag" v-if="reply.status ==100010" title="回复状态">待审核员工删除</span>
                                                    <span class="red-tag" v-if="reply.status ==100020" title="回复状态">已发布员工删除</span>
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/topicLike/list*','get')" @click="$router.push({path: '/admin/control/topicLike/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),itemId:reply.id,likeModule:30,topicPage:($route.query.page != undefined ? $route.query.page:'')}})">点赞用户</el-link>
                    
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=auditReply*','post')" href="javascript:void(0);" v-if="reply.status ==10"  @click="auditReply(reply.id)">审核</el-link>
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=addReply*','get')" href="javascript:void(0);" @click="addReplyFriendUI(reply.id)">回复</el-link>
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=editReply*','get')" href="javascript:void(0);" @click="editReplyUI(reply)">修改</el-link>
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=recoveryReply*','post')" href="javascript:void(0);" v-if="reply.status >100"  @click="recoveryReply(reply.id)">恢复</el-link>
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/topicReport/list*','get')" href="javascript:void(0);" @click="$router.push({path: '/admin/control/topicReport/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:''), parameterId:reply.id,module:30}})">举报</el-link>
                    
                                                    <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=deleteReply*','post')" href="javascript:void(0);" @click="deleteReply(reply.id)">删除</el-link>
                                                
                                                </div>
                                                
                                            </div>
                                            <div style="clear:both; height: 0; line-height: 0; font-size: 0;"></div>
                                            
                                            <!-- 修改回复 -->
                                            <div class="editReply-post" v-show="state.editReplyFormView.get(reply.id)">
                                                <el-form label-width="100"  @submit.native.prevent>
                                                    <el-form-item label="状态" :required="true" >
                                                        <el-radio-group v-model="state.replyStatusField[index][index2]">
                                                            <el-radio :label="10">待审核</el-radio>
                                                            <el-radio :label="20">已发布</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    <el-form-item label="内容" :required="true">
                                                        <div style="width: 100%;">
                                                            <textarea :ref="handleEditReplyNodes" :editorId="'editReply_'+reply.id" :replyId="reply.id" class="editReply-textarea" ></textarea>
                                                        </div>
                                                    </el-form-item>
                                                    <el-form-item label=" ">
                                                        <el-button class="submitButton" size="large" type="primary" @mousedown.native="editReply(reply.id)" :disabled="state.editReply_disabled.get(reply.id)">提交</el-button>
                                                        <el-button class="submitButton" size="large" type="primary" plain @mousedown.native="cancelEditReply(reply.id);">取消</el-button>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                            
                                            <div class="replyContent" @click="clickReplyLevel(comment.id,reply.id)">
                                                <RenderTemplate :html="reply.content"></RenderTemplate>
                                            </div>

                                            <!-- 回复对方 -->
                                            <div class="addReplyFriend-post" v-show="state.addReplyFriendFormView.get(reply.id)">
                                                <el-form @submit.native.prevent>
                                                    <el-form-item >
                                                        <div style="width: 100%;">
                                                            <textarea :ref="handleAddReplyFriendNodes" :editorId="'addReplyFriend_'+reply.id" :replyId="reply.id" class="addReplyFriend-textarea" ></textarea>
                                                        </div>
                                                    </el-form-item>
                                                    <el-form-item>
                                                        <el-button class="submitButton" size="large" type="primary" @mousedown.native="addReplyFriend(comment.id,reply.id)" :disabled="state.addReplyFriend_disabled.get(reply.id)">提交</el-button>
                                                        <el-button class="submitButton" size="large" type="primary" plain @mousedown.native="cancelAddReplyFriend(reply.id);">取消</el-button>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>           
                    </div>
                    <!-- 回复评论 -->
                    <div class="addReply-post" v-show="state.addReplyFormView.get(comment.id)">
                        <div class="addReply-wrap">
                            <el-form @submit.native.prevent>
                                <el-form-item >
                                    <div style="width: 100%;">
                                        <textarea :ref="handleAddReplyNodes" :editorId="'addReply_'+comment.id" :commentId="comment.id" class="addReply-textarea" ></textarea>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <el-button class="submitButton" size="large" type="primary" @mousedown.native="addReply(comment.id)" :disabled="state.addReply_disabled.get(comment.id)">提交</el-button>
                                    <el-button class="submitButton" size="large" type="primary" plain @mousedown.native="cancelAddReply(comment.id);">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="quote-post" v-show="state.quoteFormView.get(comment.id)">
                        <div class="quote-formModule">
                            <div class="addQuote-wrap">
                                <div class="head-tag"><Icon name="quote-left-solid" size="50px" class="icon"/></div>
                                <textarea :ref="handleQuoteNodes" :commentId="comment.id" class="quote-textarea"  ></textarea>
                                <div class="form-action">
                                    <div class="quoteSubmit">
                                        <el-button class="submitButton" size="large" type="primary" @mousedown.native="addQuote(comment.id);" :disabled="state.addQuote_disabled.get(comment.id)">提交</el-button>
                                        <el-button class="submitButton" size="large" type="primary" plain @mousedown.native="cancelQuote(comment.id);">取消</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="editComment-post" v-show="state.editCommentFormView.get(comment.id)">
                        <div class="editComment-formModule">
                            <div class="editComment-wrap">
                                <div class="head-tag"><Icon name="pencil-alt" size="50px" class="icon"/></div>
                                
                                <el-form label-position="top" label-width="auto"  @submit.native.prevent>
                                    <el-form-item label="状态" >
                                        <el-radio-group v-model="state.commentStatusField[index]">
                                            <el-radio :label="10">待审核</el-radio>
                                            <el-radio :label="20">已发布</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                                
                                
                                <textarea :ref="handleEditCommentNodes" :commentId="comment.id" class="editComment-textarea" ></textarea>
                                    
                                <div class="form-action">
                                    <div class="editCommentSubmit">
                                        <el-button class="submitButton" size="large" type="primary" @mousedown.native="editComment(comment.id);" :disabled="state.editComment_disabled.get(comment.id)">提交</el-button>
                                        <el-button class="submitButton" size="large" type="primary" plain @mousedown.native="cancelEditComment(comment.id);">取消</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottomInfo">
                        <div class="toolbar">
                        
                            <span class="orange-tag" v-if="comment.status ==10" title="评论状态">待审核</span>
                            <span class="green-tag" v-if="comment.status ==20" title="评论状态">已发布</span>
                            <span class="red-tag" v-if="comment.status ==110" title="评论状态">待审核用户删除</span>
                            <span class="red-tag" v-if="comment.status ==120" title="评论状态">已发布用户删除</span>
                            <span class="red-tag" v-if="comment.status ==100010" title="评论状态">待审核员工删除</span>
                            <span class="red-tag" v-if="comment.status ==100020" title="评论状态">已发布员工删除</span>
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/topicLike/list*','get')" @click="$router.push({path: '/admin/control/topicLike/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),itemId:comment.id,likeModule:20,topicPage:($route.query.page != undefined ? $route.query.page:'')}})">点赞用户</el-link>
                    
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=auditComment*','post')" href="javascript:void(0);" v-if="comment.status ==10" @click="auditComment(comment.id)">审核</el-link>
                           
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=addReply*','get')" href="javascript:void(0);" @click="addReplyUI(comment.id)">回复</el-link>
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=addQuote*','get')" href="javascript:void(0);" @click="addQuoteUI(comment.id)">引用</el-link>
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=editComment*','get')" href="javascript:void(0);" @click="editCommentUI(comment)">修改</el-link>
                            
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=recoveryComment*','post')" href="javascript:void(0);" v-if="comment.status >100" @click="recoveryComment(comment.id)">恢复</el-link>
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=auditComment*','get')" href="javascript:void(0);" @click="$router.push({path: '/admin/control/topicReport/list', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :state.topic.id, commentId:($route.query.commentId != undefined ? $route.query.commentId:''),topicPage:($route.query.page != undefined ? $route.query.page:''), parameterId:comment.id,module:20}})">举报</el-link>
                   
                            <el-link class="operat-btn" :disabled="!verifyPermissionMenu('/control/comment/manage?method=deleteComment*','post')" href="javascript:void(0);" @click="deleteComment(comment.id)">删除</el-link>
                            
     
                        </div>
                    </div>
                </div>
                
                
                <div class="pagination-wrapper" v-if="state.isShowPage">
                    <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
                </div>
                
                <div class="addComment" >
                    <el-form @submit.native.prevent>
                        <el-form-item :error="error.content">
                            <textarea ref="commentContentRef" style="width:100%;height:300px;visibility:hidden;"></textarea>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="submitButton" size="large" type="primary" @mousedown.native="addCommentForm" :disabled="state.addCommentForm_disabled || !verifyPermissionMenu('/control/comment/manage?method=addComment*','post')">提交</el-button>
                            
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            
        </div>
        
        
        
    </div>
</template>

<script lang="ts">
export default {
    name: 'topicView',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.topicView_beforeUrl == undefined || to.query.topicView_beforeUrl==''){//前一个URL
            let parameterObj:any = new Object();
            parameterObj.path = from.path;
            let query = from.query;
            for(let q in query){
                query[q] = encodeURIComponent(query[q] as string);
            
            }
            
            parameterObj.query = query;
            //将请求参数转为base62
            let wordArray = enc.Utf8.parse(JSON.stringify(parameterObj));
            let encrypt = enc.Base64url.stringify(wordArray);


            
            let newFullPath = updateURLParameter(to.fullPath,'topicView_beforeUrl',encrypt);
            
            to.fullPath = newFullPath;
            
            let paramGroup = to.query;
            paramGroup.topicView_beforeUrl = encrypt;
            to.query = paramGroup;
        }
        next()
    }
}
</script>



<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onActivated, onDeactivated, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { processErrorInfo,getLanguageClassName, updateURLParameter, getElementTop,verifyPermissionMenu } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import { GiveRedEnvelope, SourceUrl, Topic,Comment, Reply } from '@/types';
    import { enc} from 'crypto-js';
    import { UserFilled } from '@element-plus/icons-vue'
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { escapeHtml, escapeVueHtml } from '@/utils/escape';
    import Prism from "prismjs";
    import { nativeQueryVideoRedirect } from '@/utils/http';


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
    const route = useRouter();
    const {fileStorageSystem:store_fileStorageSystem} = storeToRefs(store)

    const topicContentRef = ref()
    const commentContentRef = ref()
    

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        topicId :'',//话题Id
        commentId :'',//评论Id
        visible :'true',//是否显示 true:未删除话题 false:已删除话题
        topic :{} as Topic,//话题
        giveRedEnvelope :{} as GiveRedEnvelope,//红包
        availableTag:'',//富文本编辑器允许使用的标签
        userName:'',//用户名称
        commentList:[] as Array<Comment>,
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        
        
        addCommentEditor :{} as any,//添加评论编辑器
        addCommentEditorCreateParameObject :{} as any,//添加评论编辑器的创建参数
        
        
        quoteFormView : new Map(),//评论引用表单  key:评论Id value:是否显示
        quoteEditorMap:new Map(),//引用评论富文本编辑器集合 key:评论Id value:富文本编辑器
        quoteEditorCreateParameMap:new Map(),//引用评论编辑器的创建参数 key:评论Id value:编辑器参数对象
        quoteData : new Map(),//引用数据 map格式 key:评论Id value:引用html数据
        
        editCommentFormView : new Map(),//修改评论表单  key:评论Id value:是否显示
        editCommentEditorMap:new Map(),//修改评论富文本编辑器集合 key:评论Id value:富文本编辑器
        editCommentEditorCreateParameMap:new Map(),//修改评论编辑器的创建参数 key:评论Id value:编辑器参数对象
        
        editCommentData : new Map(),//修改评论数据 map格式 key:评论Id value:修改html数据
        commentStatusField : [] as any, //评论状态项绑定

        addReplyFormView : new Map(),//添加回复表单  key:评论Id value:是否显示
        addReplyEditorMap:new Map(),//添加回复富文本编辑器集合 key:评论Id value:富文本编辑器
        addReplyEditorCreateParameMap:new Map(),//添加回复编辑器的创建参数 key:评论Id value:编辑器参数对象
       
        addReplyFriendFormView : new Map(),//添加回复对方表单  key:回复Id value:是否显示
        addReplyFriendEditorMap:new Map(),//添加回复对方富文本编辑器集合 key:回复Id value:富文本编辑器
        addReplyFriendEditorCreateParameMap:new Map(),//添加回复对方编辑器的创建参数 key:回复Id value:编辑器参数对象

        editReplyFormView : new Map(),//修改回复表单  key:修改Id value:是否显示
        editReplyEditorMap:new Map(),//修改回复富文本编辑器集合 key:修改Id value:富文本编辑器
        editReplyEditorCreateParameMap:new Map(),//修改回复编辑器的创建参数 key:修改Id value:编辑器参数对象
        replyStatusField : [] as any, //回复状态项绑定
        
        title :'',
        tagId :'',//标签Id
        sort : 0,
        allow : true,
        status :0,
        essence:false,
        isAllowLoadTagGroup:true,//是否允许加载标签组
        tagIdGroup : [], //标签Id组
        loading :false,//是否正在从远程获取数据
        options: [] as Array<OptionsItem>,//Select 选择器标签数据
        editTopicFormView:false,//修改话题表单是否显示
        editTopicEditor :{} as any,//修改话题编辑器
        editTopicEditorCreateParameObject :{} as any,//修改话题编辑器的创建参数
        
        playerIdList: [] as Array<string>,//视频播放Id列表
		playerObjectList: [] as Array<any>,//视频播放对象集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合
		playerNodeList: [] as Array<any>,//视频节点对象集合

        quoteElementNodes:[] as any,//引用评论项Element节点集合
		editCommentElementNodes:[] as any,//修改评论项Element节点集合
		replyElementNodes:[] as any,//回复列表项Element节点集合
        addReplyElementNodes:[] as any,//添加回复Element节点集合
        addReplyFriendElementNodes:[] as any,//添加回复对方Element节点集合
        editReplyElementNodes:[] as any,//修改回复Element节点集合
        
        addCommentForm_disabled:false,//提交评论按钮是否禁用
        addQuote_disabled : new Map(),//提交引用按钮是否禁用 map格式 key:评论Id value:是否禁用
        editComment_disabled : new Map(),//提交修改评论按钮是否禁用 map格式 key:评论Id value:是否禁用
        editTopic_disabled:false,//提交修改话题按钮是否禁用
        addReplyFriend_disabled: new Map(),//提交添加回复按钮是否禁用 map格式 key:一语论Id value:是否禁用
        addReply_disabled: new Map(),//提交添加回复对方按钮是否禁用 map格式 key:一语论Id value:是否禁用
        editReply_disabled: new Map(),//提交修改回复按钮是否禁用 map格式 key:回复Id value:是否禁用
        

        
        line : new Map(),//楼中楼的线  key:回复Id value:是否显示
        dot : new Map(),//楼中楼的点  key:回复Id value:是否显示

        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });
    const error = reactive({
        title :'',
        tagId :'',
        sort :'',
        content :'',
        essence :'',
    });

    //引用评论ref节点处理
    const handleQuoteNodes =(el: any) => {
        if(el != null){
            state.quoteElementNodes.push(el);
        }
    }
    //评论ref节点处理
    const handleEditCommentNodes = (el: any) => {
        if(el != null){
            state.editCommentElementNodes.push(el);
        }
    }
    //回复ref节点处理
	const handleReplyNodes = (el: any) => {
        if(el != null){
            state.replyElementNodes.push(el);
        }
	}

    //添加回复ref节点处理
    const handleAddReplyNodes = (el: any) => {
        if(el != null){
            state.addReplyElementNodes.push(el);
        }
    }
    //添加回复对方ref节点处理
    const handleAddReplyFriendNodes = (el: any) => {
        if(el != null){
            state.addReplyFriendElementNodes.push(el);
        }
    }
    //修改回复ref节点处理
    const handleEditReplyNodes = (el: any) => {
        if(el != null){
            state.editReplyElementNodes.push(el);
        }
    }

     //查询话题
     const queryTopic = () => {
        let params = {};
        if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
            params = {
                method : 'view',
                topicId :state.topicId,
                commentId :state.commentId,
                page :state.currentpage,
            }
        }else{
            params = {
                method : 'view',
                topicId :state.topicId,
                commentId :state.commentId,
                
            }
        }

        proxy?.$axios({
            url: '/control/topic/manage',
            method: 'get',
            params: params,
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
			    			if(key == "topic"){//话题
			    				let topic = mapData[key];
			    				
			    				//清空播放器
								clearVideoPlayer();
								
								
								
								//处理自定义标签
								let contentNode = document.createElement("div");
								contentNode.innerHTML = topic.content;
								
								bindNode(contentNode);
								topic.content = escapeVueHtml(contentNode.innerHTML);
								
								
								state.topic = topic;
								
								nextTick(()=>{
                                    setTimeout(function() {
                                        renderVideoPlayer();//渲染视频播放器
                                    }, 30);

                                    //渲染代码
                                    let topicRefValue = proxy?.$refs['topic_'+state.topicId];
                                    if(topicRefValue != undefined){
                                        renderBindNode(topicRefValue); 
                                    }
                                });
			    			}else if(key == "giveRedEnvelope"){//发红包
								let giveRedEnvelope = mapData[key];
			    				state.giveRedEnvelope = giveRedEnvelope;
			    			
			    			
			    			}else if(key == "availableTag"){//评论富文本框支持标签
			    				state.availableTag = mapData[key];
				    			
			    			}else if(key == "userName"){//用户名称
								let userName = mapData[key];
			    				state.userName = userName;
			    			}else if(key == "pageView"){//评论分页列表
                               
			    				let pageView = mapData[key];
			    				
			    				let commentList = pageView.records;
			    				
                                //清空
                                state.quoteElementNodes.length = 0;
                                state.editCommentElementNodes.length = 0;

                                state.replyElementNodes.length = 0;
                                state.addReplyElementNodes.length = 0;
                                state.addReplyFriendElementNodes.length = 0;
                                state.editReplyElementNodes.length = 0;

                                state.replyStatusField.length = 0;

                                state.commentList = {} as Array<Comment>;
			    				
			    				
			    				if(commentList != null && commentList.length > 0){
				    				for (let i = 0; i <commentList.length; i++) {
										let comment = commentList[i];
										
										
										//组装引用数据
										if(comment.quoteList != null && comment.quoteList.length >0){
											let quoteContent = "";
											for (let j = 0; j <comment.quoteList.length; j++) {
												let quote = comment.quoteList[j];
												let avatarHtml = "";
												
												avatarHtml += "<div class=\"avatar\">";
							                	avatarHtml += 		"<el-popover effect=\"light\" trigger=\"hover\" placement=\"top\">";
											    avatarHtml += 		   	"<template #default>";
												
												
												if(quote.nickname  != null && quote.nickname != ''){
											   	//	avatarHtml += 			"<p>呢称: "+quote.nickname+"</p>";
											   		avatarHtml += 			"<p>呢称: "+escapeHtml(quote.nickname)+"</p>";
												}   	
												avatarHtml += 				"<p>账号: "+quote.account+"</p>";
											    if(quote.userRoleNameList != null && quote.userRoleNameList.length >0){
											        avatarHtml += 			"<p>角色: ";
											        for (let k = 0; k <quote.userRoleNameList.length; k++) {
											        	let roleName = quote.userRoleNameList[k];
											        	avatarHtml += 			"<span class=\"topicViewModule_topic-wrap_head_topicInfo_userRoleName\" >"+escapeHtml(roleName)+"</span>";
											        }
											        avatarHtml += 			"</p>";
												}       
											    avatarHtml += 		   	 "</template>";
											    	
											    if(quote.isStaff == false){
											   		avatarHtml += 			"<template #reference>";
											   		avatarHtml += 				"<div class=\"avatar-wrapper\" >";
											   		if(quote.avatarName == null || quote.avatarName == ''){
											   			avatarHtml += 				"<div class=\"avatar-badge\" >";
											   			avatarHtml += 					"<el-avatar shape=\"square\" :size=\"40\" icon=\"UserFilled\"></el-avatar>";
											   			avatarHtml += 				"</div>";
											   		}
											   		if(quote.avatarName != null && quote.avatarName != ''){
											   			avatarHtml += 				"<div class=\"avatar-badge\" >";
											   			avatarHtml += 					"<el-avatar shape=\"square\" :size=\"40\" src=\""+quote.avatarPath+"100x100/"+quote.avatarName+"\"></el-avatar>";
											   			avatarHtml += 				"</div>";
											   		}
											   		avatarHtml += 				"</div>";
											   		avatarHtml += 			"</template>";
												}    
											    if(quote.isStaff == true){
											   		avatarHtml += 			"<template #reference>";
											   		avatarHtml += 				"<div class=\"avatar-wrapper\" >";   		
                                                    if(quote.avatarName == null || quote.avatarName == ''){
                                                        avatarHtml += 					"<el-badge value=\"员工\" type=\"warning\" class=\"avatar-badge\">";
                                                        avatarHtml += 						"<el-avatar shape=\"square\" :size=\"40\" icon=\"UserFilled\"></el-avatar>";
                                                        avatarHtml += 					"</el-badge>";
                                                    }
                                                    if(quote.avatarName != null && quote.avatarName != ''){
                                                        avatarHtml += 					"<el-badge value=\"员工\" type=\"warning\" class=\"avatar-badge\">";
                                                        avatarHtml += 					"<el-avatar shape=\"square\" :size=\"40\" src=\""+quote.avatarPath+"100x100/"+quote.avatarName+"\"></el-avatar>";
											   			avatarHtml += 					"</el-badge>";
                                                    }
											   		avatarHtml += 				"</div>";
											   		avatarHtml += 			"</template>";
												} 
											    avatarHtml += 		"</el-popover>";
							                	avatarHtml += "</div>";
												
												avatarHtml += "<span class=\"info\" >";
												avatarHtml += 		"<h2 class=\"clearfix\" >";
											    avatarHtml += 			"<div class=\"userName\">";
											    avatarHtml += 				""+quote.account+"";
											    avatarHtml += 				"<div class=\"nickname\" >";
											    
                                                if(quote.nickname != null && quote.nickname !=''){
											    	avatarHtml += 					""+escapeHtml(quote.nickname)+"";
											    }
											   
											    for (let k = 0; k <quote.userRoleNameList.length; k++) {
											        let roleName = quote.userRoleNameList[k];
											        avatarHtml += 				"<i class=\"userRoleName\" >"+escapeHtml(roleName)+"</i>";
											    
											      
											    }
											    if(quote.userName == state.topic.userName && quote.isStaff ==state.topic.isStaff){
											    	avatarHtml += 				"<i class=\"master\">作者</i>";
											    
											    }
											    avatarHtml += 				"</div>";
											    avatarHtml += 			"</div>";
						                        avatarHtml += 		"</h2>";
												avatarHtml += "</span>";
												
												quoteContent = "<div class=\"quoteComment\">"+quoteContent+"<span class=\"userInfo\">"+avatarHtml+"</span><div class=\"content\">"+quote.content+"</div></div>";
			
			
											}
											
											state.quoteData.set(comment.id, escapeVueHtml(quoteContent));
										}

                                        
                                        //定义回复数组
                                        let replyStatusField_reply_array = [];
                                        
                                        //回复
                                        if(comment.replyList != null && comment.replyList.length >0){
                                            for (let j = 0; j <comment.replyList.length; j++) {
                                                let reply = comment.replyList[j];
                                                state.editReplyFormView.set(reply.id,false);

                                                replyStatusField_reply_array.push(reply.status);
                                                
                                                
                                                state.addReplyFriendFormView.set(reply.id,false); 
                                                
                                                
                                                //处理自定义标签
                                                let contentNode = document.createElement("div");
                                                contentNode.innerHTML = reply.content;
                                                
                                                bindNode(contentNode);
                                                reply.content = escapeVueHtml(contentNode.innerHTML);
                                            }
                                        }
                                        
                                        //二维数组示例
                                        //let a=[1,2];
                                        //let b=[]; 
                                        //b[0]=a;//把数组a作为b数组的元素传入b数组中	 
                                        //alert(b[0][1]);//2
                                        state.replyStatusField[i] = replyStatusField_reply_array;//把数组replyStatusField_reply_array作为replyStatusField数组的元素传入replyStatusField数组中
										                     
                                         

                                        //处理图片放大标签
                                        let contentNode = document.createElement("div");
                                        contentNode.innerHTML = comment.content;
                                        bindNode(contentNode);
                                        comment.content = escapeVueHtml(contentNode.innerHTML);

				    					state.quoteFormView.set(comment.id,false);
				    					
				    					
				    					state.addQuote_disabled.set(comment.id,false);
				    					
				    					
				    					state.commentStatusField.push(comment.status);


			    					}
			    					state.commentList = commentList;
			    				
				    				state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = pageView.currentpage;
									state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = pageView.maxresult;
									state.isShowPage = true;//显示分页栏
									
									
									nextTick(()=> {
                                        if(commentList != null && commentList.length > 0){
                                            for (let i = 0; i <commentList.length; i++) {
                                                let comment = commentList[i];
                                                let commentRefValue =  (proxy?.$refs['commentContent_'+comment.id] as any);
                                                if(commentRefValue != undefined && commentRefValue[0]){
                                                    renderBindNode(commentRefValue[0]); 
                                                }
                                                
                                            }
                                        }

                                        nextTick(()=> {
                                            //跳转到锚点

                                            setTimeout(function () {
                                                //跳转到评论
                                                if(state.commentId != null && state.commentId != '' && (router.currentRoute.value.query.replyId == undefined || router.currentRoute.value.query.replyIdreplyId == '')){

                                                    let commentRef = (proxy?.$refs['comment_'+state.commentId] as any);
                                                    if(commentRef !=undefined){
                                                        let commentRefValue = commentRef[0];

                                                        //锚点距离浏览器顶部的高度 - <el-main>标签距离浏览器顶部的高度
                                                        document.querySelector(".el-main")!.scrollTop = commentRefValue.offsetTop - (document.querySelector(".el-main") as any).offsetTop;
                                                    }
                                                }

                                                //跳转到回复
                                                if(router.currentRoute.value.query.replyId != undefined && router.currentRoute.value.query.replyId != ''){
                                                    for(let i = 0; i<state.replyElementNodes.length; i++){
                                                        let replyElement = state.replyElementNodes[i];
                                                        let _replyId = replyElement.getAttribute("replyId");
                                                        if(router.currentRoute.value.query.replyId == _replyId){//跳转到当前回复
                                                            //window.scrollTo(0,replyElement.getBoundingClientRect().top-20);
                                                            //锚点距离浏览器顶部的高度 - <el-main>标签距离浏览器顶部的高度
                                                            document.querySelector(".el-main")!.scrollTop = getElementTop(replyElement) - (document.querySelector(".el-main") as any).offsetTop -5;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }, 0);
                                        });
										
									});
									
									
			    				}
			    				
			    				
			    			}
			    		}
			    		
			    		if (Object.keys(state.addCommentEditorCreateParameObject).length === 0) {//等于空
			    			let uploadPath = "control/comment/manage?method=uploadImage&userName="+state.userName+"&isStaff=true&topicId="+state.topicId;
					   		//创建富文本编辑器
                            state.addCommentEditor = createEditor(commentContentRef.value, JSON.parse(state.availableTag), uploadPath, null,store_fileStorageSystem.value);
                            state.addCommentEditorCreateParameObject = {
			    				ref:commentContentRef.value,
			    				availableTag:JSON.parse(state.availableTag),
			    				uploadPath:uploadPath,
			    				userGradeList:null
			    			}
			    		
			    		}
						
						
			    		
						
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
    }

    //清空播放器
    const clearVideoPlayer = () => {
        for(let i=0; i< state.playerObjectList.length; i++){
            let playerObject = state.playerObjectList[i];
            
            playerObject.destroy();//销毁播放器
        }
        for(let i=0; i< state.playerHlsList.length; i++){
            let hls = state.playerHlsList[i];
            hls.destroy();//销毁视频流
        }
        state.playerObjectList.length = 0;//清空数组
        state.playerHlsList.length = 0;//清空数组
        state.playerIdList.length = 0;//清空数组
        state.playerNodeList.length = 0;//清空数组
    }

    //渲染视频播放器
    const renderVideoPlayer = () => {
        
        for(let i=0; i< state.playerIdList.length; i++){
            let playerId = state.playerIdList[i];
            let url = document.getElementById(playerId)?.getAttribute("url");
            let cover = document.getElementById(playerId)?.getAttribute("cover");//封面
            let thumbnail = document.getElementById(playerId)?.getAttribute("thumbnail");//缩略图
            
            let dp = null;
            if(url == ""){//如果视频处理中
                dp = new DPlayer({
                    container: document.getElementById(playerId),//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                    
                    video: {
                        
                    }
                });
                let dom = document.createElement('div');
                dom.innerHTML="<div class='dplayer-process'><div class='box'><div class='prompt'>视频处理中，请稍后再刷新</div></div></div>";
                document.getElementById(playerId)?.appendChild(dom);
            }else{

                if(cover != undefined && cover != "" && thumbnail != undefined && thumbnail != ""){//切片视频
                    let hls = null;
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url,
                            pic: cover,//视频封面
                            thumbnails: thumbnail,//视频预览图
                            type: 'customHls',
                            customType: {
                                customHls: function (video:any, player:any) {
                                    hls = new Hls();
                                    hls.loadSource(video.src);
                                    hls.attachMedia(video);
                                    hls.config.xhrSetup = (xhr, url) => {
                                        if(url.startsWith(store.apiUrl+"videoRedirect?")){//如果访问视频重定向页
                                            //如果使用重定向跳转时会自动将标头Authorization发送到seaweedfs，seaweedfs会报501错误 A header you provided implies functionality that is not implemented
                                            //这里发送X-Requested-With标头到后端，让后端返回需要跳转的地址
                                            let videoRedirectDate = {} as any;
                                            nativeQueryVideoRedirect(url,function(date:any){
                                                videoRedirectDate = date;
                                            });

                                            if(videoRedirectDate != null && Object.keys(videoRedirectDate).length>0 && videoRedirectDate.redirect != ''){
                                                //告诉hls重新发送ts请求
                                                xhr.open("GET", videoRedirectDate.redirect, true);//用重定向后的地址请求
                                                //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                            }
                                        }else{
                                            // 请求ts的url 添加参数 props.fileid
                                            //url = url + "?t=" + props.fileid;
                                            // 这一步必须 告诉hls重新发送ts请求
                                            xhr.open("GET", url, true);
                                            //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                        }
                                    };
                                },
                            },
                        }
                    });
                    state.playerHlsList.push(hls);
                }else{
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url
                        }
                    });
                }
                
            }
            state.playerObjectList.push(dp);
        }
        
        
        //添加播放器节点数据
        if(state.playerObjectList.length >0){
            
            for(let i=0; i< state.playerIdList.length; i++){
                let playerId = state.playerIdList[i];
                let node = document.getElementById(playerId);//节点对象
                state.playerNodeList.push(node);
            }
        }
        
    }

    //递归绑定节点参数
    const bindNode = (node:any) => {
        
        
        //先找到子节点
        let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理图片
                if(childNode.nodeName.toLowerCase() == "img" ){
                    let src = childNode.getAttribute("src");
                    
                    childNode.removeAttribute("src");//将原节点src属性删除，防止多请求一次
                
                    let html = '';
                    let style = '';
                    if(childNode.getAttribute("width") != null){//如果是表情，表情图不放大
                        style = 'style="width: '+childNode.getAttribute("width")+'; height: '+childNode.getAttribute("height")+'"';
                        
                        html = '<el-image src="'+store.apiUrl+src+'" '+style+' loading="lazy" ></el-image>';
                        
                    }else{
                    
                        html = '<el-image src="'+src+'" '+style+' :preview-src-list=["'+src+'"] lazy hide-on-click-modal ></el-image>';
                    }
                    //创建要替换的元素
                //	let html = '<el-image src="'+src+'" '+style+' lazy></el-image>';
                //	let html = '<el-image src="'+src+'" '+style+' :preview-src-list=["http://127.0.0.1:8080/cms/common/tttttt/templates.jpg"] lazy hide-on-click-modal ></el-image>';
                    
                
                
                //	let html = '<el-image src="backstage/images/null.gif" lazy></el-image>';
                    let placeholder = document.createElement('div');
                    placeholder.innerHTML = html;
                    let node = placeholder.childNodes[0];
                //	node.setAttribute("src",src);
                    childNode.parentNode.replaceChild(node,childNode);//替换节点	 
                }
                
                //处理表格 (解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题，需要CSS配合)
                if(childNode.nodeName.toLowerCase() == "table" ){
                    childNode.removeAttribute("border");
                    childNode.removeAttribute("bordercolor");
                }


                
                //处理视频标签
                if(childNode.nodeName.toLowerCase() == "player" ){
                    
                    let id = "player_"+random+"_"+i;
                    childNode.setAttribute("id",id);//设置Id
                    state.playerIdList.push(id);	
                }

                //处理下载
                if(childNode.nodeName.toLowerCase() == "a" ){
                    let href = childNode.getAttribute("href")
                    let title = childNode.innerText;
                    let linkType = childNode.getAttribute("linkType")
                    //let startUrl = store.apiUrl+"fileDowload?jump=";
                    if(linkType == "download"  && href != ""){
                        childNode.setAttribute("class","download");
                        let downloadHtml ='<Download class="link-icon"></Download>'+escapeHtml(title);
                        childNode.innerHTML =downloadHtml;
                    }
                }

                
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    let pre_html = childNode.innerHTML;
                    let class_val = childNode.className;
                    let lan_class = "";
                    
                    let class_arr = new Array();
                    class_arr = class_val.split(' ');
                    
                    for(let k=0; k<class_arr.length; k++){
                        let className = class_arr[k].trim();
                        
                        if(className != null && className != ""){
                            if (className.lastIndexOf('lang-', 0) === 0) {
                                lan_class = className;
                                break;
                            }
                        }
                    }
                    
                    childNode.className = "line-numbers "+getLanguageClassName(lan_class);
                    childNode.setAttribute("data-prismjs-copy","复制");
                    childNode.setAttribute("data-prismjs-copy-error","按Ctrl+C复制");
                    childNode.setAttribute("data-prismjs-copy-success","复制成功");


                    let nodeHtml = "";

                    //删除code节点
                    let preChildNodeList = childNode.childNodes;
                    for(let p = 0;p < preChildNodeList.length;p++){
                        let preChildNode = preChildNodeList[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            nodeHtml += preChildNode.innerHTML;
                            preChildNode.parentNode.removeChild(preChildNode);
                        }
                        
                    }
                    
                    let dom = document.createElement('code');
                    dom.className = "line-numbers "+getLanguageClassName(lan_class);
                    dom.innerHTML=nodeHtml;
                    
                   
                    childNode.appendChild(dom);
                
                }
                
                bindNode(childNode);

                
            }
        }
    }


    //递归渲染绑定节点
    const renderBindNode = (node:any) => {	
         //先找到子节点
         let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    Prism.highlightAllUnder(childNode);
                }
                renderBindNode(childNode);
            }
        }
    }

    //审核话题
    const auditTopic = (topicId:string) => {

        ElMessageBox.confirm('此操作将该话题状态改为已发布, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('topicId',  topicId); 

            proxy?.$axios({
                url: '/control/topic/manage?method=auditTopic',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
				    		//删除缓存
                            store.setCacheNumber();
                            ElMessage({
                                showClose: true,
                                message: '审核成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		
				    		queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }
    
    //查询标签
    const queryTagList = (event:any) => {
        if(!state.isAllowLoadTagGroup){
            return;
        }

        proxy?.$axios({
            url: '/control/tag/manage',
            method: 'get',
            params: {
                method : 'allTag'
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.isAllowLoadTagGroup = false;
            if(response){

                const result: any = response.data;
            
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功

                        state.options = [];
			    		let tagList = returnValue.data;
			    		if(tagList != null && tagList.length >0){
			    			for(let i=0; i<tagList.length; i++){
			    				let tag = tagList[i];
				    			let obj:any =new Object();
				    	    	obj.value = tag.id;
				    	    	obj.label = tag.name;
				    	    	state.options.push(obj);
			    			}
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

    //选中标签
    const selectedTag = (val:any) => {
        state.tagId = val;
    }

    //修改话题表单
    const editTopicUI = () => {
        if(state.editTopicFormView){//如果已打开
            return;
        }
			
        state.editTopicFormView = true;

        proxy?.$axios({
            url: '/control/topic/manage',
            method: 'get',
            params: {
                method : 'edit',
                topicId :state.topicId,
            }
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(result){
                    
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        let mapData = returnValue.data;
			    		
			    		let userGradeList = null;
			    		let topic = null;
			    		
						for(let key in mapData){
			    			if(key == "userGradeList"){//所有设置的等级
								userGradeList = mapData[key];
			    			}else if(key == "topic"){
			    				topic = mapData[key];
			    			}
			    		}
						
						if(userGradeList != null && topic != null){
							
							state.title = topic.title;
								
							state.sort = topic.sort;
							state.allow = topic.allow;
							state.status = topic.status;
							state.essence = topic.essence;
		    				topicContentRef.value.value = topic.content;
		    				
		    				
		    				state.tagId = topic.tagId;
		
							state.tagIdGroup = topic.tagId;
							let obj:any =new Object();
							obj.value = topic.tagId;
							obj.label = topic.tagName;
							state.options.push(obj);
		    				
		    				
		    				
	    					let uploadPath = "control/topic/manage?method=upload&userName="+topic.userName+"&isStaff="+topic.isStaff;
				   		
					   		let availableTag = ['source', '|', 'preview', 'code',
						        '|', 'justifyleft', 'justifycenter', 'justifyright',
						        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
						        'superscript', 'clearhtml', 'quickformat', 'selectall', '|',
						        'formatblock', 'fontname', 'fontsize', 'fullscreen',  '/', 'forecolor', 'hilitecolor', 'bold',
						        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
						         'media','embedVideo','uploadVideo', 'insertfile','emoticons','baidumap', 'table', 'hr',   'pagebreak',
						         'link', 'unlink','hide','hidePassword','hideComment','hideGrade','hidePoint','hideAmount'];
					   		
					   		//创建富文本编辑器
                            state.editTopicEditor = createEditor(topicContentRef.value, availableTag, uploadPath, userGradeList,store_fileStorageSystem.value);
			    			state.editTopicEditorCreateParameObject = {
			    				ref:topicContentRef.value,
			    				availableTag:availableTag,
			    				uploadPath:uploadPath,
			    				userGradeList:userGradeList
			    			}
						
						}
                    }else if(returnValue.code === 500){//错误
                        //修改返回属性
                        for (const [key, value] of Object.entries(returnValue.data as Map<string,string>) as [string, string][]){
                            if(key == "content"){
                                ElMessageBox.alert(value, '错误', {
                                    type:'error',
                                    draggable: true,
                                    dangerouslyUseHTMLString: false,
                                    showConfirmButton: false
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //取消修改话题
    const cancelEditTopic = () => {
        state.editTopicEditor.remove();
        state.editTopicEditorCreateParameObject ={};
        
        state.title ='';
        state.tagId ='';//标签Id
        state.sort= 0;
        state.allow = true;
        state.status =0;
        state.essence = false;
        state.isAllowLoadTagGroup=true;//是否允许加载标签组
        state.tagIdGroup =[];//标签Id组
        state.loading =false;//是否正在从远程获取数据
        state.options= [];//Select 选择器标签数据

        state.editTopicFormView = false;
    }

    //修改话题
    const editTopic = () => {
        state.editTopic_disabled = true;
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('topicId', state.topicId);
        if(state.title != null && state.title != ''){
            formData.append('title', state.title);
            
        }
        
        if(state.tagId != null && state.tagId != ''){
            formData.append('tagId', state.tagId); 
        }
        if(state.sort != null && state.sort >=0){
            formData.append('sort', String(state.sort));
        }
        formData.append('allow', state.allow.toString());
        formData.append('status', String(state.status));
        formData.append('essence',state.essence.toString());
        
        if(topicContentRef.value.value != null && topicContentRef.value.value !=''){
            formData.append('content', topicContentRef.value.value);
        }

        proxy?.$axios({
            url: '/control/topic/manage?method=edit',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(result){
                    
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        //删除缓存
                        store.setCacheNumber();
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
                        //取消修改话题
						cancelEditTopic();

                        //清除评论列表
                        clearCommentList();
			    		
			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

                        
                    }
                }
            }
            state.editTopic_disabled = false;
        })
        .catch((error: any) =>{
            console.log(error);
            state.editTopic_disabled = false;
        });

    }



    //删除话题
    const deleteTopic = (topicId:string) => {
        ElMessageBox.confirm('此操作将删除该话题, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('topicId', topicId);

            proxy?.$axios({
                url: '/control/topic/manage?method=delete',
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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                            
				    		router.push({
				    			path: state.sourceUrlObject.path, 
				    			query:state.sourceUrlObject.query
							});
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
        .catch((error) => {
            console.log(error);
        });
    }


    //审核评论
    const auditComment = (commentId:string) => {
        ElMessageBox.confirm('此操作将该评论状态改为已发布, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('commentId',  commentId); 

            proxy?.$axios({
                url: '/control/comment/manage?method=auditComment',
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
                                message: '审核成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            //删除缓存
                            store.setCacheNumber();
                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }

    //恢复评论
    const recoveryComment = (commentId:string) => {
        ElMessageBox.confirm('此操作将恢复该评论, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('commentId',  commentId); 

            proxy?.$axios({
                url: '/control/comment/manage?method=recoveryComment',
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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }

    //添加评论
    const addCommentForm = () => {
        state.addCommentForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.topicId != null && state.topicId != ''){
            formData.append('topicId',  state.topicId); 
        }

        if(commentContentRef.value.value != null && commentContentRef.value.value !=''){
            formData.append('content', commentContentRef.value.value);
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=addComment',
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
			    		//清空字段
                        state.addCommentEditor.html("");
			    		state.addCommentEditor.remove();
                        state.addCommentEditor = {};
                        state.addCommentEditorCreateParameObject = {};
			    		 
			    		queryTopic();
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.addCommentForm_disabled = false;
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.addCommentForm_disabled = false;//提交按钮disabled状态
        });

    }

    //修改评论表单
    const editCommentUI = (comment:Comment) => {
        if(state.editCommentFormView.get(comment.id) == true){//如果已打开
            return;
        }
		
        proxy?.$axios({
            url: '/control/comment/manage',
            method: 'get',
            params: {
                method : 'editComment',
                commentId: comment.id,
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
			    			if(key == "comment"){//评论
			    				let _comment = mapData[key];
			    				
			    				state.editCommentFormView.set(comment.id,true);
								nextTick(()=> {
									for(let i = 0; i<state.editCommentElementNodes.length; i++){
										let editCommentElement = state.editCommentElementNodes[i];
										
										editCommentElement.value = _comment.content;
										
										let _commentId = editCommentElement.getAttribute("commentId");
									
										if(_commentId == comment.id){
											
											let uploadPath = "control/comment/manage?method=uploadImage&userName="+comment.userName+"&isStaff="+comment.isStaff+"&topicId="+state.topicId;
											//创建富文本编辑器
											let editor = createEditor(editCommentElement, JSON.parse(state.availableTag), uploadPath, null,store_fileStorageSystem.value);
											
											state.editCommentEditorMap.set(comment.id,editor);
								
							    			state.editCommentEditorCreateParameMap.set(comment.id,{
							    				ref:editCommentElement,
							    				availableTag:JSON.parse(state.availableTag),
							    				uploadPath:uploadPath,
							    				userGradeList:null
							    			});
							    			break;
										}
									}
								});
			    				
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
    //取消修改评论
    const cancelEditComment = (commentId:string) => {
        let editCommentEditor = state.editCommentEditorMap.get(commentId);
        if(editCommentEditor != null){
            editCommentEditor.remove();
            state.editCommentEditorMap.delete(commentId);
            state.editCommentEditorCreateParameMap.delete(commentId);
        }
        state.editCommentFormView.set(commentId,false);
    }

    //修改评论
    const editComment = (commentId:string) => {
        state.editComment_disabled.set(commentId,true);
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('commentId',  commentId); 

        if(state.commentList != null && state.commentList.length > 0){
            for (let i = 0; i <state.commentList.length; i++) {
                let comment = state.commentList[i];
                if(comment.id == commentId){
                    formData.append('status',  state.commentStatusField[i]); 
                    break;
                }
            }
        }
        
        for(let i = 0; i<state.editCommentElementNodes.length; i++){
            let editCommentElement = state.editCommentElementNodes[i];
            let _commentId = editCommentElement.getAttribute("commentId");
            
            if(_commentId == commentId){
                formData.append('content', editCommentElement.value);
                break;
            }
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=editComment',
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
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
                        //删除缓存
                        store.setCacheNumber();
			    		
			    		
			    		//清除评论列表
                        clearCommentList();
						state.editCommentFormView.set(commentId,false);
			    		
			    		
			    		
			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.editComment_disabled.set(commentId,false);
        })
        .catch((error: any) =>{
            console.log(error);
            state.editComment_disabled.set(commentId,false);
        });
    }

    //引用评论表单
    const addQuoteUI = (commentId:string) => {
        if(state.quoteFormView.get(commentId) == true){//如果已打开
			return;
		}
			
			
        state.quoteFormView.set(commentId,true);
        
        nextTick(()=> {
            for(let i = 0; i<state.quoteElementNodes.length; i++){
                let quoteElement = state.quoteElementNodes[i];
                let _commentId = quoteElement.getAttribute("commentId");
                
                if(_commentId == commentId){
                    let uploadPath = "control/comment/manage?method=uploadImage&userName="+state.userName+"&isStaff=true&topicId="+state.topicId;
                    //创建富文本编辑器
                    let editor = createEditor(quoteElement, JSON.parse(state.availableTag), uploadPath, null,store_fileStorageSystem.value);
                    
                    state.quoteEditorMap.set(commentId,editor);
    
                    state.quoteEditorCreateParameMap.set(commentId,{
                        ref:quoteElement,
                        availableTag:JSON.parse(state.availableTag),
                        uploadPath:uploadPath,
                        userGradeList:null
                    });
                    break;
                }
            }
        });
    }

    //取消引用评论
    const cancelQuote = (commentId:string) => {
        let quoteEditor = state.quoteEditorMap.get(commentId);
        if(quoteEditor != null){
            quoteEditor.remove();
            state.quoteEditorMap.delete(commentId);
            state.quoteEditorCreateParameMap.delete(commentId);
        }
        state.quoteFormView.set(commentId,false);	
	}

    //引用评论
    const addQuote = (commentId:string) => {
        state.addQuote_disabled.set(commentId,true);

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
			
		formData.append('commentId',  commentId); 
			
			
        for(let i = 0; i<state.quoteElementNodes.length; i++){
            let quoteElement = state.quoteElementNodes[i];
            let _commentId = quoteElement.getAttribute("commentId");
            
            if(_commentId == commentId){
                formData.append('content', quoteElement.value);
                break;
            }
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=addQuote',
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
                            message: '添加成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })

                        //删除缓存
                        store.setCacheNumber();

                        //清除评论列表
                        clearCommentList();


						state.quoteFormView.set(commentId,false);
			    		
			    	
			    		
			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.addQuote_disabled.set(commentId,false);
        })
        .catch((error: any) =>{
            console.log(error);
            state.addQuote_disabled.set(commentId,false);
        });
    }

    //删除评论
    const deleteComment = (commentId:string) => {
        ElMessageBox.confirm('此操作将删除该评论, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('commentId', commentId);

            proxy?.$axios({
                url: '/control/comment/manage?method=deleteComment',
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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                            //清除评论列表
                            clearCommentList() 
                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }


    //添加回复对方表单
    const addReplyFriendUI = (replyId:string) => {
        if(state.addReplyFriendFormView.get(replyId) == true){//如果已打开
            return;
        }
        

        proxy?.$axios({
            url: '/control/comment/manage',
            method: 'get',
            params: {
                method : 'addReply',
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
			    		state.addReplyFriendFormView.set(replyId,true);
                        nextTick(()=> {
                            for(let i = 0; i<state.addReplyFriendElementNodes.length; i++){
                                let addReplyFriendElement = state.addReplyFriendElementNodes[i];
                                addReplyFriendElement.value = "";
                                let _replyId = addReplyFriendElement.getAttribute("replyId");
                            
                                if(_replyId == replyId){


                                    //编辑器图标
                                    let editorIconList = new Array();
                                    if(mapData.availableTag != null && mapData.availableTag != ''){
                                        let availableTagObject = JSON.parse(mapData.availableTag);//JSON转为对象

                                        if(availableTagObject != null && availableTagObject.length >0){
                                            for(let i=0; i< availableTagObject.length; i++){
                                                let availableTag = availableTagObject[i];
                                                if(availableTag == "emoticons"){
                                                    editorIconList.push(availableTag);
                                                }else if(availableTag == "mention"){
                                                   // editorIconList.push(availableTag);
                                                }
                                            }
                                        }
                                    }


                                    let uploadPath = "control/comment/manage?method=uploadImage&userName="+mapData.userName+"&isStaff=true&topicId="+state.topicId;
                    
                                   
                                    //创建富文本编辑器
                                    let editor = createEditor(addReplyFriendElement, editorIconList, uploadPath, null,store_fileStorageSystem.value);
                                    
                                    state.addReplyFriendEditorMap.set(replyId,editor);
                                    
                                    
                                    
                        
                                    state.addReplyFriendEditorCreateParameMap.set(replyId,{
                                        ref:addReplyFriendElement,
                                        availableTag:editorIconList,
                                        uploadPath:uploadPath,
                                        userGradeList:null,
                                        editorId:addReplyFriendElement.getAttribute('editorId'),
                                    });
                                    break;
                                }
                            }
                        });
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
    //取消添加回复对方
    const cancelAddReplyFriend = (replyId:string) => {
        let addReplyFriendEditor = state.addReplyFriendEditorMap.get(replyId);
        if(addReplyFriendEditor != null){
            addReplyFriendEditor.remove();
            state.addReplyFriendEditorMap.delete(replyId);
            state.addReplyFriendEditorCreateParameMap.delete(replyId);
        }
        state.addReplyFriendFormView.set(replyId,false);
        
    }

     //添加回复对方
     const addReplyFriend = (commentId:string,replyId:string) => {
        state.addReplyFriend_disabled.set(replyId,true);

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
			
        formData.append('commentId',  commentId); 

        formData.append('friendReplyId',  replyId); 
        

        for(let i = 0; i<state.addReplyFriendElementNodes.length; i++){
            let addReplyFriendElement = state.addReplyFriendElementNodes[i];
            let _replyId = addReplyFriendElement.getAttribute("replyId");
            
            if(_replyId == replyId){
                formData.append('content', addReplyFriendElement.value);
                break;
            }
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=addReply',
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
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })

                        //删除缓存
                        store.setCacheNumber();

                        //清除评论列表
                        clearCommentList();
                        nextTick(()=>{//需要延迟才能让state.addReplyFriendFormView的设置生效
                            state.addReplyFriendFormView.set(replyId,false);
                        })
						

			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.addReplyFriend_disabled.set(replyId,false);
        })
        .catch((error: any) =>{
            console.log(error);
            state.addReplyFriend_disabled.set(replyId,false);
        });
    }

    //添加回复表单
    const addReplyUI = (commentId:string) => {
        if(state.addReplyFormView.get(commentId) == true){//如果已打开
            return;
        }


        proxy?.$axios({
            url: '/control/comment/manage',
            method: 'get',
            params: {
                method : 'addReply',
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
                        state.addReplyFormView.set(commentId,true);
                        nextTick(()=> {
                            for(let i = 0; i<state.addReplyElementNodes.length; i++){
                                let addReplyElement = state.addReplyElementNodes[i];
                                addReplyElement.value = "";
                                let _commentId = addReplyElement.getAttribute("commentId");
                            
                                if(_commentId == commentId){


                                    //编辑器图标
                                    let editorIconList = new Array();
                                    if(mapData.availableTag != null && mapData.availableTag != ''){
                                        let availableTagObject = JSON.parse(mapData.availableTag);//JSON转为对象

                                        if(availableTagObject != null && availableTagObject.length >0){
                                            for(let i=0; i< availableTagObject.length; i++){
                                                let availableTag = availableTagObject[i];
                                                if(availableTag == "emoticons"){
                                                    editorIconList.push(availableTag);
                                                }else if(availableTag == "mention"){
                                                 //   editorIconList.push(availableTag);
                                                }
                                            }
                                        }
                                    }

                                    
                                    let uploadPath = "control/comment/manage?method=uploadImage&userName="+mapData.userName+"&isStaff=true&topicId="+state.topicId;
                    
                                   
                                    //创建富文本编辑器
                                    let editor = createEditor(addReplyElement, editorIconList, uploadPath, null,store_fileStorageSystem.value);
                                    
                                    state.addReplyEditorMap.set(commentId,editor);
                                    
                                    
                                    
                        
                                    state.addReplyEditorCreateParameMap.set(commentId,{
                                        ref:addReplyElement,
                                        availableTag:editorIconList,
                                        uploadPath:uploadPath,
                                        userGradeList:null,
                                        editorId:addReplyElement.getAttribute('editorId'),
                                    });
                                    break;
                                }
                            }
                        });
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
    //取消添加回复
    const cancelAddReply = (commentId:string) => {
        let addReplyEditor = state.addReplyEditorMap.get(commentId);
        if(addReplyEditor != null){
            addReplyEditor.remove();
            state.addReplyEditorMap.delete(commentId);
            state.addReplyEditorCreateParameMap.delete(commentId);
        }
        state.addReplyFormView.set(commentId,false);
        
    }

    //添加回复
    const addReply = (commentId:string) => {
        state.addReply_disabled.set(commentId,true);

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
			
        formData.append('commentId',  commentId); 


        for(let i = 0; i<state.addReplyElementNodes.length; i++){
            let addReplyElement = state.addReplyElementNodes[i];
            let _commentId = addReplyElement.getAttribute("commentId");
            
            if(_commentId == commentId){
                formData.append('content', addReplyElement.value);
                break;
            }
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=addReply',
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
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })

                        //删除缓存
                        store.setCacheNumber();

                       
                        //清除评论列表
                        clearCommentList();

                        nextTick(()=>{//需要延迟才能让state.addReplyFormView的设置生效
                            state.addReplyFormView.set(commentId,false);
                        })

			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.addReply_disabled.set(commentId,false);
        })
        .catch((error: any) =>{
            console.log(error);
            state.addReply_disabled.set(commentId,false);
        });
    }


    //审核回复
    const auditReply = (replyId:string) => {
        ElMessageBox.confirm('此操作将该回复状态改为已发布, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('replyId',  replyId); 
            proxy?.$axios({
                url: '/control/comment/manage?method=auditReply',
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
                                message: '审核成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            //删除缓存
                            store.setCacheNumber();
                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }

    //恢复回复
    const recoveryReply = (replyId:string) => {
        ElMessageBox.confirm('此操作将恢复该回复, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('replyId',  replyId); 
            proxy?.$axios({
                url: '/control/comment/manage?method=recoveryReply',
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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }

    //修改回复表单
    const editReplyUI = (reply:Reply) => {
        if(state.editReplyFormView.get(reply.id) == true){//如果已打开
            return;
        }
        
        proxy?.$axios({
            url: '/control/comment/manage',
            method: 'get',
            params: {
                method : 'editReply',
                replyId : reply.id,
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
			    			if(key == "reply"){//回复
			    				let _reply = mapData[key];
                                
                                state.editReplyFormView.set(reply.id,true);	
                                nextTick(()=> {
                                    for(let i = 0; i<state.editReplyElementNodes.length; i++){
                                        let editReplyElement = state.editReplyElementNodes[i];
                                        editReplyElement.value = _reply.content;;
                                        let _replyId = editReplyElement.getAttribute("replyId");
                                    
                                        if(_replyId == reply.id){


                                            //编辑器图标
                                            let editorIconList = new Array();
                                            if(mapData.availableTag != null && mapData.availableTag != ''){
                                                let availableTagObject = JSON.parse(mapData.availableTag);//JSON转为对象

                                                if(availableTagObject != null && availableTagObject.length >0){
                                                    for(let i=0; i< availableTagObject.length; i++){
                                                        let availableTag = availableTagObject[i];
                                                        if(availableTag == "emoticons"){
                                                            editorIconList.push(availableTag);
                                                        }else if(availableTag == "mention"){
                                                            //editorIconList.push(availableTag);
                                                        }
                                                    }
                                                }
                                            }


                                            let uploadPath = "control/comment/manage?method=uploadImage&userName="+_reply.userName+"&isStaff="+_reply.isStaff+"&topicId="+state.topicId;
											
                                            //创建富文本编辑器
                                            let editor = createEditor(editReplyElement, editorIconList, uploadPath, null,store_fileStorageSystem.value);
                                            
                                            state.editReplyEditorMap.set(reply.id,editor);
                                            
                                            
                                            
                                
                                            state.editReplyEditorCreateParameMap.set(reply.id,{
                                                ref:editReplyElement,
                                                availableTag:editorIconList,
                                                uploadPath:uploadPath,
                                                userGradeList:null,
                                                editorId:editReplyElement.getAttribute('editorId'),
                                            });
                                            break;
                                        }
                                    }
                                });
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

	//取消修改回复
    const cancelEditReply = (replyId:string) => {
        let editReplyEditor = state.editReplyEditorMap.get(replyId);
        if(editReplyEditor != null){
            editReplyEditor.remove();
            state.editReplyEditorMap.delete(replyId);
            state.editReplyEditorCreateParameMap.delete(replyId);
        }
		state.editReplyFormView.set(replyId,false);
			
	}
    //修改回复
    const editReply = (replyId:string) => {
        state.editReply_disabled.set(replyId,true);
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();
		formData.append('replyId',  replyId); 
			
        if(state.commentList != null && state.commentList.length > 0){
            for (let i = 0; i <state.commentList.length; i++) {
                let comment = state.commentList[i];
                
                if(comment.replyList != null && comment.replyList.length >0){
                    for (let j = 0; j <comment.replyList.length; j++) {
                        let reply = comment.replyList[j];
                        if(reply.id == replyId){
                            formData.append('status', state.replyStatusField[i][j]);
                        }
                    }
                }
                
            }
        }



        for(let i = 0; i<state.editReplyElementNodes.length; i++){
            let editReplyElement = state.editReplyElementNodes[i];
            let _replyId = editReplyElement.getAttribute("replyId");
            
            if(_replyId == replyId){
                formData.append('content', editReplyElement.value);
                break;
            }
        }

        proxy?.$axios({
            url: '/control/comment/manage?method=editReply',
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
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })

                        //删除缓存
                        store.setCacheNumber();

                        clearCommentList();
                        nextTick(()=>{//需要延迟才能让state.editReplyFormView的设置生效
                            state.editReplyFormView.set(replyId,false);
                        })
						
			    		
			    		queryTopic();
                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.editReply_disabled.set(replyId,false);
        })
        .catch((error: any) =>{
            console.log(error);
            state.editReply_disabled.set(replyId,false);
        });
    }

    //删除回复
    const deleteReply = (replyId:string) => {
        ElMessageBox.confirm('此操作将删除该回复, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('replyId', replyId);

            proxy?.$axios({
                url: '/control/comment/manage?method=deleteReply',
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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                            //清除评论列表
                            clearCommentList() 
                            queryTopic();
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
        .catch((error) => {
            console.log(error);
        });
    }

    //分页
    const page = (page:number) => {
		//删除缓存
        store.setCacheNumber();
        
        router.push({
            path: '/admin/control/topic/manage/view', 
            query:{ 
                visible : router.currentRoute.value.query.visible,
                topicView_beforeUrl:(router.currentRoute.value.query.topicView_beforeUrl != undefined ? router.currentRoute.value.query.topicView_beforeUrl:''),
                topicId : state.topicId,
                commentId : state.commentId,
                page : page
            }
        });
    }
    //清除评论列表
    const clearCommentList = () => {
        state.quoteData.clear();
        state.commentList.length =0;

        for (const [key, value] of Object.entries(state.editCommentEditorMap)){
            if(value != null){
                value.html("");//清空字段
				value.remove();
            }
        }
        state.editCommentEditorMap.clear();
        state.editCommentEditorCreateParameMap.clear();

        for (const [key, value] of Object.entries(state.quoteEditorMap)){
            if(value != null){
                value.html("");//清空字段
				value.remove();
            }
        }
        state.quoteEditorMap.clear();
        state.quoteEditorCreateParameMap.clear();

        state.editCommentFormView.clear();
        state.quoteFormView.clear();

        for (const [key, value] of Object.entries(state.addReplyEditorMap)){
            if(value != null){
                value.html("");//清空字段
				value.remove();
            }
        }
        state.addReplyEditorMap.clear();
        state.addReplyFormView.clear() //添加回复表单
        state.addReplyEditorCreateParameMap.clear()//添加回复编辑器的创建参数

        for (const [key, value] of Object.entries(state.addReplyFriendEditorMap)){
            if(value != null){
                value.html("");//清空字段
				value.remove();
            }
        }
        state.addReplyFriendEditorMap.clear();
        state.addReplyFriendFormView.clear() //添加回复对方表单
        state.addReplyFriendEditorCreateParameMap.clear()//添加回复对方编辑器的创建参数


        for (const [key, value] of Object.entries(state.editReplyEditorMap)){
            if(value != null){
                value.html("");//清空字段
				value.remove();
            }
        }
        state.editReplyEditorMap.clear();
        state.editReplyFormView.clear() //修改回复表单
        state.editReplyEditorCreateParameMap.clear()//修改回复编辑器的创建参数
    }

    //点击回复层级
    const clickReplyLevel = (commentId:string,replyId:string) => {
       
        //是否点击已选中的项
        let isSelectedItem = false;


        if(state.dot.size >0){
            let lastFriendReplyId = [...state.dot][state.dot.size-1];//最后一个元素
            if(lastFriendReplyId[0] == replyId){
                isSelectedItem = true;
            }
        }

        state.dot.clear();
        state.line.clear();
        if(!isSelectedItem){
            showReplyLevel(commentId,replyId);
        }
        
    }

    //展示回复层级
    const showReplyLevel = (commentId:string,replyId:string) => {

        let dotArray = new Array();
        let replyList = [] as Array<Reply>;
        if(state.commentList != null && state.commentList.length > 0){
            A:for (let i = 0; i <state.commentList.length; i++) {
                let comment = state.commentList[i];
				
                 if(comment.id == commentId){
                    //回复
                    if(comment.replyList != null && comment.replyList.length >0){
                        replyList = comment.replyList;
                        for (let j = 0; j <comment.replyList.length; j++) {
                            let reply = comment.replyList[j];
                            if(reply.id == replyId && reply.friendUserName != null && reply.friendUserName != ''){
                                let friendReplyIdArray = reply.friendReplyIdGroup.split(",");
                                for (let k = 0; k <friendReplyIdArray.length; k++) {
                                    let friendReplyId = friendReplyIdArray[k];
                                    if(friendReplyId != '' && friendReplyId != '0'){
                                        dotArray.push(friendReplyId);
                                    }
                                }
                                break A;
                            }
                        }
                    }
                 }                       
                
            }
        }

        //第一个有效层级
        let firstLevel = '';

        A:for (let i = 0; i <dotArray.length; i++) {
            let friendReplyId = dotArray[i];
            for (let j = 0; j <replyList.length; j++) {
                let reply = replyList[j];
                if(reply.id == friendReplyId){
                    firstLevel = friendReplyId;
                    break A;
                }
            }
        }

        //过滤无效的点
        A:for (let i = dotArray.length - 1; i >= 0; i--) {
            let friendReplyId = dotArray[i];
            for (let j = 0; j <replyList.length; j++) {
                let reply = replyList[j];
                if(reply.id == friendReplyId){
                    continue A;
                }
            }
            dotArray.splice(i, 1);
        }

        if(dotArray.length >0){
            for (let i = 0; i <dotArray.length; i++) {
                let friendReplyId = dotArray[i];
                state.dot.set(friendReplyId,true);//楼中楼的点
            }
            for (let i = 0; i <replyList.length; i++) {
                let reply = replyList[i];
                if(reply.id == firstLevel){
                    state.line.set(reply.id,true);//楼中楼的线
                    continue;
                }
                if(reply.id == replyId){
                    break;
                }
                if(state.line.size >0){
                    state.line.set(reply.id,true);//楼中楼的线
                }
            }

            state.dot.set(replyId,true);//楼中楼点击的层
        }
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

		
		if(router.currentRoute.value.query.visible != undefined && router.currentRoute.value.query.visible != ''){
			state.visible = router.currentRoute.value.query.visible as string;
		}

		if(router.currentRoute.value.query.topicId != undefined && router.currentRoute.value.query.topicId != ''){
			state.topicId = router.currentRoute.value.query.topicId as string;
		}
		if(router.currentRoute.value.query.commentId != undefined && router.currentRoute.value.query.commentId != ''){
			state.commentId = router.currentRoute.value.query.commentId as string;
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}

		
		//上级路由解码
		if(router.currentRoute.value.query.topicView_beforeUrl != undefined && router.currentRoute.value.query.topicView_beforeUrl != ''){
			
            let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.topicView_beforeUrl as string);
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
		
		
		
		
		queryTopic();

        
    }) 

    //keep-alive 进入时
    onActivated (()=>{
        if (Object.keys(state.addCommentEditorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.addCommentEditor = createEditor(
				state.addCommentEditorCreateParameObject.ref, 
				state.addCommentEditorCreateParameObject.availableTag, 
				state.addCommentEditorCreateParameObject.uploadPath, 
				null,
                store_fileStorageSystem.value
			);
		}
		
		
		//创建富文本编辑器
		state.quoteEditorCreateParameMap.forEach(function(value,key){
			let editor = createEditor(
				value.ref, 
				value.availableTag, 
				value.uploadPath, 
				null,
                store_fileStorageSystem.value
			);
		
			state.quoteEditorMap.set(key,editor);
	    });
	
		//创建富文本编辑器
		state.editCommentEditorCreateParameMap.forEach(function(value,key){
			let editor = createEditor(
				value.ref, 
				value.availableTag, 
				value.uploadPath, 
				null,
                store_fileStorageSystem.value
			);
		
			state.editCommentEditorMap.set(key,editor);
	    });
	
		if (Object.keys(state.editTopicEditorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.editTopicEditor = createEditor(
				state.editTopicEditorCreateParameObject.ref, 
				state.editTopicEditorCreateParameObject.availableTag, 
				state.editTopicEditorCreateParameObject.uploadPath, 
				state.editTopicEditorCreateParameObject.userGradeList,
                store_fileStorageSystem.value
			);
		}

            //创建添加回复富文本编辑器
		state.addReplyEditorCreateParameMap.forEach(function(value,key){
            let editor = createEditor(
                value.ref, 
                value.availableTag, 
                value.uploadPath, 
                null,
                store_fileStorageSystem.value
            );
        
            state.addReplyEditorMap.set(key,editor);
	    });
        //创建添加回复对方富文本编辑器
		state.addReplyFriendEditorCreateParameMap.forEach(function(value,key){
            let editor = createEditor(
                value.ref, 
                value.availableTag, 
                value.uploadPath, 
                null,
                store_fileStorageSystem.value
            );
        
            state.addReplyFriendEditorMap.set(key,editor);
	    });
        //创建修改回复富文本编辑器
		state.editReplyEditorCreateParameMap.forEach(function(value,key){
            let editor = createEditor(
                value.ref, 
                value.availableTag, 
                value.uploadPath, 
                null,
                store_fileStorageSystem.value
            );
        
            state.editReplyEditorMap.set(key,editor);
	    });
    })

    // keep-alive 离开时
    onDeactivated (()=>{
        if (Object.keys(state.addCommentEditor).length != 0) {//不等于空
			state.addCommentEditor.remove();
            state.addCommentEditor = {};
		}
		
		
		state.quoteEditorMap.forEach(function(value,key){
			value.remove();
	    });
        state.quoteEditorMap.clear();
		
		state.editCommentEditorMap.forEach(function(value,key){
			value.remove();
	    });
		state.editCommentEditorMap.clear();
		
		if (Object.keys(state.editTopicEditor).length != 0) {//不等于空
			state.editTopicEditor.remove();
            state.editTopicEditor = {};
		}

        state.addReplyEditorMap.forEach(function(value,key){
			value.remove();
	    });
		state.addReplyEditorMap.clear();

        state.addReplyFriendEditorMap.forEach(function(value,key){
			value.remove();
	    });
		state.addReplyFriendEditorMap.clear();

        state.editReplyEditorMap.forEach(function(value,key){
			value.remove();
	    });
		state.editReplyEditorMap.clear();
    })
    
</script>
<style scoped lang="scss">
/* 话题查看 */
.topicViewModule{
	.topic-wrap{
        background: #fff;
        position: relative;
        .topicTag{
            padding-top:15px;
            margin-left:10px;
            .tag{
                display: inline-block;
                font-size: 14px;
                line-height: 14px;
                padding: 6px 8px 6px 8px;
                margin-right: 5px;
                border-radius: 3px;
                color: #555;
                background-color: #f5f5f6;
                position:relative;
            }
        }
        .operat{
            position: absolute;
            top: 18px;
            right: 10px;
            .item{
                margin-left: 10px;
                line-height: 24px;
            }
        }
        .head{
            height: auto;
            padding:15px 10px 5px 10px;
            .title{
                color:#303133;
                font-size:24px;
                border:none;
                line-height:34px; 
                margin:9px 0 18px 0;
                .essence{
                    display: inline-block;
                    padding: 4px 5px 4px;
                    margin-right:5px;
                    font-size: 14px;
                    line-height: 14px;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    color: #fff;
                    background-color: #ff7875;
                    position: relative;
                    top: -3px;
                }
                .top{
                    display: inline-block;
                    padding: 4px 5px 4px;
                    margin-right:5px;
                    font-size: 14px;
                    line-height: 14px;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    color: #fff;
                    background-color: #69c0ff;
                    position: relative;
                    top: -3px;
                }
            }
            .topicInfo{
                color: #909399;
                font-size: 14px;
                .avatar{
                    float: left;
                    .avatar-wrapper{
                        .avatar-badge{
                            .el-avatar--icon{
                                margin-bottom: 5px;
                            }
                        }
                    }
                }
                
                .userName{
                    float: left;margin-left: 10px;position: relative;top: 50px;
                    .nickname{
                        position: absolute;left: 0px;top: -26px;white-space: nowrap;
                    }
                }
                .postTime{
                    float: left;margin-left: 20px;position: relative;top: 50px;
                }
                .viewTotal-icon{
                    float: left;margin-left: 20px; position: relative;top: 51px;
                }
                .viewTotal{
                    float: left;margin-left: 3px;  position: relative;top: 48px;
                }
                .comment-icon{
                    float: left;margin-left: 20px;position: relative;top: 51px;
                }
                .comment{
                    float: left;margin-left: 3px;  position: relative;top: 48px;
                }
                .ipAddress{
                    float: right;position: relative;top: 48px;
                    .statusTagInfo{
                        position: absolute;right:0px; top: -30px;white-space: nowrap;
                    }
                    .redEnvelope{
                        display: inline-block;
                        font-size: 14px;
                        line-height: 14px;
                        padding: 6px 8px 6px 8px;
                        border-radius: 3px;
                        color:#ff4d4f;
                        background-color:#ffccc7;
                        margin-left: 6px;
                    }
                }
                .green-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#67C23A;
                    background-color:#e1f3d8;
                    margin-left: 6px;
                }
                .orange-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#E6A23C;
                    background-color:#faecd8;
                    margin-left: 6px;
                }
                .red-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#F56C6C;
                    background-color:#fde2e2;
                    margin-left: 6px;
                }
            }
            .el-badge__content.is-fixed{
                top: 1px;
            }
        }
        :deep(.main) {
            margin: 0px 10px 10px 10px;
            padding-top:10px;
            padding-bottom:15px;
            min-height: 80px;
            font-size: 15px;
            line-height: 1.8;
            color: #222;
            border-top: 1px solid #f1f1f1;
            word-wrap:break-word;
            .lastUpdateTime{
                text-align: center;line-height: 40px;padding-bottom: 30px;color: #939499;
            }
            a{
                font-size: 15px;
                line-height: 1.8;
                color: #26a2ff;
            }
            i {
                font-style:normal;
            }
            p{word-wrap:break-word;}
            pre{white-space:pre-wrap;}
            pre code{/*连续字母数字换行*/
                word-break: break-all;
            }
            img{
                max-width:100%;height:auto;border:none;background:none;padding:0;vertical-align: sub;
            }
            .el-image[style*="width: 32px; height: 32px;"]{
                top: 3px;
            }
            iframe{
                width:100%; height: 550px;padding:10px 0px; 
            }
            video{
                width:100%; height: 550px;padding:10px 0px; outline:none;
            }
            .download{
                color: #1890ff;
                margin: 0 5px 0 5px;
                cursor: pointer;
                .link-icon {
                    position: relative;
                    top: 4px;
                    margin-right: 2px;
                    color:#1890ff;
                    width: 20px; height: 20px;
                }
            }
            hide{
                border: 0;
                border-left: 3px solid #53a8ff;
                margin-left: 10px;
                padding: 0.5em;
                min-height:26px;
                display: block;
                margin: 30px 0px 0px 0px;
                
            }
            table {
                width: 100%;
                th {
                    font-weight: 600
                }
                td,
                th {
                    border: 1px solid #E5E6EB;
                    padding: 6px 13px
                }
                tr {
                    background-color: #fff;
                    border-top: 1px solid #E5E6EB;
                    &:nth-child(2n) {
                        background-color: #F7F8FA;
                    }
                }
            }
            ol{
                li{ 
                    list-style-type:decimal;
                    list-style-position:inside;
                }
            }
            ul{
                li{ 
                    margin-left:20px;
                    list-style-type:disc;
                }
            }
            .inputValue_10{
                &:before {
                    content: '密码: ' attr(input-value) '';
                    color: #53a8ff;
                    font-size:14px;
                    position: absolute;
                    margin-top: -30px;
                    line-height: 30px;
                }
            }
            .inputValue_20{
                &:before {
                    content: '回复话题可见';
                    color: #53a8ff;
                    font-size:14px;
                    position: absolute;
                    margin-top: -30px;
                    line-height: 30px;
                }
            }
            .inputValue_30{
                &:before {
                    content: '达到等级 ' attr(description) ' 可见';
                    color: #53a8ff;
                    font-size:14px;
                    position: absolute;
                    margin-top: -30px;
                    line-height: 30px;
                }
            }
            .inputValue_40{
                &:before {
                    content: '需要支付 ' attr(input-value) ' 积分可见';
                    color: #53a8ff;
                    font-size:14px;
                    position: absolute;
                    margin-top: -30px;
                    line-height: 30px;
                }
            }
            .inputValue_50{
                &:before {
                    content: '需要支付 ' attr(input-value) ' 元费用可见';
                    color: #53a8ff;
                    font-size:14px;
                    position: absolute;
                    margin-top: -30px;
                    line-height: 30px;
                }
            }
            player{
                display: block;
                margin-top: 8px;
                height: 576px;
            }
            .dplayer-process {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99;
                .box{
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .prompt{
                        width: 250px;
                        height: 80px;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        padding :0px 30px;
                        border-radius :3px;
                        color: #fff;
                        line-height: 80px;
                        font-size: 20px;
                        background-color:rgb(0,0,0);
                        opacity:0.7;
                        filter:alpha(opacity=70);
                        text-align: center;
                    }
                }
            }

        }
        //举报标记
        .reportMark{
            &:before{
                content: " ";
                position: absolute;
                top: 0px;
                left: -8px;
                bottom:0px;
                border-left: 5px solid #f89898;
            }
        }
    }
    .el-link--default{
        color: #909399 !important;
        &:hover {
            color: #409EFF !important;
        }
    }
    .el-link--default.is-disabled{
        color: #dedfe0 !important;
    }

    .editTopic{
        margin-left: 10px;margin-right: 10px; margin-top: 40px; margin-bottom: 10px;
    }
}

.topicViewModule_topic-wrap_head_topicInfo_userRoleName{
	margin-left:3px;
	white-space:nowrap;
	color:#e2b46e;
	background-color:#f8e7c4;
	border-radius:4px;
	padding:1px 5px;
	font-size: 12px;
	font-style: normal;
	font-weight: normal;
}





.commentModule {
	.commentList {
        width: 100%;
        background: #fff;
        margin-top: 10px;
        padding-bottom: 20px;
        .item {
            margin-left: 10px; 
            margin-right: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 2px;
            padding-top: 2px;
            .head {
                min-height: 64px;
                padding: 10px 0px 0;
                margin: 0;
                position: relative;
                .avatarBox{
                    position:absolute;display:inline-block;
                    left: 0px;top:8px;
                    
                }
                .el-badge__content.is-fixed{
                    transform: scale(0.9);right: -24px;top: -9px;
                }
                .info {
                    display: block;
                    float: left;
                    margin-left: 74px;
                    h2 {
                        color:#909399;
                        font-size:14px;
                        float: left;
                        .userName{
                            margin-right: 5px;
                            position: relative;top: 44px;
                            .nickname{
                                position: absolute;top: -25px;left: 0px;white-space: nowrap;
                            }
                        }
                    }
                    .master{
                        white-space:nowrap;
                        color:#fff;
                        background-color:#4cc8ff;
                        border-radius:4px;
                        padding:1px 5px;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: normal;
                        position: relative;top: -1px;margin-right: 5px;
                    }
                    .userRoleName{
                        white-space:nowrap;
                        color:#e2b46e;
                        background-color:#f8e7c4;
                        border-radius:4px;
                        padding:1px 5px;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: normal;
                        position: relative;top: -1px;margin-right: 5px;
                    }
                }
                .time {
                    color:#909399;float: left;position: relative;top: 44px;margin-left: 5px;
                }
                .floor {
                    float: right;
                    margin-right:5px;
                    color:#909399;
                    position: relative;
                    top: -1px;
                }
            }
            .main {
                padding: 20px 0px 0 74px;
                font-size: 16px;
                line-height: 26px;
                margin: 0 0 10px;
                :deep(.commentContent) {
                    margin-bottom: 10px;
                    color:#222;font-size: 15px;word-wrap:break-word;
                    a{
                        font-size: 15px;
                        color: #26a2ff;
                    }
                    p{font-size:16px;word-wrap:break-word}
                    /* 自动换行 */
                    pre{white-space:pre-wrap;}
                    pre code{/*连续字母数字换行*/
                        word-break: break-all;
                    }
                    img {
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0;vertical-align: sub;
                    }
                    .el-image[style*="width: 32px; height: 32px;"]{
                        top: 3px;
                    }
                    table {
                        width: 100%;
                        th {
                            font-weight: 600
                        }
                        td,
                        th {
                            border: 1px solid #E5E6EB;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid #E5E6EB;
                            &:nth-child(2n) {
                                background-color: #F7F8FA;
                            }
                        }
                    }
                    ol{
                        li{ 
                            list-style-type:decimal;
                            list-style-position:inside;
                        }
                    }
                    ul{
                        li{ 
                            margin-left:20px;
                            list-style-type:disc;
                        }
                    }
                }
                .quote{
                    padding:5px 8px;border-bottom:none;text-align: left;margin-left: 5px;
                    :deep(.quoteComment){
                        background:#fafafa;padding:3px 3px 0px 3px;border:1px solid #ddd;line-height:140%;font-size: 15px;border-radius: 3px;
                        .userInfo{
                            position: relative;
                            .avatar{
                                float: left;margin-left: 5px;margin-top: 10px;
                            }
                            .info {
                                display: block;
                                float: left;
                                margin-left: 5px;
                                h2 {
                                    color:#909399;
                                    font-size:14px;
                                    float: left;
                                    .userName{
                                        margin-right: 5px;
                                        position: relative;top: 30px;
                                        .nickname{
                                            position: absolute;top: -19px;left: 0px;white-space: nowrap;
                                        }
                                    }
                                }
                                .master{
                                    white-space:nowrap;
                                    color:#fff;
                                    background-color:#4cc8ff;
                                    border-radius:4px;
                                    padding:1px 5px;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: normal;
                                    position: relative;top: -1px;margin-left: 5px;
                                }
                                .userRoleName{
                                    white-space:nowrap;
                                    color:#e2b46e;
                                    background-color:#f8e7c4;
                                    border-radius:4px;
                                    padding:1px 5px;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: normal;
                                    position: relative;top: -1px;margin-left: 5px;
                                }
                            }
                            .el-badge__content{
                                transform: scale(0.7);top: -10px;
                                right: -18px;
                            }
                        }
                        .content{
                            margin-left: 5px;margin-top: 60px;margin-bottom: 10px;line-height: 26px;
                            
                        }

                    }
                }

            }



            .bottomInfo {
                height: 24px;
                overflow: hidden;
                text-align: right;
                margin-top: 25px;
                .toolbar {
                    height: 100%;
                    margin-right:4px;
                    .operat-btn{
                        color:#909399;
                        font-size: 14px;
                        margin-left: 14px;
                        cursor:pointer;
                        position: relative;
                        top: -1px;
                        line-height: 24px;
                    }
                    .green-tag{
                        display: inline-block;
                        font-size: 14px;
                        line-height: 14px;
                        padding: 4px 6px 4px 6px;
                        border-radius: 3px;
                        color:#67C23A;
                        background-color:#e1f3d8;
                        margin-left: 6px;
                    }
                    .orange-tag{
                        display: inline-block;
                        font-size: 14px;
                        line-height: 14px;
                        padding: 4px 6px 4px 6px;
                        border-radius: 3px;
                        color:#E6A23C;
                        background-color:#faecd8;
                        margin-left: 6px;
                    }
                    .red-tag{
                        display: inline-block;
                        font-size: 14px;
                        line-height: 14px;
                        padding: 4px 6px 4px 6px;
                        border-radius: 3px;
                        color:#F56C6C;
                        background-color:#fde2e2;
                        margin-left: 6px;
                    }
                }
            }
        }
        //举报标记
        .reportMark{
            position:relative;
            &:before{
                content: " ";
                position: absolute;
                top: 0px;
                left: -18px;
                bottom:0px;
                border-left: 5px solid #f89898;
            }
        }
        .replyList {
            padding: 10px 0 0px;
            margin-left: 36px;
            margin-right:10px;
            position: relative;
            font-size: 15px;
            line-height: 22px;
            margin-top: 20px;
            background: #fbfbfb;

            &:before {
                position: absolute;
                display: block;
                width: 16px;
                height: 16px;
                border-top: 1px solid #fbfbfb;
                border-left: 1px solid #fbfbfb;
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                transform: rotate(45deg);
                content: "";
                background-color: #fbfbfb;
                top: -4px;
                left: 60px
            }
            .box{
                .replyItem-container{
                    position: relative;
                    left: -30px;

                    &:last-child{
                        //border-bottom: 1px solid #fff;
                        .replyItem{
                            border-bottom: 1px solid #fff;
                        }
                    }
                    &:before,
                    &:after {
                        content: "";
                        display: table;
                        font: 0/0 a
                    }
                    &:after {
                        clear: both;
                    }
                    .replyItem {
                        margin-bottom: 10px;
                        border-bottom: 1px solid #f1f1f1;
                        padding-bottom: 5px;
                        margin-left: 40px;
                        margin-right:-20px;
                        
                        //举报标记
                        .reply-reportMark{
                            position: relative;
                            &:before{
                                content: " ";
                                position: absolute;
                                top: -10px;
                                left: -18px;
                                bottom:-5px;
                                border-left: 5px solid #f89898;
                            }
                        }
                        .reply-top{
                            position:relative;
                            .avatarBox{
                                position:absolute;display:inline-block;
                                left: 0px;top:6px;
                                
                            }
                            .el-badge__content.is-fixed{
                                transform: scale(0.9);right: -24px;top: -9px;
                            }
                            .info {
                                display: block;
                                float: left;
                                margin-left: 58px;
                                h2 {
                                    color:#909399;
                                    font-size:14px;
                                    float: left;
                                    .userName{
                                        margin-right: 5px;
                                        position: relative;top: 14px;font-size:14px;


                                        .nickname{
                                            min-height: 22px;
                                            white-space: nowrap;font-size:14px;
                                        }
                                        .account{

                                            .time {
                                                font-weight:normal;
                                                color:#909399;margin-left: 10px;font-size:14px;
                                            }
                                        }
                                    }
                                }
                                .master{
                                    white-space:nowrap;
                                    color:#fff;
                                    background-color:#4cc8ff;
                                    border-radius:4px;
                                    padding:1px 5px;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: normal;
                                    position: relative;top: -1px;margin-right: 5px;
                                }
                                .userRoleName{
                                    white-space:nowrap;
                                    color:#e2b46e;
                                    background-color:#f8e7c4;
                                    border-radius:4px;
                                    padding:1px 5px;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: normal;
                                    position: relative;top: -1px;margin-right: 5px;
                                }
                            }
                            .friendInfo {
                                display: block;
                                float: left;
                                margin-left: 70px;
                                position:relative;
                                .arrow{
                                    float: left;
                                    color: #b1b3b8;
                                    position: relative;
                                    top: 21px;
                                    left: -45px;
                                }
                                .friendAvatarBox{
                                    position:absolute;display:inline-block;
                                    left: 0px;top:6px;
                                }

                                .nameInfo {
                                    color:#909399;
                                    font-size:14px;
                                    float: left;
                                    margin-left: 42px;
                                    .userName{
                                        margin-right: 5px;
                                        position: relative;top: 36px;font-size:14px;
                                        .nickname{
                                            position: absolute;top: -22px;left: 0px;white-space: nowrap;font-size:14px;
                                        }
                                    }
                                }
                                .master{
                                    white-space:nowrap;
                                    color:#fff;
                                    background-color:#4cc8ff;
                                    border-radius:4px;
                                    padding:1px 5px;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: normal;
                                    position: relative;top: -1px;margin-right: 5px;
                                }
                            }
                            .operatInfo {
                                float: right;
                                .operat-btn{
                                    margin-left: 10px;
                                    line-height:24px;
                                    position: relative;
                                    top: -1px;
                                }
                                .green-tag{
                                    display: inline-block;
                                    font-size: 14px;
                                    line-height: 14px;
                                    padding: 4px 6px 4px 6px;
                                    border-radius: 3px;
                                    color:#67C23A;
                                    background-color:#e1f3d8;
                                    margin-left: 6px;
                                }
                                .orange-tag{
                                    display: inline-block;
                                    font-size: 14px;
                                    line-height: 14px;
                                    padding: 4px 6px 4px 6px;
                                    border-radius: 3px;
                                    color:#E6A23C;
                                    background-color:#faecd8;
                                    margin-left: 6px;
                                }
                                .red-tag{
                                    display: inline-block;
                                    font-size: 14px;
                                    line-height: 14px;
                                    padding: 4px 6px 4px 6px;
                                    border-radius: 3px;
                                    color:#F56C6C;
                                    background-color:#fde2e2;
                                    margin-left: 6px;
                                }
                            }
                        }
                        :deep(.replyContent){
                            line-height:26px;
                            margin-top: 40px;
                            padding-top: 8px;
                            padding-bottom: 8px;
                            color:#666;font-size: 15px;word-wrap:break-word;
                            a{
                                font-size: 15px;
                                color: #26a2ff;
                            }
                            p{font-size:16px;word-wrap:break-word}
                           
                            .el-image[style*="width: 32px; height: 32px;"]{
                                top: 3px;
                            }
                        }
                        /* 添加回复对方  */
                        .addReplyFriend-post{
                            margin-top:50px;
                            margin-left: 15px;
                            margin-right: 15px;
                            padding-bottom: 15px;
                            /* 富文本编辑框颜色 */
                            :deep(.ke-edit) {
                                border: 1px solid transparent;
                            }
                            .el-form-item__label{
                                line-height: 20px;
                            }
                            .el-form--label-top{
                                .el-form-item__label{
                                    padding :10px 0px 0px 0px;
                                }
                            }
                            .el-form-item__content{
                                line-height: 30px;
                            }
                            .el-form-item {
                                margin-bottom: 10px;
                            }
                            .addReplyFriend-textarea{
                                width:100%;visibility:hidden;height: 200px;
                            }
                        }
                    }
                }
                
                /*修改回复*/
                .editReply-post{
                    margin-top:50px;
                    margin-left: 15px;
                    margin-right: 15px;
                    padding-bottom: 15px;
                    /* 富文本编辑框颜色 */
                    :deep(.ke-edit) {
                        border: 1px solid transparent;
                    }
                    .el-form-item__label{
                        line-height: 20px;
                    }
                    .el-form--label-top{
                        .el-form-item__label{
                            padding :10px 0px 0px 0px;
                        }
                    }
                    .el-form-item__content{
                        line-height: 30px;
                    }
                    .el-form-item {
                        margin-bottom: 10px;
                    }
                    .editReply-textarea{
                        width:100%;visibility:hidden;height: 200px;
                    }
                }
            }
        }
        /* 添加回复  */
        .addReply-post{
            margin-top:50px;
            margin-left: 75px;
            .addReply-wrap{
                position: relative;
                padding:20px 20px 50px 20px;
                background: #f9f9f9;
                /* 富文本编辑框颜色 */
                :deep(.ke-edit) {
                    border: 1px solid transparent;
                }
                .head-tag{
                    .icon{
                        position: absolute;font-size: 50px;top: -36px;left: -40px;color: #f9f9f9;
                    }
                }
                .addReply-textarea{
                    width:100%;visibility:hidden;height: 200px;
                }
                .promptInfo{
                    position: absolute;
                    right:15px;
                    bottom:32px;
                    h2{
                        font-size: 16px;
                        color: #ccc;
                    }
                }
                .form-action {
                    padding-left: 0px; padding-right: 0px; padding-top: 8px;margin-bottom: 12px;
                }
            }
        }
        .quote-formModule {
            margin-top:50px;
            margin-left: 75px;
            .addQuote-wrap{
                position: relative;
                padding:20px 20px 50px 20px;
                background: #f9f9f9;
                .head-tag{
                    .icon{
                        position: absolute;font-size: 50px;top: -36px;left: -40px;color: #f9f9f9;
                    }
                }
                .quote-textarea{
                    width:100%;visibility:hidden;height: 200px;
                }
                .promptInfo{
                    position: absolute;
                    right:15px;
                    bottom:32px;
                    h2{
                        font-size: 16px;
                        color: #ccc;
                    }
                }
                .form-action {
                    padding-left: 0px; padding-right: 0px; padding-top: 8px;margin-bottom: 12px;
                }
                .quoteSubmit {
                    height: 38px;
                    float: left;
                    margin-right: 10px;
                    position: relative;
                    z-index: 2
                }
            }
        }
        /* 修改评论  */
        .editComment-formModule {
            margin-top:50px;
            margin-left: 75px;
            .editComment-wrap{
                position: relative;
                padding:6px 20px 50px 20px;
                background: #f9f9f9;
                .head-tag{
                    .icon{
                        position: absolute;font-size: 50px;top: -36px;left: -42px;color: #f9f9f9;
                    }
                }
                .el-form-item__label{
                    line-height: 20px;
                }
                .el-form--label-top{
                    .el-form-item__label{
                        padding :10px 0px 0px 0px;
                    }
                }
                .el-form-item__content{
                    line-height: 30px;
                }
                .el-form-item {
                    margin-bottom: 10px;
                }
                .editComment-textarea{
                    width:100%;visibility:hidden;height: 200px;
                }
                .promptInfo{
                    position: absolute;
                    right:15px;
                    bottom:32px;
                    h2{
                        font-size: 16px;
                        color: #ccc;
                    }
                }
                .form-action {
                    padding-left: 0px; padding-right: 0px; padding-top: 8px;margin-bottom: 12px;
                }
                .editCommentSubmit {
                    height: 38px;
                    float: left;
                    margin-right: 10px;
                    position: relative;
                    z-index: 2
                }
            }
        }
        .pagination-wrapper{//分页
            margin-top: 25px;
            margin-bottom: 15px;
            margin-right: 15px;
            display: flex;
            justify-content: flex-end;
        }
    }
    .addComment{
        margin-left: 10px;margin-right: 10px; margin-top: 20px; margin-bottom: 10px;padding-top: 10px;
    }
    .el-link--default{
        color: #909399 !important;
    }
    .el-link--default:hover {
        color: #409EFF !important;
    }
    .el-link--default.is-disabled{
        color: #dedfe0 !important;
        cursor: not-allowed !important;
    }

}
</style>