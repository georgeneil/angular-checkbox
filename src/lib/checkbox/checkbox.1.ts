import {
  Component,
  ChangeDetectionStrategy,  
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MD_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdCheckbox),
  multi: true
};

@Component({
  moduleId: module.id,
  selector: 'md-checkbox, mat-checkbox',
  templateUrl: 'checkbox.html',
  styleUrls: ['checkbox.css'],
  host: {
    'class': 'mat-checkbox',
    '[id]': 'id',
    '[class.mat-checkbox-indeterminate]': 'indeterminate',
    '[class.mat-checkbox-checked]': 'checked',
    '[class.mat-checkbox-disabled]': 'disabled',
    '[class.mat-checkbox-label-before]': 'labelPosition == "before"',
  },
  providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  inputs: ['disabled', 'disableRipple', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdCheckbox implements ControlValueAccessor{
   
      /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   * @docs-private
   */
  onTouched: () => any = () => {};

    private _currentAnimationClass: string = '';

    private _checked: boolean = false;

      private _indeterminate: boolean = false;

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    writeValue(value: any) {
      this.checked = !!value;
    }

    /**
   * Registers a callback to be triggered when the value has changed.
   * Implemented as part of ControlValueAccessor.
   * @param fn Function to be called on change.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

    /**
   * Registers a callback to be triggered when the control has been touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be triggered when the checkbox is touched.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the checkbox's disabled state. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the checkbox should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

    /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input() get indeterminate() {
    return this._indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    let changed =  indeterminate != this._indeterminate;
    this._indeterminate = indeterminate;

    if (changed) {
      if (this._indeterminate) {
        this._transitionCheckState(TransitionCheckState.Indeterminate);
      } else {
        this._transitionCheckState(
          this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
      }
      // this.indeterminateChange.emit(this._indeterminate);
    }
  }

    private _transitionCheckState(newState: TransitionCheckState) {
      let oldState = this._currentCheckState;
      let renderer = this._renderer;
      let elementRef = this._elementRef;

      if (oldState === newState) {
        return;
      }
      // if (this._currentAnimationClass.length > 0) {
      //   renderer.removeClass(elementRef.nativeElement, this._currentAnimationClass);
      // }

      // this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(
      //     oldState, newState);
      // this._currentCheckState = newState;

      // if (this._currentAnimationClass.length > 0) {
      //   renderer.addClass(elementRef.nativeElement, this._currentAnimationClass);
      // }
    }

    /** Toggles the `checked` state of the checkbox. */
    toggle(): void {
      this.checked = !this.checked;
    }

   /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   *   indeterminate checkbox is clicked.
   * @param event
   */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    // this._removeFocusRipple();

    // if (!this.disabled) {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      // if (this._indeterminate) {
      //   Promise.resolve().then(() => {
      //     this._indeterminate = false;
      //     this.indeterminateChange.emit(this._indeterminate);
      //   });
      // }

      this.toggle();
      // this._transitionCheckState(
      //   this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      // this._emitChangeEvent();
    // }
  }
}