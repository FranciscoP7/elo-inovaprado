'use strict';

/* ============================================================
   DADOS DE DEMONSTRAÇÃO E UTILS
   ============================================================ */
const skills = [
  'Comunicação', 'Organização', 'Trabalho em equipe', 'Proatividade',
  'Empatia', 'Criatividade', 'Excel / Planilhas', 'Atendimento ao cliente',
  'Redes sociais', 'Resolução de problemas', 'Pontualidade', 'Flexibilidade',
];

const demoCandidates = [
  {
    id: 'demo-1', name: 'Mariana Costa', city: 'São Paulo, SP', area: 'Administrativo',
    education: 'Ensino médio completo',
    about: 'Gosto de organizar ideias e ajudar pessoas. Quero começar minha trajetória em uma equipe onde eu possa aprender todo dia.',
    experience: 'Organizei a feira de ciências da escola e participei de um projeto de arrecadação de alimentos no bairro.',
    skills: ['Comunicação', 'Organização', 'Trabalho em equipe', 'Excel / Planilhas'],
    email: 'mariana@example.com',
  },
  {
    id: 'demo-2', name: 'Lucas Santos', city: 'São Paulo, SP', area: 'Atendimento',
    education: 'Ensino médio completo',
    about: 'Tenho facilidade para conversar, ouvir e encontrar soluções. Busco minha primeira oportunidade formal.',
    experience: 'Voluntariado na biblioteca do bairro e atendimento em eventos escolares.',
    skills: ['Comunicação', 'Empatia', 'Trabalho em equipe', 'Atendimento ao cliente'],
    email: 'lucas@example.com',
  },
  {
    id: 'demo-3', name: 'Beatriz Oliveira', city: 'Osasco, SP', area: 'Administrativo',
    education: 'Superior em andamento',
    about: 'Sou curiosa, dedicada e gosto de transformar tarefas em processos bem organizados.',
    experience: 'Curso introdutório de Excel e organização financeira de um projeto estudantil.',
    skills: ['Organização', 'Excel / Planilhas', 'Proatividade'],
    email: 'beatriz@example.com',
  },
  {
    id: 'demo-4', name: 'Rafael Lima', city: 'Guarulhos, SP', area: 'Tecnologia',
    education: 'Curso técnico',
    about: 'Aprendo construindo projetos e compartilhando soluções com colegas.',
    experience: 'Criei um site para um projeto escolar e fiz um curso básico de programação.',
    skills: ['Resolução de problemas', 'Proatividade', 'Redes sociais'],
    email: 'rafael@example.com',
  },
];

const defaultCompany = {
  name: 'Horizonte Serviços', sector: 'Serviços', city: 'São Paulo, SP',
  email: 'equipe@example.com', role: 'Assistente administrativo',
  description: 'Buscamos alguém com vontade de aprender, colaborar e apoiar a organização do dia a dia. Não exigimos experiência anterior.',
  skills: ['Comunicação', 'Organização', 'Trabalho em equipe', 'Excel / Planilhas'],
};

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function tags(list) { return list.map(s => `<span class="tag">${esc(s)}</span>`).join(''); }
function initials(name) { return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase(); }

function notify(message) {
  const box = document.querySelector('#notice');
  if(!box) return;
  box.textContent = message;
  box.hidden = false;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { box.hidden = true; }, 6500);
}

/* ============================================================
   MOCK API - SIMULAÇÃO DE BACKEND E IA
   ============================================================ */
// Simulador de latência de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MockAPI = {
  getProfile: async (type) => {
    // Simula busca no banco de dados
    const data = localStorage.getItem(`elo-${type}`);
    return data ? JSON.parse(data) : null;
  },

  saveProfile: async (type, data) => {
    // Simula delay de salvamento no backend (1.5s)
    await delay(1500);
    localStorage.setItem(`elo-${type}`, JSON.stringify(data));
    return true;
  },

  // Simula a IA realizando o match de candidatos para a vaga
  calculateMatches: async (companyFilters, minScore = 1, searchTerm = '') => {
    // Simula o tempo que a IA leva para processar os dados (2.5s)
    await delay(2500);

    const localCand = await MockAPI.getProfile('candidate');
    const allCandidates = [...demoCandidates, ...(localCand ? [localCand] : [])];

    const company = companyFilters || defaultCompany;
    const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const term = normalize(searchTerm);

    const scored = allCandidates.map(candidate => {
      const common = company.skills.filter(s => candidate.skills.includes(s));
      const score = company.skills.length ? Math.round(common.length / company.skills.length * 100) : 0;
      return { ...candidate, common, score };
    });

    return scored
      .filter(p => p.score >= minScore && normalize(`${p.name} ${p.city}`).includes(term))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'pt-BR'));
  }
};

