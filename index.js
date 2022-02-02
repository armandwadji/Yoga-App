const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
let exercicesArray = [];

//Au démarrage, le tableau est vide. Il faudra donc faire du localStorage dans le but de dire au navigeur que si l'utilisateur se connecte pour la première fois, alors le exercicesArray prendra la valeur de basicArray, si c'est pas le cas alors exercicesArray prendra la valeur du tableau stocker dans le localStorage

//Pour cela on va faire une fonction qui se lance toute seule au démarrage de la page dans le but d'aller chercher des données au format JSON dans le localStorage si il y' en a, et les convertir au format JS. si non on attibut le basicArray à exercicesArray
(() => {
  if (localStorage.exercices) {
    exercicesArray = JSON.parse(localStorage.exercices);
  } else {
    exercicesArray = basicArray;
  }
})();

class Exercice {
  // Permet de gérer les minutes, secondes et images des différents exercies choisient par l'utilisateur.
  constructor() {
    this.index = 0;
    this.minutes = exercicesArray[this.index].min;
    this.seconds = 0;
  }
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds; //Permet de rajouter un zèro devant les secondes si elles sont inférieur à 10 pour une meilleur notation

    setTimeout(() => {
      // Permet de gérer le compte a rebourd et de passer a l'image suivante
      if (this.minutes === 0 && this.seconds == "00") {
        this.index++;
        this.ring();

        if (this.index < exercicesArray.length) {
          this.minutes = exercicesArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds == "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);

    //return permet d'afficher à l'écran les différentes images, et leurs temps d'éxécutions
    return (main.innerHTML = `
        <div class="exercice-container">
          <p>${this.minutes} : ${this.seconds}</p>
          <img src= "./img/${exercicesArray[this.index].pic}.png">
          <div>${this.index + 1}/${exercicesArray.length}</div>
        </div>
                            `);
  }

  ring() {
    const audio = new Audio();
    audio.src = "./ring.mp3";
    audio.play();
  }
}

// utils contient toutes les fonctions nécéssaire pour pointer les balises, mettre les minutes et les positions à jours de manière dynamique sans recharger la page
const utils = {
  //Fonction qui permet de pointer sur les balises et les attribuer des valeurs dynamiques en fonction de la page à affichée
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  //--------------------------------------

  //Fonction qui permet de mêttre les minutes du tableau exercicesArray a jours en fonction du choix de l'utilisateur
  handleEventMinutes: function () {
    document.querySelectorAll(`input[type="number"]`).forEach((input) => {
      input.addEventListener("input", (e) => {
        exercicesArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.store();
            // console.log(exercicesArray);
          }
        });
      });
    });
  },
  //----------------------------------------

  //Fonction qui permet de mêttre la position des cartes du tableau exercicesArray a jours en fonction du choix de l'utilisateur.
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0; // cette valriable nous permet de trouver la position de la carte sélectionner dans le tableau pour l'inverser avec la carte qui le précède.
        exercicesArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            [exercicesArray[position], exercicesArray[position - 1]] = [
              exercicesArray[position - 1],
              exercicesArray[position],
            ];
            // console.log(position);
            // console.log(exercicesArray);
            page.lobby();
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },
  //-----------------------------------------

  //Fonction qui permet de supprimer les cartes séléctionner par l'utilisateur.
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const newArr = exercicesArray.filter(
          (exo) => exo.pic != e.target.dataset.pic
        );
        exercicesArray = newArr;
        page.lobby();
        this.store();
        console.log(newArr);

        // let newArr = [];
        // exercicesArray.map((exo) => {
        //   if (exo.pic != e.target.dataset.pic) {
        //     newArr.push(exo);
        //   }
        // });
        // exercicesArray = newArr;
        // page.lobby();
        // this.store();
        // // console.log(exercicesArray);
      });
    });
  },
  //-----------------------------------------

  //Reboot: permet de réinitialiser la page avec toutes les cartes (button reboot)
  reboot: function () {
    exercicesArray = basicArray;
    page.lobby();
    this.store();
  },

  // Store: permet de stocker les cartes de l'utilisateur dans le localStorage en format JSON
  store: function () {
    localStorage.exercices = JSON.stringify(exercicesArray);
  },
};

//---------------------------------------------------------

const page = {
  //Fonction qui permet d'afficher la logique des exercices a faire.
  lobby: function () {
    let mapArray = exercicesArray //Permet d'incrémenter le deuxième paramètre de pageContent pour afficher les cartes de chaque exercice dans une liste ul.
      .map((exo) => {
        return `
                <li>
                    <div class= "card-header">
                        <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                        <span>min</span>  
                    </div>
                    <img src="./img/${exo.pic}.png"/>
                    <i class= "fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
                    <i class= "fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
                </li>

               `;
      })
      .join("");

    utils.pageContent(
      //Permet de donné les paramètres de la page de paramétrage de manière dynamique
      `paramétrage <i id="reboot" class= "fas fa-undo"></i> `,
      `<ul>${mapArray}</ul>`,
      `<button id="start">Commencer<i class="far fa-play-circle></i></button>`
    );

    utils.handleEventMinutes(); //mettre les minutes des cartes à jour

    utils.handleEventArrow(); //mettre la position des cartes à jour. obliger d'être dans la page.loby si non il ne va s'éxécuter qu'une seule fois.

    utils.deleteItem(); // Permet de supprimer des cartes

    reboot.addEventListener("click", () => utils.reboot()); //Permet de réinitialiser les cartes après un évènement de click. // On n'a pas eu besoin de faire un document.querySelector car les id des <buttons></buttons> ou checkbox (<label></label>) ou des  icones (<i></i>) n'en ont pas besoin

    //Start: permet de lancer la session de yoga avec les paramètres utilisateurs inscrits(button commencer)
    start.addEventListener("click", () => {
      if (exercicesArray.length == 0) {
        alert("Veuillez sélectionner au moins un exercice à faire !");
      } else {
        this.routine();
      }
    });
  },
  //------------------------------------------------------

  //Fonction qui permet de lancer la séssion routine des exercices.
  routine: function () {
    const exercice = new Exercice();
    utils.pageContent(`Routine`, exercice.updateCountdown(), null);
  },
  //---------------------------------------------------

  //Fonction qui permet de donner la fin de l'exercice
  finish: function () {
    utils.pageContent(
      `C'est terminer`,
      `<button id= "start">Recommencer</button>`,
      ` <button id ="reboot" class="btn-reboot">
            Réinitialiser<i class = "fas fa-times-circle"></i>
        </button>`
    );

    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
  },
  //------------------------------------------------------
};

page.lobby();
