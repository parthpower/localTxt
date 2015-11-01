//Globals
var data;
var key = 0;

function CopyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

}

function CopyToClipboardFromKey(id) {
    CopyToClipboard(decodeTxt(getData(id, data)["val"]));
    return false;
}
function updateClear() {
    document.getElementById("clear").disabled = !(data.length > 0);
}

function storageAvailable(type) {
    try {
        var storage = window[type],
                x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
}

function getTxt() {
    return encodeTxt(document.getElementById("txt").value);
}

function encodeTxt(txt) {
    var encoded = encodeURIComponent(txt);
    return encoded;
}
function decodeTxt(txt) {
    var decoded = decodeURIComponent(txt);
    decoded = decoded.replace(/\x20/g, '\u00A0');
    return decoded;
}

function setStorage(dataArray) {
    updateClear();
    localStorage.setItem("#data", JSON.stringify(dataArray));
}
function getStorage() {
    return JSON.parse(localStorage.getItem("#data"));
}

function saveData(val, key, dataArray) {
    var search = getData(key, dataArray);
    if (search === false) { //new data
        item = {};
        item["val"] = val;
        item["key"] = key;
        dataArray.push(item);
    }
    else {
        search["val"] = val;
    }

}

function getData(key, dataArray) {
    for (i = 0; i < dataArray.length; i++) {
        if (dataArray[i]["key"] === parseInt(key)) {
            return dataArray[i];
        }
    }
    return false;
}

function delData(key, dataArray) {
    for (i = 0; i < dataArray.length; i++) {
        if (dataArray[i]["key"] === parseInt(key)) {
            dataArray.pop(i);
        }
    }
    setStorage(dataArray);
}

function getLastKey(dataArray) {
    var max = 0;
    for (i = 0; i < dataArray.length; i++) {
        if (parseInt(dataArray[i]["key"]) > max)
            max = parseInt(dataArray[i]["key"]);
    }
    return max;
}
function getNewKey() {
    key = key + 1;
    return key;
}

function writeData(val, key) {
    var withCopy = "<tr class='dataField'><td><a href='#' onclick='return deleteClick(this);' name='" + key + "'>X</a></td><td><a href='#' onclick='return CopyToClipboardFromKey(" + key + ");'> Copy </a></td><td class='dataTd'  id='dataField" + key + "' onclick=editClick(this) name='" + key + "'></td></tr>";
    document.getElementById("dataDiv").innerHTML += withCopy;
    var field = document.getElementById("dataField" + key);
    field.textContent = decodeTxt(val);
    field.innerHTML = field.innerHTML.replace(/\n\r?/g, "<br />");
}

function editClick(field) {
        var key = field.getAttribute('name');
        var editBox = document.createElement("textarea");
        editBox.style.height = (field.clientHeight + 10) + "px";
        editBox.style.width = (field.clientWidth + 10) + "px";
        field.innerHTML = "";
        field.parentElement.appendChild(editBox);
        editBox.focus();
        editBox.value = decodeTxt(getData(key, data)["val"]);
        editBox.onblur = function () {
            saveData(encodeTxt(editBox.value), key, data);
            setStorage(data);
            field.textContent = decodeTxt(getData(key, data)["val"]);
            field.innerHTML = field.innerHTML.replace(/\n\r?/g, "<br />");
            field.parentElement.removeChild(editBox);
            editBox.remove();
        };
}

function deleteClick(handle) {
    delData(handle.name, data);
    h = handle;
    while (h.getAttribute('class') !== "dataField") {
        h = h.parentElement;
    }
    h.remove();
    updateClear();
    return false;
}

function clearLocal() {
    key = 0;
    data = [];
    localStorage.clear();
    updateClear();
    document.getElementById("dataDiv").innerHTML = "";
}

window.onload = function () {

    if (!storageAvailable('localStorage')) {
        window.innerHTML = "Sorry, you're browser don't support localStorage";
    }
    else {
        data = getStorage();
        if (data === null) {
            data = [];
        } else {
            key = getLastKey(data);
            for (i = 0; i < data.length; i++) {
                writeData(data[i]["val"], data[i]["key"]);
            }
        }
        updateClear();
        document.getElementById("save").onclick = function () {
            currentData = getTxt();
            if (currentData.length > 0) {
                currentKey = getNewKey();
                saveData(currentData, currentKey, data);
                setStorage(data);
                writeData(currentData, currentKey);
            }
            document.getElementById("txt").focus();
            document.getElementById("txt").value = '';
        };
    }
};

window.addEventListener('storage', function () {
    document.getElementById("clear").disabled = (localStorage.length === 0);
    data = getStorage();
    document.getElementById("dataDiv").innerHTML = "";
    if (data === null) {
        data = [];
    } else {
        key = getLastKey(data);
        for (i = 0; i < data.length; i++) {
            writeData(data[i]["val"], data[i]["key"]);
        }
    }
    updateClear();
});
