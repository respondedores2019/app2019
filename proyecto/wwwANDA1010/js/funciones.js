function cargarInfoEnfermedad(info)
{
    console.log("nrombre d einformacion: "+info);
    var bd=firebase.firestore();
    var arregloAudios=[];
    var arregloPasos=[];
    var cont=1;
    bd.collection('subcatalogo').doc(info).get()
    .then(function(doc){
        var cantidad=doc.data().cantidad;
        nroNuevoPasoE=cantidad+1; //para arrancar dsd ese nro el nuevo paso
        console.log("cantidad: "+cantidad);
        bd.collection('subcatalogo').doc(info).collection('Pasos').get()
        .then(function(querySnapshot)
        {
            querySnapshot.forEach(function(doc) 
            {
                arregloPasos.push(doc.data().valor);
            });
            bd.collection('subcatalogo').doc(info).collection('Audios').get()
            .then(function(querySnapshot)
            {
                querySnapshot.forEach(function(doc) 
                {
                    arregloAudios.push(doc.data().valor);
                });    
                $$('#tituloEditar').append('<div class="card-header"><b>Titulo</b></div><div class="card-content card-content-padding"><div class="row"><input type="text" id="tituloE" class="colorFondo" value="'+info+'" disabled/></div> </div>');                 
               /* $$('#ediTit').on('click',function(){
                    console.log("aprete editar titulo");
                   // $$('#tituloE').prop('disabled', false);
                    $$('#tituloE').removeClass('colorFondo');
                });*/
                for(var j=0;j<=cantidad-1;j++)
                {
                    var i=j+1;
                    $$('#pasosEditar').append('<div class="card" id="paso'+i+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding"> <div class="row"><textarea id="textoPaso'+i+'" value="'+arregloPasos[j]+'" class="colorFondo col-75" disabled>'+arregloPasos[j]+'</textarea> <div class="item-media"><a href="#" id="edi'+i+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div></div><div class="card-content card-content-padding row"><input type="file" class="audios oculto" name="audio'+i+'" id="audio'+i+'"><audio src="'+arregloAudios[j]+'" id="audrep'+i+'"></audio><button class="col-75 playEditar button button-fill visible" id="audbot'+i+'">Reproducir</button><div class="item-media"><a href="#" id="audedi'+i+'" class="editarAudio col-10 visible" ><i class="fas fa-edit"></i></a> </div></div><div class="card-footer"><button class=" button button-small button-fill eliminarPaso" id="'+i+'">Eliminar</button></div></div>');                    
                }
                $$('#botonesExtra').append('<div class="list no-hairlines-md"><ul><li class="item-content item-input"><button class=" button button-small button-fill masPaso" id="masPaso">Mas Pasos</button> </li><li class="item-content item-input"><button class=" button button-small button-fill botonInicio" id="guardarEnfermedad">Guardar enfermedad</button> </li></ul></div>');
                $$('#guardarEnfermedad').on('click',function(){
                    console.log("guardar editar enfermedad");
                    var enf=bd.collection('subcatalogo').doc(info);
                    enf.get()
                    .then(function(doc){
                        console.log("nro de pasos total nuevos: "+nroNuevoPasoE);
                        for(var ii=1;ii<=doc.data().cantidad;ii++)
                        {
                            var aa=String(ii);
                            enf.collection('Pasos').doc(aa).delete()
                            .then(function(doc) {
                                console.log("se borro ");
                            })
                            .catch(function(error){
                                console.log('Error al eliminar pasos ',error);
                            });
                            enf.collection('Audios').doc(aa).delete()
                            .then(function(doc) {
                                console.log("se borro ");
                            })
                            .catch(function(error){
                                console.log('Error al eliminar audios',error);
                            });
                        }
                        for (var jj=1;jj<nroNuevoPasoE;jj++)
                        {
                            console.log("jj "+jj);
                            console.log(" "+arregloEliminarE.indexOf(jj));
                            var nroDoc=String(cont);
                            console.log("nro: "+nroDoc);
                            if(arregloEliminarE.indexOf(jj)===-1) // noesta en el arreglo
                            {
                            var paso=$$('#textoPaso'+jj).val();
                                console.log("paso: "+paso);                           
                                if($$('#audio'+jj).hasClass('visible')===true) // falta eliminar el audio viejo del storage
                                {
                                    console.log("nuevo audio "+jj);
                                    var url=document.getElementById('audio'+jj).files[0];
                                    console.log(url);
                                    getFileName(url,cont);  
                                }
                                else
                                {
                                    if($$('#audio'+jj).hasClass('nuevoPaso')===true)
                                    {
                                        console.log("nuevo audio denuevo paso"+jj);
                                        var url2=document.getElementById('audio'+jj).files[0];
                                        console.log(url2);
                                        getFileName(url2,cont);   
                                    }
                                    else
                                    {
                                        console.log("audio viejo "+jj);
                                        var audioBd=String($$('#audrep'+jj).attr('src'));
                                        console.log("audio: "+audioBd);                                       
                                        var dataAud={
                                            valor:audioBd,
                                        };
                                        bd.collection('subcatalogo').doc(info).collection('Audios').doc(nroDoc).set(dataAud);                    
                                    }           
                                }
                                var data={
                                    valor:paso,
                                };
                                bd.collection('subcatalogo').doc(info).collection('Pasos').doc(nroDoc).set(data);
                                cont++;                              
                            }
                        }
                        var data1={
                            cantidad:cont-1
                        };
                        bd.collection('subcatalogo').doc(info).set(data1);
              
                        app.dialog.alert('Se ha cargado una nueva enfermedad', 'Confirmacion',function()
                        {
                            arregloEliminarE=[];
                            mainView.router.navigate("/homeAdmin/");
                        });                    
                    }); 
                });
                $$('#masPaso').on('click',function(){
                    console.log("nro nuevo paso:" +nroNuevoPasoE);
                    $$('#pasosEditar').append('<div class="card" id="paso'+nroNuevoPasoE+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding"><textarea placeholder="Ingrese el texto del paso" id="textoPaso'+nroNuevoPasoE+'" class="colorFondo"></textarea><div class="oculto textoerror" id="errortextoenfermedad'+nroNuevoPasoE+'" >Completar este campo.</div></div><div class="card-content card-content-padding"><input type="file" class="audios nuevoPaso" name="audio'+nroNuevoPasoE+'" id="audio'+nroNuevoPasoE+'"  ><div class="oculto textoerror" id="erroraudio'+nroNuevoPasoE+'" >Completar este campo.</div></div><div class="card-footer"><button class=" button button-small button-fill eli eliminarPaso" id="'+nroNuevoPasoE+'">Eliminar</button></div></div>');
                    nroNuevoPasoE++;
                    $$('.eliminarPaso').on('click',function(){ 
                        var id= parseInt(this.id);
                        console.log("eliminar id: "+id);
                        arregloEliminarN.push(id);
                        $$('#paso'+id).remove();
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
                $$('.editar').on('click',function(){
                    var num=this.id.substr(3);
                     console.log("id editar paso: "+num);
                    $$('#textoPaso'+num).prop('disabled', false);
                    $$('#textoPaso'+num).removeClass('colorFondo');
                });
                $$('.editarAudio').on('click',function(){
                    console.log("editar");
                    var id=this.id.substr(6);
                    console.log("id audio: "+id);
                    $$('#audbot'+id).removeClass('visible').addClass('oculto');
                    $$('#audedi'+id).removeClass('visible').addClass('oculto');
                    $$('#audio'+id).removeClass('oculto').addClass('visible');
                });
                $$('.eliminarPaso').on('click',function(){
                    var id= parseInt(this.id);
                    console.log("eliminar id: "+id);
                    arregloEliminarE.push(id);
                    $$('#paso'+id).remove();
        });
            })
            .catch(function(error){
                console.log('Error al recuperar los datos de pasos de la base',error);
            });
        })
        .catch(function(error){
            console.log('Error al recuperar los datos de audios de la base',error);
        });
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de la base',error);
    });
}

function nuevaEnfermedad(i)
{
    var bd=firebase.firestore();
    var cont=1; //para que el doc se llame consecutivo
    var titulo=$$('#tituloE').val();
    var minu=titulo.toLowerCase();
    var mayTitulo=minu.charAt(0).toUpperCase() + minu.slice(1);
    var tipo=$$('#tipoCat').val();
    console.log("tipo: "+tipo);
    if(tipo==1) // es una subcategoria
    {
        console.log("es una subcategoria");
        var cat=$$('#idCat').val();
        console.log("cat :"+cat);  
        var catalogo=bd.collection('catalogo').doc(cat);
        catalogo.get()
        .then(function(doc){
            catalogo.update({
                Titulos:firebase.firestore.FieldValue.arrayUnion(mayTitulo)
            }); 
            console.log("cantidad: "+doc.data().cantidad);
            var cc=doc.data().cantidad+1;
            var cant={
                cantidad:cc
            };
            catalogo.update(cant);
               mainView.router.navigate("/homeAdmin/");
        });
    }
    else // es una categoria
    {
        console.log("es una categoria");
        var data={
            Titulos:[mayTitulo],
            cantidad:1,
        };
        bd.collection('catalogo').doc(mayTitulo).set(data);
    }
    var enf=bd.collection('subcatalogo').doc(mayTitulo);
    enf.get()
    .then(function(doc){
        if(!doc.exists)    
        {
            for (var j=1;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)==-1) // noesta en el arreglo
                {
                    var paso=$$('#textoenfermedad'+j).val();   
                    console.log("paso: "+paso);
                    var url=document.getElementById('audio'+j).files[0];
                    console.log(url);
                    getFileName(url,cont);
                    var data={
                        valor:paso,
                    };
                    var nroDoc=String(cont);
                    bd.collection('subcatalogo').doc(mayTitulo).collection('Pasos').doc(nroDoc).set(data).then(function() {
                        console.log("Document successfully written!");
                    });
                    cont++;
                }
            }            
            var data1={
                cantidad:cont-1
            };
            bd.collection('subcatalogo').doc(mayTitulo).set(data1);
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
function getFileName(fileInput,cont) 
{
    var storageService = firebase.storage();
    var bd=firebase.firestore();
    var titulo=$$('#tituloE').val();
    var minu=titulo.toLowerCase();
    var mayTitulo=minu.charAt(0).toUpperCase() + minu.slice(1);
    var enf=bd.collection('subcatalogo').doc(mayTitulo);
    enf.get()
    .then(function(doc){    
        var file = fileInput;
        var fileName = file.name;
        var storageRef = storageService.ref();
        var lal=storageRef.child(mayTitulo+'/'+fileName)
        var uploadTask = lal.put(file);
        uploadTask.on('state_changed',null,function(error){
            console.log('Error al subir archivo',error)
        }, function(){
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                var data={
                    valor:downloadURL,
                };
                var nroDoc=String(cont);
                bd.collection('subcatalogo').doc(mayTitulo).collection('Audios').doc(nroDoc).set(data).then(function() {
                    console.log("Document successfully written!");
                });
            });
            console.log("subida completa");
        });
    });
}

function cerrarSesion()
{
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
function guardarCategoria()
{
    var bd=firebase.firestore();
    var cat=$$('#titCategoria').val();
    var minu=cat.toLowerCase();
    var mayTitulo=minu.charAt(0).toUpperCase() + minu.slice(1);
    console.log("cate: "+mayTitulo);
    bd.collection('catalogo').doc(mayTitulo).get()
    .then(function(doc){
        if(!doc.exists)
        {
            var data={
                cantidad:0,
                Titulos:[],
            }
            bd.collection('catalogo').doc(mayTitulo).set(data);
            app.dialog.alert('Se ha cargado una nueva categoria', 'Confirmacion',function()
            {
                mainView.router.navigate("/homeAdmin/");
            });
        }
        else
        {
            app.dialog.alert('Ya existe una categoria con ese nombre','Error');
        }
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de pasos de la base',error);
    });
}
function eliminoVacios()
{
    console.log("dentro de funcion elimino");
    var bd=firebase.firestore();
    bd.collection('catalogo').where('cantidad','==',0).get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            bd.collection('catalogo').doc(doc.id).delete();       
            console.log("eliminado");
        });   
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de pasos de la base',error);
    });
}
function cargaBusqueda(h) 
{
    var bd=firebase.firestore();
    bd.collection('catalogo').where('cantidad','>',0).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            console.log("titulos principales: "+doc.id);
            console.log("cant: "+doc.data().Titulos.length);
            var cantidad=doc.data().Titulos.length;          
            if(h==="el")
            {
                if(cantidad===1)
                {
                    console.log('titulo '+doc.data().Titulos[0]);
                    if(doc.data().Titulos[0] !==doc.id)
                    {  //si el nombre del boton es muy grande, que se achique la letra
                        $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'" >'+doc.id+'</button></div></li>');             
                        $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                            doc.data().Titulos.forEach(function(element){
                            console.log("elemento: "+element);
                            $$('#popover-busqueda'+doc.id).append('<li><button value="'+doc.id+'" class="col button button-raised itemsConsulta item-link popover-close popup-open"  data-popup=".popup-eliminar"   id="'+element+'">'+element+'</button></li>');
                        });
                    }
                    else
                    {
                         $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button value="'+doc.id+'" class="col button button-raised item-title itemsConsulta popup-open"  data-popup=".popup-eliminar"   id="'+doc.id+'">'+doc.id+'</button></div></li>');                         
                    }
                }
                else
                {
                    $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'" >'+doc.id+'</button></div></li>');             
                    $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                    doc.data().Titulos.forEach(function(element){
                        console.log("elemento: "+element);
                        $$('#popover-busqueda'+doc.id).append('<li><button value="'+doc.id+'" class="col button button-raised itemsConsulta item-link popover-close popup-open"  data-popup=".popup-eliminar"   id="'+element+'">'+element+'</button></li>');
                    });
                }                
            }
            else
            {
                if(cantidad===1)
                {
                    console.log('titulo '+doc.data().Titulos[0]);
                    if(doc.data().Titulos[0] !=doc.id)
                    {
                        $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                        $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                        doc.data().Titulos.forEach(function(element){             
                            $$('#popover-busqueda'+doc.id).append('<li><button class="col button button-raised itemsConsulta item-link popover-close"  id="'+element+'">'+element+'</button></li>');
                        });                        
                    }
                    else
                    {
                        $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title itemsConsulta"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                    }
               }
                else
                {
                    $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                    $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                    doc.data().Titulos.forEach(function(element){             
                        $$('#popover-busqueda'+doc.id).append('<li><button class="col button button-raised itemsConsulta item-link popover-close"  id="'+element+'">'+element+'</button></li>');
                    });
                }
            }
        });

        $$('.itemsConsulta').on('click',function(){
            console.log("Id seleccionado: "+this.id);           
            if(h==="h") 
            {
                enfermedadBusqueda=this.id; 
                mainView.router.navigate("/enfermedad/");
            }
            else if(h==="e")
            {
                info=this.id;
                mainView.router.navigate("/infoEnfermedad/");
            }
            else if(h==="el")
            {
                may=this.value;
                console.log("may: "+may);
                info=this.id;
                console.log("eliminar");
                $$('#nombreEnfermedadEliminar').html(info);
            }
        });
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de pasos de la base',error);
    });
}

