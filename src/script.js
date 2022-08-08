const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modal-items");
const modalHead = document.getElementById("modal-head");
const btnNovaDica = document.getElementById("btn-abre-form");
const estatisticasEl = document.getElementById("estatisticas");
const pesquisa = document.getElementById("pesquisa");
const buscar = document.getElementById("buscar");
const principalEl = document.getElementById("principal");
const listaCards = document.getElementById("cards");
const main = document.getElementById("main");
let span = document.getElementsByClassName("close")[0];

span.onclick = () => escondeModal();   

const escondeModal = () => {
    modalContent.innerHTML = "";
    modal.style.display = "none"; 
    return
}

window.onclick = (event) => {    
  if (event.target == modal) {      
    modal.style.display = "none";      
  } 
  return 
}

const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };

btnNovaDica.onclick = () =>{ 
    let acao = "novaDica";      
    let formulario = criaForm(acao);
    openModal(formulario);
}

const procuraCardStorage  = (idCard) => {    
    let arrayDicas = verificaDicas();  
    const card = arrayDicas.find(el => el.id == idCard);   
    return card;    
}

const criaForm = (acao, card) => {    
    let divPai = document.createElement('div');
    divPai.classList.add('div-pai'); 
    let divInfo = document.createElement('div');
    divInfo.classList.add('div-info'); 
    let info = document.createElement('h3');    

    let id = document.createElement('input');    
    id.type = "text";
    id.hidden = true;
    id.placeholder = "id";    
    
    let titulo = document.createElement('input');
    titulo.type = "text";
    titulo.name = "titulo";
    titulo.id = "titulo";
    titulo.minLength ="8";
    titulo.maxLength = "64";
    titulo.required = true;
    titulo.placeholder = "Digite um título";    

    let linguagem = document.createElement('input');
    linguagem.type = "text";
    linguagem.name = "linguagem";
    linguagem.id = "linguagem";
    linguagem.minLength ="4";
    linguagem.maxLength = "16";
    linguagem.required = true;
    linguagem.placeholder = "Digite a linguagem";

    let categoria = document.createElement('select');
    categoria.name = "categoria";
    categoria.id = "categoria";    
    categoria.required = true;
    let opcao1 = document.createElement('option');
    opcao1.value = "FrontEnd";
    opcao1.innerText = "Front End";
    categoria.appendChild(opcao1);
    let opcao2 = document.createElement('option');
    opcao2.value = "BackEnd";
    opcao2.innerText = "Back End";
    categoria.appendChild(opcao2);
    let opcao3 = document.createElement('option');
    opcao3.value = "FullStack";
    opcao3.innerText = "Full Stack";
    categoria.appendChild(opcao3);
    let opcao4 = document.createElement('option');
    opcao4.value = "SoftSkill";
    opcao4.innerText = "Soft Skill";
    categoria.appendChild(opcao4);

    let descricao = document.createElement('textarea');
    descricao.name = "descricao";
    descricao.id = "descricao";
    descricao.cols = "30";
    descricao.rows = "8";
    descricao.minLength ="32";
    descricao.maxLength = "512";
    descricao.required = true;
    descricao.placeholder = "Descrição";

    let video = document.createElement('input');
    video.type = "url";
    video.name = "video";
    video.id = "video";
    video.placeholder = "Digite uma URL de um vídeo do Youtube";
    
    let div = document.createElement('div');
    div.classList.add('botoes-form');

    let btnLimpar = document.createElement('input');
    btnLimpar.type = "reset";    
    btnLimpar.value = "Limpar";
    btnLimpar.id = "limpar";

    let btnEnviar = document.createElement('input');
    btnEnviar.type = "submit";
    btnEnviar.id = "send";

    if(acao === "novaDica"){        
        info.innerText = "Cadastrar Dica";
    }else{         
        id.value = card.id;
        titulo.value = card.titulo;
        linguagem.value = card.linguagem;
        categoria.value = card.categoria;
        descricao.value = card.descricao;
        video.value = card.video;
        info.innerText = "Editar Dica";
    }
    
    let form = document.createElement('form');
    form.classList.add('form-modal');
    form.onsubmit = (e) => {
        e.preventDefault();        
        escondeModal();  
        let isEmpty = id.value;        
        if(!isEmpty){            
            cadastrarDicas(titulo.value, linguagem.value, categoria.value, descricao.value, video.value);
        }else{
            const cardEditado = {
                id: id.value,
                titulo: titulo.value, 
                linguagem: linguagem.value,
                categoria: categoria.value, 
                descricao: descricao.value, 
                video: video.value
            }       
            editarDicas(cardEditado);
        }        
        verificaDicas();
        renderizaEstatisticas();
        renderizaCards("Total");  
    }  
    
    let lblTitulo = document.createElement('label');    
    lblTitulo.htmlFor = "titulo";
    lblTitulo.innerText = "Título";

    let lblLinguagem = document.createElement('label');    
    lblLinguagem.htmlFor = "linguagem";
    lblLinguagem.innerText = "Linguagem";

    let lblCategoria = document.createElement('label');    
    lblCategoria.htmlFor = "categoria";
    lblCategoria.innerText = "Categoria";

    let lblDescrição = document.createElement('label');    
    lblDescrição.htmlFor = "descricao";
    lblDescrição.innerText = "Descrição";

    let lblVideo = document.createElement('label');    
    lblVideo.htmlFor = "video";
    lblVideo.innerText = "Vídeo do Youtube";   

    div.appendChild(btnLimpar);
    div.appendChild(btnEnviar);    
    form.appendChild(id);
    form.appendChild(lblTitulo);
    form.appendChild(titulo); 
    form.appendChild(lblLinguagem);   
    form.appendChild(linguagem);
    form.appendChild(lblCategoria);   
    form.appendChild(categoria);
    form.appendChild(lblDescrição);
    form.appendChild(descricao);
    form.appendChild(lblVideo);
    form.appendChild(video);
    form.appendChild(div);
    divInfo.appendChild(info);
    divPai.appendChild(divInfo);
    divPai.appendChild(form);
    
    return divPai;
}

