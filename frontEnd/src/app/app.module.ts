import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule} from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin


import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
// import { NgxSearchFilterModule } from 'ngx-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgIconsModule } from '@ng-icons/core';
import { heroUsers, heroVideoCamera, heroGlobeAsiaAustralia } from '@ng-icons/heroicons/outline';
// import { IonSettingsOutline, IonCopyOutline, IonSearchOutline, IonLogInOutline, IonMailOpenOutline } from '@ng-icons/ionicons'
// import { BootstrapStars, BootstrapCaretDownFill, BootstrapChevronDown, BootstrapCircleFill, BootstrapPlusCircleFill, BootstrapClock, BootstrapQuestionCircle, BootstrapArrowLeft, BootstrapPencil, BootstrapPeople, BootstrapCameraVideo } from '@ng-icons/bootstrap-icons'
// import { remixUserAddLine, remixCalendar2Line, remixStackshareLine, remixArrowRightSLine, remixDeleteBin6Line } from '@ng-icons/remixicon'
// import { TypAttachmentOutline, TypTick } from '@ng-icons/typicons'
// import { circumRoute } from '@ng-icons/circum-icons'
// // import { octApps, octLocation } from '@ng-icons/octicons'
// import {OctLocation, OctLink} from '@ng-icons/octicons'

// import { iconoirCrown } from '@ng-icons/iconoir';
// import { TablerEdit } from '@ng-icons/tabler-icons'
import { radixCross2 } from '@ng-icons/radix-icons'
import { DatePipe } from '@angular/common';
import { CancelConfirmedComponent } from './cancel-confirmed/cancel-confirmed.component';
import { CancellationPageComponent } from './cancellation-page/cancellation-page.component';
import { CreateMeetingComponentComponent } from './create-meeting-component/create-meeting-component.component';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { OopsComponent } from './oops/oops.component';
import { ReschedulingComponent } from './rescheduling/rescheduling.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
// import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
// import { CancellationPageComponent } from './cancellation-page/cancellation-page.component';
// import { CancelConfirmedComponent } from './cancel-confirmed/cancel-confirmed.component';
// import { OopsComponent } from './oops/oops.component';
// import { ReschedulingComponent } from './rescheduling/rescheduling.component';



@NgModule({
  declarations: [
    AppComponent,
    CreateMeetingComponentComponent,
    MakeMeetingComponent,
    ThankyouPageComponent,
    CancellationPageComponent,
    CancelConfirmedComponent,
    OopsComponent,
    ReschedulingComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    FullCalendarModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    // NgxSearchFilterModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    NgIconsModule.withIcons({
      heroUsers,radixCross2,
      // IonSettingsOutline, BootstrapStars, remixUserAddLine, IonSearchOutline, BootstrapCaretDownFill, IonCopyOutline, BootstrapChevronDown,
      // BootstrapCircleFill, BootstrapPlusCircleFill, TypAttachmentOutline, remixCalendar2Line, remixStackshareLine, circumRoute, BootstrapClock,
      // BootstrapQuestionCircle, remixArrowRightSLine, heroVideoCamera, heroGlobeAsiaAustralia, BootstrapArrowLeft, TypTick, TablerEdit, remixDeleteBin6Line,
      // IonLogInOutline, IonMailOpenOutline, BootstrapPencil, BootstrapPeople, BootstrapCameraVideo, OctLocation
    }),
  ],

  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
