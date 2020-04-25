const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.TOKEN);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter);
const { get } = require('snekfetch')

db.defaults({ histoires : [], xp: []}).write()



var bj = false;
var intro;
var cartescroupier = [];
var debut;
var player;
var nbr_joueurs;
var joueurs;
var pari;
var distribution;
var cartes = ["./cartes/Ac.gif","./cartes/Ad.gif","./cartes/Ah.gif","./cartes/As.gif",
"./cartes/2c.gif","./cartes/2d.gif","./cartes/2h.gif","./cartes/2s.gif",
"./cartes/3c.gif","./cartes/3d.gif","./cartes/3h.gif","./cartes/3s.gif",
"./cartes/4c.gif","./cartes/4d.gif","./cartes/4h.gif","./cartes/4s.gif",
"./cartes/5c.gif","./cartes/5d.gif","./cartes/5h.gif","./cartes/5s.gif",  
"./cartes/6c.gif","./cartes/6d.gif","./cartes/6h.gif","./cartes/6s.gif",
"./cartes/7c.gif","./cartes/7d.gif","./cartes/7h.gif","./cartes/7s.gif",
"./cartes/8c.gif","./cartes/8d.gif","./cartes/8h.gif","./cartes/8s.gif",
"./cartes/9c.gif","./cartes/9d.gif","./cartes/9h.gif","./cartes/9s.gif",
"./cartes/10c.gif","./cartes/10h.gif","./cartes/10h.gif","./cartes/10s.gif",
"./cartes/Jc.gif","./cartes/Jd.gif","./cartes/Jh.gif","./cartes/Js.gif",
"./cartes/Qc.gif","./cartes/Qd.gif","./cartes/Qh.gif","./cartes/Qs.gif",
"./cartes/Kc.gif","./cartes/Kd.gif","./cartes/Kh.gif","./cartes/Ks.gif"];

for (var i=0 ; i < 3 ; i++ ){
  cartes = cartes.concat(cartes)
}



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function tableau(valeur){
  if (valeur.length === undefined){
    valeur = [valeur];
    return valeur
  }else{
    return valeur
  }
}

function valeur(carte){
  if (carte == "A" || carte == "K" || carte == "J" || carte == "Q" || carte == "1"){
    if(carte == "A"){
      carte = 1.1;
    }else{
      carte = 10;
    }
  }else{
    carte = Number(carte);
  }
  return carte
}

function cleanArray(array) {
  var i, j, len = array.length, out = [], obj = {};
  for (i = 0; i < len; i++) {
    obj[array[i]] = 0;
  }
  for (j in obj) {
    out.push(Number(j));
  }
  return out;
}


function Total(tableau){
  var total = 0;
  for (var n=0; n < tableau.length ; n++){
    if (tableau[n] == 1.1){
      if (total.length === undefined){
        total = [total + 1 , total + 11];
      }else{
        let taille = total.length
        for (var nj=0; nj < taille; nj++){
          nv_valeur = total[nj] + 11;
          total.push(nv_valeur);
          total[nj]= total[nj] + 1;
        }
      }
    }else {
      if (total.length === undefined){
        total = total + tableau[n]
      }else{
        for(var ui= 0; ui < total.length; ui++){
          total[ui] = total[ui] + tableau[n]
        }
      }
    }
  }
  if (total.length === undefined){
    if (total > 21){
      return false
    }else{
      return total
    }
  }else{
    for(verif=0; verif < total.length; verif++){
      if(total[verif] > 21){
        total.splice(verif,1)
        verif = verif - 1;
      }
    }
  }
  if (total.length == 0){
    return false
  }else{
    return cleanArray(total)
  }
}

function addition(var1,var2){
  if (var1.length === undefined){ //Si c'est juste deux chiffres à additionner
    return Total([var1,var2])
  }else{
    let resultats;
    let resultatTotal=[];
    for(var i=0; i<var1.length;i++){ //On calcule total pour chaque case du tableau
      resultats = Total([var1[i],var2]);
      if(resultats.length !== undefined){ //Si on a un as il y aura un tableau qui sort donc on va séparer les valeurs
        for(var n=0; n<resultats.length; n++){
          resultatTotal.push(resultats[n]);
        }
      }else{
        if (resultats != false){
          resultatTotal.push(resultats);
        }
      }
    }
    if (resultatTotal == false || resultatTotal == []){ //Je sais pas trop les conditions pour voir si il y a défaite
      return false //IT JUST WORKS :)
    }else{
      return resultatTotal
    }
  }
}

