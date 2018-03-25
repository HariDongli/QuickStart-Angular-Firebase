import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidcreatorComponent } from './bidcreator.component';

describe('BidcreatorComponent', () => {
  let component: BidcreatorComponent;
  let fixture: ComponentFixture<BidcreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidcreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidcreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
