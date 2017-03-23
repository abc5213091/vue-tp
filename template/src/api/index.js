import Vue from 'vue'
import Resource from 'vue-resource'

Vue.use(Resource);
//这里的post的data默认不是以form data的形式，而是request payload -----这是个坑！
Vue.http.options.emulateJSON = true;

// 全局混合
Vue.mixin({
	methods:{
		/*
			Ajax请求
			@param {Object} opt 
		*/
		ajax(opt){
			if(!opt) return;
			let  {url,data}= _.assembly(opt);
			//发送之前执行的方法
			opt.beforeCB && opt.beforeCB();
			// 发送后台数据请求
			this.$http.post(url,data).then((res)=>{
				let db=res.data;
				db = _.formatData(db);
				if(db.Result==2){
					//登陆失效,返回登陆页
					router.go('/login');
				}

				opt.cb && opt.cb(db);
			});
		},
		fetch(opt){

			if(!opt) return;
			let  {url,data}= _.assembly(opt);
			//发送之前执行的方法
			opt.beforeCB && opt.beforeCB();

			fetch(url, {
			  method: "POST",
			  headers: {
			    "Content-Type": "application/x-www-form-urlencoded"
			  },
			  body: "jsonString="+encodeURIComponent(data.jsonString)
			}).then(function(res) {
				return res.json()
			}).then(function(db){
				db = _.formatData(db);
				if(db.Result==2){
					//登陆失效,返回登陆页
					router.go('/login');
				}

				opt.cb && opt.cb(db);
			})
		}

	}
})

export default Vue