# Vue 3 Table of Contents Sidebar

Это реализация компонента оглавления (сайдбара) на Vue 3 (Composition API) с использованием TypeScript в рамках тестового задания. Компонент асинхронно загружает данные, строит и отображает иерархическое меню, поддерживает фильтрацию, выбор элемента по URL, сворачивание/разворачивание узлов и всего сайдбара, а также предоставляет гибкие возможности для кастомизации.

## Основные возможности

- **Асинхронная загрузка данных:** Данные для оглавления загружаются асинхронно по URL (`https://prolegomenon.s3.amazonaws.com/contents.json`).
- **Механизм Retry:** Реализовано 2 повторных попытки загрузки данных с задержкой в 1 секунду в случае сетевой ошибки или неудачного ответа сервера.
- **Иерархическое отображение:** Плоский список данных преобразуется в древовидную структуру.
- **Раскрытие/Скрытие нод:** Ноды с дочерними элементами можно интерактивно сворачивать и разворачивать кликом по стрелке. Анимация раскрытия/скрытия плавная.
- **Выбор активного элемента по URL:** При переходе по URL вида `/page-link.html` соответствующий пункт меню автоматически выбирается и его родительские ноды раскрываются.
- **Фильтрация:** Поле ввода позволяет фильтровать отображаемые ноды по названию. Фильтрация происходит с задержкой (debounce) после окончания ввода.
- **Сворачивание сайдбара:** Весь сайдбар можно свернуть до узкой полоски или развернуть с помощью кнопки в футере.
- **Кастомизация (Слоты):** Внешний вид и разметка заголовка, поля поиска, каждой ноды дерева, футера и сообщения об отсутствии данных могут быть полностью переопределены с помощью scoped slots.
- **Кастомизация (CSS Переменные):** Основные стили (цвета, отступы) заданы через CSS-переменные, что позволяет легко адаптировать внешний вид под нужную тему.
- **Чистый CSS:** Стандартные стили Vite/Vue были удалены. Используется минимальный CSS Reset и файл с CSS-переменными для темы.

## Ветки

- За "raw" реализацией можно прсоледить в ветке "taskBranch"
- За коммитами рефакторинга в ветке "refactor"

## Установка и запуск

1. **Установить зависимости:**

   ```bash
   npm install

   ```

2. **Запустить dev-сервер:**

   ```bash
   npm run dev

   Приложение будет доступно по адресу `http://localhost:5173` (или другому порту, указанному Vite).
   ```

## Структура проекта

- `src/components/Sidebar/`: Основные компоненты сайдбара (`SidebarView.vue`, `SidebarNode.vue`, `SidebarTree.vue`, `SidebarSearch.vue`).
- `src/composables/`: Переиспользуемая логика (хуки) (`useContents.ts`, `useSidebar.ts`, `useDebounce.ts`).
- `src/utils/`: Вспомогательные утилиты (`buildTree.ts`, `filterTree.ts`).
- `src/types/`: Определения TypeScript типов (`ApiType.ts`).
- `src/styles/`: Глобальные стили (`reset.css`, `theme.css`).
- `src/router/`: Настройка Vue Router.
- `src/views/`: Компоненты страниц (используется `ContentView.vue` для отображения заглушки).
- `src/App.vue`: Корневой компонент приложения, использующий `SidebarView`.
- `src/main.ts`: Точка входа в приложение.

## Использование компонента `<SidebarView>`

Основной компонент для использования — `<SidebarView>`.

**Пример базового использования (`App.vue`):**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SidebarView from './components/Sidebar/SidebarView.vue'
import { useContents } from './composables/useContents'

// Получаем данные и состояния из composable
const { tree, activeNodeKeys, loading, error, fetchContents } = useContents()
// Локальное состояние для v-model
const selectedSidebarKey = ref<string | null>(null)

onMounted(() => {
  if (!state.value) {
    fetchContents()
  }
})
</script>

<template>
  <div class="app-layout">
    <!-- Обработка загрузки и ошибки -->
    <div v-if="loading" class="sidebar-placeholder">Загрузка...</div>
    <div v-else-if="error" class="sidebar-placeholder">Ошибка: {{ error.message }}</div>

    <!-- Рендеринг сайдбара -->
    <SidebarView
      v-else
      :data="tree"
      :active-node-keys="activeNodeKeys"
      v-model:selectedKey="selectedSidebarKey"
      @select="(node) => console.log('Selected:', node)"
      @toggle="(key, isOpen) => console.log('Toggled:', key, isOpen)"
    >
      <!-- Пример использования слота для заголовка -->
      <template v-slot:header>
        <h1>Оглавление</h1>
      </template>
      <!-- Другие слоты можно использовать здесь -->
    </SidebarView>

    <main class="content-area">
      <!-- Место для контента страницы -->
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Стили для .app-layout, .content-area, .sidebar-placeholder */
</style>
```

### Пропсы (Props)

