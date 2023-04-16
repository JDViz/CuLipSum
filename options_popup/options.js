/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*      == UserScript ==
 ~  @appname		CuLipSum
 ~  @name			Options Popup
 ~  @description	This makes the options popup do stuff
 ~  @include		/options_popup/options.html
 ~  @version		1.0.01
 ~      == /UserScript == */

// Working
function singleBtnListener(element, link) {
    document.getElementById(element).addEventListener(`click`, () => {

        browser.tabs.query({
            currentWindow: true
        }).then((tabs) => {
            let tabExists = false;
            let tabId;

            // Loop through the tabs and find the one with the matching ID
            for (let tab of tabs) {
                if(tab.title.includes('CuLipSum')) {
                    tabExists = true;
                    tabId = tab.id;
                }
            }

            if(tabExists) {
                browser.tabs.update(tabId, {
                    active: true,
                    url: link
                });
            } else {
                browser.tabs.create({url: link}).then();
            }
        });
    });
}

// Define a function to set up button listeners
function setButtonListeners() {
    singleBtnListener(`btn_generate_page`, "/text/text_output.html#culipsum_page");
    singleBtnListener(`btn_input_page`, "/text/text_input.html#culipsum_page");
    singleBtnListener(`btn_delete_page`, "/text/text_delete.html#culipsum_page");
    singleBtnListener(`btn_edit_page`, "/text/text_edit.html#culipsum_page");
}

// Define a function to reload the extension
function reloadEx() {
    browser.runtime.reload(); // Use the browser.runtime.reload() method to reload the extension
}

// Call the setButtonListeners function to set up the event listeners for the buttons
setButtonListeners();
