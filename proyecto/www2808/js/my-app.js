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
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
var enfermedad="";
var info="";

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  $$('.cerrar').on('click',cerrarSesion); //aca no anda
});


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
   // $$('.cerrar').on('click',cerrarSesion); //aca me lo hace 3 veces 
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
})


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
   
})
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
})  

$$(document).on('page:init', '.page[data-name="iniciarSesion"]', function (e) {
 
  $$('#inicio').on('click',function(){
      iniciarSesion();
  });
  $$('#olvido').on('click',function(){
      mainView.router.navigate("/olvidoClave/");
  });
  
})  

$$(document).on('page:init', '.page[data-name="olvidoClave"]', function (e) {
 
  $$('#olvidoClave').on('click',function(){ 
      olvidoClave();
  });
}) 
 
$$(document).on('page:init', '.page[data-name="homeAdmin"]', function (e) {
 
  $$('#nuevo').on('click',function(){ 
          mainView.router.navigate("/nuevaEnfermedad/");
  });
    $$('#editar').on('click',function(){
        console.log("ee");
        mainView.router.navigate("/editarEnfermedad/");
  });
})  

$$(document).on('page:init', '.page[data-name="nuevaEnfermedad"]', function (e) {
 var i=1;
  $$('#masPaso').on('click',function(){ 
      $$('#agregarpasos').append('<li class="item-content item-input" ><div class="item-inner"><div class="item-title item-label">Texto </div><div class="item-input-wrap"><textarea placeholder="Ingrese texto que va aparecer en el paso" id="textoenfermedad'+i+'"></textarea><span class="input-clear-button"></span></div></div></li>');
      i++;
  });
  $$('#guardarEnfermedad').on('click',function(){
      nuevaEnfermedad(i);
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
}) 
$$(document).on('page:init', '.page[data-name="infoEnfermedad"]', function (e) {
   
     cargarInfoEnfermedad(info);
     $$('#guardarCambios').on('click',function(){
         guardarCambios();
     });
}) 


$$(document).on('page:init', '.page[data-name="prueba"]', function (e) {
 
    var recognition;
	var recognizing = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition = new webkitSpeechRecognition();
		recognition.lang = "es-VE";
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
			console.log("empezando a escuchar");
		}
		recognition.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("texto").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition.onerror = function(event) {
		}
		recognition.onend = function() {
			recognizing = false;
			document.getElementById("procesar").innerHTML = "Escuchar";
			console.log("terminó de escuchar, llegó a su fin");

		}

	}

	function procesa() {

		if (recognizing === false) {
			recognition.start();
			recognizing = true;
			document.getElementById("procesar").innerHTML = "Detener";
		} else {
			recognition.stop();
			recognizing = false;
			document.getElementById("procesar").innerHTML = "Escuchar";
		}
	}
})  
