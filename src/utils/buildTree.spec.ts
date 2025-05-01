import { describe, it, expect } from 'vitest'
import { buildTree } from '@/utils/buildTree'
import type { Content, Page, Pages } from '@/types/ApiType'

// Группа тестов для функции buildTree
describe('buildTree', () => {
  // Тест кейс 1: Обработка пустого или невалидного ввода
  it('should return an empty array for null or empty input', () => {
    // Ожидаем пустой массив для null
    expect(buildTree({} as Content)).toEqual([])

    // Ожидаем пустой массив для объекта без pages
    const stateWithoutPages: Content = { rootLevelKeys: [], pages: {} }
    expect(buildTree(stateWithoutPages)).toEqual([])

    // Ожидаем пустой массив для объекта с пустым pages
    const stateWithEmptyPages: Content = { rootLevelKeys: [], pages: {} }
    expect(buildTree(stateWithEmptyPages)).toEqual([])
  })

  // Тест кейс 2: Построение простого одноуровневого дерева
  it('should build a simple one-level tree', () => {
    const page1: Page = { key: 'key1', name: 'Node 1', level: 0, link: 'link1.html' }
    const page2: Page = { key: 'key2', name: 'Node 2', level: 0, link: 'link2.html' }
    const pages: Pages = { key1: page1, key2: page2 }
    const state: Content = { rootLevelKeys: ['key1', 'key2'], pages: pages }


    const tree = buildTree(state)

    expect(tree).toHaveLength(2) // Ожидаем 2 корневых узла
    expect(tree[0]).toEqual({ ...page1, children: [] }) // Нода 1 + пустые дети
    expect(tree[1]).toEqual({ ...page2, children: [] }) // Нода 2 + пустые дети
  })

  // Тест кейс 3: Построение двухуровневого дерева
  it('should build a two-level tree', () => {
    const parent: Page = {
      key: 'p1',
      name: 'Parent 1',
      level: 0,
      link: 'p1.html',
      childPageKeys: ['c1', 'c2'],
    }
    const child1: Page = {
      key: 'c1',
      name: 'Child 1.1',
      level: 1,
      link: 'c1.html',
      parentKey: 'p1',
    }
    const child2: Page = {
      key: 'c2',
      name: 'Child 1.2',
      level: 1,
      link: 'c2.html',
      parentKey: 'p1',
    }
    const otherParent: Page = { key: 'p2', name: 'Parent 2', level: 0, link: 'p2.html' }
    const pages: Pages = { p1: parent, c1: child1, c2: child2, p2: otherParent }
    const state: Content = { rootLevelKeys: ['p1', 'p2'], pages: pages }

    const tree = buildTree(state)

    expect(tree).toHaveLength(2) // Две ноды (p1, p2)
    expect(tree[0].key).toBe('p1')
    expect(tree[0].children).toHaveLength(2) // У p1 должно быть 2 ребенка
    expect(tree[0].children[0]).toEqual({ ...child1, children: [] }) // Проверяем первого ребенка
    expect(tree[0].children[1]).toEqual({ ...child2, children: [] }) // Проверяем второго ребенка
    expect(tree[1].key).toBe('p2')
    expect(tree[1].children).toHaveLength(0) // У p2 нет детей
  })
})
