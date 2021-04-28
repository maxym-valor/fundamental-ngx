import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type ResizeDirection = 'vertical' | 'horizontal' | 'both';

// Card resizes in step of fixed values. values are in pixel
export const HorizontalResizeStep = 320;
export const verticalResizeStep = 16;
export const gap = 16;
export const horizontalResizeOffset = 20;
export const verticalResizeOffset = 10;

let cardRank = 1;
let cardUniqueId = 0;

@Component({
    selector: 'fd-resizable-card-item',
    templateUrl: 'resizable-card-item.component.html',
    styleUrls: ['./resizable-card-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardItemComponent implements OnInit, OnDestroy, FocusableOption {
    /** Set card properties from the config received */
    @Input()
    get config(): ResizableCardItemConfig {
        return this._config;
    }

    set config(config: ResizableCardItemConfig) {
        this._config = config;
        this._initialSetup();
        this._cd.detectChanges();
    }

    /** Item id attribute value */
    @Input()
    itemId = `fd-card-item-${cardUniqueId++}`;

    /** card title */
    @Input()
    title: string;

    /** Position rank  of card */
    @Input()
    rank: number = cardRank++;

    /** Number of column span card width takes*/
    @Input()
    get cardWidthColSpan(): number {
        return this._cardWidthColSpan;
    }
    set cardWidthColSpan(colSpan: number) {
        this._cardWidthColSpan = colSpan;
        this._setCardWidth();
    }

    /** Number of row span card height takes*/
    @Input()
    get cardHeightRowSpan(): number {
        return this._cardHeightRowSpan;
    }
    set cardHeightRowSpan(rowSpan: number) {
        this._cardHeightRowSpan = rowSpan;
        this._setCardHeight();
    }

    /** Number of row span card mini header height takes*/
    @Input()
    get cardMiniHeaderRowSpan(): number {
        return this._cardMiniHeaderRowSpan;
    }
    set cardMiniHeaderRowSpan(rowSpan: number) {
        this._cardMiniHeaderRowSpan = rowSpan;
        this._setCardMiniHeaderHeight();
    }

    /** Number of row span card mini content height takes*/
    @Input()
    get cardMiniContentRowSpan(): number {
        return this._cardMiniContentRowSpan;
    }
    set cardMiniContentRowSpan(rowSpan: number) {
        this._cardMiniContentRowSpan = rowSpan;
        this._setCardMiniContentHeight();
    }

    /** Card can be set resizable false to restrict card size change */
    @Input()
    resizable = true;

    /** Set card left position */
    @Input()
    @HostBinding('style.left.px')
    left = 0;

    /** Set card top position */
    @Input()
    @HostBinding('style.top.px')
    top = 0;

    /** @hidden while resizing this value will change to a greater value */
    @HostBinding('style.z-index')
    zIndex = 0;

    /** @hidden */
    @HostBinding('style.position')
    position = 'absolute';

    /** Emits when card resize is reached to one new step in horizontal or vertical direction */
    @Output()
    stepChange: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    /** Emits when card is still resizing */
    @Output()
    resizing: EventEmitter<ResizingEvent> = new EventEmitter<ResizingEvent>();

    /** Emits when card resize is completed */
    @Output()
    resized: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    /** Emits when card is dragged and dropped at different position in layout */
    @Output()
    dropped: EventEmitter<CardDropped> = new EventEmitter<CardDropped>();

    /** Emits when card height is reduced to show only header */
    @Output()
    miniHeaderReached: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    /** Emits when minimum height of card content area is reached */
    @Output()
    miniContentReached: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    /** show corner resize icon on hover over card */
    showingResizeIcon = false;

    /** show border when card is resizing */
    showBorder = false;

    /** starting column position of card */
    startingColumnPosition: number;

    /** card width in px. Default value to 20rem */
    cardWidth: number = HorizontalResizeStep;

    /** card height in px */
    cardHeight: number;

    /** Mini-header height of card */
    cardMiniHeaderHeight: number;

    /** Mini-content height of card to display minimum valid content */
    cardMiniContentHeight: number;

    /** @hidden Helps in emitting resizing event at a given interval */
    private _resizeDebounce$: Subject<PositionChange> = new Subject<PositionChange>();

    private _cardWidthColSpan: number;
    private _cardHeightRowSpan: number;
    private _cardMiniHeaderRowSpan: number;
    private _cardMiniContentRowSpan?: number;

    /** @hidden config values for card */
    private _config: ResizableCardItemConfig;
    private _prevX: number;
    private _prevY: number;
    private _prevCardWidth: number;
    private _prevCardHeight: number;

    /** @hidden flag to control resize */
    private _resize = false;
    private _resizeDirection: ResizeDirection;
    private _maxColumn: number;

    constructor(private readonly _cd: ChangeDetectorRef, private readonly _elementRef: ElementRef) {}

    /** @hidden */
    ngOnInit(): void {
        this._resizeDebounce$.pipe(debounceTime(20)).subscribe((positionChange: PositionChange) => {
            this.resizing.emit(new ResizingEvent(this, positionChange));
        });
    }

    /** @hidden */
    ngOnDestroy(): void {
        this._resizeDebounce$.complete();
    }

    /**
     * When resize handler is pressed and resizing may start.
     * @param event: MouseEvent
     * @param resizeDirection: which handler is pressed to resize
     */
    onMouseDown(event: MouseEvent, resizeDirection: ResizeDirection): void {
        event.preventDefault();
        if (!this.resizable) {
            return;
        }

        this.showingResizeIcon = true;
        this._resize = true;
        this._prevX = event.clientX;
        this._prevY = event.clientY;
        this._prevCardWidth = this.cardWidth;
        this._prevCardHeight = this.cardHeight;
        this._resizeDirection = resizeDirection;
    }

    /**
     * When mouse moves to resize the card.
     * using window:mousemove so, resize will happen smoothly
     * @param event: MouseEvent
     */
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        if (!this.resizable) {
            return;
        }

        // saves from un-necessary resize
        if (!this._resize) {
            return;
        }

        if (!this.showBorder) {
            this.showBorder = true;
        }

        // resizing card will go over other cards
        this.zIndex = 1;

        if (this._resizeDirection === 'both') {
            this._horizontalResizing(event.clientX);
            this._verticalResizing(event.clientY);
        } else if (this._resizeDirection === 'horizontal') {
            this._horizontalResizing(event.clientX);
        } else {
            this._verticalResizing(event.clientY);
        }

        // Emit resizing event on some interval. improves performance.
        this._resizeDebounce$.next(new PositionChange(this._prevX - event.clientX, this._prevY - event.clientY));

        const heightDiff = Math.abs(this.cardHeight - this._prevCardHeight);
        const widthDiff = Math.abs(this.cardWidth - this._prevCardWidth);

        // if card dimension change in step. horizontal or vertical.
        if (
            (heightDiff > 0 && heightDiff % verticalResizeStep === 0) ||
            (widthDiff > 0 && widthDiff % HorizontalResizeStep === 0)
        ) {
            this.stepChange.emit(this._getResizedEventObject());
        }

        this._prevX = event.clientX;
        this._prevY = event.clientY;
    }

    /**
     * when resizing of card stops
     * @param event: MouseEvent
     */
    @HostListener('document: mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (!this.resizable) {
            return;
        }

        // if card was not resizing
        if (!this._resize) {
            return;
        }

        // if resize offset reached then only resize complete otherwise revert to original state
        if (this._resizeOffsetReached()) {
            // increase/decrease width of card in order of 20rem
            if (Math.abs(this.cardWidth - this._prevCardWidth) > 0) {
                this._horizontalStepResizing();
            }

            // increase/decrease height of card in order of 1rem
            if (Math.abs(this.cardHeight - this._prevCardHeight) > 0) {
                this._verticalStepResizing();
            }

            this._stopResizing();
            this._cd.markForCheck();
        }
    }

    /** Sets focus on the element */
    focus(): void {
        const header = this._elementRef.nativeElement.querySelector('.fd-card__header');
        if (header) {
            header.focus();
        }
    }

    /** Shows resize icon */
    showResizeIcon(event: MouseEvent): void {
        this.showingResizeIcon = true;
    }

    /** Hides resize icon */
    hideResizeIcon(event: MouseEvent): void {
        if (!this._resize) {
            this.showingResizeIcon = false;
        }
    }

    /** Returns max width for card, based on layout size passed */
    getMaxColSpan(layoutSize: string): number {
        switch (layoutSize) {
            case 'sm':
                this._maxColumn = 1;
                break;
            case 'md':
                this._maxColumn = 2;
                break;
            case 'lg':
                this._maxColumn = 3;
                break;
            case 'xl':
                this._maxColumn = 4;
                break;
        }
        return this._maxColumn;
    }

    /** Update card width if it exceeds column span based on layout */
    verifyUpdateCardWidth(layoutSize: string): void {
        const widthColSpan = this._config?.cardWidthColSpan || this.cardWidthColSpan;
        this._maxColumn = this.getMaxColSpan(layoutSize);
        if (widthColSpan > this._maxColumn) {
            this.cardWidthColSpan = this._maxColumn;
            this._setCardWidth();
        }
    }

    /** @hidden */
    elementRef(): ElementRef<ResizableCardItemComponent> {
        return this._elementRef;
    }

    /** @hidden Set card properties using config received */
    private _initialSetup(): void {
        this.cardWidthColSpan = this._config?.cardWidthColSpan || this.cardWidthColSpan;
        this.cardHeightRowSpan = this._config?.cardHeightRowSpan || this.cardHeightRowSpan;
        this.title = this._config?.title || this.title;
        this.rank = this._config?.rank || this.rank;
        this.cardMiniHeaderRowSpan = this._config?.cardMiniHeaderRowSpan || this.cardMiniHeaderRowSpan;
        this.cardMiniContentRowSpan = this._config?.cardMiniContentRowSpan || this.cardMiniContentRowSpan;
        this.resizable = this._config.resizable || this.resizable;
    }

    /** @hidden Returns true when resize offset is crossed */
    private _resizeOffsetReached(): boolean {
        let offsetReached = true;
        if (
            Math.abs(this.cardWidth - this._prevCardWidth) < horizontalResizeOffset &&
            Math.abs(this.cardHeight - this._prevCardHeight) < verticalResizeOffset
        ) {
            offsetReached = false;
            this.cardWidth = this._prevCardWidth;
            this.cardHeight = this._prevCardHeight;

            // stop resizing steps, without raising resize complete event
            if (this._resize) {
                this._resize = false;
                this.zIndex = 0;
                this.showBorder = false;
            }
        }
        return offsetReached;
    }

    /**
     * @hidden make horizontal resize only on step of 20rem
     * raises stepChange event
     */
    private _horizontalStepResizing(): void {
        // positive value indicates that width has increased
        const widthIncrement = this.cardWidth - this._prevCardWidth;
        const cardSpan = Math.floor(this.cardWidth / HorizontalResizeStep);
        const cardSpanFraction = this.cardWidth % HorizontalResizeStep;

        if (widthIncrement > 0) {
            this.cardWidth =
                cardSpanFraction > 0 ? (cardSpan + 1) * HorizontalResizeStep : cardSpan * HorizontalResizeStep;
        } else {
            this.cardWidth = cardSpan * HorizontalResizeStep;
        }

        // Add inner gap in  cardWidth if width is more than 1 column
        if (this.cardWidth > 320) {
            this.cardWidth = this.cardWidth + (this.cardWidth / HorizontalResizeStep - 1) * gap;
        }
        this.cardWidthColSpan = Math.floor(this.cardWidth / HorizontalResizeStep);

        this.stepChange.emit(this._getResizedEventObject());
    }

    /**
     * @hidden make vertical resize only on step of 1rem
     * raises stepChange event
     */
    private _verticalStepResizing(): void {
        // positive value indicates that height has increased
        const heightIncrement = this.cardHeight - this._prevCardHeight;
        const cardHeightSpan = Math.floor(this.cardHeight / verticalResizeStep);
        const cardSpanFraction = this.cardHeight % verticalResizeStep;

        if (heightIncrement > 0) {
            this.cardHeight =
                cardSpanFraction > 0 ? (cardHeightSpan + 1) * verticalResizeStep : cardHeightSpan * verticalResizeStep;
        } else {
            this.cardHeight = cardHeightSpan * verticalResizeStep;
        }

        this.cardHeightRowSpan = Math.floor(this.cardHeight / verticalResizeStep);

        this.stepChange.emit(this._getResizedEventObject());
    }

    /**
     * @hidden Resize card horizontally by checking boundary condition
     * @param xPosition: current x-position of cursor
     */
    private _horizontalResizing(xPosition: number): void {
        this.cardWidth = this.cardWidth - (this._prevX - xPosition);

        const maxCardWidth = this._maxColumn * HorizontalResizeStep + (this._maxColumn - 1) * gap;
        if (this.cardWidth > maxCardWidth) {
            this.cardWidth = maxCardWidth;
        } else if (this.cardWidth < HorizontalResizeStep) {
            this.cardWidth = HorizontalResizeStep;
        }
    }

    /**
     * @hidden Resize card vertically.
     * takes care of mini-header height and mini-content height
     * @param yPosition: current y-position of cursor
     */
    private _verticalResizing(yPosition: number): void {
        if (this.cardHeight === this.cardMiniHeaderHeight) {
            // if card height is already at mini-header height
            if (this._prevY - yPosition > 0) {
                // decreasing height
                // if miniHeader height reached, stop resizing
                this.cardHeight = this.cardMiniHeaderHeight;
            } else {
                // increasing height
                this.cardHeight = this.cardMiniHeaderHeight + this.cardMiniContentHeight;
                this._stopResizing();
                this.miniContentReached.emit(this._getResizedEventObject());
            }
        } else if (this.cardHeight < this.cardMiniContentHeight + this.cardMiniHeaderHeight) {
            // if card height is between mini-header and mini-content
            // have to do both way. increase height and decrease height
            if (this._prevY - yPosition > 0) {
                // decreasing height
                // miniHeader height reached, stop resizing
                this.cardHeight = this.cardMiniHeaderHeight;
                this._stopResizing();
                this.miniHeaderReached.emit(this._getResizedEventObject());
            } else {
                this.cardHeight = this.cardMiniHeaderHeight + this.cardMiniContentHeight;
                this._stopResizing();
                this.miniContentReached.emit(this._getResizedEventObject());
            }
        } else {
            this.cardHeight = this.cardHeight - (this._prevY - yPosition);
        }

        // stop resizing on miniContent height
        if (this.cardHeight <= this.cardMiniContentHeight + this.cardMiniHeaderHeight) {
            this.miniContentReached.emit(this._getResizedEventObject());
            this._stopResizing();
        }
    }

    /** @hidden reset involved variables while resizing */
    private _stopResizing(): void {
        if (this._resize) {
            this._resize = false;
            this.zIndex = 0;
            this.showBorder = false;
            this.resized.emit(this._getResizedEventObject());
        }
    }

    /** @hidden Returns cardWidth based on card column span */
    private _setCardWidth(): void {
        this.cardWidth = this._cardWidthColSpan * HorizontalResizeStep + (this._cardWidthColSpan - 1) * gap;
        this._cd.markForCheck();
    }

    /** @hidden Returns cardHeight based on card row span */
    private _setCardHeight(): void {
        this.cardHeight = this._cardHeightRowSpan * verticalResizeStep;
        this._cd.markForCheck();
    }

    /** @hidden Returns card mini header height */
    private _setCardMiniHeaderHeight(): void {
        this.cardMiniHeaderHeight = this._cardMiniHeaderRowSpan * verticalResizeStep;
        this._cd.markForCheck();
    }

    /** @hidden Returns card mini content height */
    private _setCardMiniContentHeight(): void {
        this.cardMiniContentHeight = this._cardMiniContentRowSpan * verticalResizeStep;
        this._cd.markForCheck();
    }

    /** @hidden Returns ResizedEvent object to emit. */
    private _getResizedEventObject(): ResizedEvent {
        return new ResizedEvent(
            this,
            this._prevCardWidth,
            this._prevCardHeight,
            this.cardWidth,
            this.cardHeight,
            this._cardWidthColSpan,
            this._cardHeightRowSpan
        );
    }
}

/** Config interface for card properties */
export interface ResizableCardItemConfig {
    title?: string;
    rank?: number;
    cardWidthColSpan?: number;
    cardHeightRowSpan?: number;
    cardMiniHeaderRowSpan?: number;
    cardMiniContentRowSpan?: number;
    resizable?: boolean;
}

/** Change in card position */
export class PositionChange {
    constructor(public xPositionChange: number, public yPositionChange: number) {}
}

/** Object to emit on resizing */
export class ResizingEvent {
    constructor(public card: ResizableCardItemComponent, public positionChange: PositionChange) {}
}

/** Object to emit on resize complete */
export class ResizedEvent {
    constructor(
        public card: ResizableCardItemComponent,
        public prevCardWidth: number,
        public prevCardHeight: number,
        public cardWidth: number,
        public cardHeight: number,
        public cardWidthColSpan: number,
        public cardHeightRowSpan: number
    ) {}
}

/** Object to emit on card dragged and dropped */
export class CardDropped {
    constructor(
        public previousIndex: number,
        public currentIndex: number,
        public items: ResizableCardItemComponent[]
    ) {}
}
