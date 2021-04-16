// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/about/',
            url: 'about.html',
        },
        {
            path: '/prueba/',
            url: 'prueba.html',
        },
        {
            path: '/home/',
            url: 'home.html',
        },

        {
            path: '/index/',
            url: 'index.html',
        },
        {
            path: '/enfermedad/',
            url: 'enfermedad.html',
        },
        {
            path: '/iniciarSesion/',
            url: 'iniciarSesion.html',
        },
        {
            path: '/homeAdmin/',
            url: 'homeAdmin.html',
        },
        {
            path:'/nuevaCategoria/',
            url:'nuevaCategoria.html',
        },
        {
            path: '/olvidoClave/',
            url: 'olvidoClave.html',
        },
        {
            path: '/nuevaEnfermedad/',
            url: 'nuevaEnfermedad.html',
        },
        {
            path: '/editarEnfermedad/',
            url: 'editarEnfermedad.html',
        },
        {
            path: '/editarCategoria/',
            url: 'editarCategoria.html',
        },
        {
            path: '/infoEnfermedad/',
            url: 'infoEnfermedad.html',
        },
        {
            path:'/eliminarEnfermedad/',
            url:'eliminarEnfermedad.html',
        },
        {
          path:'/eliminarCategoria/',
          url:'eliminarCategoria.html',
        },

    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
var enfermedadBusqueda=""; // se usa en el buscador
var arregloEliminarN=[]; // se usa para borrar pasos en nueva enfermedad
var info=""; // se usa en el buscador
var may="";
var nom=""; // se usa cargaBusqueda, nombre categoria
var arregloEliminarE=[]; // se usa para borrar pasos en editar enfermedad
var nroNuevoPasoE=0; // se usa en editar al agregar mas pasos
var recognition;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    $$('.cerrar').on('click',cerrarSesion); //aca no anda
    $$('.manualUsuario').on('click',function(){
        //app.dialog.alert('Manual informativo en proceso de desarrollo','Lo sentimos :(');
        document.addEventListener('deviceready', onDeviceReady, false);
            function onDeviceReady() {
                var inAppBrowserRef;
  
                inAppBrowserRef = cordova.InAppBrowser.open('https://www.argentina.gob.ar/sites/default/files/manual_1ros_auxilios_web.pdf','_system','location=yes');
                //inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
                inAppBrowserRef.addEventListener('loadstop', function(){loadStopCallBack('https://www.argentina.gob.ar/sites/default/files/manual_1ros_auxilios_web.pdf')});
                //inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
                //inAppBrowserRef.addEventListener('beforeload', beforeloadCallBack);
                //inAppBrowserRef.addEventListener('message', messageCallBack); 
        }    
    });
});
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    //console.log(e);
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
});


$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    app.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title',
      on: {
        search(sb, query, previousQuery) {
          console.log(query, previousQuery);
        }
      }
    });
    var h="h";
    var admin=firebase.auth().currentUser;
    if(admin)
    {
         $$('.home').prepend('<div class="left"><a href="#" class="link back"><i class="icon icon-back"></i><span class="ios-only">Back</span></a></div>');
    }
    eliminoVacios(h);
});

$$(document).on('page:init', '.page[data-name="enfermedad"]', function (e) {
    new Swiper('.swiper-container', {
        speed: 400,
        spaceBetween: 100,
        pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      },
    });
    if(nom !== enfermedadBusqueda)
    {
        var nn=nom + "  " +enfermedadBusqueda;
    }
    else{
        var nn=enfermedadBusqueda;
    }

    $$('#nombre').html(nn);
    cargarEnfermedad(enfermedadBusqueda);
});

$$(document).on('page:init', '.page[data-name="iniciarSesion"]', function (e) {
    $$('#inicio').on('click',function(){
        iniciarSesion();
    });
    $$('#olvido').on('click',function(){
       olvidoClave();
    });
});



