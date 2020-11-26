<template>
    <div id="sign-in">
        <div id="sign-in-container">
            <div id="sign-in-image-container">
            </div>
            <div id="sign-in-form-container">
                <p id="sign-in-form-title">Network Leader</p>
                <p id="sign-in-form-content">Welcome Back, Please signin to your account.</p>
                <input type="text" class="sign-in-form" placeholder="userEmail" v-model.lazy="email"/>
                <p v-show="!isEmailError" class="input-sub-text">(필수) 학교 이메일(@seoultech.ac.kr)을 입력해 주세요.</p>
                <p v-show="isEmailError" class="input-error-text">{{ emailErrorText }}</p>
                <input type="password" class="sign-in-form" placeholder="Password" v-model.lazy="password"/>
                <p v-show="!isPasswordError" class="input-sub-text">(필수) 비밀번호(영소문자, 숫자 조합 1-6자)를 입력해 주세요.</p>
                <p v-show="isPasswordError" class="input-error-text">{{ passwordErrorText }}</p>
                <div id="sign-in-form-check-box-container" v-on:click="onClickRememberMe()">
                    <div id="checkbox-box">
                        <img v-show="isRememberMe" id="checkbox-img-on" src="../assets/images/check.png"/>
                    </div>
                    <p id="checkbox-text">Remember me</p>
                </div>
                <div id="route-forgot-password-button">
                    <p id="route-forgot-password-button-text">Forgot Password</p>
                </div>
                <div id="sign-in-button" v-on:click="signInButton()">
                    <p id="sign-in-button-text">Sign In</p>
                </div>
                <div id="route-sign-up-button" v-on:click="routeSignUpButton()">
                    <p id="route-sign-up-button-text">Sign Up</p>
                </div>
                <img id="network-leader-logo" src="../assets/images/nl_logo.png"/>
                <p id="policy-text">Term of use. Privacy policy</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'SignIn',
    data : function() {
        return {
            isRememberMe : false,
            isEmailError : false,
            emailErrorText : '이메일을 다시 한 번 확인해주세요',
            isPasswordError : false,
            passwordErrorText : '비밀번호를 다시 한 번 확인해주세요',
            email : '',
            password : ''
        }
    },
    methods : {
        onClickRememberMe : function() {
            if(this.isRememberMe) {
                this.isRememberMe = false;
            } else {
                this.isRememberMe = true;
            }
        },
        routeSignUpButton : function () {
            this.$router.push({
                name : 'Policy'
            });
        },
        initializeError : function() {
            this.isEmailError = false;
            this.isPasswordError = false;
            this.emailErrorText = '이메일을 다시 한 번 확인해주세요';
            this.passwordErrorText = '비밀번호를 다시 한 번 확인해주세요';
        },
        checkDefaultValidity : function(data) {
            if(data == '' || data == null || data == 'null' || data === undefined) return false;
            return true;
        },
        checkInputValidity : function() {
            this.initializeError();

            var email = this.email;
            var password = this.password;

            var emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            var passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}$/;

            if(!this.checkDefaultValidity(email) || !emailRegExp.test(email)) {
                this.isEmailError = true;

                return false;
            } else if(!this.checkDefaultValidity(password) || !passwordRegExp.test(password)) {
                this.isPasswordError = true;

                return false;
            } else {
                return true;
            }
        },
        signInButton : function() {
            if(this.checkInputValidity()) {
                var usersAccountsSignInParams = {
                    email : this.email,
                    password : this.password
                };

                this.$axios.post(this.$store.state.host + this.$store.state.urls.users.accounts.signIn, usersAccountsSignInParams)
                .then(res => {
                    if(res.status == 201) {
                        this.$store.commit('setUserInfo', {id : res.data.id, token : res.data.token, email : res.data.email, name : res.data.name, imageURL : res.data.imageURL});

                        if(this.isRememberMe) {
                            var localStorage = window.localStorage;
                            localStorage.setItem('token', res.data.token);

                            this.$cookie.set('signInMaintenance', 'Y', {expires : '24h'});

                            this.$router.push({
                                name : 'Main'
                            });
                        } else {
                            var sessionStorage = window.sessionStorage;
                            sessionStorage.setItem('token', res.data.token);

                            this.$cookie.set('signInMaintenance', 'N', {expires : '24h'});

                            this.$router.push({
                                name : 'Main'
                            });
                        }
                    }
                })
                .catch(error => {
                    if(error.response.status == 400 && error.response.data.title == 'Not authorized') {
                        alert('허가가 떨어지지 않은 아이디입니다. 회장에게 문의하세요 :)');

                        this.$router.push({
                            name : 'Home'
                        });
                    } else if(error.response.status == 400 && error.response.data.title == 'No user') {
                        this.isEmailError = true;
                        this.isPasswordError = true;
                        this.emailErrorText = '일치하지 않습니다';
                        this.passwordErrorText = '일치하지 않습니다';
                    } else {
                        console.log('Server error, please ask to developer');
                        alert('Server error, please ask to developer');
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
input::-ms-input-placeholder { color: #4d4f5c; font-size : 15px; }
input::-webkit-input-placeholder { color: #4d4f5c; font-size : 15px; }
input::-moz-placeholder { color: #4d4f5c; font-size : 15px; }
input:focus {
    outline : none;
}

#sign-in-container {
    float : left;
    width : 100vw;
    height : 62.5vw;
    margin : 0;
}

#sign-in-image-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
    background-image : url('../assets/images/sign.png');
    background-size : 50vw 62.5vw;
}

#sign-in-form-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
}

#sign-in-form-title {
    width : 100%;
    height : 4.0625vw;
    font-size : 2.734375vw;
    font-weight : bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 0.546875vw;
    text-align : center;
    color : #43425d;
    margin : 14.625vw 0 0 0;
}

#sign-in-form-content {
    float : left;
    width : 100%;
    height : 2.109375vw;
    opacity : 0.5;
    font-size: 1.40625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align : center;
    color : #4d4f5c;
    margin : 0.125vw 0 2.03125vw 0;
}

.sign-in-form {
    float : left;
    width : 30.625vw;
    height : 3.75vw;
    border-top : 0vw;
    border-right : 0vw;
    border-left : 0vw;
    border-bottom : 0.078125vw solid rgba(119, 119, 119, 5);
    padding-left : 0.625vw;
    margin : 0 0 0 9.375vw;
    font-size : 1.171875vw;
}

#sign-in-form-check-box-container {
    float : left;
    width : auto;
    margin : 1.90625vw 0 0 12.453125vw;
}

#sign-in-form-check-box-container:hover {
    cursor : pointer;
}

#sign-in-form-check-box-container:active {
    cursor : pointer;
}

