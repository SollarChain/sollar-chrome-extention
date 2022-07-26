

function getFromStorage(title: string, defaultValue: any, isJson=true) {
    let storageData = localStorage.getItem(title);
    if (storageData && isJson) {
        storageData = JSON.parse(storageData);
    }

    return storageData ?? defaultValue;
}

export default getFromStorage;