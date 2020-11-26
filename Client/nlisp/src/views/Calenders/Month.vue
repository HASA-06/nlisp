<template>
  <div id="month">
    <div id="calender-container">
      <p id="calender-title">Study Calender</p>
      <div id="calender-month-button">
        <p>Month</p>
      </div>
      <div id="calender-week-button">
        <p>Week</p>
      </div>
      <img id="month-before-image" src="../../assets/images/boards/calender_before.jpg" v-on:click="subMonth()"/>
      <p id="current-month-text">{{ monthsToEng[currentMonth - 1] }} {{ currentYear }}</p>
      <img id="month-next-image" src="../../assets/images/boards/calender_next.jpg" v-on:click="addMonth()"/>
      <div id="calender-header">

      </div>
      <div id="calender-body">
        <div class="calender-day" v-for="(day, index) in daysByMonth[currentMonth - 1]" :key="index">
          <div id="calender-today" v-show="isToday(index + 1)">
            <p class="calender-today">{{index + 1}}</p>
          </div>
          <p class="calender-today" v-show="!isToday(index + 1)">{{index + 1 }}</p>
        </div>
      </div>
      <div id="add-calender-button" v-on:click="scheduleBoardCreateButton()">
        <p>+ 일정추가</p>
      </div>
      <div v-show="isAddFormUse" id="add-calender-container">
        <input class="add-calender-input" type="text" placeholder="YYYY 형식의 년도를 입력해 주세요" v-model.lazy="year"/>
        <input class="add-calender-input" type="text" placeholder="MM 형식의 월을 입력해 주세요" v-model.lazy="month"/>
        <input class="add-calender-input" type="text" placeholder="DD 형식의 일을 입력해 주세요" v-model.lazy="day"/>
        <input class="add-calender-input" type="text" placeholder="제목을 입력해 주세요" v-model.lazy="title"/>
        <input class="add-calender-input" type="text" placeholder="내용을 입력해 주세요" v-model.lazy="content"/>
        <input class="add-calender-input" type="text" placeholder="24시내의 시작시간을 입력해주세요" v-model.lazy="startTime"/>
        <input class="add-calender-input" type="text" placeholder="24시내의 종료시간을 입력해 주세요" v-model.lazy="endTime"/>
        <div id="add-calender-check-button" v-on:click="createCalenderBoardButton()">
          <p>추가하기</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name : 'CalendersMonth',
  data() {
    return {
      currentYear : '',
      currentMonth : '',
      currentDay : '',
      daysByMonth : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      monthsToEng : ['Janu', 'Febu', 'Marc', 'Apri', 'May', 'June', 'July', 'Augu', 'Sept', 'Octo', 'Nove', 'Dece'],
      scheduleBoardDatas : [],
      isAddFormUse : false,
      year : '',
      month : '',
      day : '',
      title : '',
      content : '',
      startTime : '',
      endTime : ''
   }
  },
  methods : {
    getNowMonth() {
      var now = moment().format('YYYY/MM/DD');
      this.currentMonth = parseInt(now.split('/')[1]);
      this.currentYear = now.split('/')[0].substring(0, 4);
      this.currentDay = parseInt(now.split('/')[2]);
    },
    subMonth() {
      if(this.currentMonth > 1) {
        this.currentMonth -= 1;

        this.getCalenderBoardData();
      } else {
        alert('더 이상 월을 내릴 수 없습니다.');
      }
    },
    addMonth() {
      if(this.currentMonth <= 11) {
        this.currentMonth += 1;

        this.getCalenderBoardData();
      } else {
        alert('더 이상 월을 올릴 수 없습니다.');
      }
    },
    isToday(day) {
      if(day == this.currentDay) return true;
      else return false;
    },
    getCalenderBoardData() {
      var getCalenderBoardDataParameters = {
        params : {
          scheduleMonth : this.currentMonth
        },
        headers : {
          token : this.$store.state.users.token
        }
      };

      this.$axios.get(this.$store.state.host + this.$store.state.urls.scheduleBoards.read, getCalenderBoardDataParameters)
      .then(res => {
        if(res.data.scheduleBoards !== undefined) {
          this.scheduleBoardDatas = res.data.scheduleBoards;
        
          this.scheduleBoardDatas.map(e => {
            var targetDiv = document.getElementsByClassName('calender-day')[e.day - 1];
            var div = document.createElement('div');
            div.className = 'schedule-content';
            div.style = "float: left; width: 111px; height: 19.9px; border-radius: 4px; background-color: #3b86ff;"
            div.innerHTML = '<p style="float: left; font-size: 9px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 2.22; letter-spacing: normal; text-align: left; color: #ffffff; margin: 0 0 0 6px;">' + e.title + '</p>'

            targetDiv.appendChild(div);
          });
        }
      })
      .catch(err => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    },
    scheduleBoardCreateButton() {
      if(this.isAddFormUse) {
        this.isAddFormUse = false;
      } else {
        this.isAddFormUse = true;
      }
    },
    createCalenderBoardButton() {
      if(this.$store.state.users.adminIDs.indexOf(this.$store.state.users.id) >= 0) {
        var createCalenderBoardButtonConfigs = {
          headers : {
            token : this.$store.state.users.token
          }
        }

        var createCalenderBoardButtonParams = {
          year : this.year,
          month : this.month,
          day : this.day,
          title : this.title,
          content : this.content,
          startTime : this.startTime,
          endTime : this.endTime
        }

        this.$axios.post(this.$store.state.host + this.$store.state.urls.scheduleBoards.create, createCalenderBoardButtonParams, createCalenderBoardButtonConfigs)
        .then(res => {
          if(res.status == 201) {
            this.isAddFormUse = false;
            this.getCalenderBoardData();
          }
        })
        .catch(err => {
          console.log('Server error, please ask to developer');
          alert('Server error, please ask to developer');
        });
      } else {
        alert('관리자만 일정을 추가할 수 있습니다');
        this.isAddFormUse = false;
      }
    }
  },
  created() {
    this.getNowMonth();
    this.getCalenderBoardData();
  }
}
</script>

