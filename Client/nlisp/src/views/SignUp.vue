<template>
    <div id="sign-up">
        <div id="sign-up-container">
            <div id="sign-up-image-container">
            </div>
            <div id="sign-up-form-container">
                <p id="sign-up-form-title">Welcome, Please sign up your account</p>
                <input type="text" class="sign-up-form" placeholder="*Username" v-model.lazy="userName"/>
                <p v-show="!isUserNameError" class="input-sub-text">(필수) 실명(한글, 2-4자)를 입력해 주세요.</p>
                <p v-show="isUserNameError" class="input-error-text">{{ userNameErrorText }}</p>
                <input type="text" class="sign-up-form" placeholder="*Student Number" v-model.lazy="studentNumber"/>
                <p v-show="!isStudentNumberError" class="input-sub-text">(필수) 학번(8자리)를 입력해 주세요.</p>
                <p v-show="isStudentNumberError" class="input-error-text">{{ studentNumberErrorText }}</p>
                <input type="text" class="sign-up-form" placeholder="*Email" :value="email" readonly />
                <p v-show="!isEmailError" class="input-sub-text">(필수) 학교 이메일(@seoultech.ac.kr)을 입력해 주세요.</p>
                <p v-show="isEmailError" class="input-error-text">{{ emailErrorText }}</p>
                <input type="password" class="sign-up-form" placeholder="*Password" v-model.lazy="password"/>
                <p v-show="!isPasswordError" class="input-sub-text">(필수) 비밀번호(영소문자, 숫자 조합 1-6자)를 입력해 주세요.</p>
                <p v-show="isPasswordError" class="input-error-text">{{ passwordErrorText }}</p>
                <input type="password" class="sign-up-form" placeholder="*Password Confirm" v-model.lazy="passwordAccept"/>
                <p v-show="!isPasswordAcceptError" class="input-sub-text">(필수) 비밀번호 확인(비밀번호와 동일)를 입력해 주세요.</p>
                <p v-show="isPasswordAcceptError" class="input-error-text">{{ passwordAcceptErrorText }}</p>
                <input type="text" class="sign-up-form" placeholder="*Phone Number" v-model.lazy="phoneNumber"/>
                <p v-show="!isPhoneNumberError" class="input-sub-text">(필수) '-'를 제외하고 핸드폰 번호를 입력해 주세요</p>
                <p v-show="isPhoneNumberError" class="input-error-text">{{ phoneNumberErrorText }}</p>
                <input type="text" id="kakao-id-form" class="sign-up-form" placeholder="Kakao ID" v-model.lazy="kakaoId"/>
                <div id="image-file-input-box" class="input-box-container">
                    <label for="image-file-input">Image</label>
                    <input id="image-file-input" type="file" ref="file" class="good-add-input-box" v-on:change="handleFileUpload()"/>
                    <p class="input-box-explanation" v-show="!isImageFileError">(필수) 본인 사진을 선택해주세요</p>
                    <p class="input-box-error" v-show="isImageFileError"> {{ imageFileErrorText }} </p>
                </div>
                <p class="input-sub-text kakao">Kakao ID를 입력해 주세요</p>
                <div id="sign-up-button" v-on:click="signUpButton()">
                    <p id="sign-up-button-text">Sign Up</p>
                </div>
                <p id="explain-sign-in-button-text">Already have an account?</p>
                <div id="route-sign-in-button" v-on:click="routeSignInButton">
                    <p id="route-sign-in-button-text">Sign In.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'SignUp',
    data : function () {
        return {
            userName : '',
            isUserNameError : false,
            userNameErrorText : '2-4자의 한글 실명이어야 합니다.',
            studentNumber : '',
            isStudentNumberError : false,
            studentNumberErrorText : '학번을 다시 한 번 확인해 주세요',
            email : this.$route.query.userEmail,
            isEmailError : false,
            emailErrorText : '학교 이메일 형식을 맞추셨나요?',
            password : '',
            isPasswordError : false,
            passwordErrorText : '비밀번호 형식을 다시 한번 확인해 주세요',
            passwordAccept : '',
            isPasswordAcceptError : false,
            passwordAcceptErrorText : '비밀번호 확인은 비밀번호와 일치해야 합니다.',
            phoneNumber : '',
            isPhoneNumberError : false,
            phoneNumberErrorText : '\'-\' 를 제외한 휴대폰 번호가 정말 맞나요?',
            kakaoId : '',
            authorizationCode : this.$route.query.authorizationCode,
            clientAuthorizationCode : this.$route.query.clientAuthorizationCode,
            imageFile : '',
            isImageFileError : false,
            imageFileErrorText : '사진은 필수입니다.'
        }
    },
    methods : {
        routeSignInButton : function() {
            this.$router.push({
                name : 'SignIn'
            });
        },
        handleFileUpload : function() {
            this.imageFile = this.$refs.file.files[0];
        },
        signUpButton : function() {
            if(this.checkInputValidity()) {
                var usersAccountsSIgnUpHeader = {
                    headers : {
                        'Content-Type' : 'multipart/form-data',
                    }
                };
            
                var usersAccountsSignUpParams = new FormData();
                usersAccountsSignUpParams.append('userEmail', this.email);
                usersAccountsSignUpParams.append('userPassword', this.password);
                usersAccountsSignUpParams.append('userPasswordAccept', this.passwordAccept);
                usersAccountsSignUpParams.append('userName', this.userName);
                usersAccountsSignUpParams.append('userPhoneNumber', this.phoneNumber);
                usersAccountsSignUpParams.append('userStudentNumber', this.studentNumber);
                usersAccountsSignUpParams.append('userImage', this.imageFile);
                usersAccountsSignUpParams.append('authorizationCode', this.authorizationCode);
                usersAccountsSignUpParams.append('clientAuthorizationCode', this.clientAuthorizationCode);
                
                this.$axios.post(this.$store.state.host + this.$store.state.urls.users.accounts.signUp, usersAccountsSignUpParams, usersAccountsSIgnUpHeader)
                .then(res => {
                    if(res.status == 201) {
                        alert('회원가입이 완료되었습니다. 회장의 승인을 기다리세요');

                        this.$router.push({
                            name : 'Home'
                        });
                    }
                })
                .catch(error => {
                    if(error.response.status == 400 && error.response.data.title == 'Email is duplicated') {
                        this.emailErrorText = '이미 가입되어있습니다. 관리자에게 문의하세요 :)';
                        this.isEmailError = true;
                    } else {
                        console.log('Server error, please ask to developer');
                        alert('Server error, please ask to developer');
                    }
                });
            }
        },
        initializeError : function() {
            this.isUserNameError = false;
            this.isPasswordError = false;
            this.isPasswordAcceptError = false;
            this.isPhoneNumberError = false;
            this.isImageFileError = false;
            this.isStudentNumberError = false;
            this.isEmailError = false;
        },
        checkDefaultValidity : function(data) {
            if(data == '' || data == null || data == 'null' || data === undefined) return false;
            return true;
        },
        checkInputValidity : function() {
            this.initializeError();

            var email = this.email;
            var userName = this.userName;
            var studentNumber = this.studentNumber;
            var password = this.password;
            var passwordAccept = this.passwordAccept;
            var phoneNumber = this.phoneNumber;
            var imageFile = this.imageFile;
            var authorizationCode = this.authorizationCode;
            var clientAuthorizationCode = this.clientAuthorizationCode;

            var emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            var passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}$/;
            var nameRegExp = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,4}/;
            var studentNumberRegExp =  /^\d{8}/;
            var phoneNumberRegExp = /^\d{10,11}/;

            if(!this.checkDefaultValidity(email) || !emailRegExp.test(email)) {
                this.isEmailError = true;

                return false;
            } else if(!this.checkDefaultValidity(userName) || !nameRegExp.test(userName)) {
                this.isUserNameError = true;

                return false;
            } else if(!this.checkDefaultValidity(studentNumber) || !studentNumberRegExp.test(studentNumber)) {
                this.isStudentNumberError = true;
                
                return false;
            } else if(!this.checkDefaultValidity(password) || !passwordRegExp.test(password)) {
                this.isPasswordError = true;

                return false;
            } else if(password != passwordAccept) {
                this.isPasswordAcceptError = true;

                return false;
            } else if(!this.checkDefaultValidity(phoneNumber) || !phoneNumberRegExp.test(phoneNumber)) {
                this.isPhoneNumberError = true;

                return false;
            } else if(!this.checkDefaultValidity(imageFile)) {
                this.isImageFileError = true;

                return false;
            } else if(!this.checkDefaultValidity(authorizationCode) || authorizationCode != clientAuthorizationCode) {
                alert('인증코드정보가 없습니다. 다시 진행해주세요');

                this.$router.push({
                    name : 'Policy'
                });
            } else {
                return true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
input::-ms-input-placeholder { color: #4d4f5c; font-size : 1.171875vw; }
input::-webkit-input-placeholder { color: #4d4f5c; font-size : 1.171875vw; }
input::-moz-placeholder { color: #4d4f5c; font-size : 1.171875vw; }
input:focus {
    outline : none;
}

#sign-up-container{
    float : left;
    width : 100vw;
    height : 62.5vw;
    margin : 0;
}

#sign-up-image-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
    background-image : url('../assets/images/sign.png');
    background-size : 50vw 62.5vw;
}

#sign-up-form-container {
    float : left;
    width : 50vw;
    height : 62.5vw;
}

#sign-up-form-title {
    float : left;
    width : 100%;
    height : 2.109375vw;
    opacity : 0.5;
    font-size : 1.40625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #4d4f5c;
    margin : 7.3984375vw 0 1.484375vw 0;
    padding : 0;
}