/* ============================================================
   COMPONENTES E PÁGINAS DA UI
   ============================================================ */
const UI = {
  home: () => {
    return `
      <!-- HERO -->
      <section class="hero" id="home">
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <div class="hero-badge reveal"><span class="hero-badge-dot"></span>Plataforma com IA para PMEs</div>
            <h1 class="reveal reveal-delay-1">Onde pequenas empresas<br>encontram <em>grandes pessoas.</em></h1>
            <p class="hero-subtitle reveal reveal-delay-2">A Elo usa inteligência artificial para conectar pequenas e médias empresas a candidatos em início de carreira — de forma simples, rápida e acessível.</p>
            <div class="hero-ctas reveal reveal-delay-3">
              <a class="btn btn-white btn-lg" href="#empresa">Sou empresa <span aria-hidden="true">→</span></a>
              <a class="btn btn-outline btn-lg" href="#candidato" style="color:#fff;border-color:rgba(255,255,255,.4);">Busco uma oportunidade</a>
            </div>
            <div class="hero-micro reveal reveal-delay-4">
              <span>✓ Sem taxa para candidatos</span><span>·</span><span>✓ Sem RH necessário</span><span>·</span><span>✓ 100% acessível</span>
            </div>
          </div>
          <!-- Busca Rápida (Empresa) -->
          <div class="hero-visual reveal reveal-delay-2">
            <div class="card" style="padding: 32px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; max-width: 440px; width: 100%; box-shadow: var(--shadow-lg); backdrop-filter: blur(10px);">
              <h3 style="color: #fff; margin-bottom: 8px; font-size: 1.25rem;">Encontre o funcionário ideal</h3>
              <p style="color: rgba(255,255,255,0.7); font-size: 0.9375rem; margin-bottom: 24px;">Descreva a vaga e a nossa IA fará o match com os melhores perfis locais.</p>
              <form action="#empresa" style="display: flex; flex-direction: column; gap: 16px;">
                <label style="color: #fff; font-size: 0.875rem; font-weight: 600;">O que você precisa?</label>
                <textarea placeholder="Ex: Preciso de um atendente para padaria, que seja comunicativo e saiba trabalhar em equipe..." rows="4" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; resize: none;"></textarea>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px;">Buscar candidatos com IA →</button>
              </form>
            </div>
          </div>
        </div>
      </section>



      <!-- PARA QUEM É -->
      <section class="section" id="sobre">
        <div class="wrap">
          <div class="section-header centered reveal">
            <div class="section-tag">Para quem é a Elo?</div>
            <h2>Um elo para os dois lados</h2>
            <p>Empresas que precisam contratar sem complicação. Candidatos que merecem uma chance real.</p>
          </div>
          <div class="audience-grid">
            <div class="audience-card for-companies reveal">
              <div class="audience-tag">Para empresas</div>
              <h3>Contrate sem precisar de RH</h3>
              <p>Pequenas e médias empresas têm dificuldade de contratar porque não têm equipe especializada. A Elo resolve isso com IA.</p>
              <ul class="audience-features"><li>Triagem automática de candidatos por IA</li><li>Automação de burocracias do processo seletivo</li><li>Candidatos compatíveis em minutos</li><li>Sem jargão técnico de RH</li></ul>
              <a class="btn btn-white audience-cta" href="#empresa">Cadastrar minha empresa <span aria-hidden="true">→</span></a>
            </div>
            <div class="audience-card for-candidates reveal reveal-delay-2">
              <div class="audience-tag">Para candidatos</div>
              <h3>Sua primeira chance começa aqui</h3>
              <p>Se você está começando agora, o mercado tradicional costuma te ignorar. A Elo foi feita para mudar isso.</p>
              <ul class="audience-features"><li>Vagas para quem está começando do zero</li><li>A IA avalia suas habilidades</li><li>Plataforma 100% acessível</li><li>Oportunidades de qualificação</li></ul>
              <a class="btn btn-white audience-cta" href="#candidato">Criar meu perfil grátis <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- COMO FUNCIONA -->
      <section class="section section-alt" id="como-funciona">
        <div class="wrap">
          <div class="section-header reveal">
            <div class="section-tag">Como funciona</div>
            <h2>Simples do começo ao fim</h2>
            <p>Não importa de qual lado você está — o processo é pensado para ser fácil e rápido.</p>
          </div>
          <div class="how-tabs" role="tablist">
            <button class="how-tab active" data-tab="empresa" role="tab" aria-selected="true">Para empresas</button>
            <button class="how-tab" data-tab="candidato" role="tab" aria-selected="false">Para candidatos</button>
          </div>
          <div class="how-steps active" id="steps-empresa" role="tabpanel">
            <div class="how-step reveal"><div class="step-num">01</div><h4>Cadastre sua empresa</h4><p>Preencha os dados da vaga em menos de 5 minutos.</p></div>
            <div class="how-step reveal reveal-delay-1"><div class="step-num">02</div><h4>Descreva o que precisa</h4><p>Diga quais habilidades são importantes.</p></div>
            <div class="how-step reveal reveal-delay-2"><div class="step-num">03</div><h4>Receba os matches</h4><p>Nossa IA apresenta os candidatos mais compatíveis.</p></div>
            <div class="how-step reveal reveal-delay-3"><div class="step-num">04</div><h4>Entre em contato</h4><p>Veja o perfil completo e conecte-se com o talento.</p></div>
          </div>
          <div class="how-steps" id="steps-candidato" role="tabpanel">
            <div class="how-step"><div class="step-num">01</div><h4>Crie seu perfil</h4><p>Conte sobre você e suas habilidades.</p></div>
            <div class="how-step"><div class="step-num">02</div><h4>A IA avalia seu perfil</h4><p>Nosso sistema analisa suas competências.</p></div>
            <div class="how-step"><div class="step-num">03</div><h4>Apareça para as empresas</h4><p>Seu perfil fica visível para quem busca o que você sabe fazer.</p></div>
            <div class="how-step"><div class="step-num">04</div><h4>Receba oportunidades</h4><p>Empresas entram em contato direto com você.</p></div>
          </div>
        </div>
      </section>

      <!-- IA EM AÇÃO -->
      <section class="section ai-section">
        <div class="wrap">
          <div class="section-header reveal">
            <div class="section-tag">Tecnologia</div>
            <h2>IA que trabalha por você</h2>
            <p>Usamos múltiplas APIs de inteligência artificial para casar perfis com vagas de forma precisa.</p>
          </div>
          <div class="ai-grid">
            <div class="ai-features">
              <div class="ai-feature reveal"><div class="ai-feature-icon">🧠</div><div class="ai-feature-body"><h4>Análise de habilidades</h4><p>A IA cruza o perfil com o que a empresa realmente precisa.</p></div></div>
              <div class="ai-feature reveal reveal-delay-1"><div class="ai-feature-icon">⚡</div><div class="ai-feature-body"><h4>Triagem automática</h4><p>A empresa recebe um ranking ordenado de candidatos.</p></div></div>
              <div class="ai-feature reveal reveal-delay-2"><div class="ai-feature-icon">📋</div><div class="ai-feature-body"><h4>Automação de burocracia</h4><p>Geração automática de descrições e resumos.</p></div></div>
              <div class="ai-feature reveal reveal-delay-3"><div class="ai-feature-icon">🔒</div><div class="ai-feature-body"><h4>Privacidade primeiro</h4><p>Dados usados apenas para o match, sem venda a terceiros.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ANÚNCIO (SINODAL TECH) -->
      <div class="ad-banner" style="background: var(--hero-bg); padding: 40px 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <div class="wrap">
          <a href="#" style="display:inline-block; border-radius:12px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.3); transition: transform 0.2s; max-width:800px; width:100%;">
            <img src="ad.png" alt="Anúncio: Curso Técnico em Desenvolvimento de Sistemas - Sinodal Tech" style="display:block; width:100%; height:auto;">
          </a>
        </div>
      </div>

      <!-- CTA FINAL -->
      <section class="cta-section">
        <div class="cta-inner">
          <div class="hero-badge reveal" style="margin-inline:auto;width:fit-content;"><span class="hero-badge-dot"></span>Comece agora, é grátis para candidatos</div>
          <h2 class="reveal reveal-delay-1">Pronto para dar o próximo passo?</h2>
          <div class="cta-buttons reveal reveal-delay-3">
            <a class="btn btn-white btn-lg" href="#empresa">Cadastrar minha empresa</a>
            <a class="btn btn-lg" href="#candidato" style="background:rgba(255,255,255,.1);color:#fff;border:2px solid rgba(255,255,255,.3);">Criar meu perfil grátis</a>
          </div>
        </div>
      </section>
    `;
  },

  registration: async (isCompany) => {
    // Carrega dados se já existirem na simulação local
    const data = await MockAPI.getProfile(isCompany ? 'company' : 'candidate') || {};
    const isEdit = Object.keys(data).length > 0;

    const field = (label, name, val, type='text', req=true) => `
      <label>${label}${req ? ' <span style="color:#c53030">*</span>' : ''}
        <input name="${name}" type="${type}" value="${esc(val)}" ${req?'required':''} maxlength="180">
      </label>`;

    const sel = (label, name, opts, val) => `
      <label>${label} <span style="color:#c53030">*</span>
        <select name="${name}" required><option value="" disabled ${!val?'selected':''}>Selecione…</option>
        ${opts.map(v => `<option ${val===v?'selected':''}>${esc(v)}</option>`).join('')}</select>
      </label>`;

    return `
      <div class="wrap">
        <div class="page-head">
          <div class="section-tag">${isCompany ? 'Para empresas' : 'Para candidatos'}</div>
          <h1>${isCompany ? 'Cadastre sua empresa' : 'Crie seu perfil gratuitamente'}</h1>
          <p>${isCompany ? 'Preencha os dados da sua empresa e da vaga. Nossa IA encontrará os candidatos certos.' : 'Conte sobre você. O que importa é seu potencial e suas habilidades.'}</p>
        </div>
        <div class="form-layout">
          <aside class="form-aside">
            <div class="section-tag">${isCompany ? 'Empresa' : 'Candidato'}</div>
            <h2>${isCompany ? 'Contrate sem complicação.' : 'Sua história tem valor.'}</h2>
            <ol>
              <li>${isCompany ? 'Preencha os dados da empresa e da vaga.' : 'Fale sobre você e suas qualidades.'}</li>
              <li>Selecione as habilidades.</li>
              <li>${isCompany ? 'Receba candidatos compatíveis pela IA.' : 'Apareça para as empresas certas.'}</li>
            </ol>
          </aside>
          <form id="registration" class="card form-grid" data-kind="${isCompany ? 'company' : 'candidate'}">
            <p class="form-note full"><span aria-hidden="true">ℹ️</span> Campos com <strong style="color:#c53030">*</strong> são obrigatórios.</p>
            ${field(isCompany ? 'Nome da empresa' : 'Seu nome completo', 'name', data.name)}
            ${field('E-mail de contato', 'email', data.email, 'email')}
            ${field('Cidade e estado', 'city', data.city)}
            ${isCompany ? field('Setor de atuação', 'sector', data.sector) : sel('Área de interesse', 'area', ['Administrativo', 'Atendimento ao cliente', 'Tecnologia', 'Vendas', 'Logística', 'Outra'], data.area)}
            
            ${isCompany ? `
              <div class="full">${field('Título da vaga', 'role', data.role)}</div>
              <label class="full">Descrição da oportunidade <span style="color:#c53030">*</span>
                <textarea name="description" required maxlength="2000">${esc(data.description)}</textarea>
              </label>
            ` : `
              <div class="full">${sel('Escolaridade', 'education', ['Ensino fundamental', 'Ensino médio completo', 'Curso técnico', 'Superior em andamento', 'Superior completo'], data.education)}</div>
              <label class="full">Sobre você <span style="color:#c53030">*</span>
                <textarea name="about" required maxlength="2000">${esc(data.about)}</textarea>
              </label>
              <label class="full">Experiências (projetos, cursos, voluntariado)
                <textarea name="experience" maxlength="3000">${esc(data.experience)}</textarea>
              </label>
            `}

            <fieldset class="full">
              <legend>${isCompany ? 'Habilidades buscadas na vaga' : 'Suas habilidades'} <span style="color:#c53030">*</span></legend>
              <div class="check-grid" style="margin-top:12px;">
                ${skills.map(s => `<label><input type="checkbox" name="skills" value="${s}" ${(data.skills||[]).includes(s)?'checked':''}>${s}</label>`).join('')}
              </div>
              <p id="skill-error" class="form-error"></p>
            </fieldset>
            
            <label class="consent full"><input name="consent" type="checkbox" required> Entendo que este é um protótipo local.</label>
            <div class="full">
              <button class="btn btn-primary btn-lg" type="submit" id="submit-btn">
                <span class="btn-text">${isEdit ? 'Salvar alterações' : isCompany ? 'Cadastrar e ver matches com IA' : 'Criar meu perfil'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>`;
  },

  candidatePanel: async () => {
    const p = await MockAPI.getProfile('candidate');
    if (!p) {
      return `
        <div class="wrap section" style="text-align:center;padding:100px 0;">
          <div class="section-tag" style="margin-inline:auto;">Meu perfil</div>
          <h1>Você ainda não tem um perfil cadastrado.</h1>
          <a class="btn btn-primary btn-lg" href="#candidato" style="margin-top:20px;">Criar meu perfil gratuitamente →</a>
        </div>`;
    }
    return `
      <div class="wrap">
        <div class="page-head">
          <div class="section-tag">Meu perfil</div>
          <h1>Olá, ${esc(p.name.split(' ')[0])}. 👋</h1>
        </div>
        <div class="dashboard">
          <aside class="card sidebar">
            <div class="avatar" style="width:60px;height:60px;">${esc(initials(p.name))}</div>
            <h2>${esc(p.name)}</h2>
            <p>${esc(p.city)}</p>
            <a href="#candidato" class="btn btn-ghost btn-sm" style="margin-top:20px;width:100%;justify-content:center;">Editar perfil →</a>
          </aside>
          <div>
            <section class="card profile-block"><h2>Sobre mim</h2><p>${esc(p.about)}</p><div class="tags" style="margin-top:16px;">${tags(p.skills)}</div></section>
            <section class="card profile-block"><h2>Estudos e área</h2><p><strong>Escolaridade:</strong> ${esc(p.education)}<br><strong>Área:</strong> ${esc(p.area)}</p></section>
            <section class="card profile-block"><h2>Contato</h2><p>${esc(p.email)}</p></section>
          </div>
        </div>
      </div>`;
  },

  companyPanel: async () => {
    const c = await MockAPI.getProfile('company') || defaultCompany;
    return `
      <div class="wrap">
        <div class="page-head">
          <div class="section-tag">Painel da empresa</div>
          <h1>Candidatos para <em style="font-style:normal;color:var(--green);">${esc(c.role)}</em></h1>
          <p>A IA analisa as habilidades desejadas e encontra os melhores perfis automaticamente.</p>
        </div>
        <div class="dashboard">
          <aside class="card sidebar">
            <div class="avatar dark" style="width:60px;height:60px;">${esc(initials(c.name))}</div>
            <h2>${esc(c.name)}</h2>
            <p>${esc(c.city)}</p>
            <a href="#empresa" class="btn btn-ghost btn-sm" style="margin-top:20px;width:100%;justify-content:center;">Editar vaga →</a>
            <div style="margin-top:24px;border-top:1px solid var(--line);padding-top:20px;">
              <p style="font-size:.875rem;font-weight:700;">Habilidades buscadas</p>
              <div class="tags">${tags(c.skills)}</div>
            </div>
          </aside>
          <div>
            <div class="filters">
              <label>Buscar (Nome ou cidade)<input id="search" type="search"></label>
              <label>Filtro de IA (Afinidade mínima)
                <select id="minimum">
                  <option value="1">Pelo menos uma habilidade</option>
                  <option value="50">50% ou mais</option>
                  <option value="75">75% ou mais</option>
                  <option value="100">100% — match perfeito</option>
                </select>
              </label>
            </div>
            
            <!-- Contêiner de resultados / loaders -->
            <div id="results-area"></div>
            
          </div>
        </div>
      </div>`;
  }
};

