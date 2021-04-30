import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { forkJoin, fromEvent, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { DialogService, KeyUtil, MessageToastService, RtlService } from '@fundamental-ngx/core';

import { ApprovalFlowApproverDetailsComponent } from './approval-flow-approver-details/approval-flow-approver-details.component';
import { ApprovalFlowNodeComponent } from './approval-flow-node/approval-flow-node.component';
import { ApprovalFlowAddNodeComponent, ApprovalFlowNodeTarget, APPROVAL_FLOW_NODE_TYPES } from './approval-flow-add-node/approval-flow-add-node.component';
import { displayUserFn, isNodeApproved, trackByFn } from './helpers';
import {
    ApprovalDataSource,
    ApprovalGraphNode,
    ApprovalGraphNodeMetadata,
    ApprovalNode,
    ApprovalProcess,
    ApprovalStatus,
    ApprovalTeam,
    ApprovalUser
} from './interfaces';

interface ApprovalGraphColumn {
    nodes: ApprovalGraphNode[];
    index?: number;
    isPartial?: boolean;
    allNodesApproved?: boolean;
}

type ApprovalFlowGraph = ApprovalGraphColumn[];

type ApprovalFlowMessageType =
    'watchersChangeSuccess' |
    'approverAddSuccess' |
    'teamAddSuccess' |
    'nodeEdit' |
    'nodeRemove' |
    'nodesRemove' |
    'teamRemove' |
    'error';

@Component({
    selector: 'fdp-approval-flow',
    templateUrl: './approval-flow.component.html',
    styleUrls: ['./approval-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ApprovalFlowComponent implements OnInit, OnDestroy {
    /** Title which is displayed in the header of the Approval Flow component. */
    @Input() title = 'Approval  process';

    /** Data source for the Approval Flow component. */
    @Input() dataSource: ApprovalDataSource;

    /** A reference to the user details template */
    @Input() userDetailsTemplate: TemplateRef<any>;

    /** Whether to display due date warning in status */
    @Input() checkDueDate = false;

    /** Number of days before due date when status changes to `warning` with text 'Due in X days'.
     *  Not used if 'checkDueDate' equals false */
    @Input() dueDateThreshold = 7;

    /** A list of approval statuses that allow sending reminders to their approvers */
    @Input() allowSendRemindersForStatuses: ApprovalStatus[] = ['in progress', 'not started'];

    /** Whether the approval flow is editable */
    @Input() isEditAvailable = false;

    /** Text label for watchers list */
    @Input() watchersLabel = 'Watchers';

    /** Event emitted on approval flow node click. */
    @Output() nodeClick = new EventEmitter<ApprovalNode>();

    /** @hidden */
    @ViewChild('graphContainerEl') _graphContainerEl: ElementRef;

    /** @hidden */
    @ViewChild('graphEl') _graphEl: ElementRef;

    /** @hidden */
    @ViewChild('reminderTemplate') _reminderTemplate: TemplateRef<any>;

    /** @hidden */
    @ViewChildren(ApprovalFlowNodeComponent) _nodeComponents: QueryList<ApprovalFlowNodeComponent>;

    /** @hidden */
    _approvalProcess: ApprovalProcess;

    /** @hidden */
    _initialApprovalProcess: ApprovalProcess;

    /** @hidden */
    _previousApprovalProcess: ApprovalProcess;

    /** @hidden */
    _graph: ApprovalFlowGraph;

    /** @hidden */
    _isCarousel = false;

    /** @hidden */
    _carouselScrollX = 0;

    /** @hidden */
    _carouselStep = 0;

    /** @hidden */
    _maxCarouselStep = 0;

    /** @hidden */
    _metaMap: { [key: string]: ApprovalGraphNodeMetadata } = {};

    /**  @hidden */
    _dir: string;

    /**  @hidden */
    _isEditMode = false;

    /**  @hidden */
    _canAddBefore = false;

    /**  @hidden */
    _canAddAfter = false;

    /**  @hidden */
    _canAddParallel = false;

    /**  @hidden */
    _teams: ApprovalTeam[] = [];

    /**  @hidden */
    _usersForWatchersList: ApprovalUser[] = [];

    /**  @hidden */
    _selectedWatchers: ApprovalUser[] = [];

    /**  @hidden */
    _messages: { type: ApprovalFlowMessageType }[] = [];

    /**  @hidden */
    _displayUserFn = displayUserFn;

    /** @hidden */
    _trackByFn = trackByFn;

    /** @hidden */
    _emptyApprovalFlowSpotConfig = {
        spot: { url: 'assets/images/sapIllus-Spot-NoData.svg', id: 'sapIllus-Spot-NoData' }
    }

    private _editModeInitSub: Subscription;
    private subscriptions = new Subscription();

    /** @hidden */
    constructor(
        private _dialogService: DialogService,
        private _messageToastService: MessageToastService,
        private _cdr: ChangeDetectorRef,
        @Optional() private _rtlService: RtlService
    ) { }

    /** @hidden */
    get _isRTL(): boolean {
        return this._dir === 'rtl';
    }

    /** @hidden */
    get _selectedNodes(): ApprovalGraphNode[] {
        return this._nodeComponents
            .filter(nodeComponent => nodeComponent._isSelected)
            .map(nodeComponent => nodeComponent.node);
    }

    /** @hidden */
    ngOnInit(): void {
        if (!this.dataSource) {
            return;
        }

        this.subscriptions.add(
            this.dataSource.fetch().subscribe(approvalProcess => {
                this._initialApprovalProcess = cloneApprovalProcess(approvalProcess);
                this._buildView(approvalProcess);
            })
        );
        this.subscriptions.add(
            this._rtlService?.rtl.subscribe(isRtl => {
                this._dir = isRtl ? 'rtl' : 'ltr';
                this._cdr.detectChanges();
            })
        );

        this._listenOnResize();
    }

    /** @hidden Node click handler */
    _onNodeClick(node: ApprovalNode): void {
        const dialog = this._dialogService.open(ApprovalFlowApproverDetailsComponent, {
            data: {
                node: node,
                allowSendReminder: this.allowSendRemindersForStatuses.includes(node.status),
                ...this._defaultDialogOptions
            }
        });
        dialog.afterClosed.subscribe((reminderTargets) => {
            if (Array.isArray(reminderTargets)) {
                this._sendReminders(reminderTargets, node);
            }
        });
        this.nodeClick.emit(node);
    }

    /** @hidden Node edit mode checkbox change handler */
    _onNodeCheck(node: ApprovalNode): void {
        const checked = this._nodeComponents.filter(n => n._isSelected);
        const checkedNodesCount = checked.length;
        const canAdd = checkedNodesCount === 1 && !isNodeApproved(checked[0].node);

        this._canAddBefore = canAdd && this._metaMap[node.id].canAddNodeBefore;
        this._canAddAfter = canAdd && this._metaMap[node.id].canAddNodeAfter;
        this._canAddParallel = canAdd && this._metaMap[node.id].canAddParallel;
    }

    /** @hidden Watcher's avatar click handler */
    _onWatcherClick(watcher: ApprovalUser): void {
        this._dialogService.open(ApprovalFlowApproverDetailsComponent, {
            data: {
                watcher: watcher,
                ...this._defaultDialogOptions
            }
        });
    }

    /** @hidden Send approval reminders to selected users */
    _sendReminders(targets: ApprovalUser[], node: ApprovalNode): void {
        this.dataSource.sendReminders(targets, node).pipe(take(1)).subscribe(() => {
            this._messageToastService.open(this._reminderTemplate, {
                data: {
                    targets: targets,
                    node: node
                },
                duration: 5000
            });
        });
    }

    nextSlide(stepSize = 1): void {
        this._checkCarouselStatus();

        if (Math.abs(this._carouselScrollX) === this._scrollDiff) {
            return;
        }

        const newOffset = this._carouselScrollX - this._carouselStepSize * stepSize;
        const newCarouselStep = this._carouselStep + stepSize;

        this._carouselScrollX = (Math.abs(newOffset) > this._scrollDiff) ? -this._scrollDiff : newOffset;
        this._carouselStep = newCarouselStep <= this._maxCarouselStep ? newCarouselStep : this._maxCarouselStep;
        this._cdr.detectChanges();
    }

    previousSlide(stepSize = 1): void {
        this._checkCarouselStatus();

        if (this._carouselStep === 0) {
            return;
        }

        if (this._carouselStep === 1) {
            this._carouselScrollX = 0;
        } else {
            this._carouselScrollX += this._carouselStepSize * stepSize;
            this._carouselScrollX = this._carouselScrollX <= 0 ? this._carouselScrollX : 0;
        }

        const newCarouselStep = this._carouselStep - stepSize;
        this._carouselStep = newCarouselStep > 0 ? newCarouselStep : 0;
        this._cdr.detectChanges();
    }

    /** @hidden Handle node keydown and focus other node based on which key is pressed*/
    _onNodeKeyDown(
        event: KeyboardEvent,
        node: ApprovalGraphNode,
        firstColumn: boolean,
        firstNode: boolean,
        lastColumn: boolean,
        lastNode: boolean
    ): void {
        if (!KeyUtil.isKeyCode(event, [TAB, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW])) {
            return;
        }

        const { nodeIndex, columnIndex } = this._metaMap[node.id];
        const isTab = KeyUtil.isKeyCode(event, TAB);
        const isShift = event.shiftKey;
        const isTabMoveForwardPossible = !isShift && !lastNode && !lastColumn;
        const isTabMmoveBackwardPossible = isShift && !firstNode && !firstColumn;

        if (isTab && !isTabMoveForwardPossible && !isTabMmoveBackwardPossible) {
            return;
        }

        if (isTab) {
            const nodesSequence = this._graph
                .reduce((result, col) => result.concat(col.nodes), [])
                .filter(n => !n.blank && !n.space)
            const currentNodeIndex = nodesSequence.findIndex(n => n === node);
            const diff = isShift ? -1 : 1;
            const nextNode = nodesSequence[currentNodeIndex + diff];

            if (nextNode) {
                event.preventDefault();
                this._focusNode(nextNode, 1);
                return;
            }
        }

        event.preventDefault();
        let nextFocusTarget;

        if (KeyUtil.isKeyCode(event, UP_ARROW) && nodeIndex > 0) {
            nextFocusTarget = this._getNextVerticalNode(nodeIndex, columnIndex, 'up');
        }

        if (KeyUtil.isKeyCode(event, DOWN_ARROW)) {
            nextFocusTarget = this._getNextVerticalNode(nodeIndex, columnIndex, 'down');
        }

        if (KeyUtil.isKeyCode(event, LEFT_ARROW)) {
            nextFocusTarget = this._getNextHorizontalNode(nodeIndex, columnIndex, this._isRTL ? 'right' : 'left');
        }

        if (KeyUtil.isKeyCode(event, RIGHT_ARROW)) {
            nextFocusTarget = this._getNextHorizontalNode(nodeIndex, columnIndex, this._isRTL ? 'left' : 'right');
        }

        if (nextFocusTarget?.nextNode) {
            this._focusNode(nextFocusTarget.nextNode, nextFocusTarget.stepSize);
        }
    }

    /** @hidden Fetch all necessary data and enter edit mode */
    _enterEditMode(): void {
        this._editModeInitSub = forkJoin([
            this.dataSource.fetchWatchers().pipe(take(1)),
            this.dataSource.fetchTeams().pipe(take(1))
        ])
            .subscribe(([users, teams]) => {
                this._usersForWatchersList = users;
                this._teams = teams;
                this._selectedWatchers = [...this._approvalProcess.watchers];
                this._isEditMode = true;
                this._initialApprovalProcess = cloneApprovalProcess(this._approvalProcess);
            });
    }

    /** @hidden Send update approval process calls to DataSource and exit edit mode*/
    _saveEditModeChanges(): void {
        this._editModeInitSub?.unsubscribe();
        this._initialApprovalProcess = null;
        this._isEditMode = false;
        this._messages = [];

        this.dataSource.updateApprovals(this._approvalProcess.nodes);

        if (this._isWatchersListChanged) {
            this.dataSource.updateWatchers(this._selectedWatchers);
        }
    }

    /** @hidden Restore initial approval flow state and exit edit mode */
    _exitEditMode(): void {
        this._editModeInitSub?.unsubscribe();

        this._approvalProcess = cloneApprovalProcess(this._initialApprovalProcess);
        this._initialApprovalProcess = null;
        this._isEditMode = false;
        this._messages = [];

        this._buildView(this._approvalProcess);
    }

    /** @hidden Restore previously saved approval process state */
    _undoLastAction(): void {
        this._approvalProcess = cloneApprovalProcess(this._previousApprovalProcess);

        this._buildView(this._approvalProcess);
    }

    /** @hidden */
    _showMessage(type: ApprovalFlowMessageType): void {
        this._messages = [{ type: type }];
    }

    /** @hidden */
    _dismissMessage(index: number): void {
        this._messages.splice(index, 1);
    }

    /** @hidden Open add node dialog */
    _addNode(source: ApprovalGraphNode, type: ApprovalFlowNodeTarget): void {
        let showNodeTypeSelect = false;

        if (type !== 'empty') {
            showNodeTypeSelect = type === 'before';
        }

        const dialog = this._dialogService.open(ApprovalFlowAddNodeComponent, {
            data: {
                nodeTarget: type,
                showNodeTypeSelect: showNodeTypeSelect,
                teams: this._teams,
                node: Object.assign({}, getBlankNode(), { blank: false }),
                ...this._defaultDialogOptions
            }
        });
        
        dialog.afterClosed.subscribe((data: { node: ApprovalNode, nodeType: APPROVAL_FLOW_NODE_TYPES }) => {
            if (!data) {
                // TODO: Remove side effect
                if (type === 'empty') {
                    this._exitEditMode();
                }

                return;
            }

            const { node: addedNode, nodeType } = data;
            if (!addedNode) {
                return;
            }

            this._cacheCurrentApprovalProcess();

            if (addedNode.approvalTeamId) {
                const team = this._teams.find(t => t.id === addedNode.approvalTeamId);
                
                addedNode.description = team.name;
            }

            addedNode.id = `tempId${(Math.random() * 1000).toFixed()}`;
            addedNode.description = addedNode.description || addedNode.approvers[0].description;
            
            if (type !== 'empty') {
                addedNode.targets = source.targets;

                if (nodeType === APPROVAL_FLOW_NODE_TYPES.SERIAL) {
                    if (type === 'before') {
                        addedNode.targets = [source.id];
                        this._replaceTargetsInSourceNodes(source.id, [addedNode.id]);
                    } else {
                        source.targets = [addedNode.id];
                    }
                }

                if (nodeType === APPROVAL_FLOW_NODE_TYPES.PARALLEL) {
                    const parents = this._metaMap[source.id].parents;
                    parents.forEach(parentNode => parentNode.targets.push(addedNode.id));
                }
            }

            this._showMessage(addedNode.approvalTeamId ? 'teamAddSuccess' : 'approverAddSuccess');
            this._approvalProcess.nodes.push(addedNode);
            this._buildView(this._approvalProcess);
        });
    }

    /** @hidden */
    _addNodeFromToolbar(type: ApprovalFlowNodeTarget): void {
        const node = this._nodeComponents.length ? this._nodeComponents.filter(n => n._isSelected)[0]?.node : null;

        if (type === 'empty') {
            // TODO: Remove side effect
            this._enterEditMode();
        }

        this._addNode(node, type);
    }

    /** @hidden Open edit node dialog */
    _editNode(node: ApprovalNode): void {
        const dialog = this._dialogService.open(ApprovalFlowAddNodeComponent, {
            data: {
                isEdit: true,
                node: Object.assign({}, node),
                teams: this._teams,
                ...this._defaultDialogOptions
            }
        });

        dialog.afterClosed.subscribe((data: { node: ApprovalNode }) => {
            const updatedNode = data?.node;

            if (!updatedNode) {
                return;
            }

            this._cacheCurrentApprovalProcess();
            this._updateNode(updatedNode);
            this._showMessage('nodeEdit');
            this._buildView(this._approvalProcess);
        });
    }

    /** @hidden "Delete" button click handler */
    _onNodeDelete(nodeToDelete: ApprovalNode): void {
        this._cacheCurrentApprovalProcess();
        this._deleteNode(nodeToDelete);
        this._showMessage(nodeToDelete.approvalTeamId ? 'teamRemove' : 'nodeRemove');
        this._buildView(this._approvalProcess);
    }

    /** @hidden */
    _deleteCheckedNodes(): void {
        this._cacheCurrentApprovalProcess();

        this._nodeComponents
            .filter(c => c._isSelected)
            .forEach(({ node }) => {
                this._deleteNode(node);
                this._buildView(this._approvalProcess);
            });

        this._showMessage('nodesRemove');
    }

    /** @hidden Node drag move handler, used to check if need to highlight a drop zone rectangle */
    _onNodeDragMoved(node: ApprovalGraphNode): void {
        const draggedNodeDimensions = this._nodeComponents
            .find(comp => comp.node === node)._nativeElement.getBoundingClientRect();
            
        this._nodeComponents
            .filter(n => n.node !== node && Boolean(n.dropZones.length))
            .forEach(n => n._checkIfNodeDraggedInDropZone(draggedNodeDimensions));
    }

    /** @hidden Node drop handler */
    _onNodeDrop(nodeToDrop: ApprovalGraphNode, drag: CdkDrag): void {
        drag.reset();

        const dropTarget = this._nodeComponents.find(n => n._isAnyDropZoneActive);

        if (!dropTarget) {
            return;
        }

        const placement = dropTarget._activeDropZones[0].placement;

        this._nodeComponents.forEach(n => n._deactivateDropZones());
        this._deleteNode(nodeToDrop);

        if (placement === 'after') {
            nodeToDrop.targets = [...dropTarget.node.targets];
            dropTarget.node.targets = [nodeToDrop.id];
        }

        if (placement === 'before') {
            this._replaceTargetsInSourceNodes(dropTarget.node.id, [nodeToDrop.id]);
            nodeToDrop.targets = [dropTarget.node.id];
        }

        this._approvalProcess.nodes.push(nodeToDrop);
        this._buildView(this._approvalProcess);
    }

    /** @hidden */
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /** @hidden Build a graph to render based on provided data, node connections are managed by node's "targets" array */
    private _buildNodeTree(nodes: ApprovalGraphNode[]): ApprovalFlowGraph {
        const rootNodes = findRootNodes(nodes);
        const finalNodes = findFinalNodes(nodes);

        if (!rootNodes.length || !finalNodes.length) {
            return [];
        }

        const paths = getAllGraphPaths(rootNodes, nodes);
        const pathsWithBlankNodes = fillPathsWithBlankNodes(paths);
        const pathsWithSpaces = replaceDuplicatesWithSpacesInPaths(pathsWithBlankNodes);
        const notEmptyPaths = removeEmptyPaths(pathsWithSpaces);
        const columns = transformPathsIntoColumns(notEmptyPaths);
        const columnsWithoutEndSpaces = trimEndSpacesInColumns(columns);
        const onlyNotEmptyColumns = this._removeEmptyColumns(columnsWithoutEndSpaces);

        const allNodes = onlyNotEmptyColumns
            .reduce((acc, column) => acc.concat(column), [])
            .filter(node => !node.space);
        this._approvalProcess.nodes = allNodes;

        return transformColumnsIntoGraph(onlyNotEmptyColumns);
    }

    /** @hidden Build Approval Flow graph metadata */
    private _buildGraphMetadata(graph: ApprovalFlowGraph): { [key: string]: ApprovalGraphNodeMetadata } {
        const nodes: ApprovalGraphNode[] = graph.reduce((acc, column) => acc.concat(column.nodes), []);
        const metadata: { [key: string]: ApprovalGraphNodeMetadata } = {};

        graph.forEach((column, columnIndex) => {
            column.nodes.forEach((node, nodeIndex) => {
                const parents = findParentNodes(node, nodes);
                const isNodeNotApproved = !isNodeApproved(node);
                const allNodeParentsApproved = parents.every(_node => isNodeApproved(_node));
    
                metadata[node.id] = {
                    parents: parents,
                    isRoot: !parents.length && !node.blank && !node.space,
                    isLast: !node.targets.length && !node.blank && !node.space,
                    parallelStart: node.targets.length > 1,
                    parallelEnd: parents.length > 1,
                    columnIndex: columnIndex,
                    nodeIndex: nodeIndex,
                    canAddNodeBefore: node.status === 'not started' && !allNodeParentsApproved,
                    canAddNodeAfter: isNodeNotApproved,
                    canAddParallel: isNodeNotApproved,
                };
            });
        });

        /* Some flags can be calculated only at the 2nd run, if all nodes already have metadata */
        graph.forEach((column, columnIndex) => {
            column.nodes.forEach((node, nodeIndex) => {
                const nodeMetadata = metadata[node.id];

                const isTargetParallelEnd = metadata[node.targets[0]]?.parallelEnd;
                nodeMetadata.isLastInParallel = isTargetParallelEnd;

                const isParentParallelStart = metadata[nodeMetadata.parents[0]?.id]?.parallelStart;
                nodeMetadata.isFirstInParallel = isParentParallelStart;

                const nextNotEmptyVNode = getNextNotEmptyNode(nodeIndex, column.nodes);
                const nextNotEmptyVNodeMetadata = metadata[nextNotEmptyVNode?.id];

                const prevVNode = column.nodes[nodeIndex - 1];
                const prevVNodeMetadata = metadata[prevVNode?.id];
                const nextVNode = column.nodes[nodeIndex + 1];

                const isNextVNodeHasSameTarget = node.targets.length && nextNotEmptyVNode?.targets[0] === node.targets[0];
                const renderVerticalLineAfter = 
                    isNextVNodeHasSameTarget
                    || ((nextVNode?.blank || nextVNode?.space) && prevVNodeMetadata?.renderVerticalLineAfter);
                nodeMetadata.renderVerticalLineAfter = Boolean(renderVerticalLineAfter);

                const isNextVNodeHasSameParent = nextNotEmptyVNodeMetadata?.parents[0]?.id === nodeMetadata.parents[0]?.id;
                const renderVerticalLineBefore = 
                    isNextVNodeHasSameParent 
                    || ((node?.blank || node?.space) && prevVNodeMetadata?.renderVerticalLineBefore);
                nodeMetadata.renderVerticalLineBefore = Boolean(renderVerticalLineBefore);
            });
        });

        return metadata;
    }

    /** @hidden Build Approval Flow graph and render it */
    private _buildView(approvalProcess: ApprovalProcess): void {
        this._approvalProcess = approvalProcess;
        this._metaMap = {};

        this._graph = this._buildNodeTree(this._approvalProcess.nodes);
        this._metaMap = this._buildGraphMetadata(this._graph);

        this._resetCheckedNodes();
        this._cdr.detectChanges();
        this._checkCarouselStatus();

        if (!this._isEditMode) {
            this._resetCarousel();
        }
    }

    /** @hidden Listen window resize and distribute cards on column change */
    private _listenOnResize(): void {
        this.subscriptions.add(
            fromEvent(window, 'resize')
                .pipe(debounceTime(60))
                .subscribe(() => {
                    this._resetCarousel();
                    this._checkCarouselStatus();
                })
        );
    }

    /** @hidden */
    private _focusNode(node: ApprovalGraphNode, step: number): void {
        const nodeToFocus = this._nodeComponents.find(comp => comp.node === node);

        if (!nodeToFocus) {
            return;
        }

        const nodeRect = nodeToFocus._nativeElement.getBoundingClientRect();
        const graphContainerRect = this._graphContainerEl.nativeElement.getBoundingClientRect();
        const graphVisibilityThreshold = graphContainerRect.width;
        const nodeOffsetFromContainerEdge = this._isRTL ?
            (graphContainerRect.right - nodeRect.right) :
            (nodeRect.left - graphContainerRect.left);

        nodeToFocus._focus();

        if ((nodeOffsetFromContainerEdge + nodeRect.width) > graphVisibilityThreshold) {
            this.nextSlide(step);
            return;
        }

        if (nodeOffsetFromContainerEdge < 0) {
            this.previousSlide(step);
        }
    }

    /** @hidden Update node object in local approval process data structure */
    private _updateNode(node: ApprovalNode): void {
        const nodeIndex = this._approvalProcess.nodes.findIndex(n => n.id === node.id);
        
        if (nodeIndex > -1) {
            this._approvalProcess.nodes[nodeIndex] = node;
        }
    }

    /** @hidden Delete node object in local approval process data structure */
    private _deleteNode(nodeToDelete: ApprovalNode): void {
        const nodes = [...this._approvalProcess.nodes];
        const metadata = this._metaMap[nodeToDelete.id];

        const isParentParallelStart = this._metaMap[metadata.parents[0]?.id]?.parallelStart;
        const isTargetParallelEnd = this._metaMap[nodeToDelete.targets[0]]?.parallelEnd;

        let targets: string[] = [];
        if (!isParentParallelStart || !isTargetParallelEnd) {
            targets = nodeToDelete.targets;
        }

        this._replaceTargetsInSourceNodes(nodeToDelete.id, targets);
        nodes.splice(nodes.findIndex(node => node.id === nodeToDelete.id), 1);
        this._approvalProcess.nodes = nodes;
    }

    /** @hidden Replace all occurrences of "idToReplace" in all nodes' "targets" with ones in "replaceWith" array */
    private _replaceTargetsInSourceNodes(idToReplace: string, replaceWith: string[]): void {
        this._approvalProcess.nodes.forEach(n => {
            if (isNodeTargetsIncludeId(n, idToReplace)) {
                n.targets = n.targets.filter(_id => _id !== idToReplace);
                n.targets.push(...replaceWith);
            }
        });
    }

    /** @hidden Save current state of approval process data to be able to undo an action made in edit mode */
    private _cacheCurrentApprovalProcess(): void {
        this._previousApprovalProcess = cloneApprovalProcess(this._approvalProcess);
    }

    /** @hidden Check if need to add carousel controls */
    private _checkCarouselStatus(): void {
        if (!this._graphEl) {
            return;
        }

        this._isCarousel = this._graphEl.nativeElement.scrollWidth > this._graphEl.nativeElement.clientWidth;
        this._maxCarouselStep = Math.ceil(this._scrollDiff / this._carouselStepSize);
        this._cdr.detectChanges();
    }

    /** @hidden Reset the current state of carousel */
    private _resetCarousel(): void {
        this._carouselStep = 0;
        this._carouselScrollX = 0;
    }

    /** @hidden Reset node selection */
    private _resetCheckedNodes(): void {
        this._nodeComponents?.forEach(c => c._isSelected = false);
        this._canAddAfter = false;
        this._canAddBefore = false;
        this._canAddParallel = false;
    }

    /** @hidden */
    private _getNextHorizontalNode = (
        nodeIndex: number,
        columnIndex: number,
        direction: 'left' | 'right',
        stepSize = 1
    ) => {
        const indexDiff = (direction === 'right' ? 1 : -1);
        const nextColumn = this._graph[columnIndex + indexDiff];
        const nextNode = nextColumn.nodes[nodeIndex];

        if (!nextNode) {
            return { nextNode: undefined, stepSize: stepSize };
        }

        if (nextNode.blank || nextNode.space) {
            return this._getNextHorizontalNode(nodeIndex, columnIndex + indexDiff, direction, stepSize + 1);
        }

        return { nextNode: nextNode, stepSize: stepSize };
    };

    /** @hidden */
    private _getNextVerticalNode = (
        nodeIndex: number,
        columnIndex: number,
        direction: 'up' | 'down',
        stepSize = 1
    ) => {
        const indexDiff = (direction === 'down' ? 1 : -1);
        const currColumn = this._graph[columnIndex];
        const nextNode = currColumn.nodes[nodeIndex + indexDiff];

        if (!nextNode) {
            return { nextNode: undefined, stepSize: stepSize };
        }
        
        if (nextNode.blank || nextNode.space) {
            return this._getNextVerticalNode(nodeIndex + indexDiff, columnIndex, direction, stepSize + 1);
        }

        return { nextNode: nextNode, stepSize: stepSize };
    };

    /** @hidden */
    private get _carouselStepSize(): number {
        return this._graphEl.nativeElement.scrollWidth / this._graphEl.nativeElement.children.length;
    }

    /** @hidden */
    private get _scrollDiff(): number {
        return this._graphEl.nativeElement.scrollWidth - this._graphEl.nativeElement.clientWidth;
    }

    /** @hidden */
    private get _defaultDialogOptions(): any {
        return {
            approvalFlowDataSource: this.dataSource,
            userDetailsTemplate: this.userDetailsTemplate,
            rtl: this._isRTL
        };
    }

    /** @hidden */
    private get _isWatchersListChanged(): boolean {
        return this._selectedWatchers.length !== this._approvalProcess.watchers.length ||
            this._selectedWatchers.some(watcher => !this._approvalProcess.watchers.find(_watcher => _watcher === watcher));
    }

    /** @hidden */
    private _removeEmptyColumns(columns: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
        const processedColumns: ApprovalNode[][] = [];
    
        columns.forEach(column => {
            const areAllNodesEmpty = column.every(node => node.blank || node.space);
    
            if (areAllNodesEmpty) {
                column
                    .filter(node => node.blank)
                    .forEach(node => this._replaceTargetsInSourceNodes(node.id, node.targets))
            } else {
                processedColumns.push(column);
            }
        });
    
        return processedColumns;
    }
}

function findRootNodes(nodes: ApprovalNode[]): ApprovalNode[] {
    return nodes.filter(node => nodes.every(n => !isNodeTargetsIncludeId(n, node.id)));
}

function findFinalNodes(nodes: ApprovalNode[]): ApprovalNode[] {
    return nodes.filter(node => !node.targets.length); 
}

function findParentNodes(node: ApprovalNode, nodes: ApprovalNode[]): ApprovalNode[] {
    return nodes.filter(_node => isNodeTargetsIncludeId(_node, node.id));
}

function getBlankNode(): ApprovalGraphNode {
    return {
        id: `blankId${(Math.random() * 1000).toFixed()}`,
        name: '',
        targets: [],
        approvers: [],
        status: 'not started',
        blank: true
    };
}

function getSpaceNode(): ApprovalGraphNode {
    return {
        id: `spaceId${(Math.random() * 1000).toFixed()}`,
        name: '',
        targets: [],
        approvers: [],
        status: 'not started',
        space: true
    };
}

function getNextNotEmptyNode(nodeIndex: number, nodes: ApprovalGraphNode[]): ApprovalGraphNode {
    const nextNode = nodes[nodeIndex + 1];

    return nextNode?.blank || nextNode?.space ? getNextNotEmptyNode(nodeIndex + 1, nodes) : nextNode;
}

function isNodeTargetsIncludeId(node: ApprovalNode, id: string): boolean {
    return node.targets.includes(id);
}

function cloneApprovalProcess(approvalProcess: ApprovalProcess): ApprovalProcess {
    return {
        watchers: [...approvalProcess.watchers],
        nodes: approvalProcess.nodes.map(n => {
            const node = { ...n };
            node.targets = [...n.targets];
            node.approvers = [...n.approvers];
            return node;
        })
    };
}

function getAllGraphPaths(rootNodes: ApprovalGraphNode[], nodes: ApprovalGraphNode[]): ApprovalGraphNode[][] {
    const paths: ApprovalGraphNode[][] = [];
    const queue: ApprovalGraphNode[][] = [];

    rootNodes.forEach(rootNode => {
        queue.push([rootNode]);

        while (queue.length) {
            const path = queue.pop();
            const lastNodeInPath = path[path.length - 1];
            
            if (!lastNodeInPath.targets.length) {
                paths.push(path);
            } else {
                lastNodeInPath.targets.forEach(targetId => {
                    const targetNode = nodes.find(node => node.id === targetId);
                    const newPath = [...path, targetNode];
                    
                    queue.push(newPath);
                });
            }
        }
    });

    return paths;
}

function fillPathsWithBlankNodes(paths: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
    const processedPaths: ApprovalGraphNode[][] = [];
    const pathLengths = paths.map(path => path.length);
    const longestPathLength = Math.max(...pathLengths);
    
    paths.forEach(path => {
        if (path.length === longestPathLength) {
            processedPaths.push(path);
            return;
        }

        path.forEach((node, nodeIndex) => {
            let emptyNodes = getBlankNodesAfterFromProcessedPaths(node, processedPaths);
            
            if (emptyNodes.length) {
                path.splice(nodeIndex, 0, ...emptyNodes);
                return;
            }

            const nodeIndexes = paths.map(_path => _path.indexOf(node));
            const mostFarPathNodeIndex = Math.max(...nodeIndexes);

            if (nodeIndex < mostFarPathNodeIndex) {
                emptyNodes = getEmptyNodes(mostFarPathNodeIndex - nodeIndex, path[nodeIndex - 1].status);

                emptyNodes[emptyNodes.length - 1].targets = [node.id];
                path[nodeIndex - 1].targets = [emptyNodes[0].id];

                path.splice(nodeIndex, 0, ...emptyNodes);
                return;
            }

            if (nodeIndex === mostFarPathNodeIndex && nodeIndex === path.length - 1) {
                emptyNodes = getEmptyNodes(longestPathLength - path.length, 'not started', 'space');

                path.splice(nodeIndex + 1, 0, ...emptyNodes);
                return;
            }
        });

        processedPaths.push(path);
    });

    return processedPaths;
}

function getBlankNodesAfterFromProcessedPaths(
    node: ApprovalGraphNode,
    processedPaths: ApprovalGraphNode[][]
): ApprovalGraphNode[] {
    const blankNodes: ApprovalGraphNode[] = [];

    const pathWithNextBlankNode = processedPaths.find(path => {
        const nodeIndex = path.indexOf(node);
        if (nodeIndex > -1 && path[nodeIndex + 1]?.blank) {
            return true;
        }

        return false;
    });

    if (pathWithNextBlankNode) {
        const nodeIndex = pathWithNextBlankNode.indexOf(node);

        for (let i = nodeIndex + 1; i < pathWithNextBlankNode.length; i++) {
            const _node = pathWithNextBlankNode[i];

            if (_node.blank) {
                blankNodes.push(_node);
            } else {
                break;
            }
        }
    }

    return blankNodes;
}

function getEmptyNodes(
    count: number,
    status: ApprovalStatus = 'not started',
    nodeType: 'blank' | 'space' = 'blank',
): ApprovalGraphNode[] {
    const nodes: ApprovalGraphNode[] = [];
    const nodeFn = nodeType === 'blank' ? getBlankNode : getSpaceNode;

    let node: ApprovalGraphNode;
    let nodeId: string;

    for (let i = count; i > 0; i--) {
        node = Object.assign({}, nodeFn(), { targets: [ nodeType === 'blank' && nodeId ], status: status })
        nodeId = node.id;

        nodes.unshift(node);
    }

    return nodes;
}

function replaceDuplicatesWithSpacesInPaths(paths: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
    const processedPaths: ApprovalGraphNode[][] = [];

    paths.forEach((path, index) => {
        path.forEach(node => {
            const pathsWithNode = paths
                .filter((_path, _index) => {
                    return _index !== index
                        && _path.indexOf(node) > -1;
                });

            pathsWithNode.forEach(_path => {
                const nodeIndex = _path.indexOf(node);

                _path.splice(nodeIndex, 1, getSpaceNode());
            });
        });

        processedPaths.push(path);
    });

    return processedPaths;
}

function removeEmptyPaths(paths: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
    const processedPaths: ApprovalGraphNode[][] = [];

    paths.forEach((path, index) => {
        const currentPath = [...path];
        const isPathEmpty = path.every(node => node.space);

        if (!isPathEmpty) {
            processedPaths.push(currentPath);
        }
    });

    return processedPaths;
}

function transformPathsIntoColumns(paths: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
    const columns: ApprovalGraphNode[][] = [];
    let column: ApprovalGraphNode[] = [];

    for (let i = 0; i < paths[0].length; i++) {
        column = [];

        for (let v = 0; v < paths.length; v++) {
            column.push(paths[v][i]);
        }

        columns.push(column);
    }

    return columns;
}

function trimEndSpacesInColumns(columns: ApprovalGraphNode[][]): ApprovalGraphNode[][] {
    const processedColumns: ApprovalNode[][] = [];

    columns.forEach(column => {
        let lastNotSpaceNodeIndex;

        for (let i = column.length - 1; i >= 0; i--) {
            if (!column[i].space) {
                lastNotSpaceNodeIndex = i;
                break;
            }
        }

        if (lastNotSpaceNodeIndex < column.length) {
            processedColumns.push(column.slice(0, lastNotSpaceNodeIndex + 1))
        } else {
            processedColumns.push(column);
        }
    });

    return processedColumns;
}

function transformColumnsIntoGraph(columns: ApprovalGraphNode[][]): ApprovalFlowGraph {
    const graph: ApprovalFlowGraph = [];

    columns.forEach((column, index) => {
        const blankNodes = column.filter(node => node.blank);

        graph[index] = {
            nodes: column,
            index: index, 
            isPartial: blankNodes.length > 0,
            allNodesApproved: column.every(node => isNodeApproved(node))
        };
    });

    return graph;
}
