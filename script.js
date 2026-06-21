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

function criarprojeto() {
    const nomprojeto = document.getElementById('nomprojeto').value;
    const descproj = document.getElementById('descproj').value;
    const professores = document.getElementById('professores').value;

    if (!nomprojeto || !descproj || !professores) {
        alert('Preencha todos os campos.');
        return;
    }

    const projeto = {
        nome: nomprojeto,
        descricao: descproj,
        professor: professores,
        data: new Date().toLocaleDateString('pt-BR')
    };

    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    projetos.push(projeto);
    localStorage.setItem('projetos', JSON.stringify(projetos));

    alert('Projeto criado com sucesso!');
    window.location.href = '../../pagprofessores/index.html';
}

function listarProjetos() {
    const lista = document.getElementById('lista-projetos');
    if (!lista) return;

    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');

    if (projetos.length === 0) {
        lista.innerHTML = '<p>Nenhum projeto criado ainda.</p>';
    } else {
        projetos.forEach((p, index) => {
            lista.innerHTML += `
                <div class="card-curso" style="flex-direction: column; align-items: flex-start; gap: 6px; cursor: pointer;" onclick="irEditar(${index})">
                    <strong>${p.nome}</strong>
                    <span style="font-size:13px; color:#555;">${p.descricao}</span>
                    <span style="font-size:12px; color:#888;">Professor: ${p.professor} · ${p.data}</span>
                </div>
            `;
        });
    }
}

function irEditar(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'editarprojeto/index.html';
}

function salvareditar() {
    const index = localStorage.getItem('editIndex');
    const nomprojeto = document.getElementById('nomprojeto').value;
    const descproj = document.getElementById('descproj').value;
    const professores = document.getElementById('professores').value;

    if (!nomprojeto || !descproj || !professores) {
        alert('Preencha todos os campos.');
        return;
    }

    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    projetos[index] = {
        nome: nomprojeto,
        descricao: descproj,
        professor: professores,
        data: projetos[index].data
    };

    localStorage.setItem('projetos', JSON.stringify(projetos));
    alert('Projeto atualizado!');
    window.location.href = '../../pagprofessores/index.html';
}

function excluirprojeto() {
    const index = localStorage.getItem('editIndex');
    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');

    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        projetos.splice(index, 1);
        localStorage.setItem('projetos', JSON.stringify(projetos));
        alert('Projeto excluído!');
        window.location.href = '../../pagprofessores/index.html';
    }
}

function carregarEdicao() {
    if (!window.location.href.includes('editarprojeto')) return;

    const index = localStorage.getItem('editIndex');
    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    const p = projetos[index];

    if (!p) return;

    document.getElementById('nomprojeto').value = p.nome;
    document.getElementById('descproj').value = p.descricao;
    document.getElementById('professores').value = p.professor;
}

function carregarProfessores() {
    const lista = document.getElementById('lista-professores');
    if (!lista) return;

    const params = new URLSearchParams(window.location.search);
    const curso = params.get('curso');

    if (curso) {
        document.getElementById('titulo-curso').textContent = curso;
    }

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

function carregarProjetosProfessor() {
    const lista = document.getElementById('lista-projetos-professor');
    if (!lista) return;

    const professor = localStorage.getItem('profSelecionado');

    if (professor) {
        document.getElementById('titulo-professor').textContent = professor;
    }

    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    const filtrados = projetos.filter(p => p.professor === professor);

    if (filtrados.length === 0) {
        lista.innerHTML = '<p>Nenhum projeto cadastrado para este professor.</p>';
    } else {
        filtrados.forEach(p => {
            lista.innerHTML += `
                <div class="card-professor" style="flex-direction: column; align-items: flex-start; gap: 6px;">
                    <strong>${p.nome}</strong>
                    <span style="font-size:13px; color:#555;">${p.descricao}</span>
                    <span style="font-size:12px; color:#888;">${p.data}</span>
                </div>
            `;
        });
    }
}

function popularProfessores() {
    const select = document.getElementById('professores');
    if (!select) return;

    const todosProfessores = [
        'Ebert', 'Vitor', 'Alexandre', 'Fabricio Vasconcelos'
    ];

    todosProfessores.forEach(nome => {
        const option = document.createElement('option');
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
    });
}

popularProfessores();
carregarProfessores();
carregarProjetosProfessor();
listarProjetos();
carregarEdicao();