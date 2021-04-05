/**
 * Files to display in the API tab of each component.
 * Names should be without hyphens, and capitalized where hyphens occur normally.
 * Include the suffix i.e. Directive or Component.
 * Names are sorted in the ApiComponent so order does not matter.
 */
export const API_FILES = {
    actionBar: [
        'ActionBarComponent',
        'ActionBarTitleComponent',
        'ActionBarActionsDirective',
        'ActionBarBackDirective',
        'ActionBarDescriptionDirective',
        'ActionBarHeaderDirective',
        'ActionBarMobileDirective'
    ],
    actionSheet: [
        'ActionSheetComponent',
        'ActionSheetControlComponent',
        'ActionSheetItemComponent',
        'ActionSheetBodyComponent'
    ],
    alert: ['AlertComponent', 'AlertConfig', 'AlertService', 'AlertRef'],
    avatar: ['AvatarComponent'],
    avatarGroup: [
        'AvatarGroupComponent',
        'AvatarGroupItemDirective',
        'AvatarGroupOverflowBodyDirective',
        'AvatarGroupOverflowItemDirective',
        'AvatarGroupOverflowButtonDirective',
        'AvatarGroupOverflowButtonTextDirective'
    ],
    bar: ['BarComponent', 'BarElementDirective', 'BarLeftDirective', 'BarMiddleDirective', 'BarRightDirective'],
    card: [
        'CardComponent',
        'CardHeaderComponent',
        'CardTitleDirective',
        'CardSubtitleDirective',
        'CardSecondSubtitleDirective',
        'CardContentComponent',
        'CardFooterComponent',
        'CardLoaderComponent',
        'CardKpiHeaderComponent',
        'CardKpiValueDirective',
        'CardKpiScaleIconDirective',
        'CardKpiScaleTextDirective',
        'CardKpiAnalyticsDirective',
        'CardKpiAnalyticsLabelDirective',
        'CardKpiAnalyticsContentDirective'
    ],
    dynamicSideContent: [
        'DynamicSideContentComponent',
        'DynamicSideContentSideComponent',
        'DynamicSideContentMainComponent'
    ],
    breadcrumb: ['BreadcrumbComponent', 'BreadcrumbItemDirective', 'BreadcrumbLinkDirective'],
    busyIndicator: ['BusyIndicatorComponent'],
    button: ['ButtonComponent'],
    segmentedButton: ['SegmentedButtonComponent'],
    calendar: [
        'CalendarComponent',
        'CalendarDayViewComponent',
        'CalendarMonthViewComponent',
        'CalendarYearViewComponent',
        'CalendarHeaderViewComponent',
        'CalendarI18nLabels'
    ],
    carousel: ['CarouselComponent', 'CarouselItemComponent', 'CarouselService'],
    combobox: ['ComboboxComponent'],
    checkbox: ['CheckboxComponent'],
    contentDensity: [],
    datePicker: ['DatePickerComponent'],
    datetimePicker: ['DatetimePickerComponent'],
    dynamicPage: [
        'DynamicPageComponent',
        'DynamicPageSubheaderComponent',
        'DynamicPageHeaderComponent',
        'DynamicPageTitleContentComponent',
        'DynamicPageLayoutActionsComponent',
        'DynamicPageGlobalActionsComponent',
        'DynamicPageFooterComponent',
        'DynamicPageContentComponent'
    ],
    facets: [
      'FacetComponent',
      'FacetGroupComponent'
    ],
    feedInput: [
        'FeedInputComponent',
        'FeedInputTextareaDirective',
        'FeedInputButtonDirective',
        'FeedInputAvatarDirective'
    ],
    feedListItem: ['FeedListComponent', 'FeedListItemComponent'],
    fileUploader: [
        'FileUploaderComponent',
        'FileUploaderSelectDirective',
        'FileUploaderDragndropDirective',
        'FileUploaderService'
    ],
    fixedCardLayout: ['FixedCardLayoutComponent', 'CardDefinitionDirective', 'FixedCardLayoutItemComponent'],
    flexibleColumnLayout: ['FlexibleColumnLayoutComponent'],
    form: [
        'FormControlComponent',
        'FormGroupComponent',
        'FormItemComponent',
        'FormLabelComponent',
        'FormHeaderComponent',
        'FormLegendDirective',
        'FormMessageComponent',
        'FormSetDirective',
        'FormInputMessageGroupComponent'
    ],
    formattedText: ['FormattedTextComponent'],
    formMessage: ['FormInputMessageGroupComponent'],
    globalConfig: [],
    icon: ['IconComponent'],
    illustratedMessage: ['IllustratedMessageComponent'],
    infoLabel: ['InfoLabelComponent'],
    infiniteScroll: ['InfiniteScrollDirective'],
    inlineHelp: ['InlineHelpComponent'],
    inputGroup: ['InputGroupComponent'],
    layoutGrid: ['LayoutGridComponent', 'LayoutGridColDirective', 'LayoutGridRowDirective'],
    layoutPanel: [
        'LayoutPanelComponent',
        'LayoutPanelActionsComponent',
        'LayoutPanelBodyComponent',
        'LayoutPanelDescriptionComponent',
        'LayoutPanelFiltersComponent',
        'LayoutPanelFooterComponent',
        'LayoutPanelHeaderComponent',
        'LayoutPanelHeadComponent',
        'LayoutPanelTitleDirective'
    ],
    link: ['LinkComponent'],
    list: [
        'ListComponent',
        'ListItemDirective',
        'ListLabelDirective',
        'ListTitleDirective',
        'ListSecondaryDirective',
        'ListGroupHeaderDirective',
        'ListIconDirective',
        'ListFooterDirective',
        'ListMessageDirective'
    ],
    menu: [
        'MenuAddonDirective',
        'MenuComponent',
        'MenuGroupComponent',
        'MenuItemDirective',
        'MenuItemAddonDirective',
        'MenuListDirective',
        'MenuTitleDirective',
        'MenuKeyboardService'
    ],
    messageStrip: ['MessageStripComponent'],
    messageToast: ['MessageToastComponent', 'MessageToastConfig', 'MessageToastService', 'MessageToastRef'],
    dialog: [
        'DialogService',
        'DialogContainerComponent',
        'DialogTitleDirective',
        'DialogCloseButtonDirective',
        'DialogDecisiveButtonDirective',
        'DialogConfig',
        'DialogPosition',
        'DialogBodyComponent',
        'DialogHeaderComponent',
        'DialogFooterComponent',
        'DialogRef'
    ],
    multiInput: ['MultiInputComponent'],
    messageBox: [
        'MessageBoxRef',
        'MessageBoxConfig',
        'MessageBoxContent',
        'MessageBoxService',
        'MessageBoxComponent',
        'MessageBoxBodyComponent',
        'MessageBoxDecisiveButton',
        'MessageBoxHeaderComponent',
        'MessageBoxFooterComponent',
        'MessageBoxDefaultComponent',
        'MessageBoxSemanticIconComponent',
        'MessageBoxContainerComponent',
        'MessageBoxFooterButtonComponent'
    ],
    notification: [
        'NotificationComponent',
        'NotificationHeaderComponent',
        'NotificationBodyComponent',
        'NotificationFooterComponent',
        'NotificationServiceDirective',
        'NotificationActionsDirective',
        'NotificationAvatarDirective',
        'NotificationContentDirective',
        'NotificationDescriptionDirective',
        'NotificationMetadataDirective',
        'NotificationTextDirective',
        'NotificationTitleDirective',
        'DefaultNotificationComponent',
        'NotificationContainer',
        'NotificationConfig',
        'NotificationDefault',
        'NotificationRef'
    ],
    objectIdentifier: ['ObjectIdentifierComponent'],
    objectMarker: ['ObjectMarkerComponent'],
    objectStatus: ['ObjectStatusModule', 'ObjectStatusComponent'],
    pagination: ['PaginationComponent', 'PaginationModel', 'PaginationService'],
    panel: ['PanelComponent', 'PanelTitleDirective'],
    popover: [
        'PopoverComponent',
        'PopoverBodyComponent',
        'PopoverControlComponent',
        'PopoverDropdownComponent',
        'PopoverBodyHeaderDirective',
        'PopoverBodySubheaderDirective',
        'PopoverBodyFooterDirective'
    ],
    objectNumber: ['ObjectNumberComponent'],
    productSwitch: ['ProductSwitchComponent', 'ProductSwitchItem'],
    quickView: [
        'QuickViewComponent',
        'QuickViewTitleComponent',
        'QuickViewSubheaderComponent',
        'QuickViewSubheaderTitleComponent',
        'QuickViewSubheaderSubtitleComponent',
        'QuickViewGroupComponent',
        'QuickViewGroupTitleComponent',
        'QuickViewGroupItemComponent',
        'QuickViewGroupItemLabelComponent',
        'QuickViewGroupItemContentComponent'
    ],
    scrollSpy: ['ScrollSpyDirective'],
    select: ['SelectComponent', 'OptionComponent'],
    shellbar: [
        'ProductMenuComponent',
        'ShellbarComponent',
        'ShellbarActionComponent',
        'ShellbarActionsComponent',
        'ShellbarLogoComponent',
        'ShellbarSubtitleComponent',
        'ShellbarTitleComponent'
    ],
    sideNavigation: [
        'SideNavigationComponent',
        'SideNavigationModel',
        'SideNavigationUtilityDirective',
        'SideNavigationMainDirective',
        'NestedListDirective',
        'NestedListPopoverComponent',
        'NestedListHeaderDirective',
        'NestedListIconDirective',
        'NestedListItem',
        'NestedListModel',
        'NestedListLink',
        'NestedItemService'
    ],
    splitButton: ['SplitButtonComponent', 'SplitButtonMenuDirective', 'SplitButtonActionTitle'],
    table: [
        'TableBodyDirective',
        'TableCellDirective',
        'TableHeaderDirective',
        'TableRowDirective',
        'TableComponent',
        'TableResponsiveWrapperDirective',
        'TableWrapperComponent',
        'ColumnSortableDirective'
    ],
    tabs: [
        'TabListComponent',
        'TabPanelComponent',
        'TabTitleDirective',
        'TabNavComponent',
        'TabLinkDirective',
        'TabItemDirective',
        'TabTagDirective',
        'TabIconComponent',
        'TabCountDirective',
        'TabLabelDirective',
        'TabProcessDirective',
        'TabHeaderDirective',
        'TabCounterHeaderDirective',
        'TabProcessIconDirective',
        'TabItemExpandComponent',
        'TabSeparator',
        'TabInfo'
    ],
    text: ['TextComponent'],
    tile: [
        'TileComponent',
        'TileHeaderDirective',
        'TileContentDirective',
        'TileFooterDirective',
        'TileTitleDirective',
        'TileSubtitleDirective',
        'TileSectionDirective',
        'TileRefreshDirective',
        'TileFooterTextDirective',
        'TileHeaderContentDirective',
        'TileProfileImgDirective',
        'TileLogoDirective',
        'TileContentBylineDirective',
        'TileContentTextDirective',
        'TileBackgroundImgDirective',
        'TileToggleDirective',
        'TileContainerDirective',
        'TilePageIndicatorDirective',
        'TileDotDirective',
        'TileActionCloseDirective',
        'TileActionIndicatorDirective',
        'TileTitleContainerDirective',
        'TileActionContainerDirective',
        'TileSlideContainerDirective',
        'NumericContentDirective',
        'NumericContentKpiContainerDirective',
        'NumericContentKpiDirective',
        'NumericContentLaunchIconContainerDirective',
        'NumericContentLaunchIconDirective',
        'NumericContentScaleArrowDirective',
        'NumericContentScaleContainerDirective',
        'NumericContentScaleDirective',
        'NumericContentScaleTextDirective'
    ],
    time: ['TimeComponent', 'TimeI18n', 'TimeColumnComponent'],
    timePicker: ['TimePickerComponent'],
    title: ['TitleComponent'],
    switch: ['SwitchComponent'],
    stepInput: ['StepInputComponent'],
    slider: ['SliderComponent'],
    token: ['TokenComponent', 'TokenizerComponent'],
    toolbar: [
        'ToolbarComponent',
        'ToolbarContentComponent',
        'ToolbarOverflowContentComponent',
        'ToolbarSpacerComponent',
        'ThemesService'
    ],
    tree: ['TreeComponent', 'TreeChildComponent', 'TreeRowObjectModel'],
    ratingIndicator: ['RatingIndicatorComponent'],
    wizard: ['WizardComponent'],
    gridList: [
        'GridListComponent',
        'GridListItemComponent',
        'GridListTitleBarComponent',
        'GridListFilterBarComponent',
        'GridListMoreBtnComponent',
        'GridListFooterComponent',
        'GridListItemFooterBarComponent',
        'GridListItemToolbarComponent',
        'GridListGroupHeaderComponent'
    ],
    statusIndicator: ['StatusIndicatorComponent'],
    variantManagement: ['VariantManagementComponent']
};
