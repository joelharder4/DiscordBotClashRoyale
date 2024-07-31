
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




function isDateOlderThanXSeconds(date, seconds) {
    const now = new Date();
    const secondsInMillis = seconds * 1000;
    const secondsAgo = new Date(now.getTime() - secondsInMillis);
    
    return date < secondsAgo;
}

function isDateOlderThanXMinutes(date, minutes) {
    const now = new Date();
    const minutesInMillis = minutes * 60 * 1000;
    const minutesAgo = new Date(now.getTime() - minutesInMillis);
    
    return date < minutesAgo;
}

function isDateOlderThanXHours(date, hours) {
    const now = new Date();
    const hoursInMillis = hours * 60 * 60 * 1000;
    const hoursAgo = new Date(now.getTime() - hoursInMillis);
    
    return date < hoursAgo;
}

function isDateOlderThanXDays(date, days) {
    const now = new Date();
    const daysInMillis = days * 24 * 60 * 60 * 1000;
    const daysAgo = new Date(now.getTime() - daysInMillis);
    
    return date < daysAgo;
}

module.exports = {
    getFormattedTimeStringWithSeconds,
    getFormattedTimeString,
    getFormatted24HourTimeString,
    getCurrentTimeString,
    isDateOlderThanXSeconds,
    isDateOlderThanXMinutes,
    isDateOlderThanXHours,
    isDateOlderThanXDays,
}