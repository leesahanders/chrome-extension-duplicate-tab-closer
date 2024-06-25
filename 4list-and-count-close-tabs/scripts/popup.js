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

const tabs = await chrome.tabs.query({
  pinned: false
});

//Display count of all tabs
console.log("tabsCount: " + tabs.length);

const lenText = 'Number of tabs:<strong> ' + tabs.length + '</strong>';
document.getElementById('windowTabs').innerHTML = lenText;

// Display list of tabs
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
    //alert('left click fired.');
    console.log('left click fired.');
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  element.querySelector('a').addEventListener('contextmenu', async () => {
    //alert('right click fired.');
    console.log('right click fired.');
    //close selected tab
    await chrome.tabs.remove(tab.id);
    //now we need to refresh our menu
    window.location.reload();
  });

  elements.add(element);
}
document.querySelector('ul').append(...elements);





