<template>
	<div>
		this is a form

		<div class="form">
			<input type="text" name="" v-model="name">
			<input type="text" v-model="age">
			<button type="" @click="$emit('hide')"> 关闭</button>
		</div>
	</div>
</template>
<script>
	export default {
		props:['show'],
		data(){
			return{
				name:'',
				age:0
			}
		}
	}
</script>