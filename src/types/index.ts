// 数据类型定义
export interface DashboardData {
  temperature: number;
  humidity: number;
  oxygenLevel: number;
  fishCount: number;
}

export interface FarmData {
  id: number;
  name: string;
  pools: PoolData[];
}

export interface PoolData {
  id: number;
  fishCount: number;
  waterLevel: number;
  temperature: number;
}