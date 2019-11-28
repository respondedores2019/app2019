function cargarInfoEnfermedad(info) 
{
    var bd=firebase.firestore();
    var p=0;
    var arreglo=[];
    var audio=[];
    var enf=bd.collection('enfermedad').doc(info);
    enf.get()
    .then(function(doc){
        if(doc.exists)    
        {
            $$('#editarpasos').append('<li class="item-content item-input espaciodown" ><div class="item-inner "><div class="item-title item-label ">Titulo</div><div class="item-input-wrap"> <b>'+doc.id+'</b> </div></div></li>');
            
            doc.data().Pasos.forEach(function(element){
                $$('#infopasos').append('<div class="item-input-wrap" > <div class="row espacio"><textarea  class="gris col-75" value="'+element+'" disabled id="paso'+p+'">'+element+'</textarea><div class="item-media"><a href="#" id="edi'+p+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div><div class="item-media"><a href="#" id="eli'+p+'" class="eliminar col-10" ><i class="fas fa-trash"></i></a></div></div><div class="row bordeinferior espacio"><audio src="vaca.mp3" id="audrep'+p+'"></audio><button class="col-75 playEditar button button-fill" id="audbot'+p+'">Reproducir</button><div class="item-media"><a href="#" id="audedi'+p+'" class="editarAudio col-10" ><i class="fas fa-edit"></i></a></div><div class="item-media"><a href="#" id="audeli'+p+'" class="eliminarAudio col-10" ><i class="fas fa-trash"></i></a></div></div></div>');        
                p++;
                cantPasosInfo=p;
            });
            
           $$('.editar').on('click',function(){
                console.log("editar");
                var num=this.id.substr(3);
                $$('#paso'+num).prop('disabled', false);
                $$('#paso'+num).removeClass('gris');
            });
             $$('.editarAudio').on('click',function(){
                console.log("editar");
               /* FALTA EDITAR AUDIO*/
            });
              $$('.elimiarAudio').on('click',function(){
                console.log("eliminar");
               /* FALTA eliminar AUDIO*/
            });
            $$('.eliminar').on('click',function(){
                var num=this.id.substr(3);
                 console.log("eliminar");
      
                /*FALTA eliminar el paso de la bd*/
            });
            $$('#guardar').on('click',function(){ /* guardar el audio*/
                console.log("guardar");
                for(var l=0;l<=p-1;l++)  /* crear oto arreglo y guardar los audios*/
                {
                     arreglo.push($$('#paso'+l).val());
                    // audio.push($$('#paso'+l).val());
                }   
                enf.delete();
                bd.collection('enfermedad').doc(info).set({
                    Pasos:[]
                });
                for (var l=0;l<=p-1;l++) /* aduios*/
                {
                    enf.update({
                        Pasos:firebase.firestore.FieldValue.arrayUnion(arreglo[l]),
                        //Pasos:firebase.firestore.FieldValue.arrayUnion(audio[l])
                    });
                }
            });

            $$('.playEditar').on('click',function(){
                var num=this.id.substr(6);
                console.log("numero: "+num);
                var audio = document.getElementById("audrep"+num);
                var button = document.getElementById(this.id);
                if (audio.paused) {
                   audio.play();
                   button.textContent = "Pausar";
                  
                       } else {
                          audio.pause();
                          button.textContent = "Reproducir";
                       }
            });
        }
    });
}
function getFileName(fileInput,i) 
{
    var storageService = firebase.storage();
    var bd=firebase.firestore();
    var tituloNuevo=$$('#tituloE').val();
    var enf=bd.collection('enfermedad').doc(tituloNuevo);
    enf.set({Pasos:[],Audios:[],})
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    var file = fileInput.files[0];
    var fileName = file.name;
    var url=$$('#tituloE').val();
    var storageRef = storageService.ref();
    var lal=storageRef.child(url+'/'+fileName)
    var uploadTask = lal.put(file);
    uploadTask.on('state_changed',null,function(error){
        console.log("adentro");
        console.log('Error al subir archivo',error)
    }, function(){
        console.log('Subida completa');
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
            enf.update({
                Audios:firebase.firestore.FieldValue.arrayUnion(downloadURL)
            });
            console.log('subida en db');
        });
    });
    $$('#audio'+i).prop('disabled', true);  
};

function nuevaEnfermedad(i)
{
    var bd=firebase.firestore();

    var tituloNuevo=$$('#tituloE').val();
    var enf=bd.collection('enfermedad').doc(tituloNuevo);
    enf.get()
    .then(function(doc){
        if(doc.exists)    
        {
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
