//Globals
var data;
var key = 0;
var confirmClear = false;
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
    try {
        textArea.select();
        document.execCommand('copy');
    } catch (e) {

    }
    document.body.removeChild(textArea);
}
function CopyToClipboardFromKey(id) {
    CopyToClipboard(decodeTxt(getData(id, data)["val"]));
    return false;
}

function updateClear() {
    if (data.length > 0) {
        document.getElementById("clear").style.visibility = "visible";
    } else {
        document.getElementById("clear").style.visibility = "hidden";
    }
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
function clearTxt() {
    document.getElementById("txt").value = "";
    document.getElementById("txt").focus();
}
function encodeTxt(txt) {
    var encoded = encodeURIComponent(txt);
    return encoded;
}
function decodeTxt(txt) {
    var decoded = decodeURIComponent(txt);
    //decoded = decoded.replace(/\x20/g, '\u00A0');
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
        if (dataArray[i]["key"] === key) {
            dataArray.splice(i,1);
            break;
        }
    }
    setStorage(dataArray);
}

function getLastKey(dataArray) {
    var max = 0;
    for (i = 0; i < dataArray.length; i++) {
        if (dataArray[i]["key"] > max)
            max = dataArray[i]["key"];
    }
    return max;
}
function getNewKey() {
    key = key + 1;
    return key;
}

function writeData(val, key) {
    var withCopy = "<tr class='dataField'><td class='delTd'><a href='#' onclick='return deleteClick(this);' name='" + key + "'>X</a></td><td class='copyTd'><a href='#' onclick='return CopyToClipboardFromKey(" + key + ");'> Copy </a></td><td class='qrTd'><a href='#' onclick='return getQRClick(event," + key + ");' id='qrclick" + key + "'> QR </a></td><td class='dataTd'  id='dataField" + key + "' onclick=editClick(event) name='" + key + "'></td></tr>";
    document.getElementById("dataDiv").innerHTML += withCopy;
    var field = document.getElementById("dataField" + key);
    field.textContent = decodeTxt(val);
    field.innerHTML = field.innerHTML.replace(/\n\r?/g, "<br />");
}

function editClick(e) {
    var field = e.target;
    if (field.classList.contains("dataTd")) {
        var key = field.getAttribute('name');
        var editBox = document.createElement("textarea");
        editBox.style.height = (field.clientHeight + 10) + "px";
        editBox.style.width = (field.clientWidth + 50) + "px";
        field.innerHTML = "";
        field.appendChild(editBox);
        editBox.focus();
        editBox.value = decodeTxt(getData(key, data)["val"]);
        editBox.onblur = function () {
            saveData(encodeTxt(editBox.value), key, data);
            setStorage(data);
            field.textContent = decodeTxt(getData(key, data)["val"]);
            field.innerHTML = field.innerHTML.replace(/\n\r?/g, "<br />");
            editBox.remove();
        };
    }
}

function getQRClick(e, key) {
    handle = e.target;

    if (handle === document.getElementById("qrclick" + key)) {
        if (handle.childElementCount === 0) {
            handle.textContent = "";
            dataString = decodeTxt(getData(key, data)["val"]);
            //var sz = getQRSize(dataString.length);
            var qrDiv = qr.image({value: dataString,
                size: 10,
                foreground:"#006666"
            });
            //var qrDiv = qr.image(dataString);
            qrDiv.setAttribute("id", "qr" + key);
            handle.appendChild(qrDiv);
        }
    } else if (handle === document.getElementById("qr" + key)) {
        handle.parentElement.textContent = "QR";
        handle.remove();
    }
    return false;
}

function deleteClick(handle) {
    delData(parseInt(handle.name), data);
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
    document.getElementById("heading").onclick = function () {
        document.getElementById("descriptionBox").hidden = !document.getElementById("descriptionBox").hidden;
        return false;
    };

    data = getStorage();
    if (data === null) {
        data = [];
    } else {
        document.getElementById("descriptionBox").hidden = true;
        key = getLastKey(data);
        for (i = 0; i < data.length; i++) {
            writeData(data[i]["val"], data[i]["key"]);
        }
    }
    document.getElementById("clear").onclick = function () {
        if (confirmClear) {
            document.getElementById("clear").value = "ClearAllNotes";
            clearLocal();
            confirmClear = !confirmClear;
        } else {
            document.getElementById("clear").value = "Confirm";
            confirmClear = !confirmClear;
        }
    };
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
    document.getElementById("txt").onfocus = function(){
        document.getElementById("descriptionBox").hidden =true;
    };

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
