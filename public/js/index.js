//Referencias HTML
const form = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://munguia-chat-node-socket-io.herokuapp.com/api/auth/';


form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const data={};
    for(let el of form.elements){
      
        if(el.name.length >0){
      
            data[el.name]=el.value;
        }

    }

    fetch(url+"login",{
        method:"POST",
        body:JSON.stringify(data),
        headers:{'content-type':'application/json'}
    })
    .then(res=>res.json())
    .then(({msj,token})=>{
        if(msj){
            return console.log(msj);
        }
        localStorage.setItem('token',token)
        window.location="chat.html"
    })
    .catch(err=>{
        console.log(err)
    })
  
})




      function handleCredentialResponse(response) {
        
        const body = { id_token: response.credential }
        fetch(url+"google", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then( r=> r.json() )
        .then( resp =>{
            console.log(resp )
            localStorage.setItem('email',resp.usuario.correo)
            localStorage.setItem('token',resp.token)
            
            window.location="chat.html"
          
        })
        .catch( console.warn )      }


      const btnLogoutGoogle= document.querySelector('#logout-google');

      btnLogoutGoogle.addEventListener('click',async ()=>{
     
      await   google.accounts.id.disableAutoSelect()
      await google.accounts.id.revoke(localStorage.getItem('email'), done => {
            console.log('consent revoked');
            localStorage.clear()
            
            location.reload()
        });
      })