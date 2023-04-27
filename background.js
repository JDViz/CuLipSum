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
~  @version		    1.0.01
           == /UserScript == */


function cleanContent(content) {
    content = content.replace(/(^[ \t]*\n)/gm, ""); // removes empty lines
    content = content.replace(/^\s+|\s+$/gm, ""); // removes leading spaces from all lines
    return content;
}

function fetchAndSaveDefaultContent(filePath, textContentName) {
    fetch(filePath)
        .then(response => response.text())
        .then((data) => {
            // console.log(`Data PreClean: ${data}`);
            // data = cleanContent(data);
            // console.log(`Data PostClean: ${data}`);
            browser.storage.local.set({
                [textContentName]: data
            }).then();
        });
}
function onGotLocalStorage(items) { // Do this once local storage has been loaded.
    if (!items.FireflyTextContent) { // If firefly is not loaded re-pull all the default content, this is the default content
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

    if (!items.contentSelector && !items.formatSelector) {
        saveSelectors(`FireflyTextContent`, 'format_normal');
    }
}
function loadDefaultContent() {
    fetchAndSaveDefaultContent('/text/sentences_firefly.txt', 'FireflyTextContent');
    fetchAndSaveDefaultContent('/text/sentences_dune.txt', 'DuneTextContent');
    fetchAndSaveDefaultContent('/text/sentences_InvaderZim.txt', 'InvaderZimTextContent');
}

function onError(error) {
    console.log(`Error: ${error}`);
}

const getting = browser.storage.local.get();
getting.then(onGotLocalStorage, onError);
