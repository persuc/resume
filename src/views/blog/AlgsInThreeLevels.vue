<script setup lang="ts">
import Button from '@/components/Button.vue'
import Codeblock from '@/components/Codeblock.vue'
import Header from '@/components/Header.vue'
import Note from '@/components/Note.vue'
import { ref } from 'vue'

const step = ref(1)
</script>

<template>

  <Header back-route="/blog" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <span class="text-3xl">Algorithms in Three Levels of Difficulty</span>
    <h3 class="mb-4 text-slate-500">Binary Trees</h3>

    <p>Let's discuss binary-tree algorithms in 3 levels of difficulty, and see how solving simpler problems can lead us to solutions for more complex problems.</p>

    <Note class="mt-3 mb-8">Note: These examples were taken from <a target="_blank" href="https://github.com/andrew-p-dev/FIT1045">a talk I gave</a> to first year students on basic python programming, algorithms and data structures.</Note>

    <p class="text-xl">Problem #1: Invert Binary Tree</p>

    <p>First, easy. Let's use <a target="_blank" href="https://leetcode.com/problems/invert-binary-tree/">LeetCode 226. Invert Binary Tree</a>. Given a binary tree, we must transform the tree so that it is vertically mirrored, or flip everything on the left with everything on the right.
    </p>

    <p>There are a number of strategies to solve this question, however the method I chose is "depth first" or "bottom up" - solving the problem for the smallest subtree at the leaf nodes, and then solving the larger subtrees using those partial solutions. For example, consider what would happen if we just swapped the children of the root node: everything that was on the left of the tree would now be on the right, and visa versa.</p>

    <div class="flex justify-between items-center">
      <svg height="280px" width="420px" class="border">
        <g transform="translate(230, 40) scale(0.7)"><path style="opacity:1;" class="linkBase" d="M0,0L-210,140" ></path><path style="opacity:1;" class="linkBase" d="M0,0L210,140" ></path><path style="opacity:1;" class="linkBase" d="M-210,140L-280,280" ></path><path style="opacity:1;" class="linkBase" ></path><path style="opacity:1;" class="linkBase" d="M210,140L140,280" ></path><path style="opacity:1;" class="linkBase" ></path><g  style="opacity:1;" class="nodeBase" transform="translate(0,0)" ><circle r="30" fill="#FFFFFF" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" >0</text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="nodeBase" transform="translate(-210,140)" ><circle r="30" fill="#FFFFFF" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" >1</text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="leafNodeBase" transform="translate(-280,280)" ><circle r="30" fill="#FFFFFF" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" >3</text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="leafNodeBase" transform="translate(-140,280)" ><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" ></text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="nodeBase" transform="translate(210,140)" ><circle r="30" fill="#FFFFFF" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" >2</text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="leafNodeBase" transform="translate(140,280)" ><circle r="30" fill="#FFFFFF" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" >4</text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g><g  style="opacity:1;" class="leafNodeBase" transform="translate(280,280)" ><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden" ></circle><g ><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em" ></text><text class="nodeAttributesBase" y="10" text-anchor="middle" ></text></g></g></g>
      </svg>

      <span>→</span>

      <svg height="280px" width="420px" class="border">
        <g transform="translate(230, 40) scale(0.7)"><path style="opacity: 1;" class="linkBase" d="M0,0L-210,140" ></path><path style="opacity: 1;" class="linkBase" d="M0,0L210,140" ></path><path style="opacity: 1;" class="linkBase" d="M-210,140L-280,280" ></path><path style="opacity: 1;" class="linkBase" ></path><path style="opacity: 1;" class="linkBase" d="M210,140L140,280" ></path><path style="opacity: 1;" class="linkBase" ></path><g  style="opacity: 1;" class="nodeBase" transform="translate(0,0)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">0</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="nodeBase" transform="translate(-210,140)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">2</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(-280,280)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">4</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(-140,280)"><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em"></text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="nodeBase" transform="translate(210,140)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">1</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(140,280)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">3</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(280,280)"><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em"></text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g></g>
      </svg>
    </div>

    <br />
    
    <p>Now every level 2 has been swapped, however nodes <span class="digit">③</span> and <span class="digit">④</span> are not in the right place. (We didn't do anything to "mirror" them) So what if we had already performed the mirror on all levels > 2? Then the larger problem of mirroring level 2 would be trivial, and we would have our solution:</p>

    <br />

    <div class="flex justify-center">
      <svg height="280px" width="420px" class="border">
        <g transform="translate(185, 40) scale(0.7)"><path style="opacity: 1;" class="linkBase" d="M0,0L-210,140"  ></path><path style="opacity: 1;" class="linkBase" d="M0,0L210,140"  ></path><path style="opacity: 1;" class="linkBase"  ></path><path style="opacity: 1;" class="linkBase" d="M-210,140L-140,280"  ></path><path style="opacity: 1;" class="linkBase"  ></path><path style="opacity: 1;" class="linkBase" d="M210,140L280,280"  ></path><g  style="opacity: 1;" class="nodeBase" transform="translate(0,0)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">0</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="nodeBase" transform="translate(-210,140)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">2</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(-280,280)"><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em"></text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(-140,280)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">4</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="nodeBase" transform="translate(210,140)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">1</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(140,280)"><circle r="20" stroke-width="1" fill="#FFFFFF" visibility="hidden"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em"></text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g><g  style="opacity: 1;" class="leafNodeBase" transform="translate(280,280)"><circle r="30" fill="#FFFFFF"></circle><g><text class="nodeNameBase" text-anchor="middle" x="0" y="0" dy=".35em">3</text><text class="nodeAttributesBase" y="10" text-anchor="middle"></text></g></g></g>
      </svg>
    </div>

    <br />

    <p class="text-xl">Solution #1</p>

    <p>Time to look at the code. First, here is the TreeNode class we will be using as our binary tree data structure for all 3 problems, it's very simple:</p>

    <Codeblock label="TreeNode.py" language="python" :code="`class TreeNode:
  def __init__(self, val=0, left=None, right=None):
      self.val = val
      self.left = left
      self.right = right`" />

    <br />

    <p>And here is the solution we described, recursing through the tree by calling <code>invertTree()</code> on each node's children until we reach a leaf node, then swapping the left and right children, which python has some handy syntax for called "tuple assignment".</p>

    <Codeblock label="invertTree.py" language="python" :code="`def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
  if root is None:
      return None
  self.invertTree(root.left)
  self.invertTree(root.right)
  root.left, root.right = root.right, root.left
  return root`" />

  <br />

  <p class="text-xl">Problem #2: Reverse Odd Levels of Binary Tree</p>

  <p>
    Next let's tackle a medium-difficulty question: <a target="_blank" href="https://leetcode.com/problems/reverse-odd-levels-of-binary-tree/">LeetCode 2415. Reverse Odd Levels of Binary Tree</a>. This question asks us to do the same as <i>Invert Binary Tree</i>, but this time only invert every second level. The problem also specifies that every level of the tree will always be "full". i.e. we are given a perfect binary tree. Try to think for yourself about how we might keep using the same strategy as we did for <i>Invert Binary Tree</i>, but modify it to only flip every second level of the tree.
  </p>

  <div class="flex justify-center mt-4">
    <Button text v-show="step === 1" @click="step++" class="border border-blue-400 rounded">
      <span>I'm done thinking</span>
    </Button>
  </div>

  <div v-show="step > 1">

    <p>Before we solve this problem, let's recall <i>Invert Binary Tree</i>. I said the solution outlined above is "bottom up". However now that we are required to do some operation level by level, wouldn't it be more convenient if we could start from the root, solving all of the topmost levels before moving on to the smaller subtrees? What if we rewrote our <i>Invert Binary Tree</i> solution like this:</p>

    <Codeblock label="invertTreeTopDown.py" language="python" :code="`def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
  if root is None:
      return None
  self.helper(root.left, root.right)
  return root
      
def helper(self, left: Optional[TreeNode], right: Optional[TreeNode]) -> None:
    if left is None:
        return
    left.val, right.val = right.val, left.val
    if left.left:
        self.helper(left.left, right.right)
        self.helper(left.right, right.left)`" />

  <br />

  <p class="text-xl">Solution #2</p>

  <p>Now all we need to modify about our solution for <i>Invert Binary Tree</i> is to provide ourselves with more information to define our recursive case - we need a boolean to tell us whether we should flip this level or not.</p>

    <Codeblock label="reverseOddLevels.py" language="python" :code="`def reverseOddLevels(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
    if root is None:
        return None
    self.helper(root.left, root.right, True)
    return root
      
def helper(self, left: Optional[TreeNode], right: Optional[TreeNode], isOdd: bool) -> None:
    if left is None:
        return
    if isOdd:
        left.val, right.val = right.val, left.val
    if left.left:
        self.helper(left.left, right.right, not isOdd)
        self.helper(left.right, right.left, not isOdd)`" />
  
    <br />

    <p>
      And that's it! Ready for a harder problem?
    </p>
 
    <p class="text-xl">Problem #3: Binary Tree Cameras</p>

    <p>
      Finally let's look at a hard question: <a target="_blank" href="https://leetcode.com/problems/binary-tree-cameras/">LeetCode 968. Binary Tree Cameras</a>. This question is known academically as the <a target="_blank" href="https://en.wikipedia.org/wiki/Vertex_cover">minimum vertex cover problem</a>, which ask us "what is the smallest set of nodes that we could choose, so that every node in the tree is in our set, or is a direct neighbour to a node in our set?"
    </p>

    <p>
      The solution to this problem is just a small extension to the "bottom up" version of <i>Invert Binary Tree</i> we already came up with, yet it can be hard to grasp. For this problem, it is helpful for the recursive function to provide some more information to help us solve the larger problems. That is, if we are looking at a node, and deciding whether we should mark it, what information do we need about the left and right child to decide whether we should mark the node or not?
    </p>

    <div class="flex justify-center mt-4">
      <Button text v-show="step === 2" @click="step++" class="border border-blue-400 rounded">
        <span>I'm done thinking</span>
      </Button>
    </div>

    <div v-show="step > 2">

      <p class="text-xl">Solution #3</p>

      <p>
      The only modification we need to make to the "bottom up" version of <i>Invert Binary Tree</i> is to include whether a vertex is: 
      <ol>
        <li>Not covered by any marked nodes</li>
        <li>Covered by, or neighbouring a marked node</li>
        <li>Is a marked node itself</li>
      </ol>

      To understand why this information is helpful, it helps to think about a simple case. <b>Question:</b> Is there ever a situation in which it is necessary to mark a leaf node? Have a think about this, and then reveal the solution.
      </p>

      <div class="flex justify-center mt-4">
        <Button text v-show="step === 3" @click="step++" class="border border-blue-400 rounded">
          <span>Reveal solution #3</span>
        </Button>
      </div>

      <div v-show="step > 3">
        <Codeblock label="minVertexCover.py" language="python" :code="`NOT_COVERED = 0
COVERED = 1
MARKED = 2
result = 0

def minVertexCover(self, root: Optional[TreeNode]) -> int:
    rootCoverage = self.helper(root)
    if rootCoverage == NOT_COVERED:
        result += 1
    return result

def helper(self, node: Optional[TreeNode]) -> int:
    if node is None:
        return COVERED

    left = self.helper(node.left)
    right = self.helper(node.right)

    if left == COVERED and right == COVERED:
        return NOT_COVERED
    elif left == NOT_COVERED or right == NOT_COVERED:
        result += 1
        return MARKED
    return COVERED`" />

        <br />

        <p>
          Thanks for reading! If you want to practice more of these kinds of problems, check out <a target="_blank" href="neetcode.io/">neetcode.io/</a> for a curated list of algorithms & data structures questions. I also recommend <a target="_blank" href="https://cp-algorithms.com/">Algorithms for Competitive Programming</a> website, where you can learn all sort of useful techniques for solving computing problems efficiently.
        </p>

      </div>
    </div>
  </div>

  <div class="my-16 py-16"></div>

  <p>Note: I used <a target="_blank" href="https://tree-visualizer.netlify.app/">this tree visualizer</a> to make the images for this post. They only required a little cleanup using this regex
      
  <code>(\s[a-z\-]*id="[0-9a-z\-]+")|(\sdata-v-c[0-9]*="")|(\sclass="_[a-z0-9\-]+")</code> to remove the extra data from the generated SVGs.
  </p>

  </article>
</template>

<style scoped>
.digit {
  font-size: 1.5rem;
  line-height: 1rem;
  top: 0.125rem;
}

.linkBase {
  fill: none;
  stroke: #000;
}

.nodeBase {
  cursor: pointer;
  fill: #777;
  stroke: #000;
  stroke-width: 2;
}

.leafNodeBase {
  cursor: pointer;
  fill: transparent;
  stroke: #000;
  stroke-width: 2;
}

.nodeNameBase {
  fill: #000;
  stroke: #000;
  stroke-width: 1;
}

.nodeAttributesBase {
  fill: #777;
  stroke: #777;
  stroke-width: 1;
  font-size: smaller;
}

</style>
