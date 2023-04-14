/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*        == UserScript ==
~  @appname		    CuLipSum
~  @name			background.js
~  @description	    Stuff that happens on app load or runs in the background
~  @include		    background.js
~  @version		    1.0.00
           == /UserScript == */
// console.log();

function onGotLocalStorage(items) { // Do this once local storage has been loaded.
    // console.log(item)
    if (items.defaultTextContent) { // If default content exists in local storage
        // console.log(`defaultContent Exists:`);
        // console.log(item.defaultContent); // print it to console
    } else {
        console.log(`Default content does not exist, loading...`);
        loadDefaultContent(); // Create it.
    }

    function saveSelectors(contentSelector, formatSelector) {
        browser.storage.local.set({
            contentSelector: contentSelector
        }).then();
        browser.storage.local.set({
            formatSelector: formatSelector
        }).then();
    }

    if (items.contentSelector && items.formatSelector) {
        // handleSelectors(items.contentSelector, items.formatSelector);
        // console.log(`Selectors Exist`);
    } else {
        console.log(`Selectors Missing. Setting defaults...`);
        saveSelectors(`defaultTextContent`, 'format_normal');
        // saveSelectors(DEFAULT_NAME, 'format_normal');
    }
}
function loadDefaultContent() {
    console.log(`Loading Default Content`);
    const fireflyTextFile = '/text/sentences_firefly.txt'; // Default content file path
    const duneTextFile = '/text/sentences_dune.txt';

    // Read in default text file, process it, and save it to Local Storage.
    fetch(fireflyTextFile) // Get content from the file
        .then(response => response.text()) // once it loads...
        .then((data) => {
            browser.storage.local.set({
                defaultTextContent: data
            }).then();
        });
    fetch(duneTextFile)
        .then(response => response.text())
        .then((data) => {
            browser.storage.local.set({
                DuneTextContent: data
            }).then();
        });
}

function onError(error) {
    console.log(`Error: ${error}`);
}

const getting = browser.storage.local.get();
getting.then(onGotLocalStorage, onError);

