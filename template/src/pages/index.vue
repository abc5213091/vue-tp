<template>
 	<div> 
 		<a @click="loading">loading...</a>
 		<a @click="toast">toast</a>
 		<a @click="isDialog = true">dialog</a>
 		<a @click="bridge">cMwebViewJsBridge</a>
 		<a @click="$store.dispatch('login',{phone:'13100001133', password:'test123'})">ajax</a>
 		<a @click="$store.dispatch('loginFecth',{phone:'13100001133', password:'test123'})">fetch</a>

 		<router-link to="login">login</router-link>


 		<!-- dialog组件 -->
		<xdialog :show="isDialog" v-on:hide="isDialog = false"  :title="'弹出框'">
			<p>
				我是一个安静的弹出框
			</p>
		</xdialog>
 	</div>

</template>
<script>
	import { mapGetters } from 'vuex'
	// const initData = async store =>{
	// 	await store.dispatch('getUser')
	// }
	export default {
		
		data() {
			return {
				isDialog:false
			}
				
		},
		computed: {
			...mapGetters({
				user: 'getUser'
			})
		},
		components: {
			
		},
		mounted(){
			/*初始化APP桥接*/
			cMwebViewJsBridgeInit();

		},
		// watch: {
		// 	'$route'(){
		// 		initData(this.$store)
		// 	}
		// },
		methods: {
			loading(){
				_.loading(1)
			},
			toast(){
				_.toast('this is a toast!')
			},
			bridge() {
	
				if(!_.isInNiiwooApp()){
					_.toast('请在App中测试！')
				}else{
					_.loading(1)
					
					
					function BridgeInit(bridge, isAndroid){
					    if (isAndroid) {
					        bridge.callHandler('10005', '{Status:true}', 'showUT');
					    } else {
					         bridge.callHandler('10005', {Status:true}, showUT);
					     }
					}
					window.showUT=function(data){
						try {
							data = JSON.parse(data)
						} catch(e) {
							// statements
							alert('JSON格式化出错！')
						}

						if(data.Data.UserToken){
							
								_.loading(0)
								
								_.toast(JSON.stringify(data.Data))
							
						}
					}

					cMwebViewJsBridge(BridgeInit);
				}
			}

		}
		
	}
</script>
<style type="text/css" scoped>
	a { display: block; margin: .3rem .3rem 0; padding: .2rem 0; border-radius: .1rem; font-size: .28rem; text-align: center; color: #fff; background-color: #2ad378; text-decoration: none;}
a:nth-of-type(1) { margin-top: .3rem;}
</style>