document.getElementById("matricula-form").addEventListener("submit", function(event) {
    event.preventDefault()

    var nome = document.getElementById("nome").value
    var cpf = document.getElementById("cpf").value
    var consulta = document.getElementById("consulta").value

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, cpf: cpf, consulta: consulta })
    })
    .then(response => response.text())
    .then(text => {
        console.log(text)
        alert('Seus dados foram enviados com sucesso!')
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error)
    })
})
