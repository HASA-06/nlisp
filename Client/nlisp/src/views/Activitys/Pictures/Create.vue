<template>
  <div id="create">
    <div id="create-container">
      <img src="../../../assets/images/client_headers/topbar_search.jpg"/>
      <input type="text" id="activity-create-title" placeholder="제목을 입력해주세요" v-model.lazy="title"/>
      <input type="text" id="activity-create-content" placeholder="간단한 내용 입력해주세요" v-model.lazy="content"/>
      <div id="image-file-input-container">
        <label for="image-file-input">
          <p>사진 선택하기</p>
        </label>
        <input id="image-file-input" type="file" ref="file" v-on:change="handleFileUpload()"/>
      </div>
      <div id="create-button" v-on:click="createActivityPicture()">
        <p>사진 등록하기</p>
      </div>
    </div>
  </div>
</template>

<script>
import { create } from 'domain';
export default {
  name : 'ActivitysPicturesCreate',
  data() {
    return {
      imageFile : '',
      title : '',
      content : ''
    }
  },
  methods : {
    handleFileUpload() {
        this.imageFile = this.$refs.file.files[0];
    },
    createActivityPicture() {
      var createActivityFormData = new FormData();
      createActivityFormData.append('title', this.title);
      createActivityFormData.append('content', this.content);
      createActivityFormData.append('activityImage', this.imageFile);

      var createAcitivityHeader = {
        headers : { 
          token : this.$store.state.users.token
        }
      };

      this.$axios.post(this.$store.state.host + this.$store.state.urls.activityBoards.create, createActivityFormData, createAcitivityHeader)
      .then(res => {
        if(res.status == 201) {
          alert('사진 등록이 성공하였습니다');
          this.$router.push({
            name : 'ActivitysPicturesMain'
          });
        }
      })
      .catch(err => {
        console.log('Server error, please ask to developer');
        alert('Server error, please ask to developer');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#create {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #F5F6FA;
}

#create-container {
  float: left;
  width: 67.1875vw;
  height: 39.0625vw;
  margin: 3.90625vw 8.125vw 19.765625vw 8.203125vw;
  background-color: #FFFFFF;
}

#create-container img {
  float: left;
  width: 28.125vw;
  height: 23.4375vw;
  background-color: #000000;
  margin: 7.8125vw 0 0 7.8125vw;
}

#create-button {
  float: left;
  width: 20.3125vw;
  height: 6.25vw;
  border-radius: 0.3125vw;
  background-color: #43425D;
  margin: 1.5625vw 0 0 1.5625vw;
}

#create-button:hover {
  cursor:pointer
}

#create-button:active {
  cursor: pointer;
}

#create-button:focus {
  cursor: pointer;
}

#create-button p {
  float: left;
  width: 100%;
  font-size: 2.8125vw;
  color: #FFFFFF;
  margin : 0.9375vw 0 0 0;
  text-align: center;
}

#image-file-input-container label {
  float: left;
  width: 20.3125vw;
  height: 6.25vw;
  border-radius: 0.3125vw;
  background-color: #43425D;
  margin: 1.5625vw 0 0 1.5625vw;
  cursor : pointer;
}

#image-file-input-container label p {
  float: left;
  width: 100%;
  font-size: 2.8125vw;
  color: #FFFFFF;
  margin : 0.9375vw 0 0 0;
  text-align: center;
}

#image-file-input-container label:hover {
    cursor : pointer;
    background-color : #364156;
}

#image-file-input-container label:active {
    cursor : pointer;
    background-color : #364156;
}

#image-file-input-container input[type="file"] {
    float : left;
    width : 0vw;
    height : 0vw;
    padding : 0;
    margin : -0.078125vw;
    overflow : hidden;
    clip : rect(0, 0, 0, 0);
    border : 0;
}

#activity-create-title {
  float: left;
  width: 19.53125vw;
  height: 3.125vw;
  border-radius: 0.3125vw;
  padding-left: 0.78125vw;
  margin: 7.8125vw 0 0 1.5625vw;
}

#activity-create-content {
  float: left;
  width: 19.53125vw;
  height: 3.125vw;
  border-radius: 0.3125vw;
  padding-left: 0.78125vw;
  margin: 1.5625vw 0 0 1.5625vw;
}
</style>