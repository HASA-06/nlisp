<template>
  <div id="main">
    <div class="main-button" id="bulletin-button" v-on:click="bulletinBoardMainButton()">
      <p>자유게시판</p>
    </div>
    <div class="main-button" id="mento-menti-button" v-on:click="mentoMentiButton()">
      <p>M-M게시판</p>
    </div>
    <p id="bulletin-board-title">멘토 - 멘티 게시판</p>
    <div id="bulletin-board-container">
      <div id="bulletin-board-create-button" v-on:click="mentoMentiBoardCreateButton()">
        <img src="../../../assets/images/boards/board_write.jpg"/>
        <p>글쓰기</p>
      </div>
      <div id="bulletin-board-container-header">
        <p id="bulletin-board-container-header1">#</p>
        <p id="bulletin-board-container-header2">작성자</p>
        <p id="bulletin-board-container-header3">제 목</p>
        <p id="bulletin-board-container-header4">작성일</p>
        <p id="bulletin-board-container-header5">조회</p>
      </div>
      <div id="bulletin-board-container-content-container" v-infinite-scroll="getMentoMentiBoardData()" infinite-scroll-disabled="isLastMentoMentiDatas" infinite-scroll-distance="-500" infinite-scroll-throttle-delay="1000">
        <div class="bulletin-board-content" v-for="(mentoMentiBoardData, index) in mentoMentiBoardDatas" :key="index" v-on:click="readMentoMentiBoard(mentoMentiBoardData.id)">
          <p class="bulletin-board-content1">{{ mentoMentiBoardData.id }}</p>
          <p class="bulletin-board-content2">{{ mentoMentiBoardData.userName }}</p>
          <p class="bulletin-board-content3">{{ mentoMentiBoardData.title }}</p>
          <p class="bulletin-board-content4">{{ mentoMentiBoardData['create_date'].substring(2,10).split('-').join('.') }}</p>
          <p class="bulletin-board-content5">{{ mentoMentiBoardData.hit }}</p>
        </div>
        <div v-show="isLastMentoMentiDatas" class="bulletin-board-content">
          <img id="no-data-image" src="../../../assets/images/boards/board_delete.jpg"/>
          <p id="no-data-text">No More Data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'BoardsMentoMentisRead',
  data() {
    return {
      mentoMentiBoardDatas : [],
      isLastMentoMentiDatas : false,
      lastMentoMentiIndex : ''
    }
  },
  methods: {
    getMentoMentiBoardData() {
      if(this.lastMentoMentiIndex == '') {
        var getMentoMentiBoardDataParameters = {
          params : {
            mentoMentiBoardUserId : this.$route.query.mentoMentiBoardUserId,
          },
          headers : {
            token : this.$store.state.users.token
          }
        }

        this.$axios.get(this.$store.state.host + this.$store.state.urls.mentoMentiBoards.read, getMentoMentiBoardDataParameters)
        .then(res => {
          if(res.status == 200) {
            this.mentoMentiBoardDatas = res.data.mentoMentiBoards;
            this.lastMentoMentiIndex = this.mentoMentiBoardDatas[this.mentoMentiBoardDatas.length - 1].id;

            if(res.data.mentoMentiBoards.length != 6) {
              this.isLastMentoMentiDatas = true;
            }
          }
        })
        .catch(err => {
          console.log('Server error, please ask to developer');
          alert('Server error, please ask to developer');
        })
      } else {
        if(!this.isLastMentoMentiDatas) {
          var getMentoMentiBoardDataParameters = {
            params : {
              mentoMentiBoardUserId : this.$route.query.mentoMentiBoardUserId,
              lastMentoMentiBoardId : this.lastMentoMentiIndex
            },
            headers : {
              token : this.$store.state.users.token
            }
          };

          this.$axios.get(this.$store.state.host + this.$store.state.urls.mentoMentiBoards.read, getMentoMentiBoardDataParameters)
          .then(res => {
            this.mentoMentiBoardDatas = this.mentoMentiBoardDatas.concat(res.data.mentoMentiBoards);
            this.lastMentoMentiIndex = this.mentoMentiBoardDatas[this.mentoMentiBoardDatas.length - 1].id;
      
            if(res.data.title == 'No data') {
              this.isLastMentoMentiDatas = true;
            } else {
              if(res.data.mentoMentiBoards.length != 6) {
                this.isLastMentoMentiDatas = true;
              }
            }
          })
          .catch(err => {
            console.log('Server error, please ask to developer');
            alert('Server error, please ask to developer');
          });
        }
      }
    },
    bulletinBoardMainButton() {
      this.$router.push({
        name : 'BoardsBulletinsMain'
      });
    },
    mentoMentiButton() {
      this.$router.push({
        name : 'BoardsMentoMentisMain'
      });
    },
    mentoMentiBoardCreateButton() {
      this.$router.push({
        name : 'BoardsMentoMentiCreate',
        query : {
          mentoMentiBoardUserId : this.mentoMentiBoardDatas[0].userId
        }
      });
    },
    readMentoMentiBoard(id) {
      var readBulletinBoardParameters = {
        mentoMentiBoardId : id
      };

      var readBulletinBoardConfigs = {
        headers : {
          token : this.$store.state.users.token
        }
      };

      this.$axios.post(this.$store.state.host + this.$store.state.urls.mentoMentiBoards.hit, readBulletinBoardParameters, readBulletinBoardConfigs)
      .then(res => {
        if(res.status == 201) {
          this.$router.push({
            name : 'BoardsMentoMentiReadDetail',
            query : {
              mentoMentiBoardId : id
            }
          });
        }
      })
      .catch(err => {
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

#bulletin-board-create-button {
  float: left;
  width: 6.25vw;
  height: 2.34375vw;
  border-radius: 0.546875vw;
  border: solid 0.078125vw #E8E9EC;
  margin: 1.25vw 1.71875vw 1.25vw 68.90625vw;
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

#bulletin-board-container-header {
  float: left;
  width: 72.1875vw;
  height: 3.515625vw;
  background-color: #f5f6fa;
  margin: 0 2.34375vw 0 2.34375vw;
}

#bulletin-board-container-header p {
  float: left;
  font-size: 0.859375vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
  letter-spacing: normal;
  text-align: left;
  color: #a3a6b4;
}

#bulletin-board-container-header1 {
  margin: 1.09375vw 0 1.09375vw 1.875vw;
}

#bulletin-board-container-header2 {
  margin: 1.09375vw 0 1.09375vw 6.796875vw;
}

