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
        path: '/enfermedad/',
        url: 'enfermedad.html',
      },
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
var enfermedad="";


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
  /*  app.dialog.preloader();
    setTimeout(function () {
        app.dialog.close();
    }, 3000);*/
   
  
var recognition;

    recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            q.value = event.results[0][0].transcript;
            q.form.submit();
        }
    }
}
);


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
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
  
     cargaBusqueda();
    $$('#e').on('click',function(){
        mainView.router.navigate("/enfermedad/");
    });
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
$$(document).on('page:init','.page[data-name="prueba"]',function (e){
    // make sure your the code gets executed only after `deviceready`.
    
 
})
 