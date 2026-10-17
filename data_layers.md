# 数据图层与服务说明

## 1. 文档用途

本文档记录全球植被韧性 WebGIS 可视化平台当前使用的数据文件、GeoServer 图层、PostGIS 矢量数据、FastAPI 接口及其前端接入状态。

本文档主要用于：

- 说明前端页面所展示的数据来源
- 记录 GeoServer 图层名称和样式名称
- 说明不同图层对应的分析时段
- 记录 FastAPI 接口及其数据来源
- 区分地图显示功能与统计分析功能
- 说明当前系统的方法边界和工程限制
- 为项目复现、维护和 GitHub 展示提供依据

本文档不代替毕业论文中的数据来源说明、研究方法、统计检验、不确定性分析和稳健性检验。

## 2. 项目基本信息

| 项目 | 当前配置 |
|---|---|
| 项目名称 | 全球植被韧性 WebGIS 可视化平台 |
| 项目性质 | 硕士研究结果可视化与 WebGIS 求职作品 |
| 总体研究期 | 2001—2020 年 |
| 前端框架 | Vue 3、TypeScript、Vite |
| 页面组织 | Vue Router |
| 状态管理 | Pinia |
| 二维地图 | OpenLayers 10 |
| 三维地图 | Cesium |
| 图表展示 | ECharts |
| 后端接口 | FastAPI |
| 地图服务器 | GeoServer |
| 空间数据库 | PostgreSQL、PostGIS |
| 栅格服务 | WMS、GetFeatureInfo |
| 矢量服务 | WFS、GeoJSON |
| 数据接口 | REST API |
| 栅格数据坐标系 | EPSG:4326 |
| 气候区矢量坐标系 | EPSG:4326 |
| 前端地图坐标系 | EPSG:3857 |
| 当前运行方式 | 本地开发环境 |
| 公网部署状态 | 尚未部署 |
| 最后代码验证日期 | 2026 年 10 月 17 日 |

当前项目用于展示预先计算的植被韧性研究结果。WebGIS 页面不负责重新计算 AC1、趋势、突变年份或空间集聚统计量。

## 3. 系统数据结构

```text
论文与数据分析程序
├── 计算多年平均 AC1
├── 计算五年阶段平均 AC1
├── 计算 AC1 变化趋势
├── 识别显著突变年份
├── 生成空间集聚分类
└── 生成年度统计 CSV

GeoServer
├── 发布 AC1 栅格 WMS
├── 发布趋势栅格 WMS
├── 发布突变年份栅格 WMS
├── 发布空间集聚栅格 WMS
├── 发布气候区 WFS
└── 提供 GetFeatureInfo 查询

PostgreSQL / PostGIS
└── 保存气候区矢量数据

FastAPI
├── 读取全球年度 AC1 CSV
├── 读取气候区年度 AC1 CSV
├── 提供健康检查接口
└── 提供年度 AC1 数据接口

Vue 3 前端
├── OpenLayers 二维地图
├── Cesium 三维展示原型
├── ECharts 年度变化图
├── 图层与时段切换
├── 气候区筛选
└── 像元与矢量属性查询
```

## 4. 数据访问方式

系统中的数据访问分为三类。

### 4.1 栅格地图服务

植被韧性栅格结果由 GeoServer 发布为 WMS 服务。

前端使用 OpenLayers `TileWMS` 加载二维地图，使用 Cesium `WebMapServiceImageryProvider` 加载三维地图。

### 4.2 矢量地图服务

气候区矢量数据保存在 PostGIS 中，由 GeoServer 发布为 WFS 服务。

前端通过 WFS GetFeature 请求读取 GeoJSON，并使用 OpenLayers 矢量图层显示。

### 4.3 年度统计数据接口

年度统计数据保存在项目的 CSV 文件中。

FastAPI 负责读取 CSV，并向前端提供 REST API。前端通过独立 API 模块访问接口，再使用 ECharts 显示年度变化。

