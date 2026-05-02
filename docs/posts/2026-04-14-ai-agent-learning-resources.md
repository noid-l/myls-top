---
title: AI Agent 开发者学习路径整理
date: 2026-04-14
tags:
  - AI Agent
  - Dify
  - LangChain
  - LangGraph
  - 向量数据库
  - RAG
description: 面向开发者的 AI Agent 学习路径，覆盖 Agent 基础、Dify 平台、LangChain/LangGraph 框架和向量数据库选型，含推荐学习顺序和最小实践路线。
draft: false
cover: /og/default.png
---

# AI Agent 开发者学习路径整理

整理了面向开发者的 AI Agent 学习路径，重点覆盖 AI Agent 基础、Dify、LangChain / LangGraph、向量数据库 / RAG。

原则：优先官方文档，优先能长期有效的资料，先学最小闭环，再学复杂架构。

## 一、推荐学习顺序

### 第 1 阶段：先理解 Agent 最小闭环

先搞清楚：

```
Agent = LLM 大脑 + Tools 工具 + State 状态 + Memory 记忆 + Workflow/Planning + Evaluation
```

建议先学：

1. 模型如何调用工具
2. 工具结果如何回传给模型
3. 多步任务怎么循环执行
4. 如何判断任务结束或失败重试

核心资料：

- [OpenAI Platform Docs](https://platform.openai.com/docs)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

### 第 2 阶段：学 Dify 这类低门槛平台

目标：快速理解工作流、知识库、Agent、工具调用这些概念在产品里的形态。

核心资料：

- [Dify Docs](https://docs.dify.ai)
- [Dify GitHub](https://github.com/langgenius/dify)
- [Dify 官网](https://dify.ai)

建议顺序：

1. 先看 Getting Started / Concepts
2. 再跑一个简单应用
3. 再看 Workflow
4. 再看 Knowledge Base / RAG
5. 最后看 Agent / Tools / API / 部署

### 第 3 阶段：学 LangChain / LangGraph

目标：从"平台使用者"进阶为"自己搭系统的人"。

核心资料：

- [LangChain Docs](https://python.langchain.com/)
- [LangChain Concepts](https://python.langchain.com/docs/concepts/)
- [LangChain Tutorials](https://python.langchain.com/docs/tutorials/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LangGraph Tutorials](https://langchain-ai.github.io/langgraph/tutorials/)
- [LangSmith Docs](https://docs.smith.langchain.com/)

建议顺序：

1. 先学 LangChain 基础：documents / splitters / embeddings / vectorstores / retrievers
2. 做一个最小 RAG
3. 再学 LangGraph 的状态图和工作流
4. 最后学评测和可观测性

### 第 4 阶段：学向量库 / RAG

目标：搞清楚 RAG 真正的关键不在"接了没"，而在"检索质量好不好"。

建议先学：embeddings → chunking → indexing → retrieval → reranking → eval

核心资料：

- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [LangChain Text Splitters](https://python.langchain.com/docs/concepts/text_splitters/)
- [LangChain Vectorstores](https://python.langchain.com/docs/concepts/vectorstores/)
- [LangChain Retrievers](https://python.langchain.com/docs/concepts/retrievers/)

## 二、Dify 学习清单

### 建议重点学习模块

1. App Types / Create an App
2. Workflow
3. Knowledge Base / Dataset
4. Agent
5. Tools / Plugins
6. API Reference
7. Deployment / Self-hosting
8. Model Providers

### 实践学习顺序

- 第 1 天：读概念和产品定位
- 第 2 天：跑起来一个最简单应用
- 第 3 天：做一个 Workflow
- 第 4 天：做一个 Knowledge Base / RAG 应用
- 第 5 天：试 Agent / Tools
- 第 6-7 天：看 API 和部署

### 学 Dify 时要重点问自己

- Agent 和 Workflow 的边界是什么？
- 什么场景适合知识库，什么场景不适合？
- 检索失败时系统怎么退化？
- 什么时候应该用平台，什么时候应该自己写代码？

## 三、LangChain / LangGraph 学习清单

### 先学 LangChain 的这些概念

- Documents
- Text Splitters
- Embeddings
- VectorStores
- Retrievers
- Prompt + Context 组合

### 再学 LangGraph 的这些概念

- state
- nodes / edges
- branching
- retries / fallback
- human-in-the-loop
- memory / persistence

### 推荐路线

1. 用 LangChain 做一个最小 RAG
2. 用另一个向量库重做一遍
3. 再用 LangGraph 改造成可控工作流
4. 最后加评测和 trace

## 四、向量数据库选型

### 先理解怎么选，不要先比谁"最强"

| 向量库 | 适合场景 | 特点 | 文档 |
|--------|----------|------|------|
| Chroma | 最快本地原型 | 轻量、简单、上手最快 | [Docs](https://docs.trychroma.com/) |
| Qdrant | 自托管、生产可用 | 很多团队的实用默认选项 | [Docs](https://qdrant.tech/documentation/) |
| pgvector | 已有 PostgreSQL 的团队 | 少一个独立基础设施组件 | [GitHub](https://github.com/pgvector/pgvector) |
| Pinecone | 快速上生产、减少运维 | 托管方便，但有平台成本 | [Docs](https://docs.pinecone.io/) |
| Milvus | 更大规模向量检索 | 能力强，但运维更重 | [Docs](https://milvus.io/docs) |
| Weaviate | 更丰富 schema / hybrid search | 功能全面，概念稍多 | [Docs](https://docs.weaviate.io/) |

### 实用建议

- 第一个原型：Chroma
- 自托管生产学习：Qdrant
- 已有 Postgres 团队：pgvector
- 快速托管上线：Pinecone
- 大规模向量平台：Milvus
- 想玩更丰富检索特性：Weaviate

## 五、最小实践路线

### 路线 A：平台优先

1. 先学 Dify
2. 做 1 个 Workflow
3. 做 1 个知识库问答
4. 做 1 个带工具的 Agent

### 路线 B：代码优先

1. 用 LangChain 做最小 RAG
2. 接 Chroma / Qdrant
3. 做 query → retrieve → answer
4. 再用 LangGraph 做状态化流程

### 路线 C：Agent 工程优先

1. 学 Tool Use
2. 学 Planner / Router / Reflection
3. 学 Memory
4. 学 Evaluation
5. 再做多 Agent

## 六、建议的最优起步顺序

如果你是"想真正学会，不只是会点点页面"：

1. 先看 OpenAI Docs / Cookbook 理解 Agent 最小闭环
2. 再学 Dify，快速建立产品感觉
3. 再学 LangChain，自己写最小 RAG
4. 再学 LangGraph，把链条变成工作流
5. 再深入向量库与评测

## 七、容易踩坑的地方

- 一上来就多 Agent
- 一上来就上长期记忆
- 没有评测就调 prompt
- 没搞懂 chunking / retrieval 就开始怪模型不行
- 把"系统复杂"误以为"能力更强"