.sign-up-form {
    float : left;
    width : 30.625vw;
    height : 3.75vw;
    border-top : 0px;
    border-right : 0px;
    border-left : 0px;
    border-bottom : 0.078125vw solid rgba(119, 119, 119, 5);
    padding-left : 0.625vw;
    margin : 0 0 0 9.375vw;
    font-size : 1.171875vw;
}

#kakao-id-form {
    float : left;
    width : 15.15625vw;
    padding-left : 0.9375vw;
}

#sign-up-button {
    float : left;
    margin : 2.734375vw 15.625vw 0 18.1875vw;
    width : 14.53125vw;
    width: 14.53125vw;
    height: 3.984375vw;
    border-radius: 0.3125vw;
    border: solid 0.078125vw #364156;
    background-color: #43516c;
}

#sign-up-button:hover {
    cursor : pointer;
    background-color : #333D52;
}

#sign-up-button:active {
    cursor : pointer;
    background-color : #333D52;
}

#sign-up-button:focus {
    cursor : pointer;
    background-color : #333D52;
}

#sign-up-button-text {
    float : left;
    width : 100%;
    height : 2.109375vw;
    font-size : 1.40625vw;
    font-weight : normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing : normal;
    text-align : center;
    color : #FFFFFF;
    margin : 0.9375vw 0 0 0;
}