$$(document).on('page:init', '.page[data-name="nuevaCategoria"]', function (e) {
    //Validar que el usuario escriba sólo x cant de caracteres
    var textEntered = document.getElementById('titCategoria');
    var countRemaining = document.getElementById('charactersRemaining');

    textEntered.addEventListener('input', function(e) {
        const target = e.target;
        const maxLength = target.getAttribute('maxlength');
        const currentLength = target.value.length;
        if(currentLength !== 0){
            $$('#errorTituloCat').removeClass('visible').addClass('oculto');
            $$('#guardarCategoria').removeClass('disabled')
        }
        else{
            $$('#guardarCategoria').addClass('disabled')
        }
        countRemaining.innerHTML = `${currentLength}/${maxLength}`; 
    });

    $$('#guardarCategoria').on('click',function(){
        console.log("dentro de myapp: "+textEntered);
        validarTitulo(textEntered.value);
        if($$('#errorTituloCat').hasClass('oculto'))
        {
            console.log("entro bien");
            guardarCategoria();
        }
        else
        {
            console.log("Titulo vacío");
        }
    });
});
    
$$(document).on('page:init', '.page[data-name="editarCategoria"]', function (e) {
    var bd=firebase.firestore();
    bd.collection('catalogo').get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            $$('#ediTitC').append('<option value="'+doc.id+'" >'+doc.id+'</option>');
        });
    });
    $$('.opciones').on('change',function(){
        if($$('.opciones').val()=== 0 || $$('.opciones').val()==="" )
        {
            $$('#divNuevoTit').removeClass('visible').addClass('oculto');
            $$('#guardarCat').prop('disabled', true);
            $$('#guardarCat').addClass('disabled');
        }
        else
        {
            $$('#divNuevoTit').removeClass('oculto').addClass('visible');
            $$('#guardarCat').prop('disabled', false);
        }
    });

    var textEntered = document.getElementById('titNuevoCat');
    var countRemaining = document.getElementById('charactersRemaining');

    textEntered.addEventListener('input', function(e) {
        const target = e.target;
        // Get the `maxlength` attribute
        const maxLength = target.getAttribute('maxlength');
        // Count the current number of characters
        const currentLength = target.value.length;
        if(currentLength !== 0){
            $$('#errorTituloCat').removeClass('visible').addClass('oculto')
            $$('#guardarCat').removeClass('disabled')
        }
        else{
            $$('#guardarCat').addClass('disabled')
        }
        countRemaining.innerHTML = `${currentLength}/${maxLength}`;
    });    

    $$('#guardarCat').on('click',function(){
        console.log("dentro de myapp: "+textEntered);
        validarTitulo(textEntered.value);
        if($$('#errorTituloCat').hasClass('oculto'))
        {
            if($$('#errorTituloCat').hasClass('oculto'))
            {
                console.log("entro bien");
                 guardarTitulo();
            }
        }
        else
        {
            console.log("funcionp");
        }
    });
});

$$(document).on('page:init', '.page[data-name="homeAdmin"]', function (e) {
    $$('#nuevoC').on('click',function(){
        mainView.router.navigate("/nuevaCategoria/");
    });
    $$('#editarC').on('click',function(){
        mainView.router.navigate("/editarCategoria/");
    });
   $$('#nuevo').on('click',function(){
        mainView.router.navigate("/nuevaEnfermedad/");
    });
    $$('#editar').on('click',function(){
        mainView.router.navigate("/editarEnfermedad/");
    });
    $$('#eliminar').on('click',function(){
        mainView.router.navigate("/eliminarEnfermedad/");
    });
    $$('#eliminarC').on('click',function(){
        mainView.router.navigate("/eliminarCategoria/");
    });
    $$('#listado').on('click',function(){
        mainView.router.navigate("/home/");
    });

});

