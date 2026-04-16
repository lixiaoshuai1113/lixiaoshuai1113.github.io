# ACMMM2026 在投，具体名字隐藏

---

## 🚀 摘要 (Abstract)
本文提出了一个无需训练的、完全集成的多智能体框架，旨在通过自然语言驱动 Blender 进行分步式 3D 建模。本文将复杂的建模任务拆解为五个协同工作的智能体：**场景图生成器**（构建空间意图）、**代码编写器**（生成 bpy 脚本）、**代码检索器**（辅助 API 调用）、**代码验证器**（视觉反馈闭环）以及**记忆模块**（防止语义偏移）。

---

## 🌟 核心亮点 (Teaser)


![高质量生成结果](static/assets/img/langmesh/good.png)
- **闭环验证 (Closed-Loop)**：利用 VLM (Vision-Language Model) 作为验证器，实现“生成-反馈-优化”的迭代逻辑。
- **多智能体协同**：通过五大智能体各司其职，解决长程建模中的结构坍塌问题。
- **Blender 深度集成**：直接生成并执行 Python 脚本，支持工业级建模流程。

---

## 🛠️ 系统架构 (Methodology)

我们的方法通过模拟人类建模师的思维逻辑，构建了全集成的处理流水线。

![workflow](static/assets/img/langmesh/workflow.png)

### 核心组件：
1. **Scene Graph Generator**: 将模糊的语言转化为结构化的空间逻辑。
2. **Blender Code Coder**: 迭代生成可执行的 Python 脚本。
3. **Code Retriever (RAG)**：基于 RAG 技术检索准确的 API 文档，提高代码鲁棒性。
4. **VLM Code Verifier**: 模拟人类视觉，对渲染图进行检查并提出修改意见。
5. **Global Memory**: 存储历史状态，确保模型在复杂场景下不会“词不达意”。

---

## 📊 实验结果 (Results)

### 定性对比 (Qualitative Comparison)
我们的方法在语义一致性和几何结构完整性上显著优于现有的code generation建模方案。

![与其他code generation方法对比](static/assets/img/langmesh/comp.png)
![与 LL3M、BlenderLLM 对比1](static/assets/img/langmesh/compare1.png)
![与 LL3M、BlenderLLM 对比2](static/assets/img/langmesh/compare2.png)
![与 LL3M、BlenderLLM 对比3](static/assets/img/langmesh/compare3.png)
![code生成建模的布线优势（与3d方法对比）](static/assets/img/langmesh/bowl.png)
![code生成建模的布线优势](static/assets/img/langmesh/gun.png)
![公园场景](static/assets/img/langmesh/park_scene.png)
![厨房场景](static/assets/img/langmesh/kitchen_scene.png)
![教室场景](static/assets/img/langmesh/classroom_scene.png)

### 迭代过程展示 (Iterative Refinement)
通过 Code Verifier 的介入，模型能够修正最初的几何错误。

![迭代过程展示1（蛋糕）](static/assets/img/langmesh/gc2.png)
![迭代过程展示2（衣帽架）](static/assets/img/langmesh/gc1.png)
---