## 5. GeoServer 服务配置

### 5.1 服务地址

开发环境中的 GeoServer 地址为：

```text
http://localhost:8088/geoserver
```

前端不直接写完整本地地址，而是访问：

```text
/geoserver
```

Vite 开发服务器将 `/geoserver` 请求代理到：

```text
http://localhost:8088
```

### 5.2 工作区

```text
resilience
```

### 5.3 WMS 地址

```text
/geoserver/resilience/wms
```

### 5.4 OWS 和 WFS 地址

```text
/geoserver/resilience/ows
```

### 5.5 前端配置文件

GeoServer 服务地址、图层名称和请求参数集中定义在：

```text
src/api/geoserver.ts
```

环境变量示例：

```env
VITE_GEOSERVER_BASE_URL=/geoserver
```

## 6. 图层与分析时段总表

| 数据内容 | GeoServer 图层名称 | 数据类型 | 分析时段 | 前端状态 |
|---|---|---|---|---|
| 多年平均 AC1 | `resilience:mean_kndvi_ac1` | 连续型栅格 | 2001—2020 年 | 已接入 |
| 第一阶段平均 AC1 | `resilience:mean_ac1_2001_2005` | 连续型栅格 | 2001—2005 年 | 已接入 |
| 第二阶段平均 AC1 | `resilience:mean_ac1_2006_2010` | 连续型栅格 | 2006—2010 年 | 已接入 |
| 第三阶段平均 AC1 | `resilience:mean_ac1_2011_2015` | 连续型栅格 | 2011—2015 年 | 已接入 |
| 第四阶段平均 AC1 | `resilience:mean_ac1_2016_2020` | 连续型栅格 | 2016—2020 年 | 已接入 |
| AC1 变化趋势 | `resilience:ac1_trend` | 连续型栅格 | 2001—2020 年 | 已接入 |
| 显著突变年份 | `resilience:mutation_year` | 离散年份栅格 | 2001—2020 年 | 已接入 |
| AC1 空间集聚类型 | `resilience:lisa_cluster` | 分类栅格 | 2001—2020 年 | 已接入 |
| 气候区边界 | `resilience:climate_zones` | MultiPolygon | 气候基准期 | 已接入 |

五年时段切换只适用于平均 AC1 图层。

变化趋势、显著突变年份和空间集聚类型使用完整研究期结果，不能因为前端选择了五年时段而改变其分析时段标签。

## 7. 多年平均 AC1 图层

### 7.1 基本信息

| 项目 | 内容 |
|---|---|
| GeoServer 图层 | `resilience:mean_kndvi_ac1` |
| 数据文件 | `mean_kndvi_ac1.tif` |
| 数据类型 | 连续型栅格 |
| 分析时段 | 2001—2020 年 |
| 坐标系 | EPSG:4326 |
| GeoServer 样式 | `ac1_continuous` |
| 当前图例范围 | -0.50 至 0.91 |
| WMS 加载 | 已实现 |
| GetFeatureInfo 查询 | 已实现 |
| 透明度控制 | 已实现 |
| 动态图例 | 已实现 |
| 三维加载 | 已实现 |

### 7.2 指标解释

AC1 表示植被状态在相邻时间步之间的持续性。

在本项目的指标定义中：

- AC1 较高表示扰动影响衰减较慢
- AC1 较高对应相对较低的植被韧性
- AC1 较低表示植被状态恢复相对较快
- AC1 较低对应相对较高的植被韧性

以上解释依赖当前研究的指标设定，不能脱离数据处理方法直接推广到其他数据产品或时间尺度。

### 7.3 当前限制

当前图例范围来自已有结果和图件。论文最终定稿前仍应使用原始有效像元重新核对：

- 最小值
- 最大值
- 中位数
- 主要分位数
- 异常值
- NoData 范围

网页颜色范围不能代替论文中的数据分布和不确定性报告。

