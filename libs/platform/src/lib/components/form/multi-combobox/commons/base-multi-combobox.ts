import {
    AfterViewInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter,
    Host,
    Input,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    Self,
    SkipSelf,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';
import {
    BACKSPACE,
    CONTROL,
    DOWN_ARROW,
    ENTER,
    ESCAPE,
    LEFT_ARROW,
    RIGHT_ARROW,
    SHIFT,
    TAB,
    UP_ARROW
} from '@angular/cdk/keycodes';

import { BehaviorSubject, fromEvent, isObservable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    DialogConfig,
    FocusEscapeDirection,
    FormControlComponent,
    KeyUtil,
    ListComponent,
    MobileModeConfig,
    TemplateDirective
} from '@fundamental-ngx/core';
import {
    ArrayListDataSource,
    isDataSource,
    isOptionItem,
    isSelectableOptionItem,
    ListDataSource,
    MatchingBy,
    ObservableListDataSource,
    SelectableOptionItem
} from '../../../../domain';

import { isFunction, isJsObject, isString } from '../../../../utils/lang';
import { CollectionBaseInput } from '../../collection-base.input';
import { MultiComboboxComponent } from '../multi-combobox/multi-combobox.component';
import { MatchingStrategy } from '../../combobox/combobox.config';
import { ContentDensity, FormFieldControl } from '../../form-control';
import { FormField } from '../../form-field';
import { FdpListDataSource } from '../../../list/list.component';
import { ListConfig } from '../../../list/list.config';
import { TextAlignment } from '../../combobox';

export class MultiComboboxSelectionChangeEvent {
    constructor(
        public source: MultiComboboxComponent,
        public selectedItems: SelectableOptionItem['value'] // Contains selected items
    ) {}
}

@Directive()
export abstract class BaseMultiCombobox extends CollectionBaseInput implements AfterViewInit, OnDestroy {
    /** Provides selected items. */
    @Input()
    selectedItems: any[] = [];

    /** Provides maximum height for the optionPanel. */
    @Input()
    maxHeight = '250px';

    /** Datasource for suggestion list. */
    @Input()
    set dataSource(value: FdpListDataSource<any>) {
        if (value) {
            this._initializeDataSource(value);
        }
    }
    get dataSource(): FdpListDataSource<any> {
        return this._dataSource;
    }

    /** Whether the autocomplete should be enabled; Enabled by default. */
    @Input()
    autoComplete = true;

    /** Content Density of element.
     * Can be 'cozy', 'compact'. */
    @Input()
    set contentDensity(contentDensity: ContentDensity) {
        this._contentDensity = contentDensity;
        this.isCompact = contentDensity === 'compact';
    }

    /**
     * TODO: Name of the entity for which DataProvider will be loaded. You can either pass list of
     * items or use this entityClass and internally we should be able to do lookup to some registry
     * and retrieve the best matching DataProvider that is set on application level
     */
    @Input()
    entityClass: string;

    /** Whether the multi-combobox should be built on mobile mode. */
    @Input()
    mobile = false;

    /** Multi Combobox Mobile Configuration, it's applied only, when mobile is enabled. */
    @Input()
    mobileConfig: MobileModeConfig;

    /** Tells the multi-combobox if we need to group items. */
    @Input()
    group = false;

    /** A field name to use to group data by (support dotted notation). */
    @Input()
    groupKey?: string;

    /** The field to show data in secondary column. */
    @Input()
    secondaryKey?: string;

    /** Show the second column (applicable for two columns layout). */
    @Input()
    showSecondaryText = false;

    /** Horizontally align text inside the second column (applicable for two columns layout). */
    @Input()
    secondaryTextAlignment: TextAlignment = 'right';

    /** Turns on/off Adjustable Width feature. */
    @Input()
    autoResize = false;

    @Input()
    set value(value: any) {
        if (!value) {
            return;
        }

        const selectedItems = Array.isArray(value) ? value : [value];
        super.setValue(selectedItems);
    }
    get value(): any {
        return super.getValue();
    }

    /** Event emitted when item is selected. */
    @Output()
    selectionChange = new EventEmitter<MultiComboboxSelectionChangeEvent>();

    /** @hidden Emits event when the menu is opened/closed. */
    @Output()
    isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** @hidden */
    @ViewChild(ListComponent)
    listComponent: ListComponent;

    /** @hidden */
    @ViewChild('searchInputElement', { read: ElementRef })
    searchInputElement: FormControlComponent;

    /** @hidden */
    @ContentChildren(TemplateDirective)
    customTemplates: QueryList<TemplateDirective>;

    /** @hidden
     * Custom Option item Template.
     * */
    optionItemTemplate: TemplateRef<any>;

    /** @hidden
     * Custom Group Header item Template.
     * */
    groupItemTemplate: TemplateRef<any>;

    /** @hidden
     * Custom Secondary item Template.
     * */
    secondaryItemTemplate: TemplateRef<any>;

    /** @hidden
     * Custom Selected option item Template.
     * */
    selectedItemTemplate: TemplateRef<any>;

    /** @hidden */
    _contentDensity: ContentDensity = this.listConfig.contentDensity;

    /**
     * @hidden
     * Whether "contentDensity" is "compact".
     */
    isCompact: boolean = this._contentDensity === 'compact';

    /** @hidden */
    controlTemplate: TemplateRef<any>;

    /** @hidden */
    listTemplate: TemplateRef<any>;

    /** Set the input text of the input. */
    set inputText(value: string) {
        this._inputTextValue = value;

        this.onTouched();
    }

    /** Get the input text of the input. */
    get inputText(): string {
        return this._inputTextValue || '';
    }

    /** Is empty search field. */
    get isEmptyValue(): boolean {
        return this.inputText.trim().length === 0;
    }

    /** @hidden */
    get isGroup(): boolean {
        return !!(this.group && this.groupKey);
    }

    /** Whether the Multi Input is opened. */
    isOpen = false;

    /** @hidden
     * List of matched suggestions
     * */
    _suggestions: SelectableOptionItem[];

    /** @hidden
     * Grouped suggestions mapped to array.
     * */
    _flatSuggestions: SelectableOptionItem[];

    /** @hidden
     * List of selected suggestions
     * */
    _selected: SelectableOptionItem[];

    /** @hidden
     * Max width of list container
     * */
    maxWidth?: number;

    /** @hidden
     * Min width of list container
     * */
    minWidth?: number;

    /** @hidden
     * Need for opening mobile version
     */
    openChange = new Subject<boolean>();

    /** @hidden */
    selectedShown$ = new BehaviorSubject(false);

    /** @hidden */
    isSearchInvalid = false;

    /** @hidden */
    protected _dataSource: FdpListDataSource<any>;

    /** @hidden */
    private _inputTextValue: string;
    /** @hidden */
    private _matchingStrategy: MatchingStrategy = this.listConfig.matchingStrategy;
    /** @hidden */
    private _dsSubscription?: Subscription;
    /** @hidden */
    private _element: HTMLElement = this.elementRef.nativeElement;
    /** Keys, that won't trigger the popover's open state, when dispatched on search input. */
    private readonly _nonOpeningKeys: number[] = [
        ESCAPE,
        ENTER,
        CONTROL,
        TAB,
        SHIFT,
        UP_ARROW,
        RIGHT_ARROW,
        DOWN_ARROW,
        LEFT_ARROW
    ];

    /** @hidden */
    private _displayFn = (value: any) => {
        return this.displayValue(value);
    };

    /** @hidden */
    private _secondaryFn = (value: any) => {
        if (isOptionItem(value)) {
            return value.secondaryText;
        } else if (isJsObject(value) && this.secondaryKey) {
            const currentItem = this.objectGet(value, this.secondaryKey);

            return isFunction(currentItem) ? currentItem() : currentItem;
        } else {
            return value;
        }
    };

    constructor(
        readonly cd: ChangeDetectorRef,
        protected readonly elementRef: ElementRef,
        @Optional() @Self() readonly ngControl: NgControl,
        @Optional() @Self() readonly ngForm: NgForm,
        @Optional() readonly dialogConfig: DialogConfig,
        protected listConfig: ListConfig,
        @Optional() @SkipSelf() @Host() formField: FormField,
        @Optional() @SkipSelf() @Host() formControl: FormFieldControl<any>
    ) {
        super(cd, ngControl, ngForm, formField, formControl);
    }

    /** @hidden */
    ngAfterViewInit(): void {
        this._initWindowResize();
        this._assignCustomTemplates();
        super.ngAfterViewInit();
    }

    /** @hidden */
    ngOnDestroy(): void {
        super.ngOnDestroy();

        if (isDataSource(this.dataSource)) {
            (this.dataSource as ListDataSource<any>).close();
        }

        if (this._dsSubscription) {
            this._dsSubscription.unsubscribe();
        }
    }

    /** @hidden
     * Method to emit change event
     */
    abstract emitChangeEvent<K>(value: K): void;

    /** @hidden
     * Method to set input text as item label.
     * */
    abstract setInputTextFromOptionItem(item: SelectableOptionItem): void;

    /** @hidden
     * Toggle item selection.
     * */
    abstract toggleSelection(item: SelectableOptionItem): void;

    /** @hidden
     * Toggle item selection by input text value.
     * */
    abstract toggleSelectionByInputText(): void;

    /** write value for ControlValueAccessor */
    writeValue(value: any): void {
        if (!value) {
            return;
        }

        const selectedItems = Array.isArray(value) ? value : [value];
        super.writeValue(selectedItems);
    }

    /** @hidden */
    popoverOpenChangeHandle(): void {
        this.isOpen ? this.close() : this.open();
    }

    /** Opens the select popover body. */
    open(): void {
        this.isOpen = true;
        this.isOpenChange.emit(this.isOpen);
        this._cd.markForCheck();
    }

    /** Closes the select popover body. */
    close(): void {
        this.selectedShown$.next(false);
        this.inputText = '';

        this.isOpen = false;
        this.isOpenChange.emit(this.isOpen);
        this._cd.markForCheck();
    }

    /** @hidden */
    showList(isOpen: boolean): void {
        if (this.isOpen !== isOpen) {
            this.isOpen = isOpen;
            this.onTouched();
            this.openChange.next(isOpen);
        }

        if (!this.isOpen) {
            this.searchTermChanged('');
        }

        this.cd.detectChanges();
    }

    /** @hidden */
    searchTermChanged(text: string = this.inputText): void {
        if (text) {
            this.open();
        }
        const map = new Map();
        map.set('query', text);
        map.set('limit', 12);
        this.ds.match(map);

        this.cd.detectChanges();
    }

    /**
     * Handle Click on Button
     * @hidden
     */
    onPrimaryButtonClick(isOpen: boolean): void {
        if (!isOpen) {
            this.searchTermChanged('');
        }

        this.showList(!isOpen);

        if (this.isOpen && this.listComponent) {
            this.listComponent.setItemActive(0);
        }
    }

    /**
     * Handle Keydown on Input
     * @hidden
     */
    onInputKeydownHandler(event: KeyboardEvent): void {
        if (this.readonly) {
            return;
        }

        if (KeyUtil.isKeyCode(event, DOWN_ARROW)) {
            event.preventDefault();

            if (event.altKey) {
                this.showList(true);
            }

            if (this.isOpen && this.listComponent) {
                this.listComponent.setItemActive(0);
            } else if (!this.isOpen) {
                this._chooseOtherItem(1);
            }
        } else if (KeyUtil.isKeyCode(event, UP_ARROW)) {
            event.preventDefault();

            this._chooseOtherItem(-1);
        } else if (KeyUtil.isKeyCode(event, ENTER)) {
            this.toggleSelectionByInputText();
        } else if (KeyUtil.isKeyCode(event, ESCAPE)) {
            event.stopPropagation();

            this.showList(false);
        } else if (!event.ctrlKey && !KeyUtil.isKeyCode(event, this._nonOpeningKeys)) {
            this.showList(true);
            const acceptedKeys =
                !KeyUtil.isKeyCode(event, BACKSPACE) &&
                !KeyUtil.isKeyType(event, 'alphabetical') &&
                !KeyUtil.isKeyType(event, 'numeric');
            if (this.isEmptyValue && acceptedKeys) {
                this.listComponent?.setItemActive(0);
            }
        }
    }

    /** Method passed to list component */
    handleListFocusEscape(direction: FocusEscapeDirection): void {
        if (direction === 'up') {
            this.searchInputElement.elementRef().nativeElement.focus();
        }
    }

    /** @hidden */
    protected get ds(): ListDataSource<any> {
        return <ListDataSource<any>>this.dataSource;
    }

    /** @hidden
     * Method that picks other value moved from current one by offset, called only when Multi Combobox is closed */
    private _chooseOtherItem(offset: number): void {
        if (this._selected?.length === this._flatSuggestions.length) {
            this.inputText = '';
            return;
        }

        const activeValue: SelectableOptionItem = this._getSelectItemByInputValue(this.inputText);
        const index: number = this._flatSuggestions.findIndex(value => value === activeValue);
        let item: SelectableOptionItem;
        if (!this.inputText && offset === -1) {
            item = this._flatSuggestions[this._flatSuggestions.length - 1];
        } else {
            item = this._flatSuggestions[index + offset];
        }

        if (item) {
            this.setInputTextFromOptionItem(item);
        }

        const selectedIndex = this._selected.findIndex(value => value.label === item.label);
        if (selectedIndex !== -1) {
            this._chooseOtherItem(offset);
        }
    }

    /** @hidden */
    protected _getSelectItemByInputValue(displayValue: string): SelectableOptionItem | undefined {
        return this._flatSuggestions.find((value) => value.label === displayValue);
    }

    /** @hidden
     *  Map grouped values to array. */
    protected _flatGroups(items: SelectableOptionItem[]): SelectableOptionItem[] {
        return items.reduce((result: SelectableOptionItem[], item: SelectableOptionItem) => result.concat(item.children), []);
    }

    /** @hidden */
    private _initializeDataSource(ds: FdpListDataSource<any>): void {
        this._suggestions = [];
        this._flatSuggestions = [];

        if (isDataSource(this.dataSource)) {
            (this.dataSource as ListDataSource<any>).close();

            if (this._dsSubscription) {
                this._dsSubscription.unsubscribe();
                this._dsSubscription = null;
            }
        }
        // Convert whatever comes in as DataSource so we can work with it identically
        this._dataSource = this._openDataStream(ds);
    }

    /** @hidden */
    private _openDataStream(ds: FdpListDataSource<any>): ListDataSource<any> {
        const initDataSource = this._toDataStream(ds);

        if (initDataSource === undefined) {
            throw new Error(`[dataSource] source did not match an array, Observable, or DataSource`);
        }
        /**
         * This is single point of data entry to the component. We dont want to set data on different
         * places. If any new data comes in either you do a search and you want to pass initial data
         * its here.
         */
        this._dsSubscription = initDataSource
            .open()
            .pipe(takeUntil(this._destroyed))
            .subscribe(data => {
                this._suggestions = this._convertToOptionItems(data);
                this._flatSuggestions = this.isGroup ? this._flatGroups(this._suggestions) : this._suggestions;

                this.stateChanges.next('initDataSource.open().');

                this.cd.markForCheck();
            });

        initDataSource.dataProvider.setLookupKey(this.lookupKey);
        const matchingBy: MatchingBy = {
            firstBy: this._displayFn
        };

        if (this.secondaryKey) {
            matchingBy.secondaryBy = this._secondaryFn;
        }

        initDataSource.dataProvider.setMatchingBy(matchingBy);
        initDataSource.dataProvider.setMatchingStrategy(this._matchingStrategy);

        // initial data fetch
        const map = new Map();
        map.set('query', '*');
        map.set('limit', 12);
        initDataSource.match(map);

        return initDataSource;
    }

    /** @hidden */
    private _toDataStream(ds: FdpListDataSource<any>): ListDataSource<any> | undefined {
        if (isDataSource(ds)) {
            return ds as ListDataSource<any>;
        } else if (Array.isArray(ds)) {
            return new ArrayListDataSource<any>(ds);
        } else if (isObservable(ds)) {
            return new ObservableListDataSource<any>(ds);
        }

        return undefined;
    }

    /** @hidden */
    private _initWindowResize(): void {
        this._getOptionsListWidth();

        if (!this.autoResize) {
            return;
        }

        fromEvent(window, 'resize')
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._getOptionsListWidth());
    }

    /** @hidden */
    private _getOptionsListWidth(): void {
        const body = document.body;
        const rect = (this._element.querySelector('fd-input-group') as HTMLElement).getBoundingClientRect();
        const scrollBarWidth = body.offsetWidth - body.clientWidth;
        this.maxWidth = this.autoResize ? window.innerWidth - scrollBarWidth - rect.left : this.minWidth;
        this.minWidth = rect.width - 2;
        this._cd.detectChanges();
    }

    /**
     * Convert original data to SelectableOptionItems Interface
     * @hidden
     */
    private _convertToOptionItems(items: any[]): SelectableOptionItem[] {
        const item = items[0];

        const elementTypeIsOptionItem = isSelectableOptionItem(item);
        if (elementTypeIsOptionItem) {
            return items as SelectableOptionItem[];
        }

        const elementTypeIsObject = isJsObject(item);
        if (elementTypeIsObject) {
            return this._convertObjectsToOptionItems(items);
        }

        const elementTypeIsString = isString(item);
        if (elementTypeIsString) {
            return this._convertPrimitiveToOptionItems(items);
        }

        return [];
    }

    /**
     * Convert data to SelectableOptionItems Interface
     * @hidden
     */
    private _convertObjectsToOptionItems(items: any[]): SelectableOptionItem[] {
        if (this.isGroup) {
            return this._convertObjectsToGroupOptionItems(items);
        } else if (this.showSecondaryText && this.secondaryKey) {
            return this._convertObjectsToSecondaryOptionItems(items);
        } else {
            return this._convertObjectsToDefaultOptionItems(items);
        }
    }

    /**
     * Convert object[] data to Group OptionItems Interface
     * @hidden
     */
    protected _convertObjectsToGroupOptionItems<K>(items: K[]): SelectableOptionItem[] {
        const group: { [key: string]: K[] } = {};

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const keyValue = item[this.groupKey];
            if (!keyValue) {
                continue;
            }

            if (!group[keyValue]) {
                group[keyValue] = [];
            }

            group[keyValue].push(item);
        }

        return Object.keys(group).map((key) => {
            const selectItem: SelectableOptionItem = {
                label: key,
                value: null,
                isGroup: true
            };

            const currentGroup = group[key];

            if (this.showSecondaryText && this.secondaryKey) {
                selectItem.children = this._convertObjectsToSecondaryOptionItems(currentGroup);
            } else {
                selectItem.children = this._convertObjectsToDefaultOptionItems(currentGroup);
            }
            return selectItem;
        });
    }

    /**
     * Convert object[] data to Secondary SelectableOptionItems Interface
     * @hidden
     */
    private _convertObjectsToSecondaryOptionItems<K>(items: K[]): SelectableOptionItem[] {
        const selectItems: SelectableOptionItem[] = [];

        for (let i = 0; i < items.length; i++) {
            const value = items[i];
            selectItems.push({
                label: this.displayValue(value),
                secondaryText: this.objectGet(value, this.secondaryKey),
                value: value,
                selected: this.selectedItems?.includes(value) || false
            });
        }

        return selectItems;
    }

    /**
     * Convert Primitive data(Boolean, String, Number) to SelectableOptionItems Interface
     * @hidden
     */
    private _convertPrimitiveToOptionItems(items: any[]): SelectableOptionItem[] {
        const selectItems: SelectableOptionItem[] = [];
        for (let i = 0; i < items.length; i++) {
            const value = items[i];
            selectItems.push({
                label: value,
                value: value,
                selected: this.selectedItems?.includes(value) || false
            });
        }

        return selectItems;
    }

    /**
     * Convert object[] to SelectableOptionItems Interface (Default)
     * @hidden
     */
    private _convertObjectsToDefaultOptionItems(items: any[]): SelectableOptionItem[] {
        const selectItems: SelectableOptionItem[] = [];

        for (let i = 0; i < items.length; i++) {
            const value = items[i];
            selectItems.push({
                label: this.displayValue(value),
                value: value,
                selected: this.selectedItems?.includes(value) || false
            });
        }

        return selectItems;
    }

    /** @hidden
     * Assign custom templates
     * */
    private _assignCustomTemplates(): void {
        this.customTemplates.forEach((template) => {
            switch (template.getName()) {
                case 'optionItemTemplate':
                    this.optionItemTemplate = template.templateRef;
                    break;
                case 'groupItemTemplate':
                    this.groupItemTemplate = template.templateRef;
                    break;
                case 'secondaryItemTemplate':
                    this.secondaryItemTemplate = template.templateRef;
                    break;
                case 'selectedItemTemplate':
                    this.selectedItemTemplate = template.templateRef;
                    break;
            }
        });
    }
}
