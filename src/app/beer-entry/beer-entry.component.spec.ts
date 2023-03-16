import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeerAPI } from '../shared/services/BeerAPI';
import { BeerEntryComponent } from './beer-entry.component';

describe('BeerEntryComponent', () => {
  let component: BeerEntryComponent;
  let fixture: ComponentFixture<BeerEntryComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: { id: {} } } });
    const beerAPIStub = () => ({ getBeer: id => ({ subscribe: f => f({}) }) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BeerEntryComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: BeerAPI, useFactory: beerAPIStub }
      ]
    });
    fixture = TestBed.createComponent(BeerEntryComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const beerAPIStub: BeerAPI = fixture.debugElement.injector.get(BeerAPI);
      spyOn(beerAPIStub, 'getBeer').and.callThrough();
      component.ngOnInit();
      expect(beerAPIStub.getBeer).toHaveBeenCalled();
    });
  });
});
