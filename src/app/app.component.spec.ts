import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyCookieService } from './shared/services/cookie.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeAPI } from './shared/services/RecipeAPI';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const myCookieServiceStub = () => ({
      checkCookie: string => ({}),
      setCookie: (string, id, arg) => ({})
    });
    const mediaMatcherStub = () => ({ matchMedia: string => ({}) });
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const routerStub = () => ({});
    const locationStub = () => ({ back: () => ({}) });
    const recipeAPIStub = () => ({
      get_all_recipes: array => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: MyCookieService, useFactory: myCookieServiceStub },
        { provide: MediaMatcher, useFactory: mediaMatcherStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: Location, useFactory: locationStub },
        { provide: RecipeAPI, useFactory: recipeAPIStub }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('goBack', () => {
    it('makes expected calls', () => {
      const locationStub: Location = fixture.debugElement.injector.get(
        Location
      );
      spyOn(locationStub, 'back').and.callThrough();
      component.goBack();
      expect(locationStub.back).toHaveBeenCalled();
    });
  });
});
