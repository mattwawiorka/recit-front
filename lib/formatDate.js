const formatDate = {
    getMonth : (month) => {
        if (month === 0) {
            return 'January'
        } 
        else if (month === 1) {
            return 'February'
        } 
        else if (month === 2) {
            return 'March'
        } 
        else if (month === 3) {
            return 'April'
        } 
        else if (month === 4) {
            return 'May'
        }  
        else if (month === 5) {
            return 'June'
        }  
        else if (month === 6) {
            return 'July'
        }  
        else if (month === 7) {
            return 'August'
        } 
        else if (month === 8) {
            return 'September'
        }  
        else if (month === 9) {
            return 'October'
        }  
        else if (month === 10) {
            return 'November'
        } 
        else if (month === 11) {
            return 'December'
        }
    },
    getTime: (dateTime) => {
        const d = new Date(dateTime);
        let hour = d.getHours();
        let minute = d.getMinutes();
        let amPM;

        if (hour > 11) {
            amPM = 'PM';
        } else {
            amPM = 'AM';
        }

        hour = hour % 12;

        if (hour === 0) {
            hour = 12;
        }

        return hour + ':' + minute + ' ' + amPM;

    },
    getMonthDayTime: (dateTime) => {
        const d = new Date(dateTime);
        let month = d.getMonth();
        const date = d.getDate();

        return formatDate.getMonth(month) + ' ' + date + ' at ' + formatDate.getTime(dateTime);
    }
}

export default formatDate;