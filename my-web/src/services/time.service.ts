import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class timeService {

    getCurrentDay() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    getCurrentTime() {
        let inp = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: "numeric",
            minute: "numeric"
        });
        let time = inp.split(" ")[0];
        let apm = inp.split(" ")[1];

        let hour = parseInt(time.split(":")[0]);
        if (apm == "PM")
            if (hour != 12)
                return `${hour + 12}:${time.split(":")[1]}`;
            else return `${hour}:${time.split(":")[1]}`;
        else 
            if (hour == 12)  
                return `00:${time.split(":")[1]}`;
            else return time;
    }

    getTimeDiff(time1: string, time2: string) {
        let t1 = time1.split(":").map(Number);
        let t2 = time2.split(":").map(Number);
        let diff = (t1[0] - t2[0]) * 60 + (t1[1] - t2[1]);

        let hours: any = Math.floor(diff / 60);
        let minutes: any = diff % 60;
        if (hours > 0)
            if (minutes <= 10) minutes = 0;
            else if (minutes > 30 && minutes <= 40) minutes = 30;

        return (hours + (minutes / 60)).toFixed(1);
    }

    sortTime(arr: any){
        arr.sort((a: any, b: any) => {
            if (parseInt(a.checkIn.split(":")[0]) < parseInt(b.checkIn.split(":")[0])) return -1;
            if (parseInt(a.checkIn.split(":")[0]) > parseInt(b.checkIn.split(":")[0])) return 1;
        
            if (parseInt(a.checkIn.split(":")[1]) < parseInt(b.checkIn.split(":")[1])) return -1;
            if (parseInt(a.checkIn.split(":")[1]) > parseInt(a.checkIn.split(":")[1])) return 1;
        
            return 0;
        });

        return arr;
    }
}