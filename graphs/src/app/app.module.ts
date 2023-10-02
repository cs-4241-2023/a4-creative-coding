import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SvgComponent } from './components/svg/svg.component';
import { GridLinesComponent } from './components/grid-lines/grid-lines.component';
import { GraphComponent } from './components/graph/graph.component';
import { NodeComponent } from './components/node/node.component';
import { EdgeComponent } from './components/edge/edge.component';
import { InteractionDirective } from './directives/interaction.directive';
import { AbstractInteractiveComponent } from './components/abstract-interactive/abstract-interactive.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgComponent,
    GridLinesComponent,
    GraphComponent,
    NodeComponent,
    EdgeComponent,
    InteractionDirective,
    AbstractInteractiveComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