const pesquisarPalavra = () => {
    let chavePesquisa = pesquisa.value;    
    if(chavePesquisa){
    let dicas = verificaDicas();
        let id = [];
        dicas.forEach((el,i)=>{            
            if(el.titulo.toLowerCase().includes(chavePesquisa.toLowerCase())){
                id.push(el.id);                                 
            }     
        });        
        renderizaPesquisa(id);                
    }
    return
}

buscar.addEventListener('click', ()=>{ 
    pesquisarPalavra();  
    return    
});

pesquisa.onkeyup = (e)=> {         
    if(e.keyCode == 13){
        pesquisarPalavra();    
    }else if(e.keyCode == 8 && pesquisa.value == ""){
        renderizaCards("Total");
    }
    return 
}

const modalAlerta = (info, acao, dica) => {
    let tamanhoModal = "pequeno";
    let div = document.createElement('div');
    let divBotoes = document.createElement('div');
    divBotoes.classList.add('modal-alerta-btn');
    div.classList.add('pesquisa-modal');
    let informacao = document.createElement('p');
    informacao.innerText = info;
    div.appendChild(informacao); 
    
    let btnCancelar = document.createElement('button');
    btnCancelar.id = "btn-cancela";
    btnCancelar.innerText = "Cancelar";
    btnCancelar.onclick = () => {        
        escondeModal();
        renderizaEstatisticas();
        renderizaCards("Total");  
        return
    }

    let btnConfirmar = document.createElement('button');
    btnConfirmar.id = "btn-confirma";
    btnConfirmar.innerText = "OK";
    btnConfirmar.onclick = () => {
        pesquisa.value = null;
        escondeModal();
        renderizaEstatisticas();
        renderizaCards("Total");  
        return
    }

    if(acao === "excluir"){        
        btnConfirmar.innerText = "Confirmar";
        btnConfirmar.onclick = () => {
            pesquisa.value = null;            
            escondeModal();
            excluirDica(dica);            
            return;
        }
        divBotoes.appendChild(btnCancelar);        
    }
    
    divBotoes.appendChild(btnConfirmar)    
    div.appendChild(divBotoes);
    openModal(div, tamanhoModal);
    return
}

