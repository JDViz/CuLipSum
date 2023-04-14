/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*      == UserScript ==
 ~  @appname		CuLipSum
 ~  @name			text_delete
 ~  @description	This makes the text_delete page select and remove chosen content
 ~  @include		/text/text_delete.html
 ~  @version		1.0.00
 ~      == /UserScript == */

function setDeleteBtnListener() {
    // deleteButton = document.getElementById(`${buttonID}delete`);
    // deleteButton.addEventListener('click', () => {
    //     console.log(`Deleting ${key}`);
    // });

    // Get all radio buttons with the given name
    let deleteBtns = document.getElementsByClassName('delete_button');

    // Loop through all the radio buttons and add a click event listener
    for(let btn of deleteBtns) {
        btn.addEventListener('click', () => {
            // Get the value of the clicked radio button
            // let btnValue = btn.id;
            console.log(`Deleting ${btn.id}`);
            browser.storage.local.remove(btn.id).then();
            pageLoad();
        });
    }
}

function buildContentList(key, name) {
    console.log(`${key} - ${name}`);
    //Create an HTML string that defines the radio button and its associated label
    const itemContent = `<div class="itemName"><h3>${name}</h3></div><button id="${key}" class="delete_button">Delete</button>`;
    // Get the HTML element with the ID "radioContentBox"
    const box = document.getElementById("boxOfDeletes");
    // Create a new <div> element and set its innerHTML to the HTML string created above
    const div = document.createElement("div");
    div.innerHTML = itemContent;
    // Add a class of "wrapper" to the new <div> element
    div.classList.add("deleteItems");
    // Append the new <div> element to the "radioContentBox" element
    box.appendChild(div);
}

function pageLoad() { // When the page loads
    // emptyRadios('radioContentBox');  // Empty the content radio buttons to start fresh.

    document.getElementById('boxOfDeletes').innerHTML = '';
    browser.storage.local.get(all => {

        for (const [key, val] of Object.entries(all)) { // Loop through the stored data || console.log(`${key} :: ${val}`);
            if (key.includes('TextContent') && key !== 'defaultTextContent' && key !== 'DuneTextContent') { // For each piece of data that is content, build a radio button for it || console.log(`${key} :: ${val}`); // console.log(`All TextContent: ${key}`);
                let lines = val.split('\n');
                let name = lines[0];
                buildContentList(key, name);
            }
        }
        setDeleteBtnListener();
    });
}
pageLoad();