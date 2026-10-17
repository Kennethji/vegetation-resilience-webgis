# 全球植被韧性 WebGIS 可视化平台

本项目是一个用于展示全球植被韧性研究结果的 WebGIS 可视化平台。

系统基于 Vue 3、TypeScript、OpenLayers、Cesium、ECharts、FastAPI、GeoServer 和 PostGIS 构建，用于展示 2001—2020 年全球植被韧性的空间格局、变化趋势、显著突变年份、空间集聚类型和年度变化。

本项目的主要目标是展示 WebGIS 前端开发、地图服务接入、空间数据可视化、前后端接口联调和基础工程化能力。

当前系统属于研究结果可视化和求职作品原型。研究指标由论文分析代码预先计算，WebGIS 页面不负责重新计算 AC1、变化趋势、突变年份或空间集聚统计量。

## 项目预览

### 二维地图总览

![二维地图总览](docs/images/overview.png)

### 多时段 AC1 切换

![多时段AC1切换](docs/images/period-comparison.png)

### 气候区筛选与栅格裁剪

![气候区筛选](docs/images/climate-filter.png)

### 像元查询

![像元查询](docs/images/pixel-query.png)

### 演示视频

[查看项目演示视频](docs/images/vegetation-resilience-webgis-demo.mp4)

## 技术栈

| 模块 | 技术 |
|---|---|
| 前端框架 | Vue 3、TypeScript、Vite |
| 页面组织 | Vue Router |
| 状态管理 | Pinia |
| 二维地图 | OpenLayers |
| 三维地图 | Cesium |
| 图表展示 | ECharts |
| 后端接口 | FastAPI |
| 地图服务 | GeoServer |
| 空间数据库 | PostgreSQL、PostGIS |
| 地图服务协议 | WMS、WFS、GetFeatureInfo |
| 数据格式 | GeoTIFF、GeoJSON、CSV |

## 系统架构

```text
Vue 3 前端
├── 首页
├── OpenLayers 二维地图
├── Cesium 三维展示原型
├── ECharts 年度变化图
├── Vue Router 页面管理
└── Pinia 地图状态管理

FastAPI
├── GET /api/health
└── GET /api/yearly-ac1

GeoServer
├── WMS 栅格图层服务
├── WFS 气候区矢量服务
└── GetFeatureInfo 像元查询

PostgreSQL / PostGIS
└── climate_zones 气候区矢量数据
```

前端负责地图显示、图层控制、查询交互和统计图展示。

GeoServer 负责发布植被韧性栅格图层和气候区矢量图层。

FastAPI 负责读取年度统计数据，并向前端提供统一的数据接口。

PostGIS 负责保存气候区矢量数据，GeoServer 通过 PostGIS 数据存储发布 WFS 服务。

## 已实现功能

### 二维地图

- 加载 Esri 全球地形底图
- 加载 GeoServer WMS 栅格图层
- 切换多年平均 AC1、AC1 变化趋势、显著突变年份和空间集聚类型
- 切换 2001—2020 年及四个五年阶段的平均 AC1 图层
- 根据当前图层动态更新连续型或分类图例
- 控制研究结果图层透明度
- 使用 GetFeatureInfo 查询像元值
- 根据不同图层解释查询结果
- 限制世界地图横向重复显示

### 气候区交互

- 通过 WFS 加载气候区 GeoJSON 数据
- 显示和隐藏气候区边界
- 筛选热带、干旱带、温带、大陆性气候区和极地
- 点击查询气候区属性
- 高亮当前选中的气候区
- 按气候区边界裁剪栅格可见范围
- 根据选中的气候区更新年度 AC1 变化图

### 年度变化图

- 使用 FastAPI 提供年度 AC1 数据接口
- 支持全球年度数据查询
- 支持五类气候区年度数据查询
- 使用 ECharts 显示年度 AC1 折线图
- 气候区变化后自动重新请求数据
- 提供数据加载状态和错误提示

### 三维地图

- 使用 Cesium 创建三维地球页面
- 加载 GeoServer WMS 栅格图层
- 支持五个分析时段切换
- 支持图层透明度控制
- 与二维地图共享 Pinia 状态
- 使用按需渲染和较低分辨率降低资源消耗

