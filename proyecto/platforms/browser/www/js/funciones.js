function cargarInfoEnfermedad(info) 
{
    var titOr="";
    var bd=firebase.firestore();
    var storageService = firebase.storage();
    var storageRef = storageService.ref();
    var arregloPasoOriginal=[];
    var arregloAudioOriginal=[];
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
             // VER SI SIGUE SIENDO NECESARIO, YA QUE SE HACE Todo DENTRO DE ESTA FUNCION
            doc.data().Audios.forEach(function(element){
                arregloAudioOriginal.push(element);
            });

            $$('#editarpasos').append('<li class="item-content item-input espaciodown" ><div class="item-inner "><div class="item-title item-label ">Titulo</div><div class="row"><div class="col-75" ><input class="item-input-wrap"  id="tituloE"  value="'+doc.id+'" disabled/></div><div class="item-media"><a href="#" id="ediTit" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div></div></li>');
            $$('#ultimoul').append(' <li class="item-content item-input"><button class=" button button-small button-fill " id="masPasos">Mas Pasos</button> </li><li  class="item-content item-input" > <button id="guardar" class="col button button-small button-fill">Guardar</button></li>');
            for(var j=0;j<=cantPasos-1;j++)
            {
                $$('#infopasos').append('<div class="item-input-wrap" id="pasoNro'+j+'" > <div class="row  espacio"><button class=" button button-small button-fill eliminarPaso" id="'+j+'">Eliminar</button></div> <div class="row espacio"><textarea  class="gris  col-75" value="'+arregloPasoOriginal[j]+'" disabled id="paso'+j+'">'+arregloPasoOriginal[j]+'</textarea><div class="item-media"><a href="#" id="edi'+j+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div><div class="row bordeinferior espacio"><input type="file" class="audios oculto" name="audio'+j+'" id="audio'+j+'"> <audio src="'+arregloAudioOriginal[j]+'" id="audrep'+j+'"></audio><button class="col-75 playEditar button button-fill visible" id="audbot'+j+'">Reproducir</button><div class="item-media"><a href="#" id="audedi'+j+'" class="editarAudio col-10 visible" ><i class="fas fa-edit"></i></a></div></div> </div>');        
                console.log(j);
            }
            
            $$('.audios').on('change',function(){
                var url=document.getElementById(this.id).files[0];
                console.log("cambio: "+url);
                //getFileName(url);
                // el problema es que me agrega el paso al final del arreglo audio. deberia ver como hacerlo para meterlo en el lugar x
            });
            
            $$('#ediTit').on('click',function(){
                $$('#tituloE').prop('disabled', false);
                //elimino del storage la carpeta que estaba antes con el nombre anterior????
                titOr=$$('#tituloE').val();
                console.log("titulo orgiinal: "+titOr);
            });
            
            $$('#masPasos').on('click',function(){
                $$('#infoul').append('<div class="item-input-wrap" id="pasoNro'+cantPasosInfo+'" > 	<div class="row  espacio">		<button class=" button button-small button-fill eliminarPaso" id="'+cantPasosInfo+'">Eliminar</button>	</div>	<div class="row ">		<div class="item-title item-label">Texto </div>		<div class="item-input-wrap">			<textarea placeholder="Ingrese texto que va aparecer en el paso" id="paso'+cantPasosInfo+'"></textarea>			<span class="input-clear-button"></span>		</div>	</div>	<div class="row">		<div class="item-title item-label">Audio </div>		<div class="item-input-wrap bordeinferior">			<input type="file" class="audios visible" name="audio'+cantPasosInfo+'" id="audio'+cantPasosInfo+'">		</div>	</div></div>             ');
                cantPasosInfo++;
                $$('.eliminarPaso').on('click',function(){ // lo vuelvo a poner aca adentro pq lo agrego solo cuando apreto en click, sino no anda eleminar
                var id=parseInt(this.id);
                console.log("eliminar nro "+id);
                arregloEliminar.push(id);
                var audioEliminarBd=String($$('#audrep'+id).attr('src'));
                console.log(audioEliminarBd);
                var nn=audioEliminarBd.split('?'); 
                var urlAudio=nn[0].split('%2F'); //que el nombre no tenga espacios
                var titulo=$$('#tituloE').val();
                console.log(titulo);
                console.log(titulo+'/'+urlAudio[1]);
                var audioEl=storageRef.child(titulo+'/'+urlAudio[1]);
                    audioEl.delete()
                    .then(function() {
                        console.log("archivo eliminado con exito");
                    })
                    .catch(function(error) {
                        console.log("error al eliminar el audio del storage");
                    });
                    $$('#pasoNro'+id).remove();           
                });
            }); 
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
                var audioEliminarBd=String($$('#audrep'+id).attr('src'));
                console.log(audioEliminarBd);
                var nn=audioEliminarBd.split('?'); 
                var urlAudio=nn[0].split('%2F'); //que el nombre no tenga espacios
                var titulo=$$('#tituloE').val();
                console.log(titulo);
                console.log(titulo+'/'+urlAudio[1]);
                var audioEl=storageRef.child(titulo+'/'+urlAudio[1]);
                audioEl.delete()
                .then(function() {
                    console.log("archivo eliminado con exito");
                })
                .catch(function(error) {
                    console.log("error al eliminar el audio del storage");
                });
               $$('#pasoNro'+id).remove();               
            });
            
            $$('#guardar').on('click',function(){ 
                console.log("guardar");
                console.log("cantidad total de pasos "+cantPasosInfo);
                enf.delete();
                bd.collection('enfermedad').doc(info).set({
                    Pasos:[],
                    Audios:[]
                }); 
                for(var po;po<arregloEliminar.length;po++) /* solo para mostrar el arreglo en desarrollo, no srive para otra cosa, ELIMINAR una vez que anda*/
                {
                    console.log("arreglo: "+arregloEliminar[po]);
                }
                for(var l=0;l<cantPasosInfo;l++) 
                {
                    if(arregloEliminar.indexOf(l)===-1) //* Aca considerao los div que se pueden borrar*/
                    { console.log("l "+l);
                        var paso=$$('#paso'+l).val();
                        console.log("txt paso "  +paso);
                        enf.update({
                            Pasos:firebase.firestore.FieldValue.arrayUnion(paso)
                        });
                        if($$('#audio'+l).hasClass('visible')===true) // entra audio nuevo
                        {
                            var url=document.getElementById('audio'+l).files[0];
                            console.log(url);
                            
                            //getFileName(url);  
                            prueba(url,l);
                        }
                        else //uso audio viejo, me tira el audio mal ordenado en la bd, FALTA EL UPDATE del enf.
                            //pero no anda 
                        {
                            
                            var audioBd=String($$('#audrep'+l).attr('src'));
                            console.log("audio: "+audioBd);
                            lunes[l]=audioBd;
                            console.log("tam: "+ lunes.length);
                        }
                    }
                }   
            console.log("pp "+lunes.length);
                for(var ff;ff<lunes.length;ff++)
                {
                    console.log("ee: "+lunes[ff]);
                }
                app.dialog.alert('Se ha editado la enfermedad', 'Confirmacion',function()
                {
                    mainView.router.navigate("/homeAdmin/");
                });
            });

            $$('.playEditar').on('click',function(){
                var num=this.id.substr(6);
                var audio = document.getElementById("audrep"+num);
                var button = document.getElementById(this.id);
                if (audio.paused) 
                {
                    audio.play();
                    button.textContent = "Pausar";
                }
                else
                {
                    audio.pause();
                    button.textContent = "Reproducir";
                }
            });
        }
    });
}