- `data` (`TreeNode[] | null | undefined`): Массив корневых нод дерева для отображения.
- `activeNodeKeys` (`Set<string>`): Набор ключей (`key`) тех нод, которые должны быть раскрыты при инициализации (обычно вычисляется на основе текущего URL). **Обязательный проп.**
- `selectedKey` (`string | null`): Ключ (`key`) выбранного в данный момент ноды. Используется с `v-model:selectedKey`.

### События (Emits)

- `update:selectedKey (key: string | null)`: Срабатывает при выборе ноды, используется для `v-model:selectedKey`.
- `select (node: TreeNode | null)`: Срабатывает при выборе ноды, передает объект выбранной ноды.
- `toggle (key: string, isOpen: boolean)`: Срабатывает при раскрытии/сворачивании, передает ключ и его новое состояние раскрытия.

### Слоты (Scoped Slots)

Компонент предоставляет несколько слотов для гибкой кастомизации:

- **`v-slot:header`**: Позволяет заменить стандартный заголовок сайдбара.
- **`v-slot:search`**: Позволяет заменить стандартное поле поиска `SidebarSearch`.
- **`v-slot:empty`**: Позволяет заменить стандартное сообщение, отображаемое при отсутствии данных или когда фильтр не нашел совпадений.
- **`v-slot:node (props: {...})`**: (Scoped Slot) Самый мощный слот. Позволяет **полностью переопределить рендеринг каждого узла** дерева. В `props` передаются:
  - `node` (`TreeNode`): Данные текущего ноды.
  - `isExpanded` (`boolean`): Раскрыто ли.
  - `isActive` (`boolean`): Выбрано ли.
  - `hasChildren` (`boolean`): Есть ли дочерние ноды.
  - `level` (`number`): Уровень вложенности.
  - `handleToggleExpand` (`() => void`): Функция для переключения раскрытия.
  - `handleSelect` (`() => void`): Функция для выбора.
  - `indentStyle` (`{ paddingLeft: string }`): Готовый стиль с отступом для текущего уровня.
- **`v-slot:footer (props: { isCollapsed: boolean, toggleCollapse: () => void })`**: (Scoped Slot) Позволяет **полностью переопределить футер и кнопку сворачивания/разворачивания** сайдбара.
  В `props` передаются:
  - `isCollapsed` (`boolean`): Текущее состояние сайдбара (свернут/развернут).
  - `toggleCollapse` (`() => void`): Функция для переключения состояния.

**Пример кастомизации ноды (слот `v-slot:node`):**

```vue
<SidebarView ...>
  <template v-slot:node="slotProps">
    <div
      class="my-custom-node"
      :class="{ active: slotProps.isActive }"
      :style="slotProps.indentStyle"
    >
      <!-- Ваша кастомная стрелка/иконка -->
      <span @click.stop="slotProps.handleToggleExpand">
        {{ slotProps.isExpanded ? '🔽' : '▶️' }}
      </span>
      <!-- Ваша кастомная ссылка/текст -->
      <span @click="slotProps.handleSelect">
        {{ slotProps.node.name }} (Уровень {{ slotProps.level }})
      </span>
    </div>
  </template>
</SidebarView>
```

**Пример кастомизации футера (слот `v-slot:footer`):**

```vue
<SidebarView ...>
  <template v-slot:footer="footerProps">
    <button @click="footerProps.toggleCollapse">
      {{ footerProps.isCollapsed ? 'Развернуть' : 'Свернуть' }}
    </button>
  </template>
</SidebarView>
```

## Кастомизация стилей (CSS Переменные)

Внешний вид сайдбара можно легко настроить, переопределив CSS-переменные, заданные в `src/styles/theme.css`.

**Пример переопределения (в вашем глобальном CSS или компоненте-обертке):**

```css
:root {
  /* Или другой селектор */
  --sidebar-bg-color: #333;
  --sidebar-text-color: #eee;
  --sidebar-border-color: #555;
  --node-selected-text-color: #66ff66;
  --node-indent-size: 24px;
}
```

## Технические решения

- **Стек:** Vue 3 (Composition API), TypeScript, Vite.
- **Архитектура:** Компонентный подход с разделением на UI-компоненты (`SidebarView`, `SidebarNode` и т.д.) и переиспользуемую логику (Composables: `useContents`, `useSidebar`, `useDebounce`).
- **Работа с данными:** Асинхронная загрузка через `fetch`, преобразование плоского списка в дерево (`buildTree`), фильтрация дерева (`filterTree`).
- **Состояние:** Управление состоянием раскрытых/выбранных узлов и фильтра через `provide/inject` (реализовано в `useSidebar`).
- **Маршрутизация:** Используется Vue Router для навигации и определения активного узла по URL.
- **Стилизация:** Scoped CSS с использованием CSS-переменных для кастомизации. Удалены стандартные стили Vite/Vue, используется минимальный CSS Reset.

## Тестирование

Реализован один юнит-тест ^^
На более полное покрытие не хватило времени.
