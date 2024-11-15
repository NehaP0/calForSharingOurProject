// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-rescheduling-form',
  templateUrl: './rescheduling-form.component.html',
  styleUrl: './rescheduling-form.component.css'
})
export class ReschedulingFormComponent implements OnInit {

  constructor(private apiService: APIService, private router: Router, private formBuilder: FormBuilder) { }

  nameWhoseCalendar = ''
  emailId = ''
  meetId = ''
  evName = '';
  evType = '';
  evDurHrs = '';
  evDurMins = '';
  selectedTimeZone = 'Indian Standard Time'
  startTime = '';
  startTimeWdTimeZoneOffset = ''
  endTime = '';
  endTimeWdTimeZoneOffset = ''
  day = '';
  month = '';
  date = '';
  contactsArr = []
  subscription:any

  oldStTime:String
  oldEndTime:String
  oldStDateDay:String

  newStTime:String
  newEndTime:String
  newStDateDay:String

  reschedVariables:any

  userForm: FormGroup;


  ngOnInit() {

    this.userForm = this.formBuilder.group(
      {
        guests: '',
        reason: ''
      }
    );

    this.apiService.reschedVariables$.subscribe(obj => {
      this.reschedVariables = obj;
    });

    console.log('this.reschedVariables ', this.reschedVariables);


    this.evDurHrs = this.reschedVariables.duratnForResched.split(':')[0]
    this.evDurMins = this.reschedVariables.duratnForResched.split(':')[1]

    console.log(this.reschedVariables.evNameForResched);

    // Check if there are other values in guestsForResched besides the first one
    let guestsList = '';
    if (this.reschedVariables.guestsForResched.length > 1) {
      guestsList = this.reschedVariables.guestsForResched.slice(1).join(', ');
    }
    this.userForm.patchValue({ guests: guestsList });

    this.oldStTime =  this.givemeTimeFormat(this.reschedVariables.oldStDateTimeDayForResched)
    this.oldEndTime = this.givemeTimeFormat(this.reschedVariables.oldEndDateTimeDayForResched)
    this.oldStDateDay = this.givemeDateInDayFormat(this.reschedVariables.oldEndDateTimeDayForResched)

    this.newStTime = this.givemeTimeFormat(this.reschedVariables.newStDateTimeDayForResched)
    this.newEndTime = this.givemeTimeFormat(this.reschedVariables.newEndDateTimeDayForResched)
    this.newStDateDay = this.givemeDateInDayFormat(this.reschedVariables.newStDateTimeDayForResched)

  }


// Function to get formatted date without time
givemeDateInDayFormat(dateTimeStr: string): string {
  let date = new Date(dateTimeStr);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  };

  // Format the date without time
  return date.toLocaleDateString('en-US', options);
}

// Function to get formatted time only
givemeTimeFormat(dateTimeStr: string): string {
  let date = new Date(dateTimeStr);

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };

  // Format the time only
  return date.toLocaleTimeString('en-US', options);
}







  formSubmit() {
    console.log("userform is ", this.userForm.value);

    console.log('from submitted');


    let otherEmails = [];
    console.log('Guests ', this.userForm.value.guests);
    if (this.userForm.value.guests) {
      let otherEmailsString = this.userForm.value.guests;
      otherEmails = otherEmailsString.split(/,| /); //splits wherever there is comma or space
    }

    let reqGuests = [this.reschedVariables.guestsForResched[0]]

    otherEmails.forEach((item:any) => {
      if (!reqGuests.includes(item)) {
        reqGuests.push(item);
      }
    });

    console.log('reqGuests ', reqGuests);


    let meet = {
      start: this.reschedVariables.newStDateTimeDayForResched,
      end: this.reschedVariables.newEndDateTimeDayForResched,
      guests: reqGuests,
      meetId: this.reschedVariables.meetIdForResched,
      eventId : this.reschedVariables.evIdForResched,
      evName : this.reschedVariables.evNameForResched,
      emailIdWhoResched : this.reschedVariables.emailIdForResched,
      uidOfCalOwner : this.reschedVariables.uidOfCalOwner,
      reason : this.userForm.value.reason,
      inviteeNameForResched: this.reschedVariables.inviteeNameForResched,
      calOwnerNameForResched: this.reschedVariables.calOwnerNameForResched,
      calOwnerEmail : this.reschedVariables.calOwnerEmail,

      oldStTime : this.oldStTime ,
      oldEndTime : this.oldEndTime ,
      oldStDateDay : this.oldStDateDay,

      newStTime : this.newStTime,
      newEndTime : this.newEndTime,
      newStDateDay : this.newStDateDay
    };



    console.log("meet ", meet);


    this.apiService.rescheduleMeet(meet)
      .subscribe((response) => {

        console.log(response);

        let message = response['message']

        if (message == 'Meeting rescheduled.') {
          this.router.navigate(['/thankYouForRescheduling'])
        }
        else {
          alert(message);
        }
      });


  }

}
