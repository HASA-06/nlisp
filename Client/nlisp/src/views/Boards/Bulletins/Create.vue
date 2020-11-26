<template>
  <div id="main">
    <div class="main-button" id="bulletin-button" v-on:click="bulletinBoardButton()">
      <p>자유게시판</p>
    </div>
    <div class="main-button" id="mento-menti-button" v-on:click="mentoMentiButton()">
      <p>M-M게시판</p>
    </div>
    <p id="bulletin-board-title">자유게시판</p>
    <div id="bulletin-board-container">
      <input type="text" v-model.lazy="bulletinBoardTitle" placeholder="글 제목을 입력해 주세요"/>
      <textarea v-model.lazy="bulletinBoardContent"></textarea>
    </div>
    <div id="bulletin-board-create-button" v-on:click="bulletinBoardCreate()">
      <p>확 인</p>
    </div>
    <div id="bulletin-board-main-button" v-on:click="bulletinBoardButton()">
      <p>뒤 로</p>
    </div>
  </div>
</template>

<script>
export default {
  name : 'BoardsBulletinsRead',
  data() {
    return {
      bulletinBoardTitle : '',
      bulletinBoardContent: ''
    }
  },
  methods : {
    bulletinBoardButton() {
      this.$router.push({
        name : 'BoardsBulletinsMain'
      });
    },
    mentoMentiButton() {
      this.$router.push({
        name : 'BoardsMentoMentisMain'
      });
    },
    bulletinBoardCreate() {
      let bulletinBoardCreateParameter = {
        title : this.bulletinBoardTitle,
        content : this.bulletinBoardContent
      };

      let bulletinBoardCreateHeaders = {
        headers : {
          token : this.$store.state.users.token
        }
      };

      this.$axios.post(this.$store.state.host + this.$store.state.urls.bulletinBoards.create, bulletinBoardCreateParameter, bulletinBoardCreateHeaders)
      .then(res => {
        if(res.status == 201 && res.data.stat == 'Success') {
          alert('글 등록이 완료되었습니다.');
          this.$router.push({
            name : 'BoardsBulletinsMain'
          });
        }
      })
      .catch(error => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    }
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped>
#main {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #F5F6FA;
}

.main-button {
  float: left;
  width: 14.0625vw;
  height: 3.90625vw;
  background-color: #43425d;
  border-radius: 0.3125vw;
}

#bulletin-button {
  margin: 3.90625vw 0 3.90625vw 3.359375vw; 
}

#mento-menti-button {
  margin: 3.90625vw 0 3.90625vw 1.5625vw;
}

.main-button p {
  float: left;
  width: 100%;
  height: auto;
  color: #FFFFFF;
  font-size: 1.40625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  margin: 0.78125vw 0 0 0;
  padding: 0;
}

.main-button:hover {
  cursor: pointer;
  background-color: #3c3b54;
}

.main-button:focus {
  cursor: pointer;
  background-color: #3c3b54;
}

.main-button:active {
  cursor: pointer;
  background-color: #3c3b54;
}

#bulletin-board-title {
  float: left;
  width: 19.453125vw;
  height : auto;
  margin: 0 60.234375vw 1.796875vw 3.90625vw;
  font-size: 1.5625vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  text-align: left;
}

#bulletin-board-container {
  float: left;
  width: 76.875vw;
  height: 40.4765625vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
  margin: 0 3.359375vw 3.0390625vw 3.359375vw;
}

#bulletin-board-container input {
  float: left;
  width: 70.46875vw;
  height: 3.125vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #8d9bb5;
  background-color: #ffffff;
  margin: 2.40625vw 0 1.171875vw 2.5vw;
  padding: 0 0.78125vw 0 0.78125vw;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
}

#bulletin-board-container textarea {
  float: left;
  width: 70.46875vw;
  height: 29.6875vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #8d9bb5;
  background-color: #ffffff;
  margin: 0 0 2.5234375vw 2.3828125vw;
  padding: 0.78125vw;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
}

#bulletin-board-create-button {
  float: left;
  width: 12.109375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  background-color: #6582a0;
  margin: 0.46875vw 0 3.28125vw 28.125vw;
}

#bulletin-board-create-button p {
  float: left;
  font-size: 1.171875vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.47;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin: 0.46875vw 0 0.546875vw 4.921875vw;
}

#bulletin-board-main-button {
  float: left;
  width: 12.109375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  background-color: #6582a0;
  margin: 0.46875vw 0 3.28125vw 3.125vw;
}

#bulletin-board-main-button p {
  float: left;
  font-size: 1.171875vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.47;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin: 0.46875vw 0 0.546875vw 4.921875vw;
}
</style>