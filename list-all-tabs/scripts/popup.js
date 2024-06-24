// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//All tabs
//By window
//By group
//How long been open

//const tabs = await chrome.tabs.get({
//  null
//});

//const tabs = chrome.tabs.get(null);

//const tabs = await chrome.tabs.query({
//  url: [
//    'https://developer.chrome.com/docs/webstore/*',
//    'https://developer.chrome.com/docs/extensions/*',
//    "https://developer.chrome.com/*"
//  ]
//});

//getOpenTabsCount = function (callback) {
//  var count = 0;
//  chrome.tabs.query({ url: options_url }, function (tabs) {
//      count -= tabs.length;
//      chrome.tabs.query({}, function (tabs) {
//          count += tabs.length;
//          callback(count);
//      });
//  });
//};

//chrome.windows.getAll({populate:true},function(windows){
//  var i=0;
//  windows.forEach(function(window){
//    window.tabs.forEach(function(tab){
//      //collect all of the urls here, I will just log them instead
//      console.log(tab.url);
//      i++;
//    });
//  });
//  console.log(i);
//});

const tabs = await chrome.tabs.query({
  url: [
    'https://*',
    'http://*'
    //'https://developer.chrome.com/docs/webstore/*',
    //'https://developer.chrome.com/docs/extensions/*',
    //"https://developer.chrome.com/*"
  ]
});

//const tabs = await chrome.tabs.get();

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));

  const template = document.getElementById('li_template');
  const elements = new Set();
  for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split('|')[0].trim();
    const pathname = new URL(tab.url).pathname.slice('/docs'.length);

    element.querySelector('.title').textContent = title;
    element.querySelector('.pathname').textContent = pathname;
    element.querySelector('a').addEventListener('click', async () => {
      // need to focus window as well as the active tab
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
  }
  document.querySelector('ul').append(...elements);

