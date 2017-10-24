import { Component, OnInit } from '@angular/core';
import {IMyDrpOptions} from 'mydaterangepicker';
import { FormGroup,FormBuilder,  FormControl, Validators } from '@angular/forms';
import { ModifyService } from './../modify/modify.service';
import { DoctorReportService } from './doctor-report.service';

@Component({
  selector: 'app-doctor-report',
  templateUrl: './doctor-report.component.html',
  styleUrls: ['./doctor-report.component.css']
})
export class DoctorReportComponent implements OnInit {

  public myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek:'su',
    sunHighlight:false,
    disableHeaderButtons:false,
    selectorHeight:'500px',
    selectorWidth:'500px',
    height:'34px',
    width:'auto',
    // selectorWidth:'100%',
    // componentDisabled:true,
    editableDateRangeField:false,
    openSelectorOnInputClick:true,
  };
  public myForm: FormGroup;
  public doctorlists;
  public Notify = false;
  public notify;

  constructor(private formBuilder: FormBuilder,private ModifyService: ModifyService, private DoctorReport: DoctorReportService) { }

  ngOnInit() {    

    this.myForm = this.formBuilder.group({
      myDateRange: ['', Validators.required],
      selecteddoctor:new FormControl('')
    });

  this.ModifyService.getDoctorList()
  .subscribe(
      (response)=>{
        this.doctorlists=response
        console.log(response);
      },
      (error)=>{
          // this.submitButtonStatus=true
          console.log("ERROR successfully")
          this.Notify = true;
          this.notify = "Sorry couldn't load Doctor from server please refresh it."
      }
  );

  }
  setDateRange(): void {
        // Set date range (today) using the setValue function
        let date = new Date();
        this.myForm.setValue({myDateRange: {
            beginDate: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            endDate: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        }});
    }

    clearDateRange(): void {
        // Clear the date range using the setValue function
        this.myForm.setValue({myDateRange: ''});
    }


    doctorInfo(){
      let param = [];
      console.log(this.myForm.controls.selecteddoctor.value);
      console.log(this.doctorlists[this.myForm.controls.selecteddoctor.value].id);
      console.log(this.myForm);
      console.log(this.myForm.controls.myDateRange.value.formatted);
      let dateRange = this.myForm.controls.myDateRange.value.formatted.split(' - ');
      param['doctorId'] = this.doctorlists[this.myForm.controls.selecteddoctor.value].id;
      param['startDate'] = dateRange[0];
      param['endDate'] = dateRange[1];
      console.log(param);
      this.DoctorReport.getDoctorTestbookingTransaction(param)
      .subscribe(
        (response)=>{
          console.log(response);
        },
        (error)=>{
          console.log(error);
        }
      );
    }


    datadismis(){
      console.log('Hide')
      this.Notify = false;
    }


}