const renderizaPesquisa = (idCard) => {    
    listaCards.innerHTML = "";         
    let dicas = verificaDicas();    
    if(!idCard.length){
        let info = "Nenhuma dica encontrada.";
        modalAlerta(info);     
    }else{              
        dicas.forEach((el)=>{            
            let j = 0;           
            while(j < idCard.length){
                if(el.id === idCard[j]){                                   
                    criaCards(el);
                }
                j++;
            }
            return           
        });        
    }
    return   
}

const openModal = (conteudo, tipo = null) => { 
    if(!tipo){        
        modalHead.style.margin = "10px auto";
    }else if(tipo === "pequeno"){        
        modalHead.style.margin = "200px auto";  
        modalHead.style.display = "flex";    
        modalHead.style.justifyContent = "center";        
    }    
    modalContent.innerHTML = "";
    modalContent.appendChild(conteudo);  
    modalContent.style.display = "flex";    
    modalContent.style.justifyContent = "center"; 
    modalContent.style.alignItems = "center";                          
    modal.style.display = "flex";
    modal.style.justifyContent = "center";    
    modal.style.alignItems = "flex-start";
    return     
}

const verificaDicas = ()=>{   
    let dicasGetStorage = localStorage.getItem('DICAS');    
    return(JSON.parse(dicasGetStorage));
}

const detalheCard = (id, vid) => {
    let urlVideo = vid.replace("watch?v=", "embed/");
    let divCardDetalhado = document.createElement('div');
    let ul = document.createElement('ul'); 
    let li = document.createElement('li');    
    let titulo = document.createElement('h2');
    let linguagem = document.createElement('p');
    let categoria = document.createElement('p');
    let descricao = document.createElement('p');
    let video = document.createElement('div');
    video.style.display = "flex";
    video.style.justifyContent = "center";
    video.style.flexDirection = "column";
    video.style.alignItems = "center";   
    video.innerHTML = /*html*/ `
    <iframe width="560" height="315" src= "${urlVideo}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`    
    let dicas = verificaDicas();  
            
    dicas.forEach((el)=>{ 
        if(el.id === id){            
            titulo.innerText = el.titulo;             
            linguagem.innerHTML = `<strong>Linguagem/Skill: </strong> ${el.linguagem}`;
            categoria.innerHTML = `<strong>Categoria: </strong> ${el.categoria}`;
            descricao.innerText = el.descricao;                              
            divCardDetalhado.appendChild(titulo)             
            li.appendChild(linguagem);            
            li.appendChild(categoria); 
            li.appendChild(descricao);                      
            li.appendChild(video);            
            ul.appendChild(li);              
            divCardDetalhado.appendChild(ul);                   
            openModal(divCardDetalhado);
        }                     
    });  
    return  
}