/* ============================================================
   LÓGICA DE RENDERIZAÇÃO DO RESULTADO (MATCHING)
   ============================================================ */
async function loadMatches() {
  const resultsArea = document.querySelector('#results-area');
  if(!resultsArea) return;

  const min = Number(document.querySelector('#minimum').value || 1);
  const term = document.querySelector('#search').value || '';

  // 1. Mostrar estado de carregamento simulando o processamento da IA
  resultsArea.innerHTML = `
    <div class="loader-container">
      <div class="spinner"></div>
      <div class="loader-text">A IA Elo está analisando os perfis...</div>
      <div class="loader-subtext">Isso pode levar alguns segundos enquanto o algoritmo cruza habilidades e requisitos.</div>
    </div>
    <div class="results">
      <div class="skeleton-card skeleton-pulse"><div class="skeleton-header"><div class="skeleton-avatar"></div><div class="skeleton-lines"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div><div class="skeleton-box"></div></div>
      <div class="skeleton-card skeleton-pulse" style="animation-delay: .2s;"><div class="skeleton-header"><div class="skeleton-avatar"></div><div class="skeleton-lines"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div><div class="skeleton-box"></div></div>
    </div>
  `;

  // 2. Chama a Mock API que simula o atraso
  const company = await MockAPI.getProfile('company');
  const matches = await MockAPI.calculateMatches(company, min, term);

  // 3. Renderiza os resultados finais
  if(matches.length === 0) {
    resultsArea.innerHTML = `<div class="empty"><h3>Nenhum perfil compatível</h3><p>Tente ajustar os filtros ou reduzir a afinidade mínima.</p></div>`;
    return;
  }

  const resultsHtml = matches.map(p => `
    <article class="card candidate">
      <div class="sample-person">
        <div class="avatar">${esc(initials(p.name))}</div>
        <div><h3>${esc(p.name)}</h3><p>${esc(p.city)}</p></div>
      </div>
      <div class="match-line"><span>Afinidade com a vaga</span><span class="score-badge">${p.score}%</span></div>
      <div class="tags" style="margin:12px 0;">${tags(p.common)}</div>
      <button class="btn btn-outline" data-profile="${esc(p.id)}" style="width:100%; margin-top:16px;">Ver perfil completo →</button>
    </article>
  `).join('');

  resultsArea.innerHTML = `
    <p class="form-note">A IA encontrou ${matches.length} candidato(s) compatível(is).</p>
    <div class="results">${resultsHtml}</div>
  `;
}

