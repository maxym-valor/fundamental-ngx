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
    CardDropped,
    horizontalResizeStep,
    gap,
    ResizingEvent,
    ResizedEvent,
    ResizableCardItemComponent,
    ResizableCardItemConfig,
    verticalResizeStep,
    horizontalResizeOffset,
    verticalResizeOffset
} from './resizable-card-item/resizable-card-item.component';

const DRAG_START_DELAY = 500;
const AnimationDuration = '750ms';
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
    /** Drag of card can be disabled. Default is true */
    @Input()
    draggable = true;

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

    /** Emits when card is dragged and dropped at different position in layout */
    @Output()
    dropped: EventEmitter<CardDropped> = new EventEmitter<CardDropped>();

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

    dragStartDelay = DRAG_START_DELAY;

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

    /** @hidden cards before modifying ranks */
    private _previousCards: Array<ResizableCardItemComponent>;

    /** @hidden FocusKeyManager instance */
    private _keyboardEventsManager: FocusKeyManager<ResizableCardItemComponent>;

    /** @hidden  */
    private _destroy$ = new Subject<boolean>();

    /** @hidden */
    private _startAnimation: boolean;

    /** @hidden */
    private _layoutShifted = false;

    constructor(private readonly _cd: ChangeDetectorRef, private readonly _elementRef: ElementRef) {}

    /** @hidden */
    ngOnInit(): void {
        this._columnsHeight = new Array(this._columns);
        this._initHeightArray();
    }

    /** @hidden */
    ngAfterContentInit(): void {
        this._initialSetup();
        // listen for query-list change
        this.resizeCardItems.changes.subscribe(() => {
            this.arrangeCards(this.resizeCardItems?.toArray());
        });
        this.resizeCardItems.forEach((card) => {
            card?.verifyUpdateCardWidth(this.layoutSize);
        });

        this.arrangeCards(this.resizeCardItems?.toArray());
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
        this._initHeightArray();
        console.log('after initialization of height array: ', this._columnsHeight);
        // sort based on the card rank
        this._sortedCards = cards.sort(this._sortCards);
        console.log('sorted cards: ', this._sortedCards);

        this._sortedCards.forEach((card, index) => {
            this._setCardPositionValues(card, index);
            this._updateColumnsHeight(card);
        });
        this.layoutHeight = Math.max.apply(null, this._columnsHeight);

        this._emitLayoutChange();
        this._cd.detectChanges();
    }

    /**
     * Handles shifting of cards with animation
     * while card is still resizing
     */
    cardResizing(event: ResizedEvent): void {
        this.resizing.emit(event);
        const resizingCard: ResizableCardItemComponent = event.card;

        // when increasing width hit the offset, show extended border and start pushing down border cards
        // when width is decreasing , show extended border till it reaches to offset. then don't. and push border cards up

        // distance from offset
        const cardColumnSpan = Math.floor(event.cardWidth / horizontalResizeStep) * horizontalResizeStep;
        const offsetDistance = event.cardWidth - Math.floor(event.cardWidth / horizontalResizeStep);

        // animation should start
        // 1.
        if (event.cardWidth > event.prevCardWidth) {
            // when increasing size
            const currentResizingItemIndex = this._sortedCards.findIndex((x) => x.rank === event.card.rank);
            console.log('card width has increased from _prevWidth');
            console.log('event.card.cardState: ', event.card.cardState);
            console.log('event.cardWidth - event.prevCardWidth: ', event.cardWidth - event.prevCardWidth);
            console.log('layoutShifted; ', this._layoutShifted);
            // card width increasing currently
            if (
                event.card.cardState === 1 &&
                event.cardWidth - event.prevCardWidth >= horizontalResizeOffset &&
                !this._startAnimation
            ) {
                this._startAnimation = true;
                console.log('currently card is increasing and reached offset this._sortedCards: ', this._sortedCards);

                // index of this card, then get next card. exchange ranks
                this._previousCards = this._sortedCards.map((sortedCardItem) => Object.assign({}, sortedCardItem));
                console.log('while increasing this._previousCards: ', this._previousCards);
                this._sortedCards.forEach((card: ResizableCardItemComponent, index: number) => {
                    if (index > currentResizingItemIndex) {
                        // console.log('currentCard: ', card);
                        // if there are some cards on same height. make the current card rank higher than these.
                        // otherwise next index where it will fit. until any card has less column span than total columns
                        if (
                            card.startingColumnPosition + card.cardWidthColSpan === this._columns &&
                            card.cardWidthColSpan !== this._columns
                        ) {
                            // get cards with top > current top , but minimum of it
                            // exchange rank with these card
                            // if only in next top, one card is taking full columns
                            console.log('rank sorted cards before moving card down: ', this._sortedCards);
                            this._moveCardDown(index);
                            this._layoutShifted = true;
                            console.log('rank sorted cards after moving card down: ', this._sortedCards);
                            console.log('rank previous sorted cards after moving card down: ', this._previousCards);
                        }
                    }
                });
                console.log('initiate cardResizeComplete: ');
                this.arrangeCards(this._sortedCards);
                this.resized.emit(event);
            } else if (
                event.card.cardState === -1 &&
                event.cardWidth - event.prevCardWidth < horizontalResizeOffset &&
                this._layoutShifted
            ) {
                // card width decreasing currently

                console.log('currently card is decreasing and reached offset: ');
                // move up the cards, if it was shifted while increasing the width

                this._layoutShifted = false;
                this._sortedCards = this._previousCards;
                console.log('while decreasing this._previousCards: ', this._previousCards);
                console.log('initiate cardResizeComplete: ');
                this.arrangeCards(this._sortedCards);
                this.resized.emit(event);
            }

            // this.resizeCardItems.toArray()[0].cardWidthColSpan = 2;
            // this.resizeCardItems.toArray()[0].cardWidth = 656;
        } else if (
            event.cardWidth < event.prevCardWidth &&
            event.prevCardWidth - event.cardWidth >= horizontalResizeOffset &&
            !this._startAnimation
        ) {
            // when decreasing size
        }
    }

    /**
     * Method to loop till this._columns -1 positions and exchange the rank
     * @param event
     */

    private _moveCardDown(currentCardIndex: number): void {
        // taking width of adjacent card col-span into account

        // eg: 4 columns - 2 col(adjacent card) = 2 positions can exchange ranks
        const currentCard: ResizableCardItemComponent = this._sortedCards[currentCardIndex];
        let card: ResizableCardItemComponent;

        // unoccupiedPositions positions left after currentCard occupies in next row.
        let unoccupiedPositions = this._columns - currentCard.cardWidthColSpan;
        // console.log('unoccupiedPositions: ', unoccupiedPositions);

        let index = 1;
        while (unoccupiedPositions > 0) {
            // compare from next card
            card = this._sortedCards[index + currentCardIndex];
            // console.log('card: ', card);
            if (card && unoccupiedPositions >= card.cardWidthColSpan) {
                console.log('exchanging rank');
                // console.log('before card.rank: ', card.rank);
                // console.log('before currentCard.rank: ', currentCard.rank);
                card.rank -= 1;
                currentCard.rank += 1;
                unoccupiedPositions -= card.cardWidthColSpan;

                // console.log('after card.rank: ', card.rank);
                // console.log('after currentCard.rank: ', currentCard.rank);
                // console.log('uncovered positions now left: ', unoccupiedPositions);
            } else {
                // console.log('breaking loop');
                unoccupiedPositions = 0;
            }
            index += 1;
        }
        // for(let i=0; i< positionsLeft; i++) {
        //     currentCard = resizeCardItemsArray[i+adjacentCardIndex];
        //     if(i+currentCard.cardWidthColSpan <= positionsLeft) {
        //         adjacentCard.rank +=1;
        //         currentCard.rank -=1;
        //         // this exchanges the rank.
        //     }
        // }
        // if(card.cardWidthColSpan <= positionsLeft) {
        //     const cardRank = card.rank;
        //     card.rank -=1;
        //     adjacentCard.rank = cardRank;
        // }
    }

    /**
     * Handles arrangement of cards in layout
     */
    cardResizeComplete(event: ResizedEvent): void {
        this._startAnimation = false;
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
            resizeCardItem.elementRef().nativeElement.style.transitionDuration = AnimationDuration;
            resizeCardItem.elementRef().nativeElement.style.animationTimingFunction = 'ease';
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

            // listen for step-change event of card item
            resizeCardItem.stepChange.pipe(takeUntil(this._destroy$)).subscribe((event: ResizedEvent) => {
                this.stepChange.emit(event);
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
        this._cd.detectChanges();
    }

    /** @hidden Initialize height array for columns */
    private _initHeightArray(): void {
        for (let index = 0; index < this._columns; index++) {
            this._columnsHeight[index] = 0;
        }
    }

    /** @hidden updates array with new column heights */
    private _updateColumnsHeight(card: ResizableCardItemComponent): void {
        const columnsStart = Math.floor(card.left / horizontalResizeStep);

        const cardBaseColSpan = Math.floor(card.cardWidth / horizontalResizeStep);
        // till which columns card spans
        const columnsSpan =
            card.cardWidth - cardBaseColSpan * horizontalResizeStep >= horizontalResizeOffset
                ? cardBaseColSpan + 1
                : cardBaseColSpan;

        // const columnsSpan = Math.floor(
        //     (card.left + card.cardWidth + card.resizeIndicationBorderWidth) / horizontalResizeStep
        // );
        console.log('_updateColumnsHeight card: ', card);
        console.log('_updateColumnsHeight card resizeIndicationBorderWidth: ', card.resizeIndicationBorderWidth);
        console.log('_updateColumnsHeight card cardWidth: ', card.cardWidth);
        console.log('_updateColumnsHeight columnsStart: ', columnsStart);
        console.log('_updateColumnsHeight columnsSpan: ', columnsSpan);
        const columnHeight = card.cardHeight + card.top;

        for (let i = 0; i < columnsSpan; i++) {
            this._columnsHeight[i + columnsStart] = columnHeight;
        }

        console.log(' =====>>>>> updated height array: ', this._columnsHeight);
        if (columnsStart === columnsSpan) {
            this._columnsHeight[columnsStart] = columnHeight;
        }
        console.log('<<<<<< updated height array: ', this._columnsHeight);
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
        for (const height of uniqueHeights) {
            if (!cardPositioned) {
                cardPositioned = this._isPositionSetSuccess(height, card);
            } else {
                break;
            }
        }
    }

    /**
     * @hidden try to set card at given height
     */
    private _isPositionSetSuccess(height: number, card: ResizableCardItemComponent): boolean {
        console.log('setting position for card: ', card);
        console.log('setting position for card  at height: ', height);
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
        startingColumnPosition = this._fitLeftFromColumnPosition(card, columnPositions);
        console.log('fitting left startingColumnPosition: ', startingColumnPosition);
        // if not moving towards left. start from column position and check if fits.
        // try to set towards right from available card position
        if (startingColumnPosition === -1) {
            startingColumnPosition = this._fitRight(card, columnPositions, height);
        }

        console.log('fitting right startingColumnPosition: ', startingColumnPosition);

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
    private _fitLeftFromColumnPosition(card: ResizableCardItemComponent, columnPositions: Array<number>): number {
        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        // start from previous indexes
        const cardBaseColSpan = Math.floor(card.cardWidth / horizontalResizeStep);
        const cardColSpan =
            card.cardWidth - cardBaseColSpan * horizontalResizeStep >= horizontalResizeOffset
                ? cardBaseColSpan + 1
                : cardBaseColSpan;
        // const cardColSpan = Math.floor((card.cardWidth + card.resizeIndicationBorderWidth) / horizontalResizeStep);

        // try to set towards left from available card position
        // eg. [1, 2, 3, 4] columnsPositions
        console.log('columnPositions found fitting: ', columnPositions);
        for (const columnPosition of columnPositions) {
            if (isFitting) {
                break;
            }

            // columnPosition-1 ->convert as index
            // columnPosition -1 - (numberOfCardColumns -1) at least 1 column of card on current column
            for (let i = columnPosition - cardColSpan; i < columnPosition - 1 && i > -1 && !isFitting; i++) {
                // if previous column heights are less then card will fix starting from previous columns as well
                if (this._columnsHeight[i] > this._columnsHeight[columnPosition - 1]) {
                    isFitting = false;
                    startingColumnPosition = -1;
                } else {
                    isFitting = true;
                    startingColumnPosition = i;
                    if (startingColumnPosition + cardColSpan > this._columns) {
                        isFitting = false;
                        startingColumnPosition = -1;
                    }

                    // is whole width of card will fit
                    for (let columnIndex = 0; columnIndex < cardColSpan; columnIndex++) {
                        if (
                            this._columnsHeight[columnIndex + startingColumnPosition] >
                            this._columnsHeight[columnPosition - 1]
                        ) {
                            // not full width is fitting
                            isFitting = false;
                            startingColumnPosition = -1;
                        }
                    }
                }
            }
        }
        return startingColumnPosition;
    }

    /** @hidden Try to fit right from the position */
    private _fitRight(card: ResizableCardItemComponent, columnPositions: Array<number>, height: number): number {
        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        // const cardColSpan = Math.floor((card.cardWidth + card.resizeIndicationBorderWidth) / horizontalResizeStep);

        const cardBaseColSpan = Math.floor(card.cardWidth / horizontalResizeStep);
        // start from previous indexes
        const cardColSpan =
            card.cardWidth - cardBaseColSpan * horizontalResizeStep >= horizontalResizeOffset
                ? cardBaseColSpan + 1
                : cardBaseColSpan;

        for (const columnPosition of columnPositions) {
            if (isFitting) {
                break;
            }

            if (height === 0 && cardColSpan + columnPosition - 1 <= this._columns && !isFitting) {
                isFitting = true;
                startingColumnPosition = columnPosition - 1;
                break;
            }

            // if card spans more than available columns. then it will not fit.
            if (columnPosition + cardColSpan - 1 > this._columns) {
                isFitting = false;
                startingColumnPosition = -1;
                break;
            }

            if (cardColSpan > 1) {
                // one column is at columnPosition. check rest card width also fit at this height.
                for (let i = cardColSpan - 1; i > 0 && !isFitting; i--) {
                    if (this._columnsHeight[columnPosition - 1 + i] > this._columnsHeight[columnPosition - 1]) {
                        isFitting = false;
                        startingColumnPosition = -1;
                    } else {
                        isFitting = true;
                        startingColumnPosition = columnPosition - 1;

                        // is whole width of card will fit
                        for (let columnIndex = 0; columnIndex < cardColSpan; columnIndex++) {
                            if (
                                this._columnsHeight[columnIndex + startingColumnPosition] >
                                this._columnsHeight[columnPosition - 1]
                            ) {
                                // not full width is fitting
                                isFitting = false;
                                startingColumnPosition = -1;
                            }
                        }
                    }
                }
            } else {
                isFitting = true;
                startingColumnPosition = columnPosition - 1;
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