function prueba(fileInput,l)
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
                lunes[l]=downloadURL;
                  console.log("tam1: "+ lunes.length);
                
            });
            console.log("subida completa");
        });
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
                    getFileName(url);
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
function getFileName(fileInput) 
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
    var storageService = firebase.storage();
    var storageRef = storageService.ref();
console.log(info);
     /*var audioEl=storageRef.child(info); //no anda, debeo eliminar la carpeta 
    audioEl.delete()
    .then(function() {
        console.log("archivo eliminado con exito");
           mainView.router.navigate("/homeAdmin/");
    })
    .catch(function(error) {
        console.log("error al eliminar el audio del storage");
    });*/
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
    var bd=firebase.firestore();
/*        PARA CREAR UNA NUEVA ENFERMEDAD
    var data={
        audios:{1:"audio1", 2:"audio2"},
        pasos:{1:"pasito a pasito 1", 2:"suave suavesito 2"}
    };
    bd.collection('enfermedad').doc('Anuevo').set(data).then(function() {
    console.log("Document successfully written!");
    });
*/
    /*bd.collection('enfermedad').doc('Anuevo').get() // PRUEBA DE OBTENER DATOS DEL MAP, no anda
    .then(function(querySnapshot) {
        querySnapshot.doc.map(function(doc) {
            console.log(doc.id, " => ", doc.data()); 
        });
    }); */
   var citiesRef = bd.collection('enf');
 //crear bd
 
