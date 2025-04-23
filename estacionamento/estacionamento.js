function getRegistros() {
    const registrosString = localStorage.getItem('registros');
    return registrosString ? JSON.parse(registrosString).map(r => {
        const clienteData = r.cliente;
        const cliente = new Cliente(clienteData.nome, clienteData.documento);
        cliente.id = clienteData.id;
        cliente.veiculos = clienteData.veiculos.map(v => new Veiculo(v.placa, v.modelo, v.cor, v.tipo, v.clienteId));
        return new RegistroEstacionamento(r.id, new Veiculo(r.veiculo.placa, r.veiculo.modelo, r.veiculo.cor, r.veiculo.tipo, r.veiculo.clienteId), cliente);
    }) : [];
}

function salvarRegistros(registros) {
    localStorage.setItem('registros', JSON.stringify(registros));
}

function encontrarVeiculoPorPlaca(placa) {
    const clientes = getClientes();
    for (const cliente of clientes) {
        const veiculo = cliente.veiculos.find(v => v.placa === placa.toUpperCase());
        if (veiculo) {
            return { cliente, veiculo };
        }
    }
    return null;
}

function registrarEntrada(idRegistro, placaVeiculo, documentoCliente) {
    const registros = getRegistros();

    if (registros.some(r => r.veiculo.placa === placaVeiculo.toUpperCase() && !r.horaSaida)) {
        alert(`O veículo com placa "${placaVeiculo}" já está estacionado!`);
        return;
    }

    const veiculoInfo = encontrarVeiculoPorPlaca(placaVeiculo);
    if (!veiculoInfo) {
        alert(`Veículo com placa "${placaVeiculo}" não encontrado!`);
        return;
    }

    const clienteInfo = getClientes().find(c => c.documento === documentoCliente);
    if (!clienteInfo || clienteInfo.id !== veiculoInfo.veiculo.clienteId) {
        alert(`Cliente com documento "${documentoCliente}" não corresponde ao dono do veículo!`);
        return;
    }

    const novoRegistro = new RegistroEstacionamento(parseInt(idRegistro), veiculoInfo.veiculo, clienteInfo);
    registros.push(novoRegistro);
    salvarRegistros(registros);
    alert(`Entrada do veículo "${placaVeiculo}" registrada para o cliente "${clienteInfo.nome}"! (Registro ID: ${novoRegistro.id})`);
    document.getElementById('entradaForm').reset();
}

function registrarSaida(idRegistroSaida) {
    const registros = getRegistros();
    const registro = registros.find(r => r.id === parseInt(idRegistroSaida));

    if (!registro) {
        alert(`Registro com ID "${idRegistroSaida}" não encontrado!`);
        return;
    }

    if (registro.horaSaida) {
        alert(`A saída para o registro "${idRegistroSaida}" já foi registrada!`);
        return;
    }

    registro.horaSaida = new Date();
    const diffHoras = (registro.horaSaida.getTime() - registro.horaEntrada.getTime()) / (1000 * 60 * 60);

    let valorCobrado = 10;
    if (diffHoras > 1) {
        valorCobrado += Math.floor(diffHoras - 1) * 5;
    }
    registro.valorCobrado = parseFloat(valorCobrado.toFixed(2));
    salvarRegistros(registros);
    alert(`Saída do veículo "${registro.veiculo.placa}" registrada. Valor cobrado: R$ ${registro.valorCobrado}`);
    document.getElementById('saidaForm').reset();
}

function listarVeiculosEstacionados() {
    const registros = getRegistros();
    const estacionados = registros.filter(r => r.horaEntrada && !r.horaSaida);
    const listaEstacionados = document.getElementById('listaVeiculosEstacionados');

    if (listaEstacionados) {
        if (estacionados.length === 0) {
            listaEstacionados.innerHTML = '<p>Nenhum veículo estacionado no momento.</p>';
            return;
        }

        const ul = document.createElement('ul');
        estacionados.forEach(registro => {
            const li = document.createElement('li');
            li.textContent = `Placa: ${registro.veiculo.placa} - Modelo: ${registro.veiculo.modelo} (Cliente: ${registro.cliente.nome})`;
            ul.appendChild(li);
        });
        listaEstacionados.appendChild(ul);
    }
}

function listarRegistrosFinalizados() {
    const registros = getRegistros();
    const finalizados = registros.filter(r => r.horaSaida && r.valorCobrado !== null);
    const listaFinalizados = document.getElementById('listaRegistrosFinalizados');

    if (listaFinalizados) {
        if (finalizados.length === 0) {
            listaFinalizados.innerHTML = '<p>Nenhum registro finalizado.</p>';
            return;
        }

        const ul = document.createElement('ul');
        finalizados.forEach(registro => {
            const li = document.createElement('li');
            const horaEntradaFormatada = registro.horaEntrada.toLocaleString();
            const horaSaidaFormatada = registro.horaSaida.toLocaleString();
            li.innerHTML = `<strong>ID:</strong> ${registro.id}<br>` +
                           `<strong>Veículo:</strong> ${registro.veiculo.modelo} - Placa: ${registro.veiculo.placa}<br>` +
                           `<strong>Cliente:</strong> ${registro.cliente.nome}<br>` +
                           `<strong>Entrada:</strong> ${horaEntradaFormatada}<br>` +
                           `<strong>Saída:</strong> ${horaSaidaFormatada}<br>` +
                           `<strong>Valor Cobrado:</strong> R$ ${registro.valorCobrado}`;
            ul.appendChild(li);
        });
        listaFinalizados.appendChild(ul);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const entradaForm = document.getElementById('entradaForm');
    if (entradaForm) {
        entradaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const idRegistro = document.getElementById('idEntrada').value;
            const placaVeiculo = document.getElementById('veiculoEntrada').value;
            const documentoCliente = document.getElementById('clienteEntrada').value;
            registrarEntrada(idRegistro, placaVeiculo, documentoCliente);
        });
    }

    const saidaForm = document.getElementById('saidaForm');
    if (saidaForm) {
        saidaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const idRegistroSaida = document.getElementById('idSaida').value;
            registrarSaida(idRegistroSaida);
        });
    }

    if (window.location.pathname.endsWith('registros.html')) {
        listarVeiculosEstacionados();
    }
});