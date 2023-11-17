window.addEventListener('load', function () {
    document.getElementById('sign-out').onclick = function () {
      	firebase.auth().signOut();
    };
  
    // FirebaseUI config.
    var uiConfig = {
		signInSuccessUrl: '/emm.html',
		signInOptions: [
			{
				provider: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
				disableSignUp: {
					status: true,
					adminEmail: "hongthinh.le@chingluh.com",
					helpLink: "https://chingluhgroup-emm.web.app/help.html"}
			}
		],
		tosUrl: '/login.html'
    };
  
    firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in, so display the "sign out" button and login info.
			document.getElementById('emm-body').hidden = false;
			document.getElementById('sign-out').hidden = false;
			document.getElementById('login-fullname').innerHTML = user.email;
			// console.log(`Signed in as ${user.displayName} (${user.email})`);
			user.getIdToken().then(function (token) {
				document.cookie = "token=" + token;
			});
		} else {
			// User is signed out.
			// Initialize the FirebaseUI Widget using Firebase.
			firebase.auth().signOut();
			document.cookie = "token=";
			window.location.replace('/login.html');
		}
    }, function (error) {
		console.log(error);
		alert('Unable to log in: ' + error)
    });
});