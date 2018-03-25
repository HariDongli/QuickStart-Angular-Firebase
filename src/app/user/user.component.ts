import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { BidEvent } from "../bidcreator/BidEvent";
import { ActivatedRoute } from "@angular/router";
import { Router, ParamMap } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
declare var moment;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private eventsPath: string = '/events';
  private usereventsPath: string = '/users/'
  private monitorPath: string ='/monitor/'
  private rankingPath: string ='/ranking/'
  events: AngularFireList<BidEvent>;
  eventsTodisplay: any;
  accceptedeventsTodisplay: Array<LiveCard>=[];
  acceptedEvents: AngularFireList<any>;

  cuser;rank;monitor;displayRank
  mon;ran;
  displayedColumns = [ 'user', 'money'];
  
 @ViewChild(MatSort) sort: MatSort;
ref;
  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
  ){
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

    onStart(){}
  ngOnInit() {
    this.route.paramMap
    .subscribe(params =>{
      this.events=this.db.list(this.usereventsPath+params.get('id'),ref => {
        let q = ref.orderByKey();
        return q;
      });
      // this.acceptedEvents = this.db.list(this.usereventsPath+params.get('id')+'/accepted',ref => {
      //   let q = ref.orderByKey();
      //   return q;
      // });
      this.acceptedEvents = this.db.list(this.monitorPath+params.get('id'),ref => {
        let q = ref.orderByKey();
        return q;
      });
      this.cuser = params.get('id');
      console.log(params.get('id'))
      console.log(this.events)
      console.log(this.acceptedEvents)
     let un= this.acceptedEvents.valueChanges().subscribe( res => {
        let count=0;
        let len =res.length
        res.forEach(element => {
          let c= moment();
          
          let a = new LiveCard();
          let d=moment.duration(c.diff(moment(element.starttime,'YYYYMMDD HH:mm:ss'))).as('h');
          // less
          //greater
          // if d<0 d=0; duration

          a.key=element.key
          a.title= element.title
          a.starttime= element.starttime,
          a.duration= d<0|| d-element.duration>0? 0: -1*(d-element.duration);
          console.log(a.duration);
        a.description=element.description,
        a.config= {
          template: '<strong>$!h!:$!m!:$!s!</strong>',
          leftTime: a.duration*60*60  //$!h!时$!m!分$!s!秒
          
        }
        this.accceptedeventsTodisplay.push(a);
        element=a;
          console.log(element.config.leftTime)
       
        });  
        
        console.log(res)
        if(count==length-1)
          un.unsubscribe()
      });
     
      this.events.valueChanges().subscribe( res => {
        this.eventsTodisplay=res;
        
        console.log(res)
      });
    }
  );


  }

  reject(event) {
    console.log(event);
    this.events.remove(event.key);
  }
  accept(event): void{
    console.log(event)
    let live = {
        key: event.key,
        title:event.title,
        description: event.description,
        starttime: event.starttime,
        duration: event.duration,
        money:0
    }
   this.mon = this.db.list(this.monitorPath+event.key,ref => {
    let q = ref.orderByKey();
    return q;
  });
  this.mon.set(this.cuser,live);
    this.acceptedEvents.set(event.key,live);
    this.ran = this.db.list(this.rankingPath+event.key,ref => {
      let q = ref.orderByKey();
      return q;
    });
      this.ran.set(this.cuser,0);
    this.events.remove(event.key);
    
    // this.accceptedeventsTodisplay = 
    // this.mon.valueChanges().subscribe( res => {
    //   // this.accceptedeventsTodisplay=res;
    //   console.log(res)
    // });
   
  }
  add(event,money){
    console.log(money)
    // let config={
    //   template: '<strong>$!h!:$!m!:$!s!</strong>',
    //   leftTime: 8*60*60  //$!h!时$!m!分$!s!秒
    // }
    let live = {
        key: event.key,
        title:event.title,
        description: event.description,
        starttime: event.starttime,
        duration: event.duration,
        money: money
    }
   this.mon = this.db.list(this.monitorPath+event.key,ref => {
    let q = ref.orderByKey();
    return q;
  });
    this.mon.set(this.cuser,live);
    this.ran = this.db.list(this.rankingPath+event.key,ref => {
      let q = ref.orderByKey();
      return q;
    });
      this.ran.set(this.cuser,money);
    // this.acceptedEvents.set(event.key,live);
    // this.mon.valueChanges().subscribe( res => {
    //   console.log(res)
    // });
  }
  // validCard(event){
  //   let c=  (new moment()).format('YYYYMMDD HH:mm:ss')
    
  //   let ct= new moment(c,'YYYYMMDD HH:mm:ss');
  //   console.log(ct)
  //   let st= new moment(event.starttime,'YYYYMMDD HH:mm:ss');
  //   // console.log(moment(ct).substract(st));
  //   console.log(st);
  //   // event.starttime = moment(event.timestamp).format('YYYYMMDD HH:mm:ss')
      
  //   var x = new moment()
  //   var y = new moment().add(1,'h')
  //   var duration1 = moment.duration(x.diff(y))
  //     var duration = moment.duration(ct.diff(st))
  //     console.log(duration.as('seconds')>0);
  //     // console.log(ct,st,duration.as('seconds'),duration1.as('seconds'))
  //     return true
  // }

}

export class LiveCard{
  key;
  title;
  starttime;
  duration;
description;
config: {
  template;
  leftTime;   //$!h!时$!m!分$!s!秒
}
}