function retrieveFromLs(name, callback) {
    chrome.storage.local.get([name], function (result) {
        callback(result[name]);
    });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
    const notifyMessage = (alarms) => {
        const message = alarms[alarm.name];
        chrome.notifications.create('', {
            title: alarm.name,
            message: message,
            iconUrl: '../icon.png',
            type: 'basic'
        });
    }
    retrieveFromLs("alarms", notifyMessage);
});


