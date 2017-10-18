import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionService } from './transaction.service';
import { ModifyService } from './../modify/modify.service';
import { ActivatedRoute } from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import 'rxjs/Rx';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit , OnDestroy  {
  constructor(private transactionservice:TransactionService, private ModifyService: ModifyService, private route: ActivatedRoute) { }
  
  public SearchPayment : FormGroup;
  public patientDatas=[];
  public patientDatasDetails = [];
  public commoncodes = [];
  public notify;
  public Notify = false;
  public ageGroupFromServer =[];
  public throwage;
  public genderinPatientTable;
  public patientName;
  public registeredDate;
  public patientId;
  public globleSum;
  public sum = 0;
  public currentAmt;
  public activepaymentForm = false;
  public showTable = false;
  public routeParameter;
  public paramId;
  public searchField : FormControl;
  public SearchNotify = false;
  public Searchnotify;
  public transactionData: FormGroup;
  public drOrCr;
  // public processCash : FormControl;
  // public processDiscount : FormControl;
  // public processDiscountPer : FormControl;
  public selectedradioButton;
  public disableme = false;
  // public isurlid = false;
  public previousAmount = 0;
  public activePayment = false;
  public routedList = true;
  public UseForCredit = false;
  // public tempGlobleVar;
  // public tempCashGlobleVar;

  ngOnInit() {
    // this.SearchPayment = new FormGroup({
    //   Search_name:new FormControl('', Validators.required)
    // })

    this.transactionData = new FormGroup({
      cash: new FormControl(''),
      checkDiscount: new FormControl('0'),
      discountcheck: new FormControl(''),
      credit : new FormControl(''),
      // discountPer  : new FormControl('')
    });

    // console.log(this.transactionData.controls.checkDiscount.value);
    // console.log(this.transactionData.controls.checkDiscounPert.value);



    this.transactionData.controls.cash.valueChanges
    .subscribe(term=>{
        this.calculateTotalAmount();
      });
      this.transactionData.controls.discountcheck.valueChanges
      .subscribe(term=>{
          this.calculateTotalAmount();
        });


    this.searchField = new FormControl;
    this.searchField.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(term => {
        this.searchpayment(term).subscribe();
      });
    

    this.ModifyService.commoncodes() .subscribe(
      (response)=>{
        if(response.length == 0){
          this.Notify = true;
          this.notify = "There is no any Data ";
        }
        console.log(response);
        this.commoncodes = response;


       


        // let tempData;
        for(let x in response){
          if(response[x].common_code.toUpperCase() == 'AGP'){
            if(this.ageGroupFromServer == undefined){
              // tempData = [
              //   {age_group:response[x].common_description, enable:1},
              // ]
              this.ageGroupFromServer = response[x].common_description;
            }
            else{
              // tempData.push({age_group:response[x].common_description, enable:1})
              this.ageGroupFromServer.push(response[x].common_description);
            }
          }
          // this.age_groupInDropdown = tempData;
        }


        // this.routeParameter = this.route.params
        // .subscribe(params => {
        //   console.log(params);
        //   this.paramId= params['id'];
        //   if(this.paramId){
        //     this.isurlid = true;
        //     this.disableme = true;
        //     this.searchpayment(this.paramId).subscribe(
        //       success=>{
        //         console.log(this.patientDatas);
        //         // for (let i in this.patientDatas) {
        //           this.invoice(this.patientDatas[0].testbooking_id);
        //         // }
        //     },err=>{
        //       console.log(this.patientDatas);
        //     })
            
        //   }
        // });


        
        // console.log(this.FormUnits , this.genderInDropdowns, this.age_groupInDropdown)
      },
      (error)=>{
          console.log("sorry error in server")
          this.Notify = true;
          this.notify = "Sorry couldn't load data from server please refresh it."
      });


      
    



     
  }
  calculateTotalAmount(){
    let discountAmount = (this.transactionData.controls.checkDiscount.value == 0)?this.transactionData.controls.discountcheck.value:(((this.transactionData.controls.discountcheck.value)/100)*this.globleSum);
    this.sum = this.globleSum - (Number(this.transactionData.controls.cash.value) + Number(discountAmount));
  }
   

  
  public searchpayment(id): Observable<any> {
    return new Observable(observer => {
      if (id) {
        this.transactionservice.getPatientTest(id)
          .subscribe(
          (response) => {
            if (response.length > 0) {
              console.log(response);
              this.patientDatas = [];
              this.patientDatas = response;
              // if(response.length > 0){
              //   this.SearchNotify = false;
              //   this.sum = 0;
              //   console.log(response);
              //   this.genderinPatientTable = response[0].gender;
              //   this.patientName = response[0].patient_name;
              //   this.patientId = response[0].reg_no;
              //   this.registeredDate = response[0].created_at;
              //   // this.patientDatas = response;

              let ageRange = [];
              for (let i in this.ageGroupFromServer) ageRange.push(JSON.parse(JSON.stringify(this.ageGroupFromServer[i])))
              // console.log(ageRange);
              let splitAge = [];
              for (let x in ageRange) {
                splitAge.push(ageRange[x].split(" "));
              }
              // console.log(splitAge);
              let changeInNum
              let intCollection = [];
              for (let y in splitAge) {
                for (let z = 0; z <= splitAge[y].length - 1; z++) {
                  changeInNum = splitAge[y][z];
                  if (parseInt(changeInNum)) {
                    intCollection.push(parseInt(changeInNum));
                  }
                  else {
                    if (intCollection.length < 1) {
                      intCollection.push(0);
                    }
                    else if (splitAge[parseInt(y)].length < 3) {
                      intCollection.push(200);
                    }
                  }
                  // console.log((changeInNum));
                  // if(changeInNum.toUpperCase() ==  )
                }
              }
              // console.log(intCollection);
              console.log("this is int list")
              for (let int = 0; int < intCollection.length; int += 2) {
                // console.log(int);
                let term = response[0].age;
                if (term < 200) {
                  if (term >= intCollection[int] && term <= intCollection[int + 1]) {
                    if (intCollection[int] == 0) {
                      this.throwage = "below " + intCollection[int + 1].toString();
                    }
                    else if (intCollection[int + 1] == 200) {
                      this.throwage = intCollection[int].toString() + " above";
                    }
                    else if (intCollection[int] != 0 && intCollection[int + 1] != 200) {
                      this.throwage = intCollection[int].toString() + " to " + intCollection[int + 1];
                    }
                  }
                }
                // console.log(intCollection[int] , intCollection[int+1]);
              }


              this.showTable = true;
              // if(this.isurlid){
              //   if(response.length !=1){
              //     this.previousAmount = parseFloat(response[response.length - 2].balance);
              //   }
              //   else{
              //     this.previousAmount = 0.00;
              //   }
              //   this.sum = response[response.length - 1].invoices_balance;
              //   this.currentAmt = this.sum;
              //   this.sum += this.previousAmount;
              //   this.globleSum = this.sum;
              //   this.patientDatas = response;

              // }
              // else{
              //   for (let i in response) {
              //     console.log(this.patientDatas);
              //     // if(response[i].age_group.toUpperCase() == this.throwage.toUpperCase() && response[i].gender.toUpperCase() == response[i].genderdetails.toUpperCase() ){
              //     if (this.patientDatas.length > 0) {
              //       let MatchFound = false;
              //       for(let y in this.patientDatas){
              //         if (response[i].id == this.patientDatas[y].id) {
              //           MatchFound = true;
              //         }
              //       }
              //       if(!MatchFound){
              //         this.patientDatas.push(response[i]);
              //       }
              //     }
              //     else {
              //       this.patientDatas.push(response[i]);
              //     }

              //     // }
              //   }
              // }


              this.showTable = true;
              //   this.activepaymentForm = false;
              //   this.activePayment = false;
              // console.log(this.patientDatas);
              // }
              // else{
              //   this.SearchNotify = true;
              //   this.Searchnotify = "Sorry, No Data Are Found!!!"
              // }


              observer.next();
              observer.complete();
            }

          },
          (error) => {
            this.SearchNotify = true;
            this.Searchnotify = "Sorry Error in Server!!!"
            observer.complete();
          });
      }
    });
  }
  // }

  // routedinvoice(term){
  //   console.log(term)
  //   let id = term.testbookings_id
  //   this.activepaymentForm = false;
  //   console.log(id);
  //   this.transactionData.reset();
  //   this.transactionData.controls.checkDiscount.setValue('0')
  //   // this.sum = 0;
  //   this.patientDatasDetails = [];
  //     this.transactionservice.getDetialsOfTestbooking(id)
  //     .subscribe(
  //     (response) => {
  //       console.log(response);
  //       for (let i in response) {
  //         // console.log(response[i].age_group);
  //         // console.log(this.throwage);
  //         // console.log(this.genderinPatientTable);
  //         // console.log(response[i].genderdetails);
          

  //         if (response[i].age_group == this.throwage && this.genderinPatientTable == response[i].genderdetails) {
  //           this.patientDatasDetails.push(response[i]);
  //         }
  //       }
  //       this.activepaymentForm = true;
  //       console.log(this.patientDatasDetails);
  //       // if(!(this.sum > 0)){
  //       //   for(let x in this.patientDatasDetails){
  //       //     this.sum = this.sum +  parseInt(this.patientDatasDetails[x].rate);
  //       //     console.log(this.sum);
  //       //     this.globleSum = this.sum;
  //       //   }
  //       // }
  //     },
  //     (error) => {
  //       console.log("sorry error in server")
  //     });


  // }
  invoice(id){
    console.log(id);
    this.transactionData.reset();
    // this.transactionData.controls.checkDiscount.setValue('0')
    // this.sum = 0;
    this.patientDatasDetails = [];
    // // this.sum = null;
    // let typeofInvoice = typeof id;
    // console.log(typeofInvoice);
    // console.log(id);
    // if(typeofInvoice == 'number'){
      // this.transactionservice.getDetialsOfPatients(id)
      // .subscribe(
      // (response) => {
      //   console.log(response);
    //     for (let i in response) {
    //       console.log(response[i].age_group);
    //       console.log(this.throwage);
    //       console.log(this.genderinPatientTable);
    //       console.log(response[i].genderdetails);
          

    //       // if (response[i].age_group == this.throwage && this.genderinPatientTable == response[i].genderdetails) {
    //         this.patientDatasDetails.push(response[i]);
    //       // }
    //     }
        this.activepaymentForm = true;
    //     console.log(this.patientDatasDetails);
    //     // if(!(this.sum > 0)){
    //     //   // for(let x in this.patientDatasDetails){
    //     //     this.sum = this.sum +  parseInt(this.patientDatasDetails[0].balance);
    //     //     console.log(this.sum);
    //     //     this.globleSum = this.sum;
    //     //   // }
    //     //   // this.previousAmount=0;
    //     //   // this.previousAmount = this.previousAmount+ parseInt(this.patientDatasDetails[0].invoiceBalance);
    //     // }
    //   },
    //   (error) => {
    //     console.log("sorry error in server")
    //   });

    // }
    // else{
      console.log(id)
      let idToGetTest = id.id;
      console.log(idToGetTest);
      // this.genderinPatientTable = id.gender;
      this.patientName = id.patient_name;
      this.patientId = id.reg_no;
      this.registeredDate = id.created_at;
    // for (let i in this.patientDatas) {
      this.transactionservice.getDetialsOfPatients(idToGetTest)
        .subscribe(
        (response) => {
          console.log(response);
          console.log(response.length)
          if(response.length > 0){
            this.registeredDate = response[response.length - 1].created_at;
            this.sum = response[response.length - 1].balance;
            this.globleSum = this.sum;
            this.drOrCr = response[response.length - 1].remark
            // console.log(this.sum)
          }
          // for (let i in response) {
            // console.log(response[i].age_group);
            // console.log(this.throwage);
            // console.log(this.genderinPatientTable);
            // console.log(response[i].genderdetails);
            

            // if (response[i].age_group == this.throwage && this.genderinPatientTable == response[i].genderdetails) {
            //   this.patientDatasDetails.push(response[i]);
            // }
          // }
          this.activepaymentForm = true;
          // console.log(this.patientDatasDetails);
          // if(!(this.sum > 0)){
          //   for(let x in this.patientDatasDetails){
          //     this.sum = this.sum +  parseInt(this.patientDatasDetails[x].rate);
          //     this.globleSum = this.sum;
          //     console.log(this.sum);
          //   }
          // }
        },
        (error) => {
          console.log("sorry error in server")
        });
    // }
      }
    
// }

transactionDatas(id){
  let allData = id;
  allData['amount'] = this.globleSum
  console.log(allData);
  console.log(this.patientDatasDetails)
  // this.transactionservice.postInvoices(allData)
  // .subscribe(
  //   (response)=>{
  //     console.log(response);
  //   },
  //   (error)=>{
  //     console.log(error);
  //   }
  // );
}
activeInvoice(id){
  if(id == 0)
    this.activePayment = false;
  else 
    this.activePayment = true;
}


  datadismis(){
    console.log('Hide')
    this.Notify = false;
  }
  SearchBarDismiss(){
    this.showTable = false;
  }

  ngOnDestroy(){
    // this.routeParameter.unsubscribe();
  }
}

