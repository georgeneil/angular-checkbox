import {
  Component,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
} from '@angular/core';
// import {OverlayContainer} from '@angular/material';

/**
 * The entry app for demo site. Routes under `accessibility` will use AccessibilityDemo component,
 * while other demos will use `DemoApp` component. Since DemoApp and AccessibilityDemo use
 * different templates (DemoApp has toolbar and sidenav), we use this EntryApp in index.html
 * as our entry point.
 */
@Component({
  moduleId: module.id,
  selector: 'entry-app',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
})
export class EntryApp {}

/**
 * Home component for welcome message in DemoApp.
 */
@Component({
  selector: 'home',
  template: `
    <p>Angular4 Component Development Kit(CDK)</p>
  `
})
export class Home {}

/**
 * DemoApp with toolbar and sidenav.
 */
@Component({
  moduleId: module.id,
  selector: 'demo-app',
  templateUrl: 'demo-app.html',
  styleUrls: ['demo-app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
  dark = false;
  navItems = [
    {name: 'Checkbox', route: '/checkbox'},
  ];

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    // private _overlayContainer: OverlayContainer
    ) {}

  toggleFullscreen() {
    let elem = this._element.nativeElement.querySelector('.demo-content');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullScreen) {
      elem.msRequestFullScreen();
    }
  }

  toggleTheme() {
    const darkThemeClass = 'unicorn-dark-theme';

    this.dark = !this.dark;

    if (this.dark) {
      this._renderer.addClass(this._element.nativeElement, darkThemeClass);
    //   this._overlayContainer.themeClass = darkThemeClass;
    } else {
      this._renderer.removeClass(this._element.nativeElement, darkThemeClass);
    //   this._overlayContainer.themeClass = '';
    }
  }
}
