//Globals
var data;
var key = 0;

function getTxt() {
    return encodeURI(document.getElementById("txt").value);
}

function setStorage(dataArray) {
    localStorage.setItem("data", JSON.stringify(dataArray));
}
function getStorage() {
    return JSON.parse(localStorage.getItem("data"));
}

function saveData(val, key, dataArray) {
    item = {};
    item["val"] = val;
    item["key"] = key;
    dataArray.push(item);
}

function delData(key, dataArray) {
    for (i = 0; i < dataArray.length; i++) {
        if (dataArray[i]["key"] === key) {
            dataArray.pop(i);
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
    document.getElementById("clear").disabled = false;
    document.getElementById("dataDiv").innerHTML += "<tr name='" + key + "'><td><a href='#"+encodeURI(val)+"' onclick='return deleteClick(this.parentElement.parentElement);'>X</a></td><td class='dataField'>" + decodeURI(val) + "</td></tr>";
    //var trNode = document.createElement("tr");
    //var tdNode = document.createElement("td");
    //tdNode.innerHTML
    //document.getElementById("dataDiv").appendChild();
}

function deleteClick(handle) {
    delData(parseInt(handle.getAttribute('name')), data);
    handle.remove();
    return false;
}

function clearLocal() {
    key = 0;
    data = [];
    localStorage.clear();
    document.getElementById("dataDiv").innerHTML = "";
    document.getElementById("clear").disabled = true;
}

window.onload = function () {
    console.log("loaded");
    data = getStorage();
    if (data === null) {
        data = [];
    } else {
        key = getLastKey(data);
        document.getElementById("clear").disabled = false;
        for (i = 0; i < data.length; i++) {
            writeData(data[i]["val"], data[i]["key"]);
        }
    }
    document.getElementById("save").onclick = function () {
        currentData = getTxt();
        currentKey = getNewKey();
        saveData(currentData, currentKey, data);
        setStorage(data);
        writeData(currentData, currentKey);
        document.getElementById("txt").focus();
        document.getElementById("txt").value = '';
    };
};