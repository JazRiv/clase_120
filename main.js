var objeto_anterior = "";

function setup() {
  canvas = createCanvas(300, 300);
  canvas.center();
  background("green")
  canvas.position(530, 270)
  video = createCapture(VIDEO);
  video.hide();
  modelo = ml5.imageClassifier("MobileNet", modelo_listo);
  hablar = window.speechSynthesis;
}

function draw(){
  image(video, 0, 0, 300, 300);
  modelo.classify(video, verificar);
}

function verificar(error, respuesta){
  if(!error){
    var objeto_actual = respuesta[0].label;
    var confianza_ac = respuesta[0].confidence.toFixed(2);
    if (objeto_actual != objeto_anterior && confianza_ac > 0.5){
      fetch("https://api.mymemory.translated.net/get?q=" + objeto_actual + "&langpair=en|es")
      .then ( response => response.json())
      .then (data =>{
        traduccion = data.responseData.translatedText;
        document.getElementById("result_obj").innerHTML = traduccion;
        document.getElementById("conf").innerHTML = confianza_ac + "%";
        mensaje = new SpeechSynthesisUtterance(traduccion);
        mensaje.lang = "es-MX";
        hablar.speak(mensaje);
      })
      objeto_anterior = objeto_actual;

    }
  }
}

function modelo_listo(){
  console.log("Ya estoy listo");
}
