function getClientes() {
    const clientesString = localStorage.getItem('clientes');
    return clientesString ? JSON.parse(clientesString).map(c => {
        const cliente = new Cliente(c.nome, c.documento);
        cliente.id = c.id;
        cliente.veiculos = c.veiculos.map(v => new Veiculo(v.placa, v.modelo, v.cor, v.tipo, v.clienteId));
        return cliente;
    }) : [];
}

function salvarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function adicionarCliente(nome, documento) {
    const clientes = getClientes();
    const novoCliente = new Cliente(nome, documento);
    clientes.push(novoCliente);
    salvarClientes(clientes);
    alert(`Cliente "${nome}" cadastrado com sucesso! (ID: ${novoCliente.id})`);
    document.getElementById('cadastroClienteForm').reset();
}

function adicionarVeiculo(modelo, placa, tipo, cor, clienteId) {
    const clientes = getClientes();
    const cliente = clientes.find(c => c.id === parseInt(clienteId));

    if (!cliente) {
        alert('Cliente não encontrado!');
        return;
    }

    if (cliente.veiculos.some(v => v.placa === placa.toUpperCase())) {
        alert(`A placa "${placa}" já está cadastrada para outro veículo!`);
        return;
    }

    const novoVeiculo = new Veiculo(placa, modelo, cor, tipo, clienteId);
    cliente.adicionarVeiculo(novoVeiculo);
    salvarClientes(clientes);
    alert(`Veículo "${modelo} - ${placa}" cadastrado para o cliente "${cliente.nome}"!`);
    document.getElementById('cadastroVeiculoForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const cadastroClienteForm = document.getElementById('cadastroClienteForm');
    if (cadastroClienteForm) {
        cadastroClienteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nome = document.getElementById('nomeCliente').value;
            const documento = document.getElementById('documentoCliente').value;
            adicionarCliente(nome, documento);
        });
    }

    const cadastroVeiculoForm = document.getElementById('cadastroVeiculoForm');
    if (cadastroVeiculoForm) {
        cadastroVeiculoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const modelo = document.getElementById('modeloVeiculo').value;
            const placa = document.getElementById('placaVeiculo').value;
            const tipo = document.getElementById('tipoVeiculo').value;
            const cor = document.getElementById('corVeiculo').value;
            const clienteId = document.getElementById('clienteIdVeiculo').value;
            adicionarVeiculo(modelo, placa, tipo, cor, clienteId);
        });
    }
});

function listarClientesComVeiculos() {
    const clientes = getClientes();
    const listaClientesVeiculos = document.getElementById('listaClientesVeiculos');

    if (listaClientesVeiculos) {
        if (clientes.length === 0) {
            listaClientesVeiculos.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
            return;
        }

        const ul = document.createElement('ul');
        clientes.forEach(cliente => {
            const liCliente = document.createElement('li');
            liCliente.innerHTML = `<strong>Cliente:</strong> ${cliente.nome} (Documento: ${cliente.documento}, ID: ${cliente.id})`;

            if (cliente.veiculos.length > 0) {
                const ulVeiculos = document.createElement('ul');
                cliente.veiculos.forEach(veiculo => {
                    const liVeiculo = document.createElement('li');
                    liVeiculo.textContent = `Veículo: ${veiculo.modelo} - Placa: ${veiculo.placa} (${veiculo.tipo}, Cor: ${veiculo.cor})`;
                    ulVeiculos.appendChild(liVeiculo);
                });
                liCliente.appendChild(ulVeiculos);
            } else {
                liCliente.innerHTML += ' - Nenhum veículo cadastrado.';
            }
            ul.appendChild(liCliente);
        });
        listaClientesVeiculos.appendChild(ul);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('registros.html')) {
        listarClientesComVeiculos();
        listarRegistrosFinalizados(); // Definido em estacionamento.js
    }
});