const criaCards = (dica) => {    
    let lista = document.createElement('li');
    lista.setAttribute("class", "cards-items");        

    let divLista = document.createElement('div');   
    divLista.setAttribute("class", "cards-lista");    
    divLista.onclick = () => {
        detalheCard(dica.id, dica.video);        
    }    

    let divBotoes = document.createElement('div');
    divBotoes.setAttribute("class", "cards-items-btn");

    let tituloEl = document.createElement('h2');        
    let linguagemEl = document.createElement('p');
    let categoriaEl = document.createElement('p');
    let descricaoEl = document.createElement('p');
    descricaoEl.classList.add("descricao");            

    let btnEditar = document.createElement('img'); 
    btnEditar.src = "./img/edit-property-48.png";  
    btnEditar.classList.add("botoes");
    btnEditar.setAttribute("id", "editar");
    btnEditar.onclick = ()=> {        
        let myCard = procuraCardStorage(dica.id);         
        let acao = "editar";      
        let formulario = criaForm(acao, myCard);        
        openModal(formulario);                     
    };

    let btnExcluir = document.createElement('img'); 
    btnExcluir.src = "./img/delete-property-48.png"; 
    btnExcluir.alt = "imagem lixeira"; 
    btnExcluir.classList.add("botoes");           
    btnExcluir.setAttribute("id", "editar");
    btnExcluir.onclick = ()=> {
        let info = "Deseja realmente excluir a dica?";
        let acao = "excluir";
        modalAlerta(info, acao, dica);
        return
    }
    
    let imgVideo = document.createElement("img");    
    imgVideo.src ="./img/video-48.png";
    imgVideo.alt = "imagem video";
    imgVideo.classList.add("botoes");   

    let btnVideo = document.createElement('a');    
    btnVideo.href = dica.video;
    btnVideo.target = "_blank";                      
    btnVideo.classList.add("img");      
    btnVideo.setAttribute("href", dica.video);          
    
    btnVideo.onclick = ()=> video(dica.id);
    btnVideo.appendChild(imgVideo);
    
    tituloEl.innerText = dica.titulo;            
    divLista.appendChild(tituloEl); 

    linguagemEl.innerHTML = `<strong>Linguagem/Skill: </strong> ${dica.linguagem}`;              
    divLista.appendChild(linguagemEl);
    categoriaEl.innerHTML = `<strong>Categoria: </strong> ${dica.categoria}`;  
    divLista.appendChild(categoriaEl);         
    descricaoEl.innerText = dica.descricao; 
    divLista.appendChild(descricaoEl);   

    btnEditar.innerText = "Editar";           
    divBotoes.appendChild(btnEditar);            
    btnExcluir.innerText = "Excluir";           
    divBotoes.appendChild(btnExcluir);

    if(dica.video){
        divBotoes.appendChild(btnVideo);
    }
    console.log(divBotoes);
    lista.appendChild(divLista); 
    lista.appendChild(divBotoes);        
    listaCards.appendChild(lista);
    return(listaCards);
}

const dicaDefault = () =>{
    let card = {        
        titulo: "Boas Vindas",
        linguagem: "*",
        categoria: "Tutorial",
        descricao: `A M1P1 Software House criou esse  Sistema de Base do Conhecimento com o objetivo de manter as dicas e padronização da programação em um único lugar de fácil acesso para todos da organização.
        Aqui você pode contribuir  com informações da área para que todos fiquem em sintonia.
        Para cadastrar uma nova dica, clique no botão "Nova Dica", no menu ao lado.
        Após a criação do primeiro card você poderá excluir este card tutorial, caso deseje.`,
        video: ""
    }
    return card;     
}

const renderizaCards = (categoria) =>{   
    listaCards.innerHTML = ""; 
    principalEl.inner = "";
    pesquisa.value = ""; 

    let dicas = verificaDicas();

    if(!dicas.length){        
        let card = dicaDefault();        
        cadastrarDicas(card.titulo, card.linguagem, card.categoria, card.descricao, card.video);
        dicas = verificaDicas();
    }
    if(categoria == "Total"){        
        dicas.forEach((el) => criaCards(el));               
    }else{        
        const result = dicas.filter((el)=> el.categoria == categoria);
        result.forEach((el) => criaCards(el));     
    }
    return     
}

