import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host : 'http://13.124.178.73:3000',
    urls : {
      users : {
        admin : '/users/admin',
        accounts : {
          signUp : '/users/accounts/sign-up',
          signIn : '/users/accounts/sign-in',
          signOut : '/users/accounts/sign-out',
          info : '/users/accounts/info'
        },
        authorizations : {
          sendMail : '/users/authorizations/send-mail'
        },
        tokens : {
          check : '/users/tokens/check',
          reIssue : '/users/tokens/re-issue'
        }
      },
      bulletinBoards : {
        create : '/bulletin-boards/create',
        read : '/bulletin-boards/read',
        readDetail : '/bulletin-boards/read-detail',
        update : '/bulletin-boards/update',
        delete : '/bulletin-boards/delete',
        hit : '/bulletin-boards/hit'
      },
      mentoMentiBoards : {
        list : '/mento-menti-boards/list',
        create : '/mento-menti-boards/create',
        read : '/mento-menti-boards/read',
        readDetail : '/mento-menti-boards/read-detail',
        update : '/mento-menti-boards/update',
        delete : '/mento-menti-boards/delete',
        hit : '/mento-menti-boards/hit'
      },
      activityBoards : {
        create : '/activity-boards/create',
        read : '/activity-boards/read',
        update : '/activity-boards/update',
        delete : '/activity-boards/delete',
        hit : '/activity-boards/hit'
      },
      noticeBoards : {
        create : '/notice-boards/create',
        read : '/notice-boards/read',
        readDetail : '/notice-boards/read-detail',
        update : '/notice-boards/update',
        delete : '/notice-boards/delete',
        hit : '/notice-boards/hit'
      },
      historyBoards : {
        create : '/history-boards/create',
        read : '/history-boards/read',
        delete : '/history-boards/delete',
        memberList : '/history-boards/member-list'
      },
      qnaBoards : {
        ask : '/qna-boards/ask',
        answer : '/qna-boards/answer',
        readAsk : '/qna-boards/read-ask',
        readAnswer : '/qna-boards/read-answer',
        delete : '/qna-boards/delete'
      },
      scheduleBoards : {
        create : '/schedule-boards/create',
        read : '/schedule-boards/read'
      }
    },
    users : {
      id : '',
      token : '',
      email : '',
      name : '',
      imageURL : '',
      adminIDs : [1, 2]
    }
  },
  getters : {
    getUserInfo : function(state) {
      return {
        'userID' : state.users.id,
        'userToken' : state.users.token,
        'userEmail' : state.users.email,
        'userName' : state.users.name,
        'userImageURL' : state.users.imageURL,
        'adminIDs' : state.users.adminIDs
      }
    }
  },
  mutations: {
    setUserInfo : function(state, payload) {
      state.users.id = payload.id,
      state.users.token = payload.token,
      state.users.email = payload.email,
      state.users.name = payload.name,
      state.users.imageURL = payload.imageURL
    },
    deleteUserInfo : function(state) {
      state.users.id = '',
      state.users.token = '',
      state.users.email = '',
      state.users.name = '',
      state.users.imageURL = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