## 8. 五年阶段平均 AC1 图层

| 时段 | GeoServer 图层 | 数据文件 | GeoServer 样式 |
|---|---|---|---|
| 2001—2020 年 | `resilience:mean_kndvi_ac1` | `mean_kndvi_ac1.tif` | `ac1_continuous` |
| 2001—2005 年 | `resilience:mean_ac1_2001_2005` | `mean_ac1_2001_2005.tif` | `ac1_continuous` |
| 2006—2010 年 | `resilience:mean_ac1_2006_2010` | `mean_ac1_2006_2010.tif` | `ac1_continuous` |
| 2011—2015 年 | `resilience:mean_ac1_2011_2015` | `mean_ac1_2011_2015.tif` | `ac1_continuous` |
| 2016—2020 年 | `resilience:mean_ac1_2016_2020` | `mean_ac1_2016_2020.tif` | `ac1_continuous` |

五个时段使用相同的颜色方案和数值范围，以便进行空间格局比较。

前端已经实现：

- 时段下拉选择
- WMS 图层参数更新
- 分析时段文字更新
- 透明度控制
- GetFeatureInfo 查询
- OpenLayers 二维显示
- Cesium 三维显示

五年平均图层只反映各阶段的平均空间状态，不能替代趋势分析和突变检验。

## 9. AC1 变化趋势图层

### 9.1 基本信息

| 项目 | 内容 |
|---|---|
| GeoServer 图层 | `resilience:ac1_trend` |
| 数据文件 | `ac1_trend.tif` |
| 原始结果文件 | `theilsen_slope.tif` |
| 数据类型 | 连续型栅格 |
| 分析时段 | 2001—2020 年 |
| 坐标系 | EPSG:4326 |
| GeoServer 样式 | `ac1_trend_style` |
| 当前图例范围 | -0.173 至 0.348 |
| WMS 加载 | 已实现 |
| GetFeatureInfo 查询 | 已实现 |
| 透明度控制 | 已实现 |
| 动态图例 | 已实现 |

### 9.2 指标解释

- 正值表示 AC1 随时间上升
- 在当前指标解释下，AC1 上升对应植被韧性趋于下降
- 负值表示 AC1 随时间下降
- 在当前指标解释下，AC1 下降对应植被韧性趋于增强
- 接近 0 表示 AC1 变化方向较弱

### 9.3 方法边界

趋势方向不等于趋势达到统计显著。

当前 WebGIS 主要展示趋势估计值。若要在论文中讨论显著增加或显著降低，还需要同时报告：

- 趋势估计方法
- 显著性检验方法
- p 值或置信区间
- 空间自相关影响
- 多重检验处理
- 对异常值和时间序列长度的敏感性

趋势结果本身不能支持环境因子对植被韧性的因果解释。

## 10. 显著突变年份图层

### 10.1 基本信息

| 项目 | 内容 |
|---|---|
| GeoServer 图层 | `resilience:mutation_year` |
| 数据文件 | `mutation_year.tif` |
| 原始结果文件 | `pettitt_change_year.tif` |
| 数据类型 | 离散年份栅格 |
| 分析时段 | 2001—2020 年 |
| 坐标系 | EPSG:4326 |
| 年份范围 | 2001—2020 年 |
| GeoServer 样式 | `mutation_year_style` |
| WMS 加载 | 已实现 |
| GetFeatureInfo 查询 | 已实现 |
| 透明度控制 | 已实现 |
| 动态图例 | 已实现 |

### 10.2 指标解释

像元值表示该位置识别出的主要突变年份。

无数据区域可能包括：

- 没有检测到显著突变
- 有效时间序列长度不足
- 被植被掩膜排除
- 原始数据缺失
- 未通过预设显著性条件

### 10.3 方法边界

突变年份必须和显著性结果共同解释。

逐像元进行大量 Pettitt 检验时，可能出现多重检验导致的假阳性问题。论文中应说明：

