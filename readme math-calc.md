# Financial Math Lab (Calculadora de Matemática Financeira)

## 📌 Visão Geral do Projeto
Aplicação web responsiva e intuitiva contendo um catálogo interativo com calculadoras para mais de 50 fórmulas de Matemática Financeira. O usuário escolhe a fórmula na barra lateral (sidebar), insere os parâmetros exigidos e visualiza o resultado e a explicação do passo a passo em tempo real.

---

## 👨‍💻 Autoria e Propriedade Intelectual
* **Autor:** Rodrigo Caon
* **Propriedade Intelectual:** Todos os direitos de código, arquitetura, design e regras de negócio pertencem exclusivamente ao autor Rodrigo Caon.

---

## 🛠️ Tech Stack
* **Framework:** Vue.js 3 (Options API ou Composition API com `<script setup>`)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Build Tool:** Vite
* **Deploy:** Vercel

---

## 📐 Diretrizes de Arquitetura e Código

### 1. Estrutura de Pastas Esperada
```text
src/
├── assets/
├── components/
│   ├── Layout/
│   │   ├── Header.vue
│   │   └── Sidebar.vue
│   ├── Calculator/
│   │   ├── FormulaSelector.vue
│   │   ├── InputGroup.vue
│   │   └── ResultDisplay.vue
│   └── Shared/
├── math/
│   ├── simpleInterest.ts
│   ├── compoundInterest.ts
│   ├── amortization.ts
│   └── investments.ts
├── types/
│   └── formula.ts
├── views/
│   └── HomeView.vue
├── App.vue
└── main.ts