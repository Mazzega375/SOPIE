// script.js
// Mesma estrutura e mesmas funções de antes, mas agora os PROJETOS
// são salvos e lidos do banco de dados MySQL via API (fetch),
// em vez de localStorage.
//
// O login continua exatamente como era (sem validação real).

const API_URL = '/api/projetos';

function entrar() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const perfil = document.getElementById('perfil').value;

    if (!usuario || !senha || !perfil) {
        alert('Preencha todos os campos.');
        return;
    }

    if (perfil === 'coordenador') {
        window.location.href = '../coordenadores/index.html';
    } else if (perfil === 'professor') {
        window.location.href = '../pagprofessores/index.html';
    }
}

async function criarprojeto() {
    const nomprojeto = document.getElementById('nomprojeto').value;
    const lidergrupo = document.getElementById('lidergrupo').value;
    const grupo = document.getElementById('grupo').value;
    const orientador = document.getElementById('orientador').value;
    const descproj = document.getElementById('descproj').value;
    const professores = document.getElementById('professores').value;

    if (!nomprojeto || !lidergrupo || !grupo || !orientador || !descproj || !professores) {
        alert('Preencha todos os campos.');
        return;
    }

    const projeto = {
        nome: nomprojeto,
        lider: lidergrupo,
        grupo: grupo,
        orientador: orientador,
        descricao: descproj,
        professor: professores
    };

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projeto)
        });

        if (!resposta.ok) throw new Error('Falha ao criar projeto.');

        alert('Projeto criado com sucesso!');
        window.location.href = '../../pagprofessores/index.html';
    } catch (erro) {
        console.error(erro);
        alert('Erro ao criar projeto. Verifique se o servidor está rodando.');
    }
}

async function listarProjetos() {
    const lista = document.getElementById('lista-projetos');
    if (!lista) return;

    try {
        const resposta = await fetch(API_URL);
        const projetos = await resposta.json();

        if (projetos.length === 0) {
            lista.innerHTML = '<p>Nenhum projeto criado ainda.</p>';
        } else {
            lista.innerHTML = '';
            projetos.forEach((p) => {
                lista.innerHTML += `
                    <div class="card-curso" style="flex-direction: column; align-items: flex-start; gap: 6px; cursor: pointer;" onclick="irEditar(${p.idProjeto})">
                        <strong>${p.nome}</strong>
                        <span style="font-size:13px; color:#555;">${p.descricao}</span>
                        <span style="font-size:12px; color:#888;">Professor: ${p.professor}</span>
                    </div>
                `;
            });
        }
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<p>Erro ao carregar projetos. Verifique se o servidor está rodando.</p>';
    }
}

function irEditar(id) {
    localStorage.setItem('editId', id);
    window.location.href = 'editarprojeto/index.html';
}

async function salvareditar() {
    const id = localStorage.getItem('editId');
    const nomprojeto = document.getElementById('nomprojeto').value;
    const lidergrupo = document.getElementById('lidergrupo').value;
    const grupo = document.getElementById('grupo').value;
    const orientador = document.getElementById('orientador').value;
    const descproj = document.getElementById('descproj').value;
    const professores = document.getElementById('professores').value;

    if (!nomprojeto || !lidergrupo || !grupo || !orientador || !descproj || !professores) {
        alert('Preencha todos os campos.');
        return;
    }

    const projeto = {
        nome: nomprojeto,
        lider: lidergrupo,
        grupo: grupo,
        orientador: orientador,
        descricao: descproj,
        professor: professores
    };

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projeto)
        });

        if (!resposta.ok) throw new Error('Falha ao atualizar projeto.');

        alert('Projeto atualizado!');
        window.location.href = '../../pagprofessores/index.html';
    } catch (erro) {
        console.error(erro);
        alert('Erro ao atualizar projeto. Verifique se o servidor está rodando.');
    }
}

async function excluirprojeto() {
    const id = localStorage.getItem('editId');

    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

            if (!resposta.ok) throw new Error('Falha ao excluir projeto.');

            alert('Projeto excluído!');
            window.location.href = '../../pagprofessores/index.html';
        } catch (erro) {
            console.error(erro);
            alert('Erro ao excluir projeto. Verifique se o servidor está rodando.');
        }
    }
}

