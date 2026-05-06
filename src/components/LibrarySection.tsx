import React from 'react';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  Rocket, 
  Target, 
  Award, 
  ChevronRight, 
  Lightbulb,
  AlertTriangle,
  Zap,
  BarChart3,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const books = {
  mindset: [
    { 
      title: 'Pai Rico, Pai Pobre', 
      desc: 'Ensina diferença entre ativos vs passivos (base de tudo)',
      summary: 'Robert Kiyosaki explica que a classe média trabalha pelo dinheiro, enquanto os ricos fazem o dinheiro trabalhar para eles. O conceito central é a diferenciação entre ativos (colocam dinheiro no seu bolso) e passivos (retiram dinheiro do seu bolso).'
    },
    { 
      title: 'Os Segredos da Mente Milionária', 
      desc: 'Reprogramação mental financeira',
      summary: 'T. Harv Eker revela como o seu "modelo de dinheiro" — um conjunto de crenças enraizadas desde a infância — determina o seu sucesso financeiro. Ele apresenta 17 "arquivos de riqueza" para mudar sua mentalidade.'
    },
    { 
      title: 'O Homem Mais Rico da Babilônia', 
      desc: 'Princípios antigos que funcionam até hoje',
      summary: 'George S. Clason utiliza parábolas da antiga Babilônia para ensinar leis básicas do dinheiro: "pague a si mesmo primeiro" (guarde 10%), controle seus gastos e faça o seu ouro multiplicar.'
    },
    { 
      title: 'Quem Pensa Enriquece', 
      desc: 'Psicologia do sucesso financeiro',
      summary: 'Napoleon Hill estudou centenas de milionários para identificar os passos para a riqueza. O livro foca no poder do desejo, da fé, da persistência e do planejamento organizado.'
    },
  ],
  investments: [
    { 
      title: 'O Investidor Inteligente', 
      desc: 'Bíblia do investimento (Warren Buffett segue isso)',
      summary: 'Benjamin Graham apresenta o conceito de "investimento em valor" e a importância de se proteger contra erros graves. Ele ensina a separar o investidor do especulador e a lidar com o "Sr. Mercado".'
    },
    { 
      title: 'A Psicologia Financeira', 
      desc: 'Controle emocional no dinheiro',
      summary: 'Morgan Housel argumenta que o sucesso financeiro tem pouco a ver com inteligência e muito a ver com comportamento. Ele explora como o ego, o viés e o azar influenciam nossas decisões.'
    },
    { 
      title: 'Do Mil ao Milhão', 
      desc: 'Estratégia prática (Brasil)',
      summary: 'Thiago Nigro (O Primo Rico) foca em três pilares: gastar bem, investir melhor e ganhar mais. É um guia prático adaptado à realidade do mercado brasileiro.'
    },
    { 
      title: 'Common Stocks and Uncommon Profits', 
      desc: 'Como analisar empresas de verdade',
      summary: 'Philip Fisher ensina a técnica do "scuttlebutt" (investigação) para encontrar empresas com alto potencial de crescimento a longo prazo, focando na qualidade da gestão.'
    },
  ]
};

const strategies = [
  {
    id: 1,
    title: '🧱 Estratégia FUNDAMENTALISTA',
    subtitle: 'LONGO PRAZO',
    badge: 'Usada por milionários',
    points: ['Comprar ações de empresas fortes', 'Segurar por anos', 'Foco em dividendos'],
    examples: 'Bancos, Energia, Empresas sólidas',
    bestFor: 'Segurança + Crescimento',
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/5'
  },
  {
    id: 2,
    title: '📉 Estratégia TRADING',
    subtitle: 'CURTO PRAZO',
    badge: 'Alto risco, alto lucro',
    points: ['Day Trade → compra e vende no mesmo dia', 'Swing Trade → dias/semanas'],
    tools: 'Suporte e resistência, Média móvel, Volume',
    warning: '90% perde dinheiro sem estratégia',
    color: 'border-red-500/30 text-red-400 bg-red-500/5'
  },
  {
    id: 3,
    title: '🏦 RENDA PASSIVA',
    subtitle: 'O JOGO REAL',
    points: ['Dividendos', 'Fundos imobiliários (FIIs)', 'Juros compostos'],
    rule: 'Fazer o dinheiro trabalhar pra você',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
  },
  {
    id: 4,
    title: '🔥 ESTRATÉGIA 70/30',
    subtitle: 'PROFISSIONAL',
    points: ['70% → seguro (renda fixa / dividendos)', '30% → risco (ações / cripto / trade)'],
    bestFor: 'Equilíbrio perfeito',
    color: 'border-brand-purple/30 text-brand-purple bg-brand-purple/5'
  }
];