- 显著性阈值
- 是否进行多重比较校正
- 有效观测数要求
- 缺失值处理
- 突变前后变化幅度
- 对时间序列长度的敏感性

WebGIS 当前只负责显示已有突变结果，不执行突变检验。

## 11. AC1 空间集聚类型图层

### 11.1 基本信息

| 项目 | 内容 |
|---|---|
| GeoServer 图层 | `resilience:lisa_cluster` |
| 数据文件 | `lisa_cluster.tif` |
| 原始结果文件 | `mean_kNDVI_AC_LISA.tif` |
| 数据类型 | 分类栅格 |
| 分析时段 | 2001—2020 年 |
| 坐标系 | EPSG:4326 |
| GeoServer 样式 | `lisa_cluster_style` |
| WMS 加载 | 已实现 |
| GetFeatureInfo 查询 | 已实现 |
| 透明度控制 | 已实现 |
| 分类图例 | 已实现 |

### 11.2 当前类别编码

| 像元值 | 当前显示类别 |
|---:|---|
| 0 | 未划分类别 |
| 1 | 高—高集聚 |
| 2 | 低—低集聚 |
| 3 | 高—低集聚 |
| 4 | 低—高集聚 |
| -9999 | 无数据 |

### 11.3 指标解释

高值和低值表示 AC1 的相对高低，不直接表示植被韧性的高低。

由于较高 AC1 在当前研究中对应较低植被韧性，因此：

- 高—高 AC1 集聚表示较高 AC1 的空间集聚
- 该类别在韧性解释上对应相对较低植被韧性的空间集聚
- 低—低 AC1 集聚表示较低 AC1 的空间集聚
- 该类别在韧性解释上对应相对较高植被韧性的空间集聚

### 11.4 方法限制

当前原始分类需要进一步确认是否完成了规范的局部 Moran 随机置换显著性检验。

在没有充分验证以下内容之前，类别 0 只能写成“未划分类别”，不能直接写成“统计不显著”：

- 空间权重矩阵
- 邻接关系
- 随机置换次数
- 显著性阈值
- 多重检验处理
- 边缘像元处理
- 缺失值处理

WebGIS 页面只能展示已有分类，不能证明空间集聚结果在统计上显著。

## 12. 气候区矢量图层

### 12.1 基本信息

| 项目 | 内容 |
|---|---|
| 数据类型 | MultiPolygon |
| 要素数量 | 5 |
| 坐标系 | EPSG:4326 |
| 分类字段 | `gridcode` |
| PostgreSQL 数据库 | `vegetation_webgis` |
| 数据库模式 | `public` |
| 数据库表 | `climate_zones` |
| 主键字段 | `gid` |
| 几何字段 | `geom` |
| GeoServer 存储仓库 | `vegetation_postgis` |
| GeoServer 图层 | `resilience:climate_zones` |
| 服务类型 | WFS |
| 输出格式 | GeoJSON |
| 前端状态 | 已接入 |

### 12.2 数据来源记录

当前项目记录的气候区数据包括：

```text
D:\data\climate\climate5dissolve.shp
```

原始气候分区栅格：

```text
D:\data\climate\climate1991-2020_re.tif
```

当前处理方式为：

1. 将气候分区栅格转为矢量面。
2. 根据 `gridcode` 字段进行融合。
3. 形成五类气候区 MultiPolygon。
4. 将矢量数据导入 PostGIS。
5. 通过 GeoServer PostGIS 存储仓库发布 WFS。

以上本地原始数据路径仅用于项目维护，不应要求其他用户具备相同路径。

### 12.3 气候类型编码

| `gridcode` | 当前系统标签 | FastAPI 英文名称 |
|---:|---|---|
| 1 | 热带 | Tropical |
| 2 | 干旱带 | Arid |
| 3 | 温带 | Temperate |
| 4 | 大陆性气候区 | Continental |
| 5 | 极地 | Polar |