async function carregarEdicao() {
    if (!window.location.href.includes('editarprojeto')) return;

    const id = localStorage.getItem('editId');

    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error('Projeto não encontrado.');
        const p = await resposta.json();

        document.getElementById('nomprojeto').value = p.nome;
        document.getElementById('lidergrupo').value = p.alunolider || '';
        document.getElementById('grupo').value = p.grupo || '';
        document.getElementById('orientador').value = p.orientador || '';
        document.getElementById('descproj').value = p.descricao;
        document.getElementById('professores').value = p.professor;

        const selectCustom = document.getElementById('select-custom');
        if (selectCustom && p.professor) {
            selectCustom.innerHTML = p.professor + ' <span>▾</span>';
            selectCustom.style.color = '#1f2937';
        }
    } catch (erro) {
        console.error(erro);
    }
}

function carregarProfessores() {
    const lista = document.getElementById('lista-professores');
    if (!lista) return;

    const params = new URLSearchParams(window.location.search);
    const curso = params.get('curso');

    if (curso) {
        document.getElementById('titulo-curso').textContent = curso;
    }


    //Nome dos professores por curso, na tabela com nome das materias//
    const professoresPorCurso = {
        'TI': ['Ebert', 'Vitor', 'Alexandre'],
        'Administração': ['Fabricio Vasconcelos'],
        'Arquitetura': [],
        'Biomedicina': [],
        'Ciências Contábeis': [],
        'Direito': [],
        'Educação Física': [],
        'Enfermagem': [],
        'Farmácia': [],
        'Medicina': [],
        'Nutrição': [],
        'Psicologia': [],
    };

    const profs = professoresPorCurso[curso] || [];

    if (profs.length === 0) {
        lista.innerHTML = '<p>Nenhum professor encontrado.</p>';
    } else {
        profs.forEach(nome => {
            lista.innerHTML += `
                <div class="card-professor" style="cursor:pointer;" onclick="irProjetos('${nome}', '${curso}')">
                    ${nome}
                </div>
            `;
        });
    }
}

function irProjetos(professor, curso) {
    localStorage.setItem('profSelecionado', professor);
    localStorage.setItem('cursoSelecionado', curso);
    window.location.href = '../projetoprofessores/index.html';
}

async function carregarProjetosProfessor() {
    const lista = document.getElementById('lista-projetos-professor');
    if (!lista) return;

    const professor = localStorage.getItem('profSelecionado');

    if (professor) {
        document.getElementById('titulo-professor').textContent = professor;
    }

    try {
        const resposta = await fetch(`${API_URL}?professor=${encodeURIComponent(professor)}`);
        const filtrados = await resposta.json();

        if (filtrados.length === 0) {
            lista.innerHTML = '<p>Nenhum projeto cadastrado para este professor.</p>';
        } else {
            lista.innerHTML = '';
            filtrados.forEach(p => {
                lista.innerHTML += `
                    <div class="card-professor" style="flex-direction: column; align-items: flex-start; gap: 6px;">
                        <strong>${p.nome}</strong>
                        <span style="font-size:13px; color:#555;">${p.descricao}</span>
                        <span style="font-size:12px; color:#888;"><strong>Aluno Líder:</strong> ${p.alunolider || '—'}</span>
                        <span style="font-size:12px; color:#888;"><strong>Grupo:</strong> ${p.grupo || '—'}</span>
                        <span style="font-size:12px; color:#888;"><strong>Orientador:</strong> ${p.orientador || '—'}</span>
                        <span style="font-size:12px; color:#888;"><strong>Professor:</strong> ${p.professor || '—'}</span>
                    </div>
                `;
            });
        }
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<p>Erro ao carregar projetos. Verifique se o servidor está rodando.</p>';
    }
}

const todosProfessores = [
    'Ebert', 'Vitor', 'Alexandre', 'Fabricio Vasconcelos'
];

function abrirDropdown() {
    const dropdown = document.getElementById('lista-dropdown');
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    if (dropdown.style.display === 'block') {
        document.getElementById('busca-professor').focus();
        filtrarProfessores();
    }
}

