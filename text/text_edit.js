/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*      == UserScript ==
 ~  @appname		CuLipSum
 ~  @name			text_edit
 ~  @description	This makes the text_edit page select and edit content.
 ~  @include		/text/text_edit.html
 ~  @version		1.0.00
 ~      == /UserScript == */

function onError(error) {
    console.log(`Error: ${error}`);
}

function hideElement(element) {
    document.getElementById(element).style.display = "none";
}
function showElement(element) {
    console.log(`Saved`);
    document.getElementById(element).style.display = "inline-block";
}

function emptyRadios(radioNames) { // Empties the radio buttons prior to refreshing them.
    document.getElementById(radioNames).innerHTML = "";
    document.getElementById(radioNames).innerHTML = "<div><h3>Choose Content to Display Below</h3></div>";
}

function setChecked(btnValue) {
    document.getElementById(btnValue).checked = true;
}

function saveContentChoice(btnValue) {
    browser.storage.local.set({  // Save default to local storage
        contentSelector: btnValue
    }).then();
    // document.getElementById(btnValue).checked = true; // set relevent radio button to checked.
    setChecked(btnValue);
}

function saveContent(saveName, textBlock) {
    // console.log(`Sent to save content.`)
    // console.log(textBlock);

    browser.storage.local.set({  // Save default to local storage
        [saveName]: textBlock
    }).then(() => {
        resetAlerts();
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

function sendTextForSave(key) {
    console.log(`Clicked SendIT!`);

    let getTitle = document.getElementById('inputTitle').value;
    let titleNoSpaces = getTitle.replace(/\s/g,''); // remove any spaces
    let contentName = `${titleNoSpaces}TextContent`; // set the key for the storage.local entry.
    // if(key !== contentName) {
    //     console.log(`Old: ${key}, does not match new ${contentName}. Delete old content first`);
    //     browser.storage.local.remove(key).then();
    // } else {
    //     console.log(`Title did not change. Overwrite old: ${key}`);
    // }

    let getTag = document.getElementById('inputTagline').value;

    let getContent = document.getElementById('freeformInput').value;
    getContent = cleanContent(getContent);
    let getContentArray = getContent.split('\n');


    let contentArray = [];
    contentArray.push(getTitle, getTag);
    for(let i = 0; i < getContentArray.length; i++) {
        contentArray.push(getContentArray[i]);
    }
    const COMPILED_CONTENT = contentArray.join('\n');
    saveContent(contentName, COMPILED_CONTENT);
    pageLoad();
}

function setRadioListeners(radioNames) {
    // Get all radio buttons with the given name
    let radioBtns = document.getElementsByName(radioNames);

    // Loop through all the radio buttons and add a click event listener
    for(let btn of radioBtns) {
        btn.addEventListener('click', () => {
            // Get the value of the clicked radio button
            let btnValue = btn.value;

            console.log(`${btnValue} picked.`)
            saveContentChoice(btnValue);
            // Reload the whole page
            pageLoad();
        });
    }
}

function populateContent(key, content) {
    // console.log(content);
    let contentArray = content.split('\n'); // save the content to an array || console.log(`length before shift: ${contentArray.length}`);
    let title = contentArray.shift(); // Take the top line off and make it the title
    let subTitle = contentArray.shift(); // Take the second line off and make it the subTitle || console.log(`length after shift: ${contentArray.length}`);
    const CONTENT_ALERT = document.getElementById('contentAlert');

    // First line becomes the title
    document.getElementById('inputTitle').value = title;
    // next line becomes the tagline
    document.getElementById('inputTagline').value = subTitle;
    // The rest of the array goes into the main content text box.
    const INPUT_BOX = document.getElementById('freeformInput');
    INPUT_BOX.value = contentArray.join('\n');

    const SUBMIT_BTN = document.getElementById('inputSubmit');
    SUBMIT_BTN.addEventListener('click', () => {
        if(INPUT_BOX.value) {
            CONTENT_ALERT.innerText = "";
            // console.log(`input Box is Good. Saving`);
            sendTextForSave(key);
        } else {
            CONTENT_ALERT.innerText = "Content cannot be empty.";
            // console.log(`input Box is empty`);
        }

    });
}

function buildContentRadios(key, name, contentSelector) {
    // Create an HTML string that defines the radio button and its associated label
    const itemContent = `<input class="state" type="radio" name="radioContent" id="${key}" value="${key}">
                    <label class="label" for="${key}">
                        <div class="indicator"></div>
                        <span class="text">${name}</span>
                    </label>`;

    // let cleanHTML = DOMPurify.sanitize(externalHTML);
    let cleanContent = DOMPurify.sanitize(itemContent);
    // console.log(`Cleaned: ${cleanContent}`);

    // Get the HTML element with the ID "radioContentBox"
    const box = document.getElementById("radioContentBox");
    // Create a new <div> element and set its innerHTML to the HTML string created above
    const div = document.createElement("div");
    div.innerHTML = cleanContent;
    // div.setHTML(itemContent, { SANITIZER });
    // Add a class of "wrapper" to the new <div> element
    div.classList.add("wrapper");
    // Append the new <div> element to the "radioContentBox" element
    box.appendChild(div);

    // Check whether the "key" parameter matches the "contentSelector" parameter
    if (key === contentSelector) {
        // If they match, call a separate function called "setChecked" with "key" passed as its argument
        setChecked(key);
    }
}

function pageLoad() { // When the page loads
    // Hide Saved
    hideElement('saved');

    emptyRadios('radioContentBox');  // Empty the content radio buttons to start fresh.

    browser.storage.local.get(all => { // Pull local storage data for this extension
        let contentSelector = all.contentSelector; // set the saved chosen content || console.log(`contentSelector: ${contentSelector}`);

        for (const [key, val] of Object.entries(all)) { // Loop through the stored data || console.log(`${key} :: ${val}`);
            if (key.includes('TextContent') && key !== 'defaultTextContent' && key !== 'DuneTextContent') { // For each piece of data that is content, build a radio button for it || console.log(`${key} :: ${val}`); // console.log(`All TextContent: ${key}`);
                let lines = val.split('\n');
                let name = lines[0];
                buildContentRadios(key, name, contentSelector);
            }
            if (key === contentSelector && key !== 'defaultTextContent') { // where the content matches the saved selected, send it to the populateContent function
                // console.log(`Selected Content: ${key}`);
                populateContent(key, val);
            }
        }
        setRadioListeners('radioContent'); // Set listeners to execute when the radio buttons change.
    });
    // console.log(`Page Loaded.`)
}
pageLoad();