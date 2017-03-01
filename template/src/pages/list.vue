<template>
	<div>
		<h3>this is a list</h3>

		<p>
			<router-link to="/">Go to home</router-link>
		</p>

		<button @click="EidtTitle">德玛西亚</button>
	</div>
</template>

<script>
	export default {
		mounted(){
			// cMwebViewJsBridge(this.GetUserToken);
		},
		methods:{
			GetUserToken(){
				alert(1)
				function BridgeInit(bridge,isAndroid){
					alert(2)
					let param = { Status : true};
		        	bridge.callHandler('10005', isAndroid?JSON.stringify(param):param, isAndroid?'showUT':showUT);
				}
				function showUT(data){
					alert(data)
				}
			},
			EidtTitle(){
				cMwebViewJsBridge(EidtTitle);
				function EidtTitle(bridge, isAndroid){
					let param = { Title : '德玛西亚' };
					bridge.callHandler('10003', isAndroid?JSON.stringify(param):param, null);
				}
				
			}
		}
	}
</script>