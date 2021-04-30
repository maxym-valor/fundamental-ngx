import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

export type ResizeDirection = 'vertical' | 'horizontal' | 'both';

// Card resizes in step of fixed values. values are in pixel
export const horizontalResizeStep = 320;
export const verticalResizeStep = 16;
export const gap = 16;
export const horizontalResizeOffset = 160;
export const verticalResizeOffset = 10;
export type CardState = 1 | 0 | -1;

let cardRank = 1;
let cardUniqueId = 0;

@Component({
    selector: 'fd-resizable-card-item',
    templateUrl: 'resizable-card-item.component.html',
    styleUrls: ['./resizable-card-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardItemComponent implements FocusableOption {
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

    /** Position rank  of card.
     * using setter to determine max value between user given value and default value
     * */
    @Input()
    get rank(): number {
        return this._rank;
    }
    set rank(rankValue: number) {
        this._rank = rankValue ? rankValue : cardRank++;
        if (rankValue > cardRank) {
            cardRank = rankValue;
        }
    }

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

    /** Emits when card is still resizing */
    @Output()
    resizing: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    /** Emits when card resize is completed */
    @Output()
    resized: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

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

    /** starting column position of card. starts with 0 */
    startingColumnPosition: number;

    /** card width in px. Default value to 20rem */
    cardWidth: number = horizontalResizeStep;

    /** card height in px */
    cardHeight: number;

    /** Mini-header height of card */
    cardMiniHeaderHeight: number;

    /** Mini-content height of card to display minimum valid content */
    cardMiniContentHeight: number;

    resizeIndicationBorderWidth = 0;

    /** Denotes if card is currently expanding or contracting horizontally */
    // +1 denotes increasing, -1 denotes decreasing and 0 denotes card-state has not changed horizontally
    cardState: CardState = 0;

    /** Change in rank from previous value*/
    prevRank = 0;

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
    private _rank: number;

    constructor(private readonly _cd: ChangeDetectorRef, private readonly _elementRef: ElementRef) {}

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

        const { clientX, clientY } = event;
        switch (this._resizeDirection) {
            case 'both':
                this._horizontalResizing(clientX);
                this._verticalResizing(clientY);
                break;
            case 'horizontal':
                this._horizontalResizing(clientX);
                break;
            case 'vertical':
                this._verticalResizing(clientY);
        }

        const cardWidthColSpan = Math.floor(this.cardWidth / horizontalResizeStep);
        const cardWidthWithColumn = cardWidthColSpan * horizontalResizeStep + cardWidthColSpan * gap;

        const horizontalResizeThresholdReached = this.cardWidth - cardWidthWithColumn > horizontalResizeOffset;

        if (clientX > this._prevX) {
            // increasing width
            this.cardState = 1;

            if (horizontalResizeThresholdReached) {
                const futureCardWidth = (cardWidthColSpan + 1) * horizontalResizeStep + cardWidthColSpan * gap;
                this.resizeIndicationBorderWidth = futureCardWidth - this.cardWidth;
            } else {
                this.resizeIndicationBorderWidth = 0;
            }
        } else if (clientX < this._prevX) {
            // decreasing width
            this.cardState = -1;
            if (horizontalResizeThresholdReached) {
                const futureCardWidth = (cardWidthColSpan + 1) * horizontalResizeStep + cardWidthColSpan * gap;
                this.resizeIndicationBorderWidth = futureCardWidth - this.cardWidth;
            } else {
                this.resizeIndicationBorderWidth = 0;
            }
        }

        this._prevX = clientX;
        this._prevY = clientY;
        this._cd.detectChanges();

        // Emits resizing event.
        this.resizing.emit(this.getResizedEventObject());
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

    /** Sets focus on the element */
    focus(): void {
        const header = this._elementRef.nativeElement.querySelector('.fd-card__header');
        header?.focus();
    }

    /** Shows resize icon */
    showResizeIcon(event: MouseEvent): void {
        if (!this.resizable) {
            return;
        }
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
    elementRef(): ElementRef {
        return this._elementRef;
    }

    /** Returns ResizedEvent object to emit. */
    getResizedEventObject(): ResizedEvent {
        const newCardHeightRowSpan = Math.floor(this.cardHeight / verticalResizeStep);
        const newCardWidthColSpan = Math.floor(this.cardWidth / horizontalResizeStep);
        const newCardWidth = newCardWidthColSpan * horizontalResizeStep + newCardWidthColSpan * gap;

        const horizontalResizeThresholdReached = this.cardWidth - newCardWidth > horizontalResizeOffset;
        const newCardColSpan = horizontalResizeThresholdReached ? newCardWidthColSpan + 1 : newCardWidthColSpan;
        return new ResizedEvent(
            this,
            this._prevCardWidth,
            this._prevCardHeight,
            this.cardWidth,
            this.cardHeight,
            this._cardWidthColSpan,
            this._cardHeightRowSpan,
            newCardColSpan,
            newCardHeightRowSpan
        );
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
    private _horizontalResizeWithOffset(): void {
        // positive value indicates that width has increased
        const widthIncrement = this.cardWidth - this._prevCardWidth;
        const cardSpan = Math.floor(this.cardWidth / horizontalResizeStep);
        const cardSpanFraction = this.cardWidth % horizontalResizeStep;

        // when width increases
        if (widthIncrement > 0) {
            if (widthIncrement < horizontalResizeOffset + gap) {
                // widthIncrement is less than offset, do not increase width
                this.cardWidth = this._prevCardWidth;
            } else {
                // check value of cardSpanFraction, including gaps in cards
                let isCardSpanFractionCrossingOffset = false;
                isCardSpanFractionCrossingOffset = cardSpanFraction - (cardSpan - 1) * gap > horizontalResizeOffset;
                this.cardWidth = isCardSpanFractionCrossingOffset
                    ? (cardSpan + 1) * horizontalResizeStep
                    : cardSpan * horizontalResizeStep;
            }
        } else {
            // when width decreases
            if (Math.abs(widthIncrement) < horizontalResizeOffset) {
                // widthIncrement is less than offset, do not decrease width
                this.cardWidth = this._prevCardWidth;
            } else {
                // check value of cardSpanFraction, including gaps in cards
                let isCardSpanFractionCrossingOffset = false;
                isCardSpanFractionCrossingOffset = cardSpanFraction - cardSpan * gap > horizontalResizeOffset;
                this.cardWidth = isCardSpanFractionCrossingOffset
                    ? (cardSpan + 1) * horizontalResizeStep
                    : cardSpan * horizontalResizeStep;
            }
        }
    }

    /**
     * @hidden make horizontal resize only on step of 20rem
     */
    private _horizontalStepResizing(): void {
        this._horizontalResizeWithOffset();

        // Add inner gap in  cardWidth if width is more than 1 column
        if (this.cardWidth > horizontalResizeStep) {
            this.cardWidth = this.cardWidth + (this.cardWidth / horizontalResizeStep - 1) * gap;
        }
        this.cardWidthColSpan = Math.floor(this.cardWidth / horizontalResizeStep);
    }

    /**
     * @hidden make vertical resize only on step of 1rem
     */
    private _verticalStepResizing(): void {
        // positive value indicates that height has increased
        const cardHeightSpan = Math.floor(this.cardHeight / verticalResizeStep);
        const cardSpanFraction = this.cardHeight % verticalResizeStep;
        this.cardHeight =
            cardSpanFraction > verticalResizeOffset
                ? (cardHeightSpan + 1) * verticalResizeStep
                : cardHeightSpan * verticalResizeStep;

        this.cardHeightRowSpan = Math.floor(this.cardHeight / verticalResizeStep);
    }

    /**
     * @hidden Resize card horizontally by checking boundary condition
     * @param xPosition: current x-position of cursor
     */
    private _horizontalResizing(xPosition: number): void {
        this.cardWidth = this.cardWidth - (this._prevX - xPosition);

        const maxCardWidth = this._maxColumn * horizontalResizeStep + (this._maxColumn - 1) * gap;
        if (this.cardWidth > maxCardWidth) {
            this.cardWidth = maxCardWidth;
        } else if (this.cardWidth < horizontalResizeStep) {
            this.cardWidth = horizontalResizeStep;
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
                this.miniContentReached.emit(this.getResizedEventObject());
            }
        } else if (this.cardHeight < this.cardMiniContentHeight + this.cardMiniHeaderHeight) {
            // if card height is between mini-header and mini-content
            // have to do both way. increase height and decrease height
            if (this._prevY - yPosition > 0) {
                // decreasing height
                // miniHeader height reached, stop resizing
                this.cardHeight = this.cardMiniHeaderHeight;
                this._stopResizing();
                this.miniHeaderReached.emit(this.getResizedEventObject());
            } else {
                this.cardHeight = this.cardMiniHeaderHeight + this.cardMiniContentHeight;
                this._stopResizing();
                this.miniContentReached.emit(this.getResizedEventObject());
            }
        } else {
            this.cardHeight = this.cardHeight - (this._prevY - yPosition);
        }

        // stop resizing on miniContent height
        if (this.cardHeight <= this.cardMiniContentHeight + this.cardMiniHeaderHeight) {
            this.miniContentReached.emit(this.getResizedEventObject());
            this._stopResizing();
        }
    }

    /** @hidden reset involved variables while resizing */
    private _stopResizing(): void {
        if (this._resize) {
            this.cardState = 0;
            this.resizeIndicationBorderWidth = 0;
            this._resize = false;
            this.zIndex = 0;
            this.showBorder = false;
            this.resized.emit(this.getResizedEventObject());
        }
    }

    /** @hidden Returns cardWidth based on card column span */
    private _setCardWidth(): void {
        this.cardWidth = this._cardWidthColSpan * horizontalResizeStep + (this._cardWidthColSpan - 1) * gap;
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

/** Object to emit on resize complete */
export class ResizedEvent {
    constructor(
        public card: ResizableCardItemComponent,
        public prevCardWidth: number,
        public prevCardHeight: number,
        public cardWidth: number,
        public cardHeight: number,
        public cardWidthColSpan: number,
        public cardHeightRowSpan: number,
        public newCardWidthColSpan: number,
        public newCardHeightRowSpan: number
    ) {}
}
