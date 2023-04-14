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
 ~  @version		0.0.01
 ~      == /UserScript == */

// Define a function to set up button listeners
function setButtonListeners() {
    // Set event listener for button to reload the extension
    document.getElementById(`btn_reload_extension`).addEventListener(`click`, reloadEx);

    // Set event listener for button1 to create a new tab with the URL "/text/text_output.html"
    document.getElementById(`button1`).addEventListener(`click`, () => {
        const newURL = "/text/text_output.html";
        browser.tabs.create({url: newURL}).then();
    });

    // Set event listener for button2 to create a new tab with the URL "/text/text_input.html"
    document.getElementById(`button2`).addEventListener(`click`, () => {
        const newURL = "/text/text_input.html";
        browser.tabs.create({url: newURL}).then();
    });
}

// Define a function to reload the extension
function reloadEx() {
    browser.runtime.reload(); // Use the browser.runtime.reload() method to reload the extension
}

// Call the setButtonListeners function to set up the event listeners for the buttons
setButtonListeners();