function eliminar()
{
    var bd=firebase.firestore();
    var storageService = firebase.storage();
    var storageRef = storageService.ref();
    console.log(info);
    var sub=bd.collection('subcatalogo').doc(info);
    sub.get()
    .then(function(doc){
         for(var i=1;i<=doc.data().cantidad;i++)
        {
            var aa=String(i);
            sub.collection('Pasos').doc(aa).delete();
            sub.collection('Audios').doc(aa).delete();
        }
        sub.delete()
        .then(function(doc) {
            console.log("se borro doc");       
        })
        .catch(function(error){
            console.log('Error al recuperar los datos de pasos de la base',error);
        });
        eliminar2();
     
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de la enfermedad de la base',error);
    });
}
function eliminar2()
{
    console.log("may en eliminar 2: "+may);
    var bd=firebase.firestore();
    var cata=bd.collection('catalogo').doc(may); //elimino el titulo del arreglo de la categoria
    cata.get()        
    .then(function(doc){
        cata.update({
            Titulos: firebase.firestore.FieldValue.arrayRemove(info)
        });      
        console.log("cantidad: "+doc.data().cantidad);
        var cantTotal=doc.data().cantidad-1;
        var data={
            cantidad:cantTotal
        }
        cata.update(data);
        console.log("se elimino de cat");
        console.log("tamaño "+doc.data().Titulos.length);
        app.popup.close('.popup-eliminar'); 
        may=""; //lo pongo en vaciopor si vuelvo a eliminar otra cosa
            app.dialog.alert('Se ha cargado una eliminado la enfermedad', 'Eliminar',function()
        {
            mainView.router.navigate("/homeAdmin/");
        });        
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de pasos de la base',error);
    });
}

function cargarEnfermedad(enfermedad) 
{
    var arregloPasos=[];
    var arregloAudios=[];
    var bd=firebase.firestore();
    bd.collection('subcatalogo').doc(enfermedad).collection('Pasos').get()
    .then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc) 
        {
            arregloPasos.push(doc.data().valor);
        });
        bd.collection('subcatalogo').doc(enfermedad).collection('Audios').get()
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
                if(arregloPasos.length==1)
                {
                    mySwiper.appendSlide('<div class="swiper-slide row "><div class="e"><b>'+arregloPasos[j]+'</b></div><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" ></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div>');                    
                }
                else if(j===0)
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
