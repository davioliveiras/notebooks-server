# 💻 Notebooks server

Este é o back-end do projeto de organização de notebooks. As ferramentas que utilizo estão abaixo.

<div style='display:flex; gap:30px; align-items:center'>
<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png' style='width:60px'/>

<img src='https://cdn.cookielaw.org/logos/028e799e-5bb4-4f89-9ce8-1718d42d344c/22c2e2c0-3df0-4958-8672-1194370ee230/542a9b3e-88eb-4f84-95fd-b19e01352169/Logo-Prisma.png' style='width:auto; height:25px;'/>

<img src='https://upload.wikimedia.org/wikipedia/commons/0/0a/Fastify_logo.svg' style='width:auto; height:30px;'/>

<img src='https://seeklogo.com/images/J/jwt-logo-11B708E375-seeklogo.com.png' style='width:auto; height:30px;'/>

<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png' style='width:auto; height:25px;'/>

<img src='https://logopng.com.br/logos/docker-27.png' style='width:auto; height:40px;'/>
</div>

<br/>

## ⚙️ Executar o projeto
É necessário Node.js e Docker intalados, além da configuração das variáveis ambientes para acessar a AWS e o banco de dados PostgreSQL no Docker.


`npm i` para instalar as dependências. <br/>
`docker compose up` para criar o contâiner no Docker. Usuário, senha e portas podem ser alteradas no arquivo [docker-compose.yml](docker-compose.yml). <br/>
`npm run dev` para iniciar o projeto em ambiente de desenvolvimento.

## Front-end
O repositório do front-end deste projeto está <a href='https://github.com/davioliveiras/notebooks-web'>aqui</a>.

---
<a href='https://linkedin.com/in/davisilvaoliveira'>
<img src='https://www.edigitalagency.com.au/wp-content/uploads/Linkedin-logo-png.png' style='height:15px; padding-top:10px;'/>
</a>