import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { applyCssClass, CssClassBuilder, KeyUtil, RtlService } from '../utils/public_api';
import { PopoverDirective } from '../popover/public_api';

export const SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true
};

export enum SliderValueTargets {
    SINGLE_SLIDER,
    RANGE_SLIDER1,
    RANGE_SLIDER2
}

export enum RangeHandles {
    First,
    Second
}

export interface SliderTickMark {
    value: number;
    label?: string;
}

const MIN_DISTANCE_BETWEEN_TICKS = 8;

let sliderId = 0;

@Component({
    selector: 'fd-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SLIDER_VALUE_ACCESSOR]
})
export class SliderComponent
    implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor, CssClassBuilder {
    /** Slider id, it has some default value if not set,  */
    @Input()
    @HostBinding('attr.id')
    id = 'fd-slider-id-' + sliderId++;

    /** User's custom classes */
    @Input()
    class: string;

    /** Id of the element that labels object number. */
    @Input()
    ariaLabelledBy: string = null;

    /** Aria label for the object number. */
    @Input()
    ariaLabel: string = null;

    /** Minimum value. */
    @Input()
    min = 0;

    /** Maximum value. */
    @Input()
    max = 100;

    /** Step value. */
    @Input()
    step = 1;

    /** Jump value. */
    @Input()
    jump = 10;

    /** Slider mode. */
    @Input()
    mode: 'single' | 'range' = 'single';

    /** Toggles the visibility of tick marks. */
    @Input()
    showTicks = false;

    /** Toggles the visibility of tick mark labels. Must be used in conjunction with 'showTicks' */
    @Input()
    showTicksLabels = false;

    /** Array of custom labels values to use for Slider. */
    @Input()
    customLabelsValues: SliderTickMark[] = [];

    /** Tooltip can be two types, 'readonly' to display value and 'editable' to make the ability to set and display value. */
    @Input()
    tooltipMode: 'readonly' | 'editable' = 'readonly';

    /** Hides display of colored progress bar. */
    @Input()
    hideProgressBar = false;

    /** Whether the control is disabled. */
    @Input()
    disabled = false;

    /** Control value */
    @Input()
    get value(): number | number[] {
        return this._value;
    }

    /** Set control value */
    set value(val: number | number[]) {
        if (typeof val === 'string') {
            val = Number(val);
        }

        if (this.value === val) {
            return;
        }

        if (!this._isRange && typeof val === 'number') {
            this._progress = this._calcProgress(val, true);
        }

        if (this._isRange && Array.isArray(val) && this._handle1Value === 0 && this._handle2Value === 0) {
            this._setRangeHandleValueAndPosition(RangeHandles.First, val[0]);
            this._setRangeHandleValueAndPosition(RangeHandles.Second, val[1]);
        }

        this._value = val;
        this.onChange(val);
        this.onTouched();
        this._cdr.markForCheck();
    }

    /** @hidden */
    get _popoverValueRef(): number[] {
        return [this.value as number, this._handle1Value, this._handle2Value];
    }

    /** @hidden */
    @ViewChild('track', { read: ElementRef })
    trackEl: ElementRef<HTMLDivElement>;

    /** @hidden */
    @ViewChild('handle', { read: ElementRef })
    handle: ElementRef<HTMLDivElement>;

    /** @hidden */
    @ViewChild('rangeHandle1', { read: ElementRef })
    rangeHandle1: ElementRef<HTMLDivElement>;

    /** @hidden */
    @ViewChild('rangeHandle2', { read: ElementRef })
    rangeHandle2: ElementRef<HTMLDivElement>;

    /** @hidden */
    @ViewChildren(PopoverDirective)
    _popovers: QueryList<PopoverDirective>;

    /** @hidden */
    _value: number | number[] = 0;

    /** @hidden */
    _progress = 0;

    /** @hidden */
    _isRange = false;

    /** @hidden */
    _handle1Position = 0;

    /** @hidden */
    _handle2Position = 0;

    /** @hidden */
    _handle1Value = 0;

    /** @hidden */
    _handle2Value = 0;

    /** @hidden */
    _rangeProgress = 0;

    /** @hidden */
    _tickMarks: SliderTickMark[] = [];

    /** @hidden */
    _valuesBySteps: number[] = [];

    /** @hidden */
    _sliderValueTargets = SliderValueTargets;

    /** @hidden */
    _popoverInputFieldClass = `fd-slider-popover-input-${sliderId}`;

    /** @hidden */
    _isRtl = false;

    /**
     * @hidden
     * An RxJS Subject that will kill the data stream upon component’s destruction (for unsubscribing)
     */
    private readonly _onDestroy$: Subject<void> = new Subject<void>();

    /** @hidden */
    constructor(
        private readonly _elementRef: ElementRef,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _renderer: Renderer2,
        @Optional() private readonly _rtlService: RtlService
    ) {}

    /** @hidden */
    ngOnInit(): void {
        this._subscribeToRtl();
        this.buildComponentCssClass();
        this._checkIsInRangeMode();
        this._attachResizeListener();
    }

    /** @hidden */
    ngAfterViewInit(): void {
        this._constructTickMarks();
        this._constructValuesBySteps();
        this._onResize();
    }

    /** @hidden */
    ngOnChanges(): void {
        this.buildComponentCssClass();
        this._checkIsInRangeMode();
        this._constructTickMarks();
        this._constructValuesBySteps();
        this._recalcHandlePositions();
    }

    /** @hidden */
    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }

    @applyCssClass
    /**
     * @hidden
     * CssClassBuilder interface implementation
     * function must return single string
     * function is responsible for order which css classes are applied
     */
    buildComponentCssClass(): string[] {
        return ['fd-slider', this.class];
    }

    /** @hidden */
    elementRef(): ElementRef<any> {
        return this._elementRef;
    }

    /** @hidden */
    onChange: Function = () => {};

    /** @hidden */
    onTouched: Function = () => {};

    /** @hidden */
    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    /** @hidden */
    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    /** @hidden */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /** @hidden */
    writeValue(value: number | number[]): void {
        this.value = value;
    }

    /** @hidden */
    onTrackClick(event: MouseEvent): void {
        if (this._isRange) {
            return;
        }

        this.writeValue(this._calculateValueFromPointerPosition(event));
        this._updatePopoversPosition();
    }

    /** @hidden */
    onHandleClick(event: MouseEvent): void {
        const unsubscribeFromMousemove = this._renderer.listen('document', 'mousemove', (moveEvent) => {
            this._updatePopoversPosition();

            if (!this._isRange) {
                this.writeValue(this._calculateValueFromPointerPosition(moveEvent));

                return;
            }

            let handleIndex: RangeHandles;
            if (event.target === this.rangeHandle1.nativeElement) {
                handleIndex = RangeHandles.First;
            }

            if (event.target === this.rangeHandle2.nativeElement) {
                handleIndex = RangeHandles.Second;
            }

            const value = this._calculateValueFromPointerPosition(moveEvent);
            this._setRangeHandleValueAndPosition(handleIndex, value);

            this.writeValue(this._constructRangeModelValue());
            this._cdr.detectChanges();
        });

        const unsubscribeFromMouseup = this._renderer.listen('document', 'mouseup', () => {
            unsubscribeFromMousemove();
            unsubscribeFromMouseup();
        });
    }

    /** @hidden */
    onKeyDown(event: KeyboardEvent): void {
        const allowedKeys: number[] = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];
        if (!KeyUtil.isKeyCode(event, allowedKeys)) {
            return;
        }

        event.preventDefault();

        const diff = event.shiftKey ? this.jump : this.step;
        let newValue: number | null = null;
        let prevValue = this.value as number;
        let handleIndex: RangeHandles;
        if (this._isRange) {
            if (event.target === this.rangeHandle1.nativeElement) {
                prevValue = this._handle1Value;
                handleIndex = RangeHandles.First;
            }

            if (event.target === this.rangeHandle2.nativeElement) {
                prevValue = this._handle2Value;
                handleIndex = RangeHandles.Second;
            }
        }

        if (KeyUtil.isKeyCode(event, LEFT_ARROW) || KeyUtil.isKeyCode(event, DOWN_ARROW)) {
            newValue = prevValue - diff;
        }

        if (KeyUtil.isKeyCode(event, RIGHT_ARROW) || KeyUtil.isKeyCode(event, UP_ARROW)) {
            newValue = prevValue + diff;
        }

        if (newValue === null) {
            return;
        }

        newValue = this._processNewValue(newValue);

        if (!this._isRange) {
            this.writeValue(newValue);
            this._updatePopoversPosition();

            return;
        }

        this._setRangeHandleValueAndPosition(handleIndex, newValue);
        this.writeValue(this._constructRangeModelValue());
        this._updatePopoversPosition();
        this._cdr.detectChanges();
    }

    /** @hidden */
    _showPopovers(): void {
        this._popovers.forEach((popover) => popover.open());
    }

    /** @hidden */
    _hidePopovers(): void {
        console.log(11111);
        const elementsToCheck = [
            this.handle?.nativeElement,
            this.rangeHandle1?.nativeElement,
            this.rangeHandle2?.nativeElement
        ];
        const handleFocused = elementsToCheck.some((el) => document.activeElement === el);
        const popoverInputFocused = document.activeElement.classList.contains(this._popoverInputFieldClass);
        if (handleFocused || popoverInputFocused) {
            const unsubscribeFromBlur = this._renderer.listen(document.activeElement, 'focusout', () => {
                setTimeout(() => {
                    console.log(2222222);
                    unsubscribeFromBlur();
                    this._hidePopovers();
                });
            });

            return;
        }

        this._popovers.forEach((popover) => popover.close());
    }

    /** @hidden */
    _updatePopoversPosition(): void {
        this._popovers.forEach((popover) => popover.updatePopper());
    }

    /** @hidden */
    _updateValueFromInput(value: string, target: SliderValueTargets): void {
        const newValue = this._processNewValue(+value);
        if (!this._isRange && target === SliderValueTargets.SINGLE_SLIDER) {
            this.writeValue(newValue);
            this.handle.nativeElement.focus();
            return;
        }

        if (target === SliderValueTargets.RANGE_SLIDER1) {
            this._setRangeHandleValueAndPosition(RangeHandles.First, newValue);
            this.rangeHandle1.nativeElement.focus();
        }

        if (target === SliderValueTargets.RANGE_SLIDER2) {
            this._setRangeHandleValueAndPosition(RangeHandles.Second, newValue);
            this.rangeHandle2.nativeElement.focus();
        }

        this.writeValue(this._constructRangeModelValue());
    }

    /** @hidden */
    private _calculateValueFromPointerPosition(event: MouseEvent): number {
        const { x, width } = this.trackEl.nativeElement.getBoundingClientRect();
        let percentage = (event.clientX - x) / width;
        if (this._isRtl) {
            percentage = 1 - (event.clientX - x) / width;
        }

        const newValue = this.min + percentage * (this.max - this.min);

        return this._processNewValue(newValue);
    }

    /** @hidden */
    private _processNewValue(newValue: number): number {
        if (newValue > this.max) {
            return this.max;
        }

        if (newValue < this.min) {
            return this.min;
        }

        const stepDiffArray = this._valuesBySteps
            .map((stepValue) => ({ diff: Math.abs(stepValue - newValue), value: stepValue }))
            .sort((a, b) => a.diff - b.diff);

        return stepDiffArray[0].value;
    }

    /** @hidden */
    private _setRangeHandleValueAndPosition(handleIndex: RangeHandles, value: number): void {
        const position = this._calcProgress(value, true);
        if (handleIndex === RangeHandles.First) {
            this._handle1Value = value;
            this._handle1Position = position;
        }

        if (handleIndex === RangeHandles.Second) {
            this._handle2Value = value;
            this._handle2Position = position;
        }

        this._rangeProgress = Math.abs(this._handle2Position - this._handle1Position);
    }

    /** @hidden */
    private _constructRangeModelValue(): number[] {
        return [Math.min(this._handle1Value, this._handle2Value), Math.max(this._handle1Value, this._handle2Value)];
    }

    /** @hidden */
    private _attachResizeListener(): void {
        fromEvent(window, 'resize')
            .pipe(debounceTime(500), takeUntil(this._onDestroy$))
            .subscribe(() => this._onResize());
    }

    /** @hidden */
    private _onResize(): void {
        this._constructTickMarks();
        this._cdr.detectChanges();
    }

    /** @hidden */
    private _constructValuesBySteps(): void {
        try {
            this._valuesBySteps = Array((this.max - this.min) / this.step + 1)
                .fill({})
                .map((_, i) => Number((this.min + i * this.step).toFixed(2)));
        } catch (e) {}
    }

    /** @hidden */
    private _constructTickMarks(): void {
        if (!this.showTicks) {
            this._tickMarks = [];
            return;
        }

        if (this.customLabelsValues.length) {
            this._tickMarks = [...this.customLabelsValues];
        } else {
            try {
                const tickMarksCount = (this.max - this.min) / this.step + 1;
                if (tickMarksCount > this._maxTickMarksNumber) {
                    this._tickMarks = [{ value: this.min }, { value: this.max }];

                    return;
                }

                this._tickMarks = Array(tickMarksCount)
                    .fill({})
                    .map((_, i) => ({ value: this.min + i * this.step }));
            } catch (e) {}
        }

        this._cdr.detectChanges();
    }

    /** @hidden */
    private get _maxTickMarksNumber(): number {
        if (!this.trackEl || !this.trackEl.nativeElement) {
            return;
        }

        return Math.floor(this.trackEl.nativeElement.getBoundingClientRect().width / MIN_DISTANCE_BETWEEN_TICKS);
    }

    /** @hidden */
    private _calcProgress(value: number, skipRtl = false): number {
        let progress = ((value - this.min) / (this.max - this.min)) * 100;
        if (!skipRtl && this._isRtl) {
            progress = 100 - progress;
        }

        return progress;
    }

    /** @hidden */
    private _recalcHandlePositions(): void {
        if (this._isRange) {
            this._handle1Position = this._calcProgress(this._handle1Value);
            this._handle2Position = this._calcProgress(this._handle2Value);
            this._rangeProgress = Math.abs(this._handle2Position - this._handle1Position);
        }

        this._progress = this._calcProgress(this.value as number, true);
        this._cdr.markForCheck();
    }

    /** @hidden */
    private _checkIsInRangeMode(): void {
        this._isRange = this.mode === 'range';
    }

    /** @hidden Rtl change subscription */
    private _subscribeToRtl(): void {
        this._rtlService?.rtl.pipe(takeUntil(this._onDestroy$)).subscribe((isRtl: boolean) => {
            this._isRtl = isRtl;
            this._cdr.detectChanges();
        });
    }
}
