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

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    $$('.cerrar').on('click',cerrarSesion); //aca no anda
    $$('.manualUsuario').on('click',function(){
         app.dialog.alert('Manual de usuario en proceso de desarrollo','Confirmacion');
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

    var searchbar = app.searchbar.create({
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
    var mySwiper = new Swiper('.swiper-container', {
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
    $$('#guardarCategoria').on('click',function(){
        var cat=$$('#titCategoria').val();
        validarTitulo(cat);
        if($$('#errorTitulo').hasClass('visible')===false)
        {
            guardarCategoria();
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
    arregloEliminarN=[];
    var i=2;
    $$('.masPaso').on('click',function(){
  
        $$('#agregarpasos').append('<div class="card" id="paso'+i+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding"><textarea placeholder="Ingrese el texto del paso" id="textoenfermedad'+i+'" class="colorFondo"></textarea><span class="input-clear-button"></span><div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div><div class="oculto textoerror" id="error2textoenfermedad'+i+'" >La cantidad de caracteres debe ser menor a 170.</div></div><div class="card-header"><b>Audio:</b></div><div class="card-content card-content-padding"><input type="file" class="audios" name="audio'+i+'" id="audio'+i+'" disabled><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div> <div class="oculto textoerror" id="error2audio'+i+'" >El archivo debe tener formato mp3.</div> <div class="oculto textoerror" id="error3audio'+i+'" >El archivo debe durar menos de 30 segundos.</div></div><div class="card-header"><b>Imagen:</b></div><div class="card-content card-content-padding"><input type="file" class="imagenes" name="imagen'+i+'" id="imagen'+i+'" disabled><div class="oculto textoerror" id="errorimagen1" >El archivo debe tener formato jpg, jpge o png.</div></div> <div class="card-footer"><button class=" button button-small button-fill eli eliminarPaso" id="'+i+'">Eliminar</button></div></div>');
        if($$('#tituloE').val()==="")
        {
            $$('.audios').prop('disabled', true);
            $$('.imagenes').prop('disabled', true);
        }
        else
        {
            $$('.audios').prop('disabled', false);
            $$('.imagenes').prop('disabled', false);
        }
        i++;
        $$('.eliminarPaso').on('click',function(){
            var id= parseInt(this.id);
           
            arregloEliminarN.push(id);
            $$('#paso'+id).remove();
        });
    });
    $$('#guardarEnfermedad').on('click',function(){ 
        if($$('#tituloE').val()!=="")
        { 
            var cat=$$('#tituloE').val();
            validarTitulo(cat);  
            for(var j=1;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                {
                 
                    var paso=$$('#textoenfermedad'+j).val(); 
                    if(paso==="") 
                    {
                        $$('#errortextoenfermedad'+j).removeClass('oculto');
                        $$('#errortextoenfermedad'+j).addClass('visible');
                    }
                    else
                    {
                        $$('#errortextoenfermedad'+j).removeClass('visible');
                        $$('#errortextoenfermedad'+j).addClass('oculto');
                        if($$('#textoenfermedad'+j).val().length>170)
                        {
                            $$('#error2textoenfermedad'+j).removeClass('oculto');
                            $$('#error2textoenfermedad'+j).addClass('visible');
                        }
                        else
                        {
                            $$('#error2textoenfermedad'+j).removeClass('visible');
                            $$('#error2textoenfermedad'+j).addClass('oculto');   
                        }

                    }
                    if(document.getElementById('audio'+j).files.length === 0) 
                    {
                        $$('#erroraudio'+j).removeClass('oculto');
                        $$('#erroraudio'+j).addClass('visible');
                    }
                    else
                    {
                        fileValidation(j);
                        $$('#erroraudio'+j).removeClass('visible');
                        $$('#erroraudio'+j).addClass('oculto');
                    }
                     if(document.getElementById('imagen'+j).files.length !== 0) 
                     {
                         validarImagen(j);
                     }
                }                
    
            }
            var band=false;
            for(var j=0;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                {
                    if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#error2textoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible') || $$('#error2audio'+j).hasClass('visible') || $$('#error3audio'+j).hasClass('visible') || $$('#errorTitulo').hasClass('visible') || $$('#errorimagen'+j).hasClass('visible'))
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
            app.dialog.alert('El titulo no puede estar vacio',' Error',function(){});
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
    var searchbar = app.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title',
      on: {
        search(sb, query, previousQuery) {
          console.log(query, previousQuery);
        }
      }
    });
    var j="e";
    cargaBusqueda(j);
});
 
$$(document).on('page:init', '.page[data-name="infoEnfermedad"]', function (e) {
    cargarInfoEnfermedad(info);
}); 

$$(document).on('page:init', '.page[data-name="eliminarEnfermedad"]', function (e) {

    var searchbar = app.searchbar.create({
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

 
$$(document).on('page:init', '.page[data-name="editarCategoria"]', function (e) {
    var bd=firebase.firestore();
    bd.collection('catalogo').get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            $$('#ediTitC').append('<option value="'+doc.id+'" >'+doc.id+'</option>');                    
        });
    }); 
    $$('.opciones').on('change',function(){
        if($$('.opciones').val()==="vacio")
        {
            $$('#divNuevoTit').removeClass('visible').addClass('oculto');
            $$('#guardarCat').prop('disabled', true);
        }
        else
        {
            $$('#divNuevoTit').removeClass('oculto').addClass('visible');
            $$('#guardarCat').prop('disabled', false);
        }

    });
    $$('#guardarCat').on('click',function(){
   
       var cat=$$('#titNuevoC').val();
       validarTitulo(cat);
        if($$('#errorTitulo').hasClass('visible')===false)
        {
            guardarTitulo();
        }
       
    });

}); 

$$(document).on('page:init', '.page[data-name="eliminarCategoria"]', function (e) {
    var searchbar = app.searchbar.create({
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
    eliminoVacios(j);
    $$('#volverEliminar').on('click',function(){
         app.popup.close('.popup-eliminarC');    
    });
    $$('#confirmarEliminar').on('click',eliminarCategoria);
});