三维页面当前定位为展示原型，不提供复杂三维空间分析功能。

### 工程功能

- 使用 TypeScript 管理数据类型
- 使用 Vue Router 管理多页面结构
- 使用 Pinia 管理共享地图状态
- 将 GeoServer 请求配置封装到独立 API 模块
- 将 FastAPI 请求封装到统计数据 API 模块
- 使用环境变量管理 GeoServer 和 FastAPI 地址
- 配置 Vite 开发代理
- 完成 TypeScript 类型检查
- 完成 Vite 生产构建

## 图层与分析时段

| 图层 | GeoServer 图层名称 | 分析时段 |
|---|---|---|
| 多年平均 AC1 | `resilience:mean_kndvi_ac1` | 2001—2020 年 |
| 第一阶段平均 AC1 | `resilience:mean_ac1_2001_2005` | 2001—2005 年 |
| 第二阶段平均 AC1 | `resilience:mean_ac1_2006_2010` | 2006—2010 年 |
| 第三阶段平均 AC1 | `resilience:mean_ac1_2011_2015` | 2011—2015 年 |
| 第四阶段平均 AC1 | `resilience:mean_ac1_2016_2020` | 2016—2020 年 |
| AC1 变化趋势 | `resilience:ac1_trend` | 2001—2020 年 |
| 显著突变年份 | `resilience:mutation_year` | 2001—2020 年 |
| AC1 空间集聚类型 | `resilience:lisa_cluster` | 2001—2020 年 |
| 气候区边界 | `resilience:climate_zones` | 气候基准期数据 |

变化趋势、显著突变年份和空间集聚类型使用完整研究期结果，不随五年时段选择变化。

完整的数据图层和服务配置见 [data_layers.md](data_layers.md)。

## API 接口

### 健康检查

```http
GET /api/health
```

示例响应：

```json
{
  "status": "ok",
  "service": "vegetation-resilience-webgis-api"
}
```

### 全球年度 AC1 数据

```http
GET /api/yearly-ac1?climate_code=all
```

### 指定气候区年度 AC1 数据

```http
GET /api/yearly-ac1?climate_code=1
```

气候区代码如下：

| 代码 | 气候区 |
|---|---|
| `all` | 全球 |
| `1` | 热带 |
| `2` | 干旱带 |
| `3` | 温带 |
| `4` | 大陆性气候区 |
| `5` | 极地 |

年度接口返回格式：

```json
[
  {
    "year": 2001,
    "value": 0.2347,
    "climateCode": "all",
    "climateLabel": "全球"
  }
]
```

## 项目目录

```text
vegetation-resilience-webgis/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── docs/
│   └── images/
│       ├── overview.png
│       ├── period-comparison.png
│       ├── climate-filter.png
│       ├── pixel-query.png
│       └── vegetation-resilience-webgis-demo.mp4
├── public/
│   └── data/
│       ├── global_yearly.csv
│       └── climate_analysis_data.csv
├── src/
│   ├── api/
│   │   ├── geoserver.ts
│   │   ├── statistics.ts
│   │   └── types.ts
│   ├── components/
│   │   └── TimeSeriesChart.vue
│   ├── config/
│   │   └── mapConfig.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   └── mapStore.ts
│   ├── types/
│   │   └── map.ts
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── MapView.vue
│   │   └── GlobeView.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env.example
├── .gitignore
├── data_layers.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

原始 GeoTIFF、Shapefile、GeoServer 数据目录和 PostgreSQL 数据库文件不包含在本仓库中。

## 本地运行条件

本地完整运行需要：

1. Node.js 和 npm
2. Python 3.11 或兼容版本
3. PostgreSQL 和 PostGIS
4. GeoServer
5. 已在 GeoServer 中发布的 WMS 和 WFS 图层

## 环境变量

复制 `.env.example`：

```powershell
Copy-Item .env.example .env.development
```

默认配置：

```env
VITE_GEOSERVER_BASE_URL=/geoserver
VITE_API_BASE_URL=/api
```

开发环境中，Vite 将 `/geoserver` 转发到本地 GeoServer，将 `/api` 转发到 FastAPI。

## 本地启动步骤

### 1. 启动 PostgreSQL 和 PostGIS

确认保存气候区数据的 PostgreSQL 服务正在运行。

当前项目使用的主要矢量表为：

```text
public.climate_zones
```

### 2. 启动 GeoServer

确认以下地址可以访问：

```text
http://localhost:8088/geoserver
```

确认 `resilience` 工作区中的 WMS 和 WFS 图层已经发布。

### 3. 安装 FastAPI 依赖

在项目根目录执行：

```powershell
python -m venv backend/.venv
```

激活虚拟环境：

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

安装依赖：

```powershell
python -m pip install -r backend/requirements.txt
```

### 4. 启动 FastAPI

在项目根目录执行：

```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

