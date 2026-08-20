export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Magyar AI Képszerkesztő</title>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  background:#0b0f17;
  color:white;
  font-family:Arial,sans-serif;
}

main{
  max-width:700px;
  margin:auto;
  padding:22px;
}

h1{
  text-align:center;
}

p{
  color:#aeb8c8;
  text-align:center;
}

.card{
  background:#151b27;
  border-radius:18px;
  padding:18px;
  margin-top:18px;
}

input,textarea,button{
  width:100%;
  font-size:16px;
  box-sizing:border-box;
}

input{
  padding:14px;
}

textarea{
  margin-top:15px;
  min-height:120px;
  padding:14px;
  border-radius:12px;
}

button{
  margin-top:15px;
  padding:16px;
  border:0;
  border-radius:12px;
  background:#2563eb;
  color:white;
  font-weight:bold;
}

img{
  display:none;
  width:100%;
  max-height:55vh;
  object-fit:contain;
  margin-top:15px;
  border-radius:12px;
}

#status{
  margin-top:15px;
  padding:12px;
  background:#0d121c;
  border-radius:10px;
}
</style>
</head>

<body>

<main>

<h1>Magyar AI Képszerkesztő</h1>

<p>
Tölts fel egy képet, majd írd le magyarul,
mit szeretnél rajta módosítani.
</p>

<div class="card">

<input
type="file"
id="kep"
accept="image/*">

<img id="elo">

<textarea
id="utasitas"
placeholder="Például: távolítsd el a hátteret és tegyél mögé tengerpartot.">
</textarea>

<button id="szerkeszt">
KÉP SZERKESZTÉSE
</button>

<div id="status">
Készen áll.
</div>

</div>

</main>

<script>

const kep =
document.getElementById("kep");

const elo =
document.getElementById("elo");

const utasitas =
document.getElementById("utasitas");

const status =
document.getElementById("status");

kep.onchange = function(){

  const fajl = this.files[0];

  if(!fajl) return;

  elo.src =
  URL.createObjectURL(fajl);

  elo.style.display =
  "block";

  status.textContent =
  "Kép betöltve.";
};

document.getElementById("szerkeszt")
.onclick = function(){

  if(!kep.files[0]){
    status.textContent =
    "Először válassz képet.";
    return;
  }

  if(!utasitas.value.trim()){
    status.textContent =
    "Írd le, mit szeretnél módosítani.";
    return;
  }

  status.textContent =
  "A felület működik. Következő lépés: AI képszerkesztő motor csatlakoztatása.";
};

</script>

</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    });
  }
};
