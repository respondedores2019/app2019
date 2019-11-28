function validarInfo(info) /* SI ELIMINO EL PASO, QUE LA FOTO CAMBIE DE NRO DE DOC*/
{
    for (var jj=1;jj<nroNuevoPasoE;jj++)
    {     
        if(arregloEliminarE.indexOf(jj)===-1) // noesta en el arreglo
        { 
            var paso=$$('#textoPaso'+jj).val();
            if(paso==="")  
            {
                $$('#errortextoenfermedad'+jj).removeClass('oculto');
                $$('#errortextoenfermedad'+jj).addClass('visible');
            }
            else
            {
                $$('#errortextoenfermedad'+jj).removeClass('visible');
                $$('#errortextoenfermedad'+jj).addClass('oculto');
                if(paso.length>170)
                {
                    $$('#error2textoenfermedad'+jj).removeClass('oculto');
                    $$('#error2textoenfermedad'+jj).addClass('visible');
                }
                else
                {
                    $$('#error2textoenfermedad'+jj).removeClass('visible');
                    $$('#error2textoenfermedad'+jj).addClass('oculto');  
                }                         
            }
             if($$('#audio'+jj).hasClass('nuevoPaso')===true)
             {
                  if(document.getElementById('audio'+jj).files.length === 0) 
                 {
                    $$('#erroraudio'+jj).removeClass('oculto');
                    $$('#erroraudio'+jj).addClass('visible');
                }
                else
                {
                    fileValidation(jj);
                    $$('#erroraudio'+jj).removeClass('visible');
                    $$('#erroraudio'+jj).addClass('oculto');
                }
             }
             else
             {
                if($$('#audio'+jj).hasClass('visible')===true)    
                {
                    fileValidation(jj);   
                }
             }                                
        }
    }   
}
function guardarEditar(info,catV,catN)
{
    var arre=[];
    var bd=firebase.firestore();
    var cont=1;
    var enf=bd.collection('subcatalogo').doc(info);
    enf.get()
    .then(function(doc){    
        for(var ii=1;ii<=doc.data().cantidad;ii++)
        {
            var aa=String(ii);
            enf.collection('Pasos').doc(aa).delete()
            .then(function(doc) {
                console.log("se borro pa");
            })
            .catch(function(error){
                console.log('Error al eliminar pasos ',error);
            });
            enf.collection('Audios').doc(aa).delete()
            .then(function(doc) {
                 console.log("se borro au ");
            })
            .catch(function(error){
                 console.log('Error al eliminar audios',error);
            });
            enf.collection('Imagenes').doc(aa).delete()
            .then(function(doc) {
                 console.log("se borro im ");
            })
            .catch(function(error){
                 console.log('Error al eliminar audios',error);
            });
        }
        for (var jj=1;jj<nroNuevoPasoE;jj++)
        {
            var nroDoc=String(cont);
            if(arregloEliminarE.indexOf(jj)===-1) // noesta en el arreglo
            {             
                var paso=$$('#textoPaso'+jj).val();                        
                if($$('#audio'+jj).hasClass('visible')===true) // falta eliminar el audio viejo del storage
                {
                    var url=document.getElementById('audio'+jj).files[0];
                    getFileName(url,cont);  
                }
                else
                {
                    if($$('#audio'+jj).hasClass('nuevoPaso')===true)
                    {
                        var url2=document.getElementById('audio'+jj).files[0];
                        getFileName(url2,cont);   
                    }
                    else
                    {
                        var audioBd=String($$('#audrep'+jj).attr('src'));
                        var dataAud={
                            valor:audioBd,
                        };
                        bd.collection('subcatalogo').doc(info).collection('Audios').doc(nroDoc).set(dataAud);                    
                    }           
                }
                if($$('#imagen'+jj).hasClass('visible')===true) // falta eliminar imagen viejo del storage
                {
                    if(document.getElementById('imagen'+jj).files.length !== 0) 
                    {
                        console.log("entre 1");
                        console.log("j:"+jj);
                        var url1=document.getElementById('imagen'+jj).files[0];
                        getFileFoto(url1,cont);  
                    }
                }
                else
                {
                    if($$('#imagen'+jj).hasClass('nuevoPaso')===true)
                    {
                        console.log("entre 2");
                         console.log("j:"+jj);
                         if(document.getElementById('imagen'+jj).files.length !== 0) 
                        {
                            var url3=document.getElementById('imagen'+jj).files[0];
                            getFileFoto(url3,cont);   
                        }

                    }
                    else
                    {
                        console.log("enter 3");
                         console.log("j:"+jj);
                        var fotoBD=String($$('#imgrep'+jj).attr('src'));
                        var datafoto={
                            valor:fotoBD,
                        };
                        bd.collection('subcatalogo').doc(info).collection('Imagenes').doc(nroDoc).set(datafoto);                    
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
        if(catV!==catN)// si el nombre de la categoria vieja es distinta de la seleccionada
        {
            var ccat=bd.collection('catalogo').doc(catV);
            ccat.update({
                Titulos:firebase.firestore.FieldValue.arrayRemove(info)
            });
            ccat.get().then(function(doc){
                var cantidad=doc.data().cantidad; 
                var data4={
                    cantidad:cantidad-1  
                };
                ccat.update(data4);
                var cat2=bd.collection('catalogo').doc(catN);
                cat2.get()
                .then(function(doc2){
                    doc2.data().Titulos.forEach(function(element){
                              console.log("elee  "+element);
                              arre.push(element);
                              });
                             arre.push(info);
                             arre.sort();
                             for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  cat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayRemove(arre[i])
                                    }); 
                              }
                              for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  cat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayUnion(arre[i])
                                    }); 
                              }
                    });
                    cat2.update({
                        cantidad:firebase.firestore.FieldValue.increment(1)
                    });
                })
             .catch(function(error){
                console.log('Error al saber la cnatidad del catalogo ',error);
            });               
        }
        else
        {
            var ccat2=bd.collection('catalogo').doc(catV);
            ccat2.get()
            .then(function(doc){
                doc.data().Titulos.forEach(function(element){
                              console.log("elee  "+element);
                              arre.push(element);
                              });
                             arre.push(info);
                             arre.sort();
                             for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  ccat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayRemove(arre[i])
                                    }); 
                              }
                              for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  ccat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayUnion(arre[i])
                                    }); 
                              }
            });
        }
        app.dialog.alert('Se han guardado las modificaciones de la enfermedad', 'Confirmacion',function()
        {
            arregloEliminarE=[];
            mainView.router.navigate("/homeAdmin/");
        });                    
    }); 
}
function guardarNuevoEditar(viejo,nuevo,catV,catN)
{
    console.log("may cat6: "+may);
    var arre=[];
    var bd=firebase.firestore();
    bd.collection('subcatalogo').doc(viejo).delete()
    .then(function(doc){
        var cont=1;
        var enf=bd.collection('subcatalogo').doc(nuevo);
        enf.get()
        .then(function(doc){
            console.log("nro de pasos total nuevos: "+nroNuevoPasoE);
            for (var jj=1;jj<nroNuevoPasoE;jj++)
            {
                var nroDoc=String(cont);
                if(arregloEliminarE.indexOf(jj)===-1) // noesta en el arreglo
                {
                    var paso=$$('#textoPaso'+jj).val();                      
                    if($$('#audio'+jj).hasClass('visible')===true) // es audio nuevo FALTA eliminar el audio viejo del storage
                    {
                        var url=document.getElementById('audio'+jj).files[0];
                        getFileName(url,cont);  
                    }
                    else
                    {
                        if($$('#audio'+jj).hasClass('nuevoPaso')===true) // audio nuevo de paso nuevo
                        {
                            var url2=document.getElementById('audio'+jj).files[0];
                            getFileName(url2,cont);   
                        }
                        else // audio viejo
                        {
                            var audioBd=String($$('#audrep'+jj).attr('src'));                                     
                            var dataAud={
                                valor:audioBd,
                            };
                            bd.collection('subcatalogo').doc(nuevo).collection('Audios').doc(nroDoc).set(dataAud);                    
                        }           
                    }
                    var data={
                        valor:paso,
                    };
                    bd.collection('subcatalogo').doc(nuevo).collection('Pasos').doc(nroDoc).set(data);
                    cont++;                              
                }
            }
            var data1={
                cantidad:cont-1
            };
            bd.collection('subcatalogo').doc(nuevo).set(data1); 
            if(catV!==catN)// si el nombre de la categoria vieja es distinta de la seleccionada
            {   
                var ccat=bd.collection('catalogo').doc(catV);
                ccat.update({
                    Titulos:firebase.firestore.FieldValue.arrayRemove(viejo)
                });
                ccat.get().then(function(doc){
                    var cantidad=doc.data().cantidad;
                    var data4={
                        cantidad:cantidad-1  
                    };
                    ccat.update(data4);
                    var cat2=bd.collection('catalogo').doc(catN);
                    cat2.get()
                    .then(function(doc2){
                        doc2.data().Titulos.forEach(function(element){
                              console.log("elee  "+element);
                              arre.push(element);
                              });
                             arre.push(nuevo);
                             arre.sort();
                             for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  cat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayRemove(arre[i])
                                    }); 
                              }
                              for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  cat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayUnion(arre[i])
                                    }); 
                              }
                    });
                    cat2.update({
                        cantidad:firebase.firestore.FieldValue.increment(1)
                    });
                })
                .catch(function(error){
                    console.log('Error al saber la cnatidad del catalogo ',error);
                }); 
            }
            else
            { 
                var ccat2=bd.collection('catalogo').doc(catV);
               ccat2.update({
                   Titulos:firebase.firestore.FieldValue.arrayRemove(viejo)
               });
               ccat2.get()
                .then(function(doc){
                    doc.data().Titulos.forEach(function(element){
                              console.log("elee  "+element);
                              arre.push(element);
                              });
                             arre.push(nuevo);
                             arre.sort();
                             for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  ccat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayRemove(arre[i])
                                    }); 
                              }
                              for(var i=0;i<arre.length;i++)
                              {
                                  console.log("arreglo "+arre[i]);
                                  ccat2.update({
                                    Titulos:firebase.firestore.FieldValue.arrayUnion(arre[i])
                                    }); 
                              }
                });

            }
            app.dialog.alert('Se han guardado las modificaciones de la enfermedad', 'Confirmacion',function()
            {
                arregloEliminarE=[];
                mainView.router.navigate("/homeAdmin/");
             });  
        });       
    })
    .catch(function(error){
        console.log('Error al eliminar la enfermedad ',error);
    });  
}
function cargarInfoEnfermedad(info)
{
    var bd=firebase.firestore();
    var arregloAudios=[];
    var arregloPasos=[];
    var titOriginal="";
    bd.collection('subcatalogo').doc(info).get()
    .then(function(doc){
        var cantidad=doc.data().cantidad;
        nroNuevoPasoE=cantidad+1; //para arrancar dsd ese nro el nuevo paso
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
                var arregloImagenes= new Array(arregloPasos.length-1); // tamaño
                bd.collection('subcatalogo').doc(info).collection('Imagenes').get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                    var num=doc.id -1;
                    arregloImagenes.splice(num,0,doc.data().valor);
                    });
                    
                    $$('#tituloEditar').append('<div class="card-header"><b>Titulo</b></div><div class="card-content card-content-padding"><div class="row"><input type="text" id="tituloE" class="colorFondo col-75" value="'+info+'" disabled/><span class="input-clear-button"></span><div class="oculto textoerror" id="errorTitulo" >La cantidad de caracteres debe ser menor a 40.</div><div class="item-media"><a id="ediTit" class="col-10 visible" ><i class="fas fa-edit"></i></a></div></div></br><div class="row"><b>Categoria:</b></br><div class="item-input-wrap input-dropdown-wrap"><select id="idCat"></select></div></div></div>');                 
                    bd.collection('catalogo').get()
                    .then(function(querySnapshot){
                        querySnapshot.forEach(function(doc){
                            if(doc.id===may)
                            {
                                $$('#idCat').append('<option value="'+doc.id+'" selected>'+doc.id+'</option>');
                            }
                            else
                            {
                                $$('#idCat').append('<option value="'+doc.id+'">'+doc.id+'</option>');
                            }
                        });
                    }); 
                    $$('#ediTit').on('click',function(){
                        titOriginal=$$('#tituloE').val();
                        $$('#tituloE').prop('disabled', false);
                        $$('#tituloE').removeClass('colorFondo');
                    });
                    for(var j=0;j<=cantidad-1;j++)
                    {
                        var i=j+1;
                         if(arregloImagenes[j]===undefined)
                         {
                            $$('#pasosEditar').append('<div class="card" id="paso'+i+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding row"><textarea id="textoPaso'+i+'" value="'+arregloPasos[j]+'" class="colorFondo col-75" disabled>'+arregloPasos[j]+'</textarea><span class="input-clear-button"></span><div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error2textoenfermedad'+i+'" >La cantidad de caracteres debe ser menor a 170.</div><div class="item-media"><a href="#" id="edi'+i+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div><div class="card-header"><b>Audio:</b></div><div class="card-content card-content-padding row"><input type="file" class="audios oculto" name="audio'+i+'" id="audio'+i+'"><audio src="'+arregloAudios[j]+'" id="audrep'+i+'"></audio><button class="col-75 playEditar button button-fill visible" id="audbot'+i+'">Reproducir</button><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error2audio'+i+'" >El archivo debe tener formato mp3.</div><div class="oculto textoerror" id="error3audio'+i+'" >El archivo debe durar menos de 30 segundos.</div><div class="item-media"><a href="#" id="audedi'+i+'" class="editarAudio col-10 visible" ><i class="fas fa-edit"></i></a> </div></div><div class="card-header"><b>Imagen:</b></div><div class="card-content card-content-padding row"><input type="file" class="imagenes visible" name="imagen'+i+'" id="imagen'+i+'"><div class="oculto textoerror" id="errorimagen'+i+'" >El archivo debe tener formato jpg, jpge o png.</div></div><div class="card-footer"><button class=" button button-small button-fill eliminarPaso" id="'+i+'">Eliminar</button></div></div>');
                        }
                         else
                         {
                              $$('#pasosEditar').append('<div class="card" id="paso'+i+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding row"><textarea id="textoPaso'+i+'" value="'+arregloPasos[j]+'" class="colorFondo col-75" disabled>'+arregloPasos[j]+'</textarea><span class="input-clear-button"></span><div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error2textoenfermedad'+i+'" >La cantidad de caracteres debe ser menor a 170.</div><div class="item-media"><a href="#" id="edi'+i+'" class="editar col-10" ><i class="fas fa-edit"></i></a></div></div><div class="card-header"><b>Audio:</b></div><div class="card-content card-content-padding row"><input type="file" class="audios oculto" name="audio'+i+'" id="audio'+i+'"><audio src="'+arregloAudios[j]+'" id="audrep'+i+'"></audio><button class="col-75 playEditar button button-fill visible" id="audbot'+i+'">Reproducir</button><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error2audio'+i+'" >El archivo debe tener formato mp3.</div><div class="oculto textoerror" id="error3audio'+i+'" >El archivo debe durar menos de 30 segundos.</div><div class="item-media"><a href="#" id="audedi'+i+'" class="editarAudio col-10 visible" ><i class="fas fa-edit"></i></a> </div></div><div class="card-header"><b>Imagen:</b></div><div class="card-content card-content-padding row"><input type="file" class="imagenes oculto" name="imagen'+i+'" id="imagen'+i+'"><img src="'+arregloImagenes[j]+'" id="imgrep'+i+'"><div class="oculto textoerror" id="errorimagen'+i+'" >El archivo debe tener formato jpg, jpge o png.</div><div class="item-media visible"  id="botoneditarImg'+i+'"><a href="#" id="imgedi'+i+'" class="editarImagen col-10 " ><i class="fas fa-edit"></i></a> </div>		<div class="item-media visible"  id="botonelImg'+i+'"><a href="#" id="imgel'+i+'" class="eliminarImagen col-10 " ><i class="fas fa-trash-alt"></i></a> </div></div><div class="card-footer"><button class=" button button-small button-fill eliminarPaso" id="'+i+'">Eliminar</button></div></div>');
                         }
                    }
                    $$('#botonesExtra').append('<div class="list no-hairlines-md"><ul><li class="item-content item-input"><button class=" button button-small button-fill masPaso" id="masPaso">Mas Pasos</button> </li><li class="item-content item-input"><button class=" button button-small button-fill botonInicio" id="guardarEnfermedad">Guardar enfermedad</button> </li></ul></div>');
                    $$('#guardarEnfermedad').on('click',function(){
                        if($$('#tituloE').prop('disabled')===false) // esta habilitado
                        {
                            validarTitulo($$('#tituloE').val());
                            if(titOriginal!==$$('#tituloE').val()) // distintos nombres de titulos
                            {
                                bd.collection('subcatalogo').doc($$('#tituloE').val()).get()
                                .then(function(doc){
                                    if(!doc.exists) // nuevo nombre
                                    {
                                        validarInfo(info);
                                        var band=false; //falta validar que no este vacio
                                        for(var j=0;j<nroNuevoPasoE;j++)
                                        {
                                            console.log("ni idea adentro de 423 "+arregloEliminarE.length);
                                            if(arregloEliminarE.indexOf(j)===-1) // noesta en el arreglo
                                            {
                                                if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#error2textoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible') || $$('#error2audio'+j).hasClass('visible') || $$('#error3audio'+j).hasClass('visible') || $$('#errorTitulo').hasClass('visible') )
                                                {
                                                    band=true;
                                                }
                                            }
                                        }
                                        if(band===false)
                                        {
                                             guardarNuevoEditar(titOriginal,$$('#tituloE').val(),may,$$('#idCat').val() );
                                        }
                                        else
                                        {
                                              app.dialog.alert('Verificar datos','Error');
                                        }
                                    }
                                    else
                                    {
                                        app.dialog.alert('Ya existe una enfermedad con ese nombre','Error');
                                    }
                                }) 
                                .catch(function(error){
                                    console.log('Error al recuperar los datos de la base de subcatalogos',error);
                                });
                            }
                            else // iguales titulos
                            {
                                validarInfo(info);
                                 var band2=false; //falta validar que no este vacio
                                 for(var j=0;j<nroNuevoPasoE;j++)
                                 {
                                    if(arregloEliminarE.indexOf(j)===-1) // noesta en el arreglo
                                    {
                                        if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#error2textoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible') || $$('#error2audio'+j).hasClass('visible') || $$('#error3audio'+j).hasClass('visible') || $$('#errorTitulo').hasClass('visible') )
                                        {
                                            band2=true;
                                        }
                                    }
                                }
                                if(band2===false)
                                {
                                    guardarEditar(info,may,$$('#idCat').val());
                                }
                                else
                                {
                                    app.dialog.alert('Verificar datos','Error');
                                } 
                            }
                        }
                        else // no esta habilitado
                        {
                            validarInfo(info);
                            var band3=false; //falta validar que no este vacio
                            for(var j=0;j<nroNuevoPasoE;j++)
                            {
                                 if(arregloEliminarE.indexOf(j)===-1) // noesta en el arreglo
                                 {
                                     if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#error2textoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible') || $$('#error2audio'+j).hasClass('visible') || $$('#error3audio'+j).hasClass('visible') )
                                     {
                                        band3=true;
                                     }
                                 }
                            }
                            if(band3===false)
                            {
                                   guardarEditar(info,may,$$('#idCat').val());
                            }
                            else
                            {
                                app.dialog.alert('Verificar datos','Error');
                            } 
                        }
                        
                    });
                    $$('#masPaso').on('click',function(){
                        $$('#pasosEditar').append('<div class="card" id="paso'+nroNuevoPasoE+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding"><textarea placeholder="Ingrese el texto del paso" id="textoPaso'+nroNuevoPasoE+'" class="colorFondo"></textarea><span class="input-clear-button"></span><div class="oculto textoerror" id="errortextoenfermedad'+nroNuevoPasoE+'" >Completar este campo.</div><div class="oculto textoerror" id="error2textoenfermedad'+nroNuevoPasoE+'" >La cantidad de caracteres debe ser menor a 170.</div></div><div class="card-header"><b>Audio:</b></div><div class="card-content card-content-padding"><input type="file" class="audios nuevoPaso" name="audio'+nroNuevoPasoE+'" id="audio'+nroNuevoPasoE+'"><div class="oculto textoerror" id="erroraudio'+nroNuevoPasoE+'" >Completar este campo.</div><div class="oculto textoerror" id="error2audio'+nroNuevoPasoE+'" >El archivo debe tener formato mp3.</div><div class="oculto textoerror" id="error3audio'+nroNuevoPasoE+'" >El archivo debe durar menos de 30 segundos.</div></div><div class="card-header"><b>Imagen:</b></div><div class="card-content card-content-padding"><input type="file" class="imagenes nuevoPaso"  " name="imagen'+nroNuevoPasoE+'" id="imagen'+nroNuevoPasoE+'"><div class="oculto textoerror" id="errorimagen'+nroNuevoPasoE+'" >El archivo debe tener formato jpg, jpge o png.</div></div><div class="card-footer"><button class=" button button-small button-fill eli eliminarPaso" id="'+nroNuevoPasoE+'">Eliminar</button></div></div>');
                        nroNuevoPasoE++;
                        $$('.eliminarPaso').on('click',function(){ 
                            var id= parseInt(this.id);
                            console.log("eliminar adentro mas "+id);
                            arregloEliminarE.push(id);
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
                        $$('#textoPaso'+num).prop('disabled', false);
                        $$('#textoPaso'+num).removeClass('colorFondo');
                    });
                    $$('.editarAudio').on('click',function(){
                        var id=this.id.substr(6);
                        $$('#audbot'+id).removeClass('visible').addClass('oculto');
                        $$('#audedi'+id).removeClass('visible').addClass('oculto');
                        $$('#audio'+id).removeClass('oculto').addClass('visible');
                    });
                    $$('.eliminarPaso').on('click',function(){
                        var id= parseInt(this.id);
                        console.log("id eli "+id);
                        arregloEliminarE.push(id);
                        $$('#paso'+id).remove();
                    });
                    $$('.editarImagen').on('click',function(){
                        var id=this.id.substr(6);
                        $$('#imgrep'+id).removeClass('visible').addClass('oculto');
                        $$('#botoneditarImg'+id).removeClass('visible').addClass('oculto');
                        $$('#imagen'+id).removeClass('oculto').addClass('visible');
                        $$('#botonelImg'+id).removeClass('visible').addClass('oculto');
                    });
                    $$('.eliminarImagen').on('click',function(){
                        var id=this.id.substr(5);
                        $$('#imgrep'+id).removeClass('visible').addClass('oculto');
                        $$('#imagen'+id).removeClass('oculto').addClass('visible');
                        $$('#botonelImg'+id).removeClass('visible').addClass('oculto');
                        $$('#botoneditarImg'+id).removeClass('visible').addClass('oculto');
                      
                    });
                    
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

    var arre=[];
    var bd=firebase.firestore();
    var cont=1; //para que el doc se llame consecutivo
    var titulo=$$('#tituloE').val();
    var minu=titulo.toLowerCase();
    var mayTitulo=minu.charAt(0).toUpperCase() + minu.slice(1);
    var tipo=$$('#tipoCat').val();
    var enf=bd.collection('subcatalogo').doc(mayTitulo);
    enf.get()
    .then(function(doc){
        if(!doc.exists)    
        {
                if(tipo==1) // es una subcategoria
                {
                    console.log("es una subcategoria");
                    var cat=$$('#idCat').val();
                    console.log("cat :"+cat);  
                    var catalogo=bd.collection('catalogo').doc(cat);
                    catalogo.get()
                    .then(function(doc){
                        var cc=doc.data().cantidad+1;
                        var cant={
                            cantidad:cc
                        };
                        catalogo.update(cant);
                        doc.data().Titulos.forEach(function(element){
                              arre.push(element);
                        });
                        arre.push(mayTitulo);
                        arre.sort();
                        for(var i=0;i<arre.length;i++)
                        {
                            console.log("arreglo "+arre[i]);
                            catalogo.update({
                                Titulos:firebase.firestore.FieldValue.arrayRemove(arre[i])
                            }); 
                        }
                        for(var i=0;i<arre.length;i++)
                        {
                            console.log("arreglo "+arre[i]);
                            catalogo.update({
                                Titulos:firebase.firestore.FieldValue.arrayUnion(arre[i])
                            }); 
                        }                             
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
            
                for (var j=1;j<i;j++)
                {
                    if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                    {
                        var paso=$$('#textoenfermedad'+j).val();   
                        console.log("paso: "+paso);
                        var url=document.getElementById('audio'+j).files[0];
                        console.log(url);
                         getFileName(url,cont);
                        if(document.getElementById('imagen'+j).files.length !== 0) 
                        {
                            console.log("imagen: "+document.getElementById('imagen'+j).files[0]);
                            var foto=document.getElementById('imagen'+j).files[0];
                            getFileFoto(foto,cont);
                        }
                                               
                        var data1={
                            valor:paso,
                        };
                        var nroDoc=String(cont);
                        bd.collection('subcatalogo').doc(mayTitulo).collection('Pasos').doc(nroDoc).set(data1).then(function() {
                            console.log("Document successfully written!");
                        });
                        cont++;
                    }
                }            
                var data11={
                    cantidad:cont-1
                };
                bd.collection('subcatalogo').doc(mayTitulo).set(data11);
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
function getFileFoto(fileInput,cont)
{
    console.log("adentro de getfilefoto");
    console.log("file: "+fileInput);
    console.log("conta: "+cont);
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
                bd.collection('subcatalogo').doc(mayTitulo).collection('Imagenes').doc(nroDoc).set(data).then(function() {
                    console.log("Document successfully written!");
                });
            });
            console.log("subida completa");
        });
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
    var email=$$('#email').val(); 
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
        if (errorCode === 'auth/invalid-email') {
          app.dialog.alert('Mail invalido','Inicio de sesion');
        } else if (errorCode === 'auth/user-not-found') {
            app.dialog.alert('Usuario no encontrado','Inicio de sesion');
        }
        console.log(error);
        // [END_EXCLUDE]
      });
}
function guardarTitulo()
{
    var bd=firebase.firestore();
    var tit=$$('#titNuevoC').val();
    var titViejo=$$('#ediTitC').val();
    var minu=tit.toLowerCase();
    var mayTitulo=minu.charAt(0).toUpperCase() + minu.slice(1);
    bd.collection('catalogo').doc(mayTitulo).get()
    .then(function(doc){
        if(!doc.exists)
        {
            var data={
                cantidad:0,
                Titulos:[],
            }
            bd.collection('catalogo').doc(mayTitulo).set(data);
            bd.collection('catalogo').doc(titViejo).delete();
            app.dialog.alert('Se ha editado el titulo', 'Confirmacion',function()
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
function validarTitulo(cat)
{
    
    if(cat.length>40)
    {
        $$('#errorTitulo').removeClass('oculto');
        $$('#errorTitulo').addClass('visible');
    }
    else
    {
        $$('#errorTitulo').removeClass('visible');
        $$('#errorTitulo').addClass('oculto');  
    } 
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
function eliminoVacios(h)
{
    
    console.log("dentro de funcion elimino");
    var bd=firebase.firestore();
    bd.collection('catalogo').where('cantidad','==',0).get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            bd.collection('catalogo').doc(doc.id).delete();       
            console.log("eliminado");
        });   
        cargaBusqueda(h);
    })
    .catch(function(error){
        console.log('Error al recuperar los datos de pasos de la base',error);
    });
}
function cargaBusqueda(h) 
{
    console.log("h: "+h);
    var bd=firebase.firestore();
    bd.collection('catalogo').get()
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
            else if(h==="elc")
            {
                console.log("eliminar categoria");
                 $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button value="'+doc.id+'" class="col button button-raised item-title itemsConsulta popup-open"  data-popup=".popup-eliminarC"   id="'+doc.id+'">'+doc.id+'</button></div></li>');                                
            }
            else
            {
                console.log("catalogo: "+doc.id);
                console.log("cantidad: "+cantidad);
                if(cantidad===1)
                {
                    console.log('titulo '+doc.data().Titulos[0]);
                    if(doc.data().Titulos[0] !==doc.id)
                    {
                        $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                        $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                        doc.data().Titulos.forEach(function(element){             
                            $$('#popover-busqueda'+doc.id).append('<li><button value="'+doc.id+'" class="col button button-raised itemsConsulta item-link popover-close"  id="'+element+'">'+element+'</button></li>');
                        });                        
                    }
                    else
                    {
                        $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button value="'+doc.id+'" class="col button button-raised item-title itemsConsulta"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                    }
                }
                else
                {
                    
                    console.log("cantidad mayor a 1");
                    $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="col button button-raised item-title popover-open" href="#" data-popover=".popover-links'+doc.id+'"  id="'+doc.id+'">'+doc.id+'</button></div></li>');             
                    $$('#escondido').append('<div class="popover popover-links'+doc.id+'"><div class="popover-inner"><div class="list"><ul id="popover-busqueda'+doc.id+'"></ul></div></div></div>');
                    doc.data().Titulos.forEach(function(element){
                        console.log("elementos: "+element);
                        $$('#popover-busqueda'+doc.id).append('<li><button value="'+doc.id+'" class="col button button-raised itemsConsulta item-link popover-close"  id="'+element+'">'+element+'</button></li>');
                    });
                }
            }
        });

        $$('.itemsConsulta').on('click',function(){
            console.log("Id seleccionado: "+this.id);           
            if(h==="h") /* busqueda */
            {
                console.log("busqueda");
                enfermedadBusqueda=this.id; 
                mainView.router.navigate("/enfermedad/");
            }
            else if(h==="e") /* editar enfermedad*/
            {
                may=this.value;
                console.log("may: "+may);
                info=this.id;
                mainView.router.navigate("/infoEnfermedad/");
            }
            else if(h==="el") /* eliminar enfermedad*/
            {
                may=this.value;
                console.log("may: "+may);
                info=this.id;
                console.log("eliminar");
                $$('#nombreEnfermedadEliminar').html(info);
            }
            else if(h==="elc") /* eliminar categoria*/
            {
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
function eliminarCategoria() 
{
    var bd=firebase.firestore();
    bd.collection('catalogo').doc(info).delete()
    .then(function(doc){
        console.log("eliminada la categoria");

        app.dialog.alert('Se ha eliminado la categoria', 'Eliminar',function()
        {
            app.popup.close('.popup-eliminarC'); 
            mainView.router.navigate("/homeAdmin/");
        });  
    })
    .catch(function(error){
        console.log('Error al eliminar la categoria',error);
    });

}
function eliminar()
{
    var bd=firebase.firestore();
  //  var storageService = firebase.storage();
//    var storageRef = storageService.ref();
    console.log(info);
    var sub=bd.collection('subcatalogo').doc(info);
    sub.get()
    .then(function(doc){
         for(var i=1;i<=doc.data().cantidad;i++)
        {
            var aa=String(i);
            sub.collection('Pasos').doc(aa).delete();
            sub.collection('Audios').doc(aa).delete();
            sub.collection('Imagenes').doc(aa).delete();
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
        app.dialog.alert('Se ha eliminado la enfermedad', 'Eliminar',function()
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
            var arregloImagenes= new Array(arregloPasos.length-1); // tamaño
            bd.collection('subcatalogo').doc(enfermedad).collection('Imagenes').get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    //arregloImagenes.push(doc.data().valor);
                    var num=doc.id -1;
                    arregloImagenes.splice(num,0,doc.data().valor);
                });

// ANALIZAR PARTE DE FOTO POR SI NO IENE NADA CARGDADO
            var mySwiper = document.querySelector('.swiper-container').swiper;
            for(var j=0;j<arregloPasos.length;j++)
            {
                if(arregloImagenes[j]===undefined)
                {
                    var k=j+1;
                    if(arregloPasos.length===1)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b</div><div class="lla"></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div></div>');                    
                    }
                    else if(j===0)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="lla"></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div><div class="swiper-button-next next" id="'+j+'"></div></div>');
                    }
                    else if(k===arregloPasos.length)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="swiper-button-prev prev" id="'+j+'"></div><div class="lla"></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba" ></audio><button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div></div>');
                    }
                    else
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="lla"></div><div class="swiper-button-prev prev" id="'+j+'"></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio> <button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div><div class="swiper-button-next next" id="'+j+'"></div></div>   ');
                    } 
                }
                else
                {
                    var k=j+1;
                    if(arregloPasos.length===1)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b</div><div class="lla"><a href="#" class="fotos" id="fot'+j+'">Link a foto</a></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div></div>');                    
                    }
                    else if(j===0)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="lla"><a href="#" class="fotos" id="fot'+j+'">Link a foto</a></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio><button class="play button button-fill " id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div><div class="swiper-button-next next" id="'+j+'"></div></div>');
                    }
                    else if(k===arregloPasos.length)
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="swiper-button-prev prev" id="'+j+'"></div><div class="lla"><a href="#" class="fotos" id="fot'+j+'">Link a foto</a></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba" ></audio><button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div></div>');
                    }
                    else
                    {
                        mySwiper.appendSlide('<div class="swiper-slide"><div class="e"><b>'+arregloPasos[j]+'</b></div><div class="lla"><a href="#" class="fotos" id="fot'+j+'">Link a foto</a></div><div class="swiper-button-prev prev" id="'+j+'"></div><div class="po"><audio id="audrep'+j+'" src="'+arregloAudios[j]+'" class="audioPrueba"></audio> <button class="play button button-fill" id="botonn'+j+'" value="'+arregloPasos[j]+'">Reproducir</button></div><div class="swiper-button-next next" id="'+j+'"></div></div>   ');
                    } 
                }
                   
            }
            $$('.fotos').on('click',function(){
                var num=this.id.substr(3);
                console.log("id: " +num);
                
                var photoBrowser = app.photoBrowser.create({
                  photos: [
                    arregloImagenes[num]
                  ],
                  
                });
                photoBrowser.open();
            });
            $$('.next').on('click',function(){
                console.log("id: " +this.id);
                var audio = document.getElementById("audrep"+this.id);
                var button = document.getElementById('botonn'+this.id);
                audio.pause();
                audio.currentTime = 0;
                button.textContent = "Reproducir";
                mySwiper.slideNext();
            });
            $$('.prev').on('click',function(){
                 console.log("id: " +this.id);
                var audio = document.getElementById("audrep"+this.id);
                var button = document.getElementById('botonn'+this.id);
                audio.pause();
                audio.currentTime = 0;
                button.textContent = "Reproducir";
                mySwiper.slidePrev();
            });
            $$('.play').on('click',function(){     
                var num=this.id.substr(6);
                var audio = document.getElementById("audrep"+num);
                var button = document.getElementById(this.id);
                if (audio.paused) 
                {
                    audio.play();
                    console.log("reproduciendo");
                    button.textContent = "Pausar";
                }
                else
                {
                    audio.pause();
                    console.log("en pausa");
                    button.textContent = "Reproducir";
                }
             });
             $$('.audioPrueba').on('playing',function(){
                 console.log("reprod");
             });
            $$('.audioPrueba').on('ended',function(){
                 console.log("stop");
                 var num=this.id.substr(6);
                  var button = document.getElementById('botonn'+num);
                 button.textContent = "Reproducir";
             });
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

function fileValidation(file){
    var fileInput = document.getElementById("audio"+file);
    var filePath = fileInput.value;
    var allowedExtensions = /(.mp3)$/i;
    if(!allowedExtensions.exec(filePath))
    {
        $$('#error2audio'+file).removeClass('oculto');
        $$('#error2audio'+file).addClass('visible');
        $$('#error3audio'+file).removeClass('visible');
        $$('#error3audio'+file).addClass('oculto');
        fileInput.value = '';
    }
    else
    {
        $$('#error2audio'+file).removeClass('visible');
        $$('#error2audio'+file).addClass('oculto');
        var a=parseInt($$('#audio'+file)[0].files[0].size);
        var b=a/1024;
        var c=b*8;
        var d=c/128;
        if (d<30 && d>0)
        {
            $$('#error3audio'+file).removeClass('visible');
            $$('#error3audio'+file).addClass('oculto');
        }
        else
        {
            $$('#error3audio'+file).removeClass('oculto');
            $$('#error3audio'+file).addClass('visible');
        }
    }
}
function validarImagen(file)
{
    var fileInput = document.getElementById("imagen"+file);
    var filePath = fileInput.value;
    var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
    if(!allowedExtensions.exec(filePath))
    {
        $$('#errorimagen'+file).removeClass('oculto');
        $$('#errorimagen'+file).addClass('visible');
        fileInput.value = '';
    }
    else
    {
        $$('#errorimagen'+file).removeClass('visible');
        $$('#errorimagen'+file).addClass('oculto');
        
        //Falta validar tamaño del archivo
    }
}