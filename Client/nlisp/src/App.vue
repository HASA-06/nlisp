<template>
  <div id="app">
    <Navigator class="navigator" v-if="isUser" :isAdmin="isAdmin"></Navigator>
    <ClientHeader class="client-header" v-if="isUser" :isAdmin="isAdmin"></ClientHeader>
    <router-view/>
    <ClientFooter class="client-footer" v-if="isUser" :isAdmin="isAdmin"></ClientFooter>
  </div>
</template>

<script>
import ClientHeader from './components/ClientHeader';
import ClientFooter from './components/ClientFooter';
import Navigator from './components/Navigator';

export default {
  name : 'App',
  components : {
    Navigator,
    ClientHeader,
    ClientFooter
  },
  data : function() {
    return {
      email : '',
      name : '',
      imageURL : '',
      isAdmin : false,
      isUser : false
    }
  },
  methods : {
    reloadTask : function() {
      var localStorage = window.localStorage;
      var sessionStorage = window.sessionStorage;

      var tokenConfig = {
        headers : {
          token : ''
        }
      };

      if(this.$cookie.get('signInMaintenance') == 'Y') {
        tokenConfig.headers.token = localStorage.getItem('token');
        this.tokenCheck(localStorage, tokenConfig);
      } else if(this.$cookie.get('signInMaintenance') == 'N') {
        tokenConfig.headers.token = sessionStorage.getItem('token');
        if(sessionStorage.getItem('token')) {
          this.tokenCheck(sessionStorage, tokenConfig);
        }
      } else {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');

        return;
      }
    },
    tokenCheck : function(storageObject, headerConfig) {
      this.$axios.post(this.$store.state.host + this.$store.state.urls.users.tokens.check, null, headerConfig)
      .then(res => {
        if(res.status == 201) {
          this.$store.commit('setUserInfo', {id : res.data.id, token : res.data.token, email : res.data.email, name : res.data.name, imageURL : res.data.imageURL});

          if(this.$route.name != 'Main') {
            this.$router.push({
              name : 'Main'
            });
          }
        }
      })
      .catch(error => {
        if(error.response.status == 401) {
          this.$axios.post(this.$store.state.host + this.$store.state.urls.users.tokens.reIssue, null, headerConfig)
          .then(res => {
            if(res.status == 201) {
              alert('토큰이 만료되어 재발급하였습니다. 새로고침 후 다시 진행하세요');
              storageObject.setItem('token', res.data.token);
            }
          })
        }
      });
    }
  },
  created() {
    this.reloadTask();
  },
  computed : {
    getUserInfo : function() {
      return this.$store.getters.getUserInfo;
    }
  },
  watch : {
    getUserInfo : function(currentValue, pastValue) {
      if(currentValue.token != '') {
        if(currentValue.adminIDs.indexOf(currentValue.id) >= 0) {
          this.isAdmin = true;
          this.isUser = true;
          
          if(this.$route.name == 'Home' || this.$route.name == 'SignUp' || this.$route.name == 'SignIn' || this.$route.name == 'Policy') {
            this.$router.push({
              name : 'Main'
            });
          }
        } else {
          this.isUser = true;

          if(this.$route.name == 'Home' || this.$route.name == 'SignUp' || this.$route.name == 'SignIn' || this.$route.name == 'Policy') {
            this.$router.push({
              name : 'Main'
            });
          }
        } 
      } else {
        this.isUser = false;
        this.isAdmin = false;
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  float : left;
  width: 100vw;
  height : auto;
  margin: 0 auto 0 auto;
  font-family : 'Noto Sans KR', sans-serif;
  color : #000000;
  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  input::-ms-input-placeholder { color: #4d4f5c; font-size : 15px; }
  input::-webkit-input-placeholder { color: #4d4f5c; font-size : 15px; }
  input::-moz-placeholder { color: #4d4f5c; font-size : 15px; }
  input:focus {
      outline : none;
      color: #43425d;
  }

  input:hover {
      outline : none;
      color: #43425d;
  }

  input:active {
      outline : none;
      color: #43425d;
  }
}

.navigator {
  float : left;
  height : 100%;
}

.client-header {
  float : right;
}

.client-header {
  float : right;
}

@media ( max-width : 600px ) {

}
</style>