$$(document).on('page:init', '.page[data-name="nuevaEnfermedad"]', function (e) {
    $$('#tipoCat').on('change',function(){
        var tipo=$$('#tipoCat').val();
        if(tipo==1)
        {
            var bd=firebase.firestore();
            bd.collection('catalogo').get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                       $$('#idCat').append('<option value="'+doc.id+'">'+doc.id+'</option>');
                });
            });
            $$('#subcategoria').removeClass('oculto').addClass('visible');
        }
        else
        {
            $$('#subcategoria').removeClass('visible').addClass('oculto');
        }
    });

    //Validacion TITULO con x cant de caracteres
    var textEntered = document.getElementById('tituloE');
    var countRemaining = document.getElementById('charactersRemaining');

    textEntered.addEventListener('input', function(e) {
        const target = e.target;
        const maxLength = target.getAttribute('maxlength');
        const currentLength = target.value.length;
        if(currentLength !== 0){
            $$('#errorTitulo').removeClass('visible').addClass('oculto');
            $$('.audios').prop('disabled', false);
            $$('.imagenes').prop('disabled', false);
        }
        else{
            $$('.audios').prop('disabled', true);
            $$('.imagenes').prop('disabled', true);
        }
        countRemaining.innerHTML = `${currentLength}/${maxLength}`; 
    });

    //Validacion PASO con x cant de caracteres
    var textEnteredPaso = document.getElementById('textoenfermedad1');
    var countRemainingPaso = document.getElementById('charactersRemainingPaso');

    textEnteredPaso.addEventListener('input', function(e) {
        const targetPaso = e.target;
        const maxLengthPaso = targetPaso.getAttribute('maxlength');
        const currentLengthPaso = targetPaso.value.length;
        if(currentLengthPaso !== 0){
            $$('#errortextoenfermedad1').removeClass('visible').addClass('oculto')
            $$('#guardarEnfermedad').removeClass('disabled');
        }
        else{
            $$('#guardarEnfermedad').addClass('disabled');
        }
        countRemainingPaso.innerHTML = `${currentLengthPaso}/${maxLengthPaso}`; 
    });         

    arregloEliminarN=[];
    var i=2;

    $$('.masPaso').on('click',function(){
        $$('#agregarpasos').append('<div class="card" id="paso'+i+'"><div class="card-header" id="descPaso" style="float: left;"><b>Paso:</b></div><div class="card-content card-content-padding"><textarea id="textoenfermedad'+i+'" minlength="1" maxlength="170" required placeholder="Ingrese el texto del paso..." autofocus></textarea><span class="input-clear-button"></span><div class="text-right mt-1" id="charactersRemainingPasoExtra"><span id="current">0</span><span id="maximum">/ 170</span></div><div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div></div><div class="card-header" id="IDaudio" style="float: left;"><b>Audio:</b></div><div class="card-content card-content-padding"><input type="file" accept="audio/mpeg, audio/mp3" class="audios" name="audio'+i+'" id="audio'+i+'" disabled><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error3audio'+i+'" >El archivo debe ser menor a 500kb.</div></div><div class="card-header"><b>Imagen:</b></div><div class="card-content card-content-padding"><input type="file" accept="image/png, image/jpeg, image/jpg" class="imagenes" name="imagen'+i+'" id="imagen'+i+'" disabled><div class="oculto textoerror" id="errorimagen'+i+'">El archivo no puede pesar más de 300kb</div><div class="card-footer"><button class=" button button-small button-outline color-red eli eliminarPaso" id="'+i+'">Eliminar paso</button></div></div>');
        //Validacion PASO EXTRA con x cant de caracteres
        var textEnteredPasoExtra = document.getElementById('textoenfermedad'+i+'');
        var countRemainingPasoExtra = document.getElementById('charactersRemainingPasoExtra');

        textEnteredPasoExtra.addEventListener('input', function(e) {
            const targetPasoExtra = e.target;
            const maxLengthPasoExtra = targetPasoExtra.getAttribute('maxlength');
            const currentLengthPasoExtra = targetPasoExtra.value.length;
            if(currentLengthPasoExtra !== 0){
                $$('#errortextoenfermedad'+i+'').removeClass('visible').addClass('oculto');
                $$('#guardarEnfermedad').removeClass('disabled');
            }
            else
            {
                $$('#guardarEnfermedad').addClass('disabled');
            }    
            countRemainingPasoExtra.innerHTML = `${currentLengthPasoExtra}/${maxLengthPasoExtra}`; 
        });     
        i++;
        $$('.eliminarPaso').on('click',function(){
            var id= parseInt(this.id);
            arregloEliminarN.push(id);
            $$('#paso'+id).remove();
        });
    });

    $$('#guardarEnfermedad').on('click',function(){
        if(textEntered.value !=="")
        {
            validarTitulo(textEntered.value);
            for(var j=1;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                {   
                    var paso=$$('#textoenfermedad'+j).val();
                    if(paso==="")
                    {
                        $$('#errortextoenfermedad'+j).removeClass('oculto').addClass('visible');
                    }
                    else
                    {
                        $$('#errortextoenfermedad'+j).removeClass('visible').addClass('oculto');
                    }
                    if(document.getElementById('audio'+j).files.length === 0)
                    {
                        $$('#erroraudio'+j).removeClass('oculto').addClass('visible');
                    }
                    else
                    {
                        fileValidation(j);
                        $$('#erroraudio'+j).removeClass('visible').addClass('oculto');
                    }
                    if(document.getElementById('imagen'+j).files.length !== 0)
                    {
                        validarImagen(j);
                        $$('#errorimagen'+j).removeClass('visible').addClass('oculto');
                    }
                }
            }
            var band=false;
            for(var j=0;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                {
                    if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible') || $$('#error3audio'+j).hasClass('visible') || $$('#errorTitulo').hasClass('visible') || $$('#errorimagen'+j).hasClass('visible'))
                    {
                        band=true;
                    }
                }
            }
            if(band===false)
            {
                nuevaEnfermedad(i);
            }
            else
            {
                 app.dialog.alert('Verificar datos','Error');
            }
        }
        else
        {
            app.dialog.alert('El título no puede estar vacío',' Error',function(){});
        }
    });
    $$('#tituloE').on('change',function(){
        $$('.audios').prop('disabled', false);
        $$('.imagenes').prop('disabled', false);
    });
    $$('#1').on('click',function(){
        var id= parseInt(this.id);
         arregloEliminarN.push(id);
         $$('#paso'+id).remove();
    });
})


