<template>
    <div id="client-footer">
        <div id="client-footer-container">
            <p class="client-footer-text" id="company">회  장 {{ adminName }} {{ adminPhoneNumber }}</p>
            <p class="client-footer-text" id="sub-company">부회장 {{ subAdminName }} {{ subAdminPhoneNumber }}</p>
            <p class="client-footer-text" id="location-text">서울과학기술대학교 미래관 322호</p>
        </div>
    </div>
</template>

<script>
export default {
    name : 'ClientFooter',
    data : function() {
        return {
            adminName : '',
            adminPhoneNumber : '',
            subAdminName : '',
            subAdminPhoneNumber : ''
        }
    },
    methods : {
        usersAdminAPI : function() {
            this.$axios.get(this.$store.state.host + this.$store.state.urls.users.admin)
            .then(res => {
                if(res.status == 200) {
                    this.adminName = res.data.adminDatas[0].name;
                    this.adminPhoneNumber = res.data.adminDatas[0].phoneNumber;
                    this.subAdminName = res.data.adminDatas[1].name;
                    this.subAdminPhoneNumber = res.data.adminDatas[1].phoneNumber;
                }
            })
            .catch(error => {
                console.log('Server error, please ask to developer');
                alert('Server error, please ask to developer');
            });
        }
    },
    created() {
        this.usersAdminAPI();
    }
}
</script>

<style lang="scss" scoped>
#client-footer-container {
    float : left;
    width : 83.59375vw;
    height : 6.46875vw;
    background-color : #8d9bb5;
}

.client-footer-text {
    float : left;
    height : 2.109375vw;
    color : #FFFFFF;
    font-size : 1.328125vw;
    font-weight: 24vw;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
}

#company {
    margin : 2.25vw 0 0 4.7890625vw;
}

#sub-company {
    margin : 2.25vw 0 0 5.40625vw;
}

#location-text {
    margin : 2.25vw 0 0 14.2109375vw;
}

@media ( max-width : 600px ) {

}
</style>