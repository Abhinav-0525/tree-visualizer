import React, { useState } from 'react';
import Tree from 'react-d3-tree';

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

const DynamicTree = () => {
  const [data, setData] = useState(null);
  const [nodeInputs, setNodeInputs] = useState({});
  const [rootInput, setRootInput] = useState('');
  const [traversalResult, setTraversalResult] = useState('');
  const [selectedTraversal, setSelectedTraversal] = useState('Inorder');
  const [selectedView, setSelectedView] = useState("Top");
  const [viewResult, setViewResult] = useState("");

  const handleAddNode = (parentName) => {
    const nodeName = nodeInputs[parentName];
    if (!nodeName || !nodeName.trim()) {
      alert('Please enter a valid node name!');
      return;
    }

    const newNode = { name: nodeName.trim(), children: [] };
    const updatedData = addNodeToParent(data, parentName, newNode);
    setData(updatedData);
    setNodeInputs((prev) => ({ ...prev, [parentName]: '' }));
  };

  const addNodeToParent = (node, parentName, newNode) => {
    if (node.name === parentName) {
      if (node.children.length >= 2) {
        alert('Cannot add more than 2 children to a node.');
        return node;
      }
      return { ...node, children: [...(node.children || []), newNode] };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          addNodeToParent(child, parentName, newNode)
        ),
      };
    }

    return node;
  };

  const handleInputChange = (parentName, value) => {
    setNodeInputs((prev) => ({ ...prev, [parentName]: value }));
  };

  const convertToBinaryTree = (node) => {
    if (!node) return null;

    const treeNode = new TreeNode(node.name);
    if (node.children && node.children.length > 0) {
      treeNode.left = convertToBinaryTree(node.children[0]);
      treeNode.right = convertToBinaryTree(node.children[1]);
    }

    return treeNode;
  };

  const inorderTraversal = (root) => {
    const result = [];
    const stack = [];
    let node = root;

    while (node || stack.length) {
      while (node) {
        stack.push(node);
        node = node.left;
      }

      node = stack.pop();
      result.push(node.val);
      node = node.right;
    }

    return result;
  };

  const preorderTraversal = (root) => {
    const result = [];
    const stack = [];

    if (root) stack.push(root);
    while (stack.length) {
      const node = stack.pop();
      result.push(node.val);

      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }

    return result;
  };

  const postorderTraversal = (root) => {
    const result = [];
    const leftStack = [];
    const rightStack = [];

    if (root) leftStack.push(root);
    while (leftStack.length) {
      const node = leftStack.pop();

      if (node.left) leftStack.push(node.left);
      if (node.right) leftStack.push(node.right);

      rightStack.push(node);
    }

    while (rightStack.length) {
      result.push(rightStack.pop().val);
    }

    return result;
  };

  // Boundary Traversal
  const isLeaf = (node) => {
    return node.left === null && node.right === null;
  };

  const addLeftBoundary = (root, res) => {
    let curr = root.left;
    while (curr != null) {
      if (!isLeaf(curr)) res.push(curr.val);
      curr = curr.left ? curr.left : curr.right;
    }
  };

  const addRightBoundary = (root, res) => {
    let curr = root.right;
    const temp = [];
    while (curr != null) {
      if (!isLeaf(curr)) temp.push(curr.val);
      curr = curr.right ? curr.right : curr.left;
    }
    res.push(...temp.reverse());
  };

  const addLeaves = (root, res) => {
    if (isLeaf(root)) {
      res.push(root.val);
      return;
    }
    if (root.left != null) addLeaves(root.left, res);
    if (root.right != null) addLeaves(root.right, res);
  };

  const boundaryTraversal = (root) => {
    const res = [];
    if (root == null) return res;

    if (!isLeaf(root)) res.push(root.val);
    addLeftBoundary(root, res);
    addLeaves(root, res);
    addRightBoundary(root, res);

    return res;
  };

  // Zigzag Traversal
  const zigzagTraversal = (root) => {
    const result = [];
    if (!root) return result;

    const queue = [root];
    let flag = false;

    while (queue.length) {
      const levelSize = queue.length;
      const level = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        level.push(node.val);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }

      if (flag) level.reverse();
      flag = !flag;
      result.push(level);
    }

    return result;
  };

  // Vertical Order Traversal
  const verticalOrderTraversal = (root) => {
    const result = [];
    const map = new Map();

    const queue = [{ node: root, hd: 0 }];
    while (queue.length) {
      const { node, hd } = queue.shift();

      if (!map.has(hd)) map.set(hd, []);
      map.get(hd).push(node.val);

      if (node.left) queue.push({ node: node.left, hd: hd - 1 });
      if (node.right) queue.push({ node: node.right, hd: hd + 1 });
    }

    const keys = Array.from(map.keys()).sort((a, b) => a - b);
    for (let key of keys) {
      result.push(map.get(key));
    }

    return result;
  };

  const handleTraversal = () => {
    const binaryTreeRoot = convertToBinaryTree(data);
    let result = [];

    switch (selectedTraversal) {
      case 'Inorder':
        result = inorderTraversal(binaryTreeRoot);
        break;
      case 'Preorder':
        result = preorderTraversal(binaryTreeRoot);
        break;
      case 'Postorder':
        result = postorderTraversal(binaryTreeRoot);
        break;
      case 'Boundary':
        result = boundaryTraversal(binaryTreeRoot);
        break;
      case 'Zigzag':
        result = zigzagTraversal(binaryTreeRoot);
        break;
      case 'Vertical':
        result = verticalOrderTraversal(binaryTreeRoot);
        break;
      default:
        break;
    }

    setTraversalResult(JSON.stringify(result));
  };


  const handleView = () => {
    const binaryTreeRoot = convertToBinaryTree(data);
    let result = [];
    if (selectedView === "Top") {
      result = topView(binaryTreeRoot);
    } else if (selectedView === "Bottom") {
      result = bottomView(binaryTreeRoot);
    } else if (selectedView === "Left") {
      result = leftsideView(binaryTreeRoot);
    } else if (selectedView === "Right") {
      result = rightsideView(binaryTreeRoot);
    }
    setViewResult(JSON.stringify(result.join(", ")));
  };

  // Views - Top, Bottom, Left, Right
  const topView = (node) => {
    let result = [];
    if (!node) return result;
  
    let mpp = new Map();
    let queue = [[node, 0]];
  
    while (queue.length) {
      let [currNode, line] = queue.shift();  
      if (!mpp.has(line)) {
        mpp.set(line, currNode.val);
      }
  
      if (currNode.left) queue.push([currNode.left, line - 1]);
      if (currNode.right) queue.push([currNode.right, line + 1]);
    }  
    let sortedKeys = [...mpp.keys()].sort((a, b) => a - b);
    sortedKeys.forEach((key) => result.push(mpp.get(key)));
    return result;
  };
  

  const bottomView = (node) => {
    let result = [];
    if (!node) return result;

    let mpp = new Map();
    let queue = [[node, 0]];
  
    while (queue.length) {
      let [currNode, line] = queue.shift();
        mpp.set(line, currNode.val);
  
      if (currNode.left) queue.push([currNode.left, line - 1]);
      if (currNode.right) queue.push([currNode.right, line + 1]);
    }  
    let sortedKeys = [...mpp.keys()].sort((a, b) => a - b);
    sortedKeys.forEach((key) => result.push(mpp.get(key)));
    return result;
  };
  

  const leftsideView = (node) => {
    let result = [];
    const recursionLeft = (root, level) => {
      if (!root) return;
      if (result.length === level) result.push(root.val);
      recursionLeft(root.left, level + 1);
      recursionLeft(root.right, level + 1);
    };
    recursionLeft(node, 0);
    return result;
  };

  const rightsideView = (node) => {
    let result = [];
    const recursionRight = (root, level) => {
      if (!root) return;
      if (result.length === level) result.push(root.val);
      recursionRight(root.right, level + 1);
      recursionRight(root.left, level + 1);
    };
    recursionRight(node, 0);
    return result;
  };

  const handleSetRoot = () => {
    if (!rootInput.trim()) {
      alert('Please enter a valid root node!');
      return;
    }
    setData({ name: rootInput.trim(), children: [] });
    setRootInput('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
      }}
    >
      {!data ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: '#4CAF50' }}>Set Root Node</h2>
          <input
            type="text"
            placeholder="Enter Root Node"
            value={rootInput}
            onChange={(e) => setRootInput(e.target.value)}
            style={{
              width: '200px',
              height: '30px',
              fontSize: '16px',
              padding: '5px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={handleSetRoot}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Set Root
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              width: '90%',
              height: '60%',
              border: '2px solid #4CAF50',
              borderRadius: '10px',
              backgroundColor: '#fff',
              padding: '10px',
              marginBottom: '20px',
            }}
          >
            <Tree
              data={data}
              orientation="vertical"
              translate={{ x: 300, y: 50 }}
              renderCustomNodeElement={({ nodeDatum }) => (
                <g>
                  <circle r={12} fill="#4CAF50" />
                  <text x={15} dy={4} fontSize={12}>
                    {nodeDatum.name}
                  </text>
                  <foreignObject width="100" height="40" x={-50} y={20}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Node"
                        value={nodeInputs[nodeDatum.name] || ''}
                        onChange={(e) =>
                          handleInputChange(nodeDatum.name, e.target.value)
                        }
                        style={{
                          width: '60px',
                          height: '18px',
                          fontSize: '10px',
                          padding: '2px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <button
                        onClick={() => handleAddNode(nodeDatum.name)}
                        style={{
                          padding: '5px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </foreignObject>
                </g>
              )}
            />
          </div>
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
            }}
          >
            <select
              value={selectedTraversal}
              onChange={(e) => setSelectedTraversal(e.target.value)}
              style={{
                width: '160px',
                height: '44px',
                fontSize: '16px',
                padding: '5px',
                borderRadius: '4px',
              }}
            >
              <option value="Inorder">Inorder</option>
              <option value="Preorder">Preorder</option>
              <option value="Postorder">Postorder</option>
              <option value="Boundary">Boundary</option>
              <option value="Zigzag">Zigzag</option>
              <option value="Vertical">Vertical</option>
            </select>


            <button
              onClick={handleTraversal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Perform Traversal
            </button>

            <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          style={{
            width: '160px',
            height: '44px',
            fontSize: '16px',
            padding: '5px',
            borderRadius: '4px',
          }}
        >
          <option value="Top">Top</option>
          <option value="Bottom">Bottom</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>

            <button
          onClick={handleView}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Get View
        </button>
          </div>
          <div
            style={{
                border: 'black 2px',
                padding: '10px 20px',
                display: 'flex',
                gap: '20px'
              }}
          >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '10px',
              backgroundColor: '#fff',
              border: '1px solid #4CAF50',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            {selectedTraversal} Traversal Result: <br />
            <pre>{traversalResult}</pre>
          </div>

            <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '10px',
          backgroundColor: '#fff',
          border: '1px solid #4CAF50',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        {selectedView} View Result: <br />
        <pre>{viewResult}</pre>
            </div>
            </div>
        </>
      )}
    </div>
  );
};

export default DynamicTree;