/*
var data1={paso:"paso1",audio:"audi1"};
var data2={paso:"paso 2",audio:"aud 2"};

var landmarks = Promise.all([
    citiesRef.doc('Antes').collection('Pasos').doc("1").set(data1),
    citiesRef.doc('Antes').collection('Pasos').doc("2").set(data2),
]);
*/
//leer datos
/*
citiesRef.doc('Antes').collection('Pasos').get()
.then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().audio);
            console.log(doc.id," == ",doc.data().paso);
        });
    })
 .catch(function(error){
    console.log('Error al recuperar los datos de pasos de la base',error);
});
*/
//borrar doc entero, audio y paso
/*
citiesRef.doc('Antes').collection('Pasos').doc("1").delete()
.then(function(doc) {
      console.log("se borro");
    })
 .catch(function(error){
    console.log('Error al recuperar los datos de pasos de la base',error);
});
*/
//borrar solo un atributo
/*
var aa=citiesRef.doc('Antes').collection('Pasos').doc("2");
aa.get()
.then(function(doc) {
    console.log("doc "+doc.data().paso);
    aa.update({
        paso: firebase.firestore.FieldValue.delete()
    });

    })
 .catch(function(error){
    console.log('Error al recuperar los datos de pasos de la base',error);
});
*/
//modificar un atributo
/*
var aa=citiesRef.doc('Antes').collection('Pasos').doc("2");
aa.get()
.then(function(doc) {
    console.log("doc "+doc.data().paso);
    aa.update({
        paso:"lalalala"
    });

    })
 .catch(function(error){
    console.log('Error al recuperar los datos de pasos de la base',error);
});
*/
//agregar un doc 
/*
var data={
    paso:"ni idea",
    audio:"jeje"
}
var landmarks = Promise.all([
    citiesRef.doc('Antes').collection('Pasos').doc("3").set(data),
]);
*/
//eliminar un doc de enfermedad.. ANALIZAR 
/*
    for(var i=1;i<=2;i++)
    {
        var aa=String(i);
        citiesRef.doc('Antes').collection('Pasos').doc(aa).delete()
        .then(function(doc) {
              console.log("se borro ");
            })
         .catch(function(error){
            console.log('Error al recuperar los datos de pasos de la base',error);
        });
    }
 citiesRef.doc('Antes').delete()
        .then(function(doc) {
              console.log("se borro doc");
            })
         .catch(function(error){
            console.log('Error al recuperar los datos de pasos de la base',error);
        });
*/
}
/*
function cargarEnfermedad(enfermedad) //ANDA CON SUBCOLE
{
    var arregloPasos=[];
    var arregloAudios=[];
    var bd=firebase.firestore();
    bd.collection('enfermedad').doc(enfermedad).collection('Pasos').get()
    .then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc) 
        {
            arregloPasos.push(doc.data().valor);
        });
        bd.collection('enfermedad').doc(enfermedad).collection('Audios').get()
        .then(function(querySnapshot)
        {
            querySnapshot.forEach(function(doc) 
            {
                arregloAudios.push(doc.data().valor);
            });     
            var mySwiper = document.querySelector('.swiper-container').swiper;
            for(var j=0;j<arregloPasos.length;j++)
            {
                var k=j+1;
                if(j===0)
                {
                    mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arregloPasos[j]+'</b></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button><div class="swiper-button-next next"></div></div>');
                }
                else if(k===arregloPasos.length)
                {
                    mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="swiper-button-prev prev "></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio><button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div>');
                }
                else
                {
                    mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="swiper-button-prev prev "></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio> <button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button><div class="swiper-button-next next"></div></div>');
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
                if (audio.paused) 
                {
                    audio.play();
                    button.textContent = "Pausar";
                }
                else 
                {
                    audio.pause();
                    button.textContent = "Reproducir";
                }
             });
         })
         .catch(function(error){
             console.log('Error al recuperar los datos de audio de la base',error);
         });
     })
     .catch(function(error){
         console.log('Error al recuperar los datos de pasos de la base',error);
     });
}   
*/