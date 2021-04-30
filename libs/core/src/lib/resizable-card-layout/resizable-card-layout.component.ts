import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewEncapsulation
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
    horizontalResizeStep,
    gap,
    ResizedEvent,
    ResizableCardItemComponent,
    ResizableCardItemConfig,
    verticalResizeStep,
    horizontalResizeOffset
} from './resizable-card-item/resizable-card-item.component';

const animationDuration = '1s';
const animationTimingFunction = 'ease-in-out';
export type LayoutSize = 'sm' | 'md' | 'lg' | 'xl';
export type ResizableCardLayoutConfig = Array<ResizableCardItemConfig>;

@Component({
    selector: 'fd-resizable-card-layout',
    templateUrl: 'resizable-card-layout.component.html',
    styleUrls: ['./resizable-card-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardLayoutComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
    /** Object for setting each card property */
    @Input()
    layoutConfig: ResizableCardLayoutConfig;

    /** Available layout width */
    @Input()
    get layoutSize(): LayoutSize {
        return this._layout;
    }

    set layoutSize(layoutSize: LayoutSize) {
        this._layout = layoutSize;
        this._setLayoutColumns(layoutSize);
    }

    /** Emits when card resize is reached to one new step in horizontal or vertical direction */
    @Output()
    stepChange: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

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

    /** Emits when layout changes */
    @Output()
    layoutChange: EventEmitter<ResizableCardLayoutConfig> = new EventEmitter<ResizableCardLayoutConfig>();

    /** @hidden */
    @ContentChildren(ResizableCardItemComponent)
    resizeCardItems: QueryList<ResizableCardItemComponent>;

    /** width for layout */
    layoutWidth: number;

    /** height for layout */
    layoutHeight: number;

    /** @hidden Number of columns in layout. considering 1 column width 20rem */
    private _columns: number;

    /** @hidden Layout padding. will be added to first card padding in every row */
    private _paddingLeft: number;

    /** @hidden Stores height of each column on card arrangement */
    private _columnsHeight: Array<number>;

    /** @hidden Available screen layout */
    private _layout: LayoutSize;

    /** @hidden Stores sorted card before placing in layout */
    private _sortedCards: Array<ResizableCardItemComponent>;

    /** @hidden FocusKeyManager instance */
    private _keyboardEventsManager: FocusKeyManager<ResizableCardItemComponent>;

    /** @hidden  */
    private _destroy$ = new Subject<boolean>();

    /** @hidden */
    private _layoutShifted = false;

    /** @hidden */
    private _currentResizingCard: ResizableCardItemComponent;

    constructor(private readonly _cd: ChangeDetectorRef, private readonly _elementRef: ElementRef) {}

    /** @hidden */
    ngOnInit(): void {
        this._columnsHeight = new Array(this._columns);
        this._columnsHeight.fill(0);
        // initialise value 0
    }

    /** @hidden */
    ngAfterContentInit(): void {
        this._initialSetup();
        // listen for query-list change
        this.resizeCardItems.forEach((card) => {
            card?.verifyUpdateCardWidth(this.layoutSize);
        });

        this.resizeCardItems.changes.subscribe(() => {
            this.arrangeCards(this.resizeCardItems?.toArray());
        });
        this.arrangeCards(this.resizeCardItems?.toArray());
        this._cd.markForCheck();
    }

    /** @hidden */
    ngAfterViewInit(): void {
        this._accessibilitySetup();
    }

    /** @hidden */
    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    /** @hidden handles keyboard accessibility */
    @HostListener('keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        event.stopImmediatePropagation();
        if (!this._keyboardEventsManager.activeItemIndex) {
            this._keyboardEventsManager.setFirstItemActive();
        }

        if (this._keyboardEventsManager) {
            this._keyboardEventsManager.onKeydown(event);
        }
    }

    /**
     * Arranges cards in layout based on rank, width and height of card
     */
    arrangeCards(cards: Array<ResizableCardItemComponent>): void {
        this._columnsHeight.fill(0);
        // sort based on the card rank
        this._sortedCards = cards.sort(this._sortCards);

        this._sortedCards.forEach((card, index) => {
            this._setCardPositionValues(card, index);
            this._updateColumnsHeight(card);
        });
        this.layoutHeight = Math.max.apply(null, this._columnsHeight);

        this._emitLayoutChange();
        this._cd.markForCheck();
    }

    /**
     * Handles shifting of cards with animation
     * while card is still resizing
     */
    cardResizing(event: ResizedEvent): void {
        this.resizing.emit(event);
        this._currentResizingCard = event.card;
        this._handleHorizontalResize(event);
        this._handleVerticalResize(event);
    }

    /**
     * Handles arrangement of cards in layout
     */
    cardResizeComplete(event: ResizedEvent): void {
        this._layoutShifted = false;
        this._currentResizingCard = null;
        this.arrangeCards(this.resizeCardItems.toArray());
        this.resized.emit(event);
    }

    /** @hidden */
    elementRef(): ElementRef<ResizableCardLayoutComponent> {
        return this._elementRef;
    }

    /** @hidden Subscribe to events from items */
    private _initialSetup(): void {
        // listen for resizing event of card item
        this.resizeCardItems.forEach((resizeCardItem, index) => {
            resizeCardItem.elementRef().nativeElement.style.transitionDuration = animationDuration;
            resizeCardItem.elementRef().nativeElement.style.animationTimingFunction = animationTimingFunction;
            if (this.layoutConfig && this.layoutConfig.length >= index + 1) {
                resizeCardItem.config = this.layoutConfig[index];
            }

            resizeCardItem.resizing
                .pipe(takeUntil(this._destroy$))
                .subscribe((event: ResizedEvent) => this.cardResizing(event));

            // listen for resize complete event of card item
            resizeCardItem.resized
                .pipe(takeUntil(this._destroy$))
                .subscribe((event: ResizedEvent) => this.cardResizeComplete(event));

            // listen for mini-header height event of card item
            resizeCardItem.miniHeaderReached.pipe(takeUntil(this._destroy$)).subscribe((event: ResizedEvent) => {
                this.miniHeaderReached.emit(event);
            });

            // listen for mini-content height event of card item
            resizeCardItem.miniContentReached.pipe(takeUntil(this._destroy$)).subscribe((event: ResizedEvent) => {
                this.miniContentReached.emit(event);
            });
        });
    }

    /** @hidden */
    private _accessibilitySetup(): void {
        this._keyboardEventsManager = new FocusKeyManager(this.resizeCardItems).withWrap();
    }

    /** Emit layoutChange event with updated card dimensions */
    private _emitLayoutChange(): void {
        const latestCardConfig: ResizableCardLayoutConfig = [];
        this.resizeCardItems.forEach((card) => {
            const cardConfig: ResizableCardItemConfig = {};
            cardConfig.cardWidthColSpan = card.cardWidthColSpan;
            cardConfig.cardHeightRowSpan = card.cardHeightRowSpan;
            cardConfig.rank = card.rank;
            cardConfig.title = card.title;
            cardConfig.cardMiniContentRowSpan = card.cardMiniContentRowSpan;
            cardConfig.cardMiniHeaderRowSpan = card.cardMiniHeaderRowSpan;
            cardConfig.resizable = card.resizable;
            latestCardConfig.push(cardConfig);
        });
        this.layoutChange.emit(latestCardConfig);
    }

    /** @hidden Sets number of column in layout, based on LayoutSize passed */
    private _setLayoutColumns(layoutSize: LayoutSize): void {
        let layoutWidthDefault: number;

        switch (layoutSize) {
            case 'sm':
                this._columns = 1;
                this._paddingLeft = 8;
                layoutWidthDefault = this._columns * horizontalResizeStep + 2 * this._paddingLeft;
                this.layoutWidth = layoutWidthDefault;
                break;
            case 'md':
                this._columns = 2;
                this._paddingLeft = 16;
                layoutWidthDefault = this._columns * horizontalResizeStep + 2 * this._paddingLeft;
                this.layoutWidth = layoutWidthDefault + gap;
                break;
            case 'lg':
                this._columns = 3;
                this._paddingLeft = 16;
                layoutWidthDefault = this._columns * horizontalResizeStep + 2 * this._paddingLeft;
                this.layoutWidth = layoutWidthDefault + 2 * gap;
                break;
            case 'xl':
                this._columns = 4;
                this._paddingLeft = 48;
                layoutWidthDefault = this._columns * horizontalResizeStep + 2 * this._paddingLeft;
                this.layoutWidth = layoutWidthDefault + 3 * gap;
                break;
            default:
                this._columns = 4;
                this._paddingLeft = 48;
                layoutWidthDefault = this._columns * horizontalResizeStep + 2 * this._paddingLeft;
                this.layoutWidth = layoutWidthDefault + 3 * gap;
        }
    }

    /**
     * Method to handle card vertical resize and trigger the layout change
     * @param event: ResizedEvent
     */
    private _handleVerticalResize(event: ResizedEvent): void {
        const heightDiff = Math.abs(event.card.cardHeight - event.prevCardHeight);
        if (heightDiff && heightDiff % verticalResizeStep === 0) {
            this.arrangeCards(this._sortedCards);
            this._cd.markForCheck();
            this.stepChange.emit(event.card.getResizedEventObject());
        }
    }

    /**
     * Method to handle card horizontal resize and trigger the layout change
     * @param event : ResizedEvent
     */
    private _handleHorizontalResize(event: ResizedEvent): void {
        // when increasing width hit the offset, show extended border and start pushing down border cards
        // when width is decreasing , show extended border till it reaches to offset.
        const cardWidthChange = event.cardWidth - event.prevCardWidth;
        const currentResizingItemIndex = this._sortedCards?.findIndex((x) => x.rank === event.card.rank);

        if (event.cardWidth > event.prevCardWidth) {
            // when increasing size
            // card width increasing currently
            if (event.card.cardState === 1 && cardWidthChange > horizontalResizeOffset + gap && !this._layoutShifted) {
                // index of this card, then get next card. exchange ranks
                this._sortedCards.forEach((card: ResizableCardItemComponent, index: number) => {
                    if (index > currentResizingItemIndex) {
                        // if there are some cards on same height. make the current card rank higher than these.
                        // otherwise next index where it will fit. until any card has less column span than total columns
                        // if only in next top, one card is taking full columns
                        if (
                            card.startingColumnPosition + card.cardWidthColSpan === this._columns &&
                            card.cardWidthColSpan !== this._columns
                        ) {
                            // get cards with top > current top , but minimum of it
                            // exchange rank with these card
                            this._moveCardDown(index);
                        }
                    }
                });
                this._layoutShifted = true;
                this.arrangeCards(this._sortedCards);
                this.stepChange.emit(event.card.getResizedEventObject());
            } else if (
                event.card.cardState === -1 &&
                cardWidthChange < horizontalResizeOffset + gap &&
                this._layoutShifted
            ) {
                // card width decreasing currently
                // move up the cards, if it was shifted while increasing the width
                this._sortedCards.forEach((card: ResizableCardItemComponent) => {
                    card.rank = card.prevRank ? card.prevRank : card.rank;
                    card.prevRank = 0;
                });
                this._layoutShifted = false;
                this.arrangeCards(this._sortedCards);
                this.stepChange.emit(event.card.getResizedEventObject());
            }
        } else if (event.cardWidth < event.prevCardWidth) {
            // when decreasing size
            if (event.card.cardState === -1 && -cardWidthChange > horizontalResizeOffset && !this._layoutShifted) {
                // card width decreasing currently
                this._layoutShifted = true;
                this.arrangeCards(this._sortedCards);
                this.stepChange.emit(event.card.getResizedEventObject());
            } else if (event.card.cardState === 1 && -cardWidthChange < horizontalResizeOffset && this._layoutShifted) {
                // card width increasing currently
                this._layoutShifted = false;
                this.arrangeCards(this._sortedCards);
                this.stepChange.emit(event.card.getResizedEventObject());
            }
        }
    }

    /**
     * Method to move card down, when another card width is increasing
     * Method to loop till this._columns -1 positions and exchange the rank
     * @param currentCardIndex: Index of current card
     */

    private _moveCardDown(currentCardIndex: number): void {
        // taking width of adjacent card col-span into account

        // eg: 4 columns - 2 col(adjacent card) = 2 positions can exchange ranks
        const currentCard: ResizableCardItemComponent = this._sortedCards[currentCardIndex];
        let card: ResizableCardItemComponent;

        // unoccupiedPositions positions left after currentCard occupies in next row.
        let unoccupiedPositions = this._columns - currentCard.cardWidthColSpan;

        currentCard.prevRank = currentCard.rank;

        let index = 1;
        while (unoccupiedPositions > 0) {
            // compare from next card
            card = this._sortedCards[index + currentCardIndex];
            if (card && unoccupiedPositions >= card.cardWidthColSpan) {
                card.prevRank = card.rank;
                card.rank -= 1;
                currentCard.rank = card.prevRank;
                unoccupiedPositions -= card.cardWidthColSpan;
            } else {
                unoccupiedPositions = 0;
            }
            index += 1;
        }
    }

    /** @hidden updates array with new column heights */
    private _updateColumnsHeight(card: ResizableCardItemComponent): void {
        const columnsStart = Math.floor(card.left / horizontalResizeStep);

        // Get width of current card resizing and assign width here for that card
        const cardBaseColSpan = Math.floor(card.cardWidth / horizontalResizeStep);

        // till which columns card spans
        const columnsSpan =
            card.cardWidth - cardBaseColSpan * horizontalResizeStep - cardBaseColSpan * gap > horizontalResizeOffset
                ? cardBaseColSpan + 1
                : cardBaseColSpan;

        const columnHeight = card.cardHeight + card.top;

        for (let i = 0; i < columnsSpan; i++) {
            this._columnsHeight[i + columnsStart] = columnHeight;
        }

        if (columnsStart === columnsSpan) {
            this._columnsHeight[columnsStart] = columnHeight;
        }
    }

    /**
     * @hidden Try to set card at available heights
     */
    private _setCardPositionValues(card: ResizableCardItemComponent, index: number): void {
        if (index === 0) {
            card.left = 0 + this._paddingLeft;
            card.top = 0;
            card.startingColumnPosition = 0;
            return;
        }

        const uniqueHeights = this._getSortedUniqueHeights();
        let cardPositioned = false;

        for (let i = 0; i < uniqueHeights.length && !cardPositioned; i++) {
            cardPositioned = this._isPositionSetSuccess(uniqueHeights[i], card);
        }
    }

    /**
     * @hidden try to set card at given height
     */
    private _isPositionSetSuccess(height: number, card: ResizableCardItemComponent): boolean {
        const columnPositions = [];
        let index = 0;
        for (const columnHeight of this._columnsHeight) {
            index++;
            if (columnHeight === height) {
                columnPositions.push(index);
            }
        }
        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        // try to fit as left as possible from the column position
        startingColumnPosition = this._fitCardColumnPosition(card, columnPositions, height);
        if (startingColumnPosition !== -1) {
            isFitting = true;
            card.left =
                startingColumnPosition * horizontalResizeStep +
                this._paddingLeft +
                (startingColumnPosition > 0 ? gap * startingColumnPosition : 0);
            card.top = height + (height > 0 ? verticalResizeStep : 0);
            card.startingColumnPosition = startingColumnPosition;
        }
        return isFitting;
    }

    /** @hidden Try to start card position from left most fit position */
    private _fitCardColumnPosition(
        card: ResizableCardItemComponent,
        columnPositions: Array<number>,
        height: number
    ): number {
        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        // start from previous indexes
        const cardBaseColSpan = Math.floor(card.cardWidth / horizontalResizeStep);
        const cardColSpan =
            card.cardWidth - cardBaseColSpan * horizontalResizeStep - cardBaseColSpan * gap > horizontalResizeOffset
                ? cardBaseColSpan + 1
                : cardBaseColSpan;
        // try to set towards left from available card position
        // eg. [1, 2, 3, 4] columnsPositions
        for (const columnPosition of columnPositions) {
            if (isFitting) {
                break;
            }

            // startingPosition values will be 1, 2, 3, 4
            // try to fit as left as possible
            let startingPosition = columnPosition - (cardColSpan - 1);
            startingPosition = startingPosition > 0 ? startingPosition : 1;

            for (let index = startingPosition; index <= columnPosition && !isFitting; index++) {
                for (let span = 0; span < cardColSpan; span++) {
                    if (this._columnsHeight[index + span - 1] <= height && cardColSpan + index - 1 <= this._columns) {
                        isFitting = true;
                        startingColumnPosition = index - 1;
                    } else {
                        isFitting = false;
                        startingColumnPosition = -1;
                        break;
                    }
                }
            }
        }
        return startingColumnPosition;
    }

    /** @hidden returns sorted unique height of columns */
    private _getSortedUniqueHeights(): number[] {
        const tempArray = this._columnsHeight.slice();
        const sortedColumnsHeightArray = tempArray.sort(comparer);
        const uniqueHeights = [];

        for (const sortedHeight of sortedColumnsHeightArray) {
            if (uniqueHeights.indexOf(sortedHeight) === -1) {
                uniqueHeights.push(sortedHeight);
            }
        }
        function comparer(first: number, second: number): number {
            return first - second;
        }
        return uniqueHeights;
    }

    /** @hidden Comparator to sort card based on rank. */
    private _sortCards(firstCard: ResizableCardItemComponent, secondCard: ResizableCardItemComponent): number {
        return firstCard.rank - secondCard.rank;
    }
}