const renderizaEstatisticas = () => {     
    estatisticasEl.innerHTML = "";
    let dicas = verificaDicas();    
    let qtdDicasTotal = 0;
    let qtdDicasFront = 0; 
    let qtdDicasBack = 0; 
    let qtdDicasFull = 0; 
    let qtdDicasSoft = 0; 
    
    if(dicas){
        dicas.forEach((el)=>{
            if(el.categoria === "FrontEnd"){
                qtdDicasFront++;
            }else if(el.categoria === "BackEnd"){
                qtdDicasBack++;
            }else if(el.categoria === "FullStack"){
                qtdDicasFull++;
            }else if(el.categoria === "SoftSkill"){
                qtdDicasSoft++;
            }else if(el.linguagem === "*"){
                qtdDicasTotal++;
            }
            return
        });
    }    
    
    qtdDicasTotal = qtdDicasTotal + qtdDicasFront + qtdDicasBack + qtdDicasFull + qtdDicasSoft;

    let stacks = ["FrontEnd", "BackEnd", "FullStack", "SoftSkill", "Total"];

    let divPai = document.createElement('div');  
    divPai.classList.add('estatisticas-pai');
    
    stacks.forEach((el, i)=> { 
        let div = document.createElement('div');
        div.classList.add('estatisticas-items'); 
        let tituloEl = document.createElement('h4');
        let paragrafoEl = document.createElement('p');  
         
        if(i === 0){
            div.onclick = () => renderizaCards("FrontEnd");
            tituloEl.innerText = el;
            paragrafoEl.innerText = qtdDicasFront;           
        }else if(i === 1){
            div.onclick = () => renderizaCards("BackEnd");
            tituloEl.innerText = el;
            paragrafoEl.innerText = qtdDicasBack;
        }else if(i === 2){            
            div.onclick = () => renderizaCards("FullStack");
            tituloEl.innerText = el;
            paragrafoEl.innerText = qtdDicasFull;
        }else if(i === 3){        
            div.onclick = () => renderizaCards("SoftSkill");
            tituloEl.innerText = el;
            paragrafoEl.innerText = qtdDicasSoft;  
        }else{            
            div.onclick = () => renderizaCards("Total");
            tituloEl.innerText = el;
            paragrafoEl.innerText = qtdDicasTotal;           
        }
        div.appendChild(tituloEl);
        div.appendChild(paragrafoEl); 
        divPai.appendChild(div);                                       
    });
    estatisticasEl.appendChild(divPai);          
}

const cadastrarDicas = (titulo, linguagem, categoria, descricao, video) =>{
    let dicas = JSON.parse(localStorage.getItem('DICAS') || '[]');  
    let newCard = {
        id: uuidv4(),
        titulo: titulo,
        linguagem: linguagem,
        categoria: categoria,
        descricao: descricao,
        video: video,
    }     
    dicas.push(newCard);
    localStorage.setItem("DICAS", JSON.stringify(dicas));
    if(newCard.linguagem != "*"){
        let info = "Dica cadastrada com sucesso!";
        modalAlerta(info);
    }    
    return  
}

const editarDicas = (card) =>{
    let arrayDicas = verificaDicas();
    let indexCard = arrayDicas.findIndex((item) => item.id === card.id);  
    arrayDicas.splice(indexCard, 1, card);
    localStorage.setItem("DICAS", JSON.stringify(arrayDicas));
    let info = "Dica alterada com sucesso!";
                 
    modalAlerta(info);
    
    renderizaEstatisticas();  
    renderizaCards("Total");
}

const excluirDica = (card) =>{
    let arrayDicas = verificaDicas();
    let indexCard = arrayDicas.findIndex((el) => el.id === card.id);  
    arrayDicas.splice(indexCard, 1);
    localStorage.setItem("DICAS", JSON.stringify(arrayDicas));

    let info = "Dica excluída com sucesso!";
                 
    modalAlerta(info);
    
    renderizaEstatisticas();  
    renderizaCards("Total"); 
    return   
}

renderizaEstatisticas();
renderizaCards("Total");

    
    


