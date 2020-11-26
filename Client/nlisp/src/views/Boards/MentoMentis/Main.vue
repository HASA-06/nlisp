<template>
  <div id="main">
    <p id="mento-menti-board-title">멘토 - 멘티 게시판</p>
    <div class="dropdown">
      <p>{{currentStudentNumber}}학번</p>
      <img src="../../../assets/images/boards/calender_next.jpg"/>
      <div class="dropdown-content">
        <p v-for="(studentNumber, index) in studentNumbers" :key="index" v-on:click="selectStudentNumber(studentNumber)">{{studentNumber}}학번</p>
      </div>
    </div>
    <div id="mento-menti-list-container">
      <div class="mento-menti-content" v-for="(mentoMentiContent, index) in mentoMentiList" :key="index" v-on:click="mentoMentisReadButton(mentoMentiContent.id)">
        <img class="mento-menti-image" :src="mentoMentiContent.imageURL"/>
        <p class="mento-menti-name">{{mentoMentiContent.name}}</p>
        <p class="mento-menti-student-number">{{currentStudentNumber}}학번</p>
        <p class="mento-menti-phone-number">Mobile : {{mentoMentiContent.phoneNumber}}</p>
        <div class="horizontal-line"></div>
        <img class="mento-menti-kakao-id" src="../../../assets/images/boards/meto_meti_kakaoid.jpg"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'BoardsMentoMentisMain',
  data() {
    return {
      studentNumbers : ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      currentStudentNumber : '14',
      mentoMentiList : []
    }
  },
  methods : {
    mentoMentisReadButton(mentoMentiBoardUserId) {
      this.$router.push({
        name : 'BoardsMentoMentisRead',
        query : {
          mentoMentiBoardUserId : mentoMentiBoardUserId
        }
      });
    },
    selectStudentNumber(studentNumber) {
      this.currentStudentNumber = studentNumber;

      this.getMentoMentiList(this.currentStudentNumber);
    },
    getMentoMentiList(studentNumber) {
      var getMentoMentiListConfigs = {
        params : {
          studentNumber : this.currentStudentNumber
        },
        headers : {
          token : this.$store.state.users.token
        }
      }

      this.$axios.get(this.$store.state.host + this.$store.state.urls.mentoMentiBoards.list, getMentoMentiListConfigs)
      .then(res => {
        this.mentoMentiList = res.data.mentoList;
      })
      .catch(err => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    }
  },
  created() {
    this.getMentoMentiList();
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

#mento-menti-board-title {
  float: left;
  font-size: 1.5625vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  text-align: left;
  color: #3c3c3f;
  margin: 3.359375vw 0.859375vw 2.1875vw 3.90625vw;
}

.dropdown {
  float: left;
  position: relative;
  width: 5.46875vw;
  height: 1.71875vw;
  background-color: #ffffff;
  margin: 3.671875vw 0 2.421875vw 0;
}

.dropdown p {
  float: left;
  width: 2.8125vw;
  font-size: 0.9375vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
  margin: 0.15625vw 0 0.15625vw 0.46875vw;
}

.dropdown img {
  float: left;
  height: 1.09375vw;
  background-color: #ffffff;
  margin: 0.234375vw 0 0 0.625vw;
}

.dropdown-content {
  margin: 1.71875vw 0 0 0;
  float: left;
  display: none;
  position: absolute;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  float: left;
  display: block;
  background-color: #FFFFFF;
}

#mento-menti-list-container {
  float: left;
  width: 75.3125vw;
  height: 40.9375vw;
  margin: 0 0 2.578125vw 5vw;
}

.mento-menti-content {
  float: left;
  width: 35.890625vw;
  height: 8.734375vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
  margin: 0 1.765625vw 1.5vw 0;
}

.mento-menti-image {
  float: left;
  max-width: 4.6875vw;
  width: 4.6875vw;
  height: 4.6875vw;
  border-radius: 3.90625vw;
  margin: 0.9170625vw 1.6640625vw 0.5078125vw 1.6953125vw;
}

.mento-menti-name {
  float: left;
  font-size: 1.25vw;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.81;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
  margin: 0.703125vw 21.40625vw 0.46875vw 0;
}

.mento-menti-student-number {
  float: left;
  opacity: 0.5;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.92;
  letter-spacing: normal;
  text-align: left;
  color: #43425d;
  margin: 0 23.4375vw 0.15625vw 0;
}

.mento-menti-phone-number {
  float: left;
  opacity: 0.5;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.92;
  letter-spacing: normal;
  text-align: left;
  color: #43425d;
  margin: 0;
}

.horizontal-line {
  float: left;
  width: 100%;
  height: 0vw;
  border: 0.078125vw solid #f5f6fa;
}

.mento-menti-kakao-id {
  float: left;
  max-width: 1.484375vw;
  width: 1.484375vw;
  height: 1.5625vw;
  background-color: #a5a4bf;
  margin: 0.640625vw 0 0 8.90625vw;
}
</style>