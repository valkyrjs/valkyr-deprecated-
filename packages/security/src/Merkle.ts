import { generateHash } from "./Hash";

/**
 * Get the merkle root value from given list of values.
 *
 * @remarks values provided must be string convertible through the
 * JSON.stringify method.
 *
 * @param leaves - List of values to generate a merkle root from.
 *
 * @returns merkle root value
 */
export function generateMerkleRoot(values: any[]): string {
  return generateMerkleTree(values).root;
}

/**
 * Get merkle tree from given list of values.
 *
 * @remarks values provided must be string convertible through the
 * JSON.stringify method.
 *
 * @param values - List of values to generate merkle tree from.
 *
 * @returns merkle tree
 */
export function generateMerkleTree(values: any[]): MerkleTree {
  return getMerkleTree(values.map((value) => generateHash(JSON.stringify(value))));
}

/**
 * Get merkle tree from given list of merkle leaves.
 *
 * @param leaves - List of merkle leaves, this should be hashed values.
 * @param tree   - Generated merkle tree, no need to provide this value.
 * @param layer  - Current branch layer, no need to provide this value.
 *
 * @returns merkle tree object
 */
export function getMerkleTree(leaves: string[], tree: string[][] = [], branch = 0): MerkleTree {
  const nodes = (tree[branch] = getMerkleBranch(leaves));
  if (nodes.length > 1) {
    return getMerkleTree(nodes, tree, branch + 1);
  }
  return {
    root: tree[tree.length - 1][0],
    tree,
    branches: branch
  };
}

/**
 * Reduces given merkle leaves into the next branching layer.
 *
 * The merkle branch represents combined leaves halving the leaves for
 * each iteration until only 1 leaf is returned.
 *
 * @param leaves - List of merkle leaves, this should be hashed values.
 *
 * @returns merkle nodes
 */
function getMerkleBranch(leaves: string[]): string[] {
  const nodes: string[] = [];
  for (let i = 0, len = leaves.length; i < len; i += 2) {
    nodes.push(generateHash(leaves[i] + leaves[i + 1] ?? leaves[i]));
  }
  return nodes;
}

type MerkleTree = {
  root: string;
  tree: string[][];
  branches: number;
};
