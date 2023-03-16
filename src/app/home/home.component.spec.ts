import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RecipeAPI } from '../shared/services/RecipeAPI';
import { StabilityAPI } from '../shared/services/StabilityAPI';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const cookieServiceStub = () => ({ get: string => ({}) });
    const recipeAPIStub = () => ({
      get_recipe: id => ({ subscribe: f => f({}) })
    });
    const stabilityAPIStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: CookieService, useFactory: cookieServiceStub },
        { provide: RecipeAPI, useFactory: recipeAPIStub },
        { provide: StabilityAPI, useFactory: stabilityAPIStub }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`imageText has default value`, () => {
    expect(component.imageText).toEqual(`data:image/png;base64, `);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const cookieServiceStub: CookieService = fixture.debugElement.injector.get(
        CookieService
      );
      const recipeAPIStub: RecipeAPI = fixture.debugElement.injector.get(
        RecipeAPI
      );
      spyOn(cookieServiceStub, 'get').and.callThrough();
      spyOn(recipeAPIStub, 'get_recipe').and.callThrough();
      component.ngOnInit();
      expect(cookieServiceStub.get).toHaveBeenCalled();
      expect(recipeAPIStub.get_recipe).toHaveBeenCalled();
    });
  });
});
