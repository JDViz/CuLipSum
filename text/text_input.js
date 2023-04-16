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
 ~  @version		1.0.01
 ~      == /UserScript == */


function onError(error) {
    console.log(`Error: ${error}`);
}

function hideElement(element) {
    document.getElementById(element).style.display = "none";
}
function showElement(element) {
    document.getElementById(element).style.display = "inline-block";
}
function saveContent(saveName, textBlock) {

    browser.storage.local.set({  // Save default to local storage
        [saveName]: textBlock
    }).then(() => {
        showElement('saved');
    }, onError);
}
function resetAlerts() {
    document.getElementById('titleAlert').innerText = '';
    document.getElementById('contentAlert').innerText = '';
}

function cleanContent(content) {
    content = content.replace(/(^[ \t]*\n)/gm, ""); // removes empty lines
    content = content.replace(/^\s+|\s+$/gm, ""); // removes leading spaces from all lines
    return content;
}

function getDummyContent(get) {
    if(get) {
        let sentContentP = document.getElementById('sentContent').innerHTML;

        const cleanedContentP = cleanContent(sentContentP);
        saveContent('sentContentTextContent', cleanedContentP);
    }
}

function sendTextForSave() {

    // for internal testing. takes the content from hidden Ptag sentContent and saves it as a content item.
    getDummyContent(false);
    // getDummyContent(true);

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
    let newTextString = newTextArray.join('\n');

    if(INPUT_TITLE && INPUT_BLOCK) { // if the title and main content block aren't empty... send to saveContent().
        resetAlerts();
        saveContent(contentName, newTextString);
    } else {  // send alert that the title or main content box (or both) are empty.
        if(!INPUT_TITLE) {
            document.getElementById('titleAlert').innerText = 'Title cannot be empty!';
        }
        if(!INPUT_BLOCK) {
            document.getElementById('contentAlert').innerText = 'Content box cannot be empty!';
        }
    }
}

// Select all the text in the content box when clicked inside
let contentBox = document.getElementById('freeformInput');
contentBox.addEventListener('focus', (e) => {
    contentBox.select();
});

const SUBMIT_BTN = document.getElementById('inputSubmit');
SUBMIT_BTN.addEventListener('click', sendTextForSave);

// Upload by file button.
// Get the HTML element with the ID "textFile"
let textFile = document.getElementById('textFile');
// Add a change event listener to the "textFile" element
textFile.addEventListener("change", (e) => {
    // Hide Saved
    hideElement('saved');

    // Get the file path of the selected file
    const FILE_PATH = e.target.value;
    // Get the HTML element with the ID "freeformInput" - This is the big input field box
    const contentBox = document.getElementById('freeformInput');
    // Get the selected file
    const [file] = textFile.files;
    // Get the file type by splitting the file path by '.'
    const FILE_TYPE = FILE_PATH.split('.').pop();
    // Get the HTML element with the ID "inputFileAlert"
    const INPUT_FILE_ALERT = document.getElementById('inputFileAlert');

    // Check if the file type is "txt"
    if(FILE_TYPE === 'txt') {
        // If so, clear the input file alert text
        INPUT_FILE_ALERT.innerText = '';
        // Create a new FileReader object
        const reader = new FileReader();

        // Add a load event listener to the FileReader object
        reader.addEventListener(
            "load",
            () => {
                // Set the value of the "contentBox" element to the text content of the file
                // contentBox.value = reader.result;
                // Split the content line by line into an array
                // Get the file's content
                const LOADED_CONTENT = reader.result;
                // Send it for cleaning
                const CLEANED_CONTENT = cleanContent(LOADED_CONTENT);
                // Split it into an array
                let contentArray = CLEANED_CONTENT.split('\n');
                // First line becomes the title
                document.getElementById('inputTitle').value = contentArray.shift();
                // next line becomes the tagline
                document.getElementById('inputTagline').value = contentArray.shift();
                // The remainder populates the content input box
                contentBox.value = contentArray.join('\n');
            },
            false
        );

        // Read the selected file as text
        if (file) {
            reader.readAsText(file);
        }
    } else {
        // If the file type is not "txt", set the input file alert text to "Must be a .txt file."
        INPUT_FILE_ALERT.innerText = 'Must be a .txt file.';
    }
});

// Hide Saved
hideElement('saved');