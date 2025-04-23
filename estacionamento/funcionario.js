function getFuncionarios() {
    const funcionariosString = localStorage.getItem('funcionarios');
    return funcionariosString ? JSON.parse(funcionariosString).map(f => new Funcionario(f.nome, f.documento, f.matricula, f.cargo)) : [];
}

function salvarFuncionarios(funcionarios) {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

function adicionarFuncionario(nome, documento, matricula, cargo) {
    const funcionarios = getFuncionarios();
    const novoFuncionario = new Funcionario(nome, documento, matricula, cargo);
    funcionarios.push(novoFuncionario);
    salvarFuncionarios(funcionarios);
    alert(`Funcionário "${nome}" (Matrícula: ${matricula}) cadastrado com sucesso!`);
    document.getElementById('cadastroFuncionarioForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const cadastroFuncionarioForm = document.getElementById('cadastroFuncionarioForm');
    if (cadastroFuncionarioForm) {
        cadastroFuncionarioForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nome = document.getElementById('nomeFuncionario').value;
            const documento = document.getElementById('documentoFuncionario').value;
            const matricula = document.getElementById('matriculaFuncionario').value;
            const cargo = document.getElementById('cargoFuncionario').value;
            adicionarFuncionario(nome, documento, matricula, cargo);
        });
    }
});