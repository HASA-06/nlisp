<template>
    <div id="client-header">
        <div id="client-header-container">
            <img id="client-header-search-image" :src="searchImage"/>
            <input id="client-header-search" placeholder="Search transactions, invoices or help" v-model.lazy="searchParameter"/>
            <img id="client-header-search-button" :src="searchButtonImage" v-on:click="searchButton()"/>
            <img id="client-header-chatting-button" :src="chatImage" v-on:click="routeChattingButton()"/>
            <img id="client-header-alarm-button" :src="ararmButtonImage"/>
            <img id="client-header-user-image" :src="imageURL"/>
            <img id="client-info-button" :src="userInfoButtonImage" v-on:click="routeUserInfoButton()"/>
            <p id="client-name">{{ name }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name : 'ClientHeader',
    data : function () {
        return {
            imageURL : '',
            name : '',
            email : '',
            searchParameter : '',
            searchImage : require('../assets/images/client_headers/topbar_search.jpg'),
            chatImage : require('../assets/images/client_headers/topbar_2.jpg'),
            searchButtonImage : require('../assets/images/client_headers/topbar_1.jpg'),
            ararmButtonImage : require('../assets/images/client_headers/topbar_3.jpg'),
            userInfoButtonImage : require('../assets/images/client_headers/user_info.jpg')
        }
    },
    methods : {
        searchButton : function() {
            console.log(this.searchParameter);
        },
        routeChattingButton : function() {
            if(this.$route.name != 'Chatting') {
                this.$router.push({
                    name : 'Chatting'
                });
            }
        },
        routeUserInfoButton : function() {
            if(this.$route.name != 'Info') {
                this.$router.push({
                    name : 'Info'
                });
            }
        }
    },
    created() {
        this.imageURL = this.$store.state.users.imageURL;
        this.name = this.$store.state.users.name;
        this.email = this.$store.state.users.email;
    }
}
</script>

<style lang="scss" scoped>
#client-header-container {
    float : left;
    width : 83.59375vw;
    height : 4.6875vw;
    box-shadow: 0 0.15625vw 0.46875vw 0 rgba(0, 0, 0, 0.04);
    background-color : #FFFFFF;
}

#client-header-user-image {
    float : right;
    width : 1.78125vw;
    height : 1.78125vw;
    border-radius : 3.90625vw;
    margin : 1.609375vw 1.890625vw 0 0.546875vw;
}

#client-info-button {
    float : right;
    width : 0.859375vw;
    height : 0.859375vw;
    margin : 2.03125vw 0 0 0;
    background-color : #3c3b54;
    border-radius : 3.90625vw;
}

#client-name {
    float : right;
    font-size : 0.703125vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #4d4f5c;
    margin : 1.875vw 0.546875vw 0 0;
}

#client-header-search-image {
    float : left;
    width : 1.25vw;
    height : 1.25vw;
    background-color : #bcbccb;
    margin : 1.710937vw 0 0 1.5625vw;
}

#client-header-search {
    float : left;
    border-top : 0vw;
    border-right : 0vw;
    border-left : 0vw;
    border-bottom : 0vw;
    width : 60.78125vw;
    padding-left : 1.5625vw;
    height : 1.328125vw;
    font-size : 1.015625vw;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #4d4f5c;
    margin : 1.7109375vw 0 0 0.78125vw ;
}

#client-header-search-button {
    float : left;
    width : 1.25vw;
    height : 1.25vw;
    margin : 1.71875vw 0 0 1.5625vw;
    background-color : #bcbccb;
}

#client-header-chatting-button {
    float : left;
    width : 1.25vw;
    height : 1.25vw;
    margin : 1.71875vw 0 0 2.1640625vw;
    background-color : #bcbccb;
}

#client-header-alarm-button {
    float : left;
    width : 1.25vw;
    height : 1.25vw;
    margin : 1.71875vw 0 0 0.71875vw;
    background-color : #bcbccb;
}

@media ( max-width : 46.875vw ) {

}
</style>