<style lang="scss" scoped>
#month {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #FFFFFF;
  margin: 0 0 7.8125vw 0;
}

#calender-container {
  float: left;
  width: 69.625vw;
  height: auto;
  box-shadow: 0 0.9375vw 1.25vw 0 #caced5;
  background-color: #ffffff; 
  margin: 4.671875vw 0 0 6.78125vw;
}

#calender-title {
  float: left;
  font-size: 0.9375vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.08;
  letter-spacing: normal;
  text-align: left;
  color: #4d4f5c;
  margin: 0.9453125vw 0 0 0.71875vw;
}

#calender-month-button {
  float: left;
  width: 3.2265625vw;
  height: 1.5vw;
  border: solid 0.078125vw #d7dae2;
  background-color: #ffffff;
  margin: 0.796875vw 0 0 54.421875vw;
}

#calender-month-button p {
  float: left;
  width: 100%;
  font-size: 0.46875vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.5;
  letter-spacing: normal;
  text-align: center;
  color: #3b86ff;
  margin: 0;
}

#calender-week-button {
  float: left;
  width: 3.2265625vw;
  height: 1.5vw;
  border: solid 0.078125vw #d7dae2;
  background-color: #ffffff;
  margin: 0.769875vw 0 0 0;
}

#calender-week-button p {
  float: left;
  width: 100%;
  height: 0.9375vw;
  font-size: 0.46875vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.5;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0;
}

#month-before-image {
  float: left;
  width: 1.09375vw;
  height: 1.25vw;
  background-color: #ffffff;
  margin: 0.3046875vw 0 0 29.234375vw;
}

#current-month-text {
  float: left;
  font-size: 1.40625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.72;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  margin: 0.3046875vw 0 0 1.9921875vw;
}

#month-next-image {
  float: left;
  width: 1.09375vw;
  height: 1.25vw;
  background-color: #ffffff;
  margin: 0.3046875vw 23.4375vw 0 1.9921875vw;
}

#calender-body {
  float: left;
  width: 100%;
  margin: 3.9453125vw 2.703125vw 0 2.84375vw;
}

.calender-day {
  float: left;
  width: 9.09375vw;
  height: 6.328125vw;
  border: solid 0.078125vw #eaf0f4;
  background-color: #ffffff;
}

.calender-today {
  float: right;
  font-size: 0.9375vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.08;
  letter-spacing: normal;
  text-align: right;
  color: #43425d;
  margin: 0.234375vw 0.7265625vw 0 0;
  text-align: right;
}

#calender-today {
  float: left;
  border: solid 0.078125vw #eaf0f4;
  background-color: #eaf0f4;
  width: 100%;
  height: 100%;
}

#add-calender-button {
  float: left;
  width: 6.796875vw;
  height: 2.734375vw;
  border: solid 0.078125vw #e8e9ec;
  background-color: #ffffff;
  margin: 0 0 12.3px 747.2px;
}

#add-calender-button p {
  float: right;
  font-size: 1.015625vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: center;
  color: #4d4f5c;
  width: 100%;
  text-align: center;
  margin: 0.625vw 0 0 0;
}

.schedule-content {
  float: left;
  width: 8.671875vw;
  height: 1.5546875vw;
  border-radius: 0.3125vw;
  background-color: #3b86ff;
}

.schedule-content p {
  float: left;
  font-size: 0.703125vw;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.22;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  margin: 0.3125vw 0 0 0.46875vw;
}

#add-calender-container {
  float: left;
  width: 55.46875vw;
  height: auto;
}

.add-calender-input {
  float: left;
  width: 37.5vw;
  height: 3.125vw;
  border-radius: 0.3125vw;
  padding-left: 1.5625vw;
  margin: 1.5625vw 0 0 2.84375vw;
}

#add-calender-check-button {
  float: left;
  width: 23.4375vw;
  height: 4.6875vw;
  margin: 3.125vw 0 3.125vw 23.09375vw;
  border-radius: 0.546875vw;
  background-color: #43425d;
}

#add-calender-check-button p {
  float: left;
  width: 100%;
  text-align: center;
  font-size: 1.5625vw;
  color: #FFFFFF;
  font-weight: 900;
  margin: 1.09375vw 0 0 0;
}
</style>