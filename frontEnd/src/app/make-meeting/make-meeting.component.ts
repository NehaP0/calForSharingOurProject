// @ts-nocheck
import { Component, OnInit } from '@angular/core';
// import {FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { APIService } from '../api.service';

@Component({
  selector: 'app-make-meeting',
  templateUrl: './make-meeting.component.html',
  styleUrl: './make-meeting.component.css',
})
export class MakeMeetingComponent implements OnInit {
  constructor(private apiService: APIService, private router: Router, private formBuilder: FormBuilder) { }



  nameWhoseCalendar = localStorage.getItem('nameWhoseCalendar');
  emailId = localStorage.getItem("userEmailId")
  evId = localStorage.getItem("eventId")
  evName = localStorage.getItem('evName');
  evType = localStorage.getItem('evType');
  evDurHrs = localStorage.getItem('evDurHrs');
  evDurMins = localStorage.getItem('evDurMins');
  // selectedTimeZone = localStorage.getItem('selectedTimeZone')
  selectedTimeZone = 'Indian Standard Time'
  startTime = localStorage.getItem('oneTime');
  startTimeWdTimeZoneOffset = localStorage.getItem('startTimeWdTimeZoneOffset')
  endTime = localStorage.getItem('endTime');
  endTimeWdTimeZoneOffset = localStorage.getItem('endTimeWdTimeZoneOffset')
  day = localStorage.getItem('day');
  month = localStorage.getItem('month');
  date = localStorage.getItem('date');
  contactsArr = JSON.parse(localStorage.getItem('contactsArr'))
  cloduraBrandingReq = JSON.parse(localStorage.getItem('cloduraBrandingReq'))

  backGroundcolor: string = localStorage.getItem('backGroundcolor')
  textColor: string = localStorage.getItem("textColor")
  btnAndLinkColor: string = localStorage.getItem("btnAndLinkColor")

  lastNameRequired = JSON.parse(localStorage.getItem('lastNameRequired'))
  allowInviteesToAddGuestsStr = localStorage.getItem('allowInviteesToAddGuests')
  allowInviteesToAddGuests;
  redirectTo = JSON.parse(localStorage.getItem("redirectTo"))
  nameBlank = false;
  emailBlank = false;
  addGuests = false;
  questionsToBeAsked = []
  questionsWdAnswers = []
  lastNameBlank = false
  pasEvntDeetsToRedirectPg
  subscription
  reqEventObj

  oneOnOne = false;
  wait = false
  showWarning = false

  userForm: FormGroup;