client.on("message", async(message) => {


  var msgauthor = message.author.id
  
  if(message.content.startsWith("!ramadan")){

    var ville = message.content.slice(9)
    const { body } = await get(`https://api.pray.zone/v2/times/today.json?city=${ville}&school=3`);

    var maghreb = body.results.datetime[0].times.Maghrib;
    heure = maghreb.slice(0,2);
    minute = maghreb.slice(3,5);
    aujourdhui = new Date();
    horaire = new Date(`${aujourdhui.getMonth()+1} ${aujourdhui.getDate()} ${aujourdhui.getFullYear()} ${heure}:${minute}`)
    tempsrestant = horaire-aujourdhui;
    tempsrestant = tempsrestant/60000;
    if (tempsrestant > 0){
      heurerest = Math.trunc(tempsrestant/60)
      minrest= Math.round((tempsrestant/60 - heurerest)*60)
      message.channel.send(`Il reste ${heurerest} heures et ${minrest} minutes avant le Maghreb à ${ville}\nL'heure du maghreb est **${maghreb}** aujourd'hui`)
    }else{
      message.channel.send(`Le Maghreb est déjà passé\nSi c'était un bon bot là ça devrait sortir les horaires de dedmain mais vas-y flemme frérot aujourd'hui c'était ${maghreb} demain ça sera presque pareil va manger ou faire tarawih au lieu de rester sur discord`)
    }
  }
 
  if(message.author.bot)return;

  if(!db.get("xp").find({user : msgauthor}).value()){
      db.get("xp").push({user : msgauthor, xp: 1}).write();
  }else{
      var userxpdb = db.get("xp").filter({user : msgauthor}).find("xp").value();
      var userxp = Object.values(userxpdb)

      db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 10}).write();

      if(message.content === "!xp"){
          var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
          var xpfinal = Object.values(xp);
          var xp_embed = new Discord.RichEmbed()
              .setTitle(`Stat des XP de : ${message.author.username}`)
              .setColor('#F4D03F')
              .addField("XP", `${xpfinal[1]} xp`)
              .setFooter(`Enjoy ${'<:puteasperme:651870349004374016>'}`)
          message.channel.send({embed : xp_embed})
      }
  }

  if(message.content.includes("test")){
    await message.channel.send({embed: {fields: [{name: "at",value: "réussi"}]}})
  }

  if(message.content.startsWith("réussi")){
    await message.channel.send(cartes.length)
  }

  if(message.content.startsWith("!bj")) {
    if (bj == false) {
      intro = false;
      debut = false;
      bj = true;
      joueurs = [message.member.id];
      argent = [1000];
      await message.channel.send("Rejoignez la partie en écrivant 'join' (max 7 joueurs) \nPour commencer la partie écrivez 'start'");
    }else {
      await message.channel.send("Une partie a déjà commencé veillez attendre qu'elle se finisse pour en recommencer une autre (sah flemme de coder plusieurs parties en même temps on verra sur la V2)")
    }
  }
    if ((message.content.toLocaleLowerCase().startsWith("join")) & (Object.is(intro,false))) {
      if(joueurs.indexOf(message.member.id) == -1){
        joueurs.push(message.member.id);
        argent.push(1000);
        await message.channel.send(`${message.author.username} a rejoint la partie`)
      } else {
        await message.channel.send("Vous avez déjà rejoint la partie");
      }
      if (joueurs.length == 7){
        intro = true;
        await message.channel.send("start")
      }
    }


    if ((message.content.toLocaleLowerCase().startsWith("start")) & (Object.is(debut,false)) || (message.content.startsWith("Jeu de cartes fini remélange des cartes")) & (message.author.username == "Tatsumaki")) {
      intro = true;
      debut = true;
      player = 0;
      nbr_joueurs= joueurs.length;
      if (message.content.toLocaleLowerCase().startsWith("start")){
        await message.channel.send("La partie peut commencer");
      }
    }

    if ((message.content.startsWith("La partie peut commencer") || message.content.startsWith("Le prochain tour peut commencer") || message.content.includes("Vous avez misé")) & message.author.username == "Tatsumaki"){
      if(player < nbr_joueurs){
        pari = true
        if(player == 0){
          await message.channel.send("Faites vos mises");
          await message.channel.send({embed: {fields: [{name: "Comment faire pour miser?" ,value: "**POUR MISER TAPEZ**:\n**bet MontantLaMise**"} ]}})
          await message.channel.send(`<@${joueurs[player]}> Combien allez vous miser?\nVotre total d'argent: ${argent[player]}€`);
        }else{
          await message.channel.send(`<@${joueurs[player]}> Combien allez vous miser?\nVotre total d'argent: ${argent[player]}€`);
        }
      }else{
        await message.channel.send({embed: {fields: [{name: "Avancement de la partie",value: "Distribution des cartes"}]}});
        pari = false
        await message.channel.send("Le croupier commence par se distribuer à lui même deux cartes (dont une face cachée)")
      }
    }

    if (message.content.startsWith("bet") & pari == true){
      if(message.author.id == joueurs[player]){
        if (!isNaN(message.content.slice(4))){
          if(argent[player] < Number(message.content.slice(4))){
            await message.channel.send(`<@${joueurs[player]}> La somme que vous voulez parier est supérieur à votre total d'argent qui s'élève à ${argent[player]}€\nVeuillez réessayer avec une mise plus faible!`)
          }else{
            argent.push(Number(message.content.slice(4)));
            argent[player] = argent[player] - Number(message.content.slice(4));
            player = player + 1;
            await message.channel.send(`<@${joueurs[player-1]}> Vous avez misé ${argent[nbr_joueurs+player-1]}€`);
            
          }
        }else{
          await message.channel.send("Veuillez entrer un montant valide");
        }
      }
    }


    // if (cartes.length == 416 & debut == true){
    //   await message.channel.send("Brulage de 5 cartes")
    //   for(var brul = 0; brul<5; brul++){
    //     let a = getRandomInt(cartes.length);
    //     if(brul !=4 ){
    //       await message.channel.send({files: [cartes[a]]});
    //       cartes.splice(a,1);
    //     }else{
    //      await message.channel.send("Terminé",{files: [cartes[a]]});
    //      cartes.splice(a,1);
    //     }
    //   }
    // }

    if (message.content.startsWith("Le croupier commence par se distribuer à lui même deux cartes (dont une face cachée)") & message.author.username == "Tatsumaki"){
       cartescroupier = []
        await message.channel.send("Cartes du croupier:") //A refaire pour gérer les as (fait je crois à test)
        for(let tirage = 0; tirage < 2; tirage++){
          a = getRandomInt(cartes.length);
          if(tirage == 1){
            facecaché = cartes[a]
            carte = cartes[a].slice(9,10);
            cartescroupier.push(valeur(carte));
            cartes.splice(a,1);
            if(cartescroupier[0] == 1.1){
              await message.channel.send(`Total du croupier: **1 OU 11**`,{files: ["./cartes/carteface.jpg"]});
            }else{
              await message.channel.send(`Total du croupier: **${cartescroupier[0]}**`,{files: ["./cartes/carteface.jpg"]});
            }
            
          }else {
            carte = cartes[a].slice(9,10);
            cartescroupier.push(valeur(carte));
            await message.channel.send({files: [cartes[a]]});
            cartes.splice(a,1);
          }
        }
      for(var j=0 ; j < nbr_joueurs; j++){
        player = 0;
        cartesjoueur = [];
        a = getRandomInt(cartes.length);
        b = getRandomInt(cartes.length);
        while (b==a){
          b = getRandomInt(cartes.length);
        }
        carte1 = cartes[a].slice(9,10);
        carte2 = cartes[b].slice(9,10);
        cartesjoueur = [valeur(carte1),valeur(carte2)];
        total = Total(cartesjoueur);
        await message.channel.send(`<@${joueurs[j]}> Total: **${total}**`,{files: [cartes[a],cartes[b]]});
        joueurs.push(total);
        if(a>b){
          cartes.splice(a,1);
          cartes.splice(b,1);
        }else{
          cartes.splice(b,1);
          cartes.splice(a,1);
        }
      }
      await message.channel.send(`<@${joueurs[0]}> c'est à votre tour qu'allez vous faire?\nPour tirer une nouvelle carte tapez 'hit'\nPour rester sur votre main tapez 'stand'`);
      distribution = true;
    }
    if(message.content.startsWith("hit")){
      if (message.author.id == joueurs[player]){
        a = getRandomInt(cartes.length);
        carte = cartes[a].slice(9,10);
        carte = valeur(carte)
        joueurs[player+nbr_joueurs] = addition(joueurs[player+nbr_joueurs],carte)
        if(joueurs[player+nbr_joueurs] == false){
          await message.channel.send(`<@${joueurs[player]}> Vous avez perdu`,{files: [cartes[a]]})
          player = player + 1;
          if(player == nbr_joueurs){
            player = -1;
            await message.channel.send("Au tour du croupier");
          }else{
            await message.channel.send(`<@${joueurs[player]}> c'est à votre tour qu'allez vous faire?\nPour tirer une nouvelle carte tapez 'hit'\nPour rester sur votre main tapez 'stand'\nRappel votre total: ${joueurs[player+nbr_joueurs]}`);
          }
        }else{
          await message.channel.send(`<@${joueurs[player]}> Total: **${joueurs[player+nbr_joueurs]}**`,{files: [cartes[a]]});
        }
      }
    }

    if(message.content.startsWith("stand") & distribution == true){
      if(message.author.id == joueurs[player]){
        if(joueurs[player+nbr_joueurs].length != undefined){
          joueurs[player+nbr_joueurs] = Math.max(...joueurs[player+nbr_joueurs]);
        }
        player = player + 1;
        if(player == nbr_joueurs){
          player = -1;
          await message.channel.send("Au tour du croupier");
        }else{
          await message.channel.send(`<@${joueurs[player]}> c'est à votre tour qu'allez vous faire?\nPour tirer une nouvelle carte tapez 'hit'\nPour rester sur votre main tapez 'stand'\nRappel votre total: ${joueurs[player+nbr_joueurs]}`);
        }
      }
    }

    if(message.content.startsWith("Au tour du croupier") & message.author.username == "Tatsumaki"){
      cartescroupier = Total(cartescroupier)
      cartescroupier = tableau(cartescroupier)
      await message.channel.send(`Retournement de carte face cachée\nTotal: ${cartescroupier}`,{files: [facecaché]})

      while(Math.max(...cartescroupier) < 17 & cartescroupier[0] != false){
        a = getRandomInt(cartes.length);
        carte = valeur(cartes[a].slice(9,10)); 
        cartescroupier = addition(cartescroupier,carte);
        cartescroupier = tableau(cartescroupier)
        await message.channel.send(`Total croupier: ${cartescroupier}`,{files: [cartes[a]]});
      }
      await message.channel.send("Le croupier a fini de joueur\nVoici les résultats:")
    }

    if(message.content.startsWith("Le croupier a fini de joueur") & message.author.username == "Tatsumaki"){
      
      if(cartescroupier[0] == false){
        await message.channel.send("Le croupier a perdu tout les joueurs encore en lice ont gagnés")
        for(var ki = 0; ki < nbr_joueurs; ki++){
          if(joueurs[nbr_joueurs] == false){
            await message.channel.send(`<@${joueurs[ki]}> Vous avez perdu`);
            joueurs.splice(nbr_joueurs,1);
          }else{
            await message.channel.send(`<@${joueurs[ki]}> Vous avez gagné`);
          joueurs.splice(nbr_joueurs,1);
          }
        }
      }else{
        for(var gagnants = 0 ; gagnants < nbr_joueurs; gagnants++){
          joueurs[nbr_joueurs] = tableau(joueurs[nbr_joueurs])
          if(Math.max(...joueurs[nbr_joueurs]) > Math.max(...cartescroupier)){
            await message.channel.send(`<@${joueurs[gagnants]}> Vous avez gagné ${2*argent[nbr_joueurs]}€`);
            joueurs.splice(nbr_joueurs,1);
            argent[gagnants] = argent[gagnants] + 2*argent[nbr_joueurs];
            argent.splice(nbr_joueurs,1);
          }else{
            if(Math.max(...joueurs[nbr_joueurs]) == Math.max(...cartescroupier)){
              await message.channel.send(`<@${joueurs[gagnants]}> Egalité avec le croupier, Vous reprenez votre mise de ${argent[nbr_joueurs]}€`);
              joueurs.splice(nbr_joueurs,1);
              argent[gagnants] = argent[gagnants] + argent[nbr_joueurs];
              argent.splice(nbr_joueurs,1);
            }else{
              await message.channel.send(`<@${joueurs[gagnants]}> Vous avez perdu ${argent[nbr_joueurs]}€`);
              joueurs.splice(nbr_joueurs,1);
              argent.splice(nbr_joueurs,1);
            }
          }
        }
      }
      player = 0
      await message.channel.send("Le prochain tour peut commencer")
    }

});
