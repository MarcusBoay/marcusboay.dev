import {
    takeLatest,
    all,
    select,
    put,
    putResolve,
    delay,
    call,
} from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import {
    updateTreeAction,
    putTreeAction,
    createRootNodeAction,
    putRootNodeAction,
    preOrderTraversalAction,
    inOrderTraversalAction,
    resetNodesAction,
    postOrderTraversalAction,
    levelOrderTraversalAction,
} from '../actions/treeVisualizerActions'
import { NodeModel, NodeState } from '../../models/TreeViz'
import { getRootNodeFromState } from '../reducers/treeVisualizerReducer'

function* createRootNodeSaga(action: ActionType<typeof createRootNodeAction>) {
    try {
        const rootNode = action.payload
        yield putResolve(putRootNodeAction(rootNode))
        yield put(updateTreeAction())
    } catch (e) {
        console.warn('create root node saga: something went wrong!', e)
    }
}

function* updateTreeSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        let queue: NodeModel[] = []
        queue.push(rootNode)

        let nodesLevels: Array<NodeModel[]> = []
        while (queue.length > 0) {
            let levelSize = queue.length

            let curLevel: NodeModel[] = []
            while (levelSize > 0) {
                let curNode: NodeModel = queue.shift() as NodeModel

                curLevel.push(curNode)

                if (curNode!.leftChild) queue.push(curNode!.leftChild)
                if (curNode!.rightChild) queue.push(curNode!.rightChild)

                levelSize--
            }
            nodesLevels.push(curLevel)
        }

        yield put(putTreeAction([...nodesLevels]))
    } catch (e) {
        console.error('update tree saga: something went wrong!', e)
    }
}

function* preOrderTraversalSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        yield call(preOrderTraversalSagaHelper, rootNode)
    } catch (e) {
        console.error('preorder traversal saga: something went wrong!', e)
    }
}
function* preOrderTraversalSagaHelper(curNode: NodeModel): any {
    if (!curNode) return

    curNode.state = NodeState.WAITING
    //nothing to wait for...

    curNode.state = NodeState.VISITING
    yield putResolve(updateTreeAction())
    yield delay(250)

    yield call(preOrderTraversalSagaHelper, curNode.leftChild!)
    yield call(preOrderTraversalSagaHelper, curNode.rightChild!)

    curNode.state = NodeState.VISITED
    yield putResolve(updateTreeAction())
    yield delay(250)
}

function* inOrderTraversalSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        yield call(inOrderTraversalSagaHelper, rootNode)
    } catch (e) {
        console.error('inorder traversal saga: something went wrong!', e)
    }
}
function* inOrderTraversalSagaHelper(curNode: NodeModel): any {
    if (!curNode) return

    curNode.state = NodeState.WAITING
    yield call(inOrderTraversalSagaHelper, curNode.leftChild!)

    curNode.state = NodeState.VISITING
    yield putResolve(updateTreeAction())
    yield delay(250)

    yield call(inOrderTraversalSagaHelper, curNode.rightChild!)

    curNode.state = NodeState.VISITED
    yield putResolve(updateTreeAction())
    yield delay(250)
}

function* postOrderTraversalSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        yield call(postOrderTraversalSagaHelper, rootNode)
    } catch (e) {
        console.error('postorder traversal saga: something went wrong!', e)
    }
}
function* postOrderTraversalSagaHelper(curNode: NodeModel): any {
    if (!curNode) return

    curNode.state = NodeState.WAITING
    yield call(postOrderTraversalSagaHelper, curNode.leftChild!)

    yield call(postOrderTraversalSagaHelper, curNode.rightChild!)

    curNode.state = NodeState.VISITING
    yield putResolve(updateTreeAction())
    yield delay(250)

    curNode.state = NodeState.VISITED
    yield putResolve(updateTreeAction())
    yield delay(250)
}

function* levelOrderTraversalSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        let queue: NodeModel[] = []
        queue.push(rootNode)

        while (queue.length > 0) {
            let levelSize = queue.length

            while (levelSize > 0) {
                let curNode: NodeModel = queue.shift() as NodeModel
                curNode.state = NodeState.VISITING
                yield putResolve(updateTreeAction())
                yield delay(250)
                curNode.state = NodeState.VISITED

                if (curNode!.leftChild) queue.push(curNode!.leftChild)
                if (curNode!.rightChild) queue.push(curNode!.rightChild)

                levelSize--
            }
        }
        yield putResolve(updateTreeAction())
    } catch (e) {
        console.error('update tree saga: something went wrong!', e)
    }
}

function* resetNodesSaga() {
    try {
        const rootNode = yield select(getRootNodeFromState)

        yield call(resetNodesSagaHelper, rootNode)
        yield putResolve(updateTreeAction())
    } catch (e) {
        console.error('reset nodes saga: something went wrong!', e)
    }
}
function* resetNodesSagaHelper(curNode: NodeModel): any {
    if (!curNode) return

    curNode.state = NodeState.INIT
    yield call(resetNodesSagaHelper, curNode.leftChild!)
    yield call(resetNodesSagaHelper, curNode.rightChild!)
}

function* treeVisualizerSaga() {
    yield all([
        yield takeLatest(getType(createRootNodeAction), createRootNodeSaga),
        yield takeLatest(getType(updateTreeAction), updateTreeSaga),
        yield takeLatest(
            getType(preOrderTraversalAction),
            preOrderTraversalSaga
        ),
        yield takeLatest(getType(inOrderTraversalAction), inOrderTraversalSaga),
        yield takeLatest(
            getType(postOrderTraversalAction),
            postOrderTraversalSaga
        ),
        yield takeLatest(
            getType(levelOrderTraversalAction),
            levelOrderTraversalSaga
        ),
        yield takeLatest(getType(resetNodesAction), resetNodesSaga),
    ])
}
export default treeVisualizerSaga
