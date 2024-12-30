function retrieveFromLs(name, callback) {
    chrome.storage.local.get([name], function (result) {
        callback(result[name]);
    });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
    const notifyMessage = (alarms) => {
        console.log(alarm, "alarm");
        
        const alarmInfo = alarms[alarm.name];

        console.log(alarmInfo, "alarmInfo");

        chrome.notifications.create('', {
            title: String(alarmInfo.title),
            message: String(alarmInfo.message),
            iconUrl: '../icon.png',
            type: 'basic'
        });
    }
    retrieveFromLs("alarms", notifyMessage);
});


