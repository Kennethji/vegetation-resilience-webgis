# 数据图层与服务记录

## 1. 项目基本信息

- 项目名称：全球植被韧性时空格局可视化平台
- 项目性质：硕士研究成果的WebGIS可视化原型
- 前端框架：Vue 3
- 地图框架：OpenLayers 10
- 地图服务器：GeoServer
- 空间数据库：PostgreSQL 18与PostGIS 3.6.2
- 栅格服务：WMS
- 矢量服务：WFS
- 总体研究期：2001—2020年
- 数据坐标系：EPSG:4326
- 前端视图坐标系：EPSG:3857
- 前端开发地址：http://localhost:5173
- GeoServer本地地址：http://localhost:8088/geoserver
- 当前运行方式：本地开发环境
- 生产构建：已通过
- 最后验证日期：2026年10月7日

说明：本文件记录当前系统实际接入的数据、服务和功能，不代表所有数据处理方法已经达到论文最终定稿标准。

## 2. 图层分析时段

| 结果图层 | 可选分析时段 | 当前处理方式 |
|---|---|---|
| 多年平均AC1 | 2001—2020年及四个五年阶段 | 支持前端切换 |
| AC1变化趋势 | 2001—2020年 | 固定完整研究期 |
| Pettitt显著突变年份 | 2001—2020年 | 固定完整研究期 |
| AC1空间集聚类型 | 2001—2020年 | 当前固定完整研究期 |

趋势分析和突变检验没有机械拆分为五年窗口。五年年度序列包含的观测数量过少，难以为稳健趋势估计和突变识别提供充分依据。若后续增加分阶段趋势，应重新计算相应栅格并报告显著性结果。若增加分阶段空间集聚，应分别计算各阶段的局部空间统计结果。

## 3. 多年平均滞后一期自相关系数

- GeoServer图层：resilience:mean_kndvi_ac1
- 数据类型：连续型栅格
- 数据文件：mean_kndvi_ac1.tif
- 坐标系：EPSG:4326
- 当前显示范围：-0.50至0.91
- GeoServer样式：ac1_continuous
- 前端状态：已接入
- 图层切换：已实现
- 透明度控制：已实现
- WMS像元查询：已实现
- 动态图例：已实现
- 指标解释：AC1越高，植被状态持续性越强，扰动影响衰减越慢，植被韧性相对越低

显示范围应与最终有效像元统计结果再次核对。网页显示范围不能代替论文中的数据分布统计和不确定性报告。

## 4. 五年平均AC1图层

五个时段统一使用同一颜色方案和数值范围，以支持空间格局的直接比较。

| 时段 | GeoServer图层 | 数据文件 | 样式 | 前端状态 |
|---|---|---|---|---|
| 2001—2020年 | resilience:mean_kndvi_ac1 | mean_kndvi_ac1.tif | ac1_continuous | 已接入 |
| 2001—2005年 | resilience:mean_ac1_2001_2005 | mean_ac1_2001_2005.tif | ac1_continuous | 已接入 |
| 2006—2010年 | resilience:mean_ac1_2006_2010 | mean_ac1_2006_2010.tif | ac1_continuous | 已接入 |
| 2011—2015年 | resilience:mean_ac1_2011_2015 | mean_ac1_2011_2015.tif | ac1_continuous | 已接入 |
| 2016—2020年 | resilience:mean_ac1_2016_2020 | mean_ac1_2016_2020.tif | ac1_continuous | 已接入 |

以上图层均已实现时段切换、透明度控制、动态图例和WMS像元查询。

## 5. AC1变化趋势

- GeoServer图层：resilience:ac1_trend
- 数据类型：连续型栅格
- 数据文件：ac1_trend.tif
- 原始文件：theilsen_slope.tif
- 分析时段：2001—2020年
- 坐标系：EPSG:4326
- 当前显示范围：-0.173至0.348
- GeoServer样式：ac1_trend_style
- 前端状态：已接入
- 图层切换：已实现
- 透明度控制：已实现
- WMS像元查询：已实现
- 动态图例：已实现
- 指标解释：正值表示AC1上升，植被韧性趋于下降；负值表示AC1下降，植被韧性趋于增强

当前显示范围来自已有论文图件，仍需与原始栅格有效像元的最小值、最大值和分位数核对。趋势方向不等同于趋势达到统计显著，也不能单独支持因果解释。

## 6. Pettitt显著突变年份

- GeoServer图层：resilience:mutation_year
- 数据类型：离散年份栅格
- 数据文件：mutation_year.tif
- 原始文件：pettitt_change_year.tif
- 分析时段：2001—2020年
- 坐标系：EPSG:4326
- 年份范围：2001—2020年
- 显著性条件：p小于0.05
- GeoServer样式：mutation_year_style
- 前端状态：已接入
- 图层切换：已实现
- 透明度控制：已实现
- WMS像元查询：已实现
- 动态图例：已实现
- 指标解释：像元值表示该位置通过Pettitt检验识别出的突变年份
- 无数据含义：未检测到显著突变、有效观测不足或被掩膜区域

突变年份必须结合显著性栅格解释。若逐像元进行大量检验，还应在论文中讨论多重检验带来的假阳性风险。

## 7. AC1局部空间集聚类型

- GeoServer图层：resilience:lisa_cluster
- 数据类型：分类栅格
- 数据文件：lisa_cluster.tif
- 原始文件：mean_kNDVI_AC_LISA.tif
- 分析时段：2001—2020年
- 坐标系：EPSG:4326
- GeoServer样式：lisa_cluster_style
- 前端状态：已接入
- 图层切换：已实现
- 透明度控制：已实现
- WMS像元查询：已实现
- 分类图例：已实现

