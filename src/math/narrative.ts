/**
 * Explicações didáticas para cada tipo de passo do "passo a passo".
 * O rótulo curto do passo (ex.: "Fator de acumulação") vira um título,
 * e este texto explica o porquê daquele passo, em linguagem simples.
 */

interface Ctx {
  /** Nome do que está sendo calculado (ex.: "Valor futuro") */
  result: string
  isLast: boolean
}

const fixed: Record<string, string> = {
  'Taxa na forma decimal':
    'As fórmulas trabalham com a taxa em número decimal, não em percentual. Por isso dividimos o percentual por 100: 2% vira 0,02.',
  'Taxas na forma decimal':
    'Antes de fazer contas, cada taxa sai do formato percentual e vira decimal (divide por 100). Assim elas podem ser somadas, multiplicadas e divididas direto.',
  'Substituindo os valores':
    'Agora trocamos cada letra da fórmula pelo valor que você informou. Nada é calculado ainda: só montamos a conta.',
  'Fator de acumulação':
    'Este fator mostra em quanto cada R$ 1 se transforma ao fim do prazo. Multiplicar o capital por ele dá o valor acumulado.',
  'Fator de acumulação da série':
    'Cada depósito rende por um tempo diferente: o primeiro rende mais, o último quase nada. Este fator soma todos esses rendimentos de uma vez.',
  'Fator de valor presente da série':
    'Cada parcela futura vale menos hoje, e quanto mais distante, menos vale. Este fator soma o valor de hoje de todas as parcelas de R$ 1.',
  'Fator de recuperação de capital':
    'É o inverso do fator de valor presente: diz quanto pagar por período para devolver R$ 1 emprestado hoje, já com juros.',
  'Fator de formação de capital':
    'Diz quanto depositar por período para juntar R$ 1 no futuro, contando com os juros que os depósitos vão render.',
  'Fator de desconto':
    'Descontar é o caminho inverso de render: dividimos pelo crescimento que o dinheiro teria nesse tempo para trazer o valor até hoje.',
  'Fator de correção':
    'Somamos 1 à inflação para saber quanto os preços mudaram: com 4,5% de inflação, o que custava R$ 1 passa a custar R$ 1,045.',
  'Fator de permanência':
    'Se o bem perde a fração d por ano, ele mantém (1 − d) do valor a cada ano. Elevando à quantidade de anos, temos quanto ainda resta.',
  'Exponencial':
    'Na capitalização contínua, o crescimento é dado pela função exponencial: o número e (≈ 2,71828) elevado à taxa.',
  'Expoente':
    'Primeiro calculamos o expoente: taxa vezes tempo. Ele resume quanto crescimento acontece no período inteiro.',
  'Raiz de ordem n':
    'Para descobrir a taxa de um período, desfazemos a potência: a raiz de ordem n "divide" o crescimento total igualmente entre os períodos.',
  'Razão entre os valores':
    'Comparamos os dois valores em forma de divisão. O resultado mostra quantas vezes um é maior que o outro.',
  'Logaritmo da razão':
    'O logaritmo transforma "quantas vezes multiplicar" em um número comum. É o que permite tirar o n do expoente.',
  'Logaritmo do fator':
    'Fazemos o mesmo com o crescimento de um único período. Dividindo um logaritmo pelo outro, descobrimos quantos períodos cabem.',
  'Simplificando':
    'Agrupamos os termos para deixar a conta mais curta antes do resultado final.',
  'Série postecipada':
    'Primeiro calculamos a série como se os pagamentos acontecessem no fim de cada período (o caso padrão). Depois ajustamos.',
  'Prestação Price':
    'Na Tabela Price, todas as prestações são iguais. Calculamos esse valor fixo primeiro.',
  'Prestação':
    'A prestação é a soma de duas partes: os juros do período e a parcela que efetivamente abate a dívida (amortização).',
  'Amortização constante':
    'No SAC, a dívida é dividida em partes iguais. Cada prestação abate sempre o mesmo valor, e por isso os juros caem com o tempo.',
  'Juros do período':
    'Os juros de cada período incidem só sobre o que ainda se deve (o saldo devedor), não sobre o valor original.',
  'Juros do primeiro período':
    'No primeiro período, os juros incidem sobre a dívida inteira. A parcela precisa ser maior que isso, senão a dívida nunca diminui.',
  'Saldo devedor anterior':
    'Antes de calcular os juros, precisamos saber quanto ainda se devia no início do período.',
  'Saldo antes da parcela':
    'Este é o saldo devedor logo antes do pagamento consultado.',
  'Valor depreciável':
    'Só a parte do custo que o bem vai de fato perder é depreciada: o custo menos o valor que ele ainda terá no fim (valor residual).',
  'Soma dos dígitos':
    'Somamos os anos de vida útil (1 + 2 + … + n). Essa soma é o denominador que reparte a depreciação entre os anos.',
  'Fluxos descontados':
    'Cada fluxo futuro é trazido a valor de hoje, dividindo pelo crescimento que o dinheiro teria até a data dele.',
  'Soma dos valores presentes':
    'Somando os valores de hoje de todos os fluxos, temos quanto o projeto vale hoje, sem o investimento inicial.',
  'Valor que falta recuperar':
    'Até o período anterior, o investimento ainda não tinha se pagado. Esta é a diferença que ainda falta.',
  'Ganho líquido':
    'O ganho é quanto você resgatou a mais do que colocou.',
  'Equação a resolver':
    'A TIR é a taxa que faz o valor de hoje das entradas ser exatamente igual ao investimento, ou seja, que zera o VPL.',
  'Solução numérica (bisseção)':
    'Não existe fórmula fechada para a TIR. Testamos taxas, cortando o intervalo ao meio a cada tentativa, até zerar o VPL com precisão.',
  'Verificação':
    'Conferimos: usando a TIR encontrada como taxa, o VPL deve dar praticamente zero.',
  'Taxa por subperíodo':
    'A taxa nominal é dividida igualmente entre os subperíodos de capitalização (por exemplo, 12% ao ano capitalizados mensalmente = 1% ao mês).',
}

const patterns: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Acumulado descontado até o período (\d+)$/, (m) => `Somamos os fluxos descontados até o período ${m[1]}. É quanto já foi recuperado, em valor de hoje.`],
  [/^Acumulado até o período (\d+)$/, (m) => `Somamos os fluxos, sem desconto, até o período ${m[1]}. É quanto já voltou para o caixa.`],
  [/^Fração do período (\d+)$/, (m) => `O que falta é recuperado durante o período ${m[1]}. Dividindo o que falta pelo fluxo desse período, descobrimos que fração dele é necessária.`],
  [/^Anos restantes no ano (\d+)$/, (m) => `No ano ${m[1]}, contamos quantos anos de vida útil ainda restam, incluindo o próprio ano. Quanto mais cedo, maior esse número e maior a depreciação.`],
  [/^Prestação SAC no período (\d+)$/, (m) => `Calculamos a prestação do SAC no período ${m[1]}: amortização fixa mais os juros sobre o saldo daquele momento.`],
]

export function explainStep(label: string, ctx: Ctx): string {
  if (label === 'Resultado') {
    return `Fazendo as contas, chegamos a ${ctx.result.charAt(0).toLowerCase() + ctx.result.slice(1)}. Este é o valor final.`
  }
  if (fixed[label]) return fixed[label]
  for (const [re, fn] of patterns) {
    const m = label.match(re)
    if (m) return fn(m)
  }
  return ctx.isLast ? 'Este é o resultado final do cálculo.' : 'Calculamos este valor intermediário, que será usado no próximo passo.'
}
