<template>
    <div id="policy">
        <div id="policy-container">
            <div id="policy-image-container">
            </div>
            <div id="policy-form-container">
                <p id="policy-form-title">Network Leader</p>
                <p id="policy-form-sub-title">회원약관</p>
                <div id="policy-form">
                    
                </div>
                <div id="policy-checkbox-container" v-on:click="onClickAgreePolicy()">
                    <div id="checkbox-box">
                        <img v-show="isAgreePolicy" id="checkbox-img-on" src="../assets/images/check.png"/>
                    </div>
                    <p id="checkbox-text">이용약관에 동의합니다 (필수)</p>
                </div>
                <p v-show="!isCheckError" class="dummy"></p>
                <p v-show="isCheckError" class="input-error-text">{{ checkErrorText }}</p>
                <input v-show="!isEmailSend" type="text" class="policy-form" placeholder="Email" v-model.lazy="email"/>
                <p v-show="!isEmailSend" id="colleage-email-address">@seoultech.ac.kr</p>
                <div v-show="!isEmailSend" class="send-button" v-on:click="sendMailButton">
                    <p class="send-button-text">이메일전송</p>
                </div>
                <p v-show="!isEmailError && !isEmailSend" class="input-sub-text">(필수) 학교 이메일(@seoultech.ac.kr)을 입력해 주세요.</p>
                <p v-show="isEmailError && !isEmailSend" class="input-error-text">{{ emailErrorText }}</p>
                <input v-show="isEmailSend" type="text" class="policy-form2" placeholder="인증번호" v-model.lazy="authorizationCode"/>
                <div v-show="isEmailSend" class="send-button" v-on:click="routeSignUpButton()">
                    <p class="send-button-text">인증받기</p>
                </div>
                <p v-show="!isAuthorizationCodeError && isEmailSend" class="input-sub-text">(필수) 이메일로 보내진 인증코드(6자리)를 입력해주세요.</p>
                <p v-show="isAuthorizationCodeError && isEmailSend" class="input-error-text">{{ authorizationCodeErrorText }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'Policy',
    data : function() {
        return {
            isAgreePolicy : false,
            isEmailError : false,
            emailErrorText : '이메일을 다시 한 번 확인해 주세요',
            isAuthorizationCodeError : false,
            authorizationCodeErrorText : '인증번호는 6자리의 숫자입니다. 다시 확인해보세요',
            isEmailSend : false,
            email : '',
            authorizationCode : '',
            isCheckError : false,
            checkErrorText : '동의하셔야만 회원가입이 가능합니다.',
            clientAuthorizationCode : '',
            authorizationCode : ''
        }
    },
    methods : {
        onClickAgreePolicy : function() {
            if(this.isAgreePolicy) {
                this.isAgreePolicy = false;
            } else {
                this.isAgreePolicy = true;
            }
        },
        sendMailButton : function() {
            this.initializeStatus();

            if(!this.isAgreePolicy) {
                this.isCheckError = true;
            } else if(this.email == '') {
                this.isEmailError = true;
            } else {
                let authorizationsSendMailParameter = {
                    email : this.email + '@seoultech.ac.kr'
                };
                alert('이메일이 전송중입니다.');
                
                this.$axios.post(this.$store.state.host + this.$store.state.urls.users.authorizations.sendMail, authorizationsSendMailParameter)
                .then(res => {
                    if(res.status == 201) {
                        alert('이메일 전송이 완료되었습니다.');
                        this.isEmailSend = true;
                        this.clientAuthorizationCode = res.data.authorizationCode;
                    }
                })
                .catch(error => {
                    console.log('Server error, please ask to developer');
                    alert('Server error, please ask to developer');
                });
            }
        },
        routeSignUpButton : function() {
            if(!this.isAgreePolicy) {
                this.isCheckError = true;
            } else if(this.authorizationCode != this.clientAuthorizationCode) {
                this.isAuthorizationCodeError = true;
            } else {
                this.$router.push({
                    name : 'SignUp',
                    query : { userEmail : this.email + '@seoultech.ac.kr', authorizationCode : this.authorizationCode, clientAuthorizationCode : this.clientAuthorizationCode }
                });
            }
        },
        initializeStatus : function() {
            this.isEmailError = false;
            this.isAuthorizationCodeError = false;
            this.isEmailSend = false;
            this.isCheckError = false;
        }
    }
}
</script>