当前映射必须与论文最终使用的气候区重分类规则保持一致。

如果历史 Python、R、ArcGIS 或制图代码使用了不同编码，不能仅根据网页显示判断哪套编码正确。论文定稿前应根据原始气候分区数据、重分类规则和最终统计表统一核查。

## 13. WFS 请求配置

### 13.1 请求参数

```text
service=WFS
version=1.0.0
request=GetFeature
typeName=resilience:climate_zones
outputFormat=application/json
srsName=EPSG:4326
```

### 13.2 前端请求地址

```text
/geoserver/resilience/ows
```

请求地址由以下文件生成：

```text
src/api/geoserver.ts
```

### 13.3 前端处理方式

前端使用 OpenLayers `VectorSource` 和 `GeoJSON` 解析 WFS 返回数据。

已经实现：

- 气候区边界加载
- 边界显示和隐藏
- 五类气候区筛选
- 点击查询气候区属性
- 选中气候区高亮
- 按气候区边界裁剪栅格可见范围

### 13.4 当前限制

WFS 当前一次性加载完整气候区几何。

虽然当前只有五个融合后的 MultiPolygon 要素，但全球边界几何仍可能较复杂。后续可以考虑：

- 对矢量边界进行几何简化
- 根据地图视图范围请求数据
- 使用 GeoServer `bbox` 参数
- 提供简化后的展示专用图层
- 对响应结果进行缓存

## 14. 气候区筛选的实际含义

气候区筛选的前端实现方式是：

1. 从 WFS 数据中选择对应 `gridcode` 的气候区要素。
2. 在 OpenLayers 渲染阶段建立裁剪路径。
3. 只显示气候区边界内部的栅格内容。
4. 更新气候区边界样式和高亮状态。
5. 请求对应气候区的年度 AC1 数据。

其中，栅格裁剪只改变地图显示范围。

该操作不会在浏览器中重新计算：

- 气候区平均 AC1
- 气候区 AC1 变化趋势
- 气候区突变比例
- 气候区空间集聚比例
- 气候区置信区间
- 气候区显著性结果

年度折线图使用的是预先生成的气候区年度统计数据，不是由当前显示栅格即时计算得到的。

## 15. GetFeatureInfo 像元查询

### 15.1 查询方式

前端通过当前可见 WMS 结果图层的 `getFeatureInfoUrl` 生成查询地址。

主要参数包括：

```text
INFO_FORMAT=application/json
FEATURE_COUNT=1
QUERY_LAYERS=当前图层名称
```

### 15.2 查询结果

前端从返回要素中读取栅格值，并根据图层类型进行格式化。

当前处理方式：

- 连续型 AC1 和趋势值保留三位小数
- 突变年份转换为整数
- 空间集聚类别转换为整数
- 根据图层类型显示相应解释
- 无有效结果时不显示数值

### 15.3 解释边界

GetFeatureInfo 返回的是当前地图位置对应的服务端像元值。

该结果受以下因素影响：

- 点击位置
- 地图坐标系
- GeoServer 栅格重投影
- 请求分辨率
- NoData 设置
- 图层当前样式
- 像元边界位置

单个像元查询结果不能代替区域统计。

## 16. 年度统计数据

### 16.1 全球年度数据

文件路径：

```text
public/data/global_yearly.csv
```

当前主要字段：

| 字段 | 含义 |
|---|---|
| `year` | 年份 |
| `ar1` | 全球年度 AC1 统计值 |

当前记录数量：

```text
20
```

对应 2001—2020 年。

### 16.2 气候区年度数据

文件路径：

```text
public/data/climate_analysis_data.csv
```

当前主要字段：

| 字段 | 含义 |
|---|---|
| `zone` | 气候区英文名称 |
| `year` | 年份 |
| `ar1` | 年度 AC1 统计值 |
| `fitted` | 可选拟合值 |
| `segment` | 可选分段标记 |

当前记录数量：

