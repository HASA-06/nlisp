<template>
  <div id="notice">
    <p id="notice-title">공지사항</p>
    <div id="activity-button" v-on:click="activityButton()">
      <p>동아리 활동</p>
    </div>
    <div id="notice-container">
      <img id="notice-container-image" src="../../../assets/images/nl_logo.png"/>
      <p id="notice-container-text">NL 공식 홈페이지 오픈</p>
      <div id="notice-write-button" v-on:click="createNoticeButton()">
        <img src="../../../assets/images/boards/board_write.jpg"/>
        <p>글쓰기</p>
      </div>
      <p id="notice-container-sub-text">We are network-leader. work hard, and play more hard!!!!</p>
      <div id="bulletin-board-container-header">
        <p id="bulletin-board-container-header1">#</p>
        <p id="bulletin-board-container-header2">작성자</p>
        <p id="bulletin-board-container-header3">제 목</p>
        <p id="bulletin-board-container-header4">작성일</p>
        <p id="bulletin-board-container-header5">조회</p>
      </div>
      <div id="bulletin-board-container-content-container" v-infinite-scroll="getNoticeBoardDatas()" infinite-scroll-disabled="isLastNoticeBoardData" infinite-scroll-distance="-500" infinite-scroll-throttle-delay="1000">
        <div class="bulletin-board-content" v-for="(noticeBoardData, index) in noticeBoardDatas" :key="index" v-on:click="noticeBoardRead(noticeBoardData.id)">
          <p class="bulletin-board-content1">{{ noticeBoardData.id }}</p>
          <p class="bulletin-board-content2">{{ noticeBoardData.userName }}</p>
          <p class="bulletin-board-content3">{{ noticeBoardData.title }}</p>
          <p class="bulletin-board-content4">{{ noticeBoardData['createdAt'].substring(2,10).split('-').join('.') }}</p>
          <p class="bulletin-board-content5">{{ noticeBoardData.hit }}</p>
        </div>
        <div v-show="isLastNoticeBoardData" class="bulletin-board-content">
          <img id="no-data-image" src="../../../assets/images/boards/board_delete.jpg"/>
          <p id="no-data-text">No More Data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'ActivitysNoticesMain',
  data() {
    return {
      noticeBoardDatas : [],
      lastNoticeBoardId : '',
      isLastNoticeBoardData : false
    }
  },
  methods : {
    activityButton() {
      this.$router.push({
        name : 'ActivitysPicturesMain'
      });
    },
    getNoticeBoardDatas() {
      if(this.lastNoticeBoardId == '') {
        var getNoticeBoardDatasParameters = {
          params : {

          },
          headers : {
            token : this.$store.state.users.token
          }
        };

        this.$axios.get(this.$store.state.host + this.$store.state.urls.noticeBoards.read, getNoticeBoardDatasParameters)
        .then(res => {
          if(res.status == 200) {
            if(res.data.title == 'No data') {
              this.isLastNoticeBoardData = true;
            } else if(res.data.noticeBoards.length != 5) {
              this.noticeBoardDatas = res.data.noticeBoards;
              this.isLastNoticeBoardData = true;
              this.lastNoticeBoardId = this.noticeBoardDatas[this.noticeBoardDatas.length - 1].id;
            } else {
              this.noticeBoardDatas = res.data.noticeBoards;
              this.lastNoticeBoardId = this.noticeBoardDatas[this.noticeBoardDatas.length - 1].id;
            }
          }
        })
        .catch(err => {
          console.log('Server error, please ask to developer');
          alert('Server error, please ask to developer');
        })
      } else {
        var getNoticeBoardDatasParameters = {
          params : {
            lastNoticeBoardId : this.lastNoticeBoardId
          },
          headers : {
            token : this.$store.state.users.token
          }
        };

        this.$axios.get(this.$store.state.host + this.$store.state.urls.noticeBoards.read, getNoticeBoardDatasParameters)
        .then(res => {
          if(res.status == 200) {
            if(res.data.title == 'No data') {
              this.isLastNoticeBoardData = true;
            } else if(res.data.noticeBoards.length != 5) {
              this.isLastNoticeBoardData = true;
              this.noticeBoardDatas = this.noticeBoardDatas.concat(res.data.noticeBoards);
              this.lastNoticeBoardId = this.noticeBoardDatas[this.noticeBoardDatas.length - 1].id;
            } else {
              this.noticeBoardDatas = this.noticeBoardDatas.concat(res.data.noticeBoards);
              this.lastNoticeBoardId = this.noticeBoardDatas[this.noticeBoardDatas.length - 1].id;
            }
          }
        })
        .catch(err => {
          console.log('Server error, please ask to developer');
          alert('Server error, please ask to developer');
        })
      }
    },
    createNoticeButton() {
      if(this.$store.state.users.adminIDs.indexOf(this.$store.state.users.id) >= 0) {
        this.$router.push({
          name : 'ActivitysNoticesCreate'
        });
      } else {
        alert('관리자만 공지사항을 올릴 수 있답니다 여러분 :)');
      }
    },
    noticeBoardRead(noticeBoardId) {
      this.$router.push({
        name : 'ActivitysNoticesRead',
        query : {
          noticeBoardId : noticeBoardId
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#notice {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #F5F6FA;
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
  margin: 1.09375vw 0 1.09375vw 1.8751.09375vw 0 1.09375vw;
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
  height: 19.53125vw;
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
  margin: 1.28vw 0 1.09375vw 5.46875vw;
  text-align: left;
}

.bulletin-board-content5 {
  width: 2.34375vw;
  height: 1.5625vw;
  margin: 1.28vw 0 1.09375vw 7.5vw;
  text-align: center;
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

#notice-title {
  float: left;
  font-size: 1.5625vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  text-align: left;
  color: #3c3c3f;
  margin: 3.359375vw 0 2.1875vw 3.90625vw;
}

#activity-button {
  float: left;
  width: 14.0625vw;
  height: 3.90625vw;
  background-color: #43425D;
  border-radius: 0.3125vw;
  margin: 2.5vw 0 0 56.25vw;
}

#activity-button p {
  float: left;
  width: 100%;
  font-size: 1.5625vw;
  color: #FFFFFF;
  margin : 0.78125vw 0 0 0;
  text-align: center;
}

#activity-button:hover {
  cursor: pointer;
}

#activity-button:focus {
  cursor: pointer;
}

