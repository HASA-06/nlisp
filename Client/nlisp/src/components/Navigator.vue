<template>
    <div id="navigator">
        <div id="navigator-container">
            <div id="user-info-container">
                <img id="user-info-image" :src="imageURL"/>
                <div id="user-info">
                    <p id="user-name">{{ name }}</p>
                    <p id="user-email">{{ email }}</p>
                </div>
            </div>
            <div class="navigator-link" v-for="(navigator) in navigators" :key="navigator.id" v-on:click="navigatorClick(navigator.id)">
                <div v-show="navigator.status" class="navigator-active-link">
                  <div class="navigator-active-box"></div>
                  <img class="navigator-active-image" :src="navigator.activeImageURL"/>
                  <p class="navigator-text">{{ navigator.name }}</p>
                </div>
                <div v-show="!navigator.status" class="navigator-inactive-link">
                  <img class="navigator-inactive-image" :src="navigator.inactiveImageURL"/>
                  <p class="navigator-text">{{ navigator.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'Navigator',
    props : ['isAdmin'],
    data : function() {
        return {
            imageURL : '',
            name : '',
            email : '',
            navigators : [{
                    id : 1,
                    status : true,
                    name : 'NLISP',
                    routeName : 'Main',
                    activeImageURL : require('../assets/images/navigators/Nlisp_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Nlisp.jpg')
                }, {
                    id : 2,
                    status : false,
                    name : '게시판',
                    routeName : 'BoardsBulletinsMain',
                    activeImageURL : require('../assets/images/navigators/Boards_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Boards.jpg')
                }, {
                    id : 3,
                    status : false,
                    name : '활동내역',
                    routeName : 'ActivitysPicturesMain',
                    activeImageURL : require('../assets/images/navigators/Activitys_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Activitys.jpg')
                }, {
                    id : 4,
                    status : false,
                    name : '캘린더',
                    routeName : 'CalendersMonth',
                    activeImageURL : require('../assets/images/navigators/Calender_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Calender.jpg')
                }, {
                    id : 5,
                    status : false,
                    name : '정보공유',
                    routeName : 'InfoShare',
                    activeImageURL : require('../assets/images/navigators/InfoShare_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/InfoShare.jpg'),
                }, {
                    id : 6,
                    status : false,
                    name : '채팅',
                    routeName : 'Chatting',
                    activeImageURL : require('../assets/images/navigators/Chat_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Chat.jpg'),
                }, {
                    id : 7,
                    status : false,
                    name : '연혁',
                    routeName : 'Historys',
                    activeImageURL : require('../assets/images/navigators/Historys_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Historys.jpg')
                }, {
                    id : 8,
                    status : false,
                    name : 'Q & A',
                    routeName : 'Qna',
                    activeImageURL : require('../assets/images/navigators/Qna_choice.jpg'),
                    inactiveImageURL : require('../assets/images/navigators/Qna.jpg'),
                }
            ]
        }
    },
    created() {
        this.imageURL = this.$store.state.users.imageURL;
        this.name = this.$store.state.users.name;
        this.email = this.$store.state.users.email;
    },
    methods : {
        navigatorClick : function(navigatorId) {
            if(!this.navigators[navigatorId - 1].status) {
                for(var i = 0; i < this.navigators.length; i++) {
                    this.navigators[i].status = false;

                    if(i == this.navigators.length - 1) {
                        this.navigators[navigatorId - 1].status = true;
                        this.navigatorRoute(navigatorId);
                    }
                }
            }
        },
        navigatorRoute : function(navigatorId) {
            if(navigatorId == 5) {
                window.open('https://drive.google.com/drive/u/1/folders/1IGV_UwV0A4KkM_nuoB0TMeE77aWmvQuH', 'NL드라이브');
            } else {
                if(this.$route.name != this.navigators[navigatorId - 1].routeName) {
                    if(this.navigators[navigatorId - 1].routeQuery) {
                        this.$router.push({
                            name : this.navigators[navigatorId - 1].routeName,
                            query : {
                                type : this.navigators[navigatorId - 1].routeQuery
                            }
                        });
                    } else {
                        this.$router.push({
                            name : this.navigators[navigatorId - 1].routeName
                        });
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#navigator-container {
    float : left;
    width : 16.40625vw;
    height : 163.671875vw;
    background-color : #43425d;
}

#user-info-container {
    float : left;
    width : 100%;
    height : 13.1484375vw;
    background-color : #3c3b54;
    margin-bottom : 1.71875vw;
}

#user-info-image {
    float : left;
    max-width : 3vw;
    width: 3vw;
    height: 3vw;
    border-radius: 0.9375vw;
    margin : 5.15625vw 11.453125vw 0 1.953125vw;
}

#user-info {
    float : left;
    width : 14.453125vw;
    margin : 0.0078125vw 0 0 0;
    padding-left : 1.953125vw;
}

#user-name {
    float : left;
    margin : 0;
    width : 14.453125vw;
    font-size : 1.25vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
}

#user-email {
    float : left;
    margin : 0.007813vw 0 0 0;
    width : 14.453125vw;
    font-size: 0.625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
}

.navigator-link {
    float : left;
    width : 16.40625vw;
    height : 2.65625vw;
    margin : 0 0 0.4296875vw 0;
}

.navigator-link:hover {
  cursor: pointer;
}

.navigator-link:focus {
  cursor: pointer;
}

.navigator-link:active {
  cursor: pointer;
}

.navigator-active-link {
    float : left;
    width : 16.25vw;
    height : 2.5vw;
    background-color: #3c3b54;
    border: solid 0.078125vw #3c3b54;
}

.navigator-active-box {
    float : left;
    width : 0.390625vw;
    margin-top : -0.078125vw;
    height : 2.5vw;
    border: solid 0.078125vw #a3a0fb;
    background-color: #a3a0fb;
}

.navigator-active-image {
    float : left;
    max-width : 1.25vw;
    width : 1.25vw;
    height : 1.25vw;
    margin : 0.5859375vw 1.523438vw 0 1.484375vw;
}

.navigator-text {
    float : left;
    font-size : 1.015625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    margin : 0.5vw 0 0 0;
}

.navigator-inactive-link {
    float : left;
    width : 16.25vw;
    height : 2.5vw;
    background-color: #43425d;
}

.navigator-inactive-image {
    float : left;
    max-width : 1.25vw;
    width : 1.25vw;
    height : 1.25vw;
    margin : 0.5859375vw 1.5234375vw 0 1.875vw;
}

@media ( max-width : 600px ) {

}
</style>