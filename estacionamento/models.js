class Pessoa {
    constructor(nome, documento) {
        this.nome = nome;
        this.documento = documento;
    }
}

class Cliente extends Pessoa {
    constructor(nome, documento) {
        super(nome, documento);
        this.id = Cliente.getNextId();
        this.veiculos = [];
    }

    static getNextId() {
        let nextId = localStorage.getItem('clienteNextId');
        nextId = nextId ? parseInt(nextId) + 1 : 1;
        localStorage.setItem('clienteNextId', nextId);
        return nextId;
    }

    adicionarVeiculo(veiculo) {
        this.veiculos.push(veiculo);
    }
}

class Funcionario extends Pessoa {
    constructor(nome, documento, matricula, cargo) {
        super(nome, documento);
        this.matricula = matricula;
        this.cargo = cargo;
    }
}

class Veiculo {
    constructor(placa, modelo, cor, tipo, clienteId) {
        this.placa = placa.toUpperCase(); // Placa sempre em maiúsculo
        this.modelo = modelo;
        this.cor = cor;
        this.tipo = tipo;
        this.clienteId = parseInt(clienteId);
    }
}

class RegistroEstacionamento {
    constructor(id, veiculo, cliente) {
        this.id = id;
        this.veiculo = veiculo;
        this.cliente = cliente;
        this.horaEntrada = new Date();
        this.horaSaida = null;
        this.valorCobrado = null;
    }
}