export function LibrarySection() {
  const [selectedBook, setSelectedBook] = React.useState<{title: string, summary: string} | null>(null);

  return (
    <div className="space-y-12 pb-20">
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-[2.5rem] border border-white/20 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 flex items-center justify-center mb-6">
                <BookOpen className="text-brand-purple" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{selectedBook.title}</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {selectedBook.summary}
              </p>
              <button 
                onClick={() => setSelectedBook(null)}
                className="w-full mt-8 py-4 bg-brand-purple text-white rounded-2xl font-bold hover:bg-brand-purple/80 transition-all"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="relative py-12 px-8 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-orange/20" />
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-2">Biblioteca de Elite</h2>
          <p className="text-slate-400 max-w-xl">
            O conhecimento é o ativo que paga os melhores juros. Domine as estratégias dos maiores investidores do mundo.
          </p>
        </div>
      </header>

      {/* Books Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-3 text-brand-purple" size={28} />
            Melhores Livros de Finanças (Essencial)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mindset Books */}
          <div className="glass p-8 rounded-[2.5rem] border-white/10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center mr-4">
                <Brain className="text-brand-purple" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Mentalidade & Base</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">4 Livros Fundamentais</p>
              </div>
            </div>
            <div className="space-y-4">
              {books.mindset.map((book, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedBook(book)}
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="text-brand-purple font-black text-xl opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                  <div>
                    <h5 className="font-bold text-slate-100">{book.title}</h5>
                    <p className="text-sm text-slate-400">→ {book.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Books */}
          <div className="glass p-8 rounded-[2.5rem] border-white/10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 flex items-center justify-center mr-4">
                <TrendingUp className="text-brand-orange" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Investimentos</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Essencial para ganhar dinheiro</p>
              </div>
            </div>
            <div className="space-y-4">
              {books.investments.map((book, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedBook(book)}
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="text-brand-orange font-black text-xl opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                  <div>
                    <h5 className="font-bold text-slate-100">{book.title}</h5>
                    <p className="text-sm text-slate-400">→ {book.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold flex items-center">
          <Coins className="mr-3 text-brand-orange" size={28} />
          Estratégias de Mercado (Nível Profissional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategies.map((strat) => (
            <div key={strat.id} className={cn("p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02]", strat.color)}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-black mb-1">{strat.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{strat.subtitle}</span>
                </div>
                {strat.badge && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {strat.badge}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {strat.points.map((p, i) => (
                  <li key={i} className="flex items-center text-sm font-medium">
                    <ChevronRight size={14} className="mr-2 opacity-50" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/10 space-y-3">
                {strat.examples && (
                  <p className="text-xs">
                    <span className="font-bold opacity-60 uppercase mr-2">Exemplos:</span>
                    <span className="text-white">{strat.examples}</span>
                  </p>
                )}
                {strat.tools && (
                  <p className="text-xs">
                    <span className="font-bold opacity-60 uppercase mr-2">Ferramentas:</span>
                    <span className="text-white">{strat.tools}</span>
                  </p>
                )}
                {strat.rule && (
                  <p className="text-xs">
                    <span className="font-bold opacity-60 uppercase mr-2">Regra de Ouro:</span>
                    <span className="text-white">👉 {strat.rule}</span>
                  </p>
                )}
                {strat.bestFor && (
                  <p className="text-xs">
                    <span className="font-bold opacity-60 uppercase mr-2">Melhor para:</span>
                    <span className="text-white">✔️ {strat.bestFor}</span>
                  </p>
                )}
                {strat.warning && (
                  <div className="flex items-center p-3 bg-red-500/10 rounded-xl border border-red-500/20 mt-4">
                    <AlertTriangle size={14} className="mr-2 text-red-400" />
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{strat.warning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Juros Compostos & Formula */}
      <section className="glass p-12 rounded-[3rem] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 opacity-5">
          <Zap size={300} className="text-brand-orange" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 rounded-3xl bg-brand-orange/20 flex items-center justify-center mb-6">
              <Rocket className="text-brand-orange" size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Juros Compostos: A Arma Mais Forte</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Albert Einstein chamou os juros compostos de a "oitava maravilha do mundo". 
              Quem entende, ganha. Quem não entende, paga.
            </p>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">A Fórmula do Sucesso</p>
              <div className="text-3xl font-mono text-white mb-4">M = P(1 + i)ᵗ</div>
              <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <div>M = Dinheiro Final</div>
                <div>P = Investimento Inicial</div>
                <div>i = Taxa de Juros</div>
                <div>t = Tempo</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-orange p-8 rounded-[2.5rem]">
              <h4 className="text-xl font-bold text-brand-orange mb-2">💡 Regra de Ouro</h4>
              <p className="text-slate-200 font-medium">Quanto mais tempo → Mais dinheiro.</p>
              <p className="text-sm text-slate-400 mt-2">O tempo é o fator mais importante na fórmula, pois ele é o expoente.</p>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
              <BarChart3 className="text-emerald-400" size={32} />
              <p className="text-sm text-emerald-400 font-bold">Comece hoje, mesmo com pouco. O "t" (tempo) não espera por ninguém.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center">
            <Award className="mr-2 text-brand-purple" size={24} />
            Dicas Profissionais (Ouro)
          </h3>
          <div className="space-y-4">
            <div className="glass p-6 rounded-3xl border-white/5">
              <h5 className="font-bold text-brand-purple mb-2 flex items-center">
                <Brain size={16} className="mr-2" /> Mentalidade
              </h5>
              <p className="text-sm text-slate-400">Rico pensa em longo prazo. Pobre pensa no agora.</p>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5">
              <h5 className="font-bold text-brand-purple mb-2 flex items-center">
                <Target size={16} className="mr-2" /> Controle Financeiro
              </h5>
              <p className="text-sm text-slate-400">Regra 50/30/20: 50% despesas, 30% estilo de vida, 20% investimento.</p>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5">
              <h5 className="font-bold text-brand-purple mb-2 flex items-center">
                <TrendingUp size={16} className="mr-2" /> Mercado
              </h5>
              <p className="text-sm text-slate-400">Nunca invista no que não entende. Não siga "dicas quentes". Estude sempre.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center">
            <ShieldAlert className="mr-2 text-red-400" size={24} />
            Erros que Destroem
          </h3>
          <div className="space-y-4">
            {[
              'Entrar em hype (modinha)',
              'Não diversificar o patrimônio',
              'Falta de controle emocional',
              'Querer ficar rico rápido'
            ].map((error, i) => (
              <div key={i} className="flex items-center p-5 bg-red-500/5 border border-red-500/10 rounded-3xl">
                <AlertTriangle size={18} className="text-red-400 mr-4 shrink-0" />
                <span className="text-sm font-medium text-slate-300">{error}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Advanced Strategy */}
      <section className="glass-purple p-12 rounded-[3.5rem] border-brand-purple/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-3xl font-black text-white mb-4">🧠 Estratégia Avançada (Nível Pro)</h3>
          <p className="text-slate-400">O método definitivo que realmente funciona para construir liberdade financeira.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Aprender', desc: 'Livros e cursos', icon: BookOpen },
            { step: '02', title: 'Reserva', desc: 'Segurança total', icon: ShieldAlert },
            { step: '03', title: 'Passiva', desc: 'Renda mensal', icon: Coins },
            { step: '04', title: 'Escalar', desc: 'Renda variável', icon: TrendingUp },
            { step: '05', title: 'Reinvestir', desc: 'Tudo de novo', icon: Rocket },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center hover:bg-brand-purple/10 hover:border-brand-purple/30 transition-all">
                <div className="text-[10px] font-black text-brand-purple mb-2">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={20} className="text-brand-purple" />
                </div>
                <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{item.desc}</p>
              </div>
              {i < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                  <ChevronRight size={16} className="text-brand-purple/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-brand-purple/10 rounded-3xl border border-brand-purple/20 text-center">
          <p className="text-brand-purple font-black uppercase tracking-[0.2em] text-sm">🚀 Resumo: O Caminho Certo</p>
        </div>
      </section>
    </div>
  );
}
