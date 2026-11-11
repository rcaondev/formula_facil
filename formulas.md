# Catálogo de Fórmulas de Matemática Financeira

## 1. Juros Simples
* **Juros (J):** $J = C \times i \times t$
* **Montante (M):** $M = C + J = C \times (1 + i \times t)$
* **Capital (C):** $C = \frac{J}{i \times t}$
* **Taxa de Juros (i):** $i = \frac{J}{C \times t}$
* **Tempo (t):** $t = \frac{J}{C \times i}$

---

## 2. Descontos Simples
* **Desconto Racional / Por Dentro ($D_r$):** $D_r = \frac{N \times i \times t}{1 + i \times t}$
* **Valor Presente Racional ($V_r$):** $V_r = \frac{N}{1 + i \times t}$
* **Desconto Comercial / Por Fora ($D_c$):** $D_c = N \times i \times t$
* **Valor Presente Comercial ($V_c$):** $V_c = N \times (1 - i \times t)$
* **Relação entre Desconto Comercial e Racional:** $D_c = D_r \times (1 + i \times t)$

---

## 3. Juros Compostos
* **Montante (M / FV):** $FV = PV \times (1 + i)^n$
* **Capital / Valor Presente (PV):** $PV = \frac{FV}{(1 + i)^n}$
* **Taxa de Juros (i):** $i = \left(\frac{FV}{PV}\right)^{\frac{1}{n}} - 1$
* **Número de Períodos (n):** $n = \frac{\ln(FV / PV)}{\ln(1 + i)}$
* **Juros Acumulados (J):** $J = PV \times ((1 + i)^n - 1)$
* **Capitalização Contínua:** $FV = PV \times e^{r \times n}$

---

## 4. Descontos Compostos
* **Desconto Racional Composto ($D_r$):** $D_r = N \times \left(1 - \frac{1}{(1 + i)^n}\right)$
* **Valor Presente Racional Composto ($V_r$):** $V_r = \frac{N}{(1 + i)^n}$
* **Desconto Comercial Composto ($D_c$):** $D_c = N \times (1 - (1 - i)^n)$
* **Valor Presente Comercial Composto ($V_c$):** $V_c = N \times (1 - i)^n$

---

## 5. Conversão e Equivalência de Taxas
* **Taxas Equivalentes (Juros Compostos):** $i_q = (1 + i_t)^{\frac{q}{t}} - 1$
* **Taxa Nominal para Efetiva:** $i_{efetiva} = \left(1 + \frac{i_{nominal}}{k}\right)^k - 1$
* **Taxa Real (Efeito Fisher):** $i_{real} = \frac{1 + i_{nominal}}{1 + i_{inflacao}} - 1$
* **Taxa Proporcional (Juros Simples):** $i_1 = i_2 \times \frac{k_1}{k_2}$
* **Taxa Efetiva da Capitalização Contínua:** $i_{efetiva} = e^{r} - 1$

---

## 6. Anuidade / Séries Uniformes de Pagamento (PMT)
* **Valor Futuro de Anuidade Postecipada ($FV$):** $FV = PMT \times \frac{(1 + i)^n - 1}{i}$
* **Valor Presente de Anuidade Postecipada ($PV$):** $PV = PMT \times \frac{1 - (1 + i)^{-n}}{i}$
* **Parcela Postecipada (PMT via PV):** $PMT = PV \times \frac{i}{1 - (1 + i)^{-n}}$
* **Parcela Postecipada (PMT via FV):** $PMT = FV \times \frac{i}{(1 + i)^n - 1}$
* **Valor Futuro de Anuidade Antecipada ($FV_{ant}$):** $FV_{ant} = FV_{post} \times (1 + i)$
* **Valor Presente de Anuidade Antecipada ($PV_{ant}$):** $PV_{ant} = PV_{post} \times (1 + i)$
* **Perpetuidade Simples:** $PV = \frac{PMT}{i}$
* **Perpetuidade com Crescimento (Gordon):** $PV = \frac{PMT}{i - g}$
* **Número de Parcelas:** $n = \frac{-\ln\left(1 - \frac{PV \times i}{PMT}\right)}{\ln(1 + i)}$
* **Valor Presente de Anuidade Diferida (carência m):** $PV = PMT \times \frac{1 - (1 + i)^{-n}}{i} \times \frac{1}{(1 + i)^m}$

---

## 7. Sistemas de Amortização
* **Tabela Price — Prestação (PMT):** $PMT = PV \times \frac{i}{1 - (1 + i)^{-n}}$
* **Tabela Price — Juros no período k ($J_k$):** $J_k = Saldo_{k-1} \times i$
* **Tabela Price — Amortização no período k ($A_k$):** $A_k = PMT - J_k$
* **SAC — Amortização Constante (A):** $A = \frac{PV}{n}$
* **SAC — Juros no período k ($J_k$):** $J_k = (PV - (k - 1) \times A) \times i$
* **SAC — Prestação no período k ($P_k$):** $P_k = A + J_k$
* **SAM — Sistema de Amortização Misto ($P_{SAM}$):** $P_{SAM} = \frac{P_{Price} + P_{SAC}}{2}$

---

## 8. Análise de Investimentos
* **Valor Presente Líquido (VPL / NPV):** $VPL = \sum_{t=1}^{n} \frac{FC_t}{(1 + i)^t} - FC_0$
* **Taxa Interna de Retorno (TIR / IRR):** $0 = \sum_{t=0}^{n} \frac{FC_t}{(1 + TIR)^t}$
* **Payback Descontado:** Ponto $t$ onde $\sum_{k=1}^{t} \frac{FC_k}{(1 + i)^k} = FC_0$
* **Índice de Lucratividade (IL):** $IL = \frac{\sum_{t=1}^{n} \frac{FC_t}{(1 + i)^t}}{FC_0}$
* **Payback Simples:** Ponto $t$ onde $\sum_{k=1}^{t} FC_k = FC_0$
* **Retorno sobre Investimento (ROI):** $ROI = \frac{V_{final} - V_{inicial}}{V_{inicial}}$

---

## 9. Inflação e Depreciação
* **Correção Monetária:** $V_{corrigido} = V_{nominal} \times (1 + \text{Taxa Inflação})$
* **Valor Real (Deflacionar):** $V_{real} = \frac{V_{nominal}}{1 + \pi}$
* **Depreciação Linear:** $D_{anual} = \frac{\text{Custo} - \text{Valor Residual}}{\text{Vida Útil}}$
* **Depreciação Soma dos Dígitos (SOYD):** $D_k = (\text{Custo} - \text{Valor Residual}) \times \frac{\text{Anos Restantes}}{\sum \text{Dígitos}}$
* **Depreciação Exponencial (Saldo Decrescente):** $V_n = \text{Custo} \times (1 - d)^n$
