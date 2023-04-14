/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*      == UserScript ==
 ~  @appname		CuLipSum
 ~  @name			text_input
 ~  @description	This styles the text_output.html page
 ~  @include		/text/text_output.html
 ~  @version		1.0.00
 ~      == /UserScript == */

function saveContent(saveName, textBlock) {
    console.log(`Sent to save content.`)
    // console.log(textBlock);

    browser.storage.local.set({  // Save default to local storage
        [saveName]: textBlock
    }).then();
}
function resetAlerts() {
    document.getElementById('titleAlert').innerText = '';
    document.getElementById('contentAlert').innerText = '';
}

function getDummyContent(get) {
    if(get) {
        let sentContentP = document.getElementById('sentContent').innerHTML;
        sentContentP = sentContentP.replace(/(^[ \t]*\n)/gm, ""); // removes empty lines
        sentContentP = sentContentP.replace(/^\s+|\s+$/gm, ""); // removes leading spaces from all lines

        // console.log(sentContentP);
        browser.storage.local.set({  // Save default to local storage
            sentContentTextContent: sentContentP
        }).then();
    }
}

function getInput() {
    console.log(`Clicked SendIT!`);

    getDummyContent(false);
    // getDummyContent(false);

    const INPUT_TITLE = document.getElementById('inputTitle').value; // Get the entered text for the title
    let titleNoSpaces = INPUT_TITLE.replace(/\s/g,''); // remove any spaces
    let contentName = `${titleNoSpaces}TextContent`; // set the key for the storage.local entry.

    let inputTagline = ``; // set the default variable for the tag line
    const INPUT_TAGLINE = document.getElementById('inputTagline').value; // Get the entered text for the tag line
    if(INPUT_TAGLINE) {
        inputTagline = INPUT_TAGLINE; // If they entered the tagline, then use it...
    } else {
        inputTagline = `-`; // ...otherwise set it as a dash.
    }

    const INPUT_BLOCK = document.getElementById('freeformInput').value;

    let newTextArray = INPUT_BLOCK.split('\n');
    newTextArray.unshift(`${INPUT_TITLE}`, inputTagline);
    // let newTextString = JSON.stringify(newTextArray);
    let newTextString = newTextArray.join('\n');

    if(INPUT_TITLE && INPUT_BLOCK) { // if the title and main content block aren't empty... send to saveContent().
        resetAlerts();
        // console.log(`${contentName}:${INPUT_BLOCK}`);
        saveContent(contentName, newTextString);
    } else {  // send alert that the title or main content box (or both) are empty.
        if(!INPUT_TITLE) {
            const titleAlertText = 'Title cannot be empty!';
            console.log(titleAlertText);
            document.getElementById('titleAlert').innerText = titleAlertText;
        }
        if(!INPUT_BLOCK) {
            const titleAlertText = 'Content box cannot be empty!';
            console.log(titleAlertText);
            document.getElementById('contentAlert').innerText = titleAlertText;
        }
    }
}

// Select all the text in the content box when clicked inside
let contentBox = document.getElementById('freeformInput');
contentBox.addEventListener('focus', (e) => {
    contentBox.select();
});

const SUBMIT_BTN = document.getElementById('inputSubmit');
SUBMIT_BTN.addEventListener('click', getInput);

// Upload by file button.
// document.getElementById('textFile').onchange = function(){
let textFile = document.getElementById('textFile');
textFile.addEventListener("change", (e) => {
    // const content = document.getElementById('contentInput');
    const content = document.getElementById('freeformInput');
    const [file] = textFile.files;
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            // this will then display a text file
            content.value = reader.result;
        },
        false
    );

    if (file) {
        reader.readAsText(file);
    }
});
