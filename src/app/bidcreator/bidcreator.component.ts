import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { BidEvent } from "./BidEvent";
import { FormGroup, FormControl, FormBuilder, Validator, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
declare var moment: any;

@Component({
  selector: 'app-bidcreator',
  templateUrl: './bidcreator.component.html',
  styleUrls: ['./bidcreator.component.css']
})
export class BidcreatorComponent implements OnInit {
  formBidEvent: FormGroup;

  private eventsPath: string = '/events';
  private usersPath: string = '/users';
  private monitorPath: string ='/monitor/';
  private rankingPath: string ='/ranking/'
  displayRank={};
  monitor: any;
  rankTodisplay: any;
  events: AngularFireList<BidEvent>;
  notifyUsers: AngularFireList<BidEvent>;
  rank=[];
  displayedColumns = [ 'user', 'money'];
   
  @ViewChild(MatSort) sort: MatSort;
ref;

  constructor(private db: AngularFireDatabase,    private formBuilder: FormBuilder,){
    this.events = db.list(this.eventsPath);
    // this.events.push(BidEvent);
    this.ref = db.database.ref(this.usersPath);
    // this.ref.child("user1")
    this.notifyUsers = db.list(this.usersPath);
  //  this.monitor = db.list(this.monitorPath);
   this.monitor = db.list(this.rankingPath,ref => {
    let q = ref.orderByKey();
    return q;
  });
  // console.l;
  let  c;
  let rankTodisplay = this.monitor.snapshotChanges().subscribe( res =>{
    console.log(res);
    res.forEach(element => {
   console.log(element.key)
   db.list(this.rankingPath).valueChanges().subscribe(e =>{
     console.log(e);
   });
    });
          }
        )
        
        let v
        var ref = db.database.ref(this.rankingPath);
        ref.on("value",async (snapshot) => {
           var n = await snapshot.val();
           console.log(n);
          this.displayRank=n;
          this.rank=[];
          for(let key in this.displayRank){
            let c=0;
            let va=[]
            let value =this.displayRank[key];
            let keys = Object.keys(value);
            for(let k of keys ){
              // console.log(k)
              // console.log(value[k]);
                va.push({
                      user: k,
                      money: value[k]
                })
            }
            let dataSource = new MatTableDataSource(va);
              this.rank.push(
                {
                  key,
                  value: va,
                  dataSource: dataSource
                }
              );
              console.log(key,this.displayRank[key]);
          }
          console.log(this.rank);
          this.rank.forEach(e =>{
              e.value = e.value.sort(function(a, b){
                console.log(a,b)
                return b.money - a.money;
            });
          }
          )
        });
        

  }



  ngOnInit() {
    this.formBidEvent = this.formBuilder.group({
      title:['',[Validators.required,Validators.minLength(1)]],
      desc: ['',[Validators.required,Validators.minLength(1)]],
      timestamp: ['',],
      dur: ['',[Validators.required,Validators.pattern('[0-9]*'),Validators.max(24),Validators.maxLength(3)]]
    })
    
  }

  
  
  onSubmit(){
    // this.db.database.goOnline();
    if(this.formBidEvent.valid)
    {
      // this.events.set(this.formBidEvent.value.title,this.formBidEvent.value)
      let event = new BidEvent();
    
      event.key = this.formBidEvent.value.title;
      event.description=this.formBidEvent.value.desc;
      event.title =this.formBidEvent.value.title;
    
      event.duration = this.formBidEvent.value.dur; 
      
      // moment.js
      // .format('YYYYMMDD HH:mm:ss');
      let ct= moment();
      let st= moment(this.formBidEvent.value.timestamp)//.format('YYYYMMDD HH:mm:ss')
      // console.log(moment(ct).substract(st));
      event.starttime = moment(this.formBidEvent.value.timestamp).format('YYYYMMDD HH:mm:ss')
      console.log(event);

      let t= this.db.list(this.usersPath)
    
      
        //  let l= this.db.list(this.usersPath+'/'+val.key);
        //     l.set(event.key,event);
      let un=t.snapshotChanges().subscribe(element => {      
        let count=0;
        let len= element.length;
        element.forEach(val =>{
          count++;
          if(val.key!=='default'){
            let l= this.db.list(this.usersPath+'/'+val.key);
            l.set(event.key,event);
            console.log(val.key)
          }
          if(count==element.length-1){
            un.unsubscribe();
          }
        }
        )})

      // let l= this.db.list(this.usersPath+'/user1');
      // l.set(event.key,event);
      // this.notifyUsers.set(userSnapshot.key,event);
      // this.notifyUsers =  this.db.list(this.usersPath+'/user1');
      // var x = new moment()
      // var y = new moment()
      // var duration = moment.duration(ct.diff(st))
      // console.log(duration.as('minutes')>0);
      // this.formBidEvent.reset();
    }
  //   function data(snapshot){
  //     snapshot.forEach(userSnapshot => {
  //       console.log(userSnapshot.key);
  //   }
  // )}

  function modify(snapshot){
    snapshot.forEach(userSnapshot => {
      console.log(userSnapshot.key);
      this.notifyUsers.set(userSnapshot.key,event);
  }
)}  


  }

}
