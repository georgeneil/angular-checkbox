import {ComponentFixture, inject, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component, Renderer2} from '@angular/core';
import {StyleModule} from './index';
import {By} from '@angular/platform-browser';
import {TAB} from '../keyboard/keycodes';
import {FocusOrigin, FocusOriginMonitor, TOUCH_BUFFER_MS} from './focus-origin-monitor';
import {dispatchFakeEvent, dispatchKeyboardEvent, dispatchMouseEvent} from '@angular/cdk/testing';


describe('FocusOriginMonitor', () => {
  let fixture: ComponentFixture<PlainButton>;
  let buttonElement: HTMLElement;
  let buttonRenderer: Renderer2;
  let focusOriginMonitor: FocusOriginMonitor;
  let changeHandler: (origin: FocusOrigin) => void;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StyleModule],
      declarations: [
        PlainButton,
      ],
    }).compileComponents();
  });

  beforeEach(inject([FocusOriginMonitor], (fom: FocusOriginMonitor) => {
    fixture = TestBed.createComponent(PlainButton);
    fixture.detectChanges();

    buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonRenderer = fixture.componentInstance.renderer;
    focusOriginMonitor = fom;

    changeHandler = jasmine.createSpy('focus origin change handler');
    focusOriginMonitor.monitor(buttonElement, buttonRenderer, false).subscribe(changeHandler);
    patchElementFocus(buttonElement);
  }));

  it('manually registered element should receive focus classes', fakeAsync(() => {
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(changeHandler).toHaveBeenCalledTimes(1);
  }));

  it('should detect focus via keyboard', fakeAsync(() => {
    // Simulate focus via keyboard.
    dispatchKeyboardEvent(document, 'keydown', TAB);
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-keyboard-focused'))
        .toBe(true, 'button should have cdk-keyboard-focused class');
    expect(changeHandler).toHaveBeenCalledWith('keyboard');
  }));

  it('should detect focus via mouse', fakeAsync(() => {
    // Simulate focus via mouse.
    dispatchMouseEvent(buttonElement, 'mousedown');
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-mouse-focused'))
        .toBe(true, 'button should have cdk-mouse-focused class');
    expect(changeHandler).toHaveBeenCalledWith('mouse');
  }));

  it('should detect focus via touch', fakeAsync(() => {
    // Simulate focus via touch.
    dispatchMouseEvent(buttonElement, 'touchstart');
    buttonElement.focus();
    fixture.detectChanges();
    tick(TOUCH_BUFFER_MS);

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-touch-focused'))
        .toBe(true, 'button should have cdk-touch-focused class');
    expect(changeHandler).toHaveBeenCalledWith('touch');
  }));

  it('should detect programmatic focus', fakeAsync(() => {
    // Programmatically focus.
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-program-focused'))
        .toBe(true, 'button should have cdk-program-focused class');
    expect(changeHandler).toHaveBeenCalledWith('program');
  }));

  it('focusVia keyboard should simulate keyboard focus', fakeAsync(() => {
    focusOriginMonitor.focusVia(buttonElement, 'keyboard');
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-keyboard-focused'))
        .toBe(true, 'button should have cdk-keyboard-focused class');
    expect(changeHandler).toHaveBeenCalledWith('keyboard');
  }));

  it('focusVia mouse should simulate mouse focus', fakeAsync(() => {
    focusOriginMonitor.focusVia(buttonElement, 'mouse');
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-mouse-focused'))
        .toBe(true, 'button should have cdk-mouse-focused class');
    expect(changeHandler).toHaveBeenCalledWith('mouse');
  }));

  it('focusVia mouse should simulate mouse focus', fakeAsync(() => {
    focusOriginMonitor.focusVia(buttonElement, 'touch');
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-touch-focused'))
        .toBe(true, 'button should have cdk-touch-focused class');
    expect(changeHandler).toHaveBeenCalledWith('touch');
  }));

  it('focusVia program should simulate programmatic focus', fakeAsync(() => {
    focusOriginMonitor.focusVia(buttonElement, 'program');
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(buttonElement.classList.contains('cdk-focused'))
        .toBe(true, 'button should have cdk-focused class');
    expect(buttonElement.classList.contains('cdk-program-focused'))
        .toBe(true, 'button should have cdk-program-focused class');
    expect(changeHandler).toHaveBeenCalledWith('program');
  }));

  it('should remove focus classes on blur', fakeAsync(() => {
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');
    expect(changeHandler).toHaveBeenCalledWith('program');

    // Call `blur` directly because invoking `buttonElement.blur()` does not always trigger the
    // handler on IE11 on SauceLabs.
    focusOriginMonitor._onBlur({} as any, buttonElement);
    fixture.detectChanges();

    expect(buttonElement.classList.length)
        .toBe(0, 'button should not have any focus classes');
    expect(changeHandler).toHaveBeenCalledWith(null);
  }));

  it('should remove classes on stopMonitoring', fakeAsync(() => {
    buttonElement.focus();
    fixture.detectChanges();
    tick();

    expect(buttonElement.classList.length)
        .toBe(2, 'button should have exactly 2 focus classes');

    focusOriginMonitor.stopMonitoring(buttonElement);
    fixture.detectChanges();

    expect(buttonElement.classList.length).toBe(0, 'button should not have any focus classes');
  }));
});


