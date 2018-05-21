// Dom7
var $$ = Dom7;

function dataFetchingHook(callback) {
  var statisticData = app.data.statistics;
  callback(statisticData);
}

function getSwipeAction() {
  app.panel.enableSwipe('right');
}

function loginNow(loginObj, callback) {
  // api.login(loginObj)
  //    .then(function(res) {
  //       callback(res);
  //    });
  //
  var hxObj = {
    uname: 'admin',
    pword: CryptoJS.SHA256('12345').toString(CryptoJS.enc.Hex)
  };
  if (loginObj._user === hxObj.uname && loginObj._pass === hxObj.pword) {
    callback({
      token: 'hahahahahhahahahah',
      status: true
    });
  } else {
    callback({
      token: '',
      status: false
    });
  }
}

function getVerified(callback) {
  var verified = false;

  var uname = app.data.currentUserData.uname;
  var upass = CryptoJS.SHA256(app.data.currentUserData.upass).toString(CryptoJS.enc.Hex);

  var loginObj = {
    _user: uname,
    _pass: upass
  };

  loginNow(loginObj, function(result) {
    callback(result);
    app.data.currentUserData.uname = loginObj._user;
    app.data.currentUserData.upass = loginObj._pass;
    app.data.currentUserData.status = result.status;
    app.data.currentUserData.token = result.token;
    console.log(app.data.currentUserData);
  });

  // return verified;
}

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      statistics: {
        users: 100,
        votes: 10000,
      },
      currentUserData: {
        uname: '',
        upass: '',
        token: '',
        alreadyVotes: 20,
        availVotes: 2,
        joined: false,
        status: false
      },
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  app.data.currentUserData.uname = username;
  app.data.currentUserData.upass = password;
  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // var verify = getVerified();
  getVerified(function(res) {
    if (res.status) {
      // Create toast with icon
      app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">check</i>' : '<i class="material-icons">check</i>',
        text: '登陆成功',
        position: 'center',
        closeTimeout: 2000,
      }).open();
      // app.dialog.alert('登陆成功', '提醒');
      $$('#my-login-screen [name="username"]').val();
      $$('#my-login-screen [name="password"]').val();
      app.panel.close('right');
    } else {
      // app.toast.create({
      //   icon: app.theme === 'ios' ? '<i class="f7-icons">close</i>' : '<i class="material-icons">close</i>',
      //   text: '登陆失败，请重新尝试。',
      //   position: 'center',
      //   closeTimeout: 2000,
      // });
      app.toast.create({
        text: '登录失败，请重新尝试。',
        closeButton: true,
        closeButtonText: '知道了',
        closeButtonColor: 'pink',
      }).open();
      // app.dialog.alert('登录失败', '提醒');
    }
  });
  // Alert username and password
  // app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

// $$('#main-right-panel').on('panel:open', function(){
//   console.log('this:' , this);
//   console.log('data:' , app.data);
// });




$$('#main-right-panel').on('panel:open', function() {
  dataFetchingHook(function(statistics) {
    $$('#user-count').text(statistics.users);
    $$('#vote-count').text(statistics.votes);
    if (app.data.currentUserData.status) {
      $$('#login-opener').hide();
      $$('#logout-panel').show();
      $$('#buy-panel').show();
      $$('#record-panel').show();
      $$('#already-vote-count').text(app.data.currentUserData.alreadyVotes);
      $$('#avail-vote-count').text(app.data.currentUserData.availVotes);
      if (app.data.currentUserData.join) {
        $$('#more-infos').text('您已成功报名');
      } else {
        $$('#more-infos').text('您尚未报名');
      }
    } else {
      $$('#already-vote-count').text(23333);
      $$('#avail-vote-count').text(666);
      $$('#login-opener').show();
      $$('#logout-panel').hide();
      $$('#buy-panel').hide();
      $$('#record-panel').hide();
      $$('#more-infos').text('您尚未登录，请登录');
    }
  });
});

$$(document).once('ready', function() {
  getSwipeAction();
});

$$('#mainrule-img').on('load', function() {
  getSwipeAction();
});

$$('#logout-panel').on('click', function() {
  app.data.currentUserData = {
        uname: '',
        upass: '',
        token: '',
        alreadyVotes: 20,
        availVotes: 2,
        joined: false,
        status: false
      };
  app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">check</i>' : '<i class="material-icons">check</i>',
        text: '退出成功',
        position: 'center',
        closeTimeout: 2000,
  }).open();
});