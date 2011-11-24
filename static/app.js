/*
* Copyright (c) 2011 Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy of
* the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/

lastUpdate = new Date().getTime();
currentUpdate = null;

function updateState(pageNumber) {
      gapi.hangout.data.submitDelta({'currentPage': ''+pageNumber});
}

function changePageForAll() {
  var pageNumber = scribd_doc.api.getPage();
  console.log('In changePageForAll: ' + pageNumber);
  now = new Date().getTime();
  if (now - lastUpdate > 1000) {
      updateState(pageNumber);
  } else {
      if (currentUpdate) {
          window.clearTimeout(currentUpdate);
      }
      currentUpdate = window.setTimeout(function() {
                updateState(pageNumber);
              }, 1000);
  }
}

function updateStateUi(state) {
  var pageNumber = state['currentPage'];
  if (pageNumber) {
    console.log('In updateStateUi: ' + pageNumber);
    pageNumber = parseInt(pageNumber);
    if (currentUpdate) {
        window.clearTimeout(currentUpdate);
        currentUpdate = null;
    }
    if (scribd_doc.api.getPage() != pageNumber) {
        scribd_doc.api.setPage(pageNumber);
    }
  }
}

// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');

  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      console.log('API is ready');

      gapi.hangout.data.onStateChanged.add(function(eventObj) {
        updateStateUi(eventObj.state);
      });

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