#sign-in-form-check-box-container:focus {
    cursor : pointer;
}

#checkbox-box {
    float : left;
    width : 1.40625vw;
    height : 1.40625vw;
    border-radius : 0.3125vw;
    border: solid 0.078125vw #808495;
    background-color: #ffffff;
}

#checkbox-text {
    display : block;
    float : left;
    margin : 0 0 0 1.171875vw;
    font-size: 1.171875vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #43425d;
}

#checkbox-img-on {
    float : left;
    max-width : 1.40625vw;
    width : 1.40625vw;
    height : 1.40625vw;
}

#route-forgot-password-button {
    float : left;
    width : 9.375vw;
    height : auto;
    margin : 1.90625vw 12.5vw 0 3.625vw;
}

#route-forgot-password-button:hover {
    cursor : pointer;
}

#route-forgot-password-button:hover {
    cursor : pointer;
}

#route-forgot-password-button:hover {
    cursor : pointer;
}

#route-forgot-password-button-text {
    float : left;
    width: 100%;
    font-size : 1.171875vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #43425d;
    margin : 0;
    padding : 0;
}

#sign-in-button {
    float : left;
    width : 10.9375vw;
    height : 3.90625vw;
    border-radius: 0.3125vw;
    border: solid 0.078125vw #364156;
    background-color: #43516c;
    margin : 3.0859375vw 1.5625vw 6.0546875vw 13.2578125vw;
}

#sign-in-button:hover {
    cursor : pointer;
    background-color : #333D52;
}

#sign-in-button:focus {
    cursor : pointer;
    background-color : #333D52;
}

#sign-in-button:active {
    cursor : pointer;
    background-color : #333D52;
}

#sign-in-button-text {
    float : left;
    margin : 0;
    padding : 0;
    width : 100%;
    font-size: 1.40625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    text-align : center;
    color : #FFFFFF;
    margin : 0.859375vw 0 0 0;
}

#route-sign-up-button {
    float : left;
    width : 10.9375vw;
    height : 3.90625vw;
    border-radius : 0.3125vw;
    border : solid 0.078125vw #43425d;
    margin : 3.0078125vw 12.5vw 6.015625vw 0;
}

#route-sign-up-button-text {
    float : left;
    width : 100%;
    text-align : center;
    font-size: 1.40625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #4d4f5c;
    margin : 0.859375vw 0 0 0;
}

#route-sign-up-button:hover {
    cursor : pointer;
    background-color : #333D52;
}

#route-sign-up-button:active {
    cursor : pointer;
    background-color : #333D52;
}

#route-sign-up-button:focus {
    cursor : pointer;
    background-color : #333D52;
}

#network-leader-logo {
    float : left;
    max-width : 6.8125vw;
    width : 6.8125vw;
    height : 6.1953125vw;
    margin : 0 21.09375vw 0.9140625vw 21.5703125vw;
}

#policy-text {
    float : left;
    width : 100%;
    text-align : center;
    font-size : 1.171875vw;
    color : #43425d;
    margin : 0;
    padding : 0;
}

.input-sub-text { 
    float : left;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 9.421875vw;
    color : #4d4f5c;
    opacity : 0.5;
    width : 100%;
}

.input-error-text { 
    float : left;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 9.421875vw;
    color : #FF0000;
    width : 100%;
}

@media ( max-width : 600px ) {

}
</style>