#activity-button:active {
  cursor: pointer;
}

#notice-container {
  float: left;
  width: 76.875vw;
  height: 40.4765625vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
  margin: 0 0 9.5234375vw 3.359375vw;
}

#notice-container-image {
  float: left;
  width: 10.234375vw;
  height: 10.234375vw;
  max-width: 10.234375vw;
  margin: 2.421875vw 5.109375vw 1.953125vw 19.53125vw;
}

#notice-container-text {
  float: left;
  font-size: 1.40625vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.0140625vw;
  text-align: left;
  color: #24231f;
  margin: 2.03125vw 0 2.5625vw 0;
}

#notice-container-sub-text {
  float: left;
  width: 28.90625vw;
  font-size: 1.171875vw;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.01171875vw;
  text-align: left;
  color: #24231f;
  margin: 0;
}

#notice-write-button {
  float: left;
  width: 6.25vw;
  height: 2.34375vw;
  border-radius: 0.546875vw;
  border: solid 0.078125vw #e8e9ec;
  margin: 1.875vw 0 0 19.53125vw;
}

#notice-write-button:hover {
  cursor: pointer;
}

#notice-write-button:active {
  cursor: pointer
}

#notice-write-button:focus {
  cursor: pointer;
}

#notice-write-button img {
  float: left;
  width: 1.171875vw;
  height: 1.171875vw;
  max-width: 1.171875vw;
  margin: 0.625vw 0 0 0.78125vw;
}

#notice-write-button p {
  float: left;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.390625vw 0 0 0.234375vw;
}
</style>