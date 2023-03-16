'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">cook-jar documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-dd2a4de785b6a1ca4cf2fa3eaf79093943bf1a261a8fefd19f2d2f8ae3118f47a883a6cac0c1a771b077b532310e6d3c4e4691b982000f35545e7de5f23dcb6f"' : 'data-target="#xs-components-links-module-AppModule-dd2a4de785b6a1ca4cf2fa3eaf79093943bf1a261a8fefd19f2d2f8ae3118f47a883a6cac0c1a771b077b532310e6d3c4e4691b982000f35545e7de5f23dcb6f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-dd2a4de785b6a1ca4cf2fa3eaf79093943bf1a261a8fefd19f2d2f8ae3118f47a883a6cac0c1a771b077b532310e6d3c4e4691b982000f35545e7de5f23dcb6f"' :
                                            'id="xs-components-links-module-AppModule-dd2a4de785b6a1ca4cf2fa3eaf79093943bf1a261a8fefd19f2d2f8ae3118f47a883a6cac0c1a771b077b532310e6d3c4e4691b982000f35545e7de5f23dcb6f"' }>
                                            <li class="link">
                                                <a href="components/AddEditRecipeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddEditRecipeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BarcodeEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BarcodeEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BeerEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeerEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BeerListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeerListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FavoritesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FavoritesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FridgeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FridgeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HelpPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReceipeListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReceipeListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecipeEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecipeEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/YourRecipeListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >YourRecipeListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Beer.html" data-type="entity-link" >Beer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbService.html" data-type="entity-link" >DbService</a>
                            </li>
                            <li class="link">
                                <a href="classes/FoodFact.html" data-type="entity-link" >FoodFact</a>
                            </li>
                            <li class="link">
                                <a href="classes/Recipe.html" data-type="entity-link" >Recipe</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BeerAPI.html" data-type="entity-link" >BeerAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FoodFactAPI.html" data-type="entity-link" >FoodFactAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyCookieService.html" data-type="entity-link" >MyCookieService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipeAPI.html" data-type="entity-link" >RecipeAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StabilityAPI.html" data-type="entity-link" >StabilityAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/YoutbeAPI.html" data-type="entity-link" >YoutbeAPI</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/GenerationResponse.html" data-type="entity-link" >GenerationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Video.html" data-type="entity-link" >Video</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});