// @ts-nocheck
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { HttpClient } from '@angular/common/http';
import moment from 'moment-timezone';
import { APIService } from '../api.service';

@Component({
  selector: 'create-meeting',
  templateUrl: './create-meeting-component.component.html',
  styleUrl: './create-meeting-component.component.css'
})
export class CreateMeetingComponentComponent implements OnInit {
  currentDate: Date;
  currentformattedDate

  userDeets;
  userEvSchemaDeets;
  userName: string = '';
  emailId: string = '';
  loggedInName = ""
  evId = ""
  userId = ""
  contactsArr = []
  evName = ""
  evDurHrs = 0
  evDurMins = 0
  evLocation = "Google Meet"
  allowInviteesToAddGuests = true
  evType = ""
  // meetingArray : any[] = [];
  formattedMeetingsHide: object[] = [];
  timeSelected = "";
  eventName = "";
  eventDesc = "";
  evLinkEnd = ""
  loading = false
  selectedUserAvObj = {}
  nameWhoseCalendar = ""
  noOfBookingsAllowedForAParticularTimeInGrpEvent
  displayRemainingSpotsOnBookingPageGrp
  lastNameRequired
  cloduraBrandingReq

  displayTimeDiv = false;
  dateSelected = ""
  selectedDayName = ""
  userAvailaibleArray = []
  userAvailaibleArray24 = []
  userAvailaibleArray12 = []
  Events: any[] = [];
  allTimesArray = []
  showNext = false
  showNextFor = ""
  showingIn24hr: Boolean

  previousTimeZone = 'Asia/Calcutta';
  selectedTimeZone = 'Asia/Calcutta'

  workingHrStart = ""
  workingHrEnd = ""

  backGroundcolor: string = ""
  textColor: string = ""
  btnAndLinkColor: string = ""

  avatar = ""
  image = ""
  reqEventObj = {}
  API_URL = 'http://localhost:3000';
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Last 10 years
  selectedMonth = new Date().toLocaleString('default', { month: 'long' });
  selectedYear = new Date().getFullYear();


  // hardcoding--------
  duration = {
    "hrs": 0,
    "minutes": 30
  }
  workingHrsAsPerDays = {
    "1": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "2": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "3": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "4": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "5": {
      "start": "09:00:00",
      "end": "17:00:00"
    }
  }
  workingDays = [1, 2, 3, 4, 5]
  nonWorkingDays = [0, 6]