<style lang="scss" scoped>
#policy-container{
    float : left;
    width : 100vw;
    height : 62.5vw;
    margin : 0;
}

#policy-image-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
    margin : 0;
    background-image : url('../assets/images/sign.png');
    background-size : 50vw 62.5vw;
}

#policy-form-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
    margin : 0;
}

#policy-form-title {
    float : left;
    width : 100%;
    height : auto;
    font-size : 2.734375vw;
    font-weight : bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 0.546875vw;
    text-align : center;
    color : #43425d;
    margin : 4.078125vw 0 0 0;
}

#policy-form-sub-title {
    float : left;
    width : 100%;
    height : auto;
    font-size : 2.34375vw;
    font-weight : normal;
    font-stretch : normal;
    font-style : normal;
    letter-spacing : normal;
    text-align : center;
    color : #4d4f5c;
    margin : 1.46875vw 0 0 0;
    padding : 0;
}

#policy-form {
    float : left;
    width : 35.40625vw;
    height : 28.71875vw;
    border-radius : 0.3125vw;
    border: solid 0.078125vw #6582a0;
    margin : 1.9875vw 4.53125vw 1.2421875vw 5.671875vw;
    overflow-y : scroll;
    padding : 1.40625vw;
}

#policy-checkbox-container {
    float : left; 
    width : 16.40625vw;
    height : 1.5625vw;
    margin : 0 23.4375vw 0 7.0625vw;
}

#checkbox-box {
    float : left;
    width : 1.40625vw;
    height : 1.40625vw;
    border-radius : 0.3125vw;
    border: solid 0.078125vw #808495;
    background-color: #ffffff;
    margin : 0.078125vw 0.46875vw 0 0;
}

#checkbox-text {
    float : left;
    width : auto;
    height : auto;
    font-size : 1.171875vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #43425d;
    margin : 0;
    padding : 0;
}

#checkbox-img-on {
    float : left;
    width : 1.40625vw;
    height : 1.40625vw;
}

.policy-form {
    float : left;
    width : 9.53125vw;
    height : 3.75vw;
    border-top : 0vw;
    border-right : 0vw;
    border-left : 0vw;
    border-bottom : 0.078125vw solid rgba(119, 119, 119, 5);
    padding-left : 0.625vw;
    margin : 0.390625vw 0 0 9.421875vw;
    font-size : 1.171875vw;
}

.input-sub-text { 
    float : left;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 9.421875vw;
    color : #4d4f5c;
    opacity : 0.5;
}

.input-error-text { 
    float : left;
    width : 100%;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 9.421875vw;
    color : #FF0000;
}

.dummy {
    float : left;
    width : 100%;
    height : 1.171875vw;
    margin : 0.117188vw 0 0 9.421875vw;
}

#colleage-email-address {
    float : left;
    margin : 1.171875vw 0 1.09375vw 1.5625vw;
    font-size : 1.40625vw;
    font-weight : normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #43425d;
}

.send-button {
    float : left;
    width : 6.8671875vw;
    height : 2.765625vw;
    border-radius: 0.3125vw;
    border: solid 0.078125vw #364156;
    background-color: #43516c;
    margin : 1.015625vw 0 0 1.40625vw;
}

.send-button-text {
    float : left;
    width : 100%;
    margin : 0.703125vw 0 0 0;
    padding : 0;
    font-size: 1.015625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
}

.policy-form2 {
    float : left;
    width : 22.4390625vw;
    height : 3.75vw;
    border-top : 0vw;
    border-right : 0vw;
    border-left : 0vw;
    border-bottom : 0.078125vw solid rgba(119, 119, 119, 5);
    padding-left : 0.625vw;
    margin : 0.390625vw 0 0 9.375vw;
    font-size : 1.171875vw;
}

@media ( max-width : 600px ) {

}
</style>