```text
200
```

FastAPI 后端同时兼容以下气候区字段名：

```text
climate_zone
zone
```

## 17. FastAPI 服务

### 17.1 代码文件

```text
backend/main.py
```

依赖文件：

```text
backend/requirements.txt
```

### 17.2 健康检查接口

```http
GET /api/health
```

预期响应：

```json
{
  "status": "ok",
  "service": "vegetation-resilience-webgis-api"
}
```

### 17.3 年度 AC1 接口

全球年度数据：

```http
GET /api/yearly-ac1?climate_code=all
```

热带年度数据：

```http
GET /api/yearly-ac1?climate_code=1
```

其他气候区：

```http
GET /api/yearly-ac1?climate_code=2
GET /api/yearly-ac1?climate_code=3
GET /api/yearly-ac1?climate_code=4
GET /api/yearly-ac1?climate_code=5
```

### 17.4 参数范围

| 参数 | 含义 |
|---|---|
| `all` | 全球 |
| `1` | 热带 |
| `2` | 干旱带 |
| `3` | 温带 |
| `4` | 大陆性气候区 |
| `5` | 极地 |

其他参数不在当前接口允许范围内。

### 17.5 返回格式

```json
[
  {
    "year": 2001,
    "value": 0.234689,
    "climateCode": "all",
    "climateLabel": "全球"
  }
]
```

### 17.6 前端调用

前端接口封装文件：

```text
src/api/statistics.ts
```

图表组件：

```text
src/components/TimeSeriesChart.vue
```

前端通过以下环境变量确定 API 基础地址：

```env
VITE_API_BASE_URL=/api
```

Vite 将 `/api` 代理到：

```text
http://localhost:8000
```

## 18. ECharts 年度变化图

年度变化图已经实现：

- 全球年度 AC1 折线图
- 五类气候区年度 AC1 折线图
- 气候区切换后自动更新
- 数据加载状态
- 接口错误提示
- 自适应窗口尺寸变化
- 组件销毁时释放图表实例

折线图用于展示年度统计序列，不直接表示变化趋势达到统计显著。

如果需要在论文中解释趋势，应另外报告趋势估计、显著性和不确定性。

## 19. Cesium 三维图层

### 19.1 当前功能

三维页面使用 Cesium 加载 GeoServer 发布的平均 AC1 WMS 图层。

已经实现：

- Cesium Viewer 初始化
- WMS 栅格加载
- 五个分析时段切换
- 图层透明度控制
- 与二维地图共享 Pinia 状态
- 按需渲染
- 降低渲染分辨率
- 关闭非必要 Cesium 控件

### 19.2 Cesium 静态资源

Cesium 静态资源由 `vite-plugin-static-copy` 复制。

配置文件：

```text
vite.config.js
```

Cesium 基础资源地址：

```text
/cesiumStatic/node_modules/cesium/Build/Cesium/
```

复制内容包括：

- Workers
- Assets
- Widgets
- ThirdParty

### 19.3 当前定位

Cesium 页面是三维展示原型，不是三维空间分析系统。

当前未实现：

- 三维空间量算
- 3D Tiles
- 地形分析
- 剖面分析
- 三维统计分析
- 大规模三维场景管理

### 19.4 性能限制

2026 年 10 月 17 日生产构建结果显示：

- 三维页面代码块约 4.17 MB
- gzip 后约 1.12 MB
- 构建系统提示代码块体积超过推荐值

因此，三维页面首次加载较慢。该问题不影响基本功能，但属于明确的工程限制。

## 20. Pinia 状态管理

共享地图状态定义在：

```text
src/stores/mapStore.ts
```

当前管理的状态包括：

| 状态 | 用途 |
|---|---|
| `activeLayer` | 当前结果图层 |
| `selectedPeriod` | 当前分析时段 |
| `selectedClimateCode` | 当前气候区 |
| `ac1Opacity` | 结果图层透明度 |
| `viewMode` | 二维或三维视图标记 |

