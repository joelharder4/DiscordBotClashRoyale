
function getFormattedTimeStringWithSeconds(date) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function getFormattedTimeString(date) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function getFormatted24HourTimeString(date) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
}


function getCurrentTimeString() {
    const now = new Date();
    return getFormattedTimeString(now);
}

module.exports = {
    getFormattedTimeStringWithSeconds,
    getFormattedTimeString,
    getFormatted24HourTimeString,
    getCurrentTimeString,
}