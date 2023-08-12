// Import stylesheets
import './style.css';

interface Pokemon {
  name: string;
  url: string;
}

interface Ability {
  name: string;
  url: string;
}

interface PokemonDetails {
  abilities: Ability[];
}

type IState = {
  [key: string]: Ability[];
};

class State {
  private state: IState;

  constructor() {
    this.state = {};
  }

  addAbilites(name: string, abilites: Ability[]) {
    Object.assign(this.state, {
      [name]: abilites,
    });
  }

  get abilites() {
    return this.state;
  }
}

class Pokemon {
  hostElement: HTMLElement;
  dropdownTemplate: HTMLTemplateElement;
  abilitiesTemplate: HTMLTemplateElement;
  private cache: State;

  constructor(public targetType: string) {
    this.hostElement = document.getElementById('app');
    this.dropdownTemplate = document.getElementById(
      'pokemon-dropdown-template'
    ) as HTMLTemplateElement;
    this.abilitiesTemplate = document.getElementById(
      'pokemon-abilities-template'
    ) as HTMLTemplateElement;
    this.targetType = targetType;
    this.cache = new State();
  }

  private async fetchPokemons<T>(): Promise<T> {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await response.json();
    return data.results;
  }

  private async fetchPokemonsDetails<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  private renderAbilities(abilities: any) {
    const template = this.abilitiesTemplate.content.cloneNode(
      true
    ) as HTMLElement;
    const wrapperElement = template.querySelector(
      '.abilities-wrapper'
    ) as HTMLElement;
    wrapperElement.classList.add(`${this.targetType}-abilities-wrapper`);

    const list = template.querySelector('ul');
    list.id = 'pokemon-abilites';
    abilities.forEach((ability) => {
      const li = document.createElement('li');
      li.textContent = ability.ability.name;
      list.appendChild(li);
    });

    const abilitesOnDom = document.querySelector(
      `.${this.targetType}-abilities-wrapper`
    );

    if (abilitesOnDom) {
      abilitesOnDom.remove();
    }
    this.hostElement.appendChild(template);
  }

  private removeCurrentAbilities() {
    const abilitesOnDom = document.querySelector(
      `.${this.targetType}-abilities-wrapper`
    );
    abilitesOnDom.remove();
  }

  private async handlePokemonSelect(e) {
    const value = (e.target as HTMLSelectElement).value;
    if (value) {
      const name = e.target.options[e.target.selectedIndex].textContent;
      let abilities: Ability[];
      if (!this.cache.abilites[name]) {
        const details = await this.fetchPokemonsDetails<PokemonDetails>(value);
        abilities = details.abilities;
        this.cache.addAbilites(name, abilities);
      } else {
        abilities = this.cache.abilites[name];
      }

      this.renderAbilities(abilities);
    } else {
      this.removeCurrentAbilities();
    }
  }

  async render() {
    const pokemons = await this.fetchPokemons<Pokemon[]>();
    const template = this.dropdownTemplate.content.cloneNode(
      true
    ) as HTMLElement;

    const dropdown = template.querySelector('select');
    dropdown.id = 'pokemon-select';
    dropdown.addEventListener('change', this.handlePokemonSelect.bind(this));

    pokemons.forEach((pokemon) => {
      const option = document.createElement('option');
      option.textContent = pokemon.name;
      option.value = pokemon.url;
      dropdown.appendChild(option);
    });

    this.hostElement.appendChild(template);
  }
}

const pokemons = new Pokemon('main');
pokemons.render();
