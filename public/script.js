function submitForm(event) {
  // Get input field data by ID
  const recipientPublicKey = document.getElementById('recipient-public-key').value;



  document.getElementById('submitButton').value = 'Processing...';

  login(recipientPublicKey);

  // Prevent the form from refreshing the page
  event.preventDefault();
}

function login(recipientPublicKey) {
  axios.post('/login', {
    publicKey: recipientPublicKey
  })
    .then(function (response) {
      console.log(response);
      var messageEl = document.getElementById('message');
      messageEl.textContent = `${response.data}`;
      messageEl.style.color = 'green';
      document.getElementById('submitButton').value = 'success';
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      var messageEl = document.getElementById('message');
      messageEl.textContent = 'Invalid value!';
      messageEl.style.color = 'red';
      document.getElementById('submitButton').value = 'Log in';
    });
}
function check() {
  axios.post('/transfer-tokens', {
    bestScore: window.localStorage.getItem("bestScore"),
    score: window.localStorage.getItem("score")
  }).then((res) => {
    console.log(res.data.signature);
    let history=document.getElementById("history");
    history.innerHTML+=` <li class="list-group-item"><a href="https://explorer.solana.com/tx/${res.data.signature}?cluster=devnet">${res.data.signature} amount:  ${res.data.amount}SOL</a></li>`;
  })

}