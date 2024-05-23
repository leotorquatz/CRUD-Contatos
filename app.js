// Autor: Leonardo Torquato de Andrade
// Data: 22/05/2024

document.addEventListener('DOMContentLoaded', function () {
    const contatosList = document.getElementById('contatos-list');
    const contatoForm = document.getElementById('contato-form');
    const contatoIdField = document.getElementById('contato-id');
    const adicionarBotao = document.getElementById('adicionar-btn');
    const salvarBotao = document.getElementById('salvar-btn');

    // Carrega os contatos
    function carregarContatos() {
        fetch('https://bakcend-fecaf-render.onrender.com/contatos')
            .then(response => response.json())
            .then(data => {
                contatosList.innerHTML = '';
                data.forEach(contato => {
                    const contatoDiv = document.createElement('div');
                    contatoDiv.classList.add('contact-item');
                    contatoDiv.innerHTML = `
                        <img src="${contato.foto}" alt="Foto de ${contato.nome}" class="contact-photo">
                        <div class="contact-details">
                            <div class="contact-name">${contato.nome}</div>
                            <div class="contact-info">Email: ${contato.email}</div>
                            <div class="contact-info">Telefone: ${contato.telefone || 'N/A'}</div>
                            <div class="contact-info">Endereço: ${contato.endereco || 'N/A'}</div>
                        </div>
                        <div class="contact-actions">
                            <button class="editar-btn" data-id="${contato.id}">Editar</button>
                            <button class="excluir-btn" data-id="${contato.id}">Excluir</button>
                        </div>
                    `;
                    contatosList.appendChild(contatoDiv);
                });
                document.querySelectorAll('.editar-btn').forEach(btn => {
                    btn.addEventListener('click', () => editarContato(btn.getAttribute('data-id')));
                });

                document.querySelectorAll('.excluir-btn').forEach(btn => {
                    btn.addEventListener('click', () => excluirContato(btn.getAttribute('data-id')));
                });
            })
            .catch(error => console.error('Erro ao carregar contatos:', error));
    }
    carregarContatos();
    contatoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const foto = document.getElementById('foto').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        fetch('https://bakcend-fecaf-render.onrender.com/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, foto, telefone, endereco })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao adicionar contato.');
        })
        .then(() => {
            carregarContatos();
            contatoForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar contato:', error));
    });

    // Edita contato
    function editarContato(id) {
        fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`)
            .then(response => response.json())
            .then(contato => {
                document.getElementById('nome').value = contato.nome;
                document.getElementById('email').value = contato.email;
                document.getElementById('foto').value = contato.foto;
                document.getElementById('telefone').value = contato.telefone;
                document.getElementById('endereco').value = contato.endereco;
                contatoIdField.value = contato.id;
                adicionarBotao.style.display = 'none';
                salvarBotao.style.display = 'inline-block';
            })
            .catch(error => console.error('Erro ao carregar contato:', error));
    }

    salvarBotao.addEventListener('click', function () {
        const id = contatoIdField.value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const foto = document.getElementById('foto').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, foto, telefone, endereco })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao editar contato.');
        })
        .then(() => {
            carregarContatos();
            contatoForm.reset();
            contatoIdField.value = '';

            adicionarBotao.style.display = 'inline-block';
            salvarBotao.style.display = 'none';
        })
        .catch(error => console.error('Erro ao editar contato:', error));
    });

    // excluir contato
    function excluirContato(id) {
        if (confirm("Certeza que deseja excluir este contato?")) {
            fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Contato com ID ${id} excluído com sucesso.`);
                    carregarContatos();
                } else {
                    response.text().then(errorMessage => {
                        throw new Error(`Erro ao excluir contato com ID ${id}: ${errorMessage}`);
                    });
                }
            })
            .catch(error => console.error(error));
        }
    }
});
