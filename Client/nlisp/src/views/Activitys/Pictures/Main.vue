<template>
  <div id="picture">
    <div id="notice-button" v-on:click="noticeBoardButton()">
      <p>공지사항</p>
    </div>
    <div id="create-activity-button" v-on:click="createActivityButton()">
      <p>사진 업로드</p>
    </div>
    <div id="picture-container" v-infinite-scroll="getActivityDatas()" infinite-scroll-disabled="isLastActivityData" infinite-scroll-distance="0" infinite-scroll-throttle-delay="1000">
      <div class="activity-data-container" v-for="(activityData, index) in activityDatas" :key="index">
        <img :src="activityData.imageURL"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'ActivitysPicturesMain',
  data() {
    return {
      activityDatas : [],
      lastActivityDataId : '',
      isLastActivityData : false
    }
  },
  methods: {
    noticeBoardButton() {
      this.$router.push({
        name : 'ActivitysNoticesMain'
      });
    },
    getActivityDatas() {
      if(this.lastActivityDataId == '') {
        var getActivityDatasParameter = {
          params : {

          },
          headers : {
            token : this.$store.state.users.token
          }
        };

        this.$axios.get(this.$store.state.host + this.$store.state.urls.activityBoards.read, getActivityDatasParameter)
        .then(res => {
          if(res.status == 200) {
            if(res.data.title == 'No data') {
              this.isLastActivityData = true;
            } else if(res.data.bulletinBoards.length != 12) {
              this.activityDatas = res.data.bulletinBoards;
              this.lastActivityDataId = this.activityDatas[this.activityDatas.length - 1].id;
              this.isLastActivityData = true;
            } else {
              this.activityDatas = res.data.bulletinBoards;
              this.lastActivityDataId = this.activityDatas[this.activityDatas.length - 1].id;
            }
          }
        })
        .catch(err => {
          console.log('Server error, please ask to developer');
          alert('Server error, please ask to developer');
        })
      } else {
        var getActivityDatasParameter = {
          params : {
            lastActivityBoardId : this.lastActivityDataId
          },
          headers : {
            token : this.$store.state.users.token
          }
        };
      }
    },
    createActivityButton() {
      this.$router.push({
        name : 'ActivitysPicturesCreate'
      });
    }
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped>
#picture {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #F5F6FA;
}

#picture-container {
  float: left;
  width: 67.1875vw;
  height: 88.671875vw;
  margin: 3.90625vw 8.125vw 19.765625vw 8.203125vw;
  background-color: #FFFFFF;
}

.activity-data-container {
  float: left;
  width: 20.3125vw;
  height: 20.3125vw;
  margin: 1.40625vw 0 0 1.5625vw;
}

.activity-data-container img {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#notice-button {
  float: left;
  width: 14.0625vw;
  height: 3.90625vw;
  background-color: #43425D;
  border-radius: 0.3125vw;
  margin: 3.90625vw 0 0 8.203125vw;
}

#notice-button:hover {
  cursor: pointer;
}

#notice-button:active {
  cursor: pointer;
}

#notice-button:focus {
  cursor: pointer;
}

#notice-button p {
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

#create-activity-button {
  float: left;
  width: 14.0625vw;
  height: 3.90625vw;
  background-color: #43425D;
  border-radius: 0.3125vw;
  margin: 3.90625vw 0 0 3.90625vw;
}

#create-activity-button:hover {
  cursor: pointer;
}

#create-activity-button:focus {
  cursor: pointer;
}

#create-activity-button:active {
  cursor: pointer;
}

#create-activity-button p {
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
</style>