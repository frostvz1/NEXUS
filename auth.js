/* =========================
   NEXUS — AUTENTICAÇÃO
========================= */

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");

const loginButton =
    document.getElementById("loginButton");

const registerButton =
    document.getElementById("registerButton");

const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("registerMessage");


/* =========================
   TROCAR TELAS
========================= */

showRegister.addEventListener("click", () => {

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    loginMessage.textContent = "";

});


showLogin.addEventListener("click", () => {

    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    registerMessage.textContent = "";

});


/* =========================
   VERIFICAR SESSÃO
========================= */

async function checkExistingSession() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return;

    }

    if (data.session) {

        window.location.replace(
            "index.html"
        );

    }

}


checkExistingSession();


/* =========================
   LOGIN
========================= */

loginButton.addEventListener(
    "click",
    async () => {

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        loginMessage.textContent = "";


        if (!email || !password) {

            loginMessage.textContent =
                "Preencha todos os campos.";

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Entrando...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email,
                        password

                    });


            if (error) {

                loginMessage.textContent =
                    error.message;

                loginButton.disabled = false;

                loginButton.textContent =
                    "Entrar";

                return;

            }


            if (!data.session) {

                loginMessage.textContent =
                    "Login realizado, mas nenhuma sessão foi criada.";

                loginButton.disabled = false;

                loginButton.textContent =
                    "Entrar";

                return;

            }


            loginMessage.textContent =
                "Login realizado. Abrindo NEXUS...";


            setTimeout(() => {

                window.location.replace(
                    "index.html"
                );

            }, 300);


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Ocorreu um erro ao entrar.";

            loginButton.disabled = false;

            loginButton.textContent =
                "Entrar";

        }

    }
);


/* =========================
   CADASTRO
========================= */

registerButton.addEventListener(
    "click",
    async () => {

        const name =
            document
                .getElementById("registerName")
                .value
                .trim();

        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("registerPassword")
                .value;

        const confirm =
            document
                .getElementById("registerConfirm")
                .value;


        registerMessage.textContent = "";


        if (
            !name ||
            !email ||
            !password ||
            !confirm
        ) {

            registerMessage.textContent =
                "Preencha todos os campos.";

            return;

        }


        if (password.length < 6) {

            registerMessage.textContent =
                "A senha precisa ter pelo menos 6 caracteres.";

            return;

        }


        if (password !== confirm) {

            registerMessage.textContent =
                "As senhas não são iguais.";

            return;

        }


        registerButton.disabled = true;

        registerButton.textContent =
            "Criando conta...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signUp({

                        email,

                        password,

                        options: {

                            data: {
                                name
                            }

                        }

                    });


            if (error) {

                registerMessage.textContent =
                    error.message;

                registerButton.disabled = false;

                registerButton.textContent =
                    "Criar conta";

                return;

            }


            if (data.session) {

                registerMessage.textContent =
                    "Conta criada. Abrindo NEXUS...";

                setTimeout(() => {

                    window.location.replace(
                        "index.html"
                    );

                }, 300);

                return;

            }


            registerMessage.textContent =
                "Conta criada. Verifique seu e-mail para confirmar o cadastro.";

            registerButton.disabled = false;

            registerButton.textContent =
                "Criar conta";


        } catch (error) {

            console.error(error);

            registerMessage.textContent =
                "Ocorreu um erro ao criar a conta.";

            registerButton.disabled = false;

            registerButton.textContent =
                "Criar conta";

        }

    }
);


/* =========================
   MONITORAR AUTENTICAÇÃO
========================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "NEXUS AUTH:",
            event,
            session
                ? "SESSÃO ATIVA"
                : "SEM SESSÃO"
        );

    }
);

