

/* =========================
   NEXUS — PROTEÇÃO DE SESSÃO
========================= */

async function protectNexus() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Erro ao verificar sessão:",
                error
            );

            window.location.href =
                "auth.html";

            return;
        }

        if (!data.session) {

            window.location.href =
                "auth.html";

            return;
        }

        console.log(
            "Sessão NEXUS encontrada."
        );

        window.NEXUS_SESSION =
            data.session;

        window.NEXUS_USER =
            data.session.user;

        const name =
            data.session.user.user_metadata?.name ||
            data.session.user.email ||
            "Usuário";

        const userElement =
            document.getElementById("currentUser");

        if (userElement) {
            userElement.textContent =
                name;
        }

    } catch (error) {

        console.error(
            "Erro de autenticação:",
            error
        );

        window.location.href =
            "auth.html";

    }

}


protectNexus();

