const pages = document.querySelectorAll(".page");
const navigationButtons = document.querySelectorAll("[data-page]");
const backButtons = document.querySelectorAll(".backButton");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.classList.add("active");
    }

    navigationButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "codelab") {
        loadCurrentProject();
    }
}

navigationButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

backButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage("home");
    });
});

document.getElementById("menuButton").addEventListener("click", () => {
    showPage("settings");
});


/* =========================
   CODELAB
========================= */

const codeTabs = document.querySelectorAll(".codeTab");
const editors = document.querySelectorAll(".codeEditor");

codeTabs.forEach(tab => {
    tab.addEventListener("click", () => {

        const editorName = tab.dataset.editor;

        codeTabs.forEach(item => {
            item.classList.remove("active");
        });

        editors.forEach(editor => {
            editor.classList.remove("active");
        });

        tab.classList.add("active");

        document
            .getElementById(editorName + "Editor")
            .classList.add("active");
    });
});


const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");
const preview = document.getElementById("preview");

const projectName = document.getElementById("projectName");

let currentProject = "Meu Projeto";


function runCode() {

    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    const documentCode = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

<\/script>

</body>

</html>
`;

    preview.srcdoc = documentCode;
}


document.getElementById("runCode").addEventListener("click", runCode);

document
    .getElementById("saveProject")
    .addEventListener("click", saveProject);


/* =========================
   PROJETOS
========================= */

function getProjects() {

    return JSON.parse(
        localStorage.getItem("nexusProjects") || "{}"
    );

}


function saveProjects(projects) {

    localStorage.setItem(
        "nexusProjects",
        JSON.stringify(projects)
    );

}


function saveProject() {

    const name = projectName.value.trim();

    if (!name) {
        alert("Digite um nome para o projeto.");
        return;
    }

    const projects = getProjects();

    projects[name] = {
        html: htmlEditor.value,
        css: cssEditor.value,
        js: jsEditor.value,
        updated: new Date().toISOString()
    };

    saveProjects(projects);

    currentProject = name;

    updateProjectList();

    alert("Projeto salvo com sucesso.");
}


function loadProject(name) {

    const projects = getProjects();

    if (!projects[name]) {
        return;
    }

    htmlEditor.value = projects[name].html;
    cssEditor.value = projects[name].css;
    jsEditor.value = projects[name].js;

    projectName.value = name;

    currentProject = name;

    runCode();

}


function loadCurrentProject() {

    const projects = getProjects();

    if (projects[currentProject]) {
        loadProject(currentProject);
    } else {
        runCode();
    }

}


function deleteProject(name) {

    const projects = getProjects();

    if (!projects[name]) {
        return;
    }

    const confirmDelete = confirm(
        `Excluir o projeto "${name}"?`
    );

    if (!confirmDelete) {
        return;
    }

    delete projects[name];

    saveProjects(projects);

    if (currentProject === name) {

        currentProject = "Meu Projeto";

        projectName.value = "";

        htmlEditor.value = "";
        cssEditor.value = "";
        jsEditor.value = "";

        runCode();
    }

    updateProjectList();
}


function updateProjectList() {

    const list = document.getElementById("projectList");

    if (!list) {
        return;
    }

    const projects = getProjects();

    list.innerHTML = "";

    const names = Object.keys(projects);

    if (names.length === 0) {

        list.innerHTML = `
            <div class="projectEmpty">
                Nenhum projeto salvo.
            </div>
        `;

        return;
    }

    names.forEach(name => {

        const item = document.createElement("div");

        item.className = "savedProject";

        item.innerHTML = `
            <div>
                <strong>${escapeHTML(name)}</strong>
                <small>Projeto salvo localmente</small>
            </div>

            <div class="projectButtons">

                <button class="loadProject">
                    Abrir
                </button>

                <button class="deleteProject">
                    Excluir
                </button>

            </div>
        `;

        item
            .querySelector(".loadProject")
            .addEventListener("click", () => {
                loadProject(name);
            });

        item
            .querySelector(".deleteProject")
            .addEventListener("click", () => {
                deleteProject(name);
            });

        list.appendChild(item);

    });

}


function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   LIMPAR
========================= */

document.getElementById("clearCode").addEventListener("click", () => {

    const confirmClear = confirm(
        "Deseja realmente limpar o código?"
    );

    if (!confirmClear) {
        return;
    }

    htmlEditor.value = "";
    cssEditor.value = "";
    jsEditor.value = "";

    runCode();

});


/* =========================
   SALVAR AUTOMATICAMENTE
========================= */

setInterval(() => {

    const name = projectName.value.trim();

    if (!name) {
        return;
    }

    const projects = getProjects();

    projects[name] = {
        html: htmlEditor.value,
        css: cssEditor.value,
        js: jsEditor.value,
        updated: new Date().toISOString()
    };

    saveProjects(projects);

}, 5000);


/* =========================
   INICIALIZAÇÃO
========================= */

updateProjectList();

showPage("home");

runCode();


/* =========================
   BOT MANAGER
========================= */

const botName = document.getElementById("botName");
const botPlatform = document.getElementById("botPlatform");
const botLanguage = document.getElementById("botLanguage");
const botPrefix = document.getElementById("botPrefix");
const botDescription = document.getElementById("botDescription");
const botList = document.getElementById("botList");
const botCount = document.getElementById("botCount");
const createBot = document.getElementById("createBot");


function getBots() {

    return JSON.parse(
        localStorage.getItem("nexusBots") || "[]"
    );

}


function saveBots(bots) {

    localStorage.setItem(
        "nexusBots",
        JSON.stringify(bots)
    );

}


function createNewBot() {

    const name = botName.value.trim();

    if (!name) {
        alert("Digite o nome do bot.");
        return;
    }

    const bots = getBots();

    const alreadyExists = bots.some(
        bot => bot.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
        alert("Já existe um bot com esse nome.");
        return;
    }

    const bot = {

        id: Date.now(),

        name: name,

        platform: botPlatform.value.trim() || "Não definido",

        language: botLanguage.value.trim() || "Não definida",

        prefix: botPrefix.value.trim() || ".",

        description:
            botDescription.value.trim() ||
            "Sem descrição.",

        commands: [],

        created:
            new Date().toISOString()

    };

    bots.push(bot);

    saveBots(bots);

    clearBotForm();

    updateBotList();

    alert("Bot criado com sucesso.");

}


function clearBotForm() {

    botName.value = "";
    botPlatform.value = "";
    botLanguage.value = "";
    botPrefix.value = "";
    botDescription.value = "";

}


function updateBotList() {

    const bots = getBots();

    botList.innerHTML = "";

    botCount.textContent =
        bots.length === 1
            ? "1 bot"
            : `${bots.length} bots`;

    if (bots.length === 0) {

        botList.innerHTML = `
            <div class="botEmpty">
                Nenhum bot cadastrado.
            </div>
        `;

        return;
    }

    bots.forEach(bot => {

        const card = document.createElement("div");

        card.className = "botCard";

        card.innerHTML = `

            <div class="botInfo">

                <div class="botIcon">
                    🤖
                </div>

                <div>

                    <h3>${escapeHTML(bot.name)}</h3>

                    <p>
                        ${escapeHTML(bot.platform)}
                        •
                        ${escapeHTML(bot.language)}
                    </p>

                </div>

            </div>

            <div class="botDetails">

                <span>
                    Prefixo:
                    <strong>
                        ${escapeHTML(bot.prefix)}
                    </strong>
                </span>

                <span>
                    Comandos:
                    <strong>
                        ${bot.commands.length}
                    </strong>
                </span>

            </div>

            <p class="botDescription">
                ${escapeHTML(bot.description)}
            </p>

            <div class="botActions">

                <button
                    class="openBot"
                    data-id="${bot.id}"
                >
                    Abrir
                </button>

                <button
                    class="deleteBot"
                    data-id="${bot.id}"
                >
                    Excluir
                </button>

            </div>

        `;

        botList.appendChild(card);

    });


    document.querySelectorAll(".deleteBot").forEach(button => {

        button.addEventListener("click", () => {

            deleteBot(Number(button.dataset.id));

        });

    });


    document.querySelectorAll(".openBot").forEach(button => {

        button.addEventListener("click", () => {

            openBot(Number(button.dataset.id));

        });

    });

}


function deleteBot(id) {

    const bots = getBots();

    const bot = bots.find(
        item => item.id === id
    );

    if (!bot) {
        return;
    }

    const confirmed = confirm(
        `Excluir o bot "${bot.name}"?`
    );

    if (!confirmed) {
        return;
    }

    const filtered = bots.filter(
        item => item.id !== id
    );

    saveBots(filtered);

    updateBotList();

}


function openBot(id) {

    const bots = getBots();

    const bot = bots.find(
        item => item.id === id
    );

    if (!bot) {
        return;
    }

    alert(
        `BOT: ${bot.name}\n\n` +
        `Plataforma: ${bot.platform}\n` +
        `Linguagem: ${bot.language}\n` +
        `Prefixo: ${bot.prefix}\n` +
        `Comandos: ${bot.commands.length}\n\n` +
        `${bot.description}`
    );

}


createBot.addEventListener(
    "click",
    createNewBot
);


updateBotList();


/* =========================
   FERRAMENTAS
========================= */

const toolCards = document.querySelectorAll(".toolCard");
const toolPanel = document.getElementById("toolPanel");
const toolContents = document.querySelectorAll(".toolContent");

const toolTitle = document.getElementById("toolTitle");
const toolDescription = document.getElementById("toolDescription");

const toolInfo = {

    calculator: {
        title: "Calculadora",
        description: "Faça cálculos rapidamente."
    },

    password: {
        title: "Gerador de Senhas",
        description: "Crie senhas aleatórias."
    },

    counter: {
        title: "Contador de Texto",
        description: "Conte caracteres, palavras e linhas."
    },

    formatter: {
        title: "Formatador",
        description: "Transforme e organize seu texto."
    }

};


toolCards.forEach(card => {

    card.addEventListener("click", () => {

        const tool = card.dataset.tool;

        toolPanel.classList.add("active");

        toolContents.forEach(content => {
            content.classList.remove("active");
        });

        document
            .getElementById(tool + "Tool")
            .classList.add("active");

        toolTitle.textContent =
            toolInfo[tool].title;

        toolDescription.textContent =
            toolInfo[tool].description;

    });

});


document
    .getElementById("closeTool")
    .addEventListener("click", () => {

        toolPanel.classList.remove("active");

    });


/* =========================
   CALCULADORA
========================= */

document
    .getElementById("calculate")
    .addEventListener("click", () => {

        const expression =
            document.getElementById("calcDisplay").value.trim();

        const result =
            document.getElementById("calcResult");

        if (!expression) {

            result.textContent =
                "Digite uma expressão.";

            return;
        }

        try {

            if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
                throw new Error();
            }

            const value =
                Function(
                    `"use strict"; return (${expression})`
                )();

            if (!Number.isFinite(value)) {
                throw new Error();
            }

            result.textContent =
                `Resultado: ${value}`;

        } catch {

            result.textContent =
                "Expressão inválida.";

        }

    });


/* =========================
   GERADOR DE SENHAS
========================= */

const passwordLength =
    document.getElementById("passwordLength");

const passwordLengthValue =
    document.getElementById("passwordLengthValue");

passwordLength.addEventListener("input", () => {

    passwordLengthValue.textContent =
        passwordLength.value;

});


document
    .getElementById("generatePassword")
    .addEventListener("click", () => {

        const length =
            Number(passwordLength.value);

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789!@#$%&*";

        let password = "";

        const randomValues =
            new Uint32Array(length);

        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {

            password +=
                characters[
                    randomValues[i] % characters.length
                ];

        }

        document
            .getElementById("passwordResult")
            .textContent = password;

    });


/* =========================
   CONTADOR
========================= */

const counterText =
    document.getElementById("counterText");

counterText.addEventListener("input", () => {

    const text = counterText.value;

    document.getElementById("charCount")
        .textContent = text.length;

    document.getElementById("wordCount")
        .textContent =
            text.trim()
                ? text.trim().split(/\s+/).length
                : 0;

    document.getElementById("lineCount")
        .textContent =
            text
                ? text.split("\n").length
                : 0;

});


/* =========================
   FORMATADOR
========================= */

const formatterText =
    document.getElementById("formatterText");


document
    .getElementById("uppercase")
    .addEventListener("click", () => {

        formatterText.value =
            formatterText.value.toUpperCase();

    });


document
    .getElementById("lowercase")
    .addEventListener("click", () => {

        formatterText.value =
            formatterText.value.toLowerCase();

    });


document
    .getElementById("capitalize")
    .addEventListener("click", () => {

        formatterText.value =
            formatterText.value.replace(
                /\b\w/g,
                char => char.toUpperCase()
            );

    });


document
    .getElementById("removeSpaces")
    .addEventListener("click", () => {

        formatterText.value =
            formatterText.value
                .replace(/\s+/g, " ")
                .trim();

    });


/* =========================
   COPIAR
========================= */

document.querySelectorAll(".copyButton")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const targetId =
                button.dataset.copy;

            const target =
                document.getElementById(targetId);

            const text =
                target.value !== undefined
                    ? target.value
                    : target.textContent;

            try {

                await navigator.clipboard.writeText(text);

                const oldText =
                    button.textContent;

                button.textContent =
                    "Copiado!";

                setTimeout(() => {

                    button.textContent =
                        oldText;

                }, 1200);

            } catch {

                alert(
                    "Não foi possível copiar."
                );

            }

        });

    });


/* =========================
   CENTRAL DE PROJETOS
========================= */

const projectSearch =
    document.getElementById("projectSearch");

const centralCodeProjects =
    document.getElementById("centralCodeProjects");

const centralBotProjects =
    document.getElementById("centralBotProjects");


function updateCentralProjects() {

    const projects = getProjects();
    const bots = getBots();

    const search =
        projectSearch.value
            .trim()
            .toLowerCase();

    const filteredProjects =
        Object.entries(projects)
            .filter(([name]) =>
                name.toLowerCase().includes(search)
            );

    const filteredBots =
        bots.filter(bot =>
            bot.name.toLowerCase().includes(search)
        );


    document.getElementById("totalCodeProjects")
        .textContent = Object.keys(projects).length;

    document.getElementById("totalBots")
        .textContent = bots.length;

    document.getElementById("totalProjects")
        .textContent =
            Object.keys(projects).length + bots.length;


    document.getElementById("codeProjectLabel")
        .textContent =
            `${filteredProjects.length} projeto${
                filteredProjects.length === 1 ? "" : "s"
            }`;

    document.getElementById("botProjectLabel")
        .textContent =
            `${filteredBots.length} bot${
                filteredBots.length === 1 ? "" : "s"
            }`;


    centralCodeProjects.innerHTML = "";

    if (filteredProjects.length === 0) {

        centralCodeProjects.innerHTML = `
            <div class="centralEmpty">
                Nenhum projeto do CodeLab encontrado.
            </div>
        `;

    } else {

        filteredProjects.forEach(([name, project]) => {

            const card =
                document.createElement("div");

            card.className =
                "centralProjectCard";

            card.innerHTML = `

                <div class="centralProjectIcon">
                    &lt;/&gt;
                </div>

                <div class="centralProjectInfo">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span>
                        Projeto CodeLab
                    </span>

                </div>

                <div class="centralProjectActions">

                    <button
                        class="openCentralCode"
                    >
                        Abrir
                    </button>

                    <button
                        class="deleteCentralCode"
                    >
                        Excluir
                    </button>

                </div>
            `;


            card
                .querySelector(".openCentralCode")
                .addEventListener("click", () => {

                    projectName.value = name;

                    htmlEditor.value =
                        project.html;

                    cssEditor.value =
                        project.css;

                    jsEditor.value =
                        project.js;

                    runCode();

                    showPage("codelab");

                });


            card
                .querySelector(".deleteCentralCode")
                .addEventListener("click", () => {

                    deleteProject(name);

                    updateCentralProjects();

                });


            centralCodeProjects.appendChild(card);

        });

    }


    centralBotProjects.innerHTML = "";

    if (filteredBots.length === 0) {

        centralBotProjects.innerHTML = `
            <div class="centralEmpty">
                Nenhum bot encontrado.
            </div>
        `;

    } else {

        filteredBots.forEach(bot => {

            const card =
                document.createElement("div");

            card.className =
                "centralProjectCard";

            card.innerHTML = `

                <div class="centralProjectIcon botCentralIcon">
                    BOT
                </div>

                <div class="centralProjectInfo">

                    <strong>
                        ${escapeHTML(bot.name)}
                    </strong>

                    <span>
                        ${escapeHTML(bot.platform)}
                        •
                        ${escapeHTML(bot.language)}
                    </span>

                </div>

                <div class="centralProjectActions">

                    <button
                        class="openCentralBot"
                    >
                        Abrir
                    </button>

                    <button
                        class="deleteCentralBot"
                    >
                        Excluir
                    </button>

                </div>
            `;


            card
                .querySelector(".openCentralBot")
                .addEventListener("click", () => {

                    openBot(bot.id);

                });


            card
                .querySelector(".deleteCentralBot")
                .addEventListener("click", () => {

                    deleteBot(bot.id);

                    updateCentralProjects();

                });


            centralBotProjects.appendChild(card);

        });

    }

}


projectSearch.addEventListener(
    "input",
    updateCentralProjects
);


updateCentralProjects();


/* =========================
   SISTEMA DE NOTAS
========================= */

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const notesList =
    document.getElementById("notesList");

const noteSearch =
    document.getElementById("noteSearch");

const noteStatus =
    document.getElementById("noteStatus");

const newNoteButton =
    document.getElementById("newNote");

const deleteNoteButton =
    document.getElementById("deleteNote");

let currentNoteId = null;


function getNotes() {

    return JSON.parse(
        localStorage.getItem("nexusNotes") || "[]"
    );

}


function saveNotes(notes) {

    localStorage.setItem(
        "nexusNotes",
        JSON.stringify(notes)
    );

}


function createNote() {

    const notes = getNotes();

    const note = {

        id: Date.now(),

        title: "Nova Nota",

        content: "",

        updated:
            new Date().toISOString()

    };

    notes.unshift(note);

    saveNotes(notes);

    currentNoteId = note.id;

    renderNotes();

    loadNote(note.id);

}


function loadNote(id) {

    const notes = getNotes();

    const note = notes.find(
        item => item.id === id
    );

    if (!note) {
        return;
    }

    currentNoteId = id;

    noteTitle.value =
        note.title;

    noteContent.value =
        note.content;

    noteStatus.textContent =
        `Editada em ${formatDate(note.updated)}`;

    renderNotes();

}


function updateCurrentNote() {

    if (currentNoteId === null) {
        return;
    }

    const notes = getNotes();

    const note = notes.find(
        item => item.id === currentNoteId
    );

    if (!note) {
        return;
    }

    note.title =
        noteTitle.value.trim() ||
        "Sem título";

    note.content =
        noteContent.value;

    note.updated =
        new Date().toISOString();

    saveNotes(notes);

    noteStatus.textContent =
        `Salvando...`;

    setTimeout(() => {

        noteStatus.textContent =
            `Salva em ${formatDate(note.updated)}`;

    }, 400);

    renderNotes();

}


function deleteCurrentNote() {

    if (currentNoteId === null) {
        return;
    }

    const notes = getNotes();

    const note = notes.find(
        item => item.id === currentNoteId
    );

    if (!note) {
        return;
    }

    const confirmed = confirm(
        `Excluir a nota "${note.title}"?`
    );

    if (!confirmed) {
        return;
    }

    const filtered =
        notes.filter(
            item => item.id !== currentNoteId
        );

    saveNotes(filtered);

    currentNoteId = null;

    noteTitle.value = "";
    noteContent.value = "";

    noteStatus.textContent =
        "Nenhuma nota selecionada";

    renderNotes();

}


function renderNotes() {

    const notes = getNotes();

    const search =
        noteSearch.value
            .trim()
            .toLowerCase();

    const filtered =
        notes.filter(note => {

            const title =
                note.title.toLowerCase();

            const content =
                note.content.toLowerCase();

            return (
                title.includes(search) ||
                content.includes(search)
            );

        });

    notesList.innerHTML = "";

    if (filtered.length === 0) {

        notesList.innerHTML = `
            <div class="notesEmpty">
                Nenhuma nota encontrada.
            </div>
        `;

        return;
    }

    filtered.forEach(note => {

        const item =
            document.createElement("button");

        item.className =
            "noteItem";

        if (note.id === currentNoteId) {
            item.classList.add("active");
        }

        const preview =
            note.content
                .replace(/\s+/g, " ")
                .trim();

        item.innerHTML = `

            <strong>
                ${escapeHTML(note.title)}
            </strong>

            <span>
                ${
                    escapeHTML(
                        preview || "Nota vazia"
                    )
                }
            </span>

            <small>
                ${formatDate(note.updated)}
            </small>

        `;

        item.addEventListener(
            "click",
            () => loadNote(note.id)
        );

        notesList.appendChild(item);

    });

}


function formatDate(date) {

    return new Date(date).toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


newNoteButton.addEventListener(
    "click",
    createNote
);


deleteNoteButton.addEventListener(
    "click",
    deleteCurrentNote
);


noteSearch.addEventListener(
    "input",
    renderNotes
);


noteTitle.addEventListener(
    "input",
    updateCurrentNote
);


noteContent.addEventListener(
    "input",
    updateCurrentNote
);


renderNotes();


/* =========================
   CONFIGURAÇÕES
========================= */

const themeSetting =
    document.getElementById("themeSetting");

const accentColor =
    document.getElementById("accentColor");

const userName =
    document.getElementById("userName");

const nexusName =
    document.getElementById("nexusName");

const saveSettingsButton =
    document.getElementById("saveSettings");


function getSettings() {

    return JSON.parse(
        localStorage.getItem("nexusSettings") || "{}"
    );

}


function saveSettings(settings) {

    localStorage.setItem(
        "nexusSettings",
        JSON.stringify(settings)
    );

}


function applySettings() {

    const settings = getSettings();

    const theme =
        settings.theme || "dark";

    const accent =
        settings.accent || "#8b5cf6";

    document.body.dataset.theme =
        theme;

    document.documentElement
        .style
        .setProperty("--accent", accent);

    themeSetting.value =
        theme;

    accentColor.value =
        accent;

    userName.value =
        settings.userName || "";

    nexusName.value =
        settings.nexusName || "NEXUS";

    updateAppName(
        settings.nexusName || "NEXUS"
    );

}


function updateAppName(name) {

    const cleanName =
        name.trim() || "NEXUS";

    document.title =
        cleanName;

    const logo =
        document.querySelector(".topbar h1");

    if (logo) {
        logo.textContent =
            cleanName;
    }

}


themeSetting.addEventListener(
    "change",
    () => {

        const settings =
            getSettings();

        settings.theme =
            themeSetting.value;

        saveSettings(settings);

        applySettings();

    }
);


accentColor.addEventListener(
    "input",
    () => {

        document.documentElement
            .style
            .setProperty(
                "--accent",
                accentColor.value
            );

    }
);


saveSettingsButton.addEventListener(
    "click",
    () => {

        const settings = {

            theme:
                themeSetting.value,

            accent:
                accentColor.value,

            userName:
                userName.value.trim(),

            nexusName:
                nexusName.value.trim() ||
                "NEXUS"

        };

        saveSettings(settings);

        applySettings();

        alert(
            "Configurações salvas."
        );

    }
);


document
    .getElementById("clearAllData")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "ATENÇÃO: isso apagará todos os projetos, bots, notas e configurações. Continuar?"
                );

            if (!confirmed) {
                return;
            }

            localStorage.clear();

            location.reload();

        }
    );


applySettings();
