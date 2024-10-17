// PokemonController.js
import { PokemonModel } from "../models/PokemonModel.js";
import { PokemonView } from "../views/PokemonView.js";
export class PokemonController {
  constructor() {
    this.model = new PokemonModel();
    this.view = new PokemonView();

    this.pokemonsFiltered = [];
    this.newDesireList = [];

    // Bind button event
    document
      .querySelector("button")
      .addEventListener("click", () => this.init());
  }
  async init() {
    this.view.showLoading();
    try {
      await this.model.loadPokemons();
      this.view.hideLoading();
      this.view.showConsole();
      this.view.displayPokemons(this.model.getAllPokemons());
      this.bindingEvents();
    } catch (error) {
      console.error(error);
    }
  }
  async bindingEvents() {
    // Bind input filterType
    this.filterType = document.querySelector("#filtroTipo");
    this.filterType.addEventListener("keyup", () => this.filteringPokemons());

    this.filterType = document.querySelector("#filtroPeso");
    this.filterType.addEventListener("keyup", () => this.filteringPokemons());

    this.filterType = document.querySelector("#filtroPoderTotal");
    this.filterType.addEventListener("keyup", () => this.filteringPokemons());

    // Bind Añadir a Lista de deseos
    document
      .querySelector("#btnAgnadeListaDeseo")
      .addEventListener("click", this.mostrarListaDeseo.bind(this));

    // Bind Cards pokemons
    this.cardPokemons = document.querySelectorAll(".card");
    this.cardPokemons.forEach((card) => {
      card.addEventListener("click", () => this.pokemonsClicked(card.id));
    });
  }

  pokemonsClicked(cardId) {
    this.newDesireList.push(cardId);
  }

  async filteringPokemons() {
    this.pokemonsFiltered = [];
    
    const tipoValue = document.querySelector("#filtroTipo").value.toLowerCase();
    const pesoValue = document.querySelector("#filtroPeso").value;
    const poderTotalValue = document.querySelector("#filtroPoderTotal").value;
    
    this.model.pokemons.forEach((pkm) => {
    this.safePokemon = true;
    
    const tipoMatches = pkm.pkm_type.some(type => type.type.name.toLowerCase().includes(tipoValue));
    if (tipoValue && !tipoMatches) {
    this.safePokemon = false;
    }
    
    if (pesoValue && pkm.weight < pesoValue) {
    this.safePokemon = false;
    }
    
    if (poderTotalValue && pkm.attack < poderTotalValue) {
    this.safePokemon = false;
    }
    
    if (this.safePokemon) {
    this.pokemonsFiltered.push(pkm);
    }
    });
    
    this.view.displayPokemons(this.pokemonsFiltered);
    }

  mostrarListaDeseo() {
    //console.log(this.newDesireList);
    let txt = "¿Quieres añadir los siguientes Pokemons a la Lista de Deseo?";
    this.newDesireList.forEach((pkm) => {
      txt = txt + " " + pkm;
    });

    if (window.confirm(txt)) {
      // ToDo Guardar en BBDD
      console.log("Guardando nueva lista de deseo...");
    } else if (window.confirm("¿Quieres deseleccionar los pokemons?")) {
      // ToDo desmarcar pokemons

      this.newDesireList = [];
    }
  }
}
