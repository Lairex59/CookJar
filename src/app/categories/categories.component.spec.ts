import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeAPI } from '../shared/services/RecipeAPI';
import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const recipeAPIStub = () => ({
      get_all_recipes: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CategoriesComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: RecipeAPI, useFactory: recipeAPIStub }
      ]
    });
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`resourcesLoaded has default value`, () => {
    expect(component.resourcesLoaded).toEqual(false);
  });

  it(`categories has default value`, () => {
    expect(component.categories).toEqual([]);
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
});
