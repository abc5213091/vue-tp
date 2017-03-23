### 登录组件

`npm install niiwoo-login --save`
```html
<my-login :loginData="loginData"></my-login>
```
```javascript
data() {
        return {
            loginData: {
                bgColor: "", //页面背景颜色
                urlHeaderImg: "", //头部图片地址
                mobileStyle: {
                    num: "13100000000",     //手机号码，可以不传
                    readonly: false,    //手机号码是否可编辑
                    blurEvent: ()=>{    //用户名文本框失去焦点事件
                        console.log("phone blur event");
                    }
                },
                loginStyle: { //登录按钮风格
                    btnColor: "",   //登录按钮颜色
                    btnBgColor: "#000",     //登录按钮背景颜色
                    successCallback:()=>{       //登录成功回调
                        console.log("login in success callback");
                    }
                },
                registerStyle: { //注册按钮风格
                    isShow: true,   //是否显示注册按钮
                    btnColor: "",   //“马上注册”按钮颜色
                    oColor: "",     //其他文字颜色
                    _clickEvent: ()=>{  //点击注册的事件
                        console.log("click register");
                    }
                },
                forgetPwdStyle: { //忘记密码按钮风格
                    isShow: true,   //是否显示忘记密码
                    btnColor: "",   //忘记密码按钮颜色
                    _clickEvent:()=>{   //点击忘记密码
                        console.log("click forget");
                    }
                },
                phone_icon: { //登录账号图标
                    backgroundImage: "",    //background-image，eg:"url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/soutu/img/camera_new_5606e8f.png)"
                    backgroundPosition: ""  //background-position,eg: "0 0"
                },
                pwd_icon: { //登录密码图标
                    backgroundImage: "",
                    backgroundPosition: ""
                },
                showPwd_icon: { //明文密码图标
                    backgroundImage: "",
                    backgroundPosition: ""
                },
                hidePwd_icon: { //密文密码图标
                    backgroundImage: "",
                    backgroundPosition: ""
                }
            }
        }
    }


### 忘记密码组件

`npm install niiwoo-forgetpwd --save`
```html
 <niiwoo-forgetpwd  :resetpwdData="resetpwdData"></niiwoo-forgetpwd>
```
```javascript
data() {
    return {
        resetpwdData: {
             mobileStyle: {
                num: "",     //手机号码，可以不传
                readonly: true    //手机号码是否可编辑，可以编辑传false
            },
            codeStyle: {
                color: "",  //获取验证码颜色
                borderColor: ""     //验证码左边边框线颜色
            },
            resetPwdStyle: {
                text: "",   //忘记密码按钮文字
                color: "",  //忘记密码按钮颜色
                bgColor: "",    //背景样色
                successCallback: () => {    //修改密码成功回调
                    console.log("reset pwd success callback");
                }
            }
        }
    }
}