#bulletin-board-container-header3 {
  margin: 1.09375vw 0 1.09375vw 18.359375vw;
}

#bulletin-board-container-header4 {
  margin: 1.09375vw 0 1.09375vw 19.53125vw;
}

#bulletin-board-container-header5 {
  margin: 1.09375vw 0 1.09375vw 10.703125vw;
}

#bulletin-board-container-content-container {
  float: left;
  width: 72.1875vw;
  height: 27.34375vw;
  background-color: #FFFFFF;
  margin: 0 2.34375vw 0 2.34375vw;
  overflow-y: scroll;
}

.bulletin-board-content {
  float: left;
  width: 100%;
  height: 3.828125vw;
  background-color: #FFFFFF;
  margin: 0;
  border-bottom: 0.078125vw solid #f1f1f3;
}

.bulletin-board-content p {
  float: left;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  color: #4d4f5c;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.bulletin-board-content1 {
  width: 2.34375vw;
  height: 1.5625vw;
  margin: 1.25vw 0 1.09375vw 1.796875vw;
  text-align: left;
}

.bulletin-board-content2 {
  width: 4.6875vw;
  height: 1.5625vw;
  margin: 1.25vw 0 1.09375vw 4.6875vw;
  text-align: left;
}

.bulletin-board-content3 {
  width: 23.4375vw;
  height: 1.5625vw;
  margin: 1.25vw 0 1.09375vw 7.8125vw;
  text-align: left;
}

.bulletin-board-content4 {
  width: 6.25vw;
  height: 1.5625vw;
  margin: 1.25vw 0 1.09375vw 5.46875vw;
  text-align: left;
}

.bulletin-board-content5 {
  width: 2.34375vw;
  height: 1.5625vw;
  margin: 1.25vw 0 1.09375vw 7.5vw;
  text-align: center;
}

#content-index-before {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index-before img {
  float: left;
  width: 100%;
  height: 100%;
}

#content-index-next {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index-next img {
  float: left;
  width: 100%;
  height: 100%;
}

#content-index-container {
  float: left;
  width: 45.78125vw;
  height: auto;
  margin: 0 0 3.75vw 33.75vw;
}

#content-index1 {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index1:focus {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index1:active {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index1:hover {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index1 p {
  float: left;
  height: 1.484375vw;
  width: 100%;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.625vw 0 0 0;
}

#content-index2 {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index2:focus {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index2:active {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index2:hover {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index2 p {
  float: left;
  height: 1.484375vw;
  width: 100%;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.625vw 0 0 0;
}

#content-index3 {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index3:focus {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index3:active {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index3:hover {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index3 p {
  float: left;
  height: 1.484375vw;
  width: 100%;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.625vw 0 0 0;
}

#content-index4 {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index4:focus {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index4:active {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index4:hover {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index4 p {
  float: left;
  height: 1.484375vw;
  width: 100%;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.625vw 0 0 0;
}

#content-index5 {
  float: left;
  width: 2.734375vw;
  height: 2.734375vw;
  border-radius: 0.3125vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
}

#content-index5:focus {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index5:active {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index5:hover {
  cursor: pointer;
  background-color: #8d9bb5;
  color: #FFFFFF;
}

#content-index5 p {
  float: left;
  height: 1.484375vw;
  width: 100%;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.625vw 0 0 0;
}

#no-data-image {
  float: left;
  width: 17.1875vw;
  height: 16.25vw;
  margin: 5.546875vw 3.125vw 5.546875vw 6.25vw;
}

#no-data-text {
  float: left;
  font-size: 4.6875vw;
  font-weight: 900;
  margin: 9.375vw 0 0 3.125vw;
}
</style>