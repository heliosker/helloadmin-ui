import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import './index.less'
import "ant-design-vue/lib/table/style/index.css";
import "ant-design-vue/lib/menu/style/index.css";
import "ant-design-vue/lib/dropdown/style/index.css";
import { useRoute } from "vue-router";
import { ColumnProps, TableProps } from 'ant-design-vue/lib/table/interface'
import { useRouter } from 'vue-router';
import { defineComponent, reactive, PropType, watch, UnwrapRef, ref, computed, onMounted, onUpdated } from 'vue'

import { Table, Popover, Checkbox, Dropdown, Menu, Button } from 'ant-design-vue';
import { SettingOutlined, ColumnHeightOutlined, ReloadOutlined, DragOutlined, FullscreenExitOutlined, FullscreenOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Container, Draggable } from "vue3-smooth-dnd";
// import { Icon } from '@/utils/icon'

interface Columns extends ColumnProps {
    actions?: any
    dataIndex: string,
    title: string
}
interface Sorter {
    field?: any
    order: any
}
interface Pagination {
    current?: number
    pageSize?: number
}
interface Data {
    data: () => void
}
interface LocalPagination {
    current: number
    pageSize: number,
    hideOnSinglePage: boolean
    total: number
    showSizeChanger: boolean
}
interface State {
    needTotalList: Array<any>
    selectedRows: Array<any>
    selectedRowKeys: Array<any>
    localLoading: boolean
    localDataSource: Array<any>
    localPagination: LocalPagination | any
}
interface TopState {
    visible: boolean
    checkAll: boolean
    openPopover: boolean
    fullscreen: boolean
    selectedSize: String
    checkList: Array<any>,
    currentColumns: Array<any>
}
// type pageOption = Partial<typeof PaginationProps>
// interface Props extends Omit<TableProps, 'columns'> {
//     columns: Columns[]
//     rowKey: string | ((record: any) => string)
//     pageOption: pageOption
//     getList: (prams: any) => any
// }
export default defineComponent({
    components: {
        Table,
        Popover,
        Checkbox
    },
    emits: ['expand', 'add'],
    props: Object.assign({}, T.props, {
        rowKey: {
            type: [String, Function],
            default: 'key'
        },
        data: {
            type: Function as PropType<() => void>
        },
        pageNum: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        showSizeChanger: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'default'
        },
        /**
         * alert: {
         *   show: true,
         *   clear: Function
         * }
         */
        alert: {
            type: [Object, Boolean],
            default: null
        },
        rowSelection: {
            type: Object,
            default: null
        },
        /** @Deprecated */
        showAlertInfo: {
            type: Boolean,
            default: false
        },
        showPagination: {
            type: [String, Boolean],
            default: 'auto'
        },
        columns: {
            type: Object as PropType<Columns[]>
        },
        expandedRowKeys: {
            type: Array,
            default: []
        },
        /**
         * enable page URI mode
         *
         * e.g:
         * /users/1
         * /users/2
         * /users/3?queryParam=test
         * ...
         */
        pageURI: {
            type: Boolean,
            default: false
        }
    }),
    setup(props, context) {
        const { alert, rowSelection, columns } = props;
        const { slots, emit } = context;
        const state: UnwrapRef<State> = reactive({
            needTotalList: [],
            selectedRows: [],
            selectedRowKeys: [],
            localLoading: false,
            localDataSource: [],
            localPagination: Object.assign({}, props.pagination)
        })
        const newColumns = props.columns.map(v => v.dataIndex)
        const topState: UnwrapRef<TopState> = reactive({
            visible: false,
            checkAll: true,
            openPopover: false,
            fullscreen: false,
            selectedSize: 'default',
            checkList: newColumns,
            currentColumns: [...props.columns]
        })
        const router = useRouter();

        // const { pageNo } = this.$route.params
        const route = useRoute()
        const { pageNo }: any = route.params
        const localPageNum = props.pageURI && (pageNo && parseInt(pageNo)) || props.pageNum
        state.localPagination = ['auto', true].includes(props.showPagination) && Object.assign({}, state.localPagination, {
            current: localPageNum,
            pageSize: props.pageSize,
            showSizeChanger: props.showSizeChanger
        }) || false;
        const initTotalList = (columns) => {
            const totalList: any = []
            columns && columns instanceof Array && columns.forEach(column => {
                if (column.needTotal) {
                    totalList.push({
                        ...column,
                        total: 0
                    })
                }
            })
            return totalList
        }
        state.needTotalList = initTotalList(topState.currentColumns)

        /**
         * ????????????????????????
         * ??????????????? true, ???????????????????????????
         * @param Boolean bool
         */
        const refresh = (bool = false) => {
            bool && (state.localPagination = Object.assign({}, {
                current: 1, pageSize: props.pageSize
            }))
            loadData()
        }
        /**
         * ??????????????????
         * @param {Object} pagination ???????????????
         * @param {Object} filters ????????????
         * @param {Object} sorter ????????????
         */
        const loadData = async (pagination?: Pagination, filters?: object, sorter?: Sorter) => {
            state.localLoading = true
            const parameter = Object.assign({
                page: (pagination && pagination.current) ||
                    props.showPagination && state.localPagination.current || props.pageNum,
                size: (pagination && pagination.pageSize) ||
                    props.showPagination && state.localPagination.pageSize || props.pageSize
            },
                (sorter && sorter.field && {
                    sortField: sorter.field
                }) || {},
                (sorter && sorter.order && {
                    sortOrder: sorter.order
                }) || {}, {
                ...filters
            }
            )
            try {
                const result = await props.data(parameter)
                const meta = result.meta;
                // ??????????????????????????????????????????????????????????????? r.pageNo, r.totalCount, r.data
                // eslint-disable-next-line
                state.localPagination = props.showPagination && Object.assign({}, state.localPagination, {
                    current: meta.page, // ?????????????????????????????????
                    total: meta.count, // ??????????????????????????????
                    showSizeChanger: props.showSizeChanger,
                    pageSize: (pagination && pagination.pageSize) ||
                        state.localPagination.pageSize
                }) || false
                // ??????????????????????????????????????????????????????????????? 0 ,????????????????????????
                if (result.data.length === 0 && props.showPagination && props.localPagination.current > 1) {
                    state.localPagination.current--
                    loadData()
                    return
                }

                // ??????????????????????????????????????? r.totalCount ??? this.showPagination = true ??? pageNo ??? pageSize ?????? ??? totalCount ???????????? pageNo * pageSize ?????????
                // ??????????????????????????????????????????????????????????????? table ????????????
                try {
                    if ((['auto', true].includes(props.showPagination) && meta.count <= (meta.page * state.localPagination.pageSize))) {
                        state.localPagination.hideOnSinglePage = true
                    }
                } catch (e) {
                    state.localPagination = false
                }
                state.localDataSource = result.data // ??????????????????????????????
                state.localLoading = false

            } catch (error) {
                state.localLoading = false
            }
            // if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
            // result.then(r => {
            //     state.localPagination = props.showPagination && Object.assign({}, state.localPagination, {
            //         current: r.pageNo, // ?????????????????????????????????
            //         total: r.totalCount, // ??????????????????????????????
            //         showSizeChanger: props.showSizeChanger,
            //         pageSize: (pagination && pagination.pageSize) ||
            //             state.localPagination.pageSize
            //     }) || false
            //     // ??????????????????????????????????????????????????????????????? 0 ,????????????????????????
            //     if (r.data.length === 0 && props.showPagination && props.localPagination.current > 1) {
            //         state.localPagination.current--
            //         loadData()
            //         return
            //     }

            //     // ??????????????????????????????????????? r.totalCount ??? this.showPagination = true ??? pageNo ??? pageSize ?????? ??? totalCount ???????????? pageNo * pageSize ?????????
            //     // ??????????????????????????????????????????????????????????????? table ????????????
            //     try {
            //         if ((['auto', true].includes(props.showPagination) && r.totalCount <= (r.pageNo * state.localPagination.pageSize))) {
            //             state.localPagination.hideOnSinglePage = true
            //         }
            //     } catch (e) {
            //         state.localPagination = false
            //     }
            //     state.localDataSource = r.data // ??????????????????????????????
            //     state.localLoading = false
            // })
            // }
        }
        /**
         * ???????????????????????????????????? total ??????
         * @param selectedRowKeys
         * @param selectedRows
         */
        const updateSelect = (selectedRowKeys, selectedRows) => {
            state.selectedRows = selectedRows
            state.selectedRowKeys = selectedRowKeys
            const list: any = state.needTotalList
            state.needTotalList = list.map((item: any) => {
                return {
                    ...item,
                    total: selectedRows.reduce((sum, val) => {
                        const total = sum + parseInt(get(val, item.dataIndex))
                        return isNaN(total) ? 0 : total
                    }, 0)
                }
            })
        }
        /**
         * ?????? table ????????????
         */
        const clearSelected = () => {
            if (props.rowSelection) {
                props.rowSelection.onChange([], [])
                updateSelect([], [])
            }
        }
        /**
         * ???????????? table ?????????????????? clear ??????????????????????????????????????????
         * @param callback
         * @returns {*}
         */
        const renderClear = (callback) => {
            if (state.selectedRowKeys.length <= 0) return null
            return (
                <a style="margin-left: 24px" onClick={() => {
                    callback()
                    clearSelected()
                }}>??????</a>
            )
        }
        const renderAlert = () => {
            // ?????????????????????

            const needTotalItems = state.needTotalList.map((item: any) => {
                return (<span style="margin-right: 12px">
                    {item.title}?????? <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
                </span>)
            })

            // ?????? ?????? ??????
            const clearItem = (typeof props.alert.clear === 'boolean' && props.alert.clear) ? (
                renderClear(clearSelected())
            ) : (props.alert !== null && typeof props.alert.clear === 'function') ? (
                renderClear(props.alert.clear)
            ) : null

            // ?????? alert ??????
            return (
                <>
                    <a-alert showIcon={true} style="margin-bottom: 16px" v-slots={{
                        message: () => <template >
                            <span style="margin-right: 12px">?????????: <a style="font-weight: 600">{state.selectedRows.length}</a></span>
                            {needTotalItems}
                            {clearItem}
                        </template>
                    }}>
                    </a-alert>
                </>
            )
        }
        const onCheckAllChange = (e: any) => {
            const newColumns = topState.currentColumns.map(v => v.dataIndex);
            Object.assign(topState, {
                checkList: e.target.checked ? newColumns : []
            });
        }
        const applyDrag = (arr, dragResult) => {
            const { removedIndex, addedIndex, payload } = dragResult;
            if (removedIndex === null && addedIndex === null) return arr;
            const result = [...arr];
            let itemToAdd = payload;
            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }
            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }
            return result;
        }
        const onDrop = (dropResult) => {
            const newColumns = applyDrag(topState.currentColumns, dropResult);
            topState.currentColumns = newColumns;
        }
        const expand = (expanded, record) => {
            emit('expand', expanded, record)
        }
        // ??????????????????
        const changeSize = ({ key }) => {
            topState.selectedSize = key
        }
        const handleFullScreen = () => {
            let element: any = document.getElementById('pro-table');
            let doc: any = document;
            if (topState.fullscreen) {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            topState.fullscreen = !topState.fullscreen;
        }
        // ??????
        const reset = () => {
            topState.currentColumns = props.columns;
            topState.checkList = newColumns;
        }
        const add = () => {
            emit('add', true)
        }
        loadData()
        watch(
            () => state.localPagination.current,
            (val) => {
                props.pageURI && router.push({
                    ...route,
                    params: Object.assign({}, route.params, {
                        pageNo: val
                    })
                })
                state.needTotalList = initTotalList(topState.currentColumns)
                state.selectedRowKeys = []
                state.selectedRows = []
            }
        )
        watch(
            () => props.pageNum,
            (val) => {
                Object.assign(state.localPagination, {
                    current: val
                })
            }
        )
        watch(
            () => props.pageSize,
            (val) => {
                Object.assign(state.localPagination, {
                    pageSize: val
                })
            }
        )
        watch(
            () => props.showSizeChanger,
            (val) => {
                Object.assign(state.localPagination, {
                    showSizeChanger: val
                })
            }
        )
        watch(
            () => topState.checkList,
            val => {
                topState.checkAll = val.length === topState.currentColumns.length
            }
        );
        return {
            state,
            topState,
            columns,
            emit,
            add,
            renderAlert,
            updateSelect,
            loadData,
            onCheckAllChange,
            onDrop,
            reset,
            handleFullScreen,
            changeSize,
            applyDrag,
            refresh,
            expand,
            alert,
            rowSelection,
        }
    },
    render() {
        let props: any = {}
        const localKeys = Object.keys(this.state)
        const newColumn = [...this.topState.currentColumns];
        const menuData = [{ key: 'default', title: '??????' }, { key: 'middle', title: '??????' }, { key: 'small', title: '??????' }]
        const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert
        Object.keys(T.props).forEach(k => {
            const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
            if (localKeys.includes(localKey)) {
                props[k] = this.state[localKey]
                return props[k]
            }
            if (k === 'rowSelection') {
                if (showAlert && this.rowSelection) {
                    // ??????????????????alert?????????????????? rowSelection ??????
                    props[k] = {
                        ...this.rowSelection,
                        selectedRows: this.state.selectedRows,
                        selectedRowKeys: this.state.selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.updateSelect(selectedRowKeys, selectedRows)
                            typeof this.state[k].onChange !== 'undefined' && this.state[k].onChange(selectedRowKeys, selectedRows)
                        }
                    }
                    return props[k]
                } else if (!this.rowSelection) {
                    // ????????????????????? rowSelection ???????????????????????????
                    props[k] = null
                    return props[k]
                }
            }
            (this.state[k] || this[k]) && (props[k] = (this.state[k] || this[k]))
            return props[k]
        })
        props.columns = newColumn.filter(v => this.topState.checkList.includes(v.dataIndex))
        props = {
            ...this.$attrs,
            ...props,
        };
        const table = (
            <Table {...props} onChange={this.loadData} size={this.topState.selectedSize} onExpand={(expanded, record) => this.expand(expanded, record)}>
            </Table>
        )
        const sizeMenu = (
            <Menu
                onClick={this.changeSize}
                selectedKeys={[this.topState.selectedSize]}>
                {menuData.map(item => (
                    <Menu.Item key={item.key}>
                        <span>{item.title}</span>
                    </Menu.Item>
                ))}
            </Menu>
        )
        return (
            <div class="pro-table ant-card" id="pro-table">
                <div class="ant-pro-table-list-toolbar">
                    <div class="ant-pro-table-list-toolbar-container">
                        <div class="ant-pro-table-list-toolbar-left">
                            <div class="ant-pro-table-list-toolbar-title">????????????</div>
                        </div>
                        <div class="ant-pro-table-list-toolbar-right">
                            <div class="ant-pro-table-list-toolbar-setting-item">
                                <Button type="primary" onClick={this.add} v-slots={{
                                    icon: () => <PlusOutlined />
                                }}>??????</Button>
                            </div>
                            <div class="ant-pro-table-list-toolbar-setting-item">
                                <ReloadOutlined onClick={() => this.refresh(true)} />
                            </div>
                            <div class="ant-pro-table-list-toolbar-setting-item">
                                <Dropdown
                                    overlayStyle={{ width: '80px' }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                    overlay={sizeMenu}
                                >
                                    <ColumnHeightOutlined />
                                </Dropdown>
                            </div>
                            <div class="ant-pro-table-list-toolbar-setting-item">
                                <Popover overlayClassName="ant-pro-table-column-setting-overlay" v-model:visible={this.topState.visible} v-slots={{
                                    title: () => <div class="ant-pro-table-column-setting-title"><Checkbox v-model:checked={this.topState.checkAll} onChange={this.onCheckAllChange}> ????????? </Checkbox><a onClick={this.reset}>??????</a></div>,
                                    content: () => <span class="ant-pro-table-column-setting-list"><Checkbox.Group v-model:value={this.topState.checkList}><Container onDrop={this.onDrop}> {
                                        this.topState.currentColumns.length > 0 && this.topState.currentColumns.map((item, i) =>
                                            <Draggable key={i}><div class="ant-pro-table-column-setting-list-item"><DragOutlined /><Checkbox value={item.dataIndex}>{item.title}</Checkbox></div></Draggable>
                                        )
                                    }</Container> </Checkbox.Group></span>,
                                }} placement="bottomLeft" arrow-point-at-center trigger="click">
                                    <SettingOutlined />
                                </Popover>
                            </div>
                            <div class="ant-pro-table-list-toolbar-setting-item">
                                {this.topState.fullscreen ? <FullscreenExitOutlined onClick={() => this.handleFullScreen()} /> :
                                    <FullscreenOutlined onClick={() => this.handleFullScreen()} />}
                            </div>
                        </div>
                    </div>
                </div >
                <div class="table-wrapper" >
                    {showAlert ? this.renderAlert() : null}
                    {table}
                </div>
            </div >
        )
    }
})