  // hardcoding ends--------

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    timeZone: this.selectedTimeZone,
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin, momentTimezonePlugin],
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
  };
  // -------------------------------

  // NEW====

  allowInviteesToScheduleOn
  minTimeReqBeforeScheduling
  noOfMeetingsAllowedPerDay
  timesStartTimeIncrements

  meetingsOfOnlyThisEvent
  eventN = ''
  eventLink = ''
  redirectTo = {}

  // NEW END====

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private http: HttpClient) { }

  private subscription: Subscription;




  ngOnInit() {

    console.log();

    // -----taking name and email id from query paramaters----
    this.route.queryParams.subscribe(params => {
      console.log('Create Meeting Component initialized ', this.userId);
      this.userId = params['uid']
      this.evId = params['evId']
      this.evLinkEnd = params['evL']
      localStorage.setItem("eventId", this.evId)



      this.getParticularUserByUid(this.userId)
      this.getParticularUserEvSchema(this.userId)
    })

    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        // events: this.Events, //commented so that events are not shown on calendar
        dateClick: this.onDateClick.bind(this),
        dayCellContent: this.theDayCellContent.bind(this),
      }
    }, 3000);

  }


  async getParticularUserByUid(uid) {
    console.log("getParticularUserByUid is called");

    this.userDeets = await this.apiService.getParticularUserByUid(uid)
    console.log("user deets ", this.userDeets);

    this.nameWhoseCalendar = this.userDeets['name']
    this.emailId = this.userDeets['emailId']
    localStorage.setItem("userEmailId", this.emailId)
    this.apiService.setUserName(this.nameWhoseCalendar);
    this.loggedInName = this.nameWhoseCalendar
    this.apiService.setUserEmailId(this.emailId);


    this.apiService.getSelectedEvent(this.evId)
    this.assignValuesToEventDeets()

    // Fetch meetings
    this.apiService.setReqDetails(this.nameWhoseCalendar, this.emailId, this.image, this.evType, this.evName, this.evDurMins, this.evDurHrs, this.allowInviteesToAddGuests)


    this.apiService.getMeetingsHide(this.userId);
    this.apiService.getSelectedUsersAvailaibilityObj(this.userId)

    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide in ts :', formattedMeetingsHide);
      this.formattedMeetingsHide = formattedMeetingsHide;
      this.Events = formattedMeetingsHide;
      console.log("Events ", this.Events);
    });
    this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
      this.selectedUserAvObj = avObj
      console.log("selectedUserAvObj ", this.selectedUserAvObj);


      this.duration = this.selectedUserAvObj["duration"]
      console.log("duration ", this.selectedUserAvObj["duration"]);

      this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]
      console.log("workingHrsAsPerDays ", this.selectedUserAvObj["workingHrs"]);


      this.workingDays = this.selectedUserAvObj["workingDays"]
      console.log("workingDays ", this.selectedUserAvObj["workingDays"]);

      this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]
      console.log("nonWorkingDays ", this.selectedUserAvObj["nonWorkingDays"]);

      // console.log("duration ",this.duration);
    })
    this.getAllEventEditings()
  }

  async getParticularUserEvSchema(uid) {

    this.userEvSchemaDeets = await this.apiService.getParticularUserEvSchemaDeets(uid)

    this.contactsArr = this.userEvSchemaDeets['contacts']
    localStorage.setItem('contactsArr', JSON.stringify(this.contactsArr))

    this.image = this.userEvSchemaDeets['profileImage'];
    console.log('image in ts :', this.image);

    this.avatar = `${this.API_URL}/${this.userEvSchemaDeets['profileImage']}` //change later
    console.log("avatar ", this.avatar);

    this.cloduraBrandingReq = this.userEvSchemaDeets['cloduraBranding'];
    console.log("this.cloduraBrandingReq ", this.cloduraBrandingReq);
    localStorage.setItem('cloduraBrandingReq', JSON.stringify(this.cloduraBrandingReq))
  }



  to12HourFormat(time: string): string {
    console.log("time ", time);

    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 || 12; // Convert '0' to '12' for midnight
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

  convertTo12HourFormat(): void {
    console.log('convertTo12HourFormat called');

    if (this.evType == 'One-on-One') {
      this.userAvailaibleArray12 = this.userAvailaibleArray24.map(time => this.to12HourFormat(time));
      console.log(" this.userAvailaibleArray12 ", this.userAvailaibleArray12);
      console.log("userAvailaibleArray24 ", this.userAvailaibleArray24);
    }
    // {time: '09:00', remainingBookings: 2}
    else {
      this.userAvailaibleArray12 = this.userAvailaibleArray24.map((item) => {
        return {
          time: this.to12HourFormat(item['time']),
          remainingBookings: item['remainingBookings']
        }
      }
      )
      console.log(" this.userAvailaibleArray12 ", this.userAvailaibleArray12);
      console.log("userAvailaibleArray24 ", this.userAvailaibleArray24);
    }


    if (this.showingIn24hr) {
      this.userAvailaibleArray = this.userAvailaibleArray24
    }
    else {
      this.userAvailaibleArray = this.userAvailaibleArray12;
    }
    console.log('since ', this.showingIn24hr, 'so ', this.userAvailaibleArray);
  }


  assignValuesToEventDeets() {
    console.log("the selected evId and emailIdis ", this.evId, this.emailId);
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      console.log("reqEventObj ", reqEventObj);
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);
        this.evName = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.evLocation = reqEventObj["evLocation"]
        this.allowInviteesToAddGuests = reqEventObj["allowInviteesToAddGuests"]
        this.evType = reqEventObj["evType"]
        this.lastNameRequired = reqEventObj["surnameReq"]
        this.redirectTo = reqEventObj["redirectTo"]

        if (reqEventObj["evType"] == "Group") {
          this.noOfBookingsAllowedForAParticularTimeInGrpEvent = reqEventObj["maxInviteesPerEventForGrpEvent"]
          this.displayRemainingSpotsOnBookingPageGrp = reqEventObj["displayRemainingSpotsOnBookingPageGrp"]
        }
      }
    })
  }



  // =======getsAllEventEditedOptions starts==================

  getAllEventEditings() {

    console.log("getAllEventEditings called");

    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);

        console.log("wanted ", reqEventObj["evDuration"]["minutes"]);


        this.eventN = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.eventLink = this.eventN
        this.backGroundcolor = reqEventObj['bgClr']
        this.textColor = reqEventObj['txtClr']
        this.btnAndLinkColor = reqEventObj['btnAndLnkClr']



        console.log("since ", reqEventObj['timeFormat']);

        if (reqEventObj['timeFormat'] == "24hr") {
          this.showingIn24hr = true
        }
        else {
          this.showingIn24hr = false
        }
        console.log("hence ", this.showingIn24hr);


        localStorage.setItem("backGroundcolor", this.backGroundcolor)
        localStorage.setItem("textColor", this.textColor)
        localStorage.setItem("btnAndLinkColor", this.btnAndLinkColor)
        localStorage.setItem("timeFormat", reqEventObj['timeFormat'])

        // ===========================
      }
    })

    setTimeout(() => {
      this.allowInviteesToScheduleOn = this.reqEventObj["whenCanInviteesSchedule"] //making allowInviteesToScheduleOn object
      console.log("allowInviteesToScheduleOn ", this.allowInviteesToScheduleOn);


      this.minTimeReqBeforeScheduling = this.reqEventObj["minimumNotice"] //making minTimeReqBeforeScheduling object
      console.log("minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);


      this.noOfMeetingsAllowedPerDay = this.reqEventObj["noOfMeetsAllowedPerDay"] //making noOfMeetingsAllowedPerDay object
      console.log("assigned value ", this.noOfMeetingsAllowedPerDay);


      this.timesStartTimeIncrements = this.reqEventObj["startTimIncrements"] //making timesStartTimeIncrements object


      this.meetingsOfOnlyThisEvent = this.reqEventObj["meetings"] //making meetingsOfOnlyThisEvent object

      if (this.timesStartTimeIncrements.status) {
        if (!this.timesStartTimeIncrements.hrs) {
          console.log("duration ", this.duration);

          this.duration.hrs = 0

        }
        else if (this.timesStartTimeIncrements.hrs) {
          this.duration.hrs = this.timesStartTimeIncrements.hrs
        }
        if (!this.timesStartTimeIncrements.mins) {
          this.duration.minutes = 0
        }
        else {
          this.duration.minutes = this.timesStartTimeIncrements.mins
        }
      }
      this.setActiveDaysAsPerUserReq()


    }, 3000)

  }
  // =======getsAllEventEditedOptions ends====================

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    return date < today;
  }

  // ----------theDayCellContent starts----------
  theDayCellContent(info: any) {

    const dayOfWeek = info.date.getDay();
    const date = info.date.getDate();
    // console.log(dayOfWeek);

    console.log("textColor ", this.textColor);
    console.log("btnAndLinkColor ", this.btnAndLinkColor);



    for (let i = 0; i < this.nonWorkingDays.length; i++) {
      console.log("this.nonWorkingDays ", this.nonWorkingDays);

      if (dayOfWeek === this.nonWorkingDays[i]) {
        if (this.textColor == 'black' || this.textColor == '#000000') {
          return { html: `<div style="color: grey;">` + date + '</div>' };
        }
        else {
          return { html: `<div style="color: ${this.textColor}">` + date + '</div>' };
        }
      }
    }
    if (this.isPastDate(info.date)) {
      if (this.textColor == 'black' || this.textColor == '#000000') {
        return { html: `<div style="color: grey;">` + date + '</div>' };
      }
      else {
        return { html: `<div style="color: ${this.textColor}">` + date + '</div>' };
      }
    }
    else {
      return { html: `<div style="color: ${this.btnAndLinkColor}; font-weight: bold">` + date + '</div>' };

    }



  }
  // ----------theDayCellContent ends------------




  // ---------------onDateClick new starts---------------

  onDateClick(res: any) {


    this.displayTimeDiv = true
    console.log('Clicked on date : ' + res.dateStr); //2024-02-13


    this.dateSelected = res.dateStr


    // todays date and time starts
    let todaysdateIs = new Date();
    console.log(todaysdateIs);
    const day = String(todaysdateIs.getDate()).padStart(2, '0');
    const month = String(todaysdateIs.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = todaysdateIs.getFullYear();
    let todaysdate = `${year}-${month}-${day}`; // e.g., "2024-07-25"
    console.log("todaysdate == this.dateSelected", todaysdate == this.dateSelected);


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currentTime = `${hours}:${minutes}`;
    console.log("currentTime ", currentTime);

    // todays date and time ends

    let returnOffindHowManyEventsAreAlreadyBookedFnctn;
    console.log("this.noOfMeetingsAllowedPerDay ", this.noOfMeetingsAllowedPerDay);


    console.log("this.noOfMeetingsAllowedPerDay.status ", this.noOfMeetingsAllowedPerDay.status);

    if (this.noOfMeetingsAllowedPerDay.status) {
      returnOffindHowManyEventsAreAlreadyBookedFnctn = this.findHowManyEventsAreAlreadyBookedOnThatDay(res.dateStr)
    }

    console.log("returnOffindHowManyEventsAreAlreadyBookedFnctn ", returnOffindHowManyEventsAreAlreadyBookedFnctn);


    if (returnOffindHowManyEventsAreAlreadyBookedFnctn) {
      this.userAvailaibleArray = []
    }
    else if (!returnOffindHowManyEventsAreAlreadyBookedFnctn) {

      this.currentDate = new Date();
      console.log("currentDate ", this.currentDate); //Mon Feb 19 2024 12:38:05 GMT+0530 (India Standard Time)create-meeting.component.ts:238
      this.currentformattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'); //2024-02-19
      console.log("currentformattedDate ", this.currentformattedDate);

      //if selected date is earlier than today's date
      if (res.dateStr < this.currentformattedDate) {
        alert('Please select a date on or after today.')
        this.displayTimeDiv = false
      }
      else {//if selected date is on or later than today's date
        console.log("res ", res)
        const selectedDay = res.date.getDay();

        if (selectedDay == 0) {
          this.selectedDayName = "Sunday"
        }
        else if (selectedDay == 1) {
          this.selectedDayName = "Monday"
        }
        else if (selectedDay == 2) {
          this.selectedDayName = "Tuesday"
        }
        else if (selectedDay == 3) {
          this.selectedDayName = "Wednesday"
        }
        else if (selectedDay == 4) {
          this.selectedDayName = "Thursday"
        }
        else if (selectedDay == 5) {
          this.selectedDayName = "Friday"
        }
        else if (selectedDay == 6) {
          this.selectedDayName = "Saturday"
        }

        const selectedDateis = res.dateStr;
        console.log("selectedDate ", selectedDateis);


        console.log(selectedDateis[5]);
        console.log(selectedDateis[6]);

        if (selectedDateis[5] == 0 && selectedDateis[6] == 1) { //i.e like month is 01
          this.selectedMonth = "January"
        }
        else if (selectedDateis[5] == 0 && selectedDateis[6] == 2) {//i.e like month is 02
          this.selectedMonth = "February"
        }
        else if (selectedDateis[6] == 3) {//i.e like month is 03
          this.selectedMonth = "March"
        }
        else if (selectedDateis[6] == 4) {
          this.selectedMonth = "April"
        }
        else if (selectedDateis[6] == 5) {
          this.selectedMonth = "May"
        }
        else if (selectedDateis[6] == 6) {
          this.selectedMonth = "June"
        }
        else if (selectedDateis[6] == 7) {
          this.selectedMonth = "July"
        }
        else if (selectedDateis[6] == 8) {
          this.selectedMonth = "August"
        }
        else if (selectedDateis[6] == 9) {
          this.selectedMonth = "September"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 0) {
          this.selectedMonth = "October"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 1) {
          this.selectedMonth = "November"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 2) {
          this.selectedMonth = "December"
        }

        console.log(this.selectedDayName, this.selectedMonth, this.dateSelected);



        const selectedDate = res.dateStr;
        this.subscription = this.apiService.userUnavailabelOnArray$.subscribe((userUnavailabelOnArray$) => {

          console.log("array ", userUnavailabelOnArray$);
        });

        let selectedNonWorkingDay = false
        for (let i = 0; i < this.nonWorkingDays.length; i++) {
          if (selectedDay == this.nonWorkingDays[i]) {
            selectedNonWorkingDay = true
            this.displayTimeDiv = false;
            alert('User unavailable on this day!');
            return;
          }
        }


        if (selectedNonWorkingDay == false) {
          this.displayTimeDiv = true;
          this.dateSelected = res.dateStr


          for (let key in this.workingHrsAsPerDays) {
            if (selectedDay == key) {
              this.workingHrStart = this.workingHrsAsPerDays[key].start
              this.workingHrEnd = this.workingHrsAsPerDays[key].end
            }
          }

          let workingHrStart = this.workingHrStart //09:00:00
          let workingHrEnd = this.workingHrEnd //17:00:00

          console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);


          let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`) //9
          let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`) //0
          console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);

          let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`) //17
          let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`) //0
          console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

          let allTimesArray = []

          let timeStr = workingHrStart //09:00:00

          allTimesArray.push(timeStr)


          console.log("workingStartHours ", workingStartHours, typeof workingStartHours);
          console.log("workingEndHours ", workingEndHours, typeof workingEndHours);
          console.log("workingStartMinutes ", workingStartMinutes, typeof workingStartMinutes);
          console.log("workingEndMinutes ", workingEndMinutes, typeof workingEndMinutes);


          console.log(workingStartHours <= workingEndHours);
          console.log(typeof workingEndHours);


          // allTimesArray = ['09:00:00']

          //9               <    17
          while (workingStartHours < workingEndHours) {
            console.log("inside while ");

            // console.log("workingStartHours 278 ",workingStartHours, typeof workingStartHours);
            // console.log("workingEndHours 279 ",workingEndHours, typeof workingEndHours);
            // console.log("workingStartMinutes 280 ",workingStartMinutes, typeof workingStartMinutes);
            // console.log("workingEndMinutes 281 ",workingEndMinutes, typeof workingEndMinutes);

            // console.log("this.duration.minutes 283 ",this.duration["minutes"], typeof this.duration["minutes"]);
            // console.log("this.duration 284 ",this.duration, typeof this.duration);


            workingStartHours = workingStartHours + Number(this.duration.hrs)
            workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
            console.log("workingStartHours 287 ", workingStartHours, typeof workingStartHours);
            console.log("workingStartMinutes 288 ", workingStartMinutes, typeof workingStartMinutes);

            if (workingStartMinutes >= 60) {
              workingStartHours = workingStartHours + Math.floor(workingStartMinutes / 60)
              workingStartMinutes = workingStartMinutes - 60 * (Math.floor(workingStartMinutes / 60))
            }

            // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
            // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

            // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);


            //buulding timestring properly because it is a string
            if (workingStartHours < 10) {
              if (workingStartMinutes < 10) {
                timeStr = `0${workingStartHours}:0${workingStartMinutes}`
              }
              else {
                timeStr = `0${workingStartHours}:${workingStartMinutes}`
              }
            }
            else {
              if (workingStartMinutes < 10) {
                timeStr = `${workingStartHours}:0${workingStartMinutes}`
              }
              else {
                timeStr = `${workingStartHours}:${workingStartMinutes}`
              }
            }

            allTimesArray.push(timeStr)

          }

          console.log("allTimesArray ", allTimesArray);
          this.allTimesArray = allTimesArray



          // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']

          let usersBookedTimes = []
          let usersBookedEndTimes = []
          let usersBookedStartTimesForThisEvent = []
          let usersBookedEndTimesForThisEvent = []

          let eventDate = ""

          console.log("Checking Events after date click ", this.Events);

          //  [ {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-18T09:30:00+05:30",start: "2019-01-18T09:00:00+05:30"},
          // {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-19T09:30:00+05:30",start: "2019-01-19T09:00:00+05:30"}]



          console.log("this.Events ", this.Events);


          for (let i = 0; i < this.Events.length; i++) {
            let obj = this.Events[i]
            console.log("obj ", obj);

            eventDate = obj['start'].split('T')[0] //2019-01-18
            console.log("eventDate ", eventDate);

            console.log("eventDate ", eventDate, "this.dateSelected ", this.dateSelected, eventDate == this.dateSelected);

            if (eventDate == this.dateSelected) {

              if (this.evType == "Group") {//for grp events, even if a time slot is booked, i am not pushing it in booked slots so as to maintain count of each time and to accordingly show whether to show that time or not

                if (obj['bookedForWhichEvId']) {
                  if (obj['bookedForWhichEvId'] != this.evId) {
                    let bookedForWhichEvId = obj['bookedForWhichEvId']
                    let eventStartTime = obj['start'].split('T')[1] //09:00:00
                    let eventEndTime = obj['end'].split('T')[1]
                    // let eventStartTime = time.split('+')[0] //09:00:00
                    console.log("eventStartTime ", eventStartTime);
                    console.log("eventEndTime ", eventEndTime);

                    usersBookedTimes.push({ eventStartTime, bookedForWhichEvId })
                    usersBookedEndTimes.push({ eventEndTime, bookedForWhichEvId })
                  }
                  else {
                    let eventStartTime = obj['start'].split('T')[1] //09:00:00
                    let eventEndTime = obj['end'].split('T')[1]
                    // let eventStartTime = time.split('+')[0] //09:00:00
                    console.log("eventStartTime ", eventStartTime);
                    console.log("eventEndTime ", eventEndTime);

                    usersBookedStartTimesForThisEvent.push({ eventStartTime, bookedForWhichEvId: obj['bookedForWhichEvId'] })
                    usersBookedEndTimesForThisEvent.push({ eventEndTime, bookedForWhichEvId: obj['bookedForWhichEvId'] })
                  }
                }
              }
              else {
                let eventStartTime = obj['start'].split('T')[1] //09:00:00
                let eventEndTime = obj['end'].split('T')[1]
                // let eventStartTime = time.split('+')[0] //09:00:00
                console.log("eventStartTime ", eventStartTime);
                console.log("eventEndTime ", eventEndTime);


                usersBookedTimes.push({ eventStartTime })
                usersBookedEndTimes.push({ eventEndTime })
              }
            }
          }
          console.log("usersBookedTimes ", usersBookedTimes);


          console.log("evType is ", this.evType);



          if (this.evType == "One-on-One") {
            function filterBookedTimes(allTimesArray, userBookedStartTimesArray, userBookedEndTimesArray) {
              // Function to convert time string "HH:MM" to minutes since midnight
              function timeToMinutes(time) {
                let [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
              }

              // Convert all times to minutes
              let allTimesInMinutes = allTimesArray.map(timeToMinutes);
              let bookedStartTimesInMinutes = userBookedStartTimesArray.map(item => timeToMinutes(item.eventStartTime));
              let bookedEndTimesInMinutes = userBookedEndTimesArray.map(item => timeToMinutes(item.eventEndTime));

              // Function to check if a time is within any booked interval
              function isBooked(time) {
                for (let i = 0; i < bookedStartTimesInMinutes.length; i++) {
                  if (time >= bookedStartTimesInMinutes[i] && time < bookedEndTimesInMinutes[i]) {
                    return true;
                  }
                }
                return false;
              }

              // Filter out the times that are within the booked intervals
              let filteredTimesInMinutes = allTimesInMinutes.filter(time => !isBooked(time));

              // Convert the filtered times back to "HH:MM" format
              function minutesToTime(minutes) {
                let hours = Math.floor(minutes / 60).toString().padStart(2, '0');
                let mins = (minutes % 60).toString().padStart(2, '0');
                return `${hours}:${mins}`;
              }

              return filteredTimesInMinutes.map(minutesToTime);
            }

            let usersAvailaibleTimes = filterBookedTimes(allTimesArray, usersBookedTimes, usersBookedEndTimes);
            console.log(usersAvailaibleTimes);
            // ===========================================

            if (this.minTimeReqBeforeScheduling.status == true) {
              this.setTimesAsPerMinNotice(usersAvailaibleTimes, selectedDate)
            }
            else {
              if (todaysdate == this.dateSelected) {
                usersAvailaibleTimes = usersAvailaibleTimes.filter(time => time >= currentTime)
              }
              console.log('newArr ', usersAvailaibleTimes);

              this.userAvailaibleArray = usersAvailaibleTimes;
              this.userAvailaibleArray24 = usersAvailaibleTimes
              this.convertTo12HourFormat();

            }

            console.log("this.userAvailaibleArray ", this.userAvailaibleArray);
          }



          else if (this.evType == "Group") {
            function filterBookedTimes(
              allTimesArray,
              userBookedStartTimesArray,
              userBookedEndTimesArray,
              usersBookedStartTimesForThisEvent,
              usersBookedEndTimesForThisEvent,
              maxBookings
            ) {
              // Function to convert time string "HH:MM" to minutes since midnight
              function timeToMinutes(time) {
                let [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
              }

              // Function to convert minutes since midnight back to time string "HH:MM"
              function minutesToTime(minutes) {
                let hours = Math.floor(minutes / 60).toString().padStart(2, "0");
                let mins = (minutes % 60).toString().padStart(2, "0");
                return `${hours}:${mins}`;
              }

              // Convert all times to minutes
              let allTimesInMinutes = allTimesArray.map(timeToMinutes);
              let bookedStartTimesInMinutes = userBookedStartTimesArray.map((item) =>
                timeToMinutes(item.eventStartTime)
              );
              let bookedEndTimesInMinutes = userBookedEndTimesArray.map((item) =>
                timeToMinutes(item.eventEndTime)
              );
              let eventStartTimesInMinutes = usersBookedStartTimesForThisEvent.map((item) =>
                timeToMinutes(item.eventStartTime)
              );
              let eventEndTimesInMinutes = usersBookedEndTimesForThisEvent.map((item) =>
                timeToMinutes(item.eventEndTime)
              );

              // Initialize a dictionary to keep track of bookings
              let bookingCount = {};

              console.log("usersBookedStartTimesForThisEvent ", usersBookedStartTimesForThisEvent);

              // {
              //     "eventStartTime": "09:00:00+05:30",
              //     "bookedForWhichEvId": "66e279872254e904e0003093"
              // }
              usersBookedStartTimesForThisEvent.forEach((item) => {
                item.eventStartTime = item.eventStartTime.split("+")[0]
                item.eventStartTime = `${item.eventStartTime[0]}${item.eventStartTime[1]}${item.eventStartTime[2]}${item.eventStartTime[3]}${item.eventStartTime[4]}`
                if (bookingCount[item.eventStartTime]) {
                  console.log("in if");

                  bookingCount[item.eventStartTime]++;
                } else {
                  console.log("in else");

                  bookingCount[item.eventStartTime] = 1;
                }
              });

              console.log("bookingCount ", bookingCount);


              // Function to check if a time is within any booked interval
              function isBooked(time) {
                for (let i = 0; i < bookedStartTimesInMinutes.length; i++) {
                  if (time >= bookedStartTimesInMinutes[i] && time < bookedEndTimesInMinutes[i]) {
                    return true;
                  }
                }
                return false;
              }

              // Function to check if a time is within any fully booked interval for the event
              function isFullyBookedForEvent(time) {
                for (let i = 0; i < eventStartTimesInMinutes.length; i++) {
                  if (
                    bookingCount[minutesToTime(eventStartTimesInMinutes[i])] >= maxBookings &&
                    time >= eventStartTimesInMinutes[i] &&
                    time < eventEndTimesInMinutes[i]
                  ) {
                    return true;
                  }
                }
                return false;
              }

              // Filter out the times that are within the booked intervals or fully booked intervals for the event
              let filteredTimesInMinutes = allTimesInMinutes.filter(
                (time) => !isBooked(time) && !isFullyBookedForEvent(time)
              );

              // Convert the filtered times back to "HH:MM" format
              return filteredTimesInMinutes.map((timeInMinutes) => {
                let time = minutesToTime(timeInMinutes);
                console.log("time ", time);
                // "09:00:00" ==> "09:00"
                console.log("bookingCount ", bookingCount);

                console.log("checking if same ", time, bookingCount[time]);


                let remainingBookings = maxBookings - (bookingCount[time] || 0);
                console.log("remainingBookings ", remainingBookings);

                return { time, remainingBookings };
              });
            }

            let usersAvailaibleTimes = filterBookedTimes(
              allTimesArray,
              usersBookedTimes,
              usersBookedEndTimes,
              usersBookedStartTimesForThisEvent,
              usersBookedEndTimesForThisEvent,
              this.noOfBookingsAllowedForAParticularTimeInGrpEvent
            );
            console.log("line 1344", usersAvailaibleTimes);
            console.log(usersBookedStartTimesForThisEvent, usersBookedEndTimesForThisEvent);

            // =============================

            if (this.minTimeReqBeforeScheduling.status == true) {
              this.setTimesAsPerMinNotice(usersAvailaibleTimes, selectedDate);
            } else {
              this.userAvailaibleArray = usersAvailaibleTimes;
              this.userAvailaibleArray24 = usersAvailaibleTimes
              this.convertTo12HourFormat();
            }

            console.log("this.userAvailaibleArray ", this.userAvailaibleArray);
          }
        }
      }
    }
  }

  // ---------------onDateClick new ends---------------


  // ==========noOfMeetingsAllowedPerDayFUnctn Starts=======

  findHowManyEventsAreAlreadyBookedOnThatDay(selectedDate) {


    console.log("meetingsOfOnlyThisEvent ", this.meetingsOfOnlyThisEvent);
    let count = 0
    for (let i = 0; i < this.meetingsOfOnlyThisEvent.length; i++) {
      let oneMeet = this.meetingsOfOnlyThisEvent[i]
      let meetDate = oneMeet.start.split("T")[0]


      if (meetDate == selectedDate) {
        count++
      }
    }

    console.log("count ", count);
    console.log(count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed);

    if (count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed) {
      // this.userAvailaibleArray = []

      return true
    }
    else {
      return false
    }
  }

  // ==========noOfMeetingsAllowedPerDayFUnctn Ends=======


  // =====================setActiveDaysAsPerUserReq==================================
  setActiveDaysAsPerUserReq() {

    // =========remove this in future==================
    // this.allowInviteesToScheduleOn.withinDateRange.status = false
    // this.allowInviteesToScheduleOn.days.status = true
    // this.allowInviteesToScheduleOn.days.noOfDays = 12
    // this.allowInviteesToScheduleOn.days.allDays = false
    // this.allowInviteesToScheduleOn.days.onlyWeekDays = true
    // ===================================================

    console.log(" ffffff this.allowInviteesToScheduleOn", this.allowInviteesToScheduleOn);


    if (this.allowInviteesToScheduleOn.days.status) {

      // ----------for all days starts:
      if (this.allowInviteesToScheduleOn.days.allDays) {
        const today = new Date();
        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays); // Set the date to given days from today

        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
        // this.calendarOptions.dayCellClassNames = this.customizeDayClassNames.bind(this)
        // this.calendarOptions.dayCellDidMount = this.customizeDayMount.bind(this)
      }
      // ----------for all days ends:
      // ----------for only week days starts :

      else if (this.allowInviteesToScheduleOn.days.onlyWeekDays) {
        let today = new Date();
        console.log("initial today ", today);

        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays - 1); // Set the date to given days from today

        console.log("initial givenDaysLater ", givenDaysLater);

        let p1 = new Date()
        let p2 = givenDaysLater

        console.log("p1, p2 ", p1, p2);

        while (p1 <= p2) {

          let dayOfP1 = p1.getDay()
          if (dayOfP1 != 0 && dayOfP1 != 6) {
            p1.setDate(p1.getDate() + 1);
          }
          else {
            p1.setDate(p1.getDate() + 1);
            p2.setDate(p2.getDate() + 1);
          }
        }

        console.log("p1, p2 ", p1, p2);

        givenDaysLater.setDate(p2.getDate() + 1); // +1 coz calendar excludes the last date
        console.log("new givenDaysLater ", givenDaysLater);


        console.log("today ", today);
        today = new Date();

        console.log("ending ", givenDaysLater);
        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
      }
    }

    //======= if user has specified date Range starts===
    else if (this.allowInviteesToScheduleOn.withinDateRange.status) {

      let end = this.allowInviteesToScheduleOn.withinDateRange.end

      console.log("endDate ", end);
      let endDateInDateForm = new Date(end)
      console.log("endDateInDateForm ", endDateInDateForm);

      endDateInDateForm.setDate(endDateInDateForm.getDate() + 1);
      console.log("endDateInDateForm ", endDateInDateForm);

      let endDateAfterAddition, year, month, day;

      year = endDateInDateForm.getFullYear();
      month = ('0' + (endDateInDateForm.getMonth() + 1)).slice(-2);
      day = ('0' + endDateInDateForm.getDate()).slice(-2);
      endDateAfterAddition = `${year}-${month}-${day}`;


      this.calendarOptions.validRange = {
        start: this.allowInviteesToScheduleOn.withinDateRange.start,
        end: endDateAfterAddition
      }

    }
  }
  // ==========setActiveDaysAsPerUserReq ends=====================

  // ===========setTimesAsPerMinNotice starts=====================
  setTimesAsPerMinNotice(userAvailaibleArray, selectedDate) {



    console.log("this.minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);

    // todays date and time starts
    let todaysdateIs = new Date();
    console.log(todaysdateIs);
    const day = String(todaysdateIs.getDate()).padStart(2, '0');
    const month = String(todaysdateIs.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = todaysdateIs.getFullYear();
    let todaysdate = `${year}-${month}-${day}`; // e.g., "2024-07-25"
    console.log("todaysdate == this.dateSelected", todaysdate == this.dateSelected);


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currentTime = `${hours}:${minutes}`;
    console.log("currentTime ", currentTime);

    // todays date and time ends


    if (this.minTimeReqBeforeScheduling.status) {
      console.log("this.minTimeReqBeforeScheduling.status is true ");


      if (this.minTimeReqBeforeScheduling.hrs.status) {
        console.log("this.minTimeReqBeforeScheduling.hrs.status is true ");
        console.log("asked hrs ", this.minTimeReqBeforeScheduling.hrs.noOfHrs);


        // console.log("userAvailaibleArray ", userAvailaibleArray);
        //  ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00']
        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInHours >= this.minTimeReqBeforeScheduling.hrs.noOfHrs) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        if (todaysdate == this.dateSelected) {
          timesArray = timesArray.filter(time => time >= currentTime)
        }
        console.log('newArr ', timesArray);


        this.userAvailaibleArray = timesArray
        this.userAvailaibleArray24 = timesArray
        this.convertTo12HourFormat();
      }
      else if (this.minTimeReqBeforeScheduling.mins.status) {

        console.log("this.minTimeReqBeforeScheduling.mins.status is true");


        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInMinutes >= this.minTimeReqBeforeScheduling.mins.noOfMins) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        if (todaysdate == this.dateSelected) {
          timesArray = timesArray.filter(time => time >= currentTime)
        }
        console.log('newArr ', timesArray);

        this.userAvailaibleArray = timesArray
        this.userAvailaibleArray24 = timesArray
        this.convertTo12HourFormat();
      }
      else {
        console.log("this.minTimeReqBeforeScheduling.days.status is true");

        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInDays >= this.minTimeReqBeforeScheduling.days.noOfDays) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        if (todaysdate == this.dateSelected) {
          timesArray = timesArray.filter(time => time >= currentTime)
        }
        console.log('newArr ', timesArray);

        this.userAvailaibleArray = timesArray
        this.userAvailaibleArray24 = timesArray
        this.convertTo12HourFormat();
      }
    }

  }
  // ===========setTimesAsPerMinNotice ends=======================






  // ---------------changeDisplayTimeDiv starts---------------
  changeDisplayTimeDiv() {
    this.displayTimeDiv = false
  }
  // ---------------changeDisplayTimeDiv ends---------------


  // ---------------createEvent starts---------------
  createEvent(eventName) {
    this.loading = true
    console.log("called createEvent");
    console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
    // df sds 10:00:00 2024-01-05
    // ---hardcoding endTime------
    // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
    let allTimesArray = this.allTimesArray
    let endTime = ""
    for (let i = 0; i < allTimesArray.length; i++) {
      if (allTimesArray[i] == this.timeSelected) {
        endTime = allTimesArray[i + 1]
        break;
      }

    }
    console.log("user ", this.userName, "userEmail ", this.emailId);
    if (eventName != "" && this.timeSelected != "" && this.dateSelected != "") {
      let event = {
        "title": eventName,
        "start": `${this.dateSelected}T${this.timeSelected}`,
        "end": `${this.dateSelected}T${endTime}`,
        "user": this.userName,
        "userEmail": this.emailId
      }
      this.apiService.scheduleMeetByCalendarLink(event).subscribe((response) => {
        console.log("meeting deets", response);
        console.log("response ", response);
        this.loading = false
        if (response && response['message']) {
          console.log("response ", response);
          alert(response['message']);
          window.location.reload();

        }
        else {
          this.loading = false
          alert(response['message'])
          console.error('Invalid response:', response);
          // Handle the error or show an appropriate message
        }
      })
    }
    else {
      this.loading = false
      alert("PLease fill event Name and select the meeting time.")
    }
  }
  // ------createEvent ends-----------


  // ---------------setEventTime starts---------------

  setEventTime(time) {
    console.log("timeSelected ", this.timeSelected);
    this.timeSelected = time
    console.log("timeSelected ", this.timeSelected);
    this.showNext = true
    this.showNextFor = time
  }
  // ---------------setEventTime ends---------------



  // --------------------------------------------------

  nextButton(evName, evDurHrs, evDurMins, oneTime) {

    console.log('oneTime ', oneTime);

    let time24
    let startTimeWdTimeZoneOffset
    let endTimeWdTimeZoneOffset

    if (this.evType == 'One-on-One') {
      time24 = this.userAvailaibleArray24[this.userAvailaibleArray.indexOf(oneTime)];
      console.log('Selected time in 24-hour format:', time24);

      startTimeWdTimeZoneOffset = `${this.dateSelected}T${time24}:00`
      startTimeWdTimeZoneOffset = moment.tz(startTimeWdTimeZoneOffset, this.selectedTimeZone).format();
      console.log('startTimeWdTimeZoneOffset ', startTimeWdTimeZoneOffset);

    }
    else {
      const index = this.userAvailaibleArray.findIndex(item => item.time === oneTime);
      console.log("index ", index);

      time24 = index !== -1 ? this.userAvailaibleArray24[index]['time'] : null; // Handle case where time is not found
      console.log('time24 ', time24);

      startTimeWdTimeZoneOffset = `${this.dateSelected}T${time24}:00`
      startTimeWdTimeZoneOffset = moment.tz(startTimeWdTimeZoneOffset, this.selectedTimeZone).format();
      console.log('startTimeWdTimeZoneOffset ', startTimeWdTimeZoneOffset);

      // time24 = this.userAvailaibleArray24[this.userAvailaibleArray.indexOf(oneTime)];
      console.log('Selected time in 24-hour format:', time24);
    }

    localStorage.setItem("nameWhoseCalendar", this.nameWhoseCalendar)
    localStorage.setItem("evName", evName)
    localStorage.setItem("evDurHrs", evDurHrs)//  0
    localStorage.setItem("evDurMins", evDurMins) //30
    localStorage.setItem("oneTime", time24) //09:00:00
    localStorage.setItem("day", this.selectedDayName)
    localStorage.setItem("date", this.dateSelected)
    localStorage.setItem("month", this.selectedMonth)
    localStorage.setItem("evType", this.evType)
    localStorage.setItem("allowInviteesToAddGuests", JSON.stringify(this.allowInviteesToAddGuests))
    localStorage.setItem("lastNameRequired", this.lastNameRequired)
    localStorage.setItem('redirectTo', JSON.stringify(this.redirectTo))
    localStorage.setItem('startTimeWdTimeZoneOffset', startTimeWdTimeZoneOffset)
    localStorage.setItem('selectedTimeZone', this.selectedTimeZone)

    console.log("since time24 is ", time24);

    console.log(time24[0], time24[1], time24[3], time24[4]);

    let hrs = Number(time24[0] + time24[1]) //09
    let mins = Number(time24[3] + time24[4]) //00

    console.log("hrs, mins", hrs, mins);

    // workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
    // workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))

    let endTimeHrs = Number(hrs + Number(evDurHrs))  //9 + 0 = 9
    let endTimeMins = Number(mins + Number(evDurMins)) //0 + 30 = 30
    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    if (endTimeMins >= 60) {
      endTimeHrs = endTimeHrs + Math.floor(endTimeMins / 60)
      endTimeMins = endTimeMins - 60 * (Math.floor(endTimeMins / 60))
    }

    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    let endTime;
    if (endTimeMins == 0) {
      if (endTimeHrs == 0) {
        endTime = `00:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:00`
      }
      else {
        endTime = `${endTimeHrs}:00`
      }
      // endTime = `${endTimeHrs}:00:00`
    }
    else if (endTimeMins < 10) {
      if (endTimeHrs == 0) {
        endTime = `00:0${endTimeMins}`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:0${endTimeMins}`
      }
      else {
        endTime = `${endTimeHrs}:0${endTimeMins}`
      }
      // endTime = `${endTimeHrs}:0${endTimeMins}:00`
    }
    else {
      if (endTimeHrs == 0) {
        endTime = `00:${endTimeMins}`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:${endTimeMins}`
      }
      else {
        endTime = `${endTimeHrs}:${endTimeMins}`
      }
      // endTime = `${endTimeHrs}:${endTimeMins}:00`
    }

    endTimeWdTimeZoneOffset = `${this.dateSelected}T${endTime}:00`
    endTimeWdTimeZoneOffset = moment.tz(endTimeWdTimeZoneOffset, this.selectedTimeZone).format();
    console.log('endTimeWdTimeZoneOffset ', endTimeWdTimeZoneOffset);


    localStorage.setItem("endTime", endTime)
    localStorage.setItem('endTimeWdTimeZoneOffset', endTimeWdTimeZoneOffset)

    this.router.navigate(['/makeMeeting'])

  }
}