检查：

```text
http://localhost:8000/api/health
```

接口文档：

```text
http://localhost:8000/docs
```

### 5. 安装前端依赖

新开一个终端，在项目根目录执行：

```powershell
npm.cmd install
```

### 6. 启动前端

```powershell
npm.cmd run dev
```

浏览器访问：

```text
http://localhost:5173/
http://localhost:5173/map
http://localhost:5173/globe
```

## 类型检查与生产构建

运行 TypeScript 类型检查：

```powershell
npm.cmd run type-check
```

运行生产构建：

```powershell
npm.cmd run build
```

2026 年 10 月 17 日验证结果：

- TypeScript 类型检查通过
- Vite 生产构建通过
- Cesium 静态资源复制成功
- 生产构建存在大体积代码块警告

Cesium 页面代码和静态资源体积较大，因此首次进入三维页面时可能出现较长加载时间。

## 数据解释

AC1 表示植被状态的持续性。

在本项目的指标解释中，AC1 越高，说明扰动影响衰减越慢，对应相对较低的植被韧性。AC1 越低，说明植被状态恢复较快，对应相对较高的植被韧性。

气候区筛选通过矢量边界裁剪当前栅格图层的可见范围。该功能只改变地图显示范围，不会在浏览器中重新计算气候区内部的 AC1 均值、变化趋势、突变比例或空间集聚比例。

## 方法边界

本系统用于展示预先计算的研究结果，不能替代论文中的统计分析和方法验证。

需要注意：

1. AC1 变化方向不代表变化达到统计显著。
2. AC1 与植被韧性之间的解释依赖研究中的指标定义和数据处理方法。
3. 趋势图不能单独支持环境因子与植被韧性之间的因果结论。
4. 突变年份需要结合显著性结果解释。
5. 逐像元突变检验可能受到多重检验和假阳性问题影响。
6. 当前空间集聚分类不能在缺少规范随机置换检验时直接解释为显著 LISA 结果。
7. 气候区编码仍应与论文最终使用的重分类规则保持一致。

## 工程限制

- 当前项目主要面向本地运行和作品展示
- 当前依赖本地 GeoServer、PostGIS 和 FastAPI
- 尚未完成公网生产部署
- 不能只上传前端到 GitHub Pages 后直接访问本地服务
- WFS 当前一次性加载全球气候区几何
- 尚未建立自动化测试
- 尚未提供 Docker Compose 或统一启动脚本
- 移动端布局尚未完成系统测试
- Cesium 页面资源体积较大，首次加载较慢

## 功能验证

以下项目已经完成代码检查或本地验证：

- 四类 WMS 结果图层切换
- 多年平均 AC1 五个时段切换
- 图层透明度控制
- 动态图例切换
- WMS GetFeatureInfo 像元查询
- WFS 气候区加载
- 气候区筛选、查询和高亮
- 气候区栅格显示裁剪
- FastAPI 健康检查接口
- FastAPI 年度统计接口
- ECharts 年度变化图
- Cesium 三维 WMS 展示原型
- TypeScript 类型检查
- Vite 生产构建

最后代码验证日期为 2026 年 10 月 17 日。

## 后续工作

- 增加前端和 FastAPI 自动化测试
- 优化 WFS 几何加载性能
- 优化 Cesium 页面加载性能
- 增加统一启动脚本
- 增加 Docker Compose 部署配置
- 配置公网 GeoServer、FastAPI 和前端服务
- 继续核对研究结果图层的数值范围和分类规则

## 使用说明

本项目用于个人研究成果展示和 WebGIS 开发能力说明。

数据解释、论文引用和进一步使用应以经过核查的原始数据、分析代码和论文最终方法为准。
