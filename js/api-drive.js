      // Client ID and API key from the Developer Console
      var CLIENT_ID = '657363786150-kcj1g1jve04beaiuvm1hrfn8i37ut8tv.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyAfcRmAdoVRgqu52hm2pZMtbz9llSbDvBM';
      var DOWNLOAD_URL = "https://www.googleapis.com/drive/v3/files/";
      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
      var fileObj = {};
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          
          
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          
          
          listFiles();
        } else {
          
          
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(data) {
          $('#content').append(`<div class="col-md-4 col-sm-4 services text-center">
          <div class="services-content" data-id="${data.id}" onclick="downloadFile(this.id,'${data.name}')">
                <img style="width:10%" src="https://www.pcc.edu/instructional-support/wp-content/uploads/sites/17/2018/03/Googledocslogo.png"/>
              <h5>${data.name}</h5>
              <p style="text-align: justify"></p>
          </div>
      </div>`)
        // var pre = document.getElementById('content');
        // var textContent = document.createTextNode(message + '\n');
        // pre.append(textContent);
      }

      /**
       * Print files.
       */
      function listFiles() {
        gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)"
        }).then(function(response) {
          var files = response.result.files;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.dir(file)
              appendPre(file);
            }
          } else {
            appendPre('No files found.');
          }
        });
      }
      
      function insertFile(fileData, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'parents':'1_isT3LWKoY7aLMi1eBR3D6ZuA7KxVDSn',
            'title': fileData.name,
            'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });
        // if (!callback) {
        //     callback = function (file) {
        //         console.log(file);
        //     };
        // }
        request.execute(alert('Upload feito com Sucesso'));
    }
}

function myFile(file) {
    insertFile(file[0],success);
}

function success() {
    console.log("I am Happy");
    // $("#upload-success").show();

    // var tim = setTimeout(hideWelcome, 3000);
    // console.log(tim);
}

function downloadFile(fileId,nameFile) {
    var url = DOWNLOAD_URL + fileId + "?alt=media";
    var reader = new FileReader();
    console.log(fileId);
    if (url) {
        var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.onload = function () {
            console.log(xhr.response);


            //downloading blob data
            var a = document.createElement("a");
            a.style = "display: none";
            document.body.appendChild(a);
            //Create a DOMString representing the blob and point the link element towards it
            var url = window.URL.createObjectURL(xhr.response);
            a.href = url;
            a.download = nameFile;
            //programatically click the link to trigger the download
            a.click();
            //release the reference to the file by revoking the Object URL
            window.URL.revokeObjectURL(url);


        };
        xhr.onerror = function () {
            console.log(null);
        };
        xhr.send();
    } else {
        console.log(null);
    }
}
    // <script async defer src="https://apis.google.com/js/api.js"
    //   onload="this.onload=function(){};handleClientLoad()"
    //   onreadystatechange="if (this.readyState === 'complete') this.onload()">
    // </script>
  


