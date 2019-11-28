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
            path: '/infoEnfermedad/',
            url: 'infoEnfermedad.html',
        },
        {
            path:'/eliminarEnfermedad/',
            url:'eliminarEnfermedad.html',
        },
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
var enfermedadBusqueda=""; // se usa en el buscador
var arregloEliminarN=[]; // se usa para borrar pasos en nueva enfermedad
var info=""; // se usa en el buscador
var may="";
var arregloEliminarE=[]; // se usa para borrar pasos en editar enfermedad
var nroNuevoPasoE=""; // se usa en editar al agregar mas pasos
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    $$('.cerrar').on('click',cerrarSesion); //aca no anda
  
});
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
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
    eliminoVacios();
    cargaBusqueda(h);
    
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
    eliminoVacios();
    cargarEnfermedad(enfermedadBusqueda);
});

$$(document).on('page:init', '.page[data-name="iniciarSesion"]', function (e) {
    $$('#inicio').on('click',function(){
        iniciarSesion();
    });
    $$('#olvido').on('click',function(){
        mainView.router.navigate("/olvidoClave/");
    });  
});

$$(document).on('page:init', '.page[data-name="olvidoClave"]', function (e) {
    $$('#olvidoClave').on('click',function(){ 
        olvidoClave();
    });
});

$$(document).on('page:init', '.page[data-name="nuevaCategoria"]', function (e) {
    $$('#guardarCategoria').on('click',guardarCategoria);
});
 
$$(document).on('page:init', '.page[data-name="homeAdmin"]', function (e) {
    $$('#categoria').on('click',function(){ 
        mainView.router.navigate("/nuevaCategoria/");
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
});  

$$(document).on('page:init', '.page[data-name="nuevaEnfermedad"]', function (e) {
    $$('#tipoCat').on('change',function(){
        console.log("tipo: "+$$('#tipoCat').val());
        var tipo=$$('#tipoCat').val();
        if(tipo==1)
        {
            console.log("entro");
            var bd=firebase.firestore();
            bd.collection('catalogo').get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    console.log("entro 3");
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
        console.log("i: "+i);
        $$('#agregarpasos').append('<div class="card" id="paso'+i+'"><div class="card-header"><b>Paso:</b></div><div class="card-content card-content-padding"><textarea placeholder="Ingrese el texto del paso" id="textoenfermedad'+i+'" class="colorFondo"></textarea><div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div></div><div class="card-content card-content-padding"><input type="file" class="audios" name="audio'+i+'" id="audio'+i+'" disabled ><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div></div><div class="card-footer"><button class=" button button-small button-fill eli eliminarPaso" id="'+i+'">Eliminar</button></div></div>');
        if($$('#tituloE').val()==="")
        {
            $$('.audios').prop('disabled', true);
        }
        else
        {
            $$('.audios').prop('disabled', false);
        }
        i++;
        $$('.eliminarPaso').on('click',function(){
            var id= parseInt(this.id);
            console.log("eliminar id: "+id);
            arregloEliminarN.push(id);
            $$('#paso'+id).remove();
        });
    });
    $$('#guardarEnfermedad').on('click',function(){ 
        if($$('#tituloE').val()!=="")
        { //Lo de abajo para que nunca este vacio
            for(var j=1;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)===-1) // noesta en el arreglo
                {
                    console.log("j: "+j);
                    var paso=$$('#textoenfermedad'+j).val(); 
                    if(paso==="") //falta validar tamaño
                    {
                        $$('#errortextoenfermedad'+j).removeClass('oculto');
                        $$('#errortextoenfermedad'+j).addClass('visible');
                    }
                    else
                    {
                        $$('#errortextoenfermedad'+j).removeClass('visible');
                        $$('#errortextoenfermedad'+j).addClass('oculto');
                    }
                    if(document.getElementById('audio'+j).files.length === 0) // Falta validar tamaño y extension
                    {
                        console.log("entr");
                        $$('#erroraudio'+j).removeClass('oculto');
                        $$('#erroraudio'+j).addClass('visible');
                    }
                    else
                    {
                        $$('#erroraudio'+j).removeClass('visible');
                        $$('#erroraudio'+j).addClass('oculto');
                    }
                }                
    
            }
            var band=false;
            for(var j=0;j<i;j++)
            {
                if(arregloEliminarN.indexOf(j)==-1) // noesta en el arreglo
                {
                    if($$('#errortextoenfermedad'+j).hasClass('visible') || $$('#erroraudio'+j).hasClass('visible'))
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
                 app.dialog.alert('Debe completar los campos','Error');
            }           
        }
        else
        {
            app.dialog.alert('El titulo no puede estar vacio',' Error',function(){});
        }
    }); 
    $$('#tituloE').on('change',function(){
        $$('.audios').prop('disabled', false);
    });    
    $$('#1').on('click',function(){
        var id= parseInt(this.id);
        console.log("eliminar id: "+id);
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
    console.log("info");
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
    eliminoVacios();
    cargaBusqueda(j);
    $$('#volverEliminar').on('click',function(){
         app.popup.close('.popup-eliminar');    
    });
    $$('#confirmarEliminar').on('click',eliminar);
});

