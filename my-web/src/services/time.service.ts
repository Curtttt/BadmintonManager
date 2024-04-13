import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class timeService {

    getDay(tg: any) {
        let today: any;
        if (tg == "today")
            today = new Date();
        else today = new Date(tg);

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    getCurrentTime() {
        let inp = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: "numeric",
            minute: "numeric"
        });
        let time = inp.split(" ")[0];
        let apm = inp.split(" ")[1];

        let hour_ = parseInt(time.split(":")[0]);
        let output = time.split(":");
        if (apm == "PM")
            if (hour_ != 12)
                return `${hour_ + 12}:${output[1]}`;
            else return `${output[0]}:${output[1]}`;
        else 
            if (hour_ == 12)  
                return `00:${output[1]}`;
            else if (hour_ < 10)
                return `0${output[0]}:${output[1]}`;
            else return `${output[0]}:${output[1]}`;
    }

    getDayDiff(day1_: any, day2_: any) {
        day1_ = day1_.split("/");
        day2_ = day2_.split("/");
        let day1 = new Date(day1_[2], day1_[1]-1, day1_[0]);
        let day2 = new Date(day2_[2], day2_[1]-1, day2_[0]);
        
        return Math.floor((day2.getTime() - day1.getTime())/(1000*3600*24));
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