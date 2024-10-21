// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-cancellation-page',
  templateUrl: './cancellation-page.component.html',
  styleUrl: './cancellation-page.component.css'
})
export class CancellationPageComponent {

  constructor(private route: ActivatedRoute, private router: Router, private apiService:APIService) { }

  private subscription: Subscription;

  API_URL = 'http://localhost:3000'

  emailIdOfWhoCancelled
  evId
  meetId
  calendarOwnerId

  reqEventObj
  evName
  evDurHrs
  evDurMins
  evLocation
  start
  end
  user
  userName
  userAvatar
  image
  avatar
  startstr
  dateStr

  cancelationReason = ""
  showWarning = false
  startTime
  endTime

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params.whoCanceled, params.whoseCalendar, params.eventId, params.meetId);


      this.calendarOwnerId = params.uidOfCalOwner
      this.emailIdOfWhoCancelled = params.whoCanceled
      this.evId = params.eventId
      this.meetId = params.meetId
    })

    this.getParticularEvent()
    this.getParticularUser()

  }


  async getParticularEvent() {
    await this.apiService.getSelectedEvent(this.evId)
    console.log("this.evId ", this.evId);

    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (reqEventObj) {
        console.log("reqEventObj ", reqEventObj);
        if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
          console.log("got reqEventObj ", reqEventObj);
          this.evName = reqEventObj["evName"]
          this.evDurHrs = reqEventObj["evDuration"]["hrs"]
          this.evDurMins = reqEventObj["evDuration"]["minutes"]
          this.evLocation = reqEventObj["evLocation"]


          let reqMeet
          let foundMeet = false

          this.apiService.getParticularMeeting(this.meetId)
          this.subscription = this.apiService.particularMeeting$.subscribe((meet)=>{
            console.log("meet ", meet);
            reqMeet = meet
            if(meet){
              foundMeet = true
            }
          })

          console.log('reqMeet is this ', reqMeet);

          setTimeout(()=>{
            console.log("found", foundMeet);
            console.log('meet in settimeout ', reqMeet);


            if (foundMeet == false) {
              this.router.navigate(['/oops'])
            }
            this.start = reqMeet["start"]
            this.end = reqMeet["end"]

            console.log('this.start ', this.start);

            this.dateStr = this.start.split('T')[0]
            let startstr = this.start.split('T')[1]
            this.startstr = startstr.split('+')[0]
            console.log("startstr ", startstr);
            this.startTime = `${startstr[0]}${startstr[1]}${startstr[2]}${startstr[3]}${startstr[4]}`

            let endstr = this.end.split('T')[1]
            endstr = endstr.split('+')[0]
            console.log("endstr ", endstr);
            this.endTime = `${endstr[0]}${endstr[1]}${endstr[2]}${endstr[3]}${endstr[4]}`
          }, 2500)


        }
      }
    }
  )
  console.log('this.reqEventObj is ', this.reqEventObj);

  if(!this.reqEventObj){
    console.log('since reqEventObj is null');

    console.log('called apiService.getParticularMeeting');

    this.apiService.getParticularMeeting(this.meetId)
    console.log('this.meetId ', this.meetId);

    setTimeout(()=>{
      this.subscription = this.apiService.particularMeeting$.subscribe((meet)=>{

        console.log('meet is ', meet);

          this.reqEventObj = meet
          console.log('this.reqEventObj in else ', this.reqEventObj);

  // 66fa5336f1b4b87a7664553e
          this.evName = meet["evName"]
          // this.evDurHrs = reqEventObj["evDuration"]["hrs"]
          // this.evDurMins = reqEventObj["evDuration"]["minutes"]
          this.evLocation = 'Google Meet'

          this.start = meet["start"]
          this.end = meet["end"]

          console.log('this.start ', this.start);

          this.dateStr = this.start.split('T')[0]
          let startstr = this.start.split('T')[1]
          this.startstr = startstr.split('+')[0]
          console.log("startstr ", startstr);
          this.startTime = `${startstr[0]}${startstr[1]}${startstr[2]}${startstr[3]}${startstr[4]}`

          let endstr = this.end.split('T')[1]
          endstr = endstr.split('+')[0]
          console.log("endstr ", endstr);
          this.endTime = `${endstr[0]}${endstr[1]}${endstr[2]}${endstr[3]}${endstr[4]}`
        })
    },2500)

  }
  }

  async getParticularUser() {
    this.user = await this.apiService.getParticularUserByUid(this.calendarOwnerId)
    this.userName = this.user.name

    console.log("this.user ", this.user);
    console.log('this.userName ', this.userName);



    // this.image = this.user['profileImage'];
    // console.log('image in ts :', this.image);

    // this.avatar = `${this.API_URL}/${this.user['profileImage']}`
    // console.log("avatar ", this.avatar);
  }



  cancelEvent() {
    if (!this.cancelationReason) {
      this.showWarning = true
    }
    else {
      this.showWarning = false
      this.apiService.deleteParticularMeet(this.emailIdOfWhoCancelled, this.calendarOwnerId, this.evId, this.meetId, this.cancelationReason)
    }
  }
}
