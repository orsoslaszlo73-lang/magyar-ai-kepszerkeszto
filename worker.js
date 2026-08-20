  export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/edit") {
      try {
        if (!env.AI) {
          return Response.json(
            { error: "Az AI kapcsolat még nincs beállítva." },
            { status: 500 }
          );
        }

        const form = await request.formData();
        const file = form.get("image");
        const prompt = String(form.get("prompt") || "").trim();

        if (!(file instanceof File)) {
          return Response.json(
            { error: "Válassz ki egy képet." },
            { status: 400 }
          );
        }

        if (!prompt) {
          return Response.json(
            { error: "Írd le, mit szeretnél módosítani." },
            { status: 400 }
          );
        }

        const image = new Uint8Array(await file.arrayBuffer());

        const output = await env.AI.run(
          "@cf/runwayml/stable-diffusion-v1-5-img2img",
          {
            prompt: prompt,
            image: Array.from(image),
            strength: 0.65,
            guidance: 7.5,
            num_steps: 20
          }
        );

        return new Response(output, {
          headers: {
            "content-type": "image/png",
            "cache-control": "no-store"
          }
        });

      } catch (error) {
        return Response.json(
          { error: String(error?.message || error) },
          { status: 500 }
        );
      }
    }

    return new Response(`<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>Magyar AI Képszerkesztő</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #0b0f17;
  color: white;
  font-family: Arial, sans-serif;
}

main {
  max-width: 700px;
  margin: auto;
  padding: 25px 16px;
}

h1 {
  font-size: 30px;
  margin-bottom: 8px;
}

p {
  color: #aeb8ca;
  line-height: 1.5;
}

.card {
  background: #151b27;
  border: 1px solid #293247;
  border-radius: 18px;
  padding: 18px;
  margin-top: 18px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}

input[type=file] {
  width: 100%;
}

textarea {
  width: 100%;
  min-height: 120px;
  background: #0c111b;
  color: white;
  border: 1px solid #39445c;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
}

button {
  width: 100%;
  margin-top: 15px;
  padding: 15px;
  border: 0;
  border-radius: 12px;
  background: #5b8cff;
  color: white;
  font-size: 17px;
  font-weight: bold;
}

button:disabled {
  opacity: .5;
}

img {
  display: block;
  max-width: 100%;
  margin: 15px auto 0;
  border-radius: 12px;
}

#status {
  margin-top: 12px;
  color: #b9c4d7;
}

#download {
  display: block;
  margin-top: 15px;
  padding: 14px;
  border-radius: 12px;
  background: #26334c;
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}

.hidden {
  display: none;
}
</style>
</head>

<body>

<main>

<h1>Magyar AI Képszerkesztő</h1>

<p>
Tölts fel egy képet, majd írd le magyarul,
hogyan szeretnéd átalakítani.
</p>

<div class="card">

<label>1. Kép feltöltése</label>

<input
  id="image"
  type="file"
  accept="image/*"
>

<img
  id="preview"
  class="hidden"
>

</div>

<div class="card">

<label>2. Mit változtassak?</label>

<textarea
  id="prompt"
  placeholder="Például: Cseréld le a hátteret naplementés tengerpartra."
></textarea>

<button id="edit">
AI képszerkesztés
</button>

<div id="status"></div>

</div>

<div
  id="resultBox"
  class="card hidden"
>

<label>3. Elkészült kép</label>

<img id="result">

<a
  id="download"
  download="szerkesztett-kep.png"
>
Kép mentése
</a>

</div>

</main>

<script>

const imageInput =
  document.getElementById("image");

const preview =
  document.getElementById("preview");

const promptInput =
  document.getElementById("prompt");

const button =
  document.getElementById("edit");

const status =
  document.getElementById("status");

const resultBox =
  document.getElementById("resultBox");

const result =
  document.getElementById("result");

const download =
  document.getElementById("download");


imageInput.onchange = () => {

  const file =
    imageInput.files[0];

  if (!file) return;

  preview.src =
    URL.createObjectURL(file);

  preview.classList.remove("hidden");
};


button.onclick = async () => {

  const file =
    imageInput.files[0];

  const prompt =
    promptInput.value.trim();


  if (!file) {

    status.textContent =
      "Előbb válassz ki egy képet.";

    return;
  }


  if (!prompt) {

    status.textContent =
      "Írd le, mit szeretnél módosítani.";

    return;
  }


  button.disabled = true;

  status.textContent =
    "Az AI dolgozik a képen...";

  resultBox.classList.add("hidden");


  try {

    const form =
      new FormData();

    form.append(
      "image",
      file
    );

    form.append(
      "prompt",
      prompt
    );


    const response =
      await fetch(
        "/edit",
        {
          method: "POST",
          body: form
        }
      );


    if (!response.ok) {

      let message =
        "Hiba történt.";

      try {

        const data =
          await response.json();

        message =
          data.error || message;

      } catch {}

      throw new Error(message);
    }


    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(blob);


    result.src = url;

    download.href = url;

    resultBox.classList.remove(
      "hidden"
    );

    status.textContent =
      "Kész!";

  }

  catch (error) {

    status.textContent =
      "Hiba: " + error.message;

  }

  finally {

    button.disabled = false;

  }
};

</script>

</body>
</html>`, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-store"
      }
    });
  }
};