$$(document).on('page:init', '.page[data-name="editarEnfermedad"]', function (e) {
    app.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title',
      on: {
        search(sb, query, previousQuery) {
          console.log(query, previousQuery);
        }
      }
    });
    var h="e";
    eliminoVacios(h);
});

$$(document).on('page:init', '.page[data-name="infoEnfermedad"]', function (e) {
    if(nom !== info)
    {
        var nn=nom + "  " +info;
    }
    else{
        var nn=info;
    }
    $$('#nombre').html(nn);
    cargarInfoEnfermedad(info);
});

$$(document).on('page:init', '.page[data-name="eliminarEnfermedad"]', function (e) {
    app.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title',
      on: {
        search(sb, query, previousQuery) {
          console.log(query, previousQuery);
        }
      }
    });
    var j="el";
    eliminoVacios(j);
    $$('#volverEliminar').on('click',function(){
         app.popup.close('.popup-eliminar');
    });
    $$('#confirmarEliminar').on('click',function(){
        eliminarImg();
        eliminarAud();
        eliminar();
    });
});


$$(document).on('page:init', '.page[data-name="eliminarCategoria"]', function (e) {
    app.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title',
      on: {
        search(sb, query, previousQuery) {
          console.log(query, previousQuery);
        }
      }
    });
    var j="elc";
    cargaBusqueda(j);
    $$('#volverEliminar').on('click',function(){
         app.popup.close('.popup-eliminarC');
    });
    $$('#confirmarEliminar').on('click',function(){
        eliminarCategoria();
    });  
});