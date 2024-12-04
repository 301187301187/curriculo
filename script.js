if ('serviceWorker' in navigator) {
    window.addEventListener('load',function(){
        navigator.serviceWorker.register('./serviceworker.js')
        .then(registro => {
            console.log("El service worker registrado correctamente");
        })
        .catch(e =>{
            console.warn("El service worker no registrado",e);
        })
    })
}