/* ============================================================
   ROTEAMENTO E INICIALIZAÇÃO
   ============================================================ */
const main = document.querySelector('#main');

async function route() {
  const rawPage = location.hash.slice(1) || 'home';
  const homeSections = ['home', 'sobre', 'como-funciona'];
  const page = homeSections.includes(rawPage) ? 'home' : rawPage;
  
  // Define o que será renderizado
  let content = '';
  switch(page) {
    case 'home': content = UI.home(); break;
    case 'candidato': content = await UI.registration(false); break;
    case 'empresa': content = await UI.registration(true); break;
    case 'painel': content = await UI.candidatePanel(); break;
    case 'matches': content = await UI.companyPanel(); break;
    default: content = UI.home();
  }

  main.innerHTML = content;

  // Atualiza nav
  document.querySelectorAll('nav a').forEach(a => {
    const hash = a.getAttribute('href')?.slice(1) || '';
    if (hash === rawPage || (page === 'home' && hash === 'home')) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });

  // Eventos de página específica
  if (page === 'matches') {
    loadMatches(); // Dispara o loader e a requisição
    const searchInput = document.querySelector('#search');
    const minSelect = document.querySelector('#minimum');
    
    // Evita recarregar a IA a cada tecla; usa debounce
    let debounceTimer;
    searchInput?.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadMatches, 800);
    });
    minSelect?.addEventListener('change', loadMatches);
  }

  if (page === 'home') {
    // Interatividade da Home (Tabs e Animações)
    const tabs = document.querySelectorAll('.how-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.how-steps').forEach(panel => panel.classList.remove('active'));
        document.querySelector(`#steps-${tab.dataset.tab}`)?.classList.add('active');
      });
    });

    // Inicia observadores de CSS (se não implementados, assume carregamento direto)
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  if (homeSections.includes(rawPage) && rawPage !== 'home') {
    setTimeout(() => {
      document.getElementById(rawPage)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/* ============================================================
   FORMULÁRIO (SALVAMENTO COM LOADING)
   ============================================================ */
main.addEventListener('submit', async event => {
  if (event.target.id !== 'registration') return;
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);
  const selected = data.getAll('skills');

  if (!selected.length) {
    document.querySelector('#skill-error').textContent = 'Selecione pelo menos uma habilidade.';
    return;
  }

  const kind = form.dataset.kind;
  const record = Object.fromEntries(data.entries());
  record.skills = selected;
  delete record.consent;
  record.id = kind === 'candidate' ? 'local-candidate' : 'local-company';

  // Mostrar loading no botão
  const submitBtn = document.querySelector('#submit-btn');
  submitBtn.classList.add('is-loading');

  // Envio pra Mock API (tem delay de 1.5s)
  await MockAPI.saveProfile(kind, record);

  submitBtn.classList.remove('is-loading');
  notify('Perfil salvo com sucesso! ✓');
  
  location.hash = kind === 'candidate' ? 'painel' : 'matches';
});

/* ============================================================
   MODAL DE PERFIL
   ============================================================ */
main.addEventListener('click', async event => {
  const btn = event.target.closest('[data-profile]');
  if (!btn) return;
  
  const id = btn.dataset.profile;
  const localCand = await MockAPI.getProfile('candidate');
  const allCandidates = [...demoCandidates, ...(localCand ? [localCand] : [])];
  const p = allCandidates.find(c => c.id === id);
  if (!p) return;

  const c = await MockAPI.getProfile('company') || defaultCompany;
  const common = c.skills.filter(s => p.skills.includes(s));
  const score = c.skills.length ? Math.round(common.length / c.skills.length * 100) : 0;

  document.querySelector('#dialog-content').innerHTML = `
    <span class="pill" style="background:var(--green-soft);color:var(--green);border-color:var(--line);">
      ${p.id.startsWith('demo') ? 'Perfil fictício' : 'Cadastro local'}
    </span>
    <h2 id="dialog-title" style="margin:16px 0 4px;">${esc(p.name)}</h2>
    <p style="margin:0 0 24px;">${esc(p.city)} · ${esc(p.area)}</p>
    <h3>Sobre</h3><p>${esc(p.about)}</p>
    <h3>Escolaridade</h3><p>${esc(p.education)}</p>
    <h3>Por que houve match?</h3><p>${common.length} de ${c.skills.length} habilidades coincidem — score de ${score}%.</p>
    <div class="tags" style="margin-top:12px;">${tags(common)}</div>
    <h3 style="margin-top:24px;">Contato</h3><p><a href="mailto:${esc(p.email)}" style="color:var(--green);font-weight:600;">${esc(p.email)}</a></p>`;

  document.querySelector('#profile-dialog').showModal();
});

document.querySelector('#close-dialog')?.addEventListener('click', () => {
  document.querySelector('#profile-dialog').close();
});

/* ============================================================
   INICIALIZAÇÃO BÁSICA
   ============================================================ */
window.addEventListener('hashchange', route);
route();
