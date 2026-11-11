/** Descrição conceitual de cada fórmula: a ideia, quando usar e um exemplo. */
export interface Concept {
  ideia: string
  quandoUsar: string
  exemplo: string
}

export const concepts: Record<string, Concept> = {
  // ---------------- Juros Simples ----------------
  'js-juros': {
    ideia: 'No regime simples, os juros de cada período são calculados sempre sobre o capital inicial. Os juros não rendem juros, então crescem em linha reta com o tempo.',
    quandoUsar: 'Operações de curto prazo, cheque especial calculado pro rata, multas e juros de mora, e exercícios que pedem explicitamente juros simples.',
    exemplo: 'R$ 10.000 a 2% ao mês por 12 meses geram R$ 2.400 de juros (R$ 200 por mês, todo mês).',
  },
  'js-montante': {
    ideia: 'Montante é o total que você tem no fim: o capital mais os juros. No regime simples, ele cresce a mesma quantia a cada período.',
    quandoUsar: 'Para saber quanto resgatar ou quanto pagar ao final de uma operação com juros simples.',
    exemplo: 'R$ 10.000 a 2% ao mês por 12 meses viram R$ 12.400.',
  },
  'js-capital': {
    ideia: 'É a fórmula dos juros "de trás para frente": em vez de calcular os juros, descobre quanto é preciso aplicar para obter certo valor de juros.',
    quandoUsar: 'Planejamento: "quanto preciso investir para ganhar X de juros nesse prazo?"',
    exemplo: 'Para ganhar R$ 2.400 em 12 meses a 2% ao mês, é preciso aplicar R$ 10.000.',
  },
  'js-taxa': {
    ideia: 'Descobre a taxa por período que explica um rendimento observado, supondo crescimento linear.',
    quandoUsar: 'Comparar operações que informam só o valor ganho, ou conferir a taxa cobrada num empréstimo simples.',
    exemplo: 'R$ 10.000 que renderam R$ 2.400 em 12 meses equivalem a 2% ao mês.',
  },
  'js-tempo': {
    ideia: 'Descobre quantos períodos são necessários para um capital gerar certo valor de juros a uma taxa fixa.',
    quandoUsar: 'Para saber por quanto tempo deixar o dinheiro aplicado, ou há quanto tempo uma dívida está correndo.',
    exemplo: 'R$ 10.000 a 2% ao mês levam 12 meses para render R$ 2.400.',
  },

  // ---------------- Descontos Simples ----------------
  'ds-desconto-racional': {
    ideia: 'Desconto "por dentro": a taxa incide sobre o valor atual (o valor pago hoje), não sobre o valor de face. É o desconto matematicamente justo, o inverso exato dos juros simples.',
    quandoUsar: 'Quitar uma dívida antes do vencimento ou calcular o valor justo de um título com juros simples.',
    exemplo: 'Um título de R$ 10.000 descontado 3 meses antes, a 2% ao mês, tem desconto de R$ 566,04.',
  },
  'ds-vp-racional': {
    ideia: 'É quanto vale hoje um valor futuro, desfazendo os juros simples. Aplicado à mesma taxa, ele volta a ser exatamente o valor de face no vencimento.',
    quandoUsar: 'Saber quanto pagar hoje por um título ou dívida que vence no futuro.',
    exemplo: 'R$ 10.000 a receber em 3 meses, a 2% ao mês, valem hoje R$ 9.433,96.',
  },
  'ds-desconto-comercial': {
    ideia: 'Desconto "por fora": a taxa incide sobre o valor de face (nominal). É mais simples e dá um desconto maior que o racional, por isso é o preferido pelos bancos.',
    quandoUsar: 'Desconto de duplicatas, notas promissórias e boletos em bancos, que normalmente usam o desconto comercial.',
    exemplo: 'Uma duplicata de R$ 10.000 descontada 3 meses antes, a 2% ao mês, tem desconto de R$ 600.',
  },
  'ds-vp-comercial': {
    ideia: 'Valor que o banco libera ao descontar um título por fora: o valor de face menos o desconto comercial.',
    quandoUsar: 'Saber quanto entra no caixa ao antecipar um recebível com desconto comercial.',
    exemplo: 'Uma duplicata de R$ 10.000, 3 meses antes do vencimento a 2% ao mês, libera R$ 9.400.',
  },
  'ds-relacao': {
    ideia: 'O desconto comercial é sempre o desconto racional "capitalizado" pelo prazo, ou seja, maior que ele. A diferença entre os dois são os juros sobre o próprio desconto.',
    quandoUsar: 'Converter um tipo de desconto no outro, ou mostrar quanto o desconto por fora custa a mais.',
    exemplo: 'Desconto racional de R$ 566,04 a 2% ao mês por 3 meses equivale a desconto comercial de R$ 600.',
  },

  // ---------------- Juros Compostos ----------------
  'jc-montante': {
    ideia: 'No regime composto, os juros de cada período entram no capital e passam a render também: são os "juros sobre juros". O crescimento é exponencial.',
    quandoUsar: 'Praticamente todo o mercado: investimentos, poupança, financiamentos, cartão de crédito.',
    exemplo: 'R$ 10.000 a 1% ao mês por 12 meses viram R$ 11.268,25. Com juros simples seriam R$ 11.200.',
  },
  'jc-valor-presente': {
    ideia: 'Traz um valor futuro para hoje, desfazendo os juros compostos. Responde: "quanto esse dinheiro do futuro vale agora?"',
    quandoUsar: 'Comparar valores em datas diferentes, precificar títulos e saber quanto aplicar hoje para atingir uma meta.',
    exemplo: 'Para ter R$ 11.268,25 daqui a 12 meses a 1% ao mês, basta aplicar R$ 10.000 hoje.',
  },
  'jc-taxa': {
    ideia: 'Descobre a taxa por período que faz um valor inicial chegar a um valor final. A raiz de ordem n distribui o crescimento total igualmente entre os períodos.',
    quandoUsar: 'Medir a rentabilidade real de uma aplicação, ou descobrir a taxa embutida num financiamento.',
    exemplo: 'R$ 10.000 que viraram R$ 12.682,42 em 12 meses renderam 2% ao mês.',
  },
  'jc-periodos': {
    ideia: 'Descobre quanto tempo leva para um valor crescer até outro. Como o tempo fica no expoente, usamos logaritmos para tirá-lo de lá.',
    quandoUsar: 'Planejamento de metas: "em quanto tempo meu dinheiro dobra?"',
    exemplo: 'A 1% ao mês, um capital dobra em cerca de 69,7 meses (quase 6 anos).',
  },
  'jc-juros': {
    ideia: 'Separa só a parte dos juros no regime composto: o montante menos o capital inicial.',
    quandoUsar: 'Saber quanto foi efetivamente ganho (ou pago) de juros, por exemplo para calcular imposto sobre o rendimento.',
    exemplo: 'R$ 10.000 a 1% ao mês por 12 meses rendem R$ 1.268,25 de juros.',
  },
  'jc-continua': {
    ideia: 'É o limite dos juros compostos quando a capitalização fica cada vez mais frequente (diária, por hora, por segundo…). O crescimento passa a ser dado pela função exponencial eˣ.',
    quandoUsar: 'Modelos teóricos, precificação de derivativos (Black-Scholes) e comparação de taxas em finanças acadêmicas.',
    exemplo: 'R$ 10.000 a 1% ao mês contínuos, por 12 meses, viram R$ 11.274,97, um pouco mais que nos juros compostos mensais.',
  },

  // ---------------- Descontos Compostos ----------------
  'dc-desconto-racional': {
    ideia: 'Desconto "por dentro" no regime composto: é a diferença entre o valor de face e o seu valor presente a juros compostos. É o inverso exato da capitalização.',
    quandoUsar: 'Antecipar dívidas e títulos de longo prazo, que normalmente usam juros compostos.',
    exemplo: 'Um título de R$ 10.000 descontado 3 meses antes, a 2% ao mês, tem desconto de R$ 576,78.',
  },
  'dc-vp-racional': {
    ideia: 'Valor atual de um título no regime composto. É a mesma conta do valor presente (PV) dos juros compostos.',
    quandoUsar: 'Precificar títulos prefixados (como o Tesouro Prefixado) e quitar financiamentos antecipadamente.',
    exemplo: 'R$ 10.000 a receber em 3 meses, a 2% ao mês, valem hoje R$ 9.423,22.',
  },
  'dc-desconto-comercial': {
    ideia: 'Desconto "por fora" composto: a cada período, a taxa é aplicada sobre o valor que restou do período anterior. É pouco usado na prática, mas aparece em provas e concursos.',
    quandoUsar: 'Exercícios acadêmicos e algumas operações específicas que contratam esse regime.',
    exemplo: 'Um título de R$ 10.000, 3 meses antes do vencimento a 2% ao mês, tem desconto de R$ 588,08.',
  },
  'dc-vp-comercial': {
    ideia: 'Valor liberado no desconto comercial composto: o valor de face reduzido pela taxa, período a período.',
    quandoUsar: 'Complementa o desconto comercial composto: é quanto efetivamente se recebe.',
    exemplo: 'Um título de R$ 10.000, 3 meses antes do vencimento a 2% ao mês, libera R$ 9.411,92.',
  },

  // ---------------- Conversão de Taxas ----------------
  'tx-equivalente': {
    ideia: 'Taxas equivalentes produzem o mesmo montante no mesmo prazo, mesmo com períodos diferentes. Nos juros compostos, a conversão é feita com potência, não com divisão.',
    quandoUsar: 'Comparar uma taxa mensal com uma anual (ex.: rendimento de um CDB × financiamento) ou converter a taxa para o período da operação.',
    exemplo: '1% ao mês equivale a 12,68% ao ano, não a 12%.',
  },
  'tx-nominal-efetiva': {
    ideia: 'Taxa nominal é a "anunciada", com capitalização em períodos menores (ex.: 12% ao ano capitalizados mensalmente). A taxa efetiva é o quanto realmente se ganha ou paga no período.',
    quandoUsar: 'Interpretar contratos e anúncios que informam taxa nominal, como financiamentos e a própria poupança.',
    exemplo: '12% ao ano com capitalização mensal correspondem a 12,68% ao ano efetivos.',
  },
  'tx-real': {
    ideia: 'A taxa real mede o ganho de poder de compra: quanto o dinheiro rendeu acima da inflação. Não é uma subtração simples; a relação é de divisão (equação de Fisher).',
    quandoUsar: 'Avaliar se um investimento realmente enriqueceu você, ou comparar rendimentos em épocas de inflação diferente.',
    exemplo: 'Rendimento de 12% com inflação de 4,5% dá ganho real de 7,18%, não de 7,5%.',
  },
  'tx-proporcional': {
    ideia: 'No regime simples, as taxas são proporcionais ao tempo: basta multiplicar ou dividir pela razão entre os prazos.',
    quandoUsar: 'Converter taxas em operações de juros simples, ou achar a taxa por subperíodo a partir de uma taxa nominal.',
    exemplo: '24% ao ano equivalem a 2% ao mês no regime simples.',
  },
  'tx-continua': {
    ideia: 'Converte uma taxa de capitalização contínua na taxa efetiva do mesmo período, para que possa ser comparada com taxas comuns.',
    quandoUsar: 'Traduzir taxas de modelos teóricos (como em opções e derivativos) para a linguagem do dia a dia.',
    exemplo: 'Uma taxa contínua de 10% ao ano equivale a 10,52% ao ano efetivos.',
  },

  // ---------------- Séries Uniformes ----------------
  'an-fv-postecipada': {
    ideia: 'Soma o valor futuro de vários depósitos iguais feitos no fim de cada período. Cada depósito rende por um tempo diferente, e o fator resume tudo isso.',
    quandoUsar: 'Planejar aposentadoria, reserva de emergência ou qualquer meta com aportes mensais fixos.',
    exemplo: 'Depositar R$ 500 por mês durante 12 meses, a 1% ao mês, acumula R$ 6.341,25.',
  },
  'an-pv-postecipada': {
    ideia: 'Diz quanto vale hoje uma sequência de pagamentos iguais no futuro. É o "preço à vista" de uma compra parcelada.',
    quandoUsar: 'Comparar preço à vista com parcelado, e avaliar se vale a pena antecipar parcelas.',
    exemplo: '12 parcelas de R$ 500 a 1% ao mês valem R$ 5.627,54 à vista.',
  },
  'an-pmt-pv': {
    ideia: 'Calcula a parcela fixa que quita uma dívida com juros. É a conta de qualquer financiamento com prestação constante.',
    quandoUsar: 'Simular empréstimos, financiamento de veículos e compras parceladas com juros.',
    exemplo: 'Financiar R$ 10.000 em 12 vezes a 1% ao mês dá parcelas de R$ 888,49.',
  },
  'an-pmt-fv': {
    ideia: 'Calcula o depósito fixo necessário para juntar um valor no futuro, contando com os juros que os depósitos vão render.',
    quandoUsar: 'Planejamento financeiro: "quanto guardar por mês para ter X em tal data?"',
    exemplo: 'Para juntar R$ 10.000 em 12 meses a 1% ao mês, deposite R$ 788,49 por mês.',
  },
  'an-fv-antecipada': {
    ideia: 'Igual à série postecipada, mas cada depósito acontece no início do período. Assim, cada um rende um período a mais.',
    quandoUsar: 'Aportes feitos logo no começo do mês, como um investimento automático no dia do salário.',
    exemplo: 'R$ 500 no início de cada mês, por 12 meses a 1% ao mês, acumulam R$ 6.404,66.',
  },
  'an-pv-antecipada': {
    ideia: 'Valor à vista de uma série cujo primeiro pagamento é imediato: o famoso "1 + n", com entrada.',
    quandoUsar: 'Compras parceladas com entrada, aluguéis pagos adiantados e mensalidades pagas no início do mês.',
    exemplo: '12 pagamentos de R$ 500 (o primeiro hoje) a 1% ao mês valem R$ 5.683,81 à vista.',
  },
  'an-perpetuidade': {
    ideia: 'Uma série de pagamentos que nunca termina ainda tem valor finito, porque os pagamentos distantes valem quase nada hoje. O valor é simplesmente o pagamento dividido pela taxa.',
    quandoUsar: 'Avaliar imóveis de aluguel, ações que pagam dividendos estáveis e fundos patrimoniais.',
    exemplo: 'Um aluguel de R$ 2.000 por mês, com taxa de 0,5% ao mês, vale R$ 400.000.',
  },
  'an-gordon': {
    ideia: 'Perpetuidade em que o pagamento cresce a uma taxa constante g. É o modelo de Gordon, base da avaliação de ações por dividendos. Só funciona se a taxa de desconto for maior que o crescimento.',
    quandoUsar: 'Avaliar ações (valor justo por dividendos) e o valor terminal de empresas no fluxo de caixa descontado.',
    exemplo: 'Dividendo de R$ 5 crescendo 4% ao ano, com retorno exigido de 12%, vale R$ 62,50.',
  },
  'an-n-parcelas': {
    ideia: 'Descobre quantas parcelas fixas são necessárias para quitar uma dívida. Se a parcela não cobrir nem os juros do período, a dívida nunca acaba.',
    quandoUsar: 'Saber quanto tempo leva para quitar um empréstimo pagando um valor fixo por mês.',
    exemplo: 'Uma dívida de R$ 10.000 a 1% ao mês, pagando R$ 888,49 por mês, é quitada em 12 parcelas.',
  },
  'an-diferida': {
    ideia: 'Série que começa só depois de uma carência. Calcula-se o valor da série no início dos pagamentos e depois desconta-se o período de carência até hoje.',
    quandoUsar: 'Financiamentos estudantis, crédito com carência e planos com "primeira parcela daqui a X meses".',
    exemplo: '12 parcelas de R$ 500 a 1% ao mês, começando após 3 meses de carência, valem cerca de R$ 5.462 hoje.',
  },

  // ---------------- Sistemas de Amortização ----------------
  'am-price-pmt': {
    ideia: 'Na Tabela Price (sistema francês), todas as prestações são iguais. No começo a parcela é quase toda juros; com o tempo, a amortização ganha espaço.',
    quandoUsar: 'Financiamento de veículos, crédito pessoal e consignado, que quase sempre usam Price.',
    exemplo: 'R$ 100.000 em 12 vezes a 1% ao mês: prestação fixa de R$ 8.884,88.',
  },
  'am-price-juros': {
    ideia: 'Os juros de cada prestação Price incidem sobre o saldo devedor daquele momento. Como o saldo cai, os juros caem a cada mês.',
    quandoUsar: 'Saber quanto de uma parcela específica é só custo (juros), por exemplo para fins contábeis ou de imposto.',
    exemplo: 'No financiamento de R$ 100.000 a 1% ao mês, a 1ª parcela tem R$ 1.000 de juros.',
  },
  'am-price-amortizacao': {
    ideia: 'É a parte da prestação que efetivamente reduz a dívida: a prestação menos os juros. Na Price, ela cresce a cada período.',
    quandoUsar: 'Acompanhar quanto da dívida já foi quitado, ou planejar uma amortização extra.',
    exemplo: 'Na 1ª parcela de R$ 8.884,88, R$ 7.884,88 abatem a dívida.',
  },
  'am-sac-amortizacao': {
    ideia: 'No Sistema de Amortização Constante (SAC), a dívida é dividida em partes iguais. Cada prestação abate sempre o mesmo valor.',
    quandoUsar: 'Financiamentos imobiliários no Brasil, que costumam usar SAC.',
    exemplo: 'R$ 100.000 em 12 parcelas: amortização fixa de R$ 8.333,33 por mês.',
  },
  'am-sac-juros': {
    ideia: 'Como a amortização é fixa, o saldo devedor cai em linha reta, e os juros também caem o mesmo valor a cada período.',
    quandoUsar: 'Calcular os juros de uma parcela específica do financiamento SAC.',
    exemplo: 'R$ 100.000 em 12 vezes a 1% ao mês: juros de R$ 1.000 na 1ª parcela e de R$ 83,33 na última.',
  },
  'am-sac-prestacao': {
    ideia: 'A prestação SAC é amortização fixa mais juros decrescentes. Por isso as parcelas começam altas e diminuem com o tempo.',
    quandoUsar: 'Saber o valor de uma parcela específica de um financiamento SAC.',
    exemplo: 'R$ 100.000 em 12 vezes a 1% ao mês: 1ª parcela de R$ 9.333,33, caindo até R$ 8.416,67.',
  },
  'am-sam': {
    ideia: 'O Sistema de Amortização Misto (SAM) usa como prestação a média da Price com a SAC. Fica no meio-termo entre os dois.',
    quandoUsar: 'Contratos que adotam o SAM, como alguns financiamentos habitacionais antigos (SFH), e exercícios de comparação.',
    exemplo: 'R$ 100.000 em 12 vezes a 1% ao mês: 1ª parcela de R$ 9.109,11.',
  },

  // ---------------- Análise de Investimentos ----------------
  'inv-vpl': {
    ideia: 'O VPL traz todos os fluxos futuros para hoje, usando a taxa mínima que você exige, e subtrai o investimento. Positivo: o projeto cria valor além dessa taxa.',
    quandoUsar: 'É o principal critério para decidir entre projetos, compras de máquinas, expansões e aquisições.',
    exemplo: 'Investir R$ 10.000 para receber 3, 4, 5 e 4 mil nos próximos anos, a 10% ao ano, dá VPL de R$ 2.521,69.',
  },
  'inv-tir': {
    ideia: 'A TIR é a taxa de retorno "embutida" no projeto: a taxa que zera o VPL. Se ela supera a sua taxa mínima, o projeto vale a pena.',
    quandoUsar: 'Comparar o retorno de um projeto com o custo do dinheiro (financiamento, CDI, custo de capital).',
    exemplo: 'No projeto de R$ 10.000 com entradas de 3, 4, 5 e 4 mil, a TIR passa de 10%, por isso o VPL a 10% é positivo.',
  },
  'inv-payback': {
    ideia: 'Tempo para recuperar o investimento considerando o valor do dinheiro no tempo: cada fluxo é descontado antes de somar. É sempre maior que o payback simples.',
    quandoUsar: 'Avaliar risco e liquidez: quanto antes o dinheiro volta, menor a exposição do projeto.',
    exemplo: 'Investir R$ 10.000 com entradas de 3, 4, 5 e 4 mil, a 10% ao ano, se paga em cerca de 3,08 anos.',
  },
  'inv-il': {
    ideia: 'Mostra quanto valor presente cada R$ 1 investido gera. Acima de 1, o projeto é viável. É útil para escolher entre vários projetos com orçamento limitado.',
    quandoUsar: 'Ranquear projetos quando o capital é escasso e não dá para fazer todos.',
    exemplo: 'IL de 1,25: cada R$ 1 investido devolve R$ 1,25 em valor presente.',
  },
  'inv-payback-simples': {
    ideia: 'Tempo para recuperar o investimento somando os fluxos sem descontá-los. É simples e intuitivo, mas ignora o valor do dinheiro no tempo e o que acontece depois.',
    quandoUsar: 'Primeira triagem rápida de projetos, e conversas com quem não é da área financeira.',
    exemplo: 'Investir R$ 10.000 com entradas de 3, 4 e 5 mil se paga em 2,6 anos.',
  },
  'inv-roi': {
    ideia: 'O ROI mostra o ganho em relação ao que foi investido, em percentual. Não diz em quanto tempo esse ganho aconteceu.',
    quandoUsar: 'Comparar rapidamente o resultado de campanhas, investimentos e projetos já encerrados.',
    exemplo: 'Investir R$ 10.000 e resgatar R$ 13.500 dá ROI de 35%.',
  },

  // ---------------- Inflação e Depreciação ----------------
  'inf-correcao': {
    ideia: 'A correção monetária atualiza um valor para manter o mesmo poder de compra depois da inflação. Não é ganho: é só repor o que a inflação levou.',
    quandoUsar: 'Reajustar aluguéis, contratos, salários, pensões e dívidas judiciais por índices como IPCA ou IGP-M.',
    exemplo: 'R$ 1.000 corrigidos por 4,5% de inflação viram R$ 1.045.',
  },
  'inf-valor-real': {
    ideia: 'É a operação inversa da correção: mostra quanto um valor futuro compraria a preços de hoje. Deflacionar separa o crescimento "de verdade" do crescimento só nominal.',
    quandoUsar: 'Comparar salários, preços ou faturamentos de anos diferentes, e avaliar ganhos reais.',
    exemplo: 'R$ 1.045 daqui a um ano, com inflação de 4,5%, compram o mesmo que R$ 1.000 hoje.',
  },
  'dep-linear': {
    ideia: 'A depreciação registra o desgaste de um bem ao longo da vida útil. No método linear, a perda é igual todo ano.',
    quandoUsar: 'É o método mais comum na contabilidade e o aceito pela Receita Federal para a maioria dos bens.',
    exemplo: 'Uma máquina de R$ 50.000, com valor residual de R$ 5.000 e vida útil de 10 anos, deprecia R$ 4.500 por ano.',
  },
  'dep-soyd': {
    ideia: 'Método acelerado: deprecia mais nos primeiros anos, quando o bem perde valor mais rápido. O peso de cada ano é proporcional aos anos que ainda restam.',
    quandoUsar: 'Bens que perdem valor rápido no início, como veículos e equipamentos de tecnologia.',
    exemplo: 'Máquina de R$ 50.000 (residual de R$ 5.000) com 5 anos de vida: deprecia R$ 15.000 no 1º ano e R$ 3.000 no último.',
  },
  'dep-exponencial': {
    ideia: 'No saldo decrescente, o bem perde uma porcentagem fixa do valor que ainda tem. A perda em reais diminui ano a ano, e o valor nunca chega exatamente a zero.',
    quandoUsar: 'Estimar o valor de mercado de veículos e eletrônicos, que perdem uma fração parecida do valor a cada ano.',
    exemplo: 'Um carro de R$ 50.000 que perde 20% ao ano vale R$ 25.600 após 3 anos.',
  },
}
