 function playPause(){
          var reproduciendo = true;
          var pista = document.getElementById('pista');
          var boton_play_pause = document.getElementById('boton_play_pause');
          boton_play_pause.onclick = function(){
             if(reproduciendo){
                reproduciendo = false;
                pista.pause();
                this.value=  ' Reproducir';
             }else{
                reproduciendo = true;
                pista.play();
                this.value=  'Pausar';
             }
          }
       }
function cargaBusqueda()
{
    var bd=firebase.firestore();
    var enfermedades=bd.collection('enfermedades').orderBy('titulo');
    enfermedades.get()
    .then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc)
        {
            console.log("titulo: "+ doc.data().titulo+" "+doc.data().titulo.length);
            
            $$('#listadoConsulta').append('<li class="item-content"><div class="item-inner"><button class="button item-title itemsConsulta"  id="'+doc.data().titulo+'">'+doc.data().titulo+'</button></div></li>');
        });
         $$(".itemsConsulta").on('click',function(){
            enfermedad=this.id; 
            mainView.router.navigate("/enfermedad/");
        });
    })
    .catch(function(error)
    {
        console.log('Error al recuperar los datos de la base', error);
    });
}

function cargarEnfermedad(enfermedad)
{
    var arreglo=[];
    var i=0;
   var bd=firebase.firestore();
    bd.collection('enfermedades').where('titulo','==',enfermedad).get()
     .then(function(querySnapshot)
     {
        querySnapshot.forEach(function(doc)
        {
            //console.log(doc.data().Pasos.length);
            
             doc.data().Pasos.forEach(function(element){

                   //  $$("#cajacarrusel").append('<div class="swiper-slide"><h4>'+element+'</h4></div>');
                    arreglo.push(element);
                    i++;
            });
            
            if(doc.data().Pasos.length===i)
            {
                var mySwiper = document.querySelector('.swiper-container').swiper;
                for(var j=0;j<i;j++)
                {
                    
                    //$$("#cajacarrusel").append('<div class="swiper-slide"><h4>'+arreglo[j]+'</h4></div><div class="swiper-button-prev"></div><div class="swiper-button-next" id="next"></div>');
                     var k=j+1;
                    if(j===0)
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><button class="play button button-fill " value="'+arreglo[j]+'"><i class="fas fa-play"></i></button><div class="swiper-button-next next"></div></div>');
                     }
                     else if(k===i)
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><div class="swiper-button-prev prev "></div><button class="play button button-fill" value="'+arreglo[j]+'"><i class="fas fa-play"></i></button></div>');
                     }
                     else
                     {
                            mySwiper.appendSlide('<div class="swiper-slide row "><div class="e " >'+arreglo[j]+'</div><div class="swiper-button-prev prev "></div> <button class="play button button-fill" value="'+arreglo[j]+'"><i class="fas fa-play"></i></button><div class="swiper-button-next next"></div></div>');
                     }
                
                }
               $$('.next').on('click',function(){
                    mySwiper.slideNext();
               });
               $$('.prev').on('click',function(){
                    mySwiper.slidePrev();
              });
                 $$('.play').on('click',function(){
                    tas(this.value);
                    
              });
            }
        });
        
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