#explain-sign-in-button-text {
    float : left;
    margin : 2.3828125vw 0 0 16.375vw;
    width : auto;
    font-size : 1.171875vw;
    font-weight : normal;
    font-stretch : normal;
    font-style : normal;
    letter-spacing : normal;
    text-align : center;
    padding : 0;
    color: #43425d;
}

#route-sign-in-button {
    float : left;
    width : auto;
    margin : 2.3828125vw 0 0 0.3125vw;
}

#route-sign-in-button:hover {
    cursor : pointer;
    font-weight : 900;
    font-size : 1.40625vw;
}

#route-sign-in-button:focus {
    cursor : pointer;
    font-weight : 900;
    font-size : 1.40625vw;
}

#route-sign-in-button:active {
    cursor : pointer;
    font-weight : 900;
    font-size : 1.40625vw;
}

#route-sign-in-button-text {
    float : left;
    width : auto;
    margin : 0;
    padding : 0;
    font-size : 1.171875vw;
    font-weight : normal;
    font-stretch : normal;
    font-style : normal;
    letter-spacing : normal;
    text-align : center;
    padding : 0;
    color: #43425d;
}

.input-sub-text { 
    float : left;
    width : 100%;
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

.input-box-container {
    float : right;
    width : 12.5vw;
    height : 4.5703125vw;
    margin : 0.78125vw 9.53125vw 0 2.34375vw;
}

#image-file-input-box label{
    float : left;
    width : 12.5vw;
    height : 2.734375vw;
    margin : 0;
    padding-top : 0.390625vw;
    color : #FFFFFF;
    font-family : 'Noto Sans KR', sans-serif;
    font-size : 1.5625vw;
    vertical-align : middle;
    text-align : center;
    background-color : #43516c;
    cursor : pointer;
    border : 0.078125vw solid #364156;
    border-radius : 0.3125vw;
}

#image-file-input-box label:hover {
    cursor : pointer;
    background-color : #364156;
}

#image-file-input-box label:active {
    cursor : pointer;
    background-color : #364156;
}

#image-file-input-box input[type="file"] {
    float : left;
    width : 0px;
    height : 0px;
    padding : 0;
    margin : -1px;
    overflow : hidden;
    clip : rect(0, 0, 0, 0);
    border : 0;
}

.input-box-explanation {
    float : left;
    width : 12.5vw;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 0;
    color : #4d4f5c;
    opacity : 0.5;
}

.input-box-error {
    float : left;
    width : 12.5vw;
    font-size : 0.78125vw;
    margin : 0.1171875vw 0 0 0;
    color : #FF0000;
    opacity : 0.5;
}

.kakao {
    width : 14.0625vw;
}
@media ( max-width : 600px ) {

}
</style>