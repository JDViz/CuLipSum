/*
 * Copyright (c) 2023. kinkycraft.com
 * GNU General Public License v3.0 or later [GPL-3.0-or-later]
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. See <https://www.gnu.org/licenses/> <https://spdx.org/licenses/GPL-3.0-or-later.html>
 */
/*      == UserScript ==
 ~  @appname		CuLipSum
 ~  @name			text_output
 ~  @description	This makes the output page do stuff
 ~  @include		/text/text_output.html
 ~  @version		1.0.01
 ~      == /UserScript == */

function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

function emptyRadios(radioNames) { // Empties the radio buttons prior to refreshing them.
    document.getElementById(radioNames).innerHTML = "";
    document.getElementById(radioNames).innerHTML = "<div><h3>Choose Content</h3></div>";
}

function buildContentRadios(key, name, contentSelector) {
    // Create an HTML string that defines the radio button and its associated label
    const itemContent = `<input class="state" type="radio" name="radioContent" id="${key}" value="${key}">
                    <label class="label" for="${key}">
                        <div class="indicator"></div>
                        <span class="text">${name}</span>
                    </label>`;
    // Get the HTML element with the ID "radioContentBox"
    const box = document.getElementById("radioContentBox");
    // Create a new <div> element and set its innerHTML to the HTML string created above
    const div = document.createElement("div");

    div.innerHTML = DOMPurify.sanitize(itemContent);
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

function saveContentChoice(btnValue) {
    browser.storage.local.set({  // Save default to local storage
        contentSelector: btnValue
    }).then();
    setChecked(btnValue); // set relevent radio button to checked.
}
function saveFormatChoice(btnValue) {
    browser.storage.local.set({  // Save default to local storage
        formatSelector: btnValue
    }).then();
    setChecked(btnValue); // set relevent radio button to checked.
}

function setRadioListeners(radioNames) {
    // Get all radio buttons with the given name
    let radioBtns = document.getElementsByName(radioNames);

    // Loop through all the radio buttons and add a click event listener
    for(let btn of radioBtns) {
        btn.addEventListener('click', () => {
            // Get the value of the clicked radio button
            let btnValue = btn.value;

            // Check if the radio button name matches "radioContent"
            if(radioNames === `radioContent`) {
                // If so, save the content choice
                saveContentChoice(btnValue);
                // Reload the whole page
                pageLoad();
            }
            // Check if the radio button name matches "radioFormat"
            else if (radioNames === `radioFormat`) {
                // If so, save the format choice
                saveFormatChoice(btnValue);
            }
        });
    }
}

function setChecked(btnValue) {
    document.getElementById(btnValue).checked = true;
}

function setFormatNormal() {
    browser.storage.local.get('currentContent', (item) => {
        let currentContent = item.currentContent;
        let arrayHolder = JSON.parse(currentContent); // Keep a master copy of the content in arrayHolder
        let currContentArray = [];  // Create a working copy of the content

        for (i = 0; i < arrayHolder.length; i++) { // copy the master copy into currContentArray
            currContentArray[i] = arrayHolder[i];
        }

        document.getElementById('boxOutput').innerHTML = ``;
        const INIT_LENGTH = currContentArray.length;
        function writeElement(type, num, boldedSentence, emphasized) {
            if(currContentArray.length < num) { // If the working content array is not long enough for the requested paragraph, refill it from the master content array.
                for (i = 0; i < arrayHolder.length; i++) {
                    currContentArray[i] = arrayHolder[i];
                }
            }
            if(type === "ul" || type === "ol") {const paraContent = currContentArray.splice(0, num);
                const items = currContentArray.splice(0, num);
                const list = document.createElement(type);
                for(let i = 0; i < items.length; i++) {
                    let cleanContent = DOMPurify.sanitize(items[i]);
                    const licontent = cleanContent;
                    const li = document.createElement("li");
                    li.innerHTML = DOMPurify.sanitize(licontent);
                    list.appendChild(li);
                }
                document.getElementById("boxOutput").appendChild(list);
            } else {
                const paraContentArray = [];
                for (let i = 1; i <= num; i++) {
                    const element = currContentArray.shift();
                    let cleanContent = DOMPurify.sanitize(element);
                    if(i > 0 && i === boldedSentence) {
                        paraContentArray.push(`<span class="boldie">${cleanContent}</span> `);
                    } else {
                        paraContentArray.push(`${cleanContent} `);
                    }
                }
                const para = document.createElement(type);
                para.innerHTML = DOMPurify.sanitize(paraContentArray.join(""));
                if(emphasized) {
                    para.classList.add("emphasis");
                }
                document.getElementById("boxOutput").appendChild(para);
            }
        }

        writeElement("h1", 1, 0, false);
        writeElement("p", 4, 0, true);
        writeElement("p", 5, 4, false);
        writeElement("h2", 1, 0, false);
        writeElement("p", 3, 0, false);
        writeElement("ol", 3, 0, false);
        writeElement("h3", 3, 0, false);
        writeElement("h4", 1, 0, false);
        writeElement("h5", 1, 0, false);
        writeElement("h6", 1, 0, false);
        writeElement("p", 4, 0, false);
        writeElement("ul", 5, 0, false);

        // For the remaining paragraphs, randomize which are emphasised and which have a bolded sentence.
        for(let i = 0; i < 10; i++) {
            let rando = 0;
            const randoPercent = Math.floor(Math.random() * 100) + 1;
            const percent = Math.floor(Math.random() * 100) + 1;
            if (randoPercent < 50) {
                rando = Math.floor(Math.random() * 5) + 1;
            } else {
                rando = 0;
            }
            let emph = false;
            if (percent > 80) { emph = true; }
            writeElement("p", 5, rando, emph);
        }

        // Cleanup the content for printing.
        let linesUsed = INIT_LENGTH - currContentArray.length;
        let lineCounts = `Lines used: ${linesUsed} || Lines Available: ${INIT_LENGTH} || Lines remaining: ${currContentArray.length}`;
        document.getElementById('lineCount').innerHTML = DOMPurify.sanitize(lineCounts);

        // Get the numbers of sentences and report them.
        let getHTML = document.getElementById('boxOutput').innerHTML.toString();

        // save the generated innerHTML of this view and save it for the setFormatHTML view.
        browser.storage.local.set({
            outputHTML: getHTML
        }).then();
    });

}

function setFormatHTML() {
    document.getElementById('boxOutput').innerHTML = ``; // Empty the boxOutput div
    document.getElementById('lineCount').innerHTML = ''; // Empty the lineCount <p>
    browser.storage.local.get('outputHTML', (item) => {
        const formattedHTML = item.outputHTML;

        let cleanedHTML = JSON.stringify(formattedHTML);
        cleanedHTML = cleanedHTML.replace(/\\n/g, '');
        cleanedHTML = cleanedHTML.replace(/"/g, '');

        function beautifyHTML(html) { // from https://stackoverflow.com/a/60338028/421934
            var tab = '\t';
            var result = '';
            var indent= '';

            html.split(/>\s*</).forEach(function(element) {
                if (element.match( /^\/\w/ )) {
                    indent = indent.substring(tab.length);
                }

                result += indent + '<' + element + '>\r\n\n';

                if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("li")  ) {
                    indent += tab;
                }
            });

            return result.substring(1, result.length-3);
        }

        let beautHTML = beautifyHTML(cleanedHTML);
        beautHTML = beautHTML.replace(/>>/g, `>`);
        document.getElementById('boxOutput').innerText = beautHTML;
    });
}

function setFormatMarkdown() {
    browser.storage.local.get('currentContent', (item) => {
        let currentContent = item.currentContent;
        let currContentArray = JSON.parse(currentContent);

        document.getElementById('boxOutput').innerHTML = ``;
        const INIT_LENGTH = currContentArray.length;
        function writeElement(type, num, boldedSentence, emphasized) {
            let paraContentArray = [];
            let emph = ``;

            if(emphasized) {
                emph = `***`;
            }

            for (let i = 1; i <= num; i++) {
                const element = currContentArray.shift(); // pull a sentence off the top
                type = type === "numbered" ? `${i}. ` : type;
                if(i === boldedSentence) {
                    paraContentArray.push(`${emph}${type}**${element}**${emph}<br>`);
                } else {
                    paraContentArray.push(`${emph}${type}${element}${emph}<br>`);
                }
            }

            const ptype = document.createElement('p');
            // ptype.innerHTML = paraContentArray.join("");
            ptype.innerHTML = DOMPurify.sanitize(paraContentArray.join(""));
            document.getElementById("boxOutput").appendChild(ptype);

        }

        writeElement("# ", 1, 0, false);
        writeElement("", 4, 0, true);
        writeElement("", 5, 4, false);
        writeElement("## ", 1, 0, false);
        writeElement("", 3, 0, false);
        writeElement("numbered", 3, 0, false);
        writeElement("### ", 3, 0, false);
        writeElement("#### ", 1, 0, false);
        writeElement("##### ", 1, 0, false);
        writeElement("###### ", 1, 0, false);
        writeElement("", 4, 0, false);
        writeElement("* ", 5, 0, false);

        // For the remaining paragraphs, randomize which are emphasised and which have a bolded sentence.
        for(let i = 0; i < 10; i++) {
            let rando = 0;
            const randoPercent = Math.floor(Math.random() * 100) + 1;
            const percent = Math.floor(Math.random() * 100) + 1;
            if (randoPercent < 50) {
                rando = Math.floor(Math.random() * 5) + 1;
            } else {
                rando = 0;
            }
            let emph = false;
            if (percent > 80) { emph = true; }
            writeElement("", 5, rando, emph);
        }

        let linesUsed = INIT_LENGTH - currContentArray.length;
        let lineCounts = `Lines used: ${linesUsed} || Lines Available: ${INIT_LENGTH} || Lines remaining: ${currContentArray.length}`;

        document.getElementById('lineCount').innerHTML = DOMPurify.sanitize(lineCounts);
    });
}

function setFormatPlain() {
    document.getElementById('boxOutput').innerHTML = `<!--<p id="plainOutput"></p>-->`; // Empty the boxOutput div

    browser.storage.local.get('currentContent', (item) => {
        let currContentArray = JSON.parse(item.currentContent);
        document.getElementById('lineCount').innerText = `${currContentArray.length} Total Lines`;

        for(let i = 0; i < currContentArray.length; i++) {
            const itemContent = `${currContentArray[i]}<br>`;
            let line = document.createElement("p");
            line.innerHTML = DOMPurify.sanitize(itemContent);
            document.getElementById('boxOutput').appendChild(line);

        }
    });
}

function setFormatBlock() {
    browser.storage.local.get('currentContent', (item) => {
        let currentContent = item.currentContent;
        let currContentArray = JSON.parse(currentContent);

        document.getElementById('boxOutput').innerHTML = ``;
        let joinedContentArray = currContentArray.join(" ");
        document.getElementById('boxOutput').innerHTML = DOMPurify.sanitize(joinedContentArray);
        document.getElementById('lineCount').innerHTML = currContentArray.length; // Put content in page
    });
}

function saveCurrentContent(contentArray) {
    const CURRENT_CONTENT = JSON.stringify(contentArray);
    browser.storage.local.set({  // Save default to local storage
        currentContent: CURRENT_CONTENT
    }).then();
}

function populateContent(content) {
    let contentArray = content.split('\n'); // save the content to an array
    // contentArray =
    let title = contentArray.shift(); // Take the top line off and make it the title
    let subTitle = contentArray.shift(); // Take the second line off and make it the subTitle

    document.getElementById('contentTitle').innerText = title.toString(); // Publish to the page
    document.getElementById('subTitle').innerText = subTitle.toString(); // Publish to the page

    let len = contentArray.length; // Get the starting number of lines/sentences in the content.
    function shuffleText() { // Randomize the order of the sentences.
        for (let i = len -1; i > 0; i--) {
            let y = Math.floor(Math.random() * i);
            let temp = contentArray[i];
            contentArray[i] = contentArray[y];
            contentArray[y] = temp;
        }
    }

    function setFormatListeners() { // Enable the listeners for the Format buttons
        let radioBtns = document.getElementsByName('radioFormat');
        for(let btn of radioBtns) {
            btn.addEventListener('click', () => {
                let btnValue = btn.value;
                saveFormatChoice(btnValue);
                getFormat();
            });
        }
    }

    function getFormat() { // Get the chosen/desired format
        let format = '';
        browser.storage.local.get('formatSelector', (item) => {
            format = item.formatSelector;
            createFormat(format);
        });
        return format;
    }

    function createFormat(format) {

        // if format_normal
        if (format === 'format_normal') {
            setFormatNormal();
        } else if (format === 'format_html') { // if format_html
            setFormatHTML();
        } else if (format === 'format_markdown') { // if format_markdown
            setFormatMarkdown();
        } else if (format === 'format_plain') { // if format_plain
            setFormatPlain();
        } else if (format === 'format_block') { // format_block
            setFormatBlock();
        }
    }

    shuffleText();
    saveCurrentContent(contentArray);
    setFormatListeners();
    getFormat();
}

function pageLoad() { // When the page loads
    emptyRadios('radioContentBox');  // Empty the content radio buttons to start fresh.

    browser.storage.local.get(all => { // Pull local storage data for this extension
        setChecked(all.formatSelector); // Set the saved format radio button.
        let contentSelector = all.contentSelector; // set the saved chosen content

        const CONTENT_ITEMS = [];
        for (const [key, val] of Object.entries(all)) { // Loop through the stored data
            if (key.includes('TextContent')) { // For each piece of data that is content, build a radio button for it
                let lines = val.split('\n');
                let name = lines[0];
                let item = {
                    "Name": name,
                    "Key": key,
                    "ContentSelector": contentSelector,
                    "val": val
                }
                CONTENT_ITEMS.push(item);
            }
        }
        // Sort the content items by alpha
        function compare( a, b ) {
            if ( a.Name < b.Name ){
                return -1;
            }
            if ( a.Name > b.Name ){
                return 1;
            }
            return 0;
        }

        let sortedContent = CONTENT_ITEMS.sort( compare );
        for (let i = 0; i < sortedContent.length; i++) {
            let itemKey = sortedContent[i].Key;
            let itemName = sortedContent[i].Name;
            let itemContentSelector = sortedContent[i].ContentSelector;
            let itemVal = sortedContent[i].val;
            buildContentRadios(itemKey, itemName, itemContentSelector);
            if (itemKey === itemContentSelector) { // where the content matches the saved selected, send it to the populateContent function
                populateContent(itemVal);
            }
        }
        setRadioListeners('radioContent'); // Set listeners to execute when the radio buttons change.
    });
    document.getElementById('btn_select_all').addEventListener('click', () => {
        selectElementText(document.getElementById("boxOutput"));
    });
}
pageLoad();
