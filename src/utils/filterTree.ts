import type { TreeNode } from '@/types/ApiType'

// Рекурсивная функция для фильтрации ноды и её детей
function filterNode(node: TreeNode, query: string): TreeNode | null {
  const nodeMatches = node.name.toLowerCase().includes(query)

  // Если нода сама совпала - возвращаем её целиком, вместе со всеми детьми
  if (nodeMatches) {
    return {
      ...node,
      children: node.children.map((child) => ({ ...child })),
    }
  }

  //  Иначе рекурсивно фильтруем детей
  const filteredChildren: TreeNode[] = []
  for (const child of node.children) {
    const fc = filterNode(child, query)
    if (fc) filteredChildren.push(fc)
  }

  // Если после фильтрации есть хоть один ребенок - возвращаем ноду с ними
  if (filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren,
    }
  }
  return null
}

export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) {
    return nodes
  }
  return nodes.map((node) => filterNode(node, query)).filter((n): n is TreeNode => n !== null)
}
