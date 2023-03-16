import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Recipe } from '../shared/classes/Recipe';
import { RouterTestingModule } from '@angular/router/testing';
import { YourRecipeListComponent } from './your-recipe-list.component';

describe('YourRecipeListComponent', () => {
  let component: YourRecipeListComponent;
  let fixture: ComponentFixture<YourRecipeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [YourRecipeListComponent]
    });
    fixture = TestBed.createComponent(YourRecipeListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`recipeList has default value`, () => {
    expect(component.recipeList).toEqual([]);
  });
});
