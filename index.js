const express = require('express')
var CryptoJS = require("crypto-js");
const path = require('path')
const request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');
const {
	json
} = require('express');
var firebase = require("firebase-admin");

var serviceAccount = require(__dirname + "/private/cre.json");
var serviceAccountd = require(__dirname + "/private/st.json");

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://english-re-learning-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var st = firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccountd),
	databaseURL: "https://english-re-edu-default-rtdb.asia-southeast1.firebasedatabase.app/"
}, 'secondary');
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json())
app.use(cors());
var port = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('started'))

app.post('/zak', function (req, res) {
	const BOT_TOKEN = '5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY'
	const CHAT_ID = -1001682384010 // <YOUR_CHAT_ID>

	const tmMsg = (text) => {
		const options = {
			method: 'POST',
			url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				parse_mode: "HTML",
				text
			})
		};
		request(options, function (error, response) {
			if (!error) //throw new Error(error);
				console.log(response.body);
			else console.log(error);
		});
	};
	const getmid = (pn, sid, cid) => {
		const v3 = (zid) => {
			if (zid != null && zid != "0") {
				console.log(zid)
				const stname = (tkna, zid) => {


					const v4 = (tkna, tnm, zid) => {
						var collect = tnm["fn"] + " " + tnm["ln"]
						if (tnm == "null") {
							res.send("No Such Student Registered")
						}
						else {
							const zome = (tnm, tkna, zid) => {
								console.log(tnm + tkna + zid)
								const options = {
									method: 'GET',
									url: `https://api.zoom.us/v2/users/` + zid,
									headers: {
										'Content-Type': 'application/json',
										"Authorization": "Bearer " + tkna
									}
								};
								request(options, function (error, response) {
									if (response.body != null) {
										var pmi = JSON.parse(response.body)["pmi"]

										const options = {
											method: 'GET',
											url: `https://api.zoom.us/v2/meetings/` + pmi,
											headers: {
												'Content-Type': 'application/json',
												"Authorization": "Bearer " + tkna
											}
										};
										request(options, function (error, response) {
											if (!error) {
												sturl = JSON.parse(response.body)["start_url"]
												zak = sturl.split("zak")[1]
												const dt = new Date();
												const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

												tsn = `${
  padL(dt.getMonth()+1)}/${
  padL(dt.getDate())}/${
  dt.getFullYear()} ${
  padL(dt.getHours())}:${
  padL(dt.getMinutes())}:${
  padL(dt.getSeconds())}`
												res.send("zackgot" + "=" + zak)
												st.database().ref("attemps/" + sid + "/" + rid + "/" + Math.floor(Date.now() / 1000)).set({
													ts: tsn
												})

												tmMsg(`<b>` + `✅ New recording watch token has been issued</b>` + `\n` + `<b>Class ID:</b> ` + cid + `\n` + `<b>Student Name: </b>` + "RE" + ("000" + sid).slice(-4) + ` ` + tnm + `\n` + `<b>Recording ID:</b> ` + rid + `\n` + `<b>Timestamp: </b>` + tsn)


											}
											else {
												tmMsg("Error in Recording Token server")
											}

										})

									}


									if (error) {
										console.log(response.body);
										if (res.headersSent) {}
										else {
											tmMsg(response.body)
											res.send(response.body)

										}
									}

								});
							};

							zome(collect, tkna, zid)
						}


					}
					var path3 = `students/` + sid
					// Create References
					const dbRefObject = firebase.database().ref().child(path3);
					// Sync object changes
					dbRefObject.once('value', get => v4(tkna, get.val(), zid));

				}
				//ZOOM AUTH
				const gtk = (pnn, zid) => {
					const options = {
						method: 'POST',
						url: `https://server-01.englishre.xyz/tk`,
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							pn: pnn
						})
					};;
					request(options, function (error, response) {
						if (response.body != 'null') {
							console.log(response.body)
							stname(response.body, zid);

							//succ
						}
						else {
							res.send("Invalid Tutor ID")
						}
					});
				};

				const acctk = (d) => {
					console.log(d)
					if (d == "null") {
						gtk(pn, zid)
					}
					else {
						xx = d
						console.log(xx["tm"])
						if (3500 > (Math.floor(new Date().getTime() / 1000) - xx["tm"])) {
							stname(xx["tk"], zid);
						}
						else {
							gtk(pn, zid)
						}
					}
				}
				var path = "/zoomauth/temp/" + pn
				// Create References
				const dbRefObject0023 = firebase.database().ref().child(path);

				// Sync object changes
				dbRefObject0023.once('value', snap => acctk(snap.val()));;

			}
			else {
				tmMsg(`Recording account not set. Please set it \n <b>Teacher ID: </b> ${pn} \n<b>Request Student ID: </b> ${sid} \n <b>Request Class ID: </b> ${cid} `)
				res.send("Ask you teacher to set an account for cloud recording in account settings page!")
			}

		}
		var path3 = `zoomauth/` + pn + "/rec/id"
		// Create References
		const dbRefObject = firebase.database().ref().child(path3);
		// Sync object changes
		dbRefObject.once('value', get => v3(get.val()));


	}


	const pc = (sid, cid, pn) => {
		var today = new Date();
		var mn = today.getUTCMonth() + 1;
		console.log("Current Month is " + mn)


		const v2 = (rep) => {
			console.log(rep)
			if (rep == 'ok') {
				console.log("Paid")


				getmid(pn, sid, cid);


			}
			else {
				console.log("nopay")
				res.send("Class fees not paid")
				tmMsg("Not Paid Student ID:" + sid + " is attempting to watch recording at class ID: " + cid)
			}


		};

		var path3 = `pay/` + cid + `/` + sid + `/` + ('0' + parseInt(mn)).slice(-2) + "/pay"
		console.log(path)
		// Create References
		const dbRefObject = firebase.database().ref().child(path3);
		// Sync object changes
		dbRefObject.once('value', get => v2(get.val()));

	}

	authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV"
	console.log('receiving data ...');
	console.log('body is ', req.body);
	bb = JSON.parse(JSON.stringify(req.body))
	rid = req.body.rid || "Data Missing"
	console.log(bb["tk"].replace("'", '').replace('"', "").replace('"', '').replace("'", ''))
	temp = bb["tk"].replace("'", '').replace('"', "").replace('"', '').replace("'", '')
	console.log(CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8))
	outc = CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8)
	aa = JSON.parse(outc)

	console.log(aa["pn"])

	if (aa["pn"] != undefined || aa["pn"] != '') {

		const v8 = (ds) => {
			Date.prototype.getWeekOfMonth = function () {
				var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
				var offsetDate = this.getDate() + firstWeekday - 1;
				return Math.floor(offsetDate / 7);
			}
			if (ds == "restrict") {
				console.log("Restrict Access Class")
				pc(aa["sid"], aa["cid"], aa["pn"])
			}
			else {
				if (ds.includes("auto")) {
					var thear = ds.split("``")
					var startdate = parseInt(thear[1])
					var endate = parseInt(thear[2])
					var daraz = new Date();

					console.log("Current Date is " + daraz.getDate())
					console.log("Auto Access Class | Open from " + startdate + " to " + endate)
					console.log(daraz.getDate() < endate)
					console.log(daraz.getDate() > startdate)
					if (daraz.getDate() < endate && daraz.getDate() > startdate) {
						console.log("In free cuz today is " + daraz.getDate())
						getmid(aa["pn"], aa["sid"], aa["cid"])
					}
					else {
						pc(aa["sid"], aa["cid"], aa["pn"])
					}

				}
				else {
					console.log("Open Access Class")
					getmid(aa["pn"], aa["sid"], aa["cid"])
				}
			}
		}
		var path3 = `status/` + aa["cid"] + "/sts"
		// Create References
		const dbRefObject = st.database().ref().child(path3);
		// Sync object changes
		dbRefObject.once('value', get => v8(get.val()))


	}
	else {
		res.send("Filed Errors - Unusual Activity")
		tmMsg("Crticial Unusual Activity - " + req.body)
	}

});

// start the server
app.listen(port);

console.log('Server started! At http://localhost:' + port);