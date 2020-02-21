const dateTool = {
    getMonth: (month, abbr) => {
        if (month === 0) {
            if (abbr) {
                return 'Jan'
            }
            return 'January'
        } 
        else if (month === 1) {
            if (abbr) {
                return 'Feb'
            }
            return 'February'
        } 
        else if (month === 2) {
            if (abbr) {
                return 'Mar'
            }
            return 'March'
        } 
        else if (month === 3) {
            if (abbr) {
                return 'Apr'
            }
            return 'April'
        } 
        else if (month === 4) {
            return 'May'
        }  
        else if (month === 5) {
            if (abbr) {
                return 'Jun'
            }
            return 'June'
        }  
        else if (month === 6) {
            if (abbr) {
                return 'Jul'
            }
            return 'July'
        }  
        else if (month === 7) {
            if (abbr) {
                return 'Aug'
            }
            return 'August'
        } 
        else if (month === 8) {
            if (abbr) {
                return 'Sep'
            }
            return 'September'
        }  
        else if (month === 9) {
            if (abbr) {
                return 'Oct'
            }
            return 'October'
        }  
        else if (month === 10) {
            if (abbr) {
                return 'Nov'
            }
            return 'November'
        } 
        else if (month === 11) {
            if (abbr) {
                return 'Dec'
            }
            return 'December'
        }
    },
    getDay: (day) => {
        if (day === 0) {
            return 'Sunday';
        }
        else if (day === 1) {
            return 'Monday';
        }
        else if (day === 2) {
            return 'Tuesday';
        }
        else if (day === 3) {
            return 'Wednesday';
        }
        else if (day === 4) {
            return 'Thursday';
        }
        else if (day === 5) {
            return 'Friday';
        }
        else if (day === 6) {
            return 'Saturday';
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

        if (minute < 10) {
            minute = "0" + minute;
        }

        return hour + ':' + minute + ' ' + amPM;

    },
    getDateTime: (dateTime, date = true, weekDay = false, abbr = false ) => {
        const d = new Date(dateTime);
        if (!date && weekDay) {
            return dateTool.getDay(d.getDay()) + ' ' + dateTool.getTime(dateTime);
        }
        else if (date && weekDay) {
            const month = d.getMonth();
            const date = d.getDate();
            return dateTool.getDay(d.getDay()) + ' ' + dateTool.getMonth(month) + ' ' + date + ' ' + dateTool.getTime(dateTime);
        }
        else {
            const month = d.getMonth();
            const date = d.getDate();
            return dateTool.getMonth(month, abbr) + ' ' + date + ' ' + dateTool.getTime(dateTime);
        }
    },
    getAge: (dob) => {
        const today = new Date();
        const birthday = new Date(parseInt(dob));
        let age = today.getFullYear() - birthday.getFullYear();
        let m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
        }
        return age;
    },
    getMonthYear: (dateTime) => {
        const date = new Date(parseInt(dateTime));

        return dateTool.getMonth(date.getMonth()) + " " + date.getFullYear();
    },
    // These functions return date objects, use valueOf() to get dateTime
    getTomorrow: () => {
        const d = new Date();
        d.setHours(0,0,0,0)
        d.setDate(d.getDate() + 1);
        return d;
    },
    getDayAfterTomorrow: () => {
        const d = new Date();
        d.setHours(0,0,0,0)
        d.setDate(d.getDate() + 2);
        return d;
    },
    getEndOfWeek: () => {
        const d = new Date();
        d.setHours(0,0,0,0)
        const offset = 7 - d.getDay();
        d.setDate(d.getDate() + offset);
        return d;
    },
    getEndOfNextWeek: () => {
        const d = new Date();
        d.setHours(0,0,0,0)
        const offset = 14 - d.getDay();
        d.setDate(d.getDate() + offset);
        return d;
    },
    generateStartTime: () => {
        const d = new Date();
        const startDate = d.toISOString().split("T")[0];

        d.setHours(d.getHours() + 2);
        let startTime, endTime;
        if ((Math.ceil(d.getMinutes()/10)*10) > 59) {
            d.setHours(d.getHours() + 1);
            startTime = d.getHours().toString() + ":" + "00"
            d.setHours(d.getHours() + 2);
            endTime = d.getHours().toString() + ":" + "00"
        } 
        else if (d.getMinutes() == 0) {
            startTime = d.getHours().toString() + ":" + "00"
            d.setHours(d.getHours() + 2);
            endTime = d.getHours().toString() + ":" + "00"
        }
        else {
            startTime = d.getHours().toString() + ":" + (Math.ceil(d.getMinutes()/10)*10).toString();
            d.setHours(d.getHours() + 2);
            endTime = d.getHours().toString() + ":" + (Math.ceil(d.getMinutes()/10)*10).toString();
        }

        return [startDate, startTime, endTime];
    },
}

export default dateTool;