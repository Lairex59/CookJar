import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BeerAPI } from './../shared/services/BeerAPI';
import { RouterTestingModule } from '@angular/router/testing';
import { BeerListComponent } from './beer-list.component';

describe('BeerListComponent', () => {
  let component: BeerListComponent;
  let fixture: ComponentFixture<BeerListComponent>;

  beforeEach(() => {
    const beerAPIStub = () => ({
      getAllBeer: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BeerListComponent],
      providers: [{ provide: BeerAPI, useFactory: beerAPIStub }]
    });
    fixture = TestBed.createComponent(BeerListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`resourcesLoaded has default value`, () => {
    expect(component.resourcesLoaded).toEqual(false);
  });

  it(`beerList has default value`, () => {
    expect(component.beerList).toEqual([]);
  });

  it(`beerListCache has default value`, () => {
    expect(component.beerListCache).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const beerAPIStub: BeerAPI = fixture.debugElement.injector.get(BeerAPI);
      spyOn(beerAPIStub, 'getAllBeer').and.callThrough();
      component.ngOnInit();
      expect(beerAPIStub.getAllBeer).toHaveBeenCalled();
    });
  });
});
