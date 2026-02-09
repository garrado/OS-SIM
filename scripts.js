// ============================
// Configuração do Firebase
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyDo473puJesZ9rr3IBoX5AWczCIMuKBTrg",
  authDomain: "visam-3a30b.firebaseapp.com",
  projectId: "visam-3a30b"
};

// Inicializa o app
const app = firebase.initializeApp(firebaseConfig);

// Serviços
const auth = firebase.auth();
const db = firebase.firestore();

// ============================
// LOGIN COM GOOGLE
// ============================
if (window.loginPage) {
  document.getElementById("btnGoogle").addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const email = result.user.email;

      // Verifica perfil no Firestore
      const userDoc = await db.collection("usuarios").doc(email).get();
      if (!userDoc.exists || !userDoc.data().ativo) {
        alert("Usuário não autorizado!");
        await auth.signOut();
        return;
      }

      sessionStorage.setItem("email", email);
      sessionStorage.setItem("grupo", userDoc.data().grupo);
      window.location = "dashboard.html";
    } catch (err) {
      alert("Erro no login: " + err.message);
    }
  });
}

// ============================
// VERIFICA SESSÃO
// ============================
if (!window.loginPage) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location = "index.html";
      return;
    }
    const email = sessionStorage.getItem("email");
    const grupo = sessionStorage.getItem("grupo");
    if (!email || !grupo) {
      auth.signOut();
      window.location = "index.html";
    }
    if (window.dashboardPage) {
      document.getElementById("usuarioInfo").innerText =
        `Olá, ${email} (${grupo})`;
    }
  });
}

// ============================
// LISTA DE CONTRIBUINTES
// ============================
if (window.contribuintesPage) {
  db.collection("contribuintes")
    .get()
    .then(snapshot => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const d = doc.data();
        html += `<li>${d.documento} — ${d.razaoSocial}</li>`;
      });
      html += "</ul>";
      document.getElementById("listaContribuintes").innerHTML = html;
    });
}

// ============================
// LISTA DE ORDENS DE SERVIÇO
// ============================
if (window.ordensPage) {
  db.collection("ordensServico")
    .get()
    .then(snapshot => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const o = doc.data();
        html += `<li>${o.contribuinteId} — ${o.status}</li>`;
      });
      html += "</ul>";
      document.getElementById("listaOrdens").innerHTML = html;
    });
}