  ngOnInit() {


    if (this.evType == 'One-on-One') {
      this.oneOnOne = true;
    }



    this.apiService.getSelectedEvent(this.evId)
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      console.log("reqEventObj ", reqEventObj);

      if (Object.keys(reqEventObj).length > 0) {
        this.questionsToBeAsked = reqEventObj['questionsToBeAsked']
        this.allowInviteesToAddGuests = reqEventObj['allowInviteesToAddGuests']
        console.log("this.questionsToBeAsked ", this.questionsToBeAsked);
        this.questionsWdAnswers = reqEventObj['questionsToBeAsked']
        this.pasEvntDeetsToRedirectPg = reqEventObj['pasEvntDeetsToRedirectPg']
        this.questionsWdAnswers.forEach((obj) => {
          return obj["answer"] = ""
        })
        console.log("this.questionsWdAnswers ", this.questionsWdAnswers);

      }
    })


    this.userForm = this.formBuilder.group(
      {
        firstName: '',
        lastName: '',
        email: '',
        guests: '',
        answer: ''
      }
    );
  }




  addguests() {
    this.addGuests = true;
  }

  formSubmit() {
    console.log("userform is ", this.userForm.value);

    console.log('from submitted');
    console.log("wait before validation ", this.wait);
    let reqQuestionFieldsNotFilled = false

    for (let i = 0; i < this.questionsWdAnswers.length; i++) {
      let obj = this.questionsWdAnswers[i]
      if (obj.answerRequiredOrNot && !obj.answer) {
        reqQuestionFieldsNotFilled = true
      }
    }

    console.log("reqQuestionFieldsNotFilled ", reqQuestionFieldsNotFilled);


    if (this.userForm.value.firstName == '') {
      this.nameBlank = true;
      console.log("Name empty");

    }
    if (this.userForm.value.email == '') {
      this.emailBlank = true;
      console.log("Email empty");

    }
    if (this.lastNameRequired) {
      if (this.userForm.value.lastName == '') {
        this.lastNameBlank = true
        console.log("lastname empty");

      }
    }
    if (reqQuestionFieldsNotFilled == true) {
      this.showWarning = true
      console.log("questions not filled");

    }
    else if (this.userForm.value.firstName && this.userForm.value.email) {
      console.log("in else if");

      if (!reqQuestionFieldsNotFilled) {
        let otherEmails = [];
        console.log('Guests ', this.userForm.value.guests);
        if (this.userForm.value.guests) {
          let otherEmailsString = this.userForm.value.guests;
          otherEmails = otherEmailsString.split(/,| /); //splits wherever there is comma or space

        }

        let meet = {
          title: this.evName,
          start: this.startTimeWdTimeZoneOffset,
          end: this.endTimeWdTimeZoneOffset,
          user: this.userForm.value.firstName,
          userEmail: this.userForm.value.email,
          otherEmails: otherEmails,
          additionalInfo: this.userForm.value.additional,
          evType: this.evType,
          questionsWdAnswers: this.questionsWdAnswers,
          emailOfCalendarOwner: this.emailId,
          evId: this.evId,
          userSurname: this.userForm.value.lastName
        };

        localStorage.setItem('emailOfWhoFilledTheForm', this.userForm.value.email)


        console.log("meet ", meet);

        this.wait = true
        console.log("wait after validation ", this.wait);

        let foundUserInContactsArr = false
        let idOfInvitee = ""
        for (let i = 0; i < this.contactsArr.length; i++) {
          if (this.contactsArr[i].emailID == this.userForm.value.email) {
            foundUserInContactsArr = true
            idOfInvitee = this.contactsArr[i]._id
            break;
          }
        }
        console.log("foundUserInContactsArr ", foundUserInContactsArr, "idOfInvitee ", idOfInvitee);

        if (foundUserInContactsArr == false) {
          idOfInvitee = (Math.floor(Math.random() * 10000000000000001).toString())
        }

        console.log("idOfInvitee ", idOfInvitee);

        let usersFullName = ""
        if (this.userForm.value.lastName) {
          usersFullName = `${meet.user} ${meet.userSurname}`
        }
        else {
          usersFullName = meet.user
        }

        this.apiService.scheduleMeetBymakeMeetingPage(meet)
          .subscribe((response) => {

            console.log(response);
            console.log("wait after result ", this.wait);

            if (response['message'] == 'Meeting scheduled successfully. A calendar invitation will be mailed to the attendees.') {

              if (this.redirectTo.confirmationPage.status == true) {
                this.wait = false
                this.router.navigate(['thankyou']);
              }
              else {
                if (this.pasEvntDeetsToRedirectPg) {
                  let query
                  if (meet.otherEmails.length == 0) {

                    if (meet.userSurname) {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_last_name=${meet.userSurname}&invitee_email=${meet.userEmail}`
                    }
                    else {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_email=${meet.userEmail}`
                    }
                  }
                  else {
                    console.log('inside else, since there are guests');
                    let guestsStr = ""
                    for (let i = 0; i < meet.otherEmails.length; i++) {
                      if (meet.otherEmails[i] != "" && meet.otherEmails[i] != " ") {
                        guestsStr += `&guests=${meet.otherEmails[i]}`
                      }
                    }
                    console.log("guestsStr ", guestsStr);

                    if (meet.userSurname) {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_last_name=${meet.userSurname}&invitee_email=${meet.userEmail}${guestsStr}`
                    }
                    else {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_email=${meet.userEmail}${guestsStr}`
                    }
                  }
                  // ?assigned_to=Clodura.AI&event_type_uuid=103dba2d-2879-4693-98bf-229f6a5b77b8&event_type_name=test&event_start_time=2024-07-17T10%3A00%3A00%2B05%3A30&event_end_time=2024-07-17T10%3A30%3A00%2B05%3A30&invitee_uuid=0a2eebaa-c910-4caf-a1aa-7b17f48f5356&invitee_first_name=Neha&invitee_last_name=p&invitee_email=nehaphadtare334%40gmail.com&guests%5B%5D=nehaphadtare443%40gmail.com&guests%5B%5D=neha.phadtare%40clodura.ai
                  // ?assigned_to=Clodura.AI&event_type_uuid=103dba2d-2879-4693-98bf-229f6a5b77b8&event_type_name=test&event_start_time=2024-07-17T10%3A00%3A00%2B05%3A30&event_end_time=2024-07-17T10%3A30%3A00%2B05%3A30&invitee_uuid=00c08667-5324-4ab8-bbf9-c17b620313b9&invitee_first_name=Neha&invitee_last_name=Phadtare&invitee_email=nehaphadtare334%40gmail.com
                  console.log('query ', query);
                  this.wait = false
                  let link = `${this.redirectTo.externalUrl.link}?${query}`
                  window.location.href = link
                  console.log('link ', link);
                }
                else {
                  this.wait = false
                  let link = this.redirectTo.externalUrl.link
                  window.location.href = link
                }
              }
            }
            else {
              alert(response['message']);
            }
          });


        if (foundUserInContactsArr == false) {
          let contactObj = { name: usersFullName, emailID: meet.userEmail, _id: idOfInvitee }
          this.apiService.patchContactsArr(this.emailId, contactObj)
        }
      }

    }
  }
}
