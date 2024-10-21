// @ts-nocheck

import { Component } from '@angular/core';

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrl: './thankyou-page.component.css'
})
export class ThankyouPageComponent {

  nameWhoseCalendar = localStorage.getItem('nameWhoseCalendar');
  evName = localStorage.getItem('evName');
  evDurHrs = localStorage.getItem('evDurHrs');
  evDurMins = localStorage.getItem('evDurMins');
  selectedTimeZone = 'Indian Standard Time'
  startTime = localStorage.getItem('oneTime');
  endTime = localStorage.getItem('endTime');
  day = localStorage.getItem('day');
  month = localStorage.getItem('month');
  date = localStorage.getItem('date');
  emailOfWhoFilledTheForm = localStorage.getItem('emailOfWhoFilledTheForm')

  backGroundcolor: string = localStorage.getItem('backGroundcolor')
  textColor: string = localStorage.getItem("textColor")
  btnAndLinkColor: string = localStorage.getItem("btnAndLinkColor")


}
