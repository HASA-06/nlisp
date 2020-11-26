<template>
  <div id="home">
    <div id="home-container">
      <div id="button-container">
        <div class="button" id="sign-in-button" v-on:click="routeSignInButton"><p class="button-text">Sign In</p></div>
        <div class="button" id="sign-up-button" v-on:click="routeSignUpButton"><p class="button-text">Sign Up</p></div>
      </div>
      <div id="a-footer">
        <p class="footer-text" id="company">회  장 {{ adminData[0]['name'] }} {{ adminData[0]['phoneNumber'] }}</p>
        <p class="footer-text" id="sub-company">부회장 {{ adminData[1]['name'] }} {{ adminData[1]['phoneNumber'] }}</p>
        <p class="footer-text" id="location-text">서울과학기술대학교 미래관 322호</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data : function() {
    return {
      adminData : [{name : '통신오류시', phoneNumber : '통신오류시'}, {name : '통신오류시', phoneNumber : '통신오류시'}]
    }
  },
  created() {
    this.usersAdminAPI();
  },
  methods : {
    routeSignInButton : function() {
      this.$router.push({
        name : 'SignIn'
      });
    },
    routeSignUpButton : function() {
      this.$router.push({
        name : 'Policy'
      });
    },
    usersAdminAPI : function() {
      this.$axios.get(this.$store.state.host + this.$store.state.urls.users.admin)
      .then(res => {
        if(res.status == 200) {
          this.adminData = res.data.adminDatas;
        }
      })
      .catch(error => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#home-container {
  float : left;
  width : 100vw;
  height : auto;
  margin : 0 auto 0 auto;
  background-image : url('../assets/images/background.png');
  background-size : 100vw 181.796875vw;
  background-color : #000000;
}

#button-container {
    float : left;
    width : 100vw;
    height : 12.578125vw;
}

.button {
    float : left;
    width : 12.578125vw;
    height : 4.296875vw;
    border-radius : 1.875vw;
}

#sign-in-button {
    background-color : #8d9bb5;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    margin : 3.1640625vw 1.5625vw auto 67.265625vw;
}

#sign-in-button:hover {
  cursor : pointer;
  background-color : #43516c;
}

#sign-in-button:active {
  cursor : pointer;
  background-color : #43516c;
}

#sign-in-button:focus {
  cursor : pointer;
  background-color : #43516c;
}

#sign-up-button {
  border : solid 1px #FFFFFF;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin : 3.1640625vw 0 auto 0;
}

#sign-up-button:hover {
  cursor : pointer;
  background-color : #43516c;
}

#sign-up-button:focus {
  cursor : pointer;
  background-color : #43516c;
}

#sign-up-button:active {
  cursor : pointer;
  background-color : #43516c;
}

.button-text {
    width : 100%;
    text-align : center;
    float : left;
    font-size : 1.5625vw;
    font-weight : bold;
    margin : 0;
    padding : 0;
    color : #FFFFFF;
    margin : 0.9375vw 0 0 0;
}

#a-footer {
  float : left;
  width : 100vw;
  height : 7.1875vw;
  margin-top : 167.1484375vw;
  border: solid 1px #707070;
  background-color : #8d9bb5;
}

.footer-text {
  float : left;
  height : 2.34375vw;
  color : #FFFFFF;
  font-size : 1.5625vw;
  font-weight : 300;
  font-stretch : normal;
  font-style : normal;
  letter-spacing : normal;
  padding : 0;
}

#company {
  white-space : pre;
  margin : 2.5vw 0 auto 6.5625vw;
}

#sub-company {
  width : 23.4375vw;
  margin : 2.5vw 0 auto 5.46875vw;
}

#location-text {
  margin : 2.5vw 0 auto 15.625vw;
}

@media ( max-width : 600px ) {

}
</style>
