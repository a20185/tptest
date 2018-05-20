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
  api.login(loginObj)
     .then(function(res) {
        callback(res);
     });
}

function getVerified(callback) {
  var verified = false;

  var uname = app.data.currentUserData.username;
  var upass = CryptoJS.SHA256(app.data.currentUserData.username).toString(CryptoJS.enc.Hex);

  var loginObj = {
    _user: uname,
    _pass: upass
  };

  loginNow(function(result) {
    callback(result);
    app.data.currentUserData.uname = loginObj._user;
    app.data.currentUserData.upass = loginObj._pass;
    app.data.currentUserData.status = true;
    app.data.currentUserData.token = result.token;
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
  getVerified(function() {
    app.dialog.alert('登陆成功');
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
  });
});

$$(document).once('ready', function() {
  getSwipeAction();
});
