var OV;
var session;

function joinSession() {

	var mySessionId = document.getElementById("sessionId").value;

	OV = new OpenVidu();
	session = OV.initSession();

	session.on("streamCreated", function (event) {
		session.subscribe(event.stream, "subscriber");
	});

	getToken(mySessionId).then(token => {

		session.connect(token)
			.then(() => {
				document.getElementById("session-header").innerText = mySessionId;
				document.getElementById("join").style.display = "none";
				document.getElementById("session").style.display = "block";

				var publisher = OV.initPublisher("publisher");
				session.publish(publisher);
			})
			.catch(err => {
                console.error("There was an error connecting to the session:", err.code, err.message);
                console.error(err && err.stack || err);
			});
    })
    .catch(err => {
        console.error("Error getting token!");
        console.error(err && err.stack || err);
    })

}

function leaveSession() {
	session.disconnect();
	document.getElementById("join").style.display = "block";
	document.getElementById("session").style.display = "none";
}

window.onbeforeunload = function () {
	if (session) session.disconnect()
};


/**
 * --------------------------
 * SERVER-SIDE RESPONSIBILITY
 * --------------------------
 * These methods retrieve the mandatory user token from OpenVidu Server.
 * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
 * the API REST, openvidu-java-client or openvidu-node-client):
 *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
 *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
 *   3) The token must be consumed in Session.connect() method
 */

var OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
var OPENVIDU_SERVER_SECRET = "MY_SECRET";

console.log("Server: " + OPENVIDU_SERVER_URL); //fio:

function getRecordings() {
    const url = OPENVIDU_SERVER_URL + "/api/recordings";
    console.log("getting: " + url);
    $.ajax({
        type: "GET",
        url: url,
        headers: {
            "Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json"
        },
        success: response => {
            console.log("response from " + url);
            console.log(response);
        },
        error: (error) => {
            console.error("error getting: " + url);
            console.log(error);
        }
    });
}



function getToken(mySessionId) {
	return createSession(mySessionId).then(sessionId => createToken(sessionId));
}

function createSession(sessionId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apisessions
    console.log("Creating session: " + sessionId);
	return new Promise((resolve, reject) => {
        const url = OPENVIDU_SERVER_URL + "/api/sessions";
        console.log(">> " + url);
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify({ 
                customSessionId: sessionId,
                recordingMode: "ALWAYS",
            }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => {
                console.log("response:");
                console.log(response);
                resolve(response.id)
            },
			error: (error) => {
                console.log(error);
				if (error.status === 409) {
					resolve(sessionId);
				} else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
                            'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
                            location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
			}
		});
	});
}

function createToken(sessionId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apitokens
	return new Promise((resolve, reject) => {
        const url = OPENVIDU_SERVER_URL + "/api/tokens";
        console.log(">> " + url);
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify({ session: sessionId }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => {
                console.log("response:");
                console.log(response);
                resolve(response.token)

                getRecordings();
            },
			error: error => reject(error)
		});
	});
}