二维地图和三维地图共享：

- 当前分析时段
- 当前图层透明度

二维地图和年度变化图共享：

- 当前气候区

## 21. 前端页面

### 21.1 首页

路径：

```text
/
```

文件：

```text
src/views/HomeView.vue
```

作用：

- 展示项目名称
- 展示技术栈
- 提供二维地图入口
- 提供三维地图入口

### 21.2 二维地图

路径：

```text
/map
```

文件：

```text
src/views/MapView.vue
```

作用：

- 展示主要研究结果
- 提供图层控制
- 提供时段切换
- 提供气候区筛选
- 提供像元和矢量查询
- 展示年度变化图

### 21.3 三维地图

路径：

```text
/globe
```

文件：

```text
src/views/GlobeView.vue
```

作用：

- 展示 Cesium 三维地球
- 加载平均 AC1 WMS
- 提供时段和透明度控制

## 22. 本地服务运行条件

完整运行需要以下服务：

1. PostgreSQL 和 PostGIS。
2. GeoServer。
3. FastAPI。
4. Vite 开发服务器。

### 22.1 GeoServer

```text
http://localhost:8088/geoserver
```

### 22.2 FastAPI

```text
http://localhost:8000
```

### 22.3 前端

```text
http://localhost:5173
```

## 23. 本地启动步骤

### 23.1 启动 PostgreSQL

确认保存 `climate_zones` 表的 PostgreSQL 服务正在运行。

### 23.2 启动 GeoServer

确认以下地址可以访问：

```text
http://localhost:8088/geoserver
```

并确认 `resilience` 工作区中的 WMS 和 WFS 图层可以正常请求。

### 23.3 创建 FastAPI 虚拟环境

在项目根目录执行：

```powershell
python -m venv backend/.venv
```

激活环境：

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

安装依赖：

```powershell
python -m pip install -r backend/requirements.txt
```

### 23.4 启动 FastAPI

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

### 23.5 启动前端

新开一个终端，执行：

```powershell
npm.cmd install
npm.cmd run dev
```

访问：

```text
http://localhost:5173/
http://localhost:5173/map
http://localhost:5173/globe
```

## 24. 类型检查与生产构建

类型检查命令：

```powershell
npm.cmd run type-check
```

生产构建命令：

```powershell
npm.cmd run build
```

2026 年 10 月 17 日验证结果：

| 验证项目 | 结果 |
|---|---|
| TypeScript 类型检查 | 通过 |
| Vite 生产构建 | 通过 |
| Cesium 静态资源复制 | 通过 |
| 生产代码块体积检查 | 存在警告 |
| 构建阻断错误 | 无 |

生产构建生成的 `dist` 目录不上传 GitHub。

## 25. 当前功能验证记录

以下结果分为代码验证和本地服务验证。

### 25.1 已完成代码验证

| 验证项目 | 结果 |
|---|---|
| Vue Router 页面配置 | 通过 |
| Pinia 状态配置 | 通过 |
| GeoServer API 封装 | 通过 |
| FastAPI 请求封装 | 通过 |
| FastAPI 路由代码 | 通过 |
| ECharts 图表组件 | 通过 |
| OpenLayers 图层配置 | 通过 |
| Cesium WMS 配置 | 通过 |
| TypeScript 类型检查 | 通过 |
| Vite 生产构建 | 通过 |

### 25.2 需要在本地服务运行时验证

| 验证项目 | 验证要求 |
|---|---|
| PostgreSQL 服务 | 数据库可以连接 |
| `climate_zones` 表 | 表和字段存在 |
| GeoServer PostGIS 存储仓库 | 连接正常 |
| WMS 图层 | 返回有效 PNG |
| WFS 气候区请求 | 返回 FeatureCollection |
| GetFeatureInfo | 返回有效 JSON |
| FastAPI 健康检查 | 返回 `status: ok` |
| 全球年度接口 | 返回 20 条年度数据 |
| 气候区年度接口 | 返回对应气候区数据 |
| 二维地图图层切换 | 页面显示正常 |
| 气候区筛选和裁剪 | 页面交互正常 |
| Cesium WMS | 三维页面显示正常 |

