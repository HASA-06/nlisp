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
      <p id="bulletin-board-sub-title">{{ bulletinBoardData.title }}</p>
      <div id="bulletin-board-main-button" v-on:click="bulletinBoardMainButton()">
        <p>목록</p>
      </div>
      <div id="bulletin-board-create-button" v-on:click="bulletinBoardCreateButton()">
        <img src="../../../assets/images/boards/board_write.jpg"/>
        <p>글쓰기</p>
      </div>
      <div id="bulletin-board-user">
        <img :src="userImageURL"/>
        <p id="bulletin-board-user-name">{{ bulletinBoardData.userName }}</p>
        <p id="bulletin-board-create-time">{{ createTime }}</p>
      </div>
      <div id="horizontal-line"></div>
      <div id="bulletin-board-content">
        <p>{{ bulletinBoardData.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'BoardsBulletinsRead',
  data() {
    return {
      userImageURL : '',
      bulletinBoardData : '',
      createTime : ''
    }
  },
  methods : {
    bulletinBoardMainButton() {
      this.$router.push({
        name : 'BoardsBulletinsMain'
      });
    },
    bulletinBoardCreateButton() {
      this.$router.push({
        name : 'BoardsBulletinsCreate'
      });
    },
    bulletinBoardButton() {
      this.$router.push({
        name : 'BoardsBulletinsMain'
      });
    },
    getBulletinBoardReadDetail() {
      var getBulletinBoardReadDetailParameter = {
        params : {
          bulletinBoardId : this.$route.query.bulletinBoardId
        },
        headers : {
          token : this.$store.state.users.token
        }
      };

      this.$axios.get(this.$store.state.host + this.$store.state.urls.bulletinBoards.readDetail, getBulletinBoardReadDetailParameter)
      .then(res => {
        this.createTime = res.data.bulletinBoards[0]['createdAt'].substring(0, 10) + ' ' + res.data.bulletinBoards[0]['createdAt'].substring(11, 16);
        this.bulletinBoardData = res.data.bulletinBoards[0];
      })
      .catch(err => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    },
    mentoMentiButton() {
      this.$router.push({
        name : 'BoardsMentoMentisMain'
      });
    },
  },
  created() {
    this.getBulletinBoardReadDetail();
    this.userImageURL = this.$store.state.users.imageURL;
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

#bulletin-board-create-button {
  float: right;
  width: 6.25vw;
  height: 2.34375vw;
  border-radius: 0.546875vw;
  border: solid 0.078125vw #E8E9EC;
  margin: 1.25vw 0.78125vw 0 0;
}

#bulletin-board-create-button img {
  float: left;
  width: 1.171875vw;
  height: 1.171875vw;
  background-color: #a4afb7;
  margin: 0.625vw 0 0.546875vw 0.78125vw;
}

#bulletin-board-create-button p {
  width: auto;
  height: auto;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.390625vw 0.703125vw 0.390625vw 0;
}

#bulletin-board-sub-title {
  float: left;
  margin: 1.5625vw 0 1.40625vw 2.8125vw;
  font-size: 1.953125vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.8;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
}

#bulletin-board-user {
  float: left;
  width : 73.5546875vw;
  height : 2.734375vw;
  margin: 0vw 1.640625vw 0.9375vw 1.6796875vw;
}

#bulletin-board-user img {
  float: left;
  max-width: 2.734375vw;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 3.90625vw;
  margin: 0 0 0 1.6796875vw;
}

#bulletin-board-user-name {
  float: left;
  font-size: 1.328125vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.18;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
  margin: 0.390625vw 0 0 1.40625vw;
}

#bulletin-board-create-time {
  float: left;
  font-size: 1.328125vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.18;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
  margin: 0.390625vw 0 0 1.5625vw;
}

#horizontal-line {
  float: left;
  width : 73.5546875vw;
  height: 0vw;
  border: 0.078125vw solid #f5f6fa;
  margin: 0 0 0 1.6796875vw;
}

#bulletin-board-content {
  float: left;
  width: 73.5546875vw;
  height: 27.265625vw;
  margin: 2.34375vw 0 1.3359375vw 1.6796875vw;
  overflow-y:auto;
}

#bulletin-board-content {
  padding-left: 1.6796875vw;
}

#bulletin-board-main-button {
  float: right;
  width: 4.21875vw;
  height: 2.421875vw;
  border-radius: 0.546875vw;
  border: solid 0.078125vw #e8e9ec;
  margin: 1.25vw 1.171875vw 0 0.78125vw;
}

#bulletin-board-main-button p {
  float: left;
  width: 100%;
  margin: 0.46875vw 1.171875vw 0 0;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
}
</style>