window.addEventListener('load', function () {
    // FirebaseUI config.
	const auth = firebase.auth();
    var uiConfig = {
		signInSuccessUrl: './emm.html',
		signInOptions: [
			{
				provider: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
				disableSignUp: {
					status: true,
					adminEmail: "hongthinh.le@chingluh.com",
					helpLink: "https://chingluhgroup-emm.web.app/help.html"}
			}
		],
		// Terms of service url.
		tosUrl: './index.html'
    };

	const user = auth.currentUser;

	if (user) {
		user.getIdToken().then(function (token) {
			document.cookie = "token=" + token;
		});
		window.location.replace('./emm.html'); 
	} else {
	// No user is signed in.
	}

    firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in, so display the "sign out" button and login info.
			user.getIdToken().then(function (token) {
				// Add the token to the browser's cookies. The server will then be
				// able to verify the token against the API.
				// SECURITY NOTE: As cookies can easily be modified, only put the
				// token (which is verified server-side) in a cookie; do not add other
				// user information.
				document.cookie = "token=" + token;
			});
			window.location.replace('./emm.html'); 
		} else {
			// User is signed out.
			// Initialize the FirebaseUI Widget using Firebase.
			var ui = new firebaseui.auth.AuthUI(firebase.auth());
			// Show the Firebase login button.
			ui.start('#firebaseui-auth-container', uiConfig);
			
			// Clear the token cookie.
			document.cookie = "token=";
		}
    }, function (error) {
		console.log(error);
		alert('Unable to log in: ' + error)
    });
});