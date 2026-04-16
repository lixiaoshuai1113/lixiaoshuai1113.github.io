# From Per-Timestep Deciders to Holistic Strategy Generators: Evolving Strategic Complexity in LLMs
- [2026.02] 🚀 论文扩展版（包含更多模型实验与消融实验）被ICLR 2026 Workshop AI for Mechanism Design and Strategic Decision Making录用！

- [2026.01] 🎉 论文核心版本被语音与信号处理顶会 ICASSP 2026 正式录用！
-----

## 💡 摘要 (Abstract)

传统的 LLM 博弈评估通常局限于单步或短视的交互，无法考察模型制定全局、长期策略的能力。在本项目中，我们旨在探索大语言模型在复杂博弈环境下的策略进化潜力。我们实现了从“单步决策者（Per-Timestep Deciders）”到“全局策略架构师（Holistic Strategy Generators）”的范式转变。

我们将 LLM 的角色从“棋手”转变为“策略架构师”：

1.  **策略生成**：LLM 合成完整的、可解释的 Python 策略代码。
2.  **进化演进**：通过“生成-竞争-分析-迭代”闭环，策略在竞争压力下不断进化。
3.  **涌现行为**：观察到了包括“伪装”、“诱导”和“收益收割”在内的复杂博弈行为。

-----

## 🏗️ 框架设计 (The Framework)

### 进化环路 (The Evolutionary Loop)

我们的系统采用闭环架构，确保策略逻辑在多轮迭代中不断优化。

![Framework Overview](static/assets/img/icassp/workflow.png)

### 核心机制：代码驱动与名人堂 (Code-Driven & Hall of Fame)

  * **Code-as-Strategy**: 策略以 Python 函数形式存在，具有高度的可解释性和逻辑完备性。
  * **动态名人堂 (HoF)**：引入历史最优策略池作为“稳定性锚点”，防止进化过程中的逻辑漂变。

-----

## 📈 核心研究发现 (Key Findings)

### 1\. 策略复杂度的涌现

随着进化代际的增加，LLM 生成的策略从简单的“针锋相对 (Tit-for-Tat)”进化为具有前瞻性的复杂逻辑。

![Evolution Progress](static/assets/img/icassp/result.png)


### 2\. 捕获复杂博弈行为

我们通过实验发现了 LLM 在策略逻辑中自主构建了以下行为：

  * **Disguise (伪装)**：在早期阶段表现出合作意向，掩盖其最终的剥削目的。
  * **Inducement (诱导)**：通过特定的出牌序列诱导对手进入特定的行为模式。


-----

## 🔬 实验设置 (Experimental Setup)

  * **模型阵列**：Gemini-2.5-Pro, GPT-4o, Qwen3 等。
  * **博弈场景**：迭代囚徒困境 (IPD) 及其变体。

-----