function cargarInfoEnfermedad(info) 
{
    var bd=firebase.firestore();
    var p=0;
    var arregloPasoOriginal=[];
    var arregloAudioOriginal=[];
    var arregloPasoNuevo=[];
    var arregloEliminar=[];
    var cantPasos=0;
    var enf=bd.collection('enfermedad').doc(info);
    enf.get()
    .then(function(doc){
        if(doc.exists)    
        {
            doc.data().Pasos.forEach(function(element){
                arregloPasoOriginal.push(element);
                cantPasos++;
            });
            cantPasosInfo=cantPasos; //Lo utilizo para luego cuando creo un nuevo paso saber que numero ponerle
            doc.data().Audios.forEach(function(element){
                arregloAudioOriginal.push(element);
            });

            $$('#editarpasos').append('<li class="item-content item-input espaciodown" ><div class="item-inner "><div class="item-title item-label ">Titulo</div><div class="item-input-wrap"> <b>'+doc.id+'</b> </div></div></li>');
            
           for(var j=0;j<=cantPasos-1;j++)
           {
                $$('#infopasos').append('<div class="item-input-wrap" id="pasoNro'+j+'" > <div class="row  espacio"><button class=" button button-small button-fill eliminarPaso" id="'+j+'">Eliminar</button></div> <div class="row espacio"><textarea  class="gris  col-75" value="'+arregloPasoOriginal[j]+'" disabled id="paso'+j+'">'+arregloPasoOriginal[j]+'</textarea><div class="item-media"><a href="#" id="edi'+j+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div><div class="row bordeinferior espacio"><input type="file" class="audios oculto" name="audio'+j+'" id="audio'+j+'"> <audio src="'+arregloAudioOriginal[j]+'" id="audrep'+j+'"></audio><button class="col-75 playEditar button button-fill visible" id="audbot'+j+'">Reproducir</button><div class="item-media"><a href="#" id="audedi'+j+'" class="editarAudio col-10 visible" ><i class="fas fa-edit"></i></a></div></div> </div>');        
           }
            
           $$('.editar').on('click',function(){
                var num=this.id.substr(3);
                $$('#paso'+num).prop('disabled', false);
                $$('#paso'+num).removeClass('gris');
            });
           $$('.editarAudio').on('click',function(){
                console.log("editar");
                var id=this.id.substr(6);
                console.log("nro audio: "+id);
                $$('#audbot'+id).removeClass('visible').addClass('oculto');
                $$('#audedi'+id).removeClass('visible').addClass('oculto');
                $$('#audio'+id).removeClass('oculto').addClass('visible');
            });

            $$('.eliminarPaso').on('click',function(){
                var id=parseInt(this.id);
                console.log("eliminar nro "+id);
                arregloEliminar.push(id);
                $$('#pasoNro'+id).remove();
                
            });
            $$('#guardar').on('click',function(){ /*NO ANDA*/
           // https://firebase.google.com/docs/storage/web/delete-files?authuser=1 
           
                console.log("guardar");
                
                for(var l=0;l<cantPasos;l++) 
                {
                    enf.delete();
                    bd.collection('enfermedad').doc(info).set({
                        Pasos:[],
                        Audios:[]
                    });
                    
                    if(arregloEliminar.indexOf(l)==-1) //* Aca considerao los div que se pueden borrar*/
                    {
                        var paso=$$('#paso'+l).val();
                        enf.update({
                            Pasos:firebase.firestore.FieldValue.arrayUnion(paso)
                        });
                        if($$('#audio'+l).hasClass('visible')==true) // entra audio nuevo
                        {
                              var url=document.getElementById('audio'+l).files[0];
                               getFileName(url,j);   /*NO ANDA*/
                        }
                        else //uso audio viejo
                        {
                            
                        }
                    }
                }   
               
                mainView.router.navigate("/homeAdmin/");
            });

            $$('.playEditar').on('click',function(){
                var num=this.id.substr(6);
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

function nuevaEnfermedad(i)
{
    var bd=firebase.firestore();
    var tituloNuevo=$$('#tituloE').val();
    var enf=bd.collection('enfermedad').doc(tituloNuevo);
    enf.get()
    .then(function(doc){
        if(!doc.exists)    
        {
             enf.set({Pasos:[],Audios:[],})
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            for (var j=0;j<i;j++)
            {
                               
                if(arregloPruebaEliminar.indexOf(j)==-1) // noesta en el arreglo
                {
                    var paso=$$('#textoenfermedad'+j).val();   
                    var url=document.getElementById('audio'+j).files[0];
                    console.log(url);
                    getFileName(url,j);
                    enf.update({
                        Pasos:firebase.firestore.FieldValue.arrayUnion(paso)
                    });
                }

            }
             app.dialog.alert('Se ha cargado una nueva enfermedad', 'Confirmacion',function()
                {
                    mainView.router.navigate("/homeAdmin/");
                });
        }
        else
        {
            app.dialog.alert('Ya existe una enfermedad con ese nombre','Error');
        }
    });
}
function getFileName(fileInput,i) 
{
    var storageService = firebase.storage();
    var bd=firebase.firestore();
    var tituloNuevo=$$('#tituloE').val();
    var enf=bd.collection('enfermedad').doc(tituloNuevo);
    enf.get()
    .then(function(doc){    
        var file = fileInput;
        var fileName = file.name;
        var url=$$('#tituloE').val();
        var storageRef = storageService.ref();
        var lal=storageRef.child(url+'/'+fileName)
        var uploadTask = lal.put(file);
        uploadTask.on('state_changed',null,function(error){
            console.log('Error al subir archivo',error)
        }, function(){
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                enf.update({
                    Audios:firebase.firestore.FieldValue.arrayUnion(downloadURL)
                });             
            });
            console.log("subida completa");
        });
    });
}

function cerrarSesion()
{
   // alert("entro");
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
            if(h=="el")
            {
               $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="button item-title itemsConsulta popup-open" data-popup=".popup-eliminar"  id="'+doc.id+'">'+doc.id+'</button></div></li>');   
            }
            else
            {
                $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="button item-title itemsConsulta"  id="'+doc.id+'">'+doc.id+'</button></div></li>');
            }

        });
        $$(".itemsConsulta").on('click',function(){
            if(h=="h") 
            {
                enfermedad=this.id; 
                mainView.router.navigate("/enfermedad/");
            }
            else if(h=="e")
            {
                info=this.id;
                mainView.router.navigate("/infoEnfermedad/");
            }
            else if(h=="el")
            {
                info=this.id;
                $$('#nombreEnfermedadEliminar').html(info);
            }
        });
    })
    .catch(function(error)
    {
        console.log('Error al recuperar los datos de la base', error);
    });
}

function eliminar()
{
    var bd=firebase.firestore();
    bd.collection('enfermedad').doc(info).delete()
    .then(function(){
        app.dialog.alert('Se ha eliminado la enfermedad','Eliminar',function(){
            app.popup.close('.popup-eliminar');
            mainView.router.navigate("/homeAdmin/");
        });
    })
    .catch(function(error)
    {
        console.log('Error al eliminar la enfermedad de la base', error);
    });
}

function cargarEnfermedad(enfermedad)
{
    var arreglo=[];
    var arregloAudios=[];
    var i=0;
    var ip=0;
    var bd=firebase.firestore();
    bd.collection('enfermedad').doc(enfermedad).get()
    .then(function(doc)
    {      
        if(doc.exists)
        {
            doc.data().Pasos.forEach(function(element){
                arreglo.push(element);
                i++;
            });
            doc.data().Audios.forEach(function(element){
                arregloAudios.push(element);
                ip++;
            }); 
            
            if(doc.data().Pasos.length===i && doc.data().Audios.length===ip)
            {
                var mySwiper = document.querySelector('.swiper-container').swiper;
                for(var j=0;j<i;j++)
                {
                    var k=j+1;
                    if(j===0)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arreglo[j]+'</b></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arreglo[j]+'">Reproducir</button><div class="swiper-button-next next"></div></div>');
                     }
                     else if(k===i)
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arreglo[j]+'</b></div><div class="swiper-button-prev prev "></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio><button class="play button button-fill" id="botonn'+j+'" value="'+arreglo[j]+'">Reproducir</button></div>');
                     }
                     else
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arreglo[j]+'</b></div><div class="swiper-button-prev prev "></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio> <button class="play button button-fill" id="botonn'+j+'" value="'+arreglo[j]+'">Reproducir</button><div class="swiper-button-next next"></div></div>');
                     }
                
                }
               $$('.next').on('click',function(){
                    mySwiper.slideNext();
               });
               $$('.prev').on('click',function(){
                    mySwiper.slidePrev();
              });
               $$('.play').on('click',function(){
        
                var num=this.id.substr(6);
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
                 $$('.playViejo').on('click',function(){
                //    tas(this.value); //aca hace traduccion texto a voz en la web,no en la app
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
