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
       
function cargarInfoEnfermedad(info)
{
    var bd=firebase.firestore();
    var p=0;
    var enf=bd.collection('enfermedad').doc(info);
    enf.get()
    .then(function(doc){
        if(doc.exists)    
        {
            $$('#editarpasos').append('<li class="item-content item-input espaciodown" ><div class="item-inner "><div class="item-title item-label ">Titulo</div><div class="item-input-wrap"> <b>'+doc.id+'</b> </div></div></li>');
            
            doc.data().Pasos.forEach(function(element){
                $$('#infopasos').append('<div class="item-input-wrap" > <div class="row"><input type="text" class="gris col-75" value="'+element+'" disabled id="paso'+p+'"/><div class="item-media"><a href="#" id="edi'+p+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div><div class="item-media"><a href="#" id="eli'+p+'" class="eliminar col-10" ><i class="fas fa-trash"></i></a></div></div></div>');        
                p++;
            });
            $$('#infopasos').append('<li>  <div class="item-inner" id="infopasos"><button id="guardar" class="col button button-small button-fill">Guardar</button></div></li>');
            $$('.editar').on('click',function(){
                console.log("editar");
                var num=this.id.substr(3);
                $$('#paso'+num).prop('disabled', false);
                $$('#paso'+num).removeClass('gris');
                /* habilitar el input para editar*/
            });
            $$('.eliminar').on('click',function(){
                var num=this.id.substr(3);
                 console.log("eliminar");
      
                /*eliminar el paso de la bd*/
            });
            $$('#guardar').on('click',function(){
                console.log("guardar");
                for(var l=0;l<=p-1;l++)
                {
                    bd.collection('enfermedad').doc(info).update({
                       "Pasos":[$$('#paso'+l).val()]
                    });
                }   
            });
        }
    });
}

function nuevaEnfermedad(i)
{
    var bd=firebase.firestore();
    var tituloNuevo=$$('#tituloE').val();
    var enf=bd.collection('enfermedad').doc(tituloNuevo);
    enf.get()
    .then(function(doc){
        if(doc.exists)    
        {
             app.dialog.alert('Ya existe una enfermedad con el mismo nombre cargada','Error');
        }
        else
        {
            enf.set({Pasos:[],})
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            console.log("no existe el doc");
            for (var j=0;j<=i-1;j++)
            {
                var paso=$$('#textoenfermedad'+j).val()
                console.log("paso nro "+j+": "+paso);
                enf.update({
                    Pasos:firebase.firestore.FieldValue.arrayUnion(paso)
                });
            }
            mainView.router.navigate("/homeAdmin/");
        }
    });
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
function cargaBusqueda(h)
{
    var bd=firebase.firestore();
    var enfermedades=bd.collection('enfermedad');
    enfermedades.get()
    .then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc)
        {
           
            
            $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="button item-title itemsConsulta"  id="'+doc.id+'">'+doc.id+'</button></div></li>');
        });
         $$(".itemsConsulta").on('click',function(){
         

            if(h=="h") {
                   enfermedad=this.id; 
                mainView.router.navigate("/enfermedad/");
            }
            else if(h=="e")
            {
                info=this.id;
                   mainView.router.navigate("/infoEnfermedad/");
            }

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

    bd.collection('enfermedad').doc(enfermedad).get()
    .then(function(doc)
    {
                //console.log(doc.data().Pasos.length);
            
         if(doc.exists)
         {
                 doc.data().Pasos.forEach(function(element){
            console.log(element);
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
      
         }
         else
         { console.log("no existe");}
        
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
