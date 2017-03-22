<template>
<div v-if="show">
    <div class="mask" @click="mask"></div>
	<div class="dialog">
		<div class="close" v-if="close" @click="$emit('hide')">×</div>
		<div class="dialog-hd" v-show="title" v-html="title"></div>
		<div class="dialog-bd" >
			<!-- 用于替换 -->
			<slot></slot>
		</div>
		<div class="dialog-ft" v-if="isfoot">
			<a href="javascript:" @click="cancel" v-text="cancelBtn" v-if="confirm"></a>
			<a href="javascript:" @click="sure" v-text="sureBtn"></a>
		</div>
	</div>
</div>
</template>

<script>
	export default{
		name:'dialog',
		props:{
			data:{
				type:[Object,Function]
			},
			show:Boolean,
			confirm:Boolean,
			close:Boolean,
			isfoot:{type:Boolean, default: true},
			title:String,
			sureBtn:{type:String,default:'确定'},
			cancelBtn:{type:String,default:'取消'},
			maskCb:Function,
			sureCb:Function,
			cancelCb:Function
		},
		
		methods:{
			mask(){
				if(this.maskCb){
					this.maskCb();
				}else{
					this.$emit('hide')
				}
				
			},
			sure(){

				if(this.sureCb){
					this.sureCb();
				}else{
					this.$emit('hide')
				}
			},
			cancel(){
				if(this.cancelCb){
					this.cancelCb();
				}else{
					this.$emit('hide')
				}
			}
		}
	}
</script>
<style>
.mask { position: fixed; left: 0; top: 0; z-index: 1000; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4);}
.dialog { 
	position: fixed; left: 0.7rem; right: 0.7rem; top: 50%; z-index: 1001; border-radius: 6px; background-color: #fff; transform: translate(0, -55%); -webkit-transform: translate(0, -55%);
	.close{
		position: absolute;
		top:0;
		right:0;
		width:.6rem;
		height:.5rem;
		font-size: .5rem;
		text-align: center;
		opacity: .4
	}
}
.dialog-hd { 
	position: relative;
	font-size: 0.36rem;
	line-height: 0.98rem;
	text-align: center;
}
.dialog-hd::after{ border-bottom:1px solid #d9d9d9; }
.dialog-bd {
	padding: 0.4rem; line-height: 1.5; font-size: 0.3rem; text-align: justify;
	max-height: 6.6rem;overflow-y: auto;
	p{line-height: 1.5;}
}
.dialog-ft { 
	position: relative;
	display: flex;
	a{ flex:1; display: block; width: 50%; line-height: 0.98rem; font-size: 0.36rem; text-align: center; color: #1fba66;
		
	}
	a:last-child { border-left: 1px solid #d9d9d9;}
		&:only-child { border-left: 0;}
	a:before{
		 border-top:1px solid #d9d9d9;
	}
}
</style>