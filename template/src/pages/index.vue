<template>

	<div v-if="!user.user.realName">
		<xhead></xhead>
		<div class="container" >
			<div class="bg2">
				<h1 class="logo">你我金融</h1>
				<div class="form">
					<div class="form-item">
						<div class="item-main">
							<!-- <div class="item-media"><i class="form-icon fa fa-user"></i></div> -->
							<div class="item-media"><i class="iconfont icon-nwuser"></i></div>
							<div class="item-control">
								<input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="phone">
							</div>
							<div class="item-operate fa fa-times-circle" v-show="phone" @click="phone = ''"></div>
						</div>
					</div>
					<div class="form-item">
						<div class="item-main">
							<!-- <div class="item-media"><i class="form-icon fa fa-lock"></i></div> -->
							<div class="item-media"><i class="iconfont icon-nwpassword"></i></div>
							<div class="item-control">
								<input maxlength="16" placeholder="请输入密码" type="password" v-model="password">
							</div>
							<div class="item-operate fa " v-show="password" @click="togglePassword"></div>
						</div>
						<!-- <div class="item-sub"><a href="javascript:">忘记密码？</a></div> -->
					</div>
				</div>
				<div class="msg" v-show="msg" v-text="msg"></div>
			</div>
			<div class="btn-group">
				<a class="btn btn-main" href="javascript:" @click="login">登 录</a>
				<button type="" @click="showForm=true"> 打开form</button>
				<button type="" @click="showForm=false"> 关闭form</button>
			</div>
			<p>
				<router-link to="/list">Go to list</router-link>
			</p>
		</div>
		<xfoot></xfoot>
		<xform v-if="showForm" v-on:hide="showForm=false"></xform>
	</div>
	<div v-else>
		<ul>
			<li v-for="(v,k) in user.user">{{k}}------{{v}}</li>
		</ul>
	</div>
</template>
<script>
	import xhead from '../components/head'
	import xfoot from '../components/foot'
	import xform from '../components/form'
	import { mapGetters } from 'vuex'
	// const initData = async store =>{
	// 	await store.dispatch('getUser')
	// }

	export default {
		data() {
			alert(123)
			return {
				phone: '',
				password: '',
				access_token: '',
				openid: '',
				showLoading: true,
				showEye: false,
				inputType: 'password',
				isHaveProject: '',
				inputType: 'password',
				msg: '',
				isWX: false,
				showForm:false
			}
		},
		computed: {
			...mapGetters({
				user: 'getUser'
			})
		},
		components: {
			xhead,
			xfoot,
			xform
		},
		mounted(){
			// cMwebViewJsBridge(this.BridgeInit)
		},
		// watch: {
		// 	'$route'(){
		// 		initData(this.$store)
		// 	}
		// },
		methods: {
			BridgeInit(bridge,isAndroid){
		        let param = { Status : false};
		       bridge.callHandler('10005', isAndroid?JSON.stringify(param):param, isAndroid?this.showUT.toString(): this.showUT);
			},
			showUT(data){
				alert(data)
			},
			togglePassword() {
				this.inputType = (this.inputType == 'password') ? 'text' : 'password';
			},
			// 点击登录
			login() {
				if (!this.phone) {
					this.msg = '请输入手机号码';
				} else if (!this.password) {
					this.msg = '请输入密码';
				} else {
					this.$store.dispatch('login',{phone:this.phone, password:this.password});
				}
			}

		}
		
	}
</script>