describe('cdkMonitorFocus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StyleModule],
      declarations: [
        ButtonWithFocusClasses,
        ComplexComponentWithMonitorElementFocus,
        ComplexComponentWithMonitorSubtreeFocus,
      ],
    }).compileComponents();
  });

  describe('button with cdkMonitorElementFocus', () => {
    let fixture: ComponentFixture<ButtonWithFocusClasses>;
    let buttonElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(ButtonWithFocusClasses);
      fixture.detectChanges();

      spyOn(fixture.componentInstance, 'focusChanged');
      buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
      patchElementFocus(buttonElement);
    });

    it('should initially not be focused', () => {
      expect(buttonElement.classList.length).toBe(0, 'button should not have focus classes');
    });

    it('should detect focus via keyboard', fakeAsync(() => {
      // Simulate focus via keyboard.
      dispatchKeyboardEvent(document, 'keydown', TAB);
      buttonElement.focus();
      fixture.detectChanges();
      tick();

      expect(buttonElement.classList.length)
          .toBe(2, 'button should have exactly 2 focus classes');
      expect(buttonElement.classList.contains('cdk-focused'))
          .toBe(true, 'button should have cdk-focused class');
      expect(buttonElement.classList.contains('cdk-keyboard-focused'))
          .toBe(true, 'button should have cdk-keyboard-focused class');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith('keyboard');
    }));

    it('should detect focus via mouse', fakeAsync(() => {
      // Simulate focus via mouse.
      dispatchMouseEvent(buttonElement, 'mousedown');
      buttonElement.focus();
      fixture.detectChanges();
      tick();

      expect(buttonElement.classList.length)
          .toBe(2, 'button should have exactly 2 focus classes');
      expect(buttonElement.classList.contains('cdk-focused'))
          .toBe(true, 'button should have cdk-focused class');
      expect(buttonElement.classList.contains('cdk-mouse-focused'))
          .toBe(true, 'button should have cdk-mouse-focused class');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith('mouse');
    }));

    it('should detect focus via touch', fakeAsync(() => {
      // Simulate focus via touch.
      dispatchMouseEvent(buttonElement, 'touchstart');
      buttonElement.focus();
      fixture.detectChanges();
      tick(TOUCH_BUFFER_MS);

      expect(buttonElement.classList.length)
          .toBe(2, 'button should have exactly 2 focus classes');
      expect(buttonElement.classList.contains('cdk-focused'))
          .toBe(true, 'button should have cdk-focused class');
      expect(buttonElement.classList.contains('cdk-touch-focused'))
          .toBe(true, 'button should have cdk-touch-focused class');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith('touch');
    }));

    it('should detect programmatic focus', fakeAsync(() => {
      // Programmatically focus.
      buttonElement.focus();
      fixture.detectChanges();
      tick();

      expect(buttonElement.classList.length)
          .toBe(2, 'button should have exactly 2 focus classes');
      expect(buttonElement.classList.contains('cdk-focused'))
          .toBe(true, 'button should have cdk-focused class');
      expect(buttonElement.classList.contains('cdk-program-focused'))
          .toBe(true, 'button should have cdk-program-focused class');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith('program');
    }));

    it('should remove focus classes on blur', fakeAsync(() => {
      buttonElement.focus();
      fixture.detectChanges();
      tick();

      expect(buttonElement.classList.length)
          .toBe(2, 'button should have exactly 2 focus classes');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith('program');

      buttonElement.blur();
      fixture.detectChanges();

      expect(buttonElement.classList.length)
          .toBe(0, 'button should not have any focus classes');
      expect(fixture.componentInstance.focusChanged).toHaveBeenCalledWith(null);
    }));
  });

  describe('complex component with cdkMonitorElementFocus', () => {
    let fixture: ComponentFixture<ComplexComponentWithMonitorElementFocus>;
    let parentElement: HTMLElement;
    let childElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(ComplexComponentWithMonitorElementFocus);
      fixture.detectChanges();

      parentElement = fixture.debugElement.query(By.css('div')).nativeElement;
      childElement = fixture.debugElement.query(By.css('button')).nativeElement;

      patchElementFocus(parentElement);
      patchElementFocus(childElement);
    });

    it('should add focus classes on parent focus', fakeAsync(() => {
      parentElement.focus();
      fixture.detectChanges();
      tick();

      expect(parentElement.classList.length).toBe(2, 'button should have exactly 2 focus classes');
    }));

    it('should not add focus classes on child focus', fakeAsync(() => {
      childElement.focus();
      fixture.detectChanges();
      tick();

      expect(parentElement.classList.length).toBe(0, 'button should not have any focus classes');
    }));
  });

  describe('complex component with cdkMonitorSubtreeFocus', () => {
    let fixture: ComponentFixture<ComplexComponentWithMonitorSubtreeFocus>;
    let parentElement: HTMLElement;
    let childElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(ComplexComponentWithMonitorSubtreeFocus);
      fixture.detectChanges();

      parentElement = fixture.debugElement.query(By.css('div')).nativeElement;
      childElement = fixture.debugElement.query(By.css('button')).nativeElement;

      patchElementFocus(parentElement);
      patchElementFocus(childElement);
    });

    it('should add focus classes on parent focus', fakeAsync(() => {
      parentElement.focus();
      fixture.detectChanges();
      tick();

      expect(parentElement.classList.length).toBe(2, 'button should have exactly 2 focus classes');
    }));

    it('should add focus classes on child focus', fakeAsync(() => {
      childElement.focus();
      fixture.detectChanges();
      tick();

      expect(parentElement.classList.length).toBe(2, 'button should have exactly 2 focus classes');
    }));
  });
});


@Component({
  template: `<button>focus me!</button>`
})
class PlainButton {
  constructor(public renderer: Renderer2) {}
}


@Component({
  template: `<button cdkMonitorElementFocus (cdkFocusChange)="focusChanged($event)"></button>`
})
class ButtonWithFocusClasses {
  focusChanged(_origin: FocusOrigin) {}
}


@Component({
  template: `<div tabindex="0" cdkMonitorElementFocus><button></button></div>`
})
class ComplexComponentWithMonitorElementFocus {}


@Component({
  template: `<div tabindex="0" cdkMonitorSubtreeFocus><button></button></div>`
})
class ComplexComponentWithMonitorSubtreeFocus {}


/**
 * Patches an elements focus and blur methods to emit events consistently and predictably.
 * This is necessary, because some browsers, like IE11, will call the focus handlers asynchronously,
 * while others won't fire them at all if the browser window is not focused.
 */
function patchElementFocus(element: HTMLElement) {
  element.focus = () => dispatchFakeEvent(element, 'focus');
  element.blur = () => dispatchFakeEvent(element, 'blur');
}
