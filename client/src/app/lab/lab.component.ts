import { Component, OnInit ,Input } from '@angular/core';
@Component({
  selector: 'app-lab',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

Value_in_transactionData(id){
	this.gettransactionData(id)
}

constructor() { }
  ngOnInit() {
  }
  
 gettransactionData(id){
 console.log(id)
  }
}
