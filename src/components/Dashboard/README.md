# Dashboard 组件架构重构

## 概述

Dashboard组件已经重构为模块化架构，将tab组件和页面内容分离，实现了可复用的UI组件库和随机排列组合功能。

## 文件结构

```
Dashboard/
├── index.tsx                 # 主Dashboard组件
├── Dashboard.css            # 样式文件
├── README.md                # 本文档
├── components/              # UI组件库
│   ├── PanelComponents.tsx  # 可复用UI组件库（表格、图表、指标等）
│   ├── FloatingPanels.tsx   # 浮动面板容器组件
│   ├── TimeWeather.tsx      # 时间天气组件
│   ├── BarCharts.tsx        # 柱状图组件（历史文件）
│   ├── LineCharts.tsx       # 折线图组件（历史文件）
│   └── PieCharts.tsx        # 饼图组件（历史文件）
└── tabs/                    # Tab页面配置
    ├── TabConfig.tsx        # Tab配置和随机化逻辑
    ├── GrowthTab.tsx        # 生长指标Tab
    ├── EnvironmentTab.tsx   # 环境指标Tab
    ├── MaterialsTab.tsx     # 物料投入Tab
    ├── NutritionTab.tsx     # 营养健康Tab
    ├── FeedingTab.tsx       # 摄食强度Tab
    └── WaterTab.tsx         # 水质检测Tab
```

## 核心功能

### 1. 模块化组件架构

- **可复用UI组件**: `PanelComponents.tsx` 提供了标准化的面板组件
- **独立Tab页面**: 每个tab功能被拆分到独立的tsx文件中
- **配置化管理**: 通过`TabConfig.tsx`统一管理所有tab配置

### 2. 随机排列组合

- 每次切换tab时，组件会随机重新排列面板顺序
- 通过`shuffleArray`函数实现随机化
- 保持用户体验的新鲜感

### 3. 支持的组件类型

- **Table**: 数据表格组件
- **Line Chart**: 折线图组件  
- **Bar Chart**: 柱状图组件
- **Pie Chart**: 饼图组件
- **Circular Panel**: 圆形进度面板
- **Metrics Panel**: 指标卡片面板
- **Mixed Panel**: 混合型面板（图片+图表）

## 使用方法

### 添加新的Tab

1. 在`tabs/`目录创建新的tab文件：

```typescript
import { PanelConfig } from '../components/PanelComponents';

export const getNewTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      // 定义左侧面板
    ],
    rightPanels: [
      // 定义右侧面板
    ]
  };
};
```

2. 在`tabs/TabConfig.tsx`中注册新tab：

```typescript
import { getNewTabPanels } from './NewTab';

export const tabConfigs: TabConfig[] = [
  // ... 现有tabs
  {
    id: 'new-tab',
    label: '新Tab标签',
    getPanels: () => createRandomizedPanels(getNewTabPanels())
  }
];
```

### 自定义面板组件

在`components/PanelComponents.tsx`中添加新的组件类型：

```typescript
export const CustomPanel: React.FC<{ data: CustomData }> = ({ data }) => (
  // 自定义组件实现
);

// 在PanelRenderer中添加新类型
case 'custom':
  return <CustomPanel data={panel.data} />;
```

## 优势

1. **可维护性**: 模块化结构便于维护和扩展
2. **可复用性**: UI组件可在不同tab间复用
3. **灵活性**: 支持随机组合和动态配置
4. **类型安全**: 完整的TypeScript支持
5. **性能优化**: 按需加载和渲染优化

## 技术栈

- React 18
- TypeScript
- Chart.js + react-chartjs-2
- CSS Modules
- 响应式设计