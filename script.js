function entrar() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const perfil = document.getElementById('perfil').value;

    if (!usuario || !senha || !perfil) {
        alert('Preencha todos os campos.');
        return;
    }


    if (perfil === 'organizador') {


        window.location.href = '../organizadores/index.html';
    }


    else if (perfil === 'professor') {
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
    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    const lista = document.getElementById('lista-projetos');

    if (!lista) return;

    if (projetos.length === 0) {
       
    } else {
        projetos.forEach(p => {
            lista.innerHTML += `
                <div class="card-curso" style="flex-direction: column; align-items: flex-start; gap: 6px;">
                    <strong>${p.nome}</strong>
                    <span style="font-size:13px; color:#555;">${p.descricao}</span>
                    <span style="font-size:12px; color:#888;">Professor: ${p.professor} · ${p.data}</span>
                </div>
            `;
        });
    }
}

listarProjetos();