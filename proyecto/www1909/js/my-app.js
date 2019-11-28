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
var enfermedad="";
var info="";
var cantPasosInfo=0;
var arregloPruebaEliminar=[];

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
    cargarEnfermedad(enfermedad);
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
 
$$(document).on('page:init', '.page[data-name="homeAdmin"]', function (e) {
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
arregloPruebaEliminar=[];
  var i=1;
    $$('.masPaso').on('click',function(){ 
        $$('#agregarpasos').append('<li class="item-content item-input" id="paso'+i+'" ><div class="item-inner"><div><div class="item-title item-label">Texto </div><button class=" button button-small button-fill eli eliminarPaso" id="'+i+'">Eliminar</button></div><div class="item-input-wrap"><textarea placeholder="Ingrese texto que va aparecer en el paso" id="textoenfermedad'+i+'" class="resizable textoPrueba" ></textarea><span class="input-clear-button"></span> <div class="oculto textoerror" id="errortextoenfermedad'+i+'" >Completar este campo.</div></div><div class="item-title item-label">Audio </div><div class="item-input-wrap bordeinferior"><input type="file" name="audio'+i+'" id="audio'+i+'" class="audios" disabled ><span class="input-clear-button"></span><div class="oculto textoerror" id="erroraudio'+i+'" >Completar este campo.</div></div></div></li>');
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
             arregloPruebaEliminar.push(id);
             $$('#paso'+id).remove();
        });
    });

    
    $$('#guardarEnfermedad').on('click',function(){
        
        if($$('#tituloE').val()!=="")
        { //Lo de abajo para que nunca este vacio
            for(var j=0;j<i;j++)
            {
                if(arregloPruebaEliminar.indexOf(j)==-1) // noesta en el arreglo
                {
                    var paso=$$('#textoenfermedad'+j).val();   
                    var url=document.getElementById('audio'+j).files[0];
                    if(paso==="")
                    {
                        $$('#errortextoenfermedad'+j).removeClass('oculto');
                        $$('#errortextoenfermedad'+j).addClass('visible');
                    }
                    else
                    {
                        $$('#errortextoenfermedad'+j).removeClass('visible');
                        $$('#errortextoenfermedad'+j).addClass('oculto');
                    }
                    if(url===null)
                    { 
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
                if(arregloPruebaEliminar.indexOf(j)==-1) // noesta en el arreglo
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
    $$('#guardarCambios').on('click',function(){
        guardarCambios();
    });
    $$('#masPasos').on('click',function(){ /* analizar*/
        $$('#infoul').append('<li class="item-content item-input" ><div class="item-inner"><div class="item-title item-label">Texto </div><div class="item-input-wrap"><textarea placeholder="Ingrese texto que va aparecer en el paso" id="textoenfermedad'+cantPasosInfo+'"></textarea><span class="input-clear-button"></span></div><div class="item-title item-label">Audio </div><div class="item-input-wrap bordeinferior"><input type="file" name="audio'+cantPasosInfo+'"></div></div></li>');
        cantPasosInfo++;
    });
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
    cargaBusqueda(j);
    $$('#volverEliminar').on('click',function(){
         app.popup.close('.popup-eliminar');    
    });
    $$('#confirmarEliminar').on('click',eliminar);

});

$$(document).on('page:init', '.page[data-name="prueba"]', function (e) {
    console.log("prueba");
 var i=1;
    $$('#masPaso').on('click',function(){ 
        $$('#agregarpasos').append('<li class="item-content item-input" ><div class="item-inner"><div class="item-title item-label">Texto </div><div class="item-input-wrap"><textarea placeholder="Ingrese texto que va aparecer en el paso" id="textoenfermedad'+i+'"></textarea><span class="input-clear-button"></span></div><div class="item-title item-label">Audio </div><div class="item-input-wrap bordeinferior"><input type="file" name="audio'+i+'" id="audio'+i+'" class="audios" ></div></div></li>');

        i++;
    });
    $$('#guardarEnfermedad').on('click',function(){
        
        prueba(i);
            //nuevaEnfermedad(i);

    });      
});  
