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