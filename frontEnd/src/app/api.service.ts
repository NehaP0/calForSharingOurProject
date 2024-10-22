// @ts-nocheck

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private userNameSubject = new BehaviorSubject<string>('');
  private emailIdSubject = new BehaviorSubject<string>('');
  private eventDateSubject = new BehaviorSubject<string>('');
  private eventTimeSubject = new BehaviorSubject<string>('');
  private meetingArraySubject = new BehaviorSubject<any[]>([]);
  private usersSubject = new BehaviorSubject<object[]>([]);
  private formattedMeetingsSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsHideSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsOfLoggedInUserSubject = new BehaviorSubject<any[]>(
    []
  );
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userLoggedInEmailIdSubject = new BehaviorSubject<string>('');
  private userLoggedInNameSubject = new BehaviorSubject<string>('');
  // private userAvailableOnWeekendsSubject = new BehaviorSubject<boolean>(true);
  private initiallyUserUnavailabelOnArraySubject = new BehaviorSubject<
    number[]
  >([]);
  private userUnavailabelOnArraySubject = new BehaviorSubject<number[]>([0, 6]);
  private userAvailabelOnArraySubject = new BehaviorSubject<number[]>([
    1, 2, 3, 4, 5,
  ]);
  private durationSubject = new BehaviorSubject<object>({
    hrs: 0,
    minutes: 30,
  });
  private workingHrsSubject = new BehaviorSubject<object>({
    1: { start: '09:00:00', end: '17:00:00' },
    2: { start: '09:00:00', end: '17:00:00' },
    3: { start: '09:00:00', end: '17:00:00' },
    4: { start: '09:00:00', end: '17:00:00' },
    5: { start: '09:00:00', end: '17:00:00' },
  });
  private selectedUserAvailabilityObjSubject = new BehaviorSubject<object>({});
  private eventsArraySubject = new BehaviorSubject<object[]>([]);
  private eventTypeSubject = new BehaviorSubject<string>('');
  private getMeetingsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getEventsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getMeetingsOfParticularEventAdminSubject = new BehaviorSubject<any[]>(
    []
  );
  private timesForVotingSubject = new BehaviorSubject<any[]>([]);
  private meetingPollDetailsSubject = new BehaviorSubject<object>({});
  private votingLinkSubject = new BehaviorSubject<string>('');
  private votingArrSubject = new BehaviorSubject<any[]>([]);


  // for create meeting page -----------------------------------------

  private nameSubject = new BehaviorSubject<string>('');
  // const name = params['name'];
  // this.nameWhoseCalendar = name
  private emailIdSubject = new BehaviorSubject<string>('');
  // const id = params['id'];
  // console.log("ng oninit called");
  // this.apiService.setUserName(name);
  // this.apiService.setUserEmailId(id);
  // console.log('Name:', name);
  // console.log('ID:', id);
  private evNameSubject = new BehaviorSubject<string>('');
  // this.evName = params['evName']

  private evDurHrsSubject = new BehaviorSubject<number>(0);
  // this.evDurHrs = Number(params['evDurHrs'])

  private evDurMinsSubject = new BehaviorSubject<number>(0);
  // this.evDurMins = Number(params['evDurMins'])

  private evTypeSubject = new BehaviorSubject<string>('');
  // this.evType = params['evType']

  private imageSubject = new BehaviorSubject<string>('');
  // this.image = params['image']

  private avatarSubject = new BehaviorSubject<string>('');
  // this.avatar = `${this.API_URL}/${params['image']}`

  private allowInviteesToAddGuestsSubject = new BehaviorSubject<boolean>(true)
  private reqEventSubject = new BehaviorSubject<object>({});
  private cloduraBrandingReqSubject = new BehaviorSubject<boolean>


  public name$ = this.nameSubject.asObservable();;
  // const name = params['name'];
  // this.nameWhoseCalendar = name
  public emailId$ = this.emailIdSubject.asObservable();;
  // const id = params['id'];
  // console.log("ng oninit called");
  // this.apiService.setUserName(name);
  // this.apiService.setUserEmailId(id);
  // console.log('Name:', name);
  // console.log('ID:', id);
  public evName$ = this.evNameSubject.asObservable();;
  // this.evName = params['evName']

  public evDurHrs$ = this.evDurHrsSubject.asObservable();;
  // this.evDurHrs = Number(params['evDurHrs'])

  public evDurMins$ = this.evDurMinsSubject.asObservable();;
  // this.evDurMins = Number(params['evDurMins'])

  public evType$ = this.evTypeSubject.asObservable();;
  // this.evType = params['evType']

  public image$ = this.imageSubject.asObservable();;
  // this.image = params['image']

  public avatar$ = this.avatarSubject.asObservable();;

  // for create meeting page ends-----------------------------------



  public userName$ = this.userNameSubject.asObservable();
  public emailId$ = this.emailIdSubject.asObservable();
  public eventDate$ = this.eventDateSubject.asObservable();
  public eventTime$ = this.eventTimeSubject.asObservable();
  public meetingArray$ = this.meetingArraySubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public formattedMeetings$ = this.formattedMeetingsSubject.asObservable();
  public formattedMeetingsHide$ =
    this.formattedMeetingsHideSubject.asObservable();
  public userLoggedIn$ = this.userLoggedInSubject.asObservable();
  public userLoggedInEmailId$ = this.userLoggedInEmailIdSubject.asObservable();
  public formattedMeetingsOfLoggedInUser$ =
    this.formattedMeetingsOfLoggedInUserSubject.asObservable();
  public userLoggedInName$ = this.userLoggedInNameSubject.asObservable();
  // public userAvailableOnWeekends$ = this.userAvailableOnWeekendsSubject.asObservable();
  public userUnavailabelOnArray$ =
    this.userUnavailabelOnArraySubject.asObservable();
  public initiallyUserUnavailabelOnArray$ =
    this.initiallyUserUnavailabelOnArraySubject.asObservable();
  public userAvailabelOnArray$ =
    this.userAvailabelOnArraySubject.asObservable();
  public duration$ = this.durationSubject.asObservable();
  public workingHrs$ = this.workingHrsSubject.asObservable();
  public selectedUserAvailabilityObj$ =
    this.selectedUserAvailabilityObjSubject.asObservable();
  public eventsArray$ = this.eventsArraySubject.asObservable();
  public eventType$ = this.eventTypeSubject.asObservable();
  public getMeetingsforUserToSee$ =
    this.getMeetingsforUserToSeeSubject.asObservable();
  public getEventsforUserToSee$ =
    this.getEventsforUserToSeeSubject.asObservable();
  public getMeetingsOfParticularEventAdmin$ =
    this.getMeetingsOfParticularEventAdminSubject.asObservable();
  public timesForVoting$ = this.timesForVotingSubject.asObservable();
  public meetingPollDetails$ = this.meetingPollDetailsSubject.asObservable();
  public votingLink$ = this.votingLinkSubject.asObservable();
  public votingArr$ = this.votingArrSubject.asObservable();
  public allowInviteesToAddGuests$ = this.allowInviteesToAddGuestsSubject.asObservable();
  public reqEvent$ = this.reqEventSubject.asObservable()
  public cloduraBrandingReq$ = this.cloduraBrandingReqSubject.asObservable()




  API_URL = 'http://localhost:3000';

  private headers: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, private router: Router) { }

  // ===========functions for calSharing start ===========









  async getParticularUserByUid(uid) {//changed

    const response = await this.httpClient.get(`api/meetings/getParticularUserBuUid?uid=${uid}`).toPromise();

    console.log("got user deets ", response['userDeets']);
    let userDeets = response['userDeets']
    this.userSubject.next(userDeets);
    return userDeets
  }

  async getParticularUserEvSchemaDeets(uid) {//changed
    const response = await this.httpClient.get(`api/meetings/getEvSchema?uid=${uid}`).toPromise();

    console.log("got event schema deets ", response['reqEvSchema']);
    let reqEvSchema = response['reqEvSchema']
    return reqEvSchema
  }


  patchContactsArr(emailOfCalendarOwner, contactObj) {
    console.log('patchUserAvailability called');
    console.log("emailOfCalendarOwner ", emailOfCalendarOwner, "contactObj ", contactObj);


    return this.httpClient
      .patch(
        `api/user/updateContactsArr`,
        { emailOfCalendarOwner, contactObj }
      )
      .subscribe(
        (response) => {
          console.log(response);
          console.log(response['message']);
        },
        (error) => {
          console.error(error);
        }
      );
  }



  async setReqDetails(nameWhoseCalendar, emailId, image, evType, evName, evDurMins, evDurHrs, allowInviteesToAddGuests) {//working
    console.log("getReqDetails called in api.service.ts ", nameWhoseCalendar, emailId, image, evType, evName, evDurMins, evDurHrs, allowInviteesToAddGuests);

    try {
      this.nameSubject.next(nameWhoseCalendar)
      this.emailIdSubject.next(emailId)
      this.imageSubject.next(image)
      this.evTypeSubject.next(evType)
      this.evNameSubject.next(evName)
      this.evDurMinsSubject.next(Number(evDurMins))
      this.evDurHrsSubject.next(Number(evDurHrs))
      this.allowInviteesToAddGuestsSubject.next(allowInviteesToAddGuests)


    } catch (error) {
      console.log("err ", error);

    }
  }




  deleteParticularMeet(emailIdOfWhoCancelled, calendarOwnerId, evId, meetId, cancelationReason) {//changed

    return this.httpClient
      .patch(
        `api/meetings/deleteMeet`,
        { emailIdOfWhoCancelled, calendarOwnerId, evId, meetId, cancelationReason }
      )
      .subscribe(
        (response) => {
          console.log(response);
          if (response['message'] == "Deleted") {
            this.router.navigate(['/cancelConfirmed'])
          }
          else {
            alert(response['message']);
          }
        },
        (error) => {
          console.error(error);
        }
      );

  }

  // async callSharableCalendar(userId, evId, eventN){
  //   await this.httpClient.get(`api/meetings/calendarLink/sharable?userId=${userId}&evId=${evId}&eventN=${eventN}`).toPromise();
  // }

  // ===========functions for calSharing end ===========


}
