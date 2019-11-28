function playPause(){
          var reproduciendo = true;
          var pista = document.getElementById('pista');
          var boton_play_pause = document.getElementById('boton_play_pause');
          boton_play_pause.onclick = function(){
             if(reproduciendo){
                reproduciendo = false;
                pista.pause();
                this.value=  ' Reproducir';
             }else{
                reproduciendo = true;
                pista.play();
                 this.value=  'Pausar';
             }
          }
       }
function nuevaEnfermedad(i)/* NO ANDA*/
{
     var bd=firebase.firestore();
     var tituloNuevo=$$('#tituloE').val();
     bd.collection('enfermedades').where('titulo','==',tituloNuevo).get()
     .then(function(querySnapshot){
         if(querySnapshot.size==0)
         {
             console.log("no existe");
             for (var j=0;j<=i-1;j++)
            {
                console.log("esta es la vuelta "+j);
                var paso=$$('#textoenfermedad'+j).val();
                /*Aca va insert a la base de datos*/
             
               var enf=bd.collection('enfermedades').doc();
               enf.set({
                   titulo:tituloNuevo,
                   Pasos:[paso],
                   },
                   {merge:true}
               )
               .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
            app.dialog.alert('Se ha cargado con exito una nueva enfermedad','Nueva enfermedad');
         }
         else
         {
              app.dialog.alert('Ya existe una enfermedad en la base de datos con ese titulo','Error');
         }
     });
  
}
function editarEnfermedad()
{
    
}
function cerrarSesion()
{
    alert("entro");
     firebase.auth().signOut()
     .then(function(){
        $$('#menu2').removeClass('visible').addClass('oculto');
        $$('#menu1').removeClass('oculto').addClass('visible');
        mainView.router.navigate("/index/");
     })
     .catch(function(error){
           console.log("error al cerrar sesion");
     });
}       
function iniciarSesion()
{

    var email=$$('#email').val(); 
    var clave=$$('#clave').val();
    firebase.auth().signInWithEmailAndPassword(email, clave)
    .then(function(){
        $$('#menu1').removeClass('visible').addClass('oculto');
        $$('#menu2').removeClass('oculto').addClass('visible');
         mainView.router.navigate("/homeAdmin/");
    })
    .catch(function(error) {
            
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') 
        {
            app.dialog.alert('Clave invalida','Inicio de sesion');
        }
        else 
        {
            //alert(errorMessage);
            app.dialog.alert('Mail invalido','Inicio de sesion');
        }

    });
}
function olvidoClave()
{
    var email=$$('#emailO').val(); 
    firebase.auth().sendPasswordResetEmail(email)
    .then(function() {
        app.dialog.alert('Se ha enviado el mail de recuperación de la cuenta','Inicio de sesion');
        mainView.router.navigate("/iniciarSesion/");   
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
}
function cargaBusqueda()
{
    var bd=firebase.firestore();
    var enfermedades=bd.collection('enfermedades').orderBy('titulo');
    enfermedades.get()
    .then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc)
        {
            console.log("titulo: "+ doc.data().titulo+" "+doc.data().titulo.length);
            
            $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="button item-title itemsConsulta"  id="'+doc.data().titulo+'">'+doc.data().titulo+'</button></div></li>');
        });
         $$(".itemsConsulta").on('click',function(){
            enfermedad=this.id; 
            mainView.router.navigate("/enfermedad/");
        });
    })
    .catch(function(error)
    {
        console.log('Error al recuperar los datos de la base', error);
    });
}

function cargarEnfermedad(enfermedad)
{
    var arreglo=[];
   
    var i=0;
   var bd=firebase.firestore();
    bd.collection('enfermedades').where('titulo','==',enfermedad).get()
     .then(function(querySnapshot)
     {
        querySnapshot.forEach(function(doc)
        {
            //console.log(doc.data().Pasos.length);
            
             doc.data().Pasos.forEach(function(element){

                   //  $$("#cajacarrusel").append('<div class="swiper-slide"><h4>'+element+'</h4></div>');
                    arreglo.push(element);
                    i++;
            });
           
            
            if(doc.data().Pasos.length===i)
            {
                var mySwiper = document.querySelector('.swiper-container').swiper;
                for(var j=0;j<i;j++)
                {
                    
                    //$$("#cajacarrusel").append('<div class="swiper-slide"><h4>'+arreglo[j]+'</h4></div><div class="swiper-button-prev"></div><div class="swiper-button-next" id="next"></div>');
                     var k=j+1;
                    if(j===0)
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><button class="play button button-fill " value="'+arreglo[j]+'"><i class="fas fa-play"></i></button><div class="swiper-button-next next"></div></div>');
                     }
                     else if(k===i)
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><div class="swiper-button-prev prev "></div><button class="play button button-fill" value="'+arreglo[j]+'"><i class="fas fa-play"></i></button></div>');
                     }
                     else
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><div class="swiper-button-prev prev "></div> <button class="play button button-fill" value="'+arreglo[j]+'"><i class="fas fa-play"></i></button><div class="swiper-button-next next"></div></div>');
                     }
                
                }
               $$('.next').on('click',function(){
                    mySwiper.slideNext();
               });
               $$('.prev').on('click',function(){
                    mySwiper.slidePrev();
              });
                 $$('.play').on('click',function(){
                    tas(this.value); //aca hace traduccion texto a voz en la web,no en la app
                    // aca en vez de esto va un boton de tipo audio para darle play/frenar
                    
              });
            }
        });
        
     })
     .catch(function(error){
         console.log('Error al recuperar los datos de la base',error);
     });
}


function tas(a)
{
     console.log(a);
    var msg = new SpeechSynthesisUtterance(a);
    msg.lang="es-ar";
    window.speechSynthesis.speak(msg);

}
