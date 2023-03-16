import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../shared/classes/Recipe';
import { RecipeAPI } from '../shared/services/RecipeAPI';
import { db } from '../shared/classes/Database';
import { RouterTestingModule } from '@angular/router/testing';
import { ReceipeListComponent } from './receipe-list.component';

describe('ReceipeListComponent', () => {
  let component: ReceipeListComponent;
  let fixture: ComponentFixture<ReceipeListComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const activatedRouteStub = () => ({
      snapshot: { queryParamMap: { get: () => ({}) } }
    });
    const recipeAPIStub = () => ({
      get_all_recipes: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReceipeListComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: RecipeAPI, useFactory: recipeAPIStub }
      ]
    });
    fixture = TestBed.createComponent(ReceipeListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`resourcesLoaded has default value`, () => {
    expect(component.resourcesLoaded).toEqual(false);
  });

  it(`dB has default value`, () => {
    expect(component.dB).toEqual(db);
  });

  it(`favorites has default value`, () => {
    expect(component.favorites).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const recipeAPIStub: RecipeAPI = fixture.debugElement.injector.get(
        RecipeAPI
      );
      spyOn(recipeAPIStub, 'get_all_recipes').and.callThrough();
      component.ngOnInit();
      expect(recipeAPIStub.get_all_recipes).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const recipeAPIStub: RecipeAPI = fixture.debugElement.injector.get(
        RecipeAPI
      );
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(recipeAPIStub, 'get_all_recipes').and.callThrough();
      component.filter();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(recipeAPIStub.get_all_recipes).toHaveBeenCalled();
    });
  });
});