GitHub 中的“已验证”表述应以实际完成本地运行检查为前提。

## 26. 方法学限制

### 26.1 研究结果与网页显示的关系

WebGIS 只负责展示已有研究结果。

页面能够显示一个图层，不代表：

- 原始数据不存在误差
- 指标计算一定正确
- 结果通过稳健性检验
- 趋势达到统计显著
- 突变年份具有唯一性
- 空间集聚达到统计显著
- 变量之间存在因果关系

### 26.2 变化趋势

趋势方向不能替代显著性检验，也不能直接支持因果解释。

### 26.3 突变检验

逐像元突变检验可能受到多重比较和假阳性影响。

### 26.4 空间集聚

在局部 Moran 随机置换检验没有充分验证前，空间集聚分类不能写成显著 LISA 结果。

### 26.5 气候区编码

气候区编码必须与原始重分类规则、分析代码和论文统计表保持一致。

### 26.6 外推范围

当前结果适用于：

- 当前数据来源
- 当前空间分辨率
- 2001—2020 年研究期
- 当前植被掩膜
- 当前指标定义
- 当前空间和时间处理方法

不能直接外推到其他时间尺度、空间分辨率或植被数据产品。

## 27. 工程限制

当前工程限制包括：

- 依赖本地 PostgreSQL、PostGIS 和 GeoServer
- 依赖本地 FastAPI
- 尚未完成公网部署
- 尚未建立自动化测试
- 尚未配置 GitHub Actions
- 尚未提供 Docker Compose
- 尚未提供统一启动脚本
- WFS 当前一次性加载完整气候区几何
- 移动端布局尚未系统测试
- Cesium 页面代码包较大
- 缺少后端数据缓存
- 缺少接口分页
- 缺少用户权限和身份认证
- 缺少运行状态监控

以上限制不影响项目作为本地 WebGIS 求职作品，但意味着当前版本不能直接称为生产系统。

## 28. GitHub 数据范围

### 28.1 应上传内容

```text
backend/main.py
backend/requirements.txt
src/
public/data/global_yearly.csv
public/data/climate_analysis_data.csv
docs/images/
.env.example
.gitignore
README.md
data_layers.md
package.json
package-lock.json
tsconfig.json
vite.config.js
index.html
```

### 28.2 不应上传内容

```text
.env.development
.env.production
backend/.venv/
.venv/
backend/__pycache__/
node_modules/
dist/
GeoServer 数据目录
PostgreSQL 数据目录
数据库密码
接口密钥
访问令牌
原始大体积 GeoTIFF
原始 Shapefile
```

原始空间数据不上传时，README 必须明确说明系统依赖已经发布的本地 GeoServer 图层。

## 29. 后续工作

### 优先级一

- 完成 README
- 增加 Cesium 页面截图
- 重新完成本地功能验收
- 更新 GitHub 主分支
- 确保简历描述与仓库一致

### 优先级二

- 增加 FastAPI 接口测试
- 增加前端基础测试
- 配置 GitHub Actions
- 优化 WFS 几何加载
- 优化 Cesium 加载性能
- 增加统一启动脚本

### 优先级三

- 配置 Docker Compose
- 部署公网 FastAPI
- 部署公网 GeoServer
- 部署前端静态资源
- 配置反向代理
- 增加运行监控

## 30. 使用说明

本项目用于个人研究成果展示、WebGIS 开发能力说明和求职作品展示。

项目中的地图、图表和查询结果不能脱离原始研究方法单独用于学术推断。

涉及论文结论、数据引用或进一步研究时，应以经过核查的原始数据、分析代码、统计结果和论文最终方法为准。