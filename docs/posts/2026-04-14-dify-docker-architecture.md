---
title: Dify 1.14 Docker 服务架构解析
date: 2026-04-14
tags:
  - Dify
  - Docker
  - 向量数据库
  - LLM
  - AI 平台
description: 梳理 Dify 1.14 的 Docker Compose 服务架构，包括核心服务、可选数据库和向量数据库的 profile 切换方式。
draft: false
cover: /og/default.png
---

# Dify 1.14 Docker 服务架构解析

## 核心服务（默认启用）

| 服务 | 镜像 | 端口 | 说明 |
|------|------|------|------|
| nginx | `nginx:latest` | 80, 443 | 反向代理，统一入口 |
| web | `langgenius/dify-web:1.14.0` | 3000 | 前端 Next.js 应用 |
| api | `langgenius/dify-api:1.14.0` | 5001 | 后端 API 服务 |
| worker | `langgenius/dify-api:1.14.0` | - | Celery 异步任务执行 |
| worker_beat | `langgenius/dify-api:1.14.0` | - | Celery 定时调度 |
| db_postgres | `postgres:15-alpine` | 5432 | PostgreSQL 主数据库 |
| redis | `redis:6-alpine` | 6379 | 缓存 & Celery broker |
| sandbox | `langgenius/dify-sandbox:0.2.15` | 8194 | 代码执行沙箱 |
| ssrf_proxy | `ubuntu/squid:latest` | 3128 | SSRF 防护代理 |
| plugin_daemon | `langgenius/dify-plugin-daemon:0.6.0` | 5002, 5003 | 插件管理守护进程 |
| init_permissions | `busybox:latest` | - | 初始化文件权限（一次性） |

> 默认组合：**PostgreSQL + Redis + Nginx + Weaviate**

## 可选关系数据库（通过 profile 切换）

| Profile | 服务 | 镜像 | 端口 |
|---------|------|------|------|
| `mysql` | db_mysql | `mysql:8.0` | 3306 |
| `oceanbase` | oceanbase | `oceanbase/oceanbase-ce:4.3.5-lts` | 2881 |
| `seekdb` | seekdb | `oceanbase/seekdb:latest` | 2881 |
| `opengauss` | opengauss | `opengauss/opengauss:7.0.0-RC1` | 6600 |
| `oracle` | oracle | `container-registry.oracle.com/database/free:latest` | 1521 |
| `matrixone` | matrixone | `matrixorigin/matrixone:2.1.1` | 6001 |
| `iris` | iris | `containers.intersystems.com/intersystems/iris-community:2025.3` | 1972, 52773 |

## 可选向量数据库（通过 profile 切换）

| Profile | 服务 | 镜像 | 端口 | 说明 |
|---------|------|------|------|------|
| `weaviate` | weaviate | `semitechnologies/weaviate:1.27.0` | 8080, 50051 | 默认选项 |
| `pgvector` | pgvector | `pgvector/pgvector:pg16` | 5432 | PostgreSQL + pgvector 扩展 |
| `pgvecto-rs` | pgvecto-rs | `tensorchord/pgvecto-rs:pg16-v0.3.0` | 5432 | pgvecto.rs |
| `qdrant` | qdrant | `langgenius/qdrant:v1.8.3` | 6333 | Qdrant |
| `chroma` | chroma | `ghcr.io/chroma-core/chroma:0.5.20` | 8000 | Chroma |
| `milvus` | milvus-standalone | `milvusdb/milvus:v2.6.3` | 19530, 9091 | Milvus（含 etcd + MinIO） |
| `opensearch` | opensearch | `opensearchproject/opensearch:latest` | 9200 | OpenSearch + Dashboards |
| `elasticsearch` | elasticsearch | `docker.elastic.co/elasticsearch/elasticsearch:8.14.3` | 9200 | Elasticsearch + Kibana |
| `couchbase` | couchbase-server | 本地构建 | 8091 | Couchbase |
| `myscale` | myscale | `myscale/myscaledb:1.6.4` | 8123 | MyScale |

## 其他可选服务

| Profile | 服务 | 镜像 | 说明 |
|---------|------|------|------|
| `unstructured` | unstructured | `unstructured-io/unstructured-api:latest` | ETL 文档解析 |
| `certbot` | certbot | `certbot/certbot` | SSL 证书自动管理 |

## 服务依赖链

```
init_permissions（首次运行）
    │
    ├── redis ──────────────────────┐
    │                               │
    ├── db_postgres ────────────────┤
    │                               ├── api ──────┐
    │                               ├── worker     │
    │                               ├── worker_beat│
    │                               │              ├── nginx（统一入口）
    │                               │              │
    ├── sandbox ── ssrf_proxy       │              ├── web（前端）
    │                               │              │
    └── plugin_daemon ──────────────┘              │
                                                   │
    向量数据库（可选，按 profile 启用）──────────────┘
```

## 配置方式

在 `.env` 文件中控制：

```bash
# 启用的服务 profile
COMPOSE_PROFILES=weaviate,postgresql

# 主数据库类型
DB_TYPE=postgresql

# 向量数据库类型
VECTOR_STORE=weaviate

# 切换示例：使用 MySQL + Qdrant
# COMPOSE_PROFILES=mysql,qdrant
# DB_TYPE=mysql
# VECTOR_STORE=qdrant
```

## 数据卷

```
docker/volumes/
├── app/storage          # 用户文件和应用数据
├── db/data              # 数据库数据
├── redis/data           # Redis 持久化
├── sandbox/             # 沙箱环境
├── plugin_daemon/       # 插件存储
├── weaviate/            # Weaviate 数据
├── pgvector/            # pgvector 数据
├── milvus/              # Milvus 数据
└── certbot/             # SSL 证书
```
