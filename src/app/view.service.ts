import { Injectable,
  ComponentFactoryResolver,
  Inject,
  ReflectiveInjector,
  ViewContainerRef } from '@angular/core';

import { Subject }    from 'rxjs/Subject';
import {  BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Http } from "@angular/http";

import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';


@Injectable()
export class ViewService {

  factoryResolver: ComponentFactoryResolver;
  rootViewContainer : ViewContainerRef;

  constructor( @Inject(ComponentFactoryResolver) factoryResolver
  ) {
    this.factoryResolver = factoryResolver;
   }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }

  addMoldeojsViewComponent( mol : string) {
    const factory : any = this.factoryResolver.resolveComponentFactory(MoldeojsViewComponent);

    // Inputs need to be in the following format to be resolved properly
    var data = { inputs: { "mol": mol } }
    let inputProviders = Object.keys(data.inputs).map((inputName) => {
      return {
          provide: inputName,
          useValue: data.inputs[inputName]
      };
    });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    console.log("inputProviders:",inputProviders);
    console.log("resolvedInputs:",resolvedInputs);
    // We create an injector out of the data we want to pass down and this components injector
    //let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.rootViewContainer.parentInjector);
    let injector = ReflectiveInjector.resolveAndCreate(inputProviders);
    const component: any = factory.create(injector);
    console.log("setting component instance inputs:",component);
    //component.instance.mol = mol;
    //Object.keys(parameters).forEach(input => component.instance[input] = parameters[input]))
    this.rootViewContainer.insert(component.hostView);

  }


}