function filtrarProfessores() {
    const input = document.getElementById('busca-professor');
    const container = document.getElementById('itens-dropdown');
    if (!input || !container) return;

    const busca = input.value.toLowerCase();
    const filtrados = todosProfessores.filter(p => p.toLowerCase().includes(busca));

    container.innerHTML = '';
    filtrados.forEach(nome => {
        const item = document.createElement('div');
        item.textContent = nome;
        item.style = 'padding: 12px 16px; cursor:pointer; font-size:1rem;';
        item.onmouseover = () => item.style.background = '#eff6ff';
        item.onmouseout = () => item.style.background = '#fff';
        item.onclick = () => {
            document.getElementById('select-custom').innerHTML = nome + ' <span>▾</span>';
            document.getElementById('select-custom').style.color = '#1f2937';
            document.getElementById('professores').value = nome;
            document.getElementById('lista-dropdown').style.display = 'none';
        };
        container.appendChild(item);
    });
}

document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('lista-dropdown');
    const select = document.getElementById('select-custom');
    if (!dropdown || !select) return;
    if (!dropdown.contains(e.target) && e.target !== select) {
        dropdown.style.display = 'none';
    }
});

carregarProfessores();
carregarProjetosProfessor();
listarProjetos();
carregarEdicao();

// ---------------------------------------------------------
// Gerenciamento de Professores (Coordenador)
// ---------------------------------------------------------

const API_PROFESSORES = '/api/professores';

async function listarProfessoresCadastrados() {
    const lista = document.getElementById('lista-professores-cadastrados');
    if (!lista) return;

    try {
        const resposta = await fetch(API_PROFESSORES);
        const professores = await resposta.json();

        if (professores.length === 0) {
            lista.innerHTML = '<p>Nenhum professor cadastrado ainda.</p>';
        } else {
            lista.innerHTML = '';
            professores.forEach(prof => {
                lista.innerHTML += `
                    <div class="card-professor" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                        <strong>${prof.nome}</strong>
                        <span style="font-size:12px; color:#888;">Registro: ${prof.registroprofessor}</span>
                        <span style="font-size:12px; color:#888;">E-mail: ${prof.email}</span>
                        <button onclick="excluirProfessor(${prof.idUsuario})" style="margin-top:6px; background:#c0392b; color:#fff; border:none; border-radius:6px; padding:4px 10px; cursor:pointer; font-size:12px;">Excluir</button>
                    </div>
                `;
            });
        }
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<p>Erro ao carregar professores.</p>';
    }
}

async function cadastrarProfessor() {
    const registro = document.getElementById('reg-professor').value.trim();
    const nome = document.getElementById('nome-professor').value.trim();
    const email = document.getElementById('email-professor').value.trim();
    const senha = document.getElementById('senha-professor').value.trim();

    if (!registro || !nome || !email || !senha) {
        alert('Preencha todos os campos.');
        return;
    }

    try {
        const resposta = await fetch(API_PROFESSORES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registroprofessor: registro, nome, email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao cadastrar professor.');
            return;
        }

        alert('Professor cadastrado com sucesso!');
        document.getElementById('reg-professor').value = '';
        document.getElementById('nome-professor').value = '';
        document.getElementById('email-professor').value = '';
        document.getElementById('senha-professor').value = '';
        listarProfessoresCadastrados();
    } catch (erro) {
        console.error(erro);
        alert('Erro ao cadastrar professor. Verifique se o servidor está rodando.');
    }
}

async function excluirProfessor(id) {
    if (!confirm('Tem certeza que deseja excluir este professor?')) return;

    try {
        const resposta = await fetch(`${API_PROFESSORES}/${id}`, { method: 'DELETE' });

        if (!resposta.ok) {
            const dados = await resposta.json();
            alert(dados.erro || 'Erro ao excluir professor.');
            return;
        }

        alert('Professor excluído!');
        listarProfessoresCadastrados();
    } catch (erro) {
        console.error(erro);
        alert('Erro ao excluir professor.');
    }
}

listarProfessoresCadastrados();
