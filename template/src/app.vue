<template>
	 <div>
	 	<router-view></router-view>
	 </div>
</template>

<script>

// window.showUT =  function(data){
// 			alert(data)
// 		}
	export default {
		mounted(){
			cMwebViewJsBridge(this.BridgeInit);
			console.log(this)
			console.log(this.show)
		},
		methods:{
			BridgeInit(bridge,isAndroid){
				alert(this.showUT)
		        let param = { Status : false};
		        bridge.callHandler('10005', isAndroid?JSON.stringify(param):param, isAndroid? (this.showUT).toString():this.showUT);
		        function showUT(data){
					alert(data)
				}
			},
			show(data){
				alert(data)
			}
		}
	}
</script>