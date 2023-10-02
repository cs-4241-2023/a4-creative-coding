import { Component } from '@angular/core';
import { AbstractInteractiveComponent } from '../abstract-interactive/abstract-interactive.component';
import { SvgInteractor } from 'src/app/interaction/svg-interactor';
import { Interactor } from 'src/app/interaction/interactor';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent extends AbstractInteractiveComponent {


  override registerInteractor(): Interactor {
    return new SvgInteractor();
  }

}