### 7.1 类别编码

| 像元值 | 当前显示类别 |
|---:|---|
| 0 | 未划分类别 |
| 1 | 高—高集聚 |
| 2 | 低—低集聚 |
| 3 | 高—低集聚 |
| 4 | 低—高集聚 |
| -9999 | 无数据 |

### 7.2 方法限制

当前原始处理代码根据中心像元与邻域值的高低组合划分类别，但没有完成规范的局部Moran随机置换显著性检验。因此，类别0只能标记为“未划分类别”，不能解释为统计不显著。当前图层也不应在论文中直接称为显著LISA集聚结果。

高值和低值指AC1的相对高低，不直接表示植被韧性的高低。高—高AC1集聚对应相对较低植被韧性的空间集聚。论文最终定稿前应补充空间权重设定、置换次数、显著性阈值及多重检验处理。

## 8. 气候类型分区矢量图层

- 数据文件：D:\data\climate\climate5dissolve.shp
- 原始分区栅格：D:\data\climate\climate1991-2020_re.tif
- 数据处理：由气候分区栅格转为矢量面，并依据gridcode字段融合
- 数据类型：MultiPolygon
- 要素数量：5
- 数据坐标系：EPSG:4326
- 字符编码：UTF-8
- PostgreSQL数据库：vegetation_webgis
- 数据库模式：public
- 数据库表：climate_zones
- 主键字段：gid
- 分类字段：gridcode
- 几何字段：geom
- GeoServer存储仓库：vegetation_postgis
- GeoServer图层：resilience:climate_zones
- 服务类型：WFS
- 前端状态：已接入
- 边界显示：已实现
- 图层开关：已实现
- 分类筛选：已实现
- 属性查询：已实现
- 选中高亮：已实现
- 栅格显示裁剪：已实现

### 8.1 当前气候类型编码

| gridcode | 当前系统标签 |
|---:|---|
| 1 | 热带 |
| 2 | 干旱带 |
| 3 | 温带 |
| 4 | 大陆性气候区 |
| 5 | 极地 |

当前映射依据使用同一气候分区栅格的Python分析代码设置。部分历史R代码存在另一套分类编码。论文定稿前必须依据原始重分类规则、图件和统计表统一核查，不能仅根据网页显示判断编码正确。

### 8.2 WFS服务配置

- 请求方式：GeoServer WFS GetFeature
- 输出格式：GeoJSON
- 前端请求路径：/geoserver/resilience/ows
- 要素类型：resilience:climate_zones
- Vite开发代理：已配置
- 服务验证：已返回FeatureCollection

### 8.3 气候区筛选的含义

前端根据气候区矢量边界裁剪当前栅格图层的可见范围。该功能只改变地图显示，不会重新计算气候区内部的均值、趋势、突变比例或集聚比例。因此，它属于交互式空间筛选，不属于分区统计分析。

## 9. 当前已实现功能

### 9.1 栅格功能

- Esri全球地形底图加载
- GeoServer WMS栅格服务调用
- 四类研究结果图层切换
- 多年平均AC1五个时段切换
- 图层分析时段正确标注
- 图层透明度调节
- 连续型图例动态切换
- 分类图例动态切换
- WMS GetFeatureInfo像元查询
- 查询结果动态解释
- 世界地图横向重复显示限制

### 9.2 矢量功能

- PostGIS空间数据库连接
- GeoServer PostGIS存储仓库连接
- WFS矢量服务调用
- 气候区边界叠加与开关
- 气候类型筛选
- 矢量要素点击查询
- 选中气候区高亮显示
- 按气候区裁剪栅格可见范围

### 9.3 前端工程功能

- Vue响应式状态管理
- OpenLayers地图与图层管理
- 栅格和矢量查询结果动态更新
- Vite开发代理访问GeoServer
- 生产环境构建

## 10. 服务运行条件

本地完整运行需要以下服务：

1. PostgreSQL服务，用于保存气候区矢量数据。
2. GeoServer服务，用于发布WMS和WFS。
3. Vite开发服务器，用于运行前端并提供开发代理。

开发环境启动命令：

```powershell
Set-Location D:\webgis\projects\vegetation-resilience-webgis
npm.cmd run dev
```

生产构建命令：

```powershell
Set-Location D:\webgis\projects\vegetation-resilience-webgis
npm.cmd run build
```

`dist`目录已经生成，但静态文件仍需通过反向代理或同源服务访问GeoServer。不能把当前`dist`直接上传到GitHub Pages并声称已经完成在线部署。

## 11. 功能验证记录

| 验证项目 | 结果 |
|---|---|
| PostGIS版本查询 | 通过 |
| climate_zones数据库查询 | 通过 |
| GeoServer PostGIS连接 | 通过 |
| WFS FeatureCollection返回 | 通过 |
| 气候区矢量加载 | 通过 |
| 气候区显示开关 | 通过 |
| 五类气候区筛选 | 通过 |
| 气候区点击查询 | 通过 |
| 气候区选中高亮 | 通过 |
| 气候区栅格显示裁剪 | 通过 |
| 四类WMS结果切换 | 通过 |
| 多年平均AC1时段切换 | 通过 |
| 固定分析时段标注 | 通过 |
| WMS像元查询 | 通过 |
| 动态图例 | 通过 |
| 图层透明度控制 | 通过 |
| Vite生产构建 | 通过 |

验证日期：2026年10月7日。

