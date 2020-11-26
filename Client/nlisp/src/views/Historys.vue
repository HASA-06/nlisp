<template>
    <div id="historys">
        <div id="chatting-container">
          <img src="../assets/images/boards/board_delete.jpg"/>
          <p>Now developing......</p>
          <p>아직 미구현된 기능입니다. 다음 업데이트를 관리자에게 문의하세요 :)</p>
        </div>
    </div>
</template>

<script>
export default {
    name : 'Historys',
  created() {
    alert('아직 미구현 페이지입니다 :)');
  }
}
</script>

<style lang="scss" scoped>
#historys-container {
  float: right;
  width: 83.59375vw;
  height: auto;
  background-color: #f5f6fa;
  margin: 0 0 7.8125vw 0;
}

#chatting-container {
  float: left;
  width: 63.28125vw;
  height: 46.875vw;
  margin: 4.6875vw 10.15625vw 4.6875vw 10.15625vw;
  background-color: #FFFFFF;
}

#chatting-container img {
  width: 23.4375vw;
  height: 23.4375vw;
  max-width: 23.4375vw;
